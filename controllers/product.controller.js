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
        let response = { status: 'success' };
        ///重複条件をまとめてやる
        const PAGE_SIZE = 8;
        let cond = name ? { name: { $regex: name, $options: 'i' } } : { isDeleted: false };
        let query = Product.find(cond);
        if (page) {
            const skipItems = (page - 1) * PAGE_SIZE;
            query = query.skip(skipItems).limit(PAGE_SIZE);
            //const totalItemNum = await Product.find(cond).count();
            const totalItemNum = await Product.countDocuments(cond);
            const totalPageNum = Math.ceil(totalItemNum / PAGE_SIZE);
            // if (skipItems >= totalItemNum) {
            //     return res.status(200).json({ status: 'success', data: [], message: 'No more products to display' });
            // }
            response.totalPageNum = totalPageNum;
        }
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
        const productDetail = await Product.findById(productId);
        if (!productDetail) throw new Error('No item found');
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
        const productDelete = await Product.findByIdAndUpdate({ _id: productId }, { isDeleted: true });
        if (!productDelete) {
            throw new Error('Product not found or already deleted');
        }
        res.status(200).json({ status: 'success', message: 'Product deleted successfully' });
    } catch (err) {
        if (!size) {
            return res.status(400).json({ status: 'fail', message: 'Size is required' });
        }
    }
};
productController.checkStock = async(item) => {
//買おうとする在庫データ持ってくる。
const product = await Product.findById(item.productId)
//買おうとするqty,在庫比較
    if(product.stock[item.size]< item.qty){
        return { isVerify: false, message:`${product.name}の${item.size}の在庫が足りないです。`};
    }
    //在庫が不十分であればメッセージとデータ返す
    const newStock = {...product.stock}
    //十分であれば 在庫で-qtyして、成功
    newStock[item.size] -= item.qty
    product.stock = newStock
    await product.save()

    return {isVerify: true}

}
productController.checkItemListStock= async(itemList)=>{
    const insufficientStockItems=[];//在庫が不十分なアイテムセーブする予定
    //在庫確認ロジック
    //비동기를 조금 더 빠르게 처리
    await Promise.all(itemList.map(async (item) => {
        const stockCheck = await productController.checkStock(item)
        if (stockCheck.isVerify){
            insufficientStockItems.push({item,message:stockCheck.message})
        }
        return stockCheck;
    }))
    return insufficientStockItems;
    // const insufficientStockItems = await productController.checkItemListStock(orderList);
    //     if (insufficientStockItems.length > 0) {
    //         const errorMessage = insufficientStockItems.reduce((total, item) => (total += item.message), '');
    //         throw new Error(errorMessage);
    //     }
};
module.exports = productController;
