import { Router } from 'express';
import { getProducts, createProducts, deleteProduct, updateProduct } from '../controller/products.js';

const router = Router();

router.get('/', getProducts);

router.post('/', createProducts);

router.delete('/:pid', deleteProduct);

router.put('/:pid', updateProduct);

export default router;
