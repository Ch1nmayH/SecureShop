import express from "express";
import productController from "../controllers/productController.js";
import { adminAuth, retailerAuth, auth } from "../middlewares/userAuth.js";
import multer from "multer";
import path from "path";
import fs from "fs";

const app = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = "uploads/products/";
    // Ensure the directory exists
    fs.mkdirSync(dir, { recursive: true });
    cb(null, dir); // Set where to store the images
  },
  filename: (req, file, cb) => {
    // Temporarily name the file using Date.now()
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

//Get all Categories
app.get("/getcategories", productController.getCategories);

//Get Products by Category
app.get(
  "/getproductsbycategory/:category",
  productController.getProductsByCategory
);

//Add new Category
app.post("/addcategory", retailerAuth, productController.addCategory);

//Update Category
app.put("/updatecategory/:id", retailerAuth, productController.updateCategory);

//Delete Category
app.delete(
  "/deletecategory/:id",
  retailerAuth,
  productController.deleteCategory
);

//Get all Products
app.get("/getproducts", productController.getProducts);

//Get Product by ID
app.get("/getproduct/:id", productController.getProductById);

//Add Products
app.post("/addproduct", retailerAuth, upload.single("image"), productController.addProduct);

//Update Product
app.put("/updateproduct/:productId", retailerAuth, upload.single("image"), productController.updateProduct);

//Delete Product
app.delete('/deleteProduct/:id', productController.deleteProduct);
export default app;
