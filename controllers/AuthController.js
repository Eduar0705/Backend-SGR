const userModel = require('../model/UserModel');
const jwt = require('jsonwebtoken');

class AuthController {
    async login(req, res) {
        try {
            const { cedula, password } = req.body;

            if (!cedula || !password) {
                return res.status(400).json({
                    success: false,
                    message: 'Cédula y contraseña son requeridas'
                });
            }

            const users = await userModel.login(cedula, password);

            if (users && users.length > 0) {
                const user = users[0];
                // Remover password de la respuesta
                const { password: _, ...userWithoutPassword } = user;
                
                // Generar token JWT
                const token = jwt.sign(
                    { cedula: user.cedula, id_rol: user.id_rol },
                    process.env.JWT_SECRET,
                    { expiresIn: process.env.JWT_EXPIRES_IN || '8h' }
                );
                
                return res.json({
                    success: true,
                    user: userWithoutPassword,
                    token
                });
            } else {
                return res.status(401).json({
                    success: false,
                    message: 'Credenciales incorrectas'
                });
            }
        } catch (error) {
            console.error('Error en login:', error);
            return res.status(500).json({
                success: false,
                message: 'Error interno del servidor'
            });
        }
    }
}

module.exports = new AuthController();
