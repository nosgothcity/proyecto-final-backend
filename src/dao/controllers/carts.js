const cartsModel = require('../models/carts');

class CartsManagerMongo {
    constructor() {}

    async createCart(cart) {
        const result = await cartsModel.create(cart)
        .then(response => {
            console.log('Carro creado');
            return true;
        })
        .catch(err => {
            console.log('Carro no creado');
            return false;
        });
        return result;
    }

    async getCartById(cartId) {
        const product = await cartsModel.findById(cartId).lean()
            .catch(err => {
                console.log('Carro no encontrado');
                return false;
            });
        return product;
    }

    async addProductToCart(id, data){
        const updateCart = await cartsModel.findByIdAndUpdate(id, data, { new: true })
            .then(response => {
                console.log('Carro actualizado');
                return true;
            })
            .catch(err => {
                console.log('Carro no encontrado');
                return false;
            });
        return updateCart;
    }
}

module.exports = CartsManagerMongo;
