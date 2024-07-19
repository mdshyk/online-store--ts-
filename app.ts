import express, {Application} from 'express';

import productRouter from './routes/productRoutes';
import userRouter from './routes/userRoutes';

const app: Application = express();

app.use(express.json());

// ROUTES
app.use('/api/v1/products', productRouter);
app.use('/api/v1/users', userRouter);

app.all('*', (req, res, next) => {
    res.status(404).json({
        status: 'FAIL',
        message: `Can't find ${req.originalUrl} on this server.`
    });
});

export default app;