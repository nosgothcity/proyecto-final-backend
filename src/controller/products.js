import ProductDaoMongo from '../models/DAO/products.dao.js';

const productsDb = new ProductDaoMongo();

const getProducts = async (req, res) => {
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

    const products = await productsDb.modelGetProducts(limit, page, sortType, queryData);
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
};

const createProducts = async (req, res) => {
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

    const checkProduct = await productsDb.modelGetProductsByParameter({code: `${code}`});

    if(!checkProduct){
        const result = await createProduct(product);
        const productId = result[0]._id.toString();
        res.status(200).send({ success: "Product created", status: 'done', productId });
    } else {
        return res.status(400).send({ error: "Product already exist..." });
    }
};

const deleteProduct = async (req, res) => {
    const id = req.params.pid;
    if(!id){
        return res.status(400).send({status: 'error', message: 'Product Id not valid'});
    }

    const response = await productsDb.modelDeleteProduct(id);

    if(response){
        return res.status(200).send({status: 'done', message: 'Product deleted'});
    } else {
        return res.status(400).send({status: 'error', message: 'Product not found'});
    }
};

const updateProduct = async (req, res) => {
    const data = req.body;
    const id = req.params.pid;

    if(!id){
        return res.status(400).send({status: 'error', message: 'Product Id not valid'});
    }
    const response = await productsDb.modelUpdateProduct(id, data);

    if(response){
        return res.status(200).send({status: 'done', message: 'Product updated'});
    } else {
        return res.status(400).send({status: 'error', message: 'Product not found'});
    }
};

export {
    getProducts,
    createProducts,
    deleteProduct,
    updateProduct,
};