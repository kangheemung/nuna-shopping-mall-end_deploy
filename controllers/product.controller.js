const express = require('express');
const Product = require('../models/Product');
const productController = {};
const PAGE_SIZE = 6;
//商品のデータ作成できます。
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
//データ持ってくる
productController.getProducts = async (req, res) => {
    try {
        const { page, name } = req.query;
        ///重複条件をまとめてやる
        let cond = name ? { name: { $regex: name, $options: 'i' } } : {};
        let query = Product.find(cond);
        let response = { status: 'success' };
        if (page) {
            query.skip((page - 1) * PAGE_SIZE).limit(PAGE_SIZE);
            //const totalItemNum = await Product.find(cond).count();
            const totalItemNum = await Product.countDocuments(cond);
            const totalPageNum = Math.ceil(totalItemNum / PAGE_SIZE);
            response.totalPageNum = totalPageNum;
        }
        // if (name) {
        //     const products = await Product.find({ name: { $regex: name, $options: 'i' } });
        // } else {
        //     const products = await Product.find({});
        // }

        const productList = await query.exec();
        response.data = productList;
        return res.status(200).json(response);
    } catch (err) {
        return res.status(400).json({ status: 'fail', error: err.message });
    }
};
//データ編集できます。
productController.updateProduct = async (req, res) => {
    try {
        const productId = req.params.id;
        const { sku, name, image, price, description, stock, category, status } = req.body;
        const productEdit = await Product.findByIdAndUpdate(
            { _id: productId },
            { sku, name, image, price, description, stock, category, status },
            { new: true }
        );
        if (!productEdit) {
            throw new Error("Item doesn't exist");
        }
        res.status(200).json({ status: 'success', data: productEdit });
    } catch (err) {
        return res.status(400).json({ status: 'fail', error: err.message });
    }
};

module.exports = productController;
