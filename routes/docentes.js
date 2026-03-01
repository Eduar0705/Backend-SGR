const express = require('express');
const router = express.Router();
const DocenteController = require('../controllers/DocenteController');
const authMiddleware = require('../middleware/auth.middleware');

// Proteger todas las rutas de este módulo
router.use(authMiddleware);

// GET    /api/docentes          → Listar todos los docentes
router.get('/', DocenteController.getDocentes);

// POST   /api/docentes          → Crear un nuevo docente
router.post('/', DocenteController.createDocente);

// PUT    /api/docentes/:cedula  → Actualizar un docente
router.put('/:cedula', DocenteController.updateDocente);

// DELETE /api/docentes/:cedula  → Eliminar (soft-delete) un docente
router.delete('/:cedula', DocenteController.deleteDocente);

// Rutas de Permisos
router.get('/:cedula/permisos', DocenteController.getPermisos);
router.post('/:cedula/permisos', DocenteController.savePermisos);
router.delete('/permisos/:id', DocenteController.deletePermiso);

module.exports = router;
