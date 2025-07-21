const express = require('express');
const router = express.Router();
const { getNearbyTechnicians } = require('../Controllers/NearbyTechniciansController');

// Public endpoint - no authentication required for finding technicians
router.get('/nearby', getNearbyTechnicians);

module.exports = router;