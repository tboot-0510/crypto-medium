import { Schema, model } from "mongoose";

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: function () {
        return !this.walletAccount;
      },
    },
    name: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: function () {
        return !this.walletAccount;
      },
    },
    authenticationToken: {
      type: String,
      required: function () {
        return !this.walletAccount;
      },
    },
    walletAccount: {
      type: Schema.Types.ObjectId,
      ref: "wallet",
    },
  },
  {
    statics: {
      findByEmail(email) {
        return this.find({ email: new RegExp(email, "i") });
      },
      findByWalletAccount(account) {
        return this.find({ walletAccount: account });
      },
      findByRefreshToken(refreshToken) {
        return this.find({
          authenticationToken: new RegExp(refreshToken, "i"),
        });
      },
    },
  }
);

export default model("users", userSchema);
