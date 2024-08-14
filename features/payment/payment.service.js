import Razorpay from "razorpay";
import crypto from "crypto";
import Payment from "./payment.model.js";
import env from "../../config/env.js";

const instance = new Razorpay({
  key_id: env.razorpay.keyId,
  key_secret: env.razorpay.keySecret,
});

class PaymentService {
  static async createOrder(amount, currency) {
    try {
      const options = {
        amount: amount,
        currency,
        receipt: "order_rcptid_11",
      };
      const order = await instance.orders.create(options);
      const payment = new Payment(order);
      await payment.save();
      return order;
    } catch (error) {
      console.error("Error creating Razorpay order:", error);
      throw error;
    }
  }

  static async verifyPayment(orderId, paymentId, signature) {
    const body = orderId + "|" + paymentId;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");
    return expectedSignature === signature;
  }
}

export default PaymentService;
