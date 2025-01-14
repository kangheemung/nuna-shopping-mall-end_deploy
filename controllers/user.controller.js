const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
const userController = {};
userController.createUser = async (req, res) => {
    try {
        const { name, email, password, level } = req.body;
        const user = await User.findOne({ email });
        if (user) {
            throw new Error('User already exists');
        }
        const salt = await bcrypt.genSaltSync(10);
        const hash = await bcrypt.hashSync(password, salt);
        const newUser = new User({
            name,
            email,
            password: hash,
            level: level ? level : 'customer',
        }); // Updated line to use default value for level
        await newUser.save();
        const token = await newUser.generateToken();
        return res.status(200).json({ status: 'success', user: newUser, token });
    } catch (err) {
        return res.status(400).json({ status: 'fail', error: err.message });
    }
};
userController.getUser = async (req, res) => {
    try {
        const { userId } = req;
        if (!userId) {
            throw new Error('User ID not provided');
        }
        const user = await User.findById(userId);
        if (user) {
            const token = user.generateToken();
            return res.status(200).json({ status: 'success', user });
        }
        throw new Error('Invalid token');
    } catch (err) {
        return res.status(400).json({ status: 'fail', error: err.message });
    }
};

module.exports = userController;
