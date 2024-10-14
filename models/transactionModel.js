const db = require('../config');
const { v4: uuidv4 } = require('uuid'); // Убедитесь, что установлен uuid версии 8
require('dotenv').config();

 /* найти по referency_id ттранзакции */
 exports.findByReferenceId = (id) => {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM mydb.transactions WHERE reference_id = ?';
      db.query(sql, [id], (err, result) => {
        (err)
        ? reject(err)
        : resolve((result[0] != undefined ? result[0]: null));
      });
    });
  };

   /* найти по id ттранзакции */
 exports.findById = (id) => {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM mydb.transactions WHERE transaction_id = ?';
      db.query(sql, [id], (err, result) => {
        (err)
        ? reject(err)
        : resolve((result[0] != undefined ? result[0]: null));
      });
    });
  };

   /* найти все транзакции по счету */
 exports.findByAccountId = (id) => {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM mydb.transactions WHERE account_id = ?';
      db.query(sql, [id], (err, result) => {
        (err)
        ? reject(err)
        : resolve((result? result: null));
      });
    });
  };

     /* создать транзакцию  (ENUM('DEPOSIT', 'WITHDRAWAL')  */
 exports.create = (account_id, transaction_type, amount, reference_id) => {
    return new Promise((resolve, reject) => {
      const sql = `INSERT INTO transactions (account_id, transaction_type, amount, reference_id) VALUES (?, ?, ?, ?)`;
      db.query(sql, [account_id, transaction_type, amount, reference_id], (err, result) => {
        (err)
        ? reject(err)
        : resolve(result.insertId != undefined ? result.insertId: null);
      });
    });
  };

       /* создать транзакцию 'RETURN' - возврат  */
 exports.return = (referenceId) => {
    return new Promise( async(resolve, reject) => {        
        const transaction = await exports.findByReferenceId(referenceId); // получили данные откатываемой транзакции, создаем новую транзакцию - возврат
        const returnReferenceId  = uuidv4();     
        const sql = `INSERT INTO transactions (account_id, transaction_type, status, amount, reference_id) VALUES (?, ?, ?, ?, ?)`;
        db.query(sql, [transaction.account_id, 'RETURN','PENDING', transaction.amount, returnReferenceId], (err, result) => {
          (err)
          ? reject(err)
          : resolve(result.insertId != undefined ? result.insertId: null);
        });
      });
    };
  

      /* обновить статус транзакции (ENUM('PENDING', 'SUCCESS', 'FAILED'))  */
 exports.success = (reference_id) => {
    return new Promise((resolve, reject) => {
      const sql = `UPDATE transactions SET status = 'SUCCESS', updated_at = CURRENT_TIMESTAMP WHERE reference_id = ?`;
      db.query(sql, [reference_id], (err, result) => {
        (err)
        ? reject(err)
        : resolve(result.affectedRows > 0 ? result.affectedRows : null); 
      });
    });
  };

        /* обновить статус транзакции (ENUM('PENDING', 'SUCCESS', 'FAILED'))  */
 exports.failed = (reference_id) => {
    return new Promise((resolve, reject) => {
      const sql = `UPDATE transactions SET status = 'FAILED', updated_at = CURRENT_TIMESTAMP WHERE reference_id = ?`;
      db.query(sql, [reference_id], (err, result) => {
        (err)
        ? reject(err)
        : resolve(result.affectedRows > 0 ? result.affectedRows : null); 
      });
    });
  };
  

