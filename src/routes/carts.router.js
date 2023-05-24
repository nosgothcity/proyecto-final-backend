const Router = require('express');
const router = Router();
const CartManager = require('../dao/controllers/carts');
const ProductsManagerMongo = require('../dao/controllers/products');
const cartsManager = new CartManager();
const productsManagerMongo = new ProductsManagerMongo();

router.get('/:pid', async (req, res) => {
    const cartId = req.params.pid;
    if(!cartId){
        return res.status(400).send({status: 'error', message: 'CartId not valid'});
    }

    const cartData = await cartsManager.getCartById(cartId);
    if(cartData){
        return res.send(cartData);
    } else {
        return res.status(400).send({status: 'error', message: 'CartId not found'});
    }
});

router.post('/', async (req, res) => {
    const response = await cartsManager.createCart({products: 'none'});

    if(response){
        return res.status(200).send({status: 'done', message: 'Cart created'});
    } else {
        return res.status(400).send({status: 'error', message: 'Cart can\'t be created'});
    }
});

router.put('/:cid/product/:pid', async (req, res) => {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    const quantity = req.body?.quantity??0;
    const product = [];
    const cartData = await cartsManager.getCartById(cartId);
    const productData = await productsManagerMongo.getProductsByParameter({_id: `${productId}`});

    if(!cartData || !productData){
        return res.status(400).send({status: 'error', message: 'CartId/ProductId not found'});
    }

    product.push({
        productId: `${productId}`,
        quantity: quantity,
    });

    const data = JSON.stringify(product);
    const response = await cartsManager.addProductToCart(cartId, {products: data});

    if(response){
        return res.status(200).send({status: 'done', message: 'Cart updated'});
    } else {
        return res.status(400).send({status: 'error', message: 'service not available'});
    }
});

module.exports = router;
