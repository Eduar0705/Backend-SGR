const { model: dashboardModel } = require('../model/DashboardModel');

class DashboardController {
    async getDashboardStats(req, res) {
        try {
            const periodo = req.query.periodo;
            const stats = await dashboardModel.getStats(periodo);

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

    async getStudentDashboardStats(req, res) {
        try {
            const { cedula } = req.user; // Obtenido del authMiddleware
            const stats = await dashboardModel.getStudentStats(cedula);

            return res.json({
                success: true,
                data: stats
            });
        } catch (error) {
            console.error('Error al obtener estadísticas estudiantiles:', error);
            return res.status(500).json({
                success: false,
                message: 'Error interno del servidor'
            });
        }
    }

    async getTeacherDashboardStats(req, res) {
        try {
            const { cedula } = req.user;
            const stats = await dashboardModel.getTeacherStats(cedula);

            return res.json({
                success: true,
                data: stats
            });
        } catch (error) {
            console.error('Error al obtener estadísticas del docente:', error);
            return res.status(500).json({
                success: false,
                message: 'Error interno del servidor'
            });
        }
    }

    async getAdvancedDashboardStats(req, res) {
        try {
            const { cedula } = req.user;
            const { roleId } = req.query;
            const stats = await dashboardModel.getAdvancedStats(cedula, parseInt(roleId));

            return res.json({
                success: true,
                data: stats
            });
        } catch (error) {
            console.error('Error al obtener estadísticas avanzadas:', error);
            return res.status(500).json({
                success: false,
                message: 'Error interno del servidor'
            });
        }
    }
}

module.exports = new DashboardController();
