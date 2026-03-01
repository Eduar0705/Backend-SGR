const NotificacionModel = require('../model/NotificacionModel');

class NotificacionController {
    async getNotifications(req, res) {
        try {
            const cedula = req.user.cedula;
            const notifications = await NotificacionModel.getByUsuario(cedula);
            const unreadCount = notifications.filter(n => !n.leido).length;

            res.json({
                success: true,
                data: {
                    notifications,
                    unreadCount
                }
            });
        } catch (error) {
            console.error('Error getNotifications:', error);
            res.status(500).json({ success: false, message: 'Error al obtener notificaciones' });
        }
    }

    async markAsRead(req, res) {
        try {
            const { id } = req.params;
            await NotificacionModel.markAsRead(id);
            res.json({ success: true, message: 'Notificación marcada como leída' });
        } catch (error) {
            console.error('Error markAsRead:', error);
            res.status(500).json({ success: false, message: 'Error al actualizar notificación' });
        }
    }

    async markAllAsRead(req, res) {
        try {
            const cedula = req.user.cedula;
            await NotificacionModel.markAllAsRead(cedula);
            res.json({ success: true, message: 'Todas las notificaciones marcadas como leídas' });
        } catch (error) {
            console.error('Error markAllAsRead:', error);
            res.status(500).json({ success: false, message: 'Error al actualizar notificaciones' });
        }
    }
}

module.exports = new NotificacionController();
