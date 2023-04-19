const Router = require('express');
const router = Router();
const ProductManager = require('../functions/ProductManager');
const productsManager = new ProductManager();


router.get('/', async (req, res) => {
    let allProducts = await productsManager.getProducts();
    const limit = parseInt(req.query.limit, 10);

    if(!limit || limit < 0 || isNaN(limit) || limit > allProducts.length){
        return res.send(allProducts);
    }

    allProducts.length = limit;
    res.send(allProducts);
});

router.get('/:pid', async (req, res) => {
    const productId = req.params.pid;
    if(!productId){
        return res.status(400).send({status: 'error', message: 'Product Id not valid'});
    }

    const product = await productsManager.getProductById(productId);
    if(product){
        return res.send(product);
    } else {
        return res.status(400).send({status: 'error', message: 'service not available'});
    }
});

router.post('/', async (req, res) => {
    const newProduct = req.body;
    const response = await productsManager.addProduct(newProduct);

    if(response){
        if(response.status === 'error'){
            return res.status(400).send({status: response.status, message: response.message});
        }
        return res.send({status: response.status, message: response.message});
    } else {
        return res.send({status: 'error', message: 'service not available'});
    }
});

router.put('/:pid', async (req, res) => {
    const product = req.body;
    const id = req.params.pid;
    if(!id){
        return res.status(400).send({status: 'error', message: 'Product Id not valid'});
    }

    const response = await productsManager.updateProduct(id, product);

    if(response){
        if(response.status === 'error'){
            return res.status(400).send({status: response.status, message: response.message});
        }
        return res.send({status: response.status, message: response.message});
    } else {
        return res.send({status: 'error', message: 'service not available'});
    }
});

router.delete('/:pid', async (req, res) => {
    const id = req.params.pid;
    if(!id){
        return res.status(400).send({status: 'error', message: 'Product Id not valid'});
    }

    const response = await productsManager.deleteProduct(id);

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
