const mongoose = require('mongoose');
// coderhouse316
mongoose.connect(`mongodb+srv://coderhouse:coderhouse316@ecommerce.ovm7ngz.mongodb.net/?retryWrites=true&w=majority`, { dbName: 'ecommerce' });
const dataBaseConnect = mongoose.connection;

dataBaseConnect.on('error', console.error.bind(console, 'Error to connect MongoDB:'));
dataBaseConnect.once('open', () => {
  console.log('Connection succesfully to  MongoDB');
});

module.exports = dataBaseConnect;
