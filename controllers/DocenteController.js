// controller/DocenteController.js
const DocenteModel = require('../model/DocenteModel');

class DocenteController {
    async getDocentes(req, res) {
        try {
            if (req.user.id_rol !== 1) {
                return res.status(403).json({ 
                    success: false, 
                    message: 'Acceso denegado.' 
                });
            }

            const docentes = await DocenteModel.getDocentes();
            res.json({ success: true, data: docentes });
        } catch (error) {
            console.error('Error getDocentes:', error);
            res.status(500).json({ success: false, message: 'Error en el servidor' });
        }
    }

    async createDocente(req, res) {
        try {
            if (req.user.id_rol !== 1) {
                return res.status(403).json({ success: false, message: 'Acceso denegado.' });
            }

            const { cedula, nombre, apellido, email, telefono, especialidad, notas } = req.body;

            if (!cedula || !nombre || !apellido || !email || !telefono || !especialidad) {
                return res.status(400).json({ success: false, message: 'Todos los campos obligatorios deben ser completados' });
            }

            const result = await DocenteModel.createDocente({ cedula, nombre, apellido, email, telefono, especialidad, notas });
            res.json(result);
        } catch (error) {
            console.error('Error createDocente:', error);
            res.status(500).json({ success: false, message: 'Error en el servidor' });
        }
    }

    async updateDocente(req, res) {
        try {
            if (req.user.id_rol !== 1) {
                return res.status(403).json({ success: false, message: 'Acceso denegado.' });
            }

            const cedula_og = req.params.cedula;
            const result = await DocenteModel.updateDocente(cedula_og, req.body);
            res.json(result);
        } catch (error) {
            console.error('Error updateDocente:', error);
            res.status(500).json({ success: false, message: 'Error en el servidor' });
        }
    }

    async deleteDocente(req, res) {
        try {
            if (req.user.id_rol !== 1) {
                return res.status(403).json({ success: false, message: 'Acceso denegado.' });
            }

            const { cedula } = req.params;
            const result = await DocenteModel.deleteDocente(cedula);
            res.json(result);
        } catch (error) {
            console.error('Error deleteDocente:', error);
            res.status(500).json({ success: false, message: 'Error en el servidor' });
        }
    }
}

module.exports = new DocenteController();
