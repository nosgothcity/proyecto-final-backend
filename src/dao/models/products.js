const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const dataBaseConnect = require('./db');

const collection = 'Products';

const schema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description:  {
        type: String,
        required: true
    },
    code: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    status: {
        type: Boolean,
        required: true
    },
    stock: {
        type: Number,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    thumbnail:  {
        type: String,
        required: true
    },
});

schema.plugin(mongoosePaginate);
schema.statics.createProduct = async function (product, req) {
    try {
        const newProduct = new this(product);
        const result = await newProduct.save();
        return result;
    } catch (error) {
        console.error('Error al crear usuario:', error);
        throw error;
    }
};

const productsModel = dataBaseConnect.model(collection, schema);

module.exports = productsModel;
