"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const tokenSchema = new mongoose_1.default.Schema({
    token: {
        type: String,
        required: true
    },
    user: {
        type: String,
        ref: 'user',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: process.env.JWT_EXPIRES_IN
    }
});
const Token = mongoose_1.default.model('Token', tokenSchema);
exports.default = Token;
