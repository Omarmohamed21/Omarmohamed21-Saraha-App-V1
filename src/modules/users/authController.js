import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import randomstring from "randomstring";

import { asyncHandler } from "./../../utilities/asynchandler.js";
import { User } from "./../../../DB/models/usermodel.js";
import { Token } from "../../../DB/models/tokenModel.js";
import { sendEmail } from "../../utilities/sendEmails.js";

export const signup = asyncHandler(async (req, res, next) => {
  //hashing password
  const hashedPassword = bcryptjs.hashSync(
    req.body.password,
    parseInt(process.env.SALT_ROUND)
  );
  //create user
  const user = await User.create({ ...req.body, password: hashedPassword });

  //token to use it in email sent
  const token = jwt.sign({ email: user.email }, process.env.Token_KEY);

  //send email
  const messageSent = await sendEmail({
    to: user.email,
    subject: "account activation",
    html: `<a href='http://localhost:3000/auth/activate_account/${token}'>account activation</a>`,
  });
  if (!messageSent) return next(new Error("email is invalid", { cause: 400 }));
  //send responseEmail is invalid
  return res.status(201).json({
    success: true,
    messages: "user created successfully",
  });
}); 

export const login = asyncHandler(async (req, res, next) => {
  //check user
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new Error("user not found", { cause: 404 }));
  }

  /* check activation */
/*   if (!user.isConfirmed)
    return next(new Error("you should activate your account first"), {
      cause: 400,
    }); */
  //check password
  const match = bcryptjs.compareSync(req.body.password, user.password);
  if (!match) {
    return next(new Error("password is incorrect", { cause: 404 }));
  }

  //generate token
  const token = jwt.sign(
    { id: user._id, email: user.email },
    process.env.Token_KEY
  );

  await Token.create({ token, user: user._id });

  //send response
  return res.status(200).json({
    success: true,
    results: { token },
  });
});

export const activateAccount = asyncHandler(async (req, res, next) => {
  const { token } = req.params;

  //payload (to decrypt token)
  const payload = jwt.verify(token, process.env.Token_KEY);

  //update isConfirmed
  //we can remove  const user =
  const user = await User.findOneAndUpdate(
    { email: payload.email },
    { isConfirmed: true },
    { new: true }
  );

  return res.send("account activated successfully try to log in now");
});

export const sendForgetCode = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  //check user existence
  if (!user) return next(new Error("user not found!"));

  //chech  activation
  if (!user.isConfirmed)
    return next(new Error("you must activate your account first"));

  //generate forgetCode
  const code = randomstring.generate({
    length: 5,
    charset: "numeric",
  });

  //save code in the DB
  user.forgetCode = code;
  await user.save();

  //send email
  const sendmessage = await sendEmail({
    to: user.email,
    subject: "reset password",
    html: `<div>${code}</div>`,
  });

  if (!sendmessage) return next(new Error("this email is invalid"));
  return res.send("you can reset your password now ");
});

export const resetPassword = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  //check user
  if (!user) return next(new Error("email is invalid"));

  /* check code */
  if (user.forgetCode !== req.body.code) return next(new Error("invalid code"));

  //delete forget code
  await User.findOneAndUpdate(
    { email: req.body.email },
    { $unset: { forgetCode: 1 } }
  );

  //update password
  user.password = bcryptjs.hashSync(
    req.body.password,
    parseInt(process.env.SALT_ROUND)
  );

  await user.save();

  //invalidate all tokens
  const tokens = await Token.findOne({ user: user._id });

  tokens.forEach(async (token) => {
    token.isValid = false;
    await token.save();
  });

  //send response

  return res.json({
    success: true,
    message: "try to login now",
  });
});
