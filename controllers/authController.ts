import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User, {UserObj} from '../models/userModel';
import Token from '../models/tokenModel';
import catchAsync from '../utils/catchAsync';
import AppError from '../utils/appError';

interface AuthenticatedRequest extends Request {
    user?: any;
}

interface DecodedUser {
    userObj: UserObj;
    createdAt: number;
}

const signToken = (userObj: UserObj): string => {
    return jwt.sign({ userObj, createdAt: Date.now() }, process.env.JWT_SECRET as string, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });
}

export const signup = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const newUser = await User.create(req.body);

    res.status(201).json({
        status: 'User created',
        token: signToken(newUser),
        data: {
            user: newUser
        }
    });
});

export const login = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return next(new AppError('Please provide email and password!', 400));
    }

    const user = await User.findOne({ email });
    // console.log(user);

    if(!user || !(await user.correctPassword(password, user.password))) {
        return next(new AppError('Incorrect email or password', 401));
    }

    await Token.deleteMany({ user: user._id});

    const token = signToken(user);

    await Token.create({ token, user: user._id});

    const decoded = jwt.decode(token) as { userObj: UserObj; createdAt: number };
     
    res.status(200).json({
        status: 'success',
        token,
        id: user._id,
        createdAt: new Date(decoded.createdAt),
    });
});

export const logout = catchAsync(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    let token;

    if (req.headers.authorization?.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        } 

    if (!token) {
        return next(new AppError('No token provided', 401));
    }

    await Token.findOneAndDelete({ token });
    
    res.status(200).json({
        status:'success',
        message: 'User logged out successfully'
    });
});

export const protect = catchAsync(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    let token;

    if (req.headers.authorization?.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        } 

    if (!token) {
        return next(new AppError('Authorization token not valid', 401));
    }

    const storedToken = await Token.findOne({ token });

    if (!storedToken) {
        return next(new AppError('Token is expired or invalid', 401));
    }    

    jwt.verify(token, process.env.JWT_SECRET as string, (err, decoded) => {
        if (err) {
            return next(new AppError('Token is expired or invalid', 401));
        }
        req.user = (decoded as DecodedUser).userObj;
        next();
    });
});

 export const restrictTo = (...roles: string[]) => {
    return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        if (!roles.includes(req.user.role)) {
            return next(
                new AppError('You do not have permission to perform this action.', 403)
            );
        }
        next();
    };
 }

 export const restrictFor = (...roles: string[]) => {
    return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        if (roles.includes(req.user.role)) {
            return next(
                new AppError('You do not have permission to perform this action.', 403)
            );
        }
        next();
    };
 }