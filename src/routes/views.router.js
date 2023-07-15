import { Router } from 'express';
import passport from 'passport';
import { renderViews, renderLogin, validateProfile, logout, getProducts } from '../controller/views.js';
import { privateRoute, publicRoute } from '../controller/restricted.routes.js';

const router = Router();

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
