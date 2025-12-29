import Razorpay from "razorpay";
import crypto from "crypto";
import { config } from "dotenv";

config();

// Initialize Razorpay with credentials from env or fallback to test keys if needed for dev
// WARNING: In a real app, NEVER hardcode keys. 
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID || "rzp_test_placeholder",
    key_secret: process.env.RAZORPAY_KEY_SECRET || "secret_placeholder",
});

// @desc    Create Razorpay Order
// @route   POST /api/payment/order
// @access  Private
export const createOrder = async (req, res, next) => {
    try {
        const { amount } = req.body;

        if (!amount) {
            return res.status(400).json({ message: "Amount is required" });
        }

        const options = {
            amount: Number(amount) * 100, // Amount in paise
            currency: "INR",
            receipt: `receipt_${Date.now()}`,
        };

        const order = await razorpay.orders.create(options);

        res.status(200).json({
            success: true,
            order,
        });
    } catch (error) {
        console.error("Razorpay Order Error:", error);
        res.status(500).json({ message: "Something went wrong creating order", error: error.message });
    }
};

// @desc    Verify Razorpay Payment
// @route   POST /api/payment/verify
// @access  Private
export const verifyPayment = async (req, res, next) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

        const generated_signature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || "secret_placeholder") // Must use same secret as init
            .update(razorpay_order_id + "|" + razorpay_payment_id)
            .digest("hex");

        if (generated_signature === razorpay_signature) {
            res.status(200).json({
                success: true,
                message: "Payment verified successfully",
            });
        } else {
            res.status(400).json({
                success: false,
                message: "Invalid signature",
            });
        }
    } catch (error) {
        console.error("Razorpay Verify Error:", error);
        res.status(500).json({ message: "Something went wrong verifying payment" });
    }
};
