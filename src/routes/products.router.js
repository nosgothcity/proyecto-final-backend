const express = require('express');
const router = express.Router();
const io = require('socket.io')();

const ProductsManagerMongo = require('../dao/controllers/products');
const productsManagerMongo = new ProductsManagerMongo();

router.get('/', async (req, res) => {
    let products;
    const limit = parseInt(req.query.limit, 10);
    if(!limit || limit < 0 || isNaN(limit)){
        products = await productsManagerMongo.getProductsWithLimit(limit);
    } else {
        products = await productsManagerMongo.getProducts();
    }

    res.status(200).send(products);
});

router.get('/:pid', async (req, res) => {
    const productId = req.params.pid;
    if(!productId){
        return res.status(400).send({status: 'error', message: 'Invalid parameter...'});
    }

    const product = await productsManagerMongo.getProductsByParameter({_id: `${productId}`});
    if(product){
        return res.send(product);
    } else {
        return res.status(400).send({status: 'error', message: 'service not available'});
    }
});

router.post('/', async (req, res) => {
    const newProduct = req.body;
    const product = [];
    const title = newProduct?.title??'';
    const description = newProduct?.description??'';
    const code = newProduct?.code??'';
    const price = newProduct?.price??0;
    const stock = newProduct?.stock??0;
    const category = newProduct?.category??'';

    if(title.length === 0 || description.length === 0 || code.length === 0 || price === 0 || stock === 0 || category.length === 0){
        return res.status(400).send({ error: "Incomplete values" });
    }

    product.push({
        title       : newProduct.title,
        description : newProduct.description,
        code        : newProduct.code,
        price       : newProduct.price,
        status      : true,
        stock       : newProduct.stock,
        category    : newProduct.category,
        thumbnail   : newProduct.thumbnail??'none',
    });

    const checkProduct = await productsManagerMongo.getProductsByParameter({code: `${code}`});

    if(!checkProduct){
        productsManagerMongo.createProduct(product);
        res.status(200).send({ success: "Product created" });
    } else {
        return res.status(400).send({ error: "Product already exist..." });
    }
});

router.put('/:pid', async (req, res) => {
    const data = req.body;
    const id = req.params.pid;

    if(!id){
        return res.status(400).send({status: 'error', message: 'Product Id not valid'});
    }
    const response = await productsManagerMongo.updateProduct(id, data);

    if(response){
        return res.status(200).send({status: 'done', message: 'Product updated'});
    } else {
        return res.status(400).send({status: 'error', message: 'Product not found'});
    }
});

router.delete('/:pid', async (req, res) => {
    const id = req.params.pid;
    if(!id){
        return res.status(400).send({status: 'error', message: 'Product Id not valid'});
    }

    const response = await productsManagerMongo.deleteProduct(id);

    if(response){
        return res.status(200).send({status: 'done', message: 'Product deleted'});
    } else {
        return res.status(400).send({status: 'error', message: 'Product not found'});
    }
});

module.exports = router;
