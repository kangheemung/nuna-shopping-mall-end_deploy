const mongoose = require('mongoose');
const User = require('./User');
const Schema = mongoose.Schema;
const CartSchema = Schema(
    {
        userId: { type: mongoose.ObjectId, ref: User },
        items: [
            {
                productId: { type: mongoose.ObjectId, ref: Product },
                size: { type: String, required: true },
                qty: { type: Number, default: 1, required: true },
            },
        ],
    },
    { timestamps: true }
);
CartSchema.methods.toJSON = function () {
    const obj = this._doc;
    delete obj.updateAt;
    return obj;
};
const CartSchema = mongoose.model('Cart', CartSchema);
module.exports = Cart;
