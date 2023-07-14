import ProductModel from '../schemas/products.schemas.js';
import MongooseSingleton from '../dbConnect.js';

class productsDao {
    constructor() {
        const db = MongooseSingleton.getInstance();
    }

    modelGetProducts = async (limit, page, sort, dataQuery) => {
        try {
            const options = {
                page,
                limit,
                sort,
                customLabels: {
                    docs: 'payload',
                },
                lean: true,
                leanWithId: true,
            };
            const products = await ProductModel.paginate(dataQuery, options);
            return products;
        } catch (error) {
            console.error('Error al obtener los productos:', error);
            throw error;
        }
    };

    modelGetProductsByParameter = async parameter => {
        const product = await ProductModel.findOne(parameter).lean()
            .catch(err => {
                console.log('Producto no encontrado');
                return false;
            });
        return product;
    };

    modelDeleteProduct = async id => {
        const deleteProduct = await ProductModel.findByIdAndRemove(id)
            .then(response => {
                console.log('Producto eliminado');
                return true;
            })
            .catch(err => {
                console.log('Producto no encontrado');
                return false;
            });
        return deleteProduct;
    };

    modelUpdateProduct = async (id, data) => {
        const updateProduct = await ProductModel.findByIdAndUpdate(id, data, { new: true })
            .then(response => {
                console.log('Producto actualizado');
                return true;
            })
            .catch(err => {
                console.log('Producto no encontrado');
                return false;
            });
        return updateProduct;
    };
}

export default productsDao;