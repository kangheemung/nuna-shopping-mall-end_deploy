const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const cartController = require('../controllers/cart.controller');
//token
router.post('/', authController.authenticate,  cartController.addToCart);
router.get('/', authController.authenticate,  cartController.getCart);
router.put('/:id', authController.authenticate,  cartController.editCartItem);
router.delete('/:id', authController.authenticate,  cartController.deleteCartItem);
router.get('/qty', authController.authenticate,  cartController.getCartQty);
module.exports = router;
