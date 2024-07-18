import mongoose, {Document, Model, Schema} from 'mongoose';

export interface ProductObj extends Document {
    name: string;
    quantity: number;
    price: number;
    user: string;
    description: string;
}

const productSchema:Schema<ProductObj> = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'A product must have a name']
    },
    quantity: {
        type: Number,
        required: [true, 'A product must have a quantity'],
        min: [1, 'Minimum quantity must be greater than zero'],
        max: 1000
    },
    price: {
        type: Number,
        required: [true, 'A product must have a price']
    },
    user: {
        type: String,
        ref: 'User',
        required: true
    },
    description: {
        type: String,
        trim: true
      }
});

const Product: Model<ProductObj> = mongoose.model<ProductObj>('Product', productSchema);

export default Product;