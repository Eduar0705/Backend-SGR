var express = require('express');
var router = express.Router();
const authController = require('../controllers/AuthController');

/* POST login */
router.post('/login', authController.login.bind(authController));

/* POST logout */
router.post('/logout', authController.logout.bind(authController));

/* POST request password recovery */
router.post('/request-recovery', authController.requestPasswordRecovery.bind(authController));

/* POST reset password */
router.post('/reset-password', authController.resetPassword.bind(authController));

module.exports = router;
