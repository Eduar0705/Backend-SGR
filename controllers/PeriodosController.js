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
}

module.exports = new PeriodosController();