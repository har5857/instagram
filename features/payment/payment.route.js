import express from 'express';
const router = express.Router();
import PaymentController from './payment.controller.js';

//create a order
router.post('/create-order/:postId', PaymentController.createOrder);

//verify payment
router.post('/verify-payment', PaymentController.verifyPayment);

export default router;