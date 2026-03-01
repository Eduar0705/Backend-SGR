const express = require('express');
const router = express.Router();
const PermisosController = require('../controllers/PermisosController');
const authMiddleware = require('../middleware/auth.middleware');

// Todas las rutas de permisos requieren autenticación
router.use(authMiddleware);

// GET    /api/permisos/docente/:cedula  → Listar permisos de un docente
router.get('/docente/:cedula', PermisosController.getPermisosByDocente);

// GET    /api/permisos/:id              → Obtener detalle de un permiso
router.get('/:id', PermisosController.getPermisoById);

// POST   /api/permisos                  → Crear o reactivar un permiso
router.post('/', PermisosController.createPermiso);

// DELETE /api/permisos/:id              → Eliminar (soft-delete) un permiso
router.delete('/:id', PermisosController.deletePermiso);

module.exports = router;
