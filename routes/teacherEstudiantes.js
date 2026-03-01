const express = require('express');
const router = express.Router();
const TeacherEstudiantesController = require('../controllers/TeacherEstudiantesController');
const authMiddleware = require('../middleware/auth.middleware');

router.get('/teacher/students', authMiddleware, TeacherEstudiantesController.getEstudiantes);
router.get('/teacher/students/:cedula', authMiddleware, TeacherEstudiantesController.getDetalleEstudiante);

module.exports = router;
