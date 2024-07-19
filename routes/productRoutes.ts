import express, {Application, NextFunction} from 'express';
import { getAllProducts, getProducts, getProduct, createProduct, updateProduct, deleteProduct, searchProduct, filterProduct } from '../controllers/productController';
import { addToCart, purchaseProduct } from '../controllers/purchaseController';
import { protect, restrictFor } from '../controllers/authController';

const router = express.Router();

router.get('/all', (req, res, next) => {
    getAllProducts(req, res, next);
});

router.get('/search', (req, res, next) => {
    searchProduct(req, res, next);
});

router.get('/filter', (req, res, next) => {
    filterProduct(req, res, next);
});

router
    .route('/')
    .get(protect, (req, res, next) => {
        getProducts(req, res, next);
    })
    .post(protect, restrictFor('admin'), (req, res, next) => {
        createProduct(req, res, next);
    });

router
    .route('/:id')
    .get(protect, (req, res, next) => {
        getProduct(req, res, next);
    })
    .patch(protect, (req, res, next) => {
        updateProduct(req, res, next);
    })
    .delete(protect, (req, res, next) => {
        deleteProduct(req, res, next);
    });

router
    .post('/addtocart/:id', protect, (req, res, next) => {
        addToCart(req, res, next);
    })
    .post('/purchase/:id', protect, (req, res, next) => {
        purchaseProduct(req, res, next);
    });

export default router;