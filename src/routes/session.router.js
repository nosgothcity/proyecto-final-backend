import { Router } from 'express';
import passport from 'passport';

const router = Router();

const privateRoute = (req, res, next) => {
    if (req.session.user) {
        next();
    } else {
        res.redirect('/login');
    }
};

router.get('/github', passport.authenticate('github', {scope: ['user:email']}), async (req, res) => {});

router.get('/githubcallback', passport.authenticate('github', {failureRedirect: '/login'}), async (req, res) => {
    req.session.user = req.user;
    res.redirect('/profile');
});

router.get('/current', privateRoute, (req, res) => {
    if (!req.session.user) {
        return res.status(404).send({message: 'not logged in'});
    } else {
        const { firstname, lastname, email, age } = req.session.user;
        return res.status(200).send({firstname, lastname, email});
    }
});

export default router;
