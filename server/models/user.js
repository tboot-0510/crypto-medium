import { Schema, model } from "mongoose";

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
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
      required: true,
    },
  },
  {
    statics: {
      findByEmail(email) {
        return this.find({ email: new RegExp(email, "i") });
      },
    },
  }
);

export default model("users", userSchema);