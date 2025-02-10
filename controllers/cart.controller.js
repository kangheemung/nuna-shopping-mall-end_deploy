const express = require('express');
const  Cart  = require('../models/Cart');
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
        cart.items.push({ productId, size, qty });
        await cart.save();
        res.status(200).json({ status: 'success', data: cart, cartItemQty: cart.items.length });
    } catch (error) {
            return res.status(400).json({ status: 'fail', message: error.message });
    }
};

cartController.getCart = async (req, res) => {
    try {
        const { userId } = req;
        const cart = await Cart.findOne({ userId });
        if (!cart) {
            return res.status(404).json({ status: 'fail', message: 'Cart not found' });
        }
        res.status(200).json({ status: 'success', data: cart.items });
    } catch (error) {
        return res.status(400).json({ status: 'fail', error: error.message });
    }
};
module.exports = cartController;
