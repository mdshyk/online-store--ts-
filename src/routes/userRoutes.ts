import express, {Application, NextFunction} from 'express';
import {getAllUsers, getUser, updateUser, deleteUser} from './../controllers/userController';
import {signup, login, logout, protect, restrictTo} from './../controllers/authController'

const router = express.Router();

router.post('/signup', (req, res, next) => {
    signup(req, res, next);
});
router.post('/login', (req, res, next) => {
    login(req, res, next);
});
router.post('/logout', (req, res, next) => {
    logout(req, res, next);
});

router.get('/', protect, restrictTo('admin'), (req, res, next) => {
    getAllUsers(req, res, next);
});

router
    .route('/:id')
    .get(protect, (req, res, next) => {
        getUser(req, res, next);
    })
    .patch(protect, (req, res, next) => {
        updateUser(req, res, next);
    })
    .delete(protect, (req, res, next) => {
        deleteUser(req, res, next);
    });

export default router;