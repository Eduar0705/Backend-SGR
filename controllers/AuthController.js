const userModel = require('../model/UserModel');
const jwt = require('jsonwebtoken');

class AuthController {
    async login(req, res) {
        try {
            const { cedula, password } = req.body;
            console.log(`[AUTH] Login attempt - Cedula: ${cedula}, Password: ${password}`);

            if (!cedula || !password) {
                console.log('[AUTH] Missing credentials');
                return res.status(400).json({
                    success: false,
                    message: 'Cédula y contraseña son requeridas'
                });
            }

            const user = await userModel.getByCedula(cedula);
            console.log('[AUTH] User found in DB:', user ? 'YES' : 'NO');

            if (!user) {
                return res.status(401).json({
                    success: false,
                    message: 'Usuario no encontrado'
                });
            }

            // En este sistema las contraseñas están en texto plano según la migración de sistems-rubrica
            // Primero intentamos login directo con password (esto verifica password en la DB)
            const loginResults = await userModel.login(cedula, password);

            // 1) Verify existing session. Is user already logged in somewhere else?
            if (loginResults && loginResults.length > 0) {
                const loggedUser = loginResults[0];

                const existingToken = await userModel.getSessionToken(loggedUser.cedula);
                if (existingToken) {
                    try {
                        const decoded = jwt.verify(existingToken, process.env.JWT_SECRET);
                        // If it doesn't throw, the token is still valid. Deny login!
                        if (decoded) {
                            return res.status(401).json({
                                success: false,
                                message: 'Esta session esta abierta no puedes ingresar hasta que la otra session se cierres'
                            });
                        }
                    } catch (e) {
                        // Token expired or invalid. Safe to let them login and overwrite.
                        console.log(`[AUTH] Old session token expired for ${loggedUser.cedula}`);
                    }
                }

                // Remover password de la respuesta
                const { password: _, ...userWithoutPassword } = loggedUser;
                
                // Generar token JWT
                const token = jwt.sign(
                    { cedula: loggedUser.cedula, id_rol: loggedUser.id_rol },
                    process.env.JWT_SECRET,
                    { expiresIn: process.env.JWT_EXPIRES_IN || '8h' }
                );
                
                // Guardar la nueva sesion en la BD
                await userModel.updateSessionToken(loggedUser.cedula, token);

                return res.json({
                    success: true,
                    user: userWithoutPassword,
                    token
                });
            } else {
                return res.status(401).json({
                    success: false,
                    message: 'Contraseña incorrecta'
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

    async logout(req, res) {
        try {
            const { cedula } = req.body;
            if (!cedula) {
                return res.status(400).json({ success: false, message: 'Cédula es requerida para cerrar sesión' });
            }
            
            await userModel.clearSessionToken(cedula);
            
            return res.json({
                success: true,
                message: 'Sesión cerrada correctamente'
            });
        } catch (error) {
            console.error('Error en logout:', error);
            return res.status(500).json({
                success: false,
                message: 'Error interno del servidor al cerrar sesión'
            });
        }
    }
}

module.exports = new AuthController();
