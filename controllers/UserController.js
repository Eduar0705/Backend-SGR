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

    async getProfile(req, res) {
        try {
            const cedula = req.user.cedula;
            const usuario = await UserModel.getByCedula(cedula);
            if (!usuario) {
                return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
            }
            res.json({ success: true, data: usuario });
        } catch (error) {
            console.error('Error getProfile:', error);
            res.status(500).json({ success: false, message: 'Error en el servidor' });
        }
    }

    async changePassword(req, res) {
        try {
            const cedula = req.user.cedula;
            const { newPassword } = req.body;
            if (!newPassword) {
                return res.status(400).json({ success: false, message: 'La nueva contraseña es obligatoria' });
            }
            const result = await UserModel.changePassword(cedula, newPassword);
            res.json(result);
        } catch (error) {
            console.error('Error changePassword:', error);
            res.status(500).json({ success: false, message: 'Error en el servidor' });
        }
    }
}

module.exports = new UserController();
