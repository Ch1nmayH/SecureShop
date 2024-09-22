import mongoose from "mongoose";


const addressSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Reference to User model
  name: { type: String, required: true },
  address1: { type: String, required: true },
  address2: { type: String },
  city: { type: String, required: true },
  state: { type: String, required: true },
  pinCode: { type: String, required: true }, // Ensure the field is `pincode`, not `pinCode`
  mobile: { type: String, required: true },
}, { timestamps: true });

const Address = mongoose.model("Address", addressSchema);



export default Address;
