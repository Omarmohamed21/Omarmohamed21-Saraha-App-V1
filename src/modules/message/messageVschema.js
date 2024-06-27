import joi from "joi";

import { objectIDValidation } from "../../middlewares/validation.js";

export const sendMessageSchema = joi
  .object({
    content: joi.string().min(10).max(100).required(),
    receiverId: joi.custom(objectIDValidation).required(),
  })
  .required();
