import mongoose from 'mongoose';

const userSchema = mongoose.Schema({
    firstname: String,
    lastname: String,
    email: String,
    age: Number,
    password: String,
    admin: Boolean,
    cart: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Carts'
    },
})

const UserModel = mongoose.model("User", userSchema);
export default UserModel;
