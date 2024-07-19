import {Request, Response, NextFunction} from 'express';
import Product from '../models/productModel';
import catchAsync from '../utils/catchAsync';
import AppError from '../utils/appError';

export const addToCart = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const decrement = req.body.quantity;
        const product = await Product.findById(req.params.id);

        if (!product) {
            return next(
                new AppError('Product does not exist', 401)
            );
        }
        if (decrement === 0) {
            return next(new AppError('Insufficient product quantity', 400));
        }

        if (product.quantity < decrement) {
            return next(new AppError('Product Out of Stock', 400));
        }

        product.quantity -= decrement;
        await product.save();

        res.status(200).json({
            status: 'success',
            data: {
                product
            }
        });
});

export const purchaseProduct = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const decrement = 1;
    const product = await Product.findById(req.params.id);

    if (!product) {
        return next(
            new AppError('Product does not exist', 401)
        );
    }

    if (product.quantity < decrement) {
        return next(new AppError('Product Out of Stock', 400));
    }

    product.quantity -= decrement;
    await product.save();

    res.status(200).json({
        status: 'success',
        data: {
            product
        }
    });
});
