const express = require('express');
const Product = require('../models/Product');
const productController = {};

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
        const PAGE_SIZE = 8;
        let skipItems = page ? (page - 1) * PAGE_SIZE : 0;
        let cond = name ? { name: { $regex: name, $options: 'i' } } : {};
        let query = Product.find(cond);
        let response = { status: 'success' };
        if (page) {
            //const totalItemNum = await Product.find(cond).count();
            const totalItemNum = await Product.countDocuments(cond);
            const totalPageNum = Math.ceil(totalItemNum / PAGE_SIZE);
            if (skipItems >= totalItemNum) {
                return res.status(200).json({ status: 'success', data: [], message: 'No more products to display' });
            }

            query.skip(skipItems).limit(PAGE_SIZE);
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
//データ詳細ページ
productController.detailProduct = async (req, res) => {
    try {
        const productId = req.params.id;
        const productDetail = await Product.findOne(
            { _id: productId },
            {
                sku: 1,
                name: 1,
                image: 1,
                price: 1,
                description: 1,
                stock: 1,
                category: 1,
            }
        );
        if (!productDetail) {
            return res.status(404).json({ status: 'fail', message: 'Product not found' });
        }
        res.status(200).json({ status: 'success', data: productDetail });
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
productController.deleteProduct = async (req, res) => {
    try {
        const productId = req.params.id;
        const productDelete = await Product.findByIdAndDelete({ _id: productId, isDeleted: true });
        if (!productDelete) {
            throw new Error('Product not found or already deleted');
        }
        res.status(200).json({ status: 'success', message: 'Product deleted successfully' });
    } catch (err) {
        return res.status(400).json({ status: 'fail', error: err.message });
    }
};
module.exports = productController;
