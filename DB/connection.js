import mongoose from "mongoose";

export const connectDB = async () => {
  return await mongoose
    .connect(process.env.DBCONNECTION)
    .then(() => console.log("DB connected"))
    .catch(() => console.log("DB failed to connect"));
};
