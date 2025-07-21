const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Get nearby technicians based on coordinates
const getNearbyTechnicians = async (req, res) => {
    try {
        const { 
            lat, 
            lng, 
            radius = 10, // Default 10km radius
            limit = 20,
            serviceType 
        } = req.query;

        // Validate required parameters
        if (!lat || !lng) {
            return res.status(400).json({
                message: 'Latitude and longitude are required',
                error: 'Missing coordinates'
            });
        }

        const latitude = parseFloat(lat);
        const longitude = parseFloat(lng);
        const radiusKm = parseFloat(radius);
        const limitNum = parseInt(limit);

        // Validate coordinates
        if (isNaN(latitude) || isNaN(longitude)) {
            return res.status(400).json({
                message: 'Invalid coordinates provided',
                error: 'Coordinates must be valid numbers'
            });
        }

        // Build where conditions
        const whereConditions = {
            role: 'TECHNICIAN',
            isActive: true,
            technicianDetails: {
                approvalStatus: 'APPROVED',
                isAvailable: true,
                latitude: { not: null },
                longitude: { not: null }
            }
        };

        // Add service type filter if provided
        if (serviceType) {
            whereConditions.technicianDetails.specialization = {
                contains: serviceType,
                mode: 'insensitive'
            };
        }

        // Get all technicians with location data
        const technicians = await prisma.users.findMany({
            where: whereConditions,
            select: {
                id: true,
                fullName: true,
                phoneNumber: true,
                technicianDetails: {
                    select: {
                        id: true,
                        specialization: true,
                        experience: true,
                        isAvailable: true,
                        rate: true,
                        imageUrl: true,
                        latitude: true,
                        longitude: true,
                        address: true,
                        district: true,
                        lastLocationUpdate: true
                    }
                }
            },
            take: 100 // Get more than we need for filtering
        });

        // Calculate distance for each technician and filter by radius
        const techsWithDistance = technicians
            .map(tech => {
                const techLat = tech.technicianDetails.latitude;
                const techLng = tech.technicianDetails.longitude;
                
                // Calculate distance using Haversine formula
                const distance = calculateDistance(latitude, longitude, techLat, techLng);
                
                // Calculate estimated arrival time (assuming 30 km/h average speed)
                const estimatedMinutes = Math.round((distance / 30) * 60);
                const estimatedArrival = estimatedMinutes < 60 
                    ? `${estimatedMinutes} min` 
                    : `${Math.round(estimatedMinutes / 60)} hr ${estimatedMinutes % 60} min`;

                return {
                    id: tech.id,
                    name: tech.fullName,
                    phone: tech.phoneNumber,
                    specialization: tech.technicianDetails.specialization,
                    experience: tech.technicianDetails.experience,
                    isAvailable: tech.technicianDetails.isAvailable,
                    rate: tech.technicianDetails.rate,
                    imageUrl: tech.technicianDetails.imageUrl,
                    latitude: techLat,
                    longitude: techLng,
                    address: tech.technicianDetails.address,
                    district: tech.technicianDetails.district,
                    distance: Math.round(distance * 100) / 100, // Round to 2 decimal places
                    estimatedArrival,
                    lastLocationUpdate: tech.technicianDetails.lastLocationUpdate,
                    // Mock rating for now - TODO: Calculate from reviews
                    rating: (4.5 + Math.random() * 0.5).toFixed(1)
                };
            })
            .filter(tech => tech.distance <= radiusKm) // Filter by radius
            .sort((a, b) => a.distance - b.distance) // Sort by distance
            .slice(0, limitNum); // Limit results

        return res.status(200).json({
            message: 'Nearby technicians retrieved successfully',
            data: {
                technicians: techsWithDistance,
                searchParameters: {
                    latitude,
                    longitude,
                    radius: radiusKm,
                    serviceType: serviceType || 'all'
                },
                totalFound: techsWithDistance.length
            }
        });

    } catch (error) {
        console.error('Error getting nearby technicians:', error);
        return res.status(500).json({
            message: 'Internal server error',
            error: error.message
        });
    }
};

// Helper function to calculate distance between two points using Haversine formula
const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
        Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c; // Distance in kilometers
    return distance;
};

module.exports = {
    getNearbyTechnicians
};