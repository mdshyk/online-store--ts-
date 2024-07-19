import mongoose, {Document, Model, Schema} from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcryptjs';

export interface UserObj extends Document {
    name: string;
    email: string;
    type: 'private' | 'commercial' | 'admin';
    password: string;
    passwordConfirm: string | undefined;
    correctPassword(candidatePassword: string, userPassword: string): Promise<boolean>;
}

const userSchema: Schema<UserObj> = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'A user must have a name']
    },
    email: {
        type: String,
        required: [true, 'A user must have an email'],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'Please enter a valid email']
        // match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },
    type: {
        type: String,
        enum: ['private', 'commercial', 'admin'],
        default: 'private'
      },
    password: {
        type: String,
        required: [true, 'A user must have an password'],
        minlength: 8
    },
    passwordConfirm: {
        type: String,
        required: [true, 'Please re-enter your password'],
        minlength: 8,
        validate: {
            validator: function(el) {
                return el === this.password;
            },
            message: 'Passwords do not match'
        }
    },
});

userSchema.pre<UserObj>('save', async function(next) {

    this.password = await bcrypt.hash(this.password, 12);
  
    this.passwordConfirm = undefined;
    next();
  });

userSchema.methods.correctPassword = async function(
    candidatePassword: string,
    userPassword: string
): Promise<boolean> {
    return await bcrypt.compare(candidatePassword, userPassword);
}

const User: Model<UserObj> = mongoose.model<UserObj>('User', userSchema);

export default User;