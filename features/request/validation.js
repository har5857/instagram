import Joi from "joi";
import { friendRequestStatus } from "../../config/enum.js";

//update Request
export const updateFriendRequestStatus = Joi.object({
  status: Joi.string()
    .valid(...Object.values(friendRequestStatus))
    .required(),
});

const validate = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body, { abortEarly: false });
  if (error) {
    const formattedErrors = {};
    error.details.forEach((err) => {
      formattedErrors[err.context.label] = err.message.replace(/"/g, "");
    });
    return res.status(400).json({
      message: "error",
      success: false,
      ...formattedErrors,
    });
  }
  next();
};

export const validateupdateFriendRequestStatus = validate(
  updateFriendRequestStatus
);
