import userModel from "../models/userModel.js";

// Add item to cart
const addItemcart = async (req, res) => {
  try {


    let userdata = await userModel.findOne({ _id: req.body.userId });
    if (!userdata) return res.status(404).json({ success: false, message: "User not found" });

    // Initialize cartData if it doesn't exist
    let cartData = await userdata.cartData || {};

    // Add or increment food item
    if (!cartData[req.body.itemId]) {
      cartData[req.body.itemId] = 1;
    } else {
      cartData[req.body.itemId] += 1;
    }
    await userModel.findByIdAndUpdate(req.body.userId, { cartData });


    res.json({ success: true, message: "Added to cart", cartData });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Error adding to cart" });
  }
};

// Remove item from cart
const removeItemcart = async (req, res) => {
  try {


    let userdata = await userModel.findById(req.body.userId);
    if (!userdata) return res.status(404).json({ success: false, message: "User not found" });

    let cartData = await userdata.cartData || {};

    if (cartData[req.body.itemId] > 0) {
      cartData[req.body.itemId] -= 1;

    }

    await userModel.findByIdAndUpdate(req.body.userId, { cartData });
    res.json({ success: true, message: "Removed from cart", cartData });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Error removing from cart" });
  }
};

// Get cart items
const getItemcart = async (req, res) => {
  try {

    let userdata = await userModel.findById(req.body.userId);
    if (!userdata) return res.status(404).json({ success: false, message: "User not found" });

    let cartData = await userdata.cartData || {};

    res.json({ success:true, cartData });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Error fetching cart" });
  }
};

export { addItemcart, removeItemcart, getItemcart };
