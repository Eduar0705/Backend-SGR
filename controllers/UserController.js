const UserModel = require('../model/UserModel');

class UserController {
    async getUsuarios(req, res) {
        try {
            if (req.user.id_rol !== 1) {
                return res.status(403).json({ success: false, message: 'Acceso denegado.' });
            }
            const usuarios = await UserModel.getAll();
            res.json({ success: true, data: usuarios });
        } catch (error) {
            console.error('Error getUsuarios:', error);
            res.status(500).json({ success: false, message: 'Error en el servidor' });
        }
    }

    async createUsuario(req, res) {
        try {
            if (req.user.id_rol !== 1) {
                return res.status(403).json({ success: false, message: 'Acceso denegado.' });
            }

            const { cedula, nombre, apellido, email, password, rol } = req.body;
            if (!cedula || !nombre || !email || !password || !rol) {
                return res.status(400).json({ status: 'error', mensaje: 'Todos los campos son obligatorios' });
            }

            const result = await UserModel.create({ cedula, nombre, apellido, email, password, rol });
            res.json(result);
        } catch (error) {
            console.error('Error createUsuario:', error);
            res.status(500).json({ status: 'error', mensaje: 'Error en el servidor' });
        }
    }

    async updateUsuario(req, res) {
        try {
            if (req.user.id_rol !== 1) {
                return res.status(403).json({ success: false, message: 'Acceso denegado.' });
            }

            const cedulaOriginal = req.params.cedula || req.body.cedulaOriginal;
            const result = await UserModel.update(cedulaOriginal, req.body);
            res.json(result);
        } catch (error) {
            console.error('Error updateUsuario:', error);
            res.status(500).json({ status: 'error', mensaje: 'Error en el servidor' });
        }
    }

    async deleteUsuario(req, res) {
        try {
            if (req.user.id_rol !== 1) {
                return res.status(403).json({ success: false, message: 'Acceso denegado.' });
            }

            const { cedula } = req.params;
            const result = await UserModel.delete(cedula);
            res.json(result);
        } catch (error) {
            console.error('Error deleteUsuario:', error);
            res.status(500).json({ status: 'error', mensaje: 'Error en el servidor' });
        }
    }
}

module.exports = new UserController();
