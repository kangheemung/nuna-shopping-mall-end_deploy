const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const productSchema = Schema(
    {
        sku: { type: String, require: true, unique: true },
        name: { type: String, require: true },
        image: { type: String, require: true },
        price: { type: Number, require: true },
        description: { type: String, require: true },
        stock: { type: Object, require: true },
        category: { type: Array, require: true },
        status: { type: String, default: 'active' },
        isDeleted: { type: Boolean, default: false },
    },
    { timestamps: true }
);
productSchema.methods.toJSON = function () {
    const obj = this._doc;
    return obj;
};
const Product = mongoose.model('.productSchema');
module.exports = Product;
