const express = require('express');
const Order= require('../models/Order');
const productController = require('./product.controller');
const orderController = {};
orderController.createOrder=async(req,res)=>{
    try{
        const {userId}=req;
        const {shipTo,contact,orderList,totalPrice} = req.body;
        const insufficientStockItems = await productController.checkItemListStock(
            orderList
        );
        if(insufficientStockItems.length>0){
            const errorMessage= insufficientStockItems.reduce(
                (total,item)=>(total+=item.message),
                ""
            );
            throw new Error(errorMessage);
        }
    }catch(e){
        return res.status(400).json({ status: 'fail', message: error.message });
    }
}