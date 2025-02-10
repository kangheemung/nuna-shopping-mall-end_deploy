const mongoose = require('mongoose');
const User = require('./User');
const Product = require('./Product');
const Schema = mongoose.Schema;

const cartSchema = Schema(
    {
        userId: { type: mongoose.ObjectId, ref: User },
        items: [
            {
                productId: { type: mongoose.ObjectId, ref: Product },
                size: { type: String, required: true },
                qty: { type: Number, require: true, default: 1 },
            },
        ],
    },
    { timestamps: true }
);
//modelの二重に指定したため、エラー発生したので、気をつけて作成する。

const Cart = mongoose.model('Cart', cartSchema);
module.exports = Cart;
