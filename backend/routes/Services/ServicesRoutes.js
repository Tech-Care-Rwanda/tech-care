const express = require('express');
const router = express.Router();

// Import middleware
const { verifyTechnician } = require('../../MiddleWare/AuthMiddleWare');

// Import service controllers
const {
  addService,
  updateService,
  deleteService,
  getTechnicianServices,
  getAllServices,
  getServiceById,
  getServicesByCategory
} = require('../../Controllers/Service/Services');

// ==============================================
// TECHNICIAN PROTECTED ROUTES (Require Login)
// ==============================================

// POST /api/services/add - Add new service (Technician only)
router.post('/add', verifyTechnician, addService);

// PUT /api/services/:id - Update service (Technician only - own services)
router.put('/:id', verifyTechnician, updateService);

// DELETE /api/services/:id - Delete service (Technician only - own services)
router.delete('/:id', verifyTechnician, deleteService);

// GET /api/services/technician - Get technician's own services
router.get('/technician', verifyTechnician, getTechnicianServices);

// ==============================================
// PUBLIC ROUTES (No Authentication Required)
// ==============================================

// GET /api/services/all - Get all services (Public - for customers)
router.get('/all', getAllServices);

// GET /api/services/category/:categoryId - Get services by category (Public)
router.get('/category/:categoryId', getServicesByCategory);

// GET /api/services/:id - Get single service by ID (Public)
router.get('/:id', getServiceById);

module.exports = router;

