const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Get all available technicians (public endpoint)
const getAvailableTechnicians = async (req, res) => {
    try {
        const {
            page = 1,
            limit = 10,
            specialization,
            isAvailable,
            search,
            minRate,
            maxRate
        } = req.query;

        const offset = (parseInt(page) - 1) * parseInt(limit);

        // Build where conditions
        const whereConditions = {
            role: 'TECHNICIAN',
            isActive: true,
            technicianDetails: {
                approvalStatus: 'APPROVED'
            }
        };

        // Add availability filter
        if (isAvailable !== undefined) {
            whereConditions.technicianDetails.isAvailable = isAvailable === 'true';
        }

        // Get technicians
        let technicians = await prisma.users.findMany({
            where: whereConditions,
            select: {
                id: true,
                fullName: true,
                email: true,
                phoneNumber: true,
                createdAt: true,
                technicianDetails: {
                    select: {
                        id: true,
                        specialization: true,
                        experience: true,
                        isAvailable: true,
                        rate: true,
                        imageUrl: true
                    }
                }
            },
            skip: offset,
            take: parseInt(limit),
            orderBy: {
                createdAt: 'desc'
            }
        });

        // Apply filters
        if (specialization) {
            technicians = technicians.filter(tech =>
                tech.technicianDetails?.specialization.toLowerCase().includes(specialization.toLowerCase())
            );
        }

        if (search) {
            const searchTerm = search.toLowerCase();
            technicians = technicians.filter(tech =>
                tech.fullName.toLowerCase().includes(searchTerm) ||
                tech.technicianDetails?.specialization.toLowerCase().includes(searchTerm)
            );
        }

        if (minRate || maxRate) {
            technicians = technicians.filter(tech => {
                const rate = tech.technicianDetails?.rate || 0;
                const min = minRate ? parseInt(minRate) : 0;
                const max = maxRate ? parseInt(maxRate) : Infinity;
                return rate >= min && rate <= max;
            });
        }

        // Get total count
        const totalTechnicians = await prisma.users.count({
            where: whereConditions
        });

        const totalPages = Math.ceil(totalTechnicians / parseInt(limit));

        return res.status(200).json({
            message: 'Available technicians retrieved successfully',
            data: {
                technicians,
                pagination: {
                    currentPage: parseInt(page),
                    totalPages,
                    totalTechnicians,
                    hasNextPage: parseInt(page) < totalPages,
                    hasPreviousPage: parseInt(page) > 1
                }
            }
        });

    } catch (error) {
        console.error('Error getting available technicians:', error);
        return res.status(500).json({
            message: 'Internal server error',
            error: error.message
        });
    }
};

// Get technician profile (public endpoint)
const getTechnicianProfile = async (req, res) => {
    try {
        const { id } = req.params;

        const technician = await prisma.users.findFirst({
            where: {
                id: parseInt(id),
                role: 'TECHNICIAN',
                isActive: true
            },
            select: {
                id: true,
                fullName: true,
                email: true,
                phoneNumber: true,
                createdAt: true,
                technicianDetails: {
                    select: {
                        id: true,
                        gender: true,
                        age: true,
                        experience: true,
                        specialization: true,
                        imageUrl: true,
                        certificateUrl: true,
                        isAvailable: true,
                        rate: true,
                        approvalStatus: true,
                        createdAt: true
                    }
                }
            }
        });

        if (!technician) {
            return res.status(404).json({
                message: 'Technician not found'
            });
        }

        if (technician.technicianDetails?.approvalStatus !== 'APPROVED') {
            return res.status(404).json({
                message: 'Technician not available'
            });
        }

        return res.status(200).json({
            message: 'Technician profile retrieved successfully',
            technician
        });

    } catch (error) {
        console.error('Error getting technician profile:', error);
        return res.status(500).json({
            message: 'Internal server error',
            error: error.message
        });
    }
};

// Update technician availability (technician only)
const updateAvailability = async (req, res) => {
    try {
        const { id } = req.params;
        const { isAvailable } = req.body;
        const userId = req.user.id;
        const userRole = req.user.role;

        // Check authorization
        if (userRole !== 'TECHNICIAN' && userRole !== 'ADMIN') {
            return res.status(403).json({
                message: 'Access denied'
            });
        }

        if (userRole === 'TECHNICIAN' && parseInt(id) !== userId) {
            return res.status(403).json({
                message: 'You can only update your own availability'
            });
        }

        // Validate input
        if (typeof isAvailable !== 'boolean') {
            return res.status(400).json({
                message: 'isAvailable must be a boolean value'
            });
        }

        // Find the technician
        const technician = await prisma.users.findFirst({
            where: {
                id: parseInt(id),
                role: 'TECHNICIAN'
            },
            include: {
                technicianDetails: true
            }
        });

        if (!technician) {
            return res.status(404).json({
                message: 'Technician not found'
            });
        }

        if (!technician.technicianDetails) {
            return res.status(400).json({
                message: 'Technician details not found'
            });
        }

        // Update availability
        const updatedDetails = await prisma.technicianDetails.update({
            where: { userId: parseInt(id) },
            data: {
                isAvailable,
                updatedAt: new Date()
            }
        });

        return res.status(200).json({
            message: 'Availability updated successfully',
            availability: {
                isAvailable: updatedDetails.isAvailable,
                updatedAt: updatedDetails.updatedAt
            }
        });

    } catch (error) {
        console.error('Error updating availability:', error);
        return res.status(500).json({
            message: 'Internal server error',
            error: error.message
        });
    }
};

// Get technician schedule/availability
const getTechnicianSchedule = async (req, res) => {
    try {
        const { id } = req.params;

        const schedule = await prisma.technicianAvailability.findMany({
            where: { technicianId: parseInt(id) },
            orderBy: { dayOfWeek: 'asc' }
        });

        // Get technician basic info
        const technician = await prisma.users.findFirst({
            where: {
                id: parseInt(id),
                role: 'TECHNICIAN'
            },
            select: {
                id: true,
                fullName: true,
                technicianDetails: {
                    select: {
                        isAvailable: true
                    }
                }
            }
        });

        if (!technician) {
            return res.status(404).json({
                message: 'Technician not found'
            });
        }

        // Format schedule with day names
        const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const formattedSchedule = schedule.map(item => ({
            ...item,
            dayName: dayNames[item.dayOfWeek]
        }));

        return res.status(200).json({
            message: 'Technician schedule retrieved successfully',
            data: {
                technician: {
                    id: technician.id,
                    fullName: technician.fullName,
                    isGenerallyAvailable: technician.technicianDetails?.isAvailable
                },
                schedule: formattedSchedule
            }
        });

    } catch (error) {
        console.error('Error getting technician schedule:', error);
        return res.status(500).json({
            message: 'Internal server error',
            error: error.message
        });
    }
};

// Update technician schedule (technician only)
const updateTechnicianSchedule = async (req, res) => {
    try {
        const { id } = req.params;
        const { schedule } = req.body;
        const userId = req.user.id;
        const userRole = req.user.role;

        // Check authorization
        if (userRole !== 'TECHNICIAN' && userRole !== 'ADMIN') {
            return res.status(403).json({
                message: 'Access denied'
            });
        }

        if (userRole === 'TECHNICIAN' && parseInt(id) !== userId) {
            return res.status(403).json({
                message: 'You can only update your own schedule'
            });
        }

        // Validate input
        if (!Array.isArray(schedule)) {
            return res.status(400).json({
                message: 'Schedule must be an array'
            });
        }

        // Validate schedule items
        for (const item of schedule) {
            if (typeof item.dayOfWeek !== 'number' || item.dayOfWeek < 0 || item.dayOfWeek > 6) {
                return res.status(400).json({
                    message: 'dayOfWeek must be a number between 0 and 6'
                });
            }

            if (!item.startTime || !item.endTime) {
                return res.status(400).json({
                    message: 'startTime and endTime are required'
                });
            }

            // Validate time format (HH:MM)
            const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
            if (!timeRegex.test(item.startTime) || !timeRegex.test(item.endTime)) {
                return res.status(400).json({
                    message: 'Time must be in HH:MM format'
                });
            }
        }

        // Find the technician
        const technician = await prisma.users.findFirst({
            where: {
                id: parseInt(id),
                role: 'TECHNICIAN'
            }
        });

        if (!technician) {
            return res.status(404).json({
                message: 'Technician not found'
            });
        }

        // Delete existing schedule
        await prisma.technicianAvailability.deleteMany({
            where: { technicianId: parseInt(id) }
        });

        // Create new schedule entries
        const scheduleData = schedule.map(item => ({
            technicianId: parseInt(id),
            dayOfWeek: item.dayOfWeek,
            startTime: item.startTime,
            endTime: item.endTime,
            isAvailable: item.isAvailable !== false // Default to true if not specified
        }));

        await prisma.technicianAvailability.createMany({
            data: scheduleData
        });

        // Get updated schedule
        const updatedSchedule = await prisma.technicianAvailability.findMany({
            where: { technicianId: parseInt(id) },
            orderBy: { dayOfWeek: 'asc' }
        });

        return res.status(200).json({
            message: 'Schedule updated successfully',
            schedule: updatedSchedule
        });

    } catch (error) {
        console.error('Error updating technician schedule:', error);
        return res.status(500).json({
            message: 'Internal server error',
            error: error.message
        });
    }
};

// Get technician's bookings
const getTechnicianBookings = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;
        const userRole = req.user.role;
        const {
            page = 1,
            limit = 10,
            status,
            startDate,
            endDate
        } = req.query;

        // Check authorization
        if (userRole !== 'TECHNICIAN' && userRole !== 'ADMIN') {
            return res.status(403).json({
                message: 'Access denied'
            });
        }

        if (userRole === 'TECHNICIAN' && parseInt(id) !== userId) {
            return res.status(403).json({
                message: 'You can only view your own bookings'
            });
        }

        const offset = (parseInt(page) - 1) * parseInt(limit);

        // Build where conditions
        const whereConditions = {
            technicianId: parseInt(id)
        };

        if (status) {
            whereConditions.status = status.toUpperCase();
        }

        if (startDate || endDate) {
            whereConditions.createdAt = {};
            if (startDate) {
                whereConditions.createdAt.gte = new Date(startDate);
            }
            if (endDate) {
                whereConditions.createdAt.lte = new Date(endDate);
            }
        }

        // Get bookings
        const bookings = await prisma.booking.findMany({
            where: whereConditions,
            include: {
                customer: {
                    select: {
                        id: true,
                        fullName: true,
                        email: true,
                        phoneNumber: true
                    }
                }
            },
            skip: offset,
            take: parseInt(limit),
            orderBy: {
                createdAt: 'desc'
            }
        });

        // Get total count
        const totalBookings = await prisma.booking.count({
            where: whereConditions
        });

        const totalPages = Math.ceil(totalBookings / parseInt(limit));

        return res.status(200).json({
            message: 'Technician bookings retrieved successfully',
            data: {
                bookings,
                pagination: {
                    currentPage: parseInt(page),
                    totalPages,
                    totalBookings,
                    hasNextPage: parseInt(page) < totalPages,
                    hasPreviousPage: parseInt(page) > 1
                }
            }
        });

    } catch (error) {
        console.error('Error getting technician bookings:', error);
        return res.status(500).json({
            message: 'Internal server error',
            error: error.message
        });
    }
};

module.exports = {
    getAvailableTechnicians,
    getTechnicianProfile,
    updateAvailability,
    getTechnicianSchedule,
    updateTechnicianSchedule,
    getTechnicianBookings
};