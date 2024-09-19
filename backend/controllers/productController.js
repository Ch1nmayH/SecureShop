import product from "../models/ProductModel.js"
import category from "../models/CategoryModel.js"
import fs from "fs";
import path from "path";
import multer from "multer";


const getProducts = async (req, res) => {
    try {
        const products = await product.find({});
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const getCategories = async (req, res) => {
    try {
        const categories = await category.find({});
        res.json(categories);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const getProductsByCategory = async (req, res) => {
    try {
        const products = await product.find({ category: req.params.category });
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const addCategory = async (req, res) => {
    try {
      console.log(req.body); // Log the incoming data to check
      const { name, description } = req.body;
      if (!name || !description) {
        return res.status(400).json({ message: "Name and description are required." });
      }
      const newCategory = await category.create({ name, description });
      res.json(newCategory);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  

  const updateCategory = async (req, res) => {
    try {
        console.log(req.body)
      const { name, description } = req.body;
      if (!name || !description) {
        return res.status(400).json({ message: "Name and description are required." });
      }
      const updatedCategory = await category.findByIdAndUpdate(
        req.params.id,
        { name, description },
        { new: true }
      );
      res.json(updatedCategory);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  

  const deleteCategory = async (req, res) => {
    try {
      await category.findByIdAndDelete(req.params.id);
      res.json({ message: "Category deleted successfully." });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }


  const getProductById = async (req, res) => {
    try {
      const productItem = await product.findById(req.params.id);
      if (!productItem) {
        return res.status(404).json({ message: "Product not found." });
      }
      res.json(productItem);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  
const addProduct  = async (req, res) => {
    try {
      const { name, description, price, category,stock } = req.body;
  
      // First, create the product without the image
      const newProduct = {
        name,
        description,
        price,
        category,
        stock,
        image: "", // This will be updated once we rename the uploaded image
      };
  
      // Save the product to get the product ID
      const savedProduct = await product.create(newProduct);
  
      // Now handle the image renaming if the file is uploaded
      if (req.file) {
        const oldPath = req.file.path; // Path to the uploaded image with temp name
        const newFilename = `${savedProduct._id}${path.extname(req.file.originalname)}`; // New name is product ID
        const newPath = path.join(req.file.destination, newFilename); // Full path for the new name
  
        // Rename the file to use the product ID as the name
        fs.rename(oldPath, newPath, async (err) => {
          if (err) {
            console.error("Error renaming file:", err);
            return res.status(500).json({ message: "Failed to rename image" });
          }
  
          // Update the product with the correct image path and save it
          savedProduct.image = `uploads/products/${newFilename}`;
          await savedProduct.save(); // Save the product with the updated image URL
  
          // Respond with the updated product
          res.status(201).json(savedProduct);
        });
      } else {
        // If no image was uploaded, just return the product as-is
        res.status(201).json(savedProduct);
      }
    } catch (error) {
      console.error("Error adding product:", error);
      res.status(500).json({ message: "Failed to add product" });
    }
  };

  const updateProduct = async (req, res) => {
    try {
      const { productId } = req.params; // Get product ID from the URL
      const { name, description, price, category, stock } = req.body;
  
      // Find the product by its ID
      const productToUpdate = await product.findById(productId);
      if (!productToUpdate) {
        return res.status(404).json({ message: "Product not found" });
      }
  
      // Update product details only if provided
      productToUpdate.name = name || productToUpdate.name;
      productToUpdate.description = description || productToUpdate.description;
      productToUpdate.price = price || productToUpdate.price;
      productToUpdate.category = category || productToUpdate.category;
  
      // Update stock only if it's defined and is a number
      if (stock !== undefined && !isNaN(stock)) {
        productToUpdate.stock = stock;
      }
  
      // Check if a new image is uploaded
      if (req.file) {
        const oldPath = req.file.path; // Path to the uploaded image with temp name
        const newFilename = `${productToUpdate._id}${path.extname(req.file.originalname)}`; // New image filename as product ID
        const newPath = path.join(req.file.destination, newFilename); // Full path for the renamed file
  
        // Rename the new image file
        fs.rename(oldPath, newPath, async (err) => {
          if (err) {
            console.error("Error renaming file:", err);
            return res.status(500).json({ message: "Failed to rename image" });
          }
  
          // Remove the old image if it exists
          if (productToUpdate.image) {
            fs.unlink(path.join("uploads/products", productToUpdate.image), (err) => {
              if (err) console.error("Error deleting old image:", err);
            });
          }
  
          // Update product with the new image URL
          productToUpdate.image = `uploads/products/${newFilename}`;
          await productToUpdate.save();
  
          // Respond with the updated product
          return res.status(200).json(productToUpdate);
        });
      } else {
        // Save updated product without image change
        await productToUpdate.save();
        return res.status(200).json(productToUpdate);
      }
    } catch (error) {
      console.error("Error updating product:", error);
      res.status(500).json({ message: "Failed to update product" });
    }
  };
  
  

  const deleteProduct = async (req, res) => {
    try {
      console.log(req.params.id);
      await product.findByIdAndDelete(req.params.id);

      res.json({ message: "Product deleted successfully." });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

export default { getProducts, getCategories , getProductsByCategory, addCategory, updateCategory, deleteCategory, getProductById, addProduct, updateProduct, deleteProduct };
