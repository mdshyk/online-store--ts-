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
exports.deleteUser = exports.updateUser = exports.getUser = exports.getAllUsers = void 0;
const userModel_1 = __importDefault(require("./../models/userModel"));
const catchAsync_1 = __importDefault(require("./../utils/catchAsync"));
const appError_1 = __importDefault(require("./../utils/appError"));
exports.getAllUsers = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield userModel_1.default.find();
    res.status(200).json({
        status: 'success',
        results: users.length,
        data: {
            users
        }
    });
}));
exports.getUser = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield userModel_1.default.findById(req.params.id);
    if (!user) {
        return next(new appError_1.default('User not found', 404));
    }
    res.status(200).json({
        status: 'success',
        data: {
            user
        }
    });
}));
exports.updateUser = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield userModel_1.default.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });
    if (!user) {
        return next(new appError_1.default('User not found', 404));
    }
    res.status(200).json({
        status: 'success',
        message: '<Updated user here...>',
        data: {
            user
        },
    });
}));
exports.deleteUser = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield userModel_1.default.findByIdAndDelete(req.params.id);
    if (!user) {
        return next(new appError_1.default('User not found', 404));
    }
    res.status(204).json({
        status: 'success',
        message: '<User Deleted...>',
        data: {}
    });
}));
