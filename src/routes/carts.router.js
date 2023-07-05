import { Router } from 'express';
import CartsModel from '../models/carts.model.js';
import ProductModel from '../models/products.model.js';

const router = Router();

const createCart = async data => {
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

const getCartById = async cartId => {
    const product = await CartsModel.findById(cartId).populate('products.product').lean()
        .catch(err => {
            console.log('Carro no encontrado');
            return false;
        });
    return product;
};

const updateProductToCart = async (id, data) => {
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

const getProductsByParameter = async parameter => {
    const product = await ProductModel.findOne(parameter).lean()
        .catch(err => {
            console.log('Producto no encontrado');
            return false;
        });
    return product;
};

/**
 * ROUTERS
 */

router.get('/:pid', async (req, res) => {
    const cartId = req.params.pid;
    if(!cartId){
        return res.status(400).send({status: 'error', message: 'CartId not valid'});
    }

    const cartData = await getCartById(cartId);
    if(cartData){
        return res.send(cartData);
    } else {
        return res.status(400).send({status: 'error', message: 'CartId not found'});
    }
});

router.post('/', async (req, res) => {
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

    const response = await createCart(addProduct);

    if(response){
        return res.status(200).send({status: 'done', message: 'Cart created'});
    } else {
        return res.status(400).send({status: 'error', message: 'Cart can\'t be created'});
    }
});

router.put('/:cid/product/:pid', async (req, res) => {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    const count = req.body?.count??0;

    const products = [];
    const date = new Date().toISOString().split('T')[0];
    const addProduct = {
        date,
    };

    const cartData = await getCartById(cartId);
    const productData = await getProductsByParameter({_id: `${productId}`});

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
    const response = await updateProductToCart(cartId, addProduct);

    if(response){
        return res.status(200).send({status: 'done', message: 'Cart updated'});
    } else {
        return res.status(400).send({status: 'error', message: 'service not available'});
    }
});

router.delete('/:cid/product/:pid', async (req, res) => {
    const cartId = req.params.cid;
    const productId = req.params.pid;

    const products = [];
    const date = new Date().toISOString().split('T')[0];
    const addProduct = {
        date,
    };

    const cartData = await getCartById(cartId);
    const productData = await getProductsByParameter({_id: `${productId}`});

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
    const response = await updateProductToCart(cartId, addProduct);

    if(response){
        return res.status(200).send({status: 'done', message: 'Cart updated'});
    } else {
        return res.status(400).send({status: 'error', message: 'service not available'});
    }
});

router.delete('/:cid', async (req, res) => {
    const cartId = req.params.cid;

    const products = [];
    const date = new Date().toISOString().split('T')[0];
    const addProduct = {
        date,
    };

    const cartData = await getCartById(cartId);

    if(!cartData){
        return res.status(400).send({status: 'error', message: 'CartId not found'});
    }

    addProduct.products = products;
    const response = await updateProductToCart(cartId, addProduct);

    if(response){
        return res.status(200).send({status: 'done', message: 'Removed all products from cart'});
    } else {
        return res.status(400).send({status: 'error', message: 'service not available'});
    }
});

export default router;
