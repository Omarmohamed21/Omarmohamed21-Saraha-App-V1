import { asyncHandler } from "./../../utilities/asynchandler.js";
import { User } from "./../../../DB/models/usermodel.js";
import {Message } from "./../../../DB/models/messageModel.js";

export const sendMessage = asyncHandler(async (req, res, next) => {
  //check receiver
  const user = await User.findById(req.body.receiverId);
  if (!user) {
    return next(new Error("user not found", { cause: 404 }));
  }

  await Message.create(req.body);

  return res.status(201).json({
    success: true,
    message: "message sent successfully",
  });
});
