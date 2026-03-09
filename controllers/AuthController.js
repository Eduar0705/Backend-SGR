const userModel = require('../model/UserModel');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

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

            const loginResults = await userModel.login(cedula, password);

            if (loginResults && loginResults.length > 0) {
                const loggedUser = loginResults[0];

                const { password: _, ...userWithoutPassword } = loggedUser;

                //Obtener periodos y adjuntarlos en user
                const periodosSolic = await userModel.obtenerPeriodoActual(cedula, userWithoutPassword.id_rol);
                if (periodosSolic.success) {
                    userWithoutPassword.periodo_actual = periodosSolic.periodo_general
                    userWithoutPassword.periodo_usuario = periodosSolic.periodo_usuario ? periodosSolic.periodo_usuario : periodosSolic.periodo_general
                }
                else {
                    return res.status(401).json({
                        success: false,
                        message: 'Contraseña incorrecta'
                    });
                }
                // Generar token JWT
                const token = jwt.sign(
                    { cedula: loggedUser.cedula, id_rol: loggedUser.id_rol, 
                        periodo_actual: periodosSolic.periodo_general,
                        periodo_usuario: periodosSolic.periodo_usuario ? periodosSolic.periodo_usuario : periodosSolic.periodo_general },
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
                message: 'Error interno del servidor. Por favor, pruebe de nuevo más tarde.'
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

    async requestPasswordRecovery(req, res) {
        try {
            const { cedula, email } = req.body;
            if (!cedula || !email) {
                return res.status(400).json({ success: false, message: 'Cédula y correo son requeridos' });
            }

            const user = await userModel.getByCedula(cedula);
            if (!user || user.email.toLowerCase() !== email.toLowerCase()) {
                return res.status(404).json({ success: false, message: 'Los datos proporcionados no coinciden con nuestros registros' });
            }

            // Generar código de 6 dígitos
            const recoveryCode = Math.floor(100000 + Math.random() * 900000).toString();
            const expires = new Date(Date.now() + 15 * 60 * 1000); // 15 minutos

            await userModel.storeResetToken(cedula, recoveryCode, expires);

            // Enviar email (Configuración temporal)
            // NOTA: El usuario debe proporcionar credenciales SMTP reales para producción
            const transporter = nodemailer.createTransport({
                host: process.env.SMTP_HOST || 'smtp.gmail.com',
                port: process.env.SMTP_PORT || 587,
                secure: false,
                auth: {
                    user: process.env.SMTP_USER,
                    pass: process.env.SMTP_PASS
                }
            });

            const mailOptions = {
                from: `"SGR Soporte" <${process.env.SMTP_USER || 'no-reply@sgr.com'}>`,
                to: email,
                subject: 'Código de Recuperación de Contraseña - SGR',
                text: `Tu código de recuperación es: ${recoveryCode}. Expira en 15 minutos.`,
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
                        <h2 style="color: #076fe5; text-align: center;">Recuperación de Contraseña</h2>
                        <p>Hola, <strong>${user.nombre}</strong>.</p>
                        <p>Has solicitado recuperar tu contraseña en el Sistema de Gestión de Rúbricas (SGR).</p>
                        <div style="background-color: #f4f4f4; padding: 15px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 5px; margin: 20px 0;">
                            ${recoveryCode}
                        </div>
                        <p>Este código expira en <strong>15 minutos</strong>.</p>
                        <p>Si no solicitaste este cambio, puedes ignorar este correo.</p>
                        <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
                        <p style="font-size: 12px; color: #888; text-align: center;">Este es un correo automático, por favor no lo respondas.</p>
                    </div>
                `
            };

            // Intentamos enviar el correo. Si falla, al menos registramos el código en consola para desarrollo
            try {
                if (process.env.SMTP_USER && process.env.SMTP_PASS) {
                    await transporter.sendMail(mailOptions);
                    return res.json({ success: true, message: 'Código de recuperación enviado a tu correo' });
                } else {
                    console.log(`[AUTH] DEVELOPMENT MODE: Recovery code for ${cedula} is ${recoveryCode}`);
                    return res.json({
                        success: true,
                        message: 'Código generado (Modo Desarrollo). Ver consola del servidor.',
                        devCode: recoveryCode // Solo para desarrollo inicial
                    });
                }
            } catch (mailError) {
                console.error('Error enviando email:', mailError);
                return res.status(500).json({
                    success: false,
                    message: 'Error al enviar el correo, pero el código fue generado. Contacte al administrador.'
                });
            }

        } catch (error) {
            console.error('Error en requestPasswordRecovery:', error);
            return res.status(500).json({ success: false, message: 'Error interno del servidor' });
        }
    }

    async resetPassword(req, res) {
        try {
            const { cedula, code, newPassword } = req.body;
            if (!cedula || !code || !newPassword) {
                return res.status(400).json({ success: false, message: 'Todos los campos son requeridos' });
            }

            const isValid = await userModel.verifyResetToken(cedula, code);
            if (!isValid) {
                return res.status(400).json({ success: false, message: 'Código inválido o expirado' });
            }

            await userModel.changePassword(cedula, newPassword);
            await userModel.clearResetToken(cedula);

            return res.json({ success: true, message: 'Contraseña actualizada correctamente' });
        } catch (error) {
            console.error('Error en resetPassword:', error);
            return res.status(500).json({ success: false, message: 'Error interno del servidor' });
        }
    }
}

module.exports = new AuthController();
