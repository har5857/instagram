import mongoose from "mongoose";

const paymentOrderSchema = new mongoose.Schema({
  amount: Number,
  amount_due: Number,
  amount_paid: Number,
  attempts: Number,
  created_at: Number,
  currency: String,
  entity: String,
  id: String,
  notes: [String],
  offer_id: String,
  receipt: String,
  status: String,
  payment_method: {
    type: String,
    default: null,
  },
});

const Payment = mongoose.model("Payment", paymentOrderSchema);

export default Payment;
