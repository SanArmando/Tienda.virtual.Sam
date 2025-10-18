// mock-api/controllers/usuario.controller.js
const Usuario = require('../models/usuario.model');
const jwt = require('jsonwebtoken');

const generarToken = (id) => {
    const secret = process.env.JWT_SECRET || 'seed_development';
    const expiresIn = process.env.JWT_EXPIRES_IN || '7d';
    return jwt.sign({ id }, secret, { expiresIn });
};

// Obtener todos los usuarios (sin passwords)
exports.obtenerUsuarios = async (req, res) => {
    try {
        const usuarios = await Usuario.find().select('-password');
        res.status(200).json(usuarios);
    } catch (error) {
        console.error('Error al obtener usuarios:', error);
        res.status(500).json({ mensaje: 'Error interno al acceder a la base de datos.' });
    }
};

// Crear un nuevo usuario
exports.crearUsuario = async (req, res) => {
    const { nombre, email, password } = req.body;
    try {
        const nuevoUsuario = new Usuario({ nombre, email, password });
        await nuevoUsuario.save();
        const userToReturn = nuevoUsuario.toObject();
        delete userToReturn.password;
        res.status(201).json(userToReturn);
    } catch (error) {
        console.error('Error al crear usuario:', error);
        res.status(400).json({ mensaje: 'Error: Datos no válidos o email ya registrado.' });
    }
};

// Registro (alias crear usuario + token)
exports.registro = async (req, res, next) => {
    try {
        const { email, password, nombre } = req.body;

        if (!email || !password || !nombre) {
            return res.status(400).json({ success: false, message: 'Por favor, proporciona todos los campos requeridos' });
        }

        const usuarioExistente = await Usuario.findOne({ email });
        if (usuarioExistente) {
            return res.status(400).json({ success: false, message: 'Este email ya está registrado' });
        }

        const usuario = new Usuario({ nombre, email, password });
        await usuario.save();

        const token = generarToken(usuario._id);

        res.status(201).json({
            success: true,
            token,
            usuario: { id: usuario._id, nombre: usuario.nombre, email: usuario.email }
        });
    } catch (error) {
        next(error);
    }
};

// Login
exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ success: false, message: 'Por favor, proporciona email y contraseña' });
        }

        const usuario = await Usuario.findOne({ email }).select('+password');

        if (!usuario) {
            return res.status(401).json({ success: false, message: 'Email o contraseña incorrectos' });
        }

        const match = await usuario.comparePassword(password);
        if (!match) {
            return res.status(401).json({ success: false, message: 'Email o contraseña incorrectos' });
        }

        const token = generarToken(usuario._id);

        res.json({ success: true, token, usuario: { id: usuario._id, nombre: usuario.nombre, email: usuario.email } });
    } catch (error) {
        next(error);
    }
};