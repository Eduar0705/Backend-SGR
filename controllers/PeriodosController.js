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
    async createPeriodo(req, res) {
        try {
            const { codigo, fecha_inicio, fecha_fin, id_pensum } = req.body;
            await PeriodosModel.createPeriodo(codigo, fecha_inicio, fecha_fin, id_pensum);
            res.json({ success: true, message: "Periodo agregado exitosamente" });
        } catch (error) {
            console.error('Error getPensums:', error);
            res.status(500).json({ success: false, message: 'Error en el servidor obteniendo los datos. Por favor, intente de nuevo más tarde.' });
        }
    }
    async deletePeriodo(req, res) {
        try {
            const { codigo_periodo } = req.params;
            await PeriodosModel.deletePeriodo(codigo_periodo);
            res.json({ success: true, mensaje: "Se ha eliminado el periodo y sus datos asociados." });
        } catch (error) {
            console.error('Error deletePeriodos:', error);
            res.status(500).json({ success: false, message: 'Error al eliminar los periodos. Pruebe de nuevo más tarde, por favor.' });
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
    async createCorte(req, res) {
        try {
            const { fecha_inicio, fecha_fin, codigo_periodo, orden} = req.body;
            await PeriodosModel.createCorte(codigo_periodo, orden, fecha_inicio, fecha_fin);
            await PeriodosModel.syncCortesEvaluaciones(codigo_periodo);
            res.json({ success: true, mensaje: "Se han creado los cortes correctamente." });
        } catch (error) {
            console.error('Error createCorte:', error);
            res.status(500).json({ success: false, message: 'Error al crear cortes. Intente de nuevo mas tarde.' });
        }
    }
    async updateCorte(req, res) {
        try {
            const { codigo_periodo, orden } = req.params;
            const { fecha_inicio, fecha_fin} = req.body;
            await PeriodosModel.updateCorte(codigo_periodo, orden, fecha_inicio, fecha_fin);
            await PeriodosModel.syncCortesEvaluaciones(codigo_periodo);
            res.json({ success: true, mensaje: "Se han actualizado los cortes correctamente." });
        } catch (error) {
            console.error('Error getCortes:', error);
            res.status(500).json({ success: false, message: 'Error al actualizar cortes. Intente de nuevo mas tarde.' });
        }
    }
    async deleteCorte(req, res) {
        try {
            const { codigo_periodo, orden } = req.params;
            await PeriodosModel.deleteCorte(codigo_periodo, orden);
            res.json({ success: true, mensaje: "Se han eliminado los cortes correctamente." });
        } catch (error) {
            console.error('Error getCortes:', error);
            res.status(500).json({ success: false, message: 'Error al eliminar cortes. Intente de nuevo mas tarde.' });
        }
    }
     async getPensums(req, res) {
        try {
            const pensums = await PeriodosModel.getPensums();
            res.json({ success: true, data: pensums });
        } catch (error) {
            console.error('Error getPensums:', error);
            res.status(500).json({ success: false, message: 'Error en el servidor obteniendo los datos. Por favor, intente de nuevo más tarde.' });
        }
    }
}

module.exports = new PeriodosController();