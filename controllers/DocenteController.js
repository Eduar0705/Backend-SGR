// controller/DocenteController.js
const DocenteModel = require('../model/DocenteModel');

class DocenteController {
    async getDocentes(req, res) {
        try {
            // Validamos que el token decodificado (req.user) sea admin
            if (req.user.id_rol !== 1) {
                return res.status(403).json({ 
                    success: false, 
                    message: 'Acceso denegado.' 
                });
            }

            const docentes = await DocenteModel.getDocentes();
            
            // Enviamos la respuesta con la estructura que espera el frontend
            res.json({ 
                success: true, 
                data: docentes 
            });
        } catch (error) {
            console.error('Error:', error);
            res.status(500).json({ success: false, message: 'Error en el servidor' });
        }
    }
}

module.exports = new DocenteController();
