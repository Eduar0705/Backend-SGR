const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/DashboardController');
const authMiddleware = require('../middleware/auth.middleware');

router.use(authMiddleware);

router.get('/stats', dashboardController.getDashboardStats);
router.get('/student', dashboardController.getStudentDashboardStats);
router.get('/teacher', dashboardController.getTeacherDashboardStats);
router.get('/advanced-stats', dashboardController.getAdvancedDashboardStats);

module.exports = router;
