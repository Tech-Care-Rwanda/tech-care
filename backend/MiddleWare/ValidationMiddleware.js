const { validationResult, body } = require('express-validator');

// Validation rules for creating a booking
const validateCreateBooking = [
    body('title')
        .notEmpty()
        .withMessage('Title is required')
        .isLength({ min: 3, max: 100 })
        .withMessage('Title must be between 3 and 100 characters'),

    body('description')
        .notEmpty()
        .withMessage('Description is required')
        .isLength({ min: 10, max: 500 })
        .withMessage('Description must be between 10 and 500 characters'),

    body('category')
        .notEmpty()
        .withMessage('Category is required')
        .isIn([
            'COMPUTER_REPAIR', 'LAPTOP_REPAIR', 'PHONE_REPAIR', 'TABLET_REPAIR',
            'NETWORK_SETUP', 'SOFTWARE_INSTALLATION', 'DATA_RECOVERY', 
            'VIRUS_REMOVAL', 'HARDWARE_UPGRADE', 'CONSULTATION'
        ])
        .withMessage('Invalid service category'),

    body('location')
        .notEmpty()
        .withMessage('Location is required')
        .isLength({ min: 5, max: 200 })
        .withMessage('Location must be between 5 and 200 characters'),

    body('scheduledAt')
        .optional()
        .isISO8601()
        .withMessage('Scheduled date must be a valid date')
        .custom((value) => {
            if (value && new Date(value) <= new Date()) {
                throw new Error('Scheduled date must be in the future');
            }
            return true;
        }),

    body('estimatedHours')
        .optional()
        .isInt({ min: 1, max: 24 })
        .withMessage('Estimated hours must be between 1 and 24'),

    body('technicianId')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Technician ID must be a positive integer')
];

// Validation rules for updating a booking
const validateUpdateBooking = [
    body('title')
        .optional()
        .isLength({ min: 3, max: 100 })
        .withMessage('Title must be between 3 and 100 characters'),

    body('description')
        .optional()
        .isLength({ min: 10, max: 500 })
        .withMessage('Description must be between 10 and 500 characters'),

    body('location')
        .optional()
        .isLength({ min: 5, max: 200 })
        .withMessage('Location must be between 5 and 200 characters'),

    body('scheduledAt')
        .optional()
        .isISO8601()
        .withMessage('Scheduled date must be a valid date')
        .custom((value) => {
            if (value && new Date(value) <= new Date()) {
                throw new Error('Scheduled date must be in the future');
            }
            return true;
        }),

    body('estimatedHours')
        .optional()
        .isInt({ min: 1, max: 24 })
        .withMessage('Estimated hours must be between 1 and 24'),

    body('actualHours')
        .optional()
        .isInt({ min: 1, max: 48 })
        .withMessage('Actual hours must be between 1 and 48'),

    body('notes')
        .optional()
        .isLength({ max: 1000 })
        .withMessage('Notes cannot exceed 1000 characters')
];

// Validation rules for updating booking status
const validateBookingStatus = [
    body('status')
        .notEmpty()
        .withMessage('Status is required')
        .isIn(['CART', 'PENDING', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'REJECTED'])
        .withMessage('Invalid booking status')
];

// Validation rules for assigning technician
const validateAssignTechnician = [
    body('technicianId')
        .notEmpty()
        .withMessage('Technician ID is required')
        .isInt({ min: 1 })
        .withMessage('Technician ID must be a positive integer')
];

// Validation rules for technician availability
const validateAvailability = [
    body('isAvailable')
        .notEmpty()
        .withMessage('Availability status is required')
        .isBoolean()
        .withMessage('Availability must be a boolean value')
];

// Validation rules for technician schedule
const validateSchedule = [
    body('schedule')
        .isArray({ min: 1 })
        .withMessage('Schedule must be an array with at least one entry'),

    body('schedule.*.dayOfWeek')
        .isInt({ min: 0, max: 6 })
        .withMessage('Day of week must be between 0 (Sunday) and 6 (Saturday)'),

    body('schedule.*.startTime')
        .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
        .withMessage('Start time must be in HH:MM format'),

    body('schedule.*.endTime')
        .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
        .withMessage('End time must be in HH:MM format'),

    body('schedule.*.isAvailable')
        .optional()
        .isBoolean()
        .withMessage('isAvailable must be a boolean value')
];

// Validation rules for adding service to cart
const validateAddServiceToCart = [
    body('serviceId')
        .notEmpty()
        .withMessage('Service ID is required')
        .isInt({ min: 1 })
        .withMessage('Service ID must be a positive integer'),

    body('quantity')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Quantity must be a positive integer')
];

// Middleware to handle validation errors
const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            message: 'Validation failed',
            errors: errors.array()
        });
    }
    next();
};

module.exports = {
    validateCreateBooking,
    validateUpdateBooking,
    validateBookingStatus,
    validateAssignTechnician,
    validateAvailability,
    validateSchedule,
    validateAddServiceToCart,
    handleValidationErrors
};
