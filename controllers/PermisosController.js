const PermisosModel = require('../model/PermisosModel');

class PermisosController {
    async getPermisosByDocente(req, res) {
        try {
            if (req.user.id_rol !== 1) {
                return res.status(403).json({ success: false, message: 'Acceso denegado.' });
            }
            const { cedula } = req.params;
            const periodo = req.query.periodo;
            const permisos = await PermisosModel.getPermisosByDocente(cedula, periodo);
            res.json({ success: true, data: permisos });
        } catch (error) {
            console.error('Error getPermisosByDocente:', error);
            res.status(500).json({ success: false, message: 'Error en el servidor' });
        }
    }

    async getPermisoById(req, res) {
        try {
            if (req.user.id_rol !== 1) {
                return res.status(403).json({ success: false, message: 'Acceso denegado.' });
            }
            const { id } = req.params;
            const permiso = await PermisosModel.getPermisoById(id);
            if (!permiso) return res.status(404).json({ success: false, message: 'Permiso no encontrado' });
            res.json({ success: true, data: permiso });
        } catch (error) {
            console.error('Error getPermisoById:', error);
            res.status(500).json({ success: false, message: 'Error en el servidor' });
        }
    }

    async createPermiso(req, res) {
        try {
            if (req.user.id_rol !== 1) {
                return res.status(403).json({ success: false, message: 'Acceso denegado.' });
            }
            const { docente_cedula, seccion_id } = req.body;
            if (!docente_cedula || !seccion_id) {
                return res.status(400).json({ success: false, message: 'Faltan datos requeridos (cédula del docente y sección)' });
            }
            const result = await PermisosModel.createOrReactivatePermiso(docente_cedula, seccion_id, req.user.cedula);
            res.json(result);
        } catch (error) {
            console.error('Error createPermiso:', error);
            res.status(500).json({ success: false, message: 'Error en el servidor' });
        }
    }

    async deletePermiso(req, res) {
        try {
            if (req.user.id_rol !== 1) {
                return res.status(403).json({ success: false, message: 'Acceso denegado.' });
            }
            const { id } = req.params;
            const result = await PermisosModel.deletePermiso(id);
            res.json(result);
        } catch (error) {
            console.error('Error deletePermiso:', error);
            res.status(500).json({ success: false, message: 'Error en el servidor' });
        }
    }
}

module.exports = new PermisosController();
