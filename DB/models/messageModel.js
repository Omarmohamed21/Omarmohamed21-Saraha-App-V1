import { Schema, Types, model } from "mongoose";

const messageSchema = new Schema(
  {
    content: {
      type: String,
      required: true,
      min: 10,
      max: 200,
    },
    receiverId: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },
  },

  { timestamps: true }
);

export const Message = model("message", messageSchema);
