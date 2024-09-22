// RetailerPanel.js
import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import RetailerSidebar from "../Components/RetailerSidebar";
import ProductCard from "../Components/ProductCard";
import CategoryCard from "../Components/CategoryCard";
import Popup from "../Components/Popup";
import EditForm from "../Components/RetailerEditForm";
import AddProductForm from "../Components/AddProductForm";
import AddCategoryForm from "../Components/AddCategoryForm";
import { useNavigate } from "react-router-dom";
import UserContext from "../utils/CreateContext";
import Cookies from "js-cookie";
import ManageProductCard from "../Components/ManageProductCard";

const RetailerPanel = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordErrorMessage, setPasswordErrorMessage] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [newProductData, setNewProductData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
  });
  const [newCategoryData, setNewCategoryData] = useState({
    name: "",
    description: "",
  });
  const [newImage, setNewImage] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");

  const { token } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!Cookies.get("token")) {
      navigate("/login");
    }
  }, [navigate]);

  // Handle password change
  const handlePasswordChangeSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setPasswordErrorMessage("Passwords do not match");
      return;
    }
    setPasswordErrorMessage("");
    try {
      await axios.put(
        "http://localhost:5000/api/user/changePassword",
        { password },
        { withCredentials: true }
      );
      setPopupMessage("Password changed successfully");
      setShowPopup(true);
    } catch (error) {
      setPopupMessage("Error changing password");
      setShowPopup(true);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/product/getProducts",
        { withCredentials: true }
      );
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/product/getCategories",
        { withCredentials: true }
      );
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleAdd = () => {
    setIsAdding(true);
    setIsEditing(false);
    resetForm();
  };

  const resetForm = () => {
    setNewProductData({
      name: "",
      description: "",
      price: "",
      category: categories[0]?._id || "",
    });
    setNewCategoryData({
      name: "",
      description: "",
    });
    setNewImage(null);
  };

  const handleAddInputChange = (e) => {
    const { name, value } = e.target;
    if (activeTab === "products") {
      setNewProductData({ ...newProductData, [name]: value });
    } else {
      setNewCategoryData({ ...newCategoryData, [name]: value });
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setNewImage(file);
  };

  const handleSubmitAdd = async (e) => {
    e.preventDefault();

    let formDataToSubmit;

    // Check if it's for products or categories
    if (activeTab === "products") {
      // Use FormData for products because of image upload
      formDataToSubmit = new FormData();
      formDataToSubmit.append("name", newProductData.name);
      formDataToSubmit.append("description", newProductData.description);
      formDataToSubmit.append("price", newProductData.price);
      formDataToSubmit.append("category", newProductData.category);
      formDataToSubmit.append("stock", newProductData.stock);
      if (newImage) {
        formDataToSubmit.append("image", newImage);
      }
    } else {
      // Send JSON for categories since no file uploads are involved
      formDataToSubmit = {
        name: newCategoryData.name,
        description: newCategoryData.description,
      };
    }

    try {
      const apiUrl =
        activeTab === "products"
          ? "http://localhost:5000/api/product/addProduct"
          : "http://localhost:5000/api/product/addCategory";

      // Determine the request options depending on whether it's a product (multipart) or category (JSON)
      const requestOptions =
        activeTab === "products"
          ? {
              headers: { "Content-Type": "multipart/form-data" },
              withCredentials: true,
            }
          : {
              headers: { "Content-Type": "application/json" },
              withCredentials: true,
            };

      // Send request with either FormData or JSON
      console.log("formDataToSubmit", formDataToSubmit);
      await axios.post(apiUrl, formDataToSubmit, requestOptions);

      // Display success message
      setPopupMessage(`${activeTab.slice(0, -1)} added successfully`);
      setShowPopup(true);
      setIsAdding(false);

      // Fetch updated products or categories after the addition
      if (activeTab === "products") {
        fetchProducts();
      } else {
        fetchCategories();
      }
    } catch (error) {
      console.error("Error adding new product/category", error);
    }
  };

  const handleEditSubmit = async (updatedData) => {
    try {
      const formDataToSubmit = new FormData();
      formDataToSubmit.append("name", updatedData.name);
      formDataToSubmit.append("description", updatedData.description);

      if (activeTab === "products") {
        // Only append product-specific data
        formDataToSubmit.append("price", updatedData.price);
        formDataToSubmit.append("category", updatedData.category);
        formDataToSubmit.append("stock", updatedData.stock);

        // If a new image was selected, append it to the FormData
        if (updatedData.selectedImage) {
          formDataToSubmit.append("image", updatedData.selectedImage);
        }
      }

      const apiUrl =
        activeTab === "products"
          ? `http://localhost:5000/api/product/updateproduct/${editData._id}`
          : `http://localhost:5000/api/product/updatecategory/${editData._id}`;

      // For product updates, ensure that the headers are set for multipart/form-data
      const requestOptions =
        activeTab === "products"
          ? {
              headers: {
                "Content-Type": "multipart/form-data",
              },
              withCredentials: true,
            }
          : {
              headers: {
                "Content-Type": "application/json",
              },
              withCredentials: true,
            };

      // Sending the PUT request with the correct content type
      console.log(apiUrl);
      await axios.put(apiUrl, formDataToSubmit, requestOptions);

      // Success message and UI updates
      setPopupMessage(`${activeTab.slice(0, -1)} updated successfully`);
      setShowPopup(true);
      setIsEditing(false);

      // Refetch products or categories after the update
      if (activeTab === "products") {
        fetchProducts();
      } else {
        fetchCategories();
      }
    } catch (error) {
      console.error("Error updating the product/category:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const apiUrl =
        activeTab === "products"
          ? `http://localhost:5000/api/product/deleteProduct/${id}`
          : `http://localhost:5000/api/product/deletecategory/${id}`;

      await axios.delete(apiUrl, { withCredentials: true });

      setPopupMessage(`${activeTab.slice(0, -1)} deleted successfully`);
      setShowPopup(true);

      if (activeTab === "products") {
        fetchProducts();
      } else {
        fetchCategories();
      }
    } catch (error) {
      console.error("Error deleting the product/category:", error);
    }
  };

  const handleEdit = (category) => {
    setEditData(category);
    setIsEditing(true);
  };

  useEffect(() => {
    if (activeTab === "products" || activeTab === "dashboard") {
      fetchProducts();
      fetchCategories();
    } else {
      fetchCategories();
    }
  }, [activeTab]);

  return (
    <div className="flex min-h-screen">
      <RetailerSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="flex-grow p-6 bg-gray-100">
        {activeTab === "dashboard" ? (
          <div className="flex justify-center items-center min-h-screen">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full max-w-6xl">
              <div className="bg-white p-6 rounded shadow-md text-center bg-[#915cdb] text-white h-[250px] min-w-[250px] flex flex-col justify-center items-center transition-transform transform hover:scale-105 hover:shadow-lg duration-300 ease-in-out">
                <h2 className="text-xl font-bold">Products</h2>
                <p className="text-2xl">{products.length}</p>
              </div>
              <div className="bg-white p-6 rounded shadow-md text-center bg-[#07838a] text-white h-[250px] min-w-[250px] flex flex-col justify-center items-center transition-transform transform hover:scale-105 hover:shadow-lg duration-300 ease-in-out">
                <h2 className="text-xl font-bold">Categories</h2>
                <p className="text-2xl">{categories.length}</p>
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Only show the header and button if not on Change Password tab */}
            {activeTab !== "changePassword" && (
              <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">
                  {activeTab === "products"
                    ? "Manage Products"
                    : "Manage Categories"}
                </h1>
                <button
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  onClick={handleAdd}
                >
                  Add {activeTab === "products" ? "Product" : "Category"}
                </button>
              </div>
            )}
  
            <div className="mt-4">
              {activeTab === "products" && !isAdding && !isEditing && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {products.map((product) => (
                    <ManageProductCard
                      key={product._id}
                      product={product}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                      setEditData={setEditData}
                      setIsEditing={setIsEditing}
                      setPopupMessage={setPopupMessage}
                      setShowPopup={setShowPopup}
                      fetchProducts={fetchProducts}
                    />
                  ))}
                </div>
              )}
  
              {activeTab === "categories" && !isAdding && !isEditing && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {categories.map((category) => (
                    <CategoryCard
                      key={category._id}
                      category={category}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                    />
                  ))}
                </div>
              )}
  
              {isAdding && activeTab === "products" && (
                <AddProductForm
                  categories={categories}
                  newProductData={newProductData}
                  setNewProductData={setNewProductData}
                  handleAddInputChange={handleAddInputChange}
                  handleImageChange={handleImageChange}
                  handleSubmitAdd={handleSubmitAdd}
                  setIsAdding={setIsAdding}
                />
              )}
  
              {isAdding && activeTab === "categories" && (
                <AddCategoryForm
                  newCategoryData={newCategoryData}
                  handleAddInputChange={handleAddInputChange}
                  handleSubmitAdd={handleSubmitAdd}
                  setIsAdding={setIsAdding}
                />
              )}
  
              {isEditing && (
                <EditForm
                  data={editData}
                  categories={categories}
                  activeTab={activeTab}
                  onSubmit={handleEditSubmit}
                  onCancel={() => setIsEditing(false)}
                  setIsEditing={setIsEditing}
                />
              )}
  
              {activeTab === "changePassword" && (
                <div className="bg-white p-4 rounded shadow-md">
                  <h2 className="text-xl font-bold mb-4">Change Password</h2>
                  <form onSubmit={handlePasswordChangeSubmit}>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="New Password"
                      className="block mb-2 p-2 border rounded w-full"
                      required
                    />
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm Password"
                      className="block mb-2 p-2 border rounded w-full"
                      required
                    />
                    <p className="text-red-600 mb-2">
                      {passwordErrorMessage}
                    </p>
                    <button
                      type="submit"
                      className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 text-lg rounded-lg"
                    >
                      Save
                    </button>
                  </form>
                </div>
              )}
            </div>
  
            {showPopup && (
              <Popup message={popupMessage} setShowPopup={setShowPopup} />
            )}
          </>
        )}
      </div>
    </div>
  );
}
  
export default RetailerPanel;
