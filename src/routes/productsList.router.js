const express = require('express');
const router = express.Router();
const ProductsManagerMongo = require('../dao/controllers/products');
const UserModel = require('../dao/controllers/user')

const productsManagerMongo = new ProductsManagerMongo();
const userManagerMongo = new UserModel();

// Middleware de rutas publicas y privadas.
const privateRoute = (req, res, next) => {
    if (req.session.user) {
        next();
    } else {
        res.redirect('/login');
    }
};

const publicRoute = (req, res, next) => {
    if (!req.session.user) {
        next();
    } else {
        res.redirect('/profile');
    }
};

router.get('/list', async (req, res) => {
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

router.get('/', (req,res)=>{
    res.render('home', { title: "Express" })
});

router.get('/login', (req, res) => {
    res.render('login');
});

router.get('/profile', (req, res) => {
    if (!req.session.user) {
        res.redirect('/login');
    } else {
        const { firstname, lastname, email, age } = req.session.user;
        res.render('profile', { firstname, lastname, email, age });
    }
});

router.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/login');
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const loginUser = await userManagerMongo.getUserLogin({email, password});
    console.log('result', loginUser);
    if (!loginUser) {
        res.redirect('/productsList/login');
    } else {
        req.session.user = user;
        res.redirect('/productsList/list');
    }
});

router.post('/register', async (req,res)=>{
    const { firstname, lastname, email, age, password } = req.body;
    
    const userEx = await UserModel.findOne({email});
    if( userEx ) {
        console.error('Error, el usuario ya esta registrado');
        res.redirect('/');
    }
    try {
        const user = new UserModel({ firstname, lastname, email, age, password });
        await user.save();
        res.redirect('/login');
    } catch (error) {
        console.error('Error al registrar el usuario:', error);
        res.redirect('/');
    }
});


module.exports = router;
