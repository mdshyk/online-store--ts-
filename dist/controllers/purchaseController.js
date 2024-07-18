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
exports.purchaseProduct = exports.addToCart = void 0;
const productModel_1 = __importDefault(require("../models/productModel"));
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
const appError_1 = __importDefault(require("../utils/appError"));
exports.addToCart = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const decrement = req.body.quantity;
    const product = yield productModel_1.default.findById(req.params.id);
    if (!product) {
        return next(new appError_1.default('Product does not exist', 401));
    }
    if (decrement === 0) {
        return next(new appError_1.default('Insufficient product quantity', 400));
    }
    if (product.quantity < decrement) {
        return next(new appError_1.default('Product Out of Stock', 400));
    }
    product.quantity -= decrement;
    yield product.save();
    res.status(200).json({
        status: 'success',
        data: {
            product
        }
    });
}));
exports.purchaseProduct = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const decrement = 1;
    const product = yield productModel_1.default.findById(req.params.id);
    if (!product) {
        return next(new appError_1.default('Product does not exist', 401));
    }
    if (product.quantity < decrement) {
        return next(new appError_1.default('Product Out of Stock', 400));
    }
    product.quantity -= decrement;
    yield product.save();
    res.status(200).json({
        status: 'success',
        data: {
            product
        }
    });
}));
