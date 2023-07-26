import { Router } from 'express';
import { getProducts, createProducts, deleteProduct, updateProduct, getProductByCode } from '../controller/products.js';

const router = Router();

router.get('/', getProducts);

router.post('/', createProducts);

router.delete('/:pid', deleteProduct);

router.put('/:pid', updateProduct);

router.get('/:pcode', getProductByCode);

export default router;
