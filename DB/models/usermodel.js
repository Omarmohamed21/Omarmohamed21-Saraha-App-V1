import { Schema, model } from "mongoose";

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: { type: String, required: true },
    age: { type: Number, min: 18, max: 70 },
    name: { type: String, min: 2, max: 20, required: true },
    isConfirmed: { type: Boolean, default: false },
    forgetCode: { type: String, unique: true },
    profilePic: { secure_url: String, public_id: String },
    coverPic: [{ secure_url: String, public_id: String }],
  },
  { timestamps: true }
);

export const User = model("User", userSchema);
