const express = require('express');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/auth');

const app = express();
app.use(bodyParser.json());
app.use(function(request, response, next){
  console.log('test');  
  next();
});
app.use('/api', authRoutes);
app.use('/api', profileRoutes);
app.use('/api', ordersRoutes);
app.use('/api', accountRoutes);
// app.use('/api', warehouseRoutes);
app.use('/api', basketRoutes);
app.use('/api', deliveryRoutes);
app.use('/',function(request, response) { // проверка что сервис жив
  response.status(200).send('OK')
 }
);


app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
