import { Schema, model } from "mongoose";

const cryptoPaymentSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "users",
    },
    post: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "posts",
    },
    hash: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: ["pending", "minted", "mint_failed"],
    },
    transaction: {
      type: Schema.Types.ObjectId,
      ref: "transactions",
    },
  },
  { timestamps: true }
);

export default model("cryptoPayments", cryptoPaymentSchema);
