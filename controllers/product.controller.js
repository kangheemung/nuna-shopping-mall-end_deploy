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
        const products = await Product.find({});
        res.status(200).json({ status: 'succuss', data: products });
    } catch (err) {
        return res.status(400).json({ status: 'fail', error: err.message });
    }
};

module.exports = productController;
