// validation.js
import Joi from 'joi';

export const register = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    contactNumber: Joi.number().required(),
    userName: Joi.string().optional(),
    profilePicture: Joi.string().optional(),
    bio: Joi.string().optional(),
    DOB: Joi.date().optional(),
    gender: Joi.string().valid('Male', 'Female', 'Other').optional(),
});

export const update = Joi.object({
    email: Joi.string().email().optional(),
    password: Joi.string().min(6).optional(),
    contactNumber: Joi.number().optional(),
    userName: Joi.string().optional(),
    profilePicture: Joi.string().optional(),
    bio: Joi.string().optional(),
    DOB: Joi.date().optional(),
    gender: Joi.string().valid('Male', 'Female', 'Other').optional(),
    followers: Joi.number().optional(),
    following: Joi.number().optional(),
    posts: Joi.number().optional(),
    accountPrivate: Joi.boolean().optional(),
    isAdmin: Joi.boolean().optional(),
    isDelete: Joi.boolean().optional(),
});

export const login = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
});

const validate = (schema) => (req, res, next) => {
    const { error } = schema.validate(req.body,{ abortEarly: false });
    if (error) {
        const formattedErrors = error.details.map(err => err.message);
        return res.status(400).json({ error: formattedErrors });
    }
    next();
};

export const validateRegistration = validate(register);
export const validateUpdate = validate(update);
export const validateLogin = validate(login);
