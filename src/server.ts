import mongoose from 'mongoose';
import dotenv from 'dotenv';

import app from './app';

dotenv.config({path: './config.env'});

const DB = (process.env.DATABASE || '')
    .replace('<PASSWORD>', process.env.DATABASE_PASSWORD || '');

    mongoose.connect(DB).then(() => {
        console.log('DB connection successful!');
    }).catch((err: Error) => {
        console.error('DB connection error:', err);
    });

const port = process.env.PORT || 5000;
app.listen (port, () => {
    console.log(`App running on port ${port}`);
});
