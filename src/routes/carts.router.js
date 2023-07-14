import { Router } from 'express';
import {getCartById, createCart, addProductToCart, deleteProductFromCart, deleteCart} from '../controller/carts.js';

const router = Router();

router.get('/:pid', getCartById);

router.post('/', createCart);

router.put('/:cid/product/:pid', addProductToCart);

router.delete('/:cid/product/:pid', deleteProductFromCart);

router.delete('/:cid', deleteCart);

export default router;
