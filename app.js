const express = require('express');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/auth');
const profileRoutes = require('./routes/profile');
const ordersRoutes = require('./routes/orders');
const accountRoutes = require('./routes/account');
const warehouseRoutes = require('./routes/warehouse');
const basketRoutes = require('./routes/basket');
const deliveryRoutes = require('./routes/delivery');

const app = express();
app.use(bodyParser.json());
app.use(function(request, response, next){
  console.log('test');  
  next();
});
app.use('/api', authRoutes);
app.use('/',function(request, response) { // проверка что сервис жив
  response.status(200).send('OK')
 }
);


app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
