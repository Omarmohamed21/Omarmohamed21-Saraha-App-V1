import { Router } from "express";

import * as messageController from "./messageController.js";
import { sendMessageSchema } from "./messageVschema.js";
import { isAuthenticated } from "./../../middlewares/authentication.js";
import { validation } from "./../../middlewares/validation.js";

const router = Router();

router.post(
  "/",
  isAuthenticated,
  validation(sendMessageSchema),
  messageController.sendMessage
);

export default router;
