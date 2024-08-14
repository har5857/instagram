import PaymentService from "./payment.service.js";
import PostService from "../post/post.service.js";

class PaymentController {
  static async createOrder(req, res) {
    const { postId } = req.params;
    try {
      let post = await PostService.getPost(postId);
      if (!post) {
        return res
          .status(404)
          .send({ success: false, message: "Post not found" });
      }
      const order = await PaymentService.createOrder(post.price, "INR");
      console.log(order);
      res.status(200).send({ success: true, order });
    } catch (error) {
      console.error("Error creating order:", error);
      res
        .status(500)
        .send({ success: false, message: "Failed to create order", error });
    }
  }

  static async verifyPayment(req, res) {
    const { orderId, paymentId, signature } = req.body;
    try {
      const isValid = PaymentService.verifyPayment(
        orderId,
        paymentId,
        signature
      );
      if (isValid) {
        res
          .status(200)
          .send({ success: true, message: "Payment verified successfully" });
      } else {
        res
          .status(400)
          .send({ success: false, message: "Invalid payment signature" });
      }
    } catch (error) {
      res
        .status(500)
        .send({ success: false, message: "Failed to verify payment", error });
    }
  }
}

export default PaymentController;
