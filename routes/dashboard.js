const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/DashboardController');
const authMiddleware = require('../middleware/auth.middleware');

// Todas las rutas de dashboard están protegidas
router.use(authMiddleware);

router.get('/', dashboardController.getDashboardStats);
router.get('/student', dashboardController.getStudentDashboardStats);
router.get('/teacher', dashboardController.getTeacherDashboardStats);

module.exports = router;
