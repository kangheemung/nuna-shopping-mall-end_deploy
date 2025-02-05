const express = require('express');
const Cart = require('../models/Cart');
const cardController = {};

cardController.createCard = async (req, res) => {
    try {
        const { userId } = req;
        const { productId, size, qty } = req.body;

        //유저를 가지고 카트 찾기
        let cart = await Cart.findOne({ userId });
        if (!cart) {
            //유저가 만든 카트가 없다 , 만들어 주기
            cart = new Cart({ userId });
            await cart.save();
        }
        // 이미 카트에 들어가 있는 아이템이냐?productId,size
        const existItem = cart.items.find(
            //equalsを使う理由mongoose.ObjectId
            (item) => item.productId.equals(productId) && item.size === size
        );
        if (existItem) {
            throw new Error('already items in cart');
        }
        // 그렇타면 에러('이미 아이템이 카트에 있습니다.')
        //카트에 아이템 추가
        cart.items = [...cart.items, { productId, size, qty }];
        await cart.save();
        res.status(200).json({ status: 'success', data: cart, cartItemQty: cart.items, length });
    } catch (err) {
        return res.status(400).json({ status: 'fail', error: err.message });
    }
};
module.exports = cardController;
