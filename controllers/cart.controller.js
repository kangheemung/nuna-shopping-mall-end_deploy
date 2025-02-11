const express = require('express');
const Cart = require('../models/Cart');
const cartController = {};

cartController.addToCart = async (req, res) => {
    try {
        const { userId } = req;
        const { productId, size, qty } = req.body;
        //유저를 가지고 카트 찾기
        if (!size) {
            return res.status(400).json({ status: 'fail', message: 'Size is required' });
        }
        let cart = await Cart.findOne({ userId });
        if (!cart) {
            //유저가 만든 카트가 없다 , 만들어 주기
            cart = new Cart({ userId });
            await cart.save();
        }

        // 이미 카트에 들어가 있는 아이템이냐?productId,size
        const existItem = cart.items.find((item) => item.productId.equals(productId) && item.size === size); //equalsを使う理由mongoose.ObjectId/type
        if (existItem) {
            throw new Error('already items in cart');
        }
        // 그렇타면 에러('이미 아이템이 카트에 있습니다.')
        //카트에 아이템 추가
        cart.items = [...cart.items, { productId, size, qty }];
        await cart.save();
        res.status(200).json({ status: 'success', data: cart, cartItemQty: cart.items.length });
    } catch (error) {
        return res.status(400).json({ status: 'fail', message: error.message });
    }
};

cartController.getCart = async (req, res) => {
    try {
        const { userId } = req;
        const cart = await Cart.findOne({ userId }).populate({
            path: 'items',
            populate: {
                path: 'productId',
                model: 'Product',
            },
        });
        //정보도 같이 들고와 줄래items안에 있는 프로덕트 자세한 정보 .populate
        // {
        //     userId: { type: mongoose.ObjectId, ref: User },
        //     items: [
        //         {
        //             productId: { type: mongoose.ObjectId, ref: Product },
        //             size: { type: String, required: true },
        //             qty: { type: Number, require: true, default: 1 },
        //         },
        //     ],
        // },
        if (!cart) {
            return res.status(404).json({ status: 'fail', message: 'Cart not found' });
        }
        res.status(200).json({ status: 'success', data: cart.items });
    } catch (error) {
        return res.status(400).json({ status: 'fail', error: error.message });
    }
};
cartController.detailCart = async (req, res) => {
    try {
        const { userId } = req;
        const { productId, size, qty } = req.body;
        const cartDetail = await Cart.findOne({ userId, productId });
        if (!cartDetail) {
            return res.status(404).json({ status: 'fail', message: 'Cart item not found' });
        }
    } catch (error) {
        return res.status(400).json({ status: 'fail', error: error.message });
    }
};
cartController.updateCart = async (req, res) => {
    try {
        const productId = req.params.id;
        const { size, qty } = req.body;
        const cartDetailedit = await Cart.findByIdAndUpdate({ _id: productId }, { size, qty }, { new: true });
        if (!cartDetailedit) {
            throw new Error("Item doesn't exist");
        }
        res.status(200).json({ status: 'success', data: cartEdit });
    } catch (error) {
        return res.status(400).json({ status: 'fail', error: error.message });
    }
};
cartController.deleteCart = async (req, res) => {
    try {
        const productId = req.params.id;
        const cartDelete = await Product.findByIdAndUpdate({ _id: productId }, { isDeleted: true });
        if (!cartDelete) {
            throw new Error('Product not found or already deleted');
        }
        res.status(200).json({ status: 'success', message: 'Product deleted successfully' });
    } catch (err) {
        return res.status(400).json({ status: 'fail', message: 'Size is required' });
    }
};
module.exports = cartController;
