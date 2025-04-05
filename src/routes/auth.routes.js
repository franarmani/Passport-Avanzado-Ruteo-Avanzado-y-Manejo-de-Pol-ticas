const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const bcrypt = require('bcrypt');
const rateLimit = require('express-rate-limit');
const { registerValidation, loginValidation, validate } = require('../middlewares/validation.middleware');

const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, 
    max: 5,
    message: { error: 'Demasiados intentos de login. Por favor espere 15 minutos.' }
});

+router.post('/register', registerValidation, validate, async (req, res) => {
    try {
        const { first_name, last_name, email, age, password } = req.body;
        
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email ya registrado' });
        }

        const user = await User.create({
            first_name,
            last_name,
            email,
            age,
            password
        });

        res.status(201).json({ message: 'Usuario registrado exitosamente' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/login', loginLimiter, loginValidation, validate, async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user || !bcrypt.compareSync(password, user.password)) {
            return res.status(401).json({ message: 'Credenciales inválidas' });
        }

        const token = jwt.sign({ sub: user._id }, process.env.JWT_SECRET, { expiresIn: '24h' });
        res.cookie('jwt', token, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000 
        });

        res.json({ message: 'Login exitoso' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/current', passport.authenticate('jwt', { session: false }), (req, res) => {
    res.json({
        user: {
            first_name: req.user.first_name,
            last_name: req.user.last_name,
            email: req.user.email,
            age: req.user.age,
            role: req.user.role
        }
    });
});

router.post('/logout', (req, res) => {
    res.clearCookie('jwt');
    res.json({ message: 'Logout exitoso' });
});

module.exports = router;