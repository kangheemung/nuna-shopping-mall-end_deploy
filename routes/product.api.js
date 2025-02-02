const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const productController = require('../controllers/product.controller');

//admin인지 아닌지 확인
router.post('/', authController.authenticate, authController.checkAdminPermission, productController.createProduct);
router.get('/', productController.getProducts);
//管理者のみ修正できます。
router.put('/:id',authController.authenticate, authController.checkAdminPermission,productController.updateProduct)
router.delete('/:id',authController.authenticate, authController.checkAdminPermission,productController.deleteProduct)
module.exports = router;
