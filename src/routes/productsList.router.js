const express = require('express');
const router = express.Router();
const ProductsManagerMongo = require('../dao/controllers/products');
const productsManagerMongo = new ProductsManagerMongo();

router.get('/', async (req, res) => {
    const limit = req.query.limit??10;
    const page = req.query.page??1;
    const query = req.query.query??null;
    const sort = req.query.sort??null;
    let sortType;
    let queryData;

    if(sort && sort === 'desc'){
        sortType = {price: -1};
    }else if(sort && sort === 'asc'){
        sortType = {price: 1};
    }else{
        sortType = {};
    }

    if(query){
        try{
            queryData = JSON.parse(query);
        } catch (error) {
            return res.status(400).send({status: 'error', message: 'Bad Request.'});
        }
    } else {
        queryData = {};
    }

    const products = await productsManagerMongo.getProducts(limit, page, sortType, queryData);
    if(products.payload.length > 0){
        products.status = 'success';
        if(products.prevPage){
            products.prevPage = `http://localhost:8080/productsList?page=${products.prevPage}&limit=${limit}`;
        }
        if(products.nextPage){
            products.nextPage = `http://localhost:8080/productsList?page=${products.nextPage}&limit=${limit}`;
        }
    } else {
        products.status = 'error';
        products.prevPage = null;
        products.nextPage = null;
    }

    res.render('productsList', {
        products: products.payload,
        hasNextPage: products.hasNextPage,
        hasPrevPage: products.hasPrevPage,
        nextPage: products.nextPage,
        prevPage: products.prevPage,
    });
});

module.exports = router;
