const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
const authController = {};

authController.loginWithEmail = async (req, res) => {
    try {
        const { email, password } = req.body;
        let user = await User.findOne({ email }, '-createdAt -updatedAt -__v');
        if (user) {
            const isMatch = await bcrypt.compare(password, user.password);
            if (isMatch) {
                const token = await user.generateToken();
                return res.status(200).json({ status: 'success', user, token });
            }
        }
        throw new Error('Invalid email or password');
    } catch (err) {
        return res.status(400).json({ status: 'fail', error: err.message });
    }
};
authController.authenticate = async (req, res, next) => {
    try {
        const tokenString = req.headers.authorization;
        if (!tokenString) {
            throw new Error('token not found');
        }
        const token = tokenString.replace('Bearer ', '');
        jwt.verify(token, JWT_SECRET_KEY, (err, payload) => {
            if (err) throw new Error('invalid token');
            req.userId = payload._id; // 토큰에서 사용자 ID 추출 후 저장 => req에 담아서 next로 보내기
        });
        next(); // 다음 미들웨어로 이동
    } catch (err) {
        return res.status(400).json({ status: 'fail', error: err.message });
    }
};

module.exports = authController;
