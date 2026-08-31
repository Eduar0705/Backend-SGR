var express = require('express');
const rateLimit = require('express-rate-limit');
var router = express.Router();
const authController = require('../controllers/AuthController');
const loginLimiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 minutos de timeout
    max: 5,
    message: { success: false, message: 'Demasiados intentos. Intente en 15 minutos.' }
});

/* POST login */
router.post('/login', loginLimiter, authController.login.bind(authController));

/* POST logout */
router.post('/logout', authController.logout.bind(authController));

/* POST request password recovery */
router.post('/request-recovery', authController.requestPasswordRecovery.bind(authController));

/* POST reset password */
router.post('/reset-password', authController.resetPassword.bind(authController));

module.exports = router;
