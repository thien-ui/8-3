const { fail } = require('assert');
var express = require('express');
var router = express.Router();
let productSchema = require('../models/products');
let BuildQueies = require('../Utils/BuildQuery');

// http://localhost:3000/products?name=iph&price[$gte]=1600&price[$lte]=3000
router.get('/', async function(req, res, next) {
  let queries = req.query;
  let products = await productSchema.find(BuildQueies.QueryProduct(queries)).populate("categoryID");
  res.send(products);
});

router.get('/:id', async function(req, res, next) {
  try {
    let product = await productSchema.findById(req.params.id);
    if (!product || product.isDeleted) {
      return res.status(404).send({
        success: false,
        message: "Product not found or has been deleted"
      });
    }
    res.status(200).send({
      success: true,
      data: product
    });
  } catch (error) {
    res.status(404).send({
      success: false,
      message: error.message
    });
  }
});

router.post('/', async function(req, res, next) {
  try {
    let body = req.body;
    let newProduct = new productSchema({
      productName: body.productName,
      price: body.price,
      quantity: body.quantity,
      categoryID: body.category,
      description: body.description || "",
      imgURL: body.imgURL || ""
    });
    await newProduct.save();
    res.status(201).send({
      success: true,
      data: newProduct
    });
  } catch (error) {
    res.status(400).send({
      success: false,
      message: error.message
    });
  }
});

router.put('/:id', async function(req, res, next) {
  try {
    let body = req.body;
    let product = await productSchema.findById(req.params.id);
    if (!product || product.isDeleted) {
      return res.status(404).send({
        success: false,
        message: "Product not found or has been deleted"
      });
    }
    product = await productSchema.findByIdAndUpdate(req.params.id, body, { new: true });
    res.status(200).send({
      success: true,
      data: product
    });
  } catch (error) {
    res.status(400).send({
      success: false,
      message: error.message
    });
  }
});

router.delete('/:id', async function(req, res, next) {
  try {
    let product = await productSchema.findById(req.params.id);
    if (!product) {
      return res.status(404).send({
        success: false,
        message: "Product not found"
      });
    }
    await productSchema.findByIdAndDelete(req.params.id);
    res.status(200).send({
      success: true,
      message: "Product deleted permanently"
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;