"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userController_1 = require("./../controllers/userController");
const authController_1 = require("./../controllers/authController");
const router = express_1.default.Router();
router.post('/signup', (req, res, next) => {
    (0, authController_1.signup)(req, res, next);
});
router.post('/login', (req, res, next) => {
    (0, authController_1.login)(req, res, next);
});
router.post('/logout', (req, res, next) => {
    (0, authController_1.logout)(req, res, next);
});
router.get('/', authController_1.protect, (0, authController_1.restrictTo)('admin'), (req, res, next) => {
    (0, userController_1.getAllUsers)(req, res, next);
});
router
    .route('/:id')
    .get(authController_1.protect, (req, res, next) => {
    (0, userController_1.getUser)(req, res, next);
})
    .patch(authController_1.protect, (req, res, next) => {
    (0, userController_1.updateUser)(req, res, next);
})
    .delete(authController_1.protect, (req, res, next) => {
    (0, userController_1.deleteUser)(req, res, next);
});
exports.default = router;
