const express = require('express');
const { verifyCustomer, verifyTechnician} = require('../../MiddleWare/AuthMiddleWare');
const {
   createLocation,
        getAllLocations,
        getLocationById,
        updateLocation,
        deleteLocation 
} = require('../../Controllers/Locations/Location');

const router = express.Router();

// Router to create a location
router.post('/', verifyCustomer, createLocation);

// Router to get all locations
router.get('/', verifyCustomer, verifyTechnician, getAllLocations);

// Router to get a location by Id
router.get('/:id', verifyCustomer, verifyTechnician, getLocationById);

// Router to update a location
router.put('/:id', verifyCustomer, updateLocation);

// Router to delete a location
router.delete('/:id', verifyCustomer, deleteLocation);

module.exports = router;





