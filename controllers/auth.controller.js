const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
const { OAuth2Client } = require('google-auth-library');
const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID;
const authController = {};
authController.loginWithEmail = async (req, res) => {
    try {
        const { email, password } = req.body;
        let user = await User.findOne({ email });
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
authController.loginWithGoogle = async (req, res) => {
    try {
        const { token } = req.body;
        const oAuth2Client = new OAuth2Client(GOOGLE_CLIENT_ID);
        //해석
        const ticket = await oAuth2Client.verifyIdToken({
            idToken: token,
            audience: GOOGLE_CLIENT_ID,
        });
        //* 4.백엔드에서 로그인 하기
        // 토큰 값을 읽어와서 => 유저정보를 뽑아내고 email
        const { email, name } = ticket.getPayload();
        console.log('eee', email, name);
        // google Auth Library
        let user = await User.findOne({ email });
        if (!user) {
            //유저를 새로 생성
            const randomPassword = '' + Math.floor(Math.random() * 100000000);
            const salt = await bcrypt.genSalt(10);
            const newPassword = await bcrypt.hash(randomPassword, salt);
        user = new User({
            name,
            email,
            password: newPassword,
        }); // Updated line to use default value for level
        await user.save();
        //토큰 발행
    }

    const sessionToken = await user.generateToken();
    res.status(200).json({ status: 'success', user, token: sessionToken });
        // a.이미 로그인을 한적이 있는 유저 => 로그인 시키고 토큰값 주면 ok
        // b.처음 로그인 시도를 한 유저=> 유저정보 먼저 새로생성 => 토큰값
    } catch (err) {
        // Handle any errors that occur during the process
        return res.status(400).json({ status: 'fail', error: err.message });
    }
};
authController.authenticate = async (req, res, next) => {
    try {
        const tokenString = req.headers.authorization;

        if (!tokenString) throw new Error('token not found');

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
//checks admin user
authController.checkAdminPermission = async (req, res, next) => {
    try {
        const { userId } = req; //토큰 값에서 유저를 찾아라
        const user = await User.findById(userId);
        if (user.level !== 'admin') throw new Error('no permission');
        next();
    } catch (err) {
        return res.status(400).json({ status: 'fail', error: err.message });
    }
};
module.exports = authController;
