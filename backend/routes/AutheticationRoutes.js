const express = require('express');
const router = express.Router();
const multer = require('multer');
const { TechnicianSignUp, CustomerOrAdminSignUp, Login } = require('../Controllers/AutheticationControllers');
const { uploadMiddleware } = require('../Configuration/fileMulterConfig');

// Customer or Admin Sign Up Route
router.post('/customer/signup', CustomerOrAdminSignUp);

// Debug route to test form data
router.post('/debug-form', 
    uploadMiddleware.technicianFiles, // FIXED: Use uploadMiddleware.technicianFiles
    (req, res) => {
        res.json({
            message: 'Debug successful',
            body: req.body,
            files: req.files,
            bodyKeys: Object.keys(req.body),
            bodyValues: Object.entries(req.body).map(([key, value]) => ({
                key,
                value,
                type: typeof value,
                length: value ? value.length : 0
            }))
        });
    }
);

// Technician Sign Up Route
router.post('/technician/signup', 
    // Handle file uploads with error handling
    (req, res, next) => {
        const upload = uploadMiddleware.technicianFiles; // FIXED: Use uploadMiddleware.technicianFiles

        upload(req, res, function(err) {
            if (err instanceof multer.MulterError) {
                // A Multer error occurred when uploading
                return res.status(400).json({ 
                    message: `File upload error: ${err.message}`,
                    field: err.field
                });
            } else if (err) {
                // An unknown error occurred
                return res.status(500).json({ 
                    message: `Upload error: ${err.message}`
                });
            }
            
            // Everything went fine, proceed
            next();
        });
    },
    
    // Process the signup
    TechnicianSignUp
);

// Login Route for Customer, Admin and Technician
router.post('/login', Login);

module.exports = router;