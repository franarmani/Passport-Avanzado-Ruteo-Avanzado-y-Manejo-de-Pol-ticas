const { body, validationResult } = require('express-validator');

const registerValidation = [
    body('first_name').trim().notEmpty().withMessage('El nombre es requerido'),
    body('last_name').trim().notEmpty().withMessage('El apellido es requerido'),
    body('email').isEmail().withMessage('Email inválido'),
    body('age').isInt({ min: 0 }).withMessage('La edad debe ser un número válido'),
    body('password').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
];

const loginValidation = [
    body('email').isEmail().withMessage('Email inválido'),
    body('password').notEmpty().withMessage('La contraseña es requerida'),
];

const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

module.exports = {
    registerValidation,
    loginValidation,
    validate
};