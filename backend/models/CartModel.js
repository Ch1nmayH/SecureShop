import { Mongoose } from "mongoose"

const cartSchema = new Mongoose.Schema({
    userId: { type: String, required: true },
    products: [
        {
            productId: { type: String, required: true },
            quantity: { type: Number, required: true },
        },
    ],
    createdAt: { type: Date, default: Date.now },
});

const cartModel = Mongoose.model("Cart", cartSchema);
