import { Schema, model } from "mongoose";

const cryptoPaymentSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "users",
    },
    hash: {
      type: String,
      required: true,
    },
    status: {
      type: Number,
      required: true,
      enum: [0, 1],
    },
    transaction: {
      type: Schema.Types.ObjectId,
      ref: "transactions",
    },
  },
  { timestamps: true }
);

export default model("cryptoPayments", cryptoPaymentSchema);
