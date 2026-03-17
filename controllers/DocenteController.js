// controller/DocenteController.js
const DocenteModel = require('../model/DocenteModel');
const PermisosModel = require('../model/PermisosModel');

class DocenteController {
    async getDocentes(req, res) {
        try {
            if (req.user.id_rol !== 1) {
                return res.status(403).json({ 
                    success: false, 
                    message: 'Acceso denegado.' 
                });
            }
            const periodo = req.query.periodo;
            const docentes = await DocenteModel.getDocentes(periodo);
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

    async getPermisos(req, res) {
        try {
            const { cedula } = req.params;
            const permisos = await PermisosModel.getPermisosByDocente(cedula);
            res.json({ success: true, data: permisos });
        } catch (error) {
            console.error('Error getPermisos:', error);
            res.status(500).json({ success: false, message: 'Error al obtener permisos' });
        }
    }

    async savePermisos(req, res) {
        try {
            const { cedula } = req.params;
            const { secciones } = req.body; // Array de IDs de sección
            const cedula_creador = req.session.cedula || req.user.cedula;

            if (!Array.isArray(secciones) || secciones.length === 0) {
                return res.status(400).json({ success: false, message: 'Debe seleccionar al menos una sección' });
            }

            const results = [];
            for (const seccionId of secciones) {
                const result = await PermisosModel.createOrReactivatePermiso(cedula, seccionId, cedula_creador);
                results.push(result);
            }

            res.json({ success: true, message: 'Permisos asignados correctamente', results });
        } catch (error) {
            console.error('Error savePermisos:', error);
            res.status(500).json({ success: false, message: 'Error al guardar permisos' });
        }
    }

    async deletePermiso(req, res) {
        try {
            const { id } = req.params;
            const result = await PermisosModel.deletePermiso(id);
            res.json(result);
        } catch (error) {
            console.error('Error deletePermiso:', error);
            res.status(500).json({ success: false, message: 'Error al eliminar permiso' });
        }
    }
}

module.exports = new DocenteController();
