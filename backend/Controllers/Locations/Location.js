const { error } = require('console');
const  {PrismaClient} = require('../../generated/prisma')
const axios = require('axios');
const prisma = new PrismaClient();



// Method to geocode an address using Google Maps API
async function geocodeAddress(description, district, province) {
   
    const address = encodeURIComponent(`${description}, ${district}, ${province}, Rwanda`);
    const googleMapsApiKey = process.env.GOOGLE_MAPS_API_KEY;
    const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${googleMapsApiKey}`;

    const response = await axios.get(geocodeUrl);
    console.log('Geocode API response:', response.data); // For debugging

    if (response.data.status !== 'OK' || !response.data.results[0]) {
        throw new Error('Unable to geocode address. please provide a valid address.');
    }

    const { lat, lng } = response.data.results[0].geometry.location;
    const googleMapUrl = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
    return { latitude: lat, longitude: lng, googleMapUrl };
}


// Method to create a location
const createLocation = async (req, res) => {
    try {
        // Extract the location details from the request body
        const { description, district, province , addressName} = req.body;
        const customerId = req.user.id; // Assuming the user is authenticated and has an ID

        // Check if the user has role 'customer'
        if (req.user.role !== 'CUSTOMER'){
            return res.status(403).json({error: 'Only customers can  create locations.'})
        }

        // Validate the input
        if (!description || !district || !province){
            return res.status(400).json({ error: 'Description, district, and province are required.' });
        }

        const {latitude, longitude, googleMapUrl} = await geocodeAddress(description, district, province);

        // Create the location in  the database 
        const location = await prisma.location.create({
            data: {
                customerId,
                addressName: addressName || 'Default LOcation',
                description,
                district,
                province,
                latitude,
                longitude,
                googleMapUrl
            },
        });

        res.status(201).json({
            location : {
                id: location.id,
                addressName: location.addressName,
                description: location.description,
                district: location.district,
                province: location.province,
                latitude: location.latitude,
                longitude: location.longitude,
                googleMapUrl: location.googleMapUrl,
            },
            
            message: 'Location created successfully',
        })


    }catch (error){
        console.error('Error creating location:', error);
        res.status(400).json({ error: 'Failed to create location' });
    }
}


// Method to get all locations
const getAllLocations = async (req, res) => {
    try {
        const customerId = req.user.id; // Assuming the user is authenticated and has an ID

        // if (req.user.role !== 'CUSTOMER'){
        //     return res.status(403).json({ error: 'Only customers can view their locations'});
        // }

        const locations  = await prisma.location.findMany( {
            where: {
              customerId  
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        res.status(200).json({
            locations: locations.map((loc) => ({
                id: loc.id,
                addressName: loc.addressName,
                description: loc.description,
                district: loc.district,
                province: loc.province,
                latitude: loc.latitude,
                longitude: loc.longitude,
                googleMapUrl: loc.googleMapUrl,
                createdAt: loc.createdAt,
                updatedAt: loc.updatedAt
            }),)
        });
    }
    catch (error) {
        console.error('Error fetching locations:', error);
        res.status(500).json({ error: 'Failed to fetch locations'})
    }
}


// Method to get a specific location by ID
const getLocationById = async (req, res) => {
    try {
        
        const { id } = req.params;
        const customerId = req.user.id; // Assuming the user is authenticated and has an ID


        // finding the location by ID
        const location = await prisma.location.findUnique({
            where: {
                id: parseInt(id)
            }
        });

        if (!location) {
            return res.status(404).json({ error: 'Location not found'});
        }


        if (location.customerId !== customerId && req.user.role !== 'TECHNICIAN'){
            return res.status(403).json({ error: 'Unauthorization access to location'})
        }

         res.status(200).json({
            id: location.id,
            addressName: location.addressName,
            description: location.addressName,
            district: location.district,
            province: location.province,
            latitude: location.latitude,
            longitude: location.longitude,
            googleMapUrl: location.googleMapUrl,
            createdAt: location.createdAt,
            updatedAt: location.updatedAt

         })

    }catch (error) {
        console.error('Error fetching locations:', error);
        res.status(500).json({ error: 'Failed to fetch locations'})
    }
}


// Method to update a location
const updateLocation = async (req, res) => {
    try {

        const { id} = req.params;
        const { addressName, description, district, province} = req.body;
        const customerId = req.user.id; // Assuming the user is authenticated and has an Id

        // Check if the user is Customer
        if (req.user.role !== 'CUSTOMER'){
            return res.status(403).json({ error: 'Only customers can update their locations'})
        }

        // finding the location by id
        const location = await prisma.location.findUnique({
            where: {
                id:parseInt(id)
            }
        });

        if (!location) {
            return  res.status(404).json({ error: 'Location not found'});
        }

        if (location.customerId !== customerId){
            return res.status(403).json({ error : 'Unuthorization to update this location'})
        }

        // validate  the input
        if (!description || !district || !province){
            return res.status(400).json({ error: 'Missing required fields: description , district, province'});
        }

        const {latitude, longitude, googleMapUrl} = await geocodeAddress(description, district, province);

        // Update the location in  the database 
        const updateLocation = await prisma.location.update({
            where: {
                id: parseInt(id)
            },

            data: {
                addressName: addressName || location.addressName,
                description,
                district,
                province,
                latitude,
                longitude,
                googleMapUrl

            },
        })

        res.status(200).json({
            location: {
                id: updateLocation.id,
                addressName: updateLocation.addressName,
                description: updateLocation.description,
                district: updateLocation.district,
                province: updateLocation.province,
                latitude: updateLocation.latitude,
                longitude: updateLocation.longitude,
                googleMapUrl: updateLocation.googleMapUrl,
                createdAt: updateLocation.createdAt,
                updatedAt: updateLocation.updatedAt
            }, 
            message : 'Location updated successfully'
        })
    }
    catch (error) {
        console.error('Error updating location:', error);
        res.status(500).json({ error: 'Failed to update location'})
    }
}


// Method to delete a location
const deleteLocation = async (req, res) => {
    try {

        const { id} = req.params;
        const customerId = req.user.id;

        // Check if the customer is customer 
        if (req.user.role !== 'CUSTOMER'){
            return res.status(403).json({ error: 'Only customers can delete their locations'});

        }

        // Finding the location by ID
        const location = await prisma.location.findUnique({
            where: {
                id: parseInt(id)
            },

            include: {
                bookings: true  // Include bookings to check if there are any associated bookings
            }
        })

        if (!location){
            return res.status(404).json({ error: 'Location not found'});
        }

        if (location.customerId !== customerId) {
            return res.status(403).json({ error: 'Unauthorized to delete this location'});
        }

        if (location.bookings.length > 0) {
            return res.status(400).json({ error: 'can not delete a linked to bookings'})
        }

        // Delete the location
        await prisma.location.delete({
            where: {
                id: parseInt(id)
            }
        });

        res.status(200).json({ message: 'Location deleted successfully'})

    } catch (error) {
        console.error('Error deleting location:', error);
        res.status(500).json({ error: 'Failed to delete location'})
    }
    }

    module.exports = {
        createLocation,
        getAllLocations,
        getLocationById,
        updateLocation,
        deleteLocation
    }

