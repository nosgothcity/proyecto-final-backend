import { Router } from 'express';
import UserModel from '../models/user.model.js';
import ProductModel from '../models/products.model.js';
import passport from 'passport';

const router = Router();

const getProducts = async (limit, page, sort, dataQuery) => {
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

const getProductsByParameter = async parameter => {
    const product = await ProductModel.findOne(parameter).lean()
        .catch(err => {
            console.log('Producto no encontrado');
            return false;
        });
    return product;
};

const createProduct = async product => {
    const result = await ProductModel.create(product);
    return result;
};

const deleteProduct = async id => {
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

const updateProduct = async (id, data) => {
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

/**
 * ROUTERS
 */

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

    const products = await getProducts(limit, page, sortType, queryData);
    if(products.payload.length > 0){
        products.status = 'success';
        if(products.prevPage){
            products.prevPage = `http://localhost:8080/api/products?page=${products.prevPage}`
        }
        if(products.nextPage){
            products.nextPage = `http://localhost:8080/api/products?page=${products.nextPage}`
        }
    } else {
        products.status = 'error';
        products.prevPage = null;
        products.nextPage = null;
    }

    return res.status(200).send(products);
});

router.post('/', async (req, res) => {
    console.log(req.body);
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

    const checkProduct = await getProductsByParameter({code: `${code}`});

    if(!checkProduct){
        const result = await createProduct(product);
        const productId = result[0]._id.toString();
        res.status(200).send({ success: "Product created", status: 'done', productId });
    } else {
        return res.status(400).send({ error: "Product already exist..." });
    }
});

router.delete('/:pid', async (req, res) => {
    const id = req.params.pid;
    if(!id){
        return res.status(400).send({status: 'error', message: 'Product Id not valid'});
    }

    const response = await deleteProduct(id);

    if(response){
        return res.status(200).send({status: 'done', message: 'Product deleted'});
    } else {
        return res.status(400).send({status: 'error', message: 'Product not found'});
    }
});

router.put('/:pid', async (req, res) => {
    const data = req.body;
    const id = req.params.pid;

    if(!id){
        return res.status(400).send({status: 'error', message: 'Product Id not valid'});
    }
    const response = await updateProduct(id, data);

    if(response){
        return res.status(200).send({status: 'done', message: 'Product updated'});
    } else {
        return res.status(400).send({status: 'error', message: 'Product not found'});
    }
});

export default router;
