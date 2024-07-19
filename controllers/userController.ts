import { Request, Response, NextFunction } from 'express';
import User, { UserObj } from './../models/userModel';
import catchAsync from './../utils/catchAsync';
import AppError from './../utils/appError';

export const getAllUsers = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const users: UserObj[] = await User.find();

        res.status(200).json({
            status: 'success',
            results: users.length,
            data: {
                users
            }
        });
});

export const getUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const user: UserObj | null = await User.findById(req.params.id);

    if (!user) {
        return next(new AppError('User not found', 404));
    }

    res.status(200).json({
        status: 'success',
        data: {
            user
        }
    });
});


export const updateUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const user: UserObj | null = await User.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    if (!user) {
        return next(new AppError('User not found', 404));
    }

    res.status(200).json({
        status:'success',
        message: '<Updated user here...>',
        data: {
            user
        },
    });
});

export const deleteUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const user: UserObj | null = await User.findByIdAndDelete(req.params.id);

    if (!user) {
        return next(new AppError('User not found', 404));
    }

    res.status(204).json({
        status:'success',
        message: '<User Deleted...>',
        data: {
        }
    });
});