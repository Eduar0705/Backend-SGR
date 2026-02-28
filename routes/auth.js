var express = require('express');
var router = express.Router();
const authController = require('../controllers/AuthController');

/* POST login */
router.post('/login', authController.login.bind(authController));

module.exports = router;
