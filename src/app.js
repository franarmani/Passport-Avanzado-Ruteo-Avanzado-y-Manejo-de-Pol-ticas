const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const { initializePassport } = require('./config/passport.config');
const authRoutes = require('./routes/auth.routes');

require('dotenv').config();

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(passport.initialize());

initializePassport();

mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Conectado a MongoDB'))
    .catch(err => console.error('Error conectando a MongoDB:', err));

app.use('/api/sessions', authRoutes);

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).json({
        error: {
            message: err.message || 'Error interno del servidor',
            status: err.status || 500
        }
    });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
});