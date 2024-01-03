import { Schema, model } from "mongoose";

const postSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    markdown: {
      type: String,
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "users",
    },
    tags: [{ type: String, required: true }],
    votes: [{ type: Schema.Types.ObjectId, ref: "users" }],
    comments: [
      {
        userId: { type: Schema.Types.ObjectId, ref: "users" },
        comment: String,
      },
    ],
    image: String,
    summary: String,
    savedBy: [{ type: Schema.Types.ObjectId, ref: "users" }],
    membersOnly: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export default model("posts", postSchema);
