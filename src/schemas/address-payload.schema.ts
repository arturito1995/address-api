import Joi from "joi";

export const addressPayloadSchema = Joi.object({
  address: Joi.string().trim().min(1).required(),
})
  .required()
  .min(1);