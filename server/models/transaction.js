import { Schema, model } from "mongoose";

const transactionSchema = new Schema(
  {
    from: {
      type: String,
      required: true,
      ref: "wallet",
    },
    to: {
      type: String,
      required: true,
    },
    hash: {
      type: String,
      required: true,
    },
    status: {
      type: Number,
      required: true,
    },
    gasUsed: {
      type: String,
      required: true,
    },
    gasPrice: {
      type: String,
      required: true,
    },
    blockNumber: {
      type: Number,
      required: true,
    },
    blockHash: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export default model("transactions", transactionSchema);
