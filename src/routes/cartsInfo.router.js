const express = require('express');
const router = express.Router();
const CartManager = require('../dao/controllers/carts');
const cartsManager = new CartManager();

router.get('/:cid', async (req, res) => {
    const cartId = req.params.cid;
    if(!cartId){
        return res.status(400).send({status: 'error', message: 'CartId not valid'});
    }

    const cartData = await cartsManager.getCartById(cartId);
    res.render('carts', {
        cartData: cartData,
    });
});

module.exports = router;
