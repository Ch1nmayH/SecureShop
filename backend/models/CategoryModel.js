import  Mongoose  from "mongoose";

const categorySchema = new Mongoose.Schema({
    name: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
});

const categoryModel = Mongoose.model("Category", categorySchema);

export default categoryModel;