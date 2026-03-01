const express = require('express');
const router = express.Router();
const NotificacionController = require('../controllers/NotificacionController');
const authMiddleware = require('../middleware/auth.middleware');

router.get('/', authMiddleware, NotificacionController.getNotifications);
router.put('/:id/read', authMiddleware, NotificacionController.markAsRead);
router.put('/read-all', authMiddleware, NotificacionController.markAllAsRead);

module.exports = router;
