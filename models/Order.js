const mongoose = require('mongoose');
const User = require('./User');
const Product = require('./Product');
const Cart= require('./Cart');
const Schema = mongoose.Schema;
const orderSchema = Schema(
    {
        userId: { type: mongoose.ObjectId, ref: User },
        status: { type: String, default: 'preparing' },
        totalPrice: { type: Number, default: 0, required: true },
        //연락처
        contact: { type: Object, required: true},
        //도시정보
        shipTo: { type: Object, required: true },
        orderNum:{ type: String },
        items: [
            {
                productId: { type: mongoose.ObjectId, ref: Product },
                price: { type: Number, required: true },
                qty: { type: Number, default: 1, required: true },
                size: {type: String, required: true},
            },
        ],
    },
    { timestamps: true }
);
orderSchema.methods.toJSON = function () {
    const obj = this._doc;
    delete obj.__v;
    delete obj.updatedAt;
    return obj;
  };
  orderSchema.post("save", async function(){
    //카트를 비워주자userId를 기준으로.
    const cart = await Cart.findOne({userId:this.userId})
    cart.items = [];
    await cart.save();
});
const Order = mongoose.model('Order', orderSchema);
module.exports = Order;
