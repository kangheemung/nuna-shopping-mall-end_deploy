const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const productController = require('../controllers/product.controller');

//admin인지 아닌지 확인
router.post('/', authController.authenticate, productController.createProduct);
router.get('/', productController.getProducts);
//商品詳細ページ
router.get('/:id', authController.authenticate, productController.detailProduct);

//管理者のみ修正できます。
router.put('/:id', authController.authenticate, productController.updateProduct);
router.delete('/:id', authController.authenticate, productController.deleteProduct);

module.exports = router;
