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
exports.restrictFor = exports.restrictTo = exports.protect = exports.logout = exports.login = exports.signup = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const userModel_1 = __importDefault(require("../models/userModel"));
const tokenModel_1 = __importDefault(require("../models/tokenModel"));
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
const appError_1 = __importDefault(require("../utils/appError"));
const signToken = (userObj) => {
    return jsonwebtoken_1.default.sign({ userObj, createdAt: Date.now() }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });
};
exports.signup = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const newUser = yield userModel_1.default.create(req.body);
    res.status(201).json({
        status: 'User created',
        token: signToken(newUser),
        data: {
            user: newUser
        }
    });
}));
exports.login = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    if (!email || !password) {
        return next(new appError_1.default('Please provide email and password!', 400));
    }
    const user = yield userModel_1.default.findOne({ email });
    // console.log(user);
    if (!user || !(yield user.correctPassword(password, user.password))) {
        return next(new appError_1.default('Incorrect email or password', 401));
    }
    yield tokenModel_1.default.deleteMany({ user: user._id });
    const token = signToken(user);
    yield tokenModel_1.default.create({ token, user: user._id });
    const decoded = jsonwebtoken_1.default.decode(token);
    res.status(200).json({
        status: 'success',
        token,
        id: user._id,
        createdAt: new Date(decoded.createdAt),
    });
}));
exports.logout = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    let token;
    if ((_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }
    if (!token) {
        return next(new appError_1.default('No token provided', 401));
    }
    yield tokenModel_1.default.findOneAndDelete({ token });
    res.status(200).json({
        status: 'success',
        message: 'User logged out successfully'
    });
}));
exports.protect = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    let token;
    if ((_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }
    if (!token) {
        return next(new appError_1.default('Authorization token not valid', 401));
    }
    const storedToken = yield tokenModel_1.default.findOne({ token });
    if (!storedToken) {
        return next(new appError_1.default('Token is expired or invalid', 401));
    }
    jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return next(new appError_1.default('Token is expired or invalid', 401));
        }
        req.user = decoded.userObj;
        next();
    });
}));
const restrictTo = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(new appError_1.default('You do not have permission to perform this action.', 403));
        }
        next();
    };
};
exports.restrictTo = restrictTo;
const restrictFor = (...roles) => {
    return (req, res, next) => {
        if (roles.includes(req.user.role)) {
            return next(new appError_1.default('You do not have permission to perform this action.', 403));
        }
        next();
    };
};
exports.restrictFor = restrictFor;
