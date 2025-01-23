const express = require('express');
const Product = require('../models/Product');

const productController = {};
const PAGE_SIZE = 1;
productController.createProduct = async (req, res) => {
    try {
        const { sku, name, image, price, description, stock, category, status } = req.body;
        const product = new Product({
            sku,
            name,
            image,
            price,
            description,
            stock,
            category,
            status,
        });
        await product.save();
        res.status(200).json({ status: 'success', product });
    } catch (err) {
        return res.status(400).json({ status: 'fail', error: err.message });
    }
};
productController.getProducts = async (req, res) => {
    try {
        const { page, name } = req.query;

        const cond = name ? { name: { $regex: name, $options: 'i' }, isDeleted: false } : { isDeleted: false };
        let query = Product.find(cond);
        let res = { status: 'success' };
        if (page) {
            query = query.skip((page - 1) * PAGE_SIZE).limit(5); //最後の5データを見せる
            //最終何ページがあるか
            // 全データページデータが何データあるか
            const totalItemNum = await Product.find(cond).count();
            // 全てのデータ個数
            const totalPageNum = Math.ceil(totalItemNum / PAGE_SIZE);
            res.totalPageNum = totalPageNum;
        }
        const productList = await query.exec();
        res.data = productList;
        // if (name){
        //     const products =await Product.find({name:{$regex:name,$option:"i"}})
        // }else {
        //     const products=await Product.find({});
        // }
        // else if(page){
        //     if (name){
        //         const products =await Product.find({name:{$regex:name,$option:"i"}}).limit();
        //     }else{
        //         products=awaitProduct.find().limit;
        //     }
        //}
        // const products = await Product.find({});
        return res.status(200).json(res);
    } catch (err) {
        return res.status(400).json({ status: 'fail', error: err.message });
    }
};

module.exports = productController;
