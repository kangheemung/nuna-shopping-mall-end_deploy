const express = require('express');
const authController = require('../controllers/auth.controller');
const productController = require('../controllers/product.controller');
const router = express.Router();
//admin인지 아닌지 확인 
router.post('/', authController.authenticate,
authController.checkAdminPermission,
productController.createProduct
);

module.exports = router;
