import Joi from 'joi';

export const update = Joi.object({
    caption: Joi.string().optional(),
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

export const validateUpdate = validate(update);