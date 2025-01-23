const express = require('express');
const Product = require('../models/Product');

const productController = {};

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
        const cond = name ? { name: { $regex: name, $options: 'i' } } : {};
        let query = Product.find(cond);
        const productList = await query.exec();
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
        res.status(200).json({ status: 'succuss', data: productList });
    } catch (err) {
        return res.status(400).json({ status: 'fail', error: err.message });
    }
};

module.exports = productController;
