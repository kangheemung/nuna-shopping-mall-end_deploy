//user api
const express = require('express');
const router = express.Router();
// Update the import statement to correctly match the UserController.js file
const userController = require('../controllers/user.controller');
const authController = require('../controllers/auth.controller');

//회원가입

router.post('/', userController.createUser);
router.get("/me",authController.authenticate,userController.getUser);//토큰이 vaild한 토큰인지 이 token가지고 유저를 
module.exports = router;
