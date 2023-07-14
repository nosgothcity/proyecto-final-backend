import { Router } from 'express';
import passport from 'passport';
import { renderViews, renderLogin, validateProfile, logout, getProducts } from '../controller/views.js';

const router = Router();

// Middleware para validar rutas privadas y publicas
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

router.get('/', publicRoute, renderViews);

router.get('/profile', privateRoute, validateProfile);

router.get('/logout', privateRoute, logout);

router.get('/productsList', privateRoute, getProducts);

router.get('/login', publicRoute, renderLogin);

/**
 * Login con passport
 */

router.post('/register', 
    passport.authenticate('register', {
        successRedirect: '/login',
        failureRedirect: '/',
        failureFlash: true,
    }),
);

router.post('/login',
    passport.authenticate('login', {failureRedirect: '/login',}), async (req, res) => {
        if(!req.user){
            return res.status(400).send({status: "error", error: "Credenciales incorrectas"});
        }
        req.session.user = req.user;
        res.redirect('/profile');
    }
);

export default router;
