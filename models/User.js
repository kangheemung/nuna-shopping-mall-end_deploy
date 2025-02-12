const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const jwt = require('jsonwebtoken');
require('dotenv').config();
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

const userSchema = Schema(
    {
        email: { type: String, required: true, unique: true },
        //lowercase: true, trim: true },
        password: { type: String, required: true },
        name: { type: String, required: true },
        //권한 관리
        level: { type: String, default: 'customer' }, //2typs: customer, admin
    },
    { timestamps: true }
);
userSchema.methods.toJSON = function () {
    const obj = this._doc;
    delete obj._id;
    delete obj.password;
    delete obj.__v;
    delete obj.updatedAt;
    delete obj.createdAt;
    return obj;
};
//유저와 관련이 있는 목록 같이 메서드 정리
userSchema.methods.generateToken = async function () {
    const token = await jwt.sign({ _id: this.id }, JWT_SECRET_KEY, { expiresIn: '1d' });
    return token;
};
const User = mongoose.model('User', userSchema);
module.exports = User;
