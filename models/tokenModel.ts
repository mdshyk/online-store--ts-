import mongoose, {Document, Model, Schema} from 'mongoose';

export interface TokenObj extends Document {
    token: string;
    user: string;
    createdAt: Date;
}

const tokenSchema: Schema<TokenObj> = new mongoose.Schema({
    token: {
        type: String,
        required: true
    },
    user: {
        type: String,
        ref: 'user',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: process.env.JWT_EXPIRES_IN
    }
});

const Token: Model<TokenObj> = mongoose.model<TokenObj>('Token', tokenSchema);

export default Token;