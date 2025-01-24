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
        ///重複条件をまとめてやる
        let cond = name ? { name: { $regex: name, $options: 'i' } } : {};
        let query = Product.find(cond);
        // if (page) {
        //     query.skip((page - 1) * PAGE_SIZE).limit(PAGE_SIZE);
        //     const totalItemNum = await Product.find(cond).count();
        //     const totalPageNum = Math.ceil(totalItemNum / PAGE_SIZE);
        //     response.data = productList;
        // }
        // if (name) {
        //     const products = await Product.find({ name: { $regex: name, $options: 'i' } });
        // } else {
        //     const products = await Product.find({});
        // }

        // let response = { status: 'success' };

        const productList = await query.exec();
        // response.data = productList;
        return res.status(200).json({ data: productList });
    } catch (err) {
        return res.status(400).json({ status: 'fail', error: err.message });
    }
};

module.exports = productController;
