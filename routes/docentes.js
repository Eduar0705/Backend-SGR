const express = require('express');
const router = express.Router();
const DocenteController = require('../controllers/DocenteController');
const authMiddleware = require('../middleware/auth.middleware');

// Proteger todas las rutas de este módulo
router.use(authMiddleware);

// Ruta GET /api/docentes
router.get('/', DocenteController.getDocentes);

module.exports = router;
