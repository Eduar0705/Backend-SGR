const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController');
const authMiddleware = require('../middleware/auth.middleware');

// Proteger todas las rutas
router.use(authMiddleware);

// GET    /api/usuarios          → Listar todos los usuarios
router.get('/', UserController.getUsuarios);

// POST   /api/usuarios          → Crear un nuevo usuario
router.post('/', UserController.createUsuario);

// PUT    /api/usuarios/:cedula  → Actualizar un usuario
router.put('/:cedula', UserController.updateUsuario);

// DELETE /api/usuarios/:cedula  → Eliminar un usuario
router.delete('/:cedula', UserController.deleteUsuario);

module.exports = router;
