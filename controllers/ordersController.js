
const UserModel = require('../models/userModel');
const OrderModel = require('../models/orderModel');
const AccountModel = require('../models/accountModel');
const TransactionModel = require('../models/transactionModel');
const  rabbit  = require('../controllers/rabbitMqController');
const { v4: uuidv4 } = require('uuid'); 
require('dotenv').config();


/* создать заказ */

exports.create = async (req, res) => {
    const { price } = req.body;
    const  userId  =req.user.id;
    
    if (!userId || !price) {
      return res.status(400).json({ message: 'userId и price обязательны.' });
    }
  
    try {           
      const transaction_type = 'WITHDRAWAL';      
      const referenceId  = uuidv4();     
      const account = await AccountModel.findByUserId( userId, price);  // получили счет пользователя
      const transactionId = (account.account_id ? await TransactionModel.create(account.account_id, transaction_type, price, referenceId) : null);  // создали транзакцию в статусе PENDING
      const orderId = (transactionId ? await OrderModel.create(userId, price, referenceId) : null);    // создали заказ и связали с транзакцией через referenceId
      var debetAccountResult =false;
        try {
            if(!(orderId && account && transactionId && referenceId))  throw(' ошибка при работе с билинговым центром!')    
                if(!(account.balance >= price))  throw(' недостаток средств на балансе!')
                debetAccountResult = await AccountModel.withdraw(price, account.account_id)
                if(!(debetAccountResult)) throw(' ошибка списания средств со счета')                          
                if(!(await TransactionModel.success(referenceId))) throw('ошибка завершения транзакции');
                if(!(await OrderModel.success(orderId))) throw('ошибка подверждания заказа.');       
                    try {  // отправляем сообщение в сервис нотификаций
                            let conn  = new rabbit.ProducerAMQP();
                            await conn.orderNotyficationSend( orderId ,(e)=>{
                                throw(e); // получили ошибку - выбросили exception
                             }
                             );
                        } catch (err) {
                      console.log('rabbit.SendMessage.orderNotyficationSend =>'+err); // exception обработали тут
                    }
                return res.status(201).json({ message: 'Заказ успешно создан.',  order: orderId });
            } catch (error) {                
                await TransactionModel.failed(referenceId);
                await OrderModel.failed(orderId);  
                if(debetAccountResult) { // если списание произошло - формируем откатную транзакцию, возвращаем деньги клиенту
                  const _transactionId = await TransactionModel.return(referenceId);  // создали транзакцию  return   
                  const _transaction =  await TransactionModel.findById(_transactionId); // получили  транзакцию
                  if(_transaction) { // если транзакция успешно создана
                    if(!(await TransactionModel.success(_transaction.reference_id)) 
                        || !(await AccountModel.return(_transaction.reference_id)) 
                          || !(await TransactionModel.success(_transaction.reference_id))) throw('ошибка завершения транзакции');
                  }
                }
            return res.status(400).json({ message: error });
        }         
      } catch (error) {
      console.error('Ошибка при создании заказа: ', error);       
      return res.status(500).json({ message: 'Внутренняя ошибка сервера.' });
    }
  };
  
  
  exports.order = async (req, res) => {
    const { id } = req.params;
    if (!id ) {
      return res.status(400).json({ message: 'id обязателен.' });
    }  
    try {
      const orders = await OrderModel.findByOrderId(id);
      if (orders) {
        return res.status(200).json(         // вернули обьект заказа
             orders[0]
        );
      } else
          return res.status(204).json(); // вернул пустой обьект
    } catch (error) {
      console.error('Ошибка при создании заказа:', error);
      return res.status(500).json({ message: 'Внутренняя ошибка сервера.' });
    }
  };

  exports.orders = async (req, res) => {
    const { id } =req.user;
    if (!id ) {
      return res.status(401).json({ message: 'Неавторизован' });
    }  
    try {
      const orders = await OrderModel.findByUserId(id);
      if (orders.length > 0) {
        return res.status(200).json(orders); //вернули список
      } else
          return res.status(204).json(orders); // вернул пустой список
    } catch (error) {
      console.error('Ошибка при создании заказа:', error);
      return res.status(500).json({ message: 'Внутренняя ошибка сервера.' });
    }
  };


  exports.status = async (req, res) => {
    const { status, id } = req.body;
    if (!id ) {
      return res.status(400).json({ message: 'id обязателен.' });
    }  
    try {
      const orders = await OrderModel.status(status, id);
      if (orders.length > 0) {
        return res.status(200).json(orders); //вернули список
      } else
          return res.status(204).json(orders); // вернул пустой список
    } catch (error) {
      console.error('Ошибка при создании заказа:', error);
      return res.status(500).json({ message: 'Внутренняя ошибка сервера.' });
    }
  };