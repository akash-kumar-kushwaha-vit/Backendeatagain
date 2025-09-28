import mongoose from "mongoose";

const foodSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String, required: true }, // 🔥 lowercase, matches controller
  category: { type: String, required: true },
});

// Fix: use mongoose.models to prevent model overwrite error
const foodModel = mongoose.models.food || mongoose.model("food", foodSchema);

export default foodModel;
