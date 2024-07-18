import { Request, Response, NextFunction } from 'express';
import Product, { ProductObj } from '../models/productModel';
import catchAsync from '../utils/catchAsync';
import AppError from '../utils/appError';

interface AuthenticatedRequest extends Request {
    user?: any; // Adjust this type according to your actual user model
}

export const getAllProducts = catchAsync(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const products: ProductObj[] = await Product.find();

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
});

export const getProducts = catchAsync(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        const products: ProductObj[] = await Product.find(
            {
                user : req.user?._id
            }
        );

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
});

export const getProduct = catchAsync(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return next(
                new AppError('Product does not exist', 404)
            );
        }
        if (product.user !== req.user._id.toString()) {
            return next(new AppError('You are restricted', 401));
        }
        res.status(200).json({
            status: 'success',
            data: {
                product
            }
        });
});


export const createProduct = catchAsync(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    req.body.user=req.user._id; 
    const newProduct = await Product.create(req.body);

        res.status(201).json({
            status:'success',
            data: {
                product: newProduct
            }
        });
});

export const updateProduct = catchAsync(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const product = await Product.findOne({ _id: req.params.id, user: req.user._id });

    if (!product) {
        return next(
            new AppError('You are restricted or the product does not exist', 401)
        );
    }

    Object.assign(product, req.body);
    await product.save();

    res.status(200).json({
        status: 'success',
        message: 'Product updated successfully',
        data: {
            product
        },
    });
});

export const deleteProduct = catchAsync(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const product = await Product.findOneAndDelete({ _id: req.params.id, user: req.user._id });

    if (!product) {
        return next(
            new AppError('You are restricted or the product does not exist', 401)
        );
    }

    // Send the response
    res.status(204).json({
        status: 'success',
        message: 'Product successfully deleted',
        data: {}
    });
});