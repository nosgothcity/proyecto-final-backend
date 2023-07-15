import mongoose from 'mongoose';

const userSchema = mongoose.Schema({
    firstname: {
        type: String,
        required: true,
    },
    lastname: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        unique: true,
        required: true,
    },
    age: {
        type: Number,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        required: true,
        defaultValue: 'user',
    },
    cart: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Carts'
    },
})

const UserModel = mongoose.model("User", userSchema);
export default UserModel;
