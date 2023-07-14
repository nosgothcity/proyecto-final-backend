import CartsDaoMongo from '../models/DAO/carts.dao.js';
import ProductDaoMongo from '../models/DAO/products.dao.js';

const cartsDb = new CartsDaoMongo();
const productsDb = new ProductDaoMongo();

const getCartById = async (req, res) => {
    const cartId = req.params.pid;
    if(!cartId){
        return res.status(400).send({status: 'error', message: 'CartId not valid'});
    }

    const cartData = await cartsDb.modelGetCartById(cartId);
    if(cartData){
        return res.send(cartData);
    } else {
        return res.status(400).send({status: 'error', message: 'CartId not found'});
    }
};

const createCart = async (req, res) => {
    const product = req.body.product;
    const count = req.body.count;

    const date = new Date().toISOString().split('T')[0];
    const products = [];
    const addProduct = {
        date,
    };

    if(product && count && product !== ''){
        products.push({
            product,
            count,
        });
        addProduct.products = products;
    }

    const response = await cartsDb.modelCreateCart(addProduct);

    if(response){
        return res.status(200).send({status: 'done', message: 'Cart created'});
    } else {
        return res.status(400).send({status: 'error', message: 'Cart can\'t be created'});
    }
};

const addProductToCart = async (req, res) => {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    const count = req.body?.count??0;

    const products = [];
    const date = new Date().toISOString().split('T')[0];
    const addProduct = {
        date,
    };

    const cartData = await cartsDb.modelGetCartById(cartId);
    const productData = await productsDb.modelGetProductsByParameter({_id: `${productId}`});

    if(!cartData || !productData){
        return res.status(400).send({status: 'error', message: 'CartId/ProductId not found'});
    }

    if(count === 0){
        return res.status(400).send({status: 'error', message: 'Count must be more than 0'});
    }

    if(cartData.products.length > 0){
        for (const product of cartData.products) {
            products.push({
                product: product.product._id.toString(),
                count: product.count,
            });
        }    
    }

    products.push({
        product: productId,
        count,
    });

    addProduct.products = products;
    const response = await cartsDb.modelUpdateProductToCart(cartId, addProduct);

    if(response){
        return res.status(200).send({status: 'done', message: 'Cart updated'});
    } else {
        return res.status(400).send({status: 'error', message: 'service not available'});
    }
};

const deleteProductFromCart = async (req, res) => {
    const cartId = req.params.cid;
    const productId = req.params.pid;

    const products = [];
    const date = new Date().toISOString().split('T')[0];
    const addProduct = {
        date,
    };

    const cartData = await cartsDb.modelGetCartById(cartId);
    const productData = await productsDb.modelGetProductsByParameter({_id: `${productId}`});

    if(!cartData || !productData){
        return res.status(400).send({status: 'error', message: 'CartId/ProductId not found'});
    }

    const productIndex = cartData.products.findIndex(product => product.product._id.toString() === productId);

    if (productIndex === -1) {
        return res.status(400).send({status: 'error', message: 'ProductId not found in Cart'});
    }

    cartData.products.splice(productIndex, 1);
    if(cartData.products.length > 0){
        for (const product of cartData.products) {
            products.push({
                product: product.product._id.toString(),
                count: product.count,
            });
        }
    }

    addProduct.products = products;
    const response = await cartsDb.modelUpdateProductToCart(cartId, addProduct);

    if(response){
        return res.status(200).send({status: 'done', message: 'Cart updated'});
    } else {
        return res.status(400).send({status: 'error', message: 'service not available'});
    }
};

const deleteCart = async (req, res) => {
    const cartId = req.params.cid;

    const products = [];
    const date = new Date().toISOString().split('T')[0];
    const addProduct = {
        date,
    };

    const cartData = await cartsDb.modelGetCartById(cartId);

    if(!cartData){
        return res.status(400).send({status: 'error', message: 'CartId not found'});
    }

    addProduct.products = products;
    const response = await cartsDb.modelUpdateProductToCart(cartId, addProduct);

    if(response){
        return res.status(200).send({status: 'done', message: 'Removed all products from cart'});
    } else {
        return res.status(400).send({status: 'error', message: 'service not available'});
    }
};

export {
    getCartById,
    createCart,
    addProductToCart,
    deleteProductFromCart,
    deleteCart,
};