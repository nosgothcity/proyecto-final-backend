const Router = require('express');
const router = Router();
const CartManager = require('../functions/CartManager');
const cartsManager = new CartManager();


router.get('/:pid', async (req, res) => {
    const cartId = req.params.pid;
    if(!cartId){
        return res.status(400).send({status: 'error', message: 'CartId not found'});
    }

    const cartData = await cartsManager.getCartById(cartId);
    if(cartData){
        return res.send(cartData);
    } else {
        return res.status(400).send({status: 'error', message: 'CartId not found'});
    }
});

router.post('/', async (req, res) => {
    const response = await cartsManager.newCart();

    if(response){
        if(response.status === 'error'){
            return res.status(400).send({status: response.status, message: response.message});
        }
        return res.send({status: response.status, message: response.message});
    } else {
        return res.send({status: 'error', message: 'service not available'});
    }
});

router.post('/:cid/product/:pid', async (req, res) => {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    if(!cartId || !productId){
        return res.status(400).send({status: 'error', message: 'CartId/ProductId not found'});
    }

    const response = await cartsManager.addProductToCart(cartId, productId);

    if(response){
        if(response.status === 'error'){
            return res.status(400).send({status: response.status, message: response.message});
        }
        return res.send({status: response.status, message: response.message});
    } else {
        return res.send({status: 'error', message: 'service not available'});
    }
});

module.exports = router;
