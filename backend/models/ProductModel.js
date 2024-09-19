import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    image: { type: String },
    stock: { type: Number, required: true },
    createdAt: { type: Date, default: Date.now },

});

const productModel = mongoose.model("Product", productSchema);

export default productModel;    