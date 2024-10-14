const express = require('express');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/auth');
const profileRoutes = require('./routes/profile');
const ordersRoutes = require('./routes/orders');
const accountRoutes = require('./routes/account');

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


app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
