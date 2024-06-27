import { Router } from "express";

import * as authController from "./authController.js";
import { validation } from "../../middlewares/validation.js";
import {
  activateAccSchema,
  forgetCodeSchema,
  loginSchema,
  resetPassSchema,
  signupSchema,
} from "./authSchema.js";

const router = Router();

//signup
router.post("/signup", validation(signupSchema), authController.signup);

//log in
router.post("/login", validation(loginSchema), authController.login);

//activate account >>>> update isCofirmed: true
router.get(
  "/activate_account/:token",
  validation(activateAccSchema),
  authController.activateAccount
);

//forget code
router.patch(
  "/forget_code",
  validation(forgetCodeSchema),
  authController.sendForgetCode
);

//reset password
router.patch(
  "/resetpassword",
  validation(resetPassSchema),
  authController.resetPassword
);

export default router;
