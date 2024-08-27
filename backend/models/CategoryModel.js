import { Mongoose } from "mongoose";

const categorySchema = new Mongoose.Schema({
    name: { type: String, required: true, unique: true },
    createdAt: { type: Date, default: Date.now },
});

const categoryModel = Mongoose.model("Category", categorySchema);