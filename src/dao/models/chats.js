const mongoose = require('mongoose');
const dataBaseConnect = require('./db')

const collection = 'Chats';

const schema = new mongoose.Schema({
    user:  {
        type: String,
        required: true,
    },
    message:  {
        type: String,
        required: true,
    },
});



const chatsModel = dataBaseConnect.model(collection, schema);

module.exports = chatsModel;
