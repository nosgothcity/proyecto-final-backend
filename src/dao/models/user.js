const mongoose = require('mongoose');
const dataBaseConnect = require('./db')

const collection = 'User';

const schema = mongoose.Schema({
    firstname: String,
    lastname: String,
    email: String,
    age: Number,
    password: String
});

const userModel = dataBaseConnect.model(collection, schema);

module.exports = userModel;
