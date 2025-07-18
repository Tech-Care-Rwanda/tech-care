const express = require('express');
const { createCategory, getAllCategories, getCategoryById, updateCategory, deleteCategory } = require('../../Controllers/Category/CategoryController');
const {verifyAdmin} = require('../../MiddleWare/AuthMiddleWare');

const router = express.Router();


// Routes to create  category
router.post('/create', verifyAdmin, createCategory);

// Route to get all categories
router.get('/', getAllCategories);

// Route to get category by ID
router.get('/:id', getCategoryById);

// Route to update category (admin only)
router.put('/update/:id', verifyAdmin, updateCategory);

// Route to delete category (admin only)
router.delete('/delete/:id', verifyAdmin, deleteCategory);


module.exports = router;
