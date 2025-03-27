const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');

router.post('/login', authController.loginWithEmail);
//google 로그인
router.post('/google', authController.loginWithGoogle);

module.exports = router;
