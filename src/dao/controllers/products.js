const productsModel = require('../models/products');

class ProductsManagerMongo {
    constructor() {}

    async createProduct(product) {
        const result = await productsModel.create(product);
        return result;
    }

    async getProducts() {
        try {
            const products = await productsModel.find({}).lean();
            return  products;
        } catch (error) {
            console.error('Error al obtener los productos:', error);
            throw error;
        }
    }

    async getProductsWithLimit(limit) {
        try {
            const products = await productsModel.find().limit(parseInt(limit, 10)).lean();
            return  products;
        } catch (error) {
            console.error('Error al obtener los productos:', error);
            throw error;
        }
    }

    async getProductsByParameter(parameter) {
        const product = await productsModel.findOne(parameter).lean()
            .catch(err => {
                console.log('Producto no encontrado');
                return false;
            });
        return product;
    }

    async updateProduct(id, data){
        const updateProduct = await productsModel.findByIdAndUpdate(id, data, { new: true })
            .then(response => {
                console.log('Producto actualizado');
                return true;
            })
            .catch(err => {
                console.log('Producto no encontrado');
                return false;
            });
        return updateProduct;
    }

    async deleteProduct(id){
        const deleteProduct = await productsModel.findByIdAndRemove(id)
            .then(response => {
                console.log('Producto eliminado');
                return true;
            })
            .catch(err => {
                console.log('Producto no encontrado');
                return false;
            });
        return deleteProduct;
    }
}

module.exports = ProductsManagerMongo;
