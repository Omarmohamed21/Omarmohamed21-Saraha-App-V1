import express from "express";
import dotenv from "dotenv";

import { connectDB } from "./DB/connection.js";
import authRouter from "./src/modules/users/authRouter.js";
import messageRouter from "./src/modules/message/messageRouter.js";
import multerRouter from "./src/modules/auth/multerRouter.js";

dotenv.config();
//instance of express
const app = express();
//parsing
app.use(express.json());
//server Port
const port = process.env.PORT;

//serving static files
app.use("/uploads", express.static("uploads"));

//DB connection
await connectDB();

//APIs
app.use("/auth", authRouter);
app.use("/message", messageRouter);
app.use("/multer", multerRouter);

//page not found handler
app.all("/", (req, res, next) => {
  return next(new Error("page not found", { cause: 404 }));
});

//global error handler
app.use((error, req, res, next) => {
  const statusCode = error.cause || 500;
  return res
    .status(statusCode)
    .json({ success: false, message: error.message, stack: error.stack });
});
app.listen(port, () => console.log(`app is running on PORT ${port}`));
