import jwt from "jsonwebtoken";

import { asyncHandler } from "../utilities/asynchandler.js";
import { Token } from "../../DB/models/tokenModel.js";
import { User } from "../../DB/models/usermodel.js";

export const isAuthenticated = asyncHandler(async (req, res, next) => {
  //get token
  let { token } = req.headers;
  //check token existence
  if (!token) {
    return next(new Error("Token is missing", { cause: 400 }));
  }
  //check token prefix
  if (!token.startsWith(process.env.BEARER_KEY)) {
    return next(new Error("Invalid Token", { cause: 401 }));
  }
  //cut the bearer
  token = token.split(process.env.BEARER_KEY)[1];
  //check token in the DB
  const tokenDB = await Token.findOne({ token, isValid: true });
  if (!tokenDB) {
    return next(new Error("token is expired", { cause: 400 }));
  }
  //verify token
  const payload = jwt.verify(token, process.env.Token_KEY);
  //check user existence
  const isUser = await User.findById(payload.id);
  if (!isUser) {
    return next(new Error("user not found", { cause: 404 }));
  }
  //pass user to the next controller
  req.user = isUser;
  //call next controller
  return next();
});
