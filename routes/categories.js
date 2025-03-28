const { fail } = require('assert');
var express = require('express');
var router = express.Router();
let categorySchema = require('../models/catgories');
let BuildQueies = require('../Utils/BuildQuery');

// http://localhost:3000/categories?name=electronics
router.get('/', async function(req, res, next) {
  try {
    let queries = req.query;
    // Nếu có BuildQuery cho category, có thể dùng: BuildQueies.QueryCategory(queries)
    let categories = await categorySchema.find({ isDeleted: false }); // Chỉ lấy các category chưa bị xóa
    res.status(200).send({
      success: true,
      data: categories
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: error.message
    });
  }
});

router.get('/:id', async function(req, res, next) {
  try {
    let category = await categorySchema.findById(req.params.id);
    if (!category || category.isDeleted) {
      return res.status(404).send({
        success: false,
        message: "Category not found or has been deleted"
      });
    }
    res.status(200).send({
      success: true,
      data: category
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
    let newCategory = new categorySchema({
      categoryName: body.categoryName,
      description: body.description || ""
    });
    await newCategory.save();
    res.status(201).send({
      success: true,
      data: newCategory
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
    let category = await categorySchema.findById(req.params.id);
    if (!category || category.isDeleted) {
      return res.status(404).send({
        success: false,
        message: "Category not found or has been deleted"
      });
    }
    category = await categorySchema.findByIdAndUpdate(req.params.id, body, { new: true });
    res.status(200).send({
      success: true,
      data: category
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
    let category = await categorySchema.findById(req.params.id);
    if (!category) {
      return res.status(404).send({
        success: false,
        message: "Category not found"
      });
    }
    if (category.isDeleted) {
      return res.status(400).send({
        success: false,
        message: "Category is already deleted"
      });
    }
    category = await categorySchema.findByIdAndUpdate(
      req.params.id,
      { isDeleted: true },
      { new: true }
    );
    res.status(200).send({
      success: true,
      message: "Category marked as deleted",
      data: category
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;