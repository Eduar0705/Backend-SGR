const ReportesModel = require('../model/ReportesModel');

class ReportesController {
    async getAdminStats(req, res) {
        try {
            // Llamamos al modelo para obtener todas las estadísticas requeridas por el frontend
            const stats = await ReportesModel.getAdminStats();
            
            res.json({
                success: true,
                stats: stats
            });
        } catch (error) {
            console.error('Error al obtener estadísticas de reportes:', error);
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor al generar los reportes'
            });
        }
    }
}

module.exports = new ReportesController();
