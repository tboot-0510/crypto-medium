import { Schema, model } from "mongoose";

const tagSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
});

export default model("tags", tagSchema);
