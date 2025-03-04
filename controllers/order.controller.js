const express = require('express');
const Order = require('../models/Order');
const auth = require('../models/auth');
const { model } = require('mongoose');
const{randomStringGenerator} =require("../utils/randomStringGenerator");
const productController = require('./product.controller');
const orderController = {};
orderController.createOrder = async (req, res) => {
    try {
        //프론트엔드에서 데이터 보낸거 받아오기userId,totalPrice,shipTo,contact,orderList
        const { userId } = req; //user
        const { shipTo, contact, orderList, totalPrice } = req.body;
        //在庫確認＆アップデート
        const insufficientStockItems = await productController.checkItemListStock(orderList)
        // 재고가 충분하지 않음 =>에러
        if (insufficientStockItems.length > 0) {
            //errorメッセージ
            const errorMessage = insufficientStockItems.reduce((total, item) => (total += item.message),
            ''
            );
            throw new Error(errorMessage);
        }
        // 재고 충분함 =>오더
        //order作る
        const newOrder = new Order({
            userId,
            shipTo,
            contact,
            items: orderList,
            totalPrice,
            orderNum: randomStringGenerator(),
        });
        await new Order.save();

        res.status(200).json({status:"success",orderNum:newOrder.orderNum})
    } catch (e) {
        return res.status(400).json({ status: 'fail', message: error.message });
    }
};
model.exports = router;
