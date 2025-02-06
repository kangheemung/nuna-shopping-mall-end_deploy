const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const cardController = require('../controllers/cart.controller');
//token
router.post('/', authController.authenticate, authController.checkAdminPermission, cartController.addItemToCart);
router.get("/",authController.authenticate, authController.checkAdminPermission,cartController.getCart)
module.exports = router;
