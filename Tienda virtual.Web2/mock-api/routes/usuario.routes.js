// mock-api/routes/usuario.routes.js
const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuario.controller');

// Usuarios
router.get('/', usuarioController.obtenerUsuarios); // GET / -> listado
router.post('/', usuarioController.crearUsuario);  // POST / -> crear

// Autenticación
router.post('/register', usuarioController.registro);
router.post('/login', usuarioController.login);

module.exports = router;