const mongoose = require('mongoose');
const dataBaseConnect = require('./db')

const collection = 'Carts';

const schema = new mongoose.Schema({
    products:  {
        type: String,
        required: true,
    },
});

// schema.statics.createProduct = async function (product, req) {
//     try {
//         const newProduct = new this(product);
//         const result = await newProduct.save();
//         return result;
//     } catch (error) {
//         console.error('Error al crear usuario:', error);
//         throw error;
//     }
// };

const cartsModel = dataBaseConnect.model(collection, schema);

module.exports = cartsModel;
