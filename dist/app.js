"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const productRoutes_1 = __importDefault(require("./routes/productRoutes"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
// ROUTES
app.use('/api/v1/products', productRoutes_1.default);
app.use('/api/v1/users', userRoutes_1.default);
app.all('*', (req, res, next) => {
    res.status(404).json({
        status: 'FAIL',
        message: `Can't find ${req.originalUrl} on this server.`
    });
});
exports.default = app;
