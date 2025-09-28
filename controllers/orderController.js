import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import Razorpay from "razorpay";
import crypto from "crypto";

// Razorpay instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY,
  key_secret: process.env.RAZORPAY_SECRET
});

// Place order & create Razorpay order
export const placeOrder = async (req, res) => {
  try {
    // Save order in DB as pending
    const newOrder = new orderModel({
      userId: req.body.userId,
      items: req.body.items,
      amount: req.body.amount,
      address: req.body.address,
      payment: false,
      status: "pending"
    });

    await newOrder.save();
    await userModel.findByIdAndUpdate(req.body.userId, { cartData: {} });

    // Create Razorpay order
    const razorpayOrder = await razorpay.orders.create({
      amount: req.body.amount * 100, // paise
      currency: "INR",
      receipt: newOrder._id.toString()
    });

    res.json({
      success: true,
      order_id: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      key: process.env.RAZORPAY_KEY,      // send key to frontend
      orderDbId: newOrder._id             // track DB order
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// Verify payment
export const verifyOrder = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderDbId } = req.body;

    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET)
      .update(sign.toString())
      .digest("hex");

    if (razorpay_signature === expectedSign) {
      await orderModel.findByIdAndUpdate(orderDbId, { payment: true, status: "paid" });
      res.json({ success: true, message: "Payment verified successfully" });
    } else {
      // Payment failed → delete order
      await orderModel.findByIdAndDelete(orderDbId);
      res.json({ success: false, message: "Payment verification failed, order deleted" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get user orders
export const userOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({ userId: req.body.userId });
    res.json({ success: true, data: orders });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "error" });
  }
};

// Admin: list all orders
export const listOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({});
    res.json({ success: true, data: orders });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "error" });
  }
};

// Update order status
export const updateStatus = async (req, res) => {
  try {
    await orderModel.findByIdAndUpdate(req.body.orderId, { status: req.body.status });
    res.json({ success: true, message: "status updated" });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Error" });
  }
};
