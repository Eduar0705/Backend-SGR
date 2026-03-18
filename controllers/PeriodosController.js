const PeriodosModel = require('../model/PeriodosModel');

class PeriodosController {
    async getPeriodos(req, res) {
        try {
            const periodos = await PeriodosModel.getPeriodos();
            res.json({ success: true, data: periodos });
        } catch (error) {
            console.error('Error getPeriodos:', error);
            res.status(500).json({ success: false, message: 'Error en el servidor' });
        }
    }

    async getCortes(req, res) {
        try {
            const periodo = req.query.periodo ? req.query.periodo : req.user.periodo_usuario;
            const cortes = await PeriodosModel.getCortes(periodo);
            res.json({ success: true, cortes });
        } catch (error) {
            console.error('Error getCortes:', error);
            res.status(500).json({ success: false, message: 'Error al obtener cortes' });
        }
    }
}

module.exports = new PeriodosController();