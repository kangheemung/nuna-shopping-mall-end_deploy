
const express = require('express');
const Order = require('../models/Order');
const{randomStringGenerator} =require("../utils/randomStringGenerator");
const productController = require('./product.controller');
const orderController = {};
orderController.createOrder = async (req, res) => {
    try {
        //프론트엔드에서 데이터 보낸거 받아오기userId,totalPrice,shipTo,contact,orderList
        const { userId } = req; //user
        const { shipTo, contact, orderList, totalPrice } = req.body;
        //在庫確認＆アップデート
        const insufficientStockItems = await productController.checkItemListStock(
            orderList
            );
        // 재고가 충분하지 않음 =>에러
        if (insufficientStockItems.length > 0) {
            //errorメッセージ
            const errorMessage = insufficientStockItems.reduce(
                (total, item) => (total += item.message),
              ""
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

        await newOrder.save();
        //save후에 카트를 비우자


        res.status(200).json({status:"success",orderNum: newOrder.orderNum})
    } catch (e) {
        return res.status(400).json({ status: 'fail', message: e.message });
    }

};
const PAGE_SIZE = 10; 
orderController.getOrder = async (req, res, next) => {
  try {
    const { userId } = req;
    const orderListQuery = Order.find({ userId: userId }).populate({
      path: "items",
      populate: {
        path: "productId",
        model: "Product",
        select: "image name",
      },
    });
    const [orderList, totalItemNum] = await Promise.all([
      orderListQuery,
      Order.countDocuments({ userId: userId })
    ]);
    const totalPageNum = Math.ceil(totalItemNum / PAGE_SIZE);
    res.status(200).json({ status: "success", data: orderList, totalPageNum });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ status: "fail", error: error.message });
  }
};
orderController.getOrderList = async (req, res, next) => {
  try {
    const { page, ordernum } = req.query;

    let cond = {};
    if (ordernum) {
      cond = {
        orderNum: { $regex: ordernum, $options: "i" },
      };
    }
    const pageNumber = parseInt(page);
    const orderList = await Order.find(cond)
      .populate("userId")
      .populate({
        path: "items",
        populate: {
          path: "productId",
          model: "Product",
          select: "image name",
        },
      })
      .skip((pageNumber - 1) * PAGE_SIZE)
      .limit(PAGE_SIZE);
    const totalItemNum = await Order.find(cond).count();

    const totalPageNum = Math.ceil(totalItemNum / PAGE_SIZE);
    res.status(200).json({ status: "success", data: orderList, totalPageNum });
  } catch (error) {
    return res.status(400).json({ status: "fail", error: error.message });
  }
};

orderController.updateOrder = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(
      id,
      { status: status },
      { new: true }
    );
    if (!order) throw new Error("Can't find order");

    res.status(200).json({ status: "success", data: order });
  } catch (error) {
    return res.status(400).json({ status: "fail", error: error.message });
  }
};

module.exports = orderController;

