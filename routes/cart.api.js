const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const cartController = require('../controllers/cart.controller');
//token
router.post('/', authController.authenticate, authController.checkAdminPermission, cartController.addToCart);
router.get('/', authController.authenticate, authController.checkAdminPermission, cartController.getCart);
router.get('/:id', authController.authenticate, authController.checkAdminPermission, cartController.detailCart);
module.exports = router;
