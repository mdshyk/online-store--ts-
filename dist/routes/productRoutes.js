"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const productController_1 = require("../controllers/productController");
const purchaseController_1 = require("../controllers/purchaseController");
const authController_1 = require("../controllers/authController");
const router = express_1.default.Router();
router.get('/all', (req, res, next) => {
    (0, productController_1.getAllProducts)(req, res, next);
});
router.get('/search', (req, res, next) => {
    (0, productController_1.searchProduct)(req, res, next);
});
router.get('/filter', (req, res, next) => {
    (0, productController_1.filterProduct)(req, res, next);
});
router
    .route('/')
    .get(authController_1.protect, (req, res, next) => {
    (0, productController_1.getProducts)(req, res, next);
})
    .post(authController_1.protect, (0, authController_1.restrictFor)('admin'), (req, res, next) => {
    (0, productController_1.createProduct)(req, res, next);
});
router
    .route('/:id')
    .get(authController_1.protect, (req, res, next) => {
    (0, productController_1.getProduct)(req, res, next);
})
    .patch(authController_1.protect, (req, res, next) => {
    (0, productController_1.updateProduct)(req, res, next);
})
    .delete(authController_1.protect, (req, res, next) => {
    (0, productController_1.deleteProduct)(req, res, next);
});
router
    .post('/addtocart/:id', authController_1.protect, (req, res, next) => {
    (0, purchaseController_1.addToCart)(req, res, next);
})
    .post('/purchase/:id', authController_1.protect, (req, res, next) => {
    (0, purchaseController_1.purchaseProduct)(req, res, next);
});
exports.default = router;
