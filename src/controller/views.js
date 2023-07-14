import ProductDaoMongo from '../models/DAO/products.dao.js';

const productsDb = new ProductDaoMongo();

const renderViews = (req, res) => {
    res.render('home', { title: "Express" })
};

const renderLogin = (req, res) => {
    res.render('login');
};

const validateProfile = (req, res) => {
    if (!req.session.user) {
        res.redirect('/login');
    } else {
        const { firstname, lastname, email, age } = req.session.user;
        res.render('profile', { firstname, lastname, email, age });
    }
};

const logout = (req, res) => {
    req.session.destroy();
    res.redirect('/login');
};

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
        username: req.session.user.firstname,
        is_admin: req.session.user.admin,
    });
};

export {
    renderViews,
    renderLogin,
    validateProfile,
    logout,
    getProducts,
};