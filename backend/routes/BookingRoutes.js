const express = require('express');
const { verifyToken, verifyCustomer, verifyTechnician, verifyAdmin } = require('../MiddleWare/AuthMiddleWare');
const {
    validateCreateBooking,
    validateUpdateBooking,
    validateBookingStatus,
    validateAssignTechnician,
    handleValidationErrors
} = require('../MiddleWare/ValidationMiddleware');
const {
    createBooking,
    getBookings,
    getBooking,
    updateBooking,
    updateBookingStatus,
    assignTechnician,
    deleteBooking
} = require('../Controllers/BookingController');

const router = express.Router();

// Create a new booking (customers only)
router.post('/', verifyCustomer, validateCreateBooking, handleValidationErrors, createBooking);

// Get all bookings (filtered by user role)
router.get('/', verifyToken, getBookings);

// Get a specific booking
router.get('/:id', verifyToken, getBooking);

// Update a booking (customer or technician can update their own bookings)
router.put('/:id', verifyToken, validateUpdateBooking, handleValidationErrors, updateBooking);

// Update booking status (technician, customer can cancel, admin can do all)
router.put('/:id/status', verifyToken, validateBookingStatus, handleValidationErrors, updateBookingStatus);

// Assign technician to booking (admin only)
router.put('/:id/assign-technician', verifyAdmin, validateAssignTechnician, handleValidationErrors, assignTechnician);

// Cancel/Delete booking
router.delete('/:id', verifyToken, deleteBooking);

module.exports = router;