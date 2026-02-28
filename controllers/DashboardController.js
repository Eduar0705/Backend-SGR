const dashboardModel = require('../model/DashboardModel');

class DashboardController {
    async getDashboardStats(req, res) {
        try {
            const stats = await dashboardModel.getStats();
            
            return res.json({
                success: true,
                data: stats
            });
        } catch (error) {
            console.error('Error al obtener estadísticas del dashboard:', error);
            return res.status(500).json({
                success: false,
                message: 'Error interno del servidor al obtener las estadísticas'
            });
        }
    }
}

module.exports = new DashboardController();
