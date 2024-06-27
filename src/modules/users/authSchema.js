import joi from "joi";

//validation
//schema
export const loginSchema = joi
  .object({
    email: joi.string().email().required(),
    password: joi
      .string()
      .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
      .required(),
  })
  .required();

export const signupSchema = joi
  .object({
    email: joi.string().email().required(),
    age: joi.number().min(18).max(70).messages({
      "number.min": "age must be more than or equal 18",
      "number.max": "age must be more than or equal 18",
    }),
    name: joi.string().min(2).max(20).required().messages({
      "string.min": "name must be more than or equal 5 characters",
      "string.max": "name must be more than or equal 5 characters",
    }),
    password: joi
      .string()
      .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
      .required(),
    confirmPassword: joi.string().valid(joi.ref("password")).required(),
  })
  .required();

export const activateAccSchema = joi
  .object({
    token: joi.string().required(),
  })
  .required();

export const forgetCodeSchema = joi
  .object({
    email: joi.string().email().required(),
  })
  .required();


  export const resetPassSchema = joi
    .object({
      email: joi.string().email().required(),
      code: joi.number().required(),
      password: joi
        .string()
        .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
        .required(),
      confirmPassword: joi.string().valid(joi.ref("password")).required(),
    })
    .required();
