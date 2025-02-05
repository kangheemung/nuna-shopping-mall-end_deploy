const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const cardController = require('../controllers/cart.controller');
//token
router.post('/', authController.authenticate, authController.checkAdminPermission, cardController.createCard);
module.exports = router;
