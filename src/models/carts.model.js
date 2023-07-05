import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const cartSchema = new mongoose.Schema({
    products: {
        type: [
            {
                product: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Products',    
                },
                count: {
                    type: Number,
                },
            }
        ],
        default: [],
    },
    date: {
        type: String,
        required: true,
    }
});

cartSchema.plugin(mongoosePaginate);
const CartsModel = mongoose.model("Carts", cartSchema);
export default CartsModel;