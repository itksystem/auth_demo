const express = require('express');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/auth');
const profileRoutes = require('./routes/profile');

const app = express();
app.use(bodyParser.json());
app.use(function(request, response, next){
  console.log('test');  
  next();
});
app.use('/api', authRoutes);
app.use('/api', profileRoutes);


app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
