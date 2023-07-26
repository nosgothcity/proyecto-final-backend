import CartsModel from '../schemas/carts.schemas.js';
import MongooseSingleton from '../dbConnect.js';

class cartsDao {
    constructor() {
        const db = MongooseSingleton.getInstance();
    }

    modelGetCartById = async cartId => {
        const product = await CartsModel.findById(cartId).populate('products.product').lean()
            .catch(err => {
                console.log('Carro no encontrado');
                return false;
            });
        return product;
    };

    modelCreateCart = async data => {
        const result = await CartsModel.create(data)
        .then(response => {
            console.log('Carro creado');
            return true;
        })
        .catch(err => {
            console.log('Carro no creado');
            return false;
        });
        return result;
    };

    modelUpdateProductToCart = async (id, data) => {
        const updateCart = await CartsModel.findByIdAndUpdate(id, data, { new: true })
            .then(response => {
                console.log('Carro actualizado');
                return true;
            })
            .catch(err => {
                console.log('Carro no encontrado');
                return false;
            });
        return updateCart;
    };

    modelDeleteCompleteCart = async cartId => {
        const deleteCompleteCart = await CartsModel.findByIdAndRemove(cartId)
            .then(response => {
                console.log('Carro eliminado');
                return true;
            })
            .catch(err => {
                console.log('Carro no eliminado');
                return false;
            });
        return deleteCompleteCart;
    };
};

export default cartsDao;