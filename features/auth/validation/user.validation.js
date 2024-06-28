// validation.js
import Joi from 'joi';
import { gender } from '../../../config/enum.js';

//register user
export const register = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    contactNumber: Joi.number().required(),
    userName: Joi.string().optional(),
    profilePicture: Joi.string().optional(),
    bio: Joi.string().optional(),
    DOB: Joi.date().optional(),
    gender: Joi.string().valid(...Object.values(gender)).optional(),  
});

//update user
export const update = Joi.object({
    email: Joi.string().email().optional(),
    password: Joi.string().min(6).optional(),
    contactNumber: Joi.number().optional(),
    userName: Joi.string().optional(),
    profilePicture: Joi.string().optional(),
    bio: Joi.string().optional(),
    DOB: Joi.date().optional(),
    gender: Joi.string().valid(...Object.values(gender)).optional(),
    followers: Joi.number().optional(),
    following: Joi.number().optional(),
    posts: Joi.number().optional(),
    accountPrivate: Joi.boolean().optional(),
    isAdmin: Joi.boolean().optional(),
    isDelete: Joi.boolean().optional(),
});

//login user
export const login = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required()
});

//change password user
export const changePassword = Joi.object({
    currentPassword: Joi.string().required(),
    newPassword: Joi.string().min(6).required().invalid(Joi.ref('currentPassword')).messages({
        'any.invalid': 'New password must not be the same as current password',
    })
});

const validate = (schema) => (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });
    if (error) {
        const formattedErrors = {};
        error.details.forEach(err => {
            formattedErrors[err.context.label] = err.message.replace(/"/g, '');
        });

        return res.status(400).json({ 
            message: "error",
            success: false,
            ...formattedErrors
        });
    }
    next();
};

export const validateRegistration = validate(register);
export const validateUpdate = validate(update);
export const validateLogin = validate(login);
export const validatechangePassword = validate(changePassword);

