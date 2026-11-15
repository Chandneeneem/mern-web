
import express from 'express';
import {
    createProduct,
    getProducts,
    // getProductById,
    updateProduct,
    deleteProduct
} from '../controllers/productController';

import authMiddleware from '../middleware/authMiddleware';
import upload from '../middleware/uploadMiddleware';

const router = express.Router();

router.use(authMiddleware);

router.post('/', upload.single('image'), createProduct);

router.get('/', getProducts);

// router.post('/details', getProductById);

router.put('/update', upload.single('image'), updateProduct);

router.delete('/delete', deleteProduct);

export default router;
