const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const dataBaseConnect = require('./db')

const collection = 'Carts';

const schema = new mongoose.Schema({
    products: {
        type: [
            {
                product: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Products',    
                },
                count: {
                    type: Number,
                },
            }
        ],
        default: [],
    },
    date: {
        type: String,
        required: true,
    }
});

schema.plugin(mongoosePaginate);
const cartsModel = dataBaseConnect.model(collection, schema);

module.exports = cartsModel;
