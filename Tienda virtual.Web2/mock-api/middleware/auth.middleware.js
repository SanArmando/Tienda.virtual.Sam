const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuario.model');

exports.protect = async (req, res, next) => {
    try {
        // 1) Verificar token
        let token;
        if (req.headers.authorization?.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'No has iniciado sesión'
            });
        }

        // 2) Verificar validez del token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // 3) Verificar si el usuario aún existe
        const usuario = await Usuario.findById(decoded.id);
        if (!usuario) {
            return res.status(401).json({
                success: false,
                message: 'El usuario ya no existe'
            });
        }

        // Guardar usuario en req
        req.usuario = usuario;
        next();
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                success: false,
                message: 'Token inválido'
            });
        }
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: 'Tu sesión ha expirado'
            });
        }
        next(error);
    }
};