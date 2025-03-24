const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const orderController = require('../controllers/order.controller');
//token
//api/order
router.post('/', authController.authenticate, orderController.createOrder);
router.get('/', authController.authenticate, orderController.getOrderList);
router.get('/me', authController.authenticate, orderController.getOrder);

router.put('/:id', authController.authenticate, authController.checkAdminPermission, orderController.updateOrder);

module.exports = router;
