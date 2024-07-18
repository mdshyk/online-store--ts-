"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const productSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: [true, 'A product must have a name']
    },
    quantity: {
        type: Number,
        required: [true, 'A product must have a quantity'],
        min: [1, 'Minimum quantity must be greater than zero'],
        max: 1000
    },
    price: {
        type: Number,
        required: [true, 'A product must have a price']
    },
    user: {
        type: String,
        ref: 'User',
        required: true
    },
    description: {
        type: String,
        trim: true
    }
});
const Product = mongoose_1.default.model('Product', productSchema);
exports.default = Product;
