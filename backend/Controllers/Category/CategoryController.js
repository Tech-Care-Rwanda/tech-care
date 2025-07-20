const {PrismaClient} = require('@prisma/client')
const prisma = new PrismaClient();

// Create a new category (admin only)
const createCategory = async (req, res) => {
    try {
        const {name} = req.body;

        // Validate require fields
        if (!name) {
            return res.status(400).json({
                success: false,
                message: 'Category name is required'
            });
        }

        // Check if category already exists
        const existingCategory = await prisma.category.findUnique({
            where: {
                name: name.trim()
            }
        });

        if (existingCategory){
            return res.status(409).json({
                success: false,
                message: 'Category with this name already exists'
            })
        }

        // Create new category (only name field)
        const newCategory = await prisma.category.create({
            data: {
                name: name.trim()
            }
        });

        res.status(201).json({
            success: true, 
            message: 'Category created successfully', 
            data: newCategory
        });
    }
    catch (err) {
        console.error('Error creating category:', err);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: err.message
        });
    }
}

// Get all categories with pagination only
const getAllCategories = async (req, res) => {
    try {
        // Get pagination parameters from query
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        
        // Calculate offset
        const offset = (page - 1) * limit;

        // Get total count for pagination info
        const totalCategories = await prisma.category.count();

        // Get categories with pagination
        const categories = await prisma.category.findMany({
            skip: offset,
            take: limit,
            orderBy: {
                createdAt: 'desc'
            }
        });

        // Calculate pagination info
        const totalPages = Math.ceil(totalCategories / limit);
        const hasNextPage = page < totalPages;
        const hasPrevPage = page > 1;

        res.status(200).json({
            success: true,
            message: 'Categories retrieved successfully',
            data: categories,
            pagination: {
                currentPage: page,
                totalPages: totalPages,
                totalItems: totalCategories,
                itemsPerPage: limit,
                hasNextPage: hasNextPage,
                hasPrevPage: hasPrevPage
            }
        });

    } catch (err) {
        console.error('Error fetching categories:', err);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: err.message
        });
    }
}

// Get category by ID with all its services - shows only category name and services
const getCategoryById = async (req, res) => {
    try {
        const { id } = req.params;

        // Validate ID
        if (!id || isNaN(parseInt(id))) {
            return res.status(400).json({
                success: false,
                message: 'Valid category ID is required'
            });
        }

        // Get category with all its services
        const category = await prisma.category.findUnique({
            where: { 
                id: parseInt(id) 
            },
            select: {
                name: true, // Only select category name
                services: {
                    select: {
                        id: true,
                        serviceName: true,
                        description: true,
                        basePrice: true,
                        isActive: true,
                        createdAt: true,
                        updatedAt: true
                    },
                    where: {
                        isActive: true // Only show active services
                    },
                    orderBy: {
                        createdAt: 'desc'
                    }
                }
            }
        });

        if (!category) {
            return res.status(404).json({
                success: false,
                message: 'Category not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Category and services retrieved successfully',
            data: {
                categoryName: category.name,
                totalServices: category.services.length,
                services: category.services
            }
        });

    } catch (err) {
        console.error('Error fetching category by ID:', err);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: err.message
        });
    }
}


// Update the category by ID (admin only)
const updateCategory = async (req, res) => {
    try {

        const {id} = req.params;
        const {name} = req.body;

        // Validate ID and name
        if (!id || isNaN(parseInt(id))) {
            return res.status(400).json({
                success: false,
                message: 'Valid category ID is required'
            });
        }
        
        if (!name) {
            return res.status(400).json({
                success: false,
                message: 'Category name is required'
            });
        }

        // Check if category exists
        const category = await prisma.category.findUnique({
            where: {
                id: parseInt(id) 
            }
        })

        if (!category){
            return res.status(404).json({
                success: false,
                message: 'Category not found'
            });
        }
     

        // update category
        const updateCategory = await prisma.category.update({
            where: {
                id: parseInt(id)
            },
            data: {
                name: name.trim()
            }
        })

        res.status(200).json({
            success: true,
            message: 'Category updated successfully',
            category: updateCategory
        });
    }
    catch (err) {
        console.error('Error updating category:', err);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: err.message
        })
    }
}


// delete category (admin only)
const deleteCategory = async (req, res) => {
    try {

        const {id} = req.params;
       
        // validate ID
        if (!id || isNaN(parseInt(id))) {
            return res.status(400).json({
                success: false,
                message: 'Valid category ID is required'
            });
        }

        // Check if category exists
        const category = await prisma.category.findUnique({
            where: {
                id: parseInt(id)
            }
        });
     
        if (!category){
            return res.status(404).json({
                success: false,
                message: 'Category not found'
            });
        }

        // Delete category
        await prisma.category.delete({
            where: {
                id: parseInt(id)
            }
        })
    }
    catch (err){
        console.error('Error deleting category:', err);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: err.message
        });
    }
}
module.exports = {
    createCategory,
    getAllCategories,
    getCategoryById, 
    updateCategory,
    deleteCategory
};