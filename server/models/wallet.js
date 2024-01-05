import { Schema, model } from "mongoose";

const walletSchema = new Schema(
  {
    externalAccountId: {
      type: String,
      required: true,
    },
    userId: { type: Schema.Types.ObjectId, ref: "users" },
  },
  {
    statics: {
      findByExternalAccount(account) {
        return this.find({ externalAccountId: account });
      },
    },
  }
);

export default model("wallet", walletSchema);
