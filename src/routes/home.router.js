const express = require('express');
const router = express.Router();
const ProductsManagerMongo = require('../dao/controllers/products');
const productsManagerMongo = new ProductsManagerMongo();

router.get('/', async (req, res) => {
    const allProducts = await productsManagerMongo.getProducts();
    res.render('home', {
        products: allProducts,
    });
});

module.exports = router;
