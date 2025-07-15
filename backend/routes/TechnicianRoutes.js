const express = require('express');
const { verifyToken, verifyTechnician, verifyAdmin } = require('../MiddleWare/AuthMiddleWare');
const {
    validateAvailability,
    validateSchedule,
    handleValidationErrors
} = require('../MiddleWare/ValidationMiddleware');
const {
    getAvailableTechnicians,
    getTechnicianProfile,
    updateAvailability,
    getTechnicianSchedule,
    updateTechnicianSchedule,
    getTechnicianBookings
} = require('../Controllers/TechnicianController');

const router = express.Router();

// Public routes (no authentication required)

// Get all available technicians (public)
router.get('/', getAvailableTechnicians);

// Get technician profile (public)
router.get('/:id', getTechnicianProfile);

// Get technician schedule (public)
router.get('/:id/schedule', getTechnicianSchedule);

// Protected routes (authentication required)

// Update technician availability (technician/admin only)
router.put('/:id/availability', verifyToken, validateAvailability, handleValidationErrors, updateAvailability);

// Update technician schedule (technician/admin only)
router.put('/:id/schedule', verifyToken, validateSchedule, handleValidationErrors, updateTechnicianSchedule);

// Get technician's bookings (technician/admin only)
router.get('/:id/bookings', verifyToken, getTechnicianBookings);

module.exports = router;