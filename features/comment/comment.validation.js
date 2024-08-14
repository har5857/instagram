import Joi from "joi";

export const AddComment = Joi.object({
  Text: Joi.string().required(),
});

export const updateComment = Joi.object({
  Text: Joi.string().required(),
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

export const validateComment = validate(AddComment);
export const validateupdate = validate(updateComment);
