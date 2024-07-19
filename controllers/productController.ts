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
            return res.status(404).json({
                status: 'fail',
                message: 'Product does not exist'
            });
        }
        if (product.user !== req.user._id.toString()) {
            return res.status(401).json({
                status: 'fail',
                message: 'You are restricted'
            });
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
        return res.status(401).json({
            status: 'fail',
            message: 'You are restricted or the product does not exist'
        });
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
        return res.status(401).json({
            status: 'fail',
            message: 'You are restricted or the product does not exist'
        });
    }

    // Send the response
    res.status(204).json({
        status: 'success',
        message: 'Product successfully deleted',
        data: {}
    });
});

export const searchProduct = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const productName: string = req.body.name;
    
    const regex: RegExp = new RegExp(productName, "i");

    const products: typeof Product [] = await Product.find({ name: { $regex: regex } });


    if (products.length > 0) {
        return res.status(200).json({
            status: 'success',
            results: products.length,
            data: {
                products
            }
        });
    }

    return res.status(404).json({
        status: 'fail',
        message: 'No products found.'
    });
});

export const filterProduct = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const products: ProductObj [] = await Product.find({
        price: { $gte: req.body.minPrice, $lte: req.body.maxPrice }
    });

    if (req.body.maxPrice < req.body.minPrice) {
        return res.status(400).json({
            status: 'fail',
            message: 'Max price must be greater than min price'
        }); 
    }


    if (products.length > 0) {
        return res.status(200).json({
            status: 'success',
            results: products.length,
            data: {
                products
            }
        });
    }

    return res.status(404).json({
        status: 'fail',
        message: 'No products found in the specified price range.'
    });
});