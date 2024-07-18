"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProduct = exports.updateProduct = exports.createProduct = exports.getProduct = exports.getProducts = exports.getAllProducts = void 0;
const productModel_1 = __importDefault(require("../models/productModel"));
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
const appError_1 = __importDefault(require("../utils/appError"));
exports.getAllProducts = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const products = yield productModel_1.default.find();
    if (!products || products.length === 0) {
        return res.status(404).json({
            status: 'fail',
            message: 'No products found.'
        });
    }
    res.status(200).json({
        status: 'success',
        results: products.length,
        data: {
            products
        }
    });
}));
exports.getProducts = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const products = yield productModel_1.default.find({
        user: (_a = req.user) === null || _a === void 0 ? void 0 : _a._id
    });
    if (!products || products.length === 0) {
        return res.status(404).json({
            status: 'fail',
            message: 'No products found for this user.'
        });
    }
    res.status(200).json({
        status: 'success',
        results: products.length,
        data: {
            products
        }
    });
}));
exports.getProduct = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const product = yield productModel_1.default.findById(req.params.id);
    if (!product) {
        return next(new appError_1.default('Product does not exist', 404));
    }
    if (product.user !== req.user._id.toString()) {
        return next(new appError_1.default('You are restricted', 401));
    }
    res.status(200).json({
        status: 'success',
        data: {
            product
        }
    });
}));
exports.createProduct = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    req.body.user = req.user._id;
    const newProduct = yield productModel_1.default.create(req.body);
    res.status(201).json({
        status: 'success',
        data: {
            product: newProduct
        }
    });
}));
exports.updateProduct = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const product = yield productModel_1.default.findOne({ _id: req.params.id, user: req.user._id });
    if (!product) {
        return next(new appError_1.default('You are restricted or the product does not exist', 401));
    }
    Object.assign(product, req.body);
    yield product.save();
    res.status(200).json({
        status: 'success',
        message: 'Product updated successfully',
        data: {
            product
        },
    });
}));
exports.deleteProduct = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const product = yield productModel_1.default.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!product) {
        return next(new appError_1.default('You are restricted or the product does not exist', 401));
    }
    // Send the response
    res.status(204).json({
        status: 'success',
        message: 'Product successfully deleted',
        data: {}
    });
}));
