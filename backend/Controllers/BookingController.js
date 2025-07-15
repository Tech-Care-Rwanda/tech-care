const { PrismaClient } = require('../generated/prisma');
const prisma = new PrismaClient();

// Create a new booking
const createBooking = async (req, res) => {
    try {
        const customerId = req.user.id;
        const {
            title,
            description,
            category,
            scheduledAt,
            location,
            estimatedHours,
            technicianId
        } = req.body;

        // Validate required fields
        if (!title || !description || !category || !location) {
            return res.status(400).json({
                message: 'Title, description, category, and location are required'
            });
        }

        // Validate category
        const validCategories = [
            'COMPUTER_REPAIR', 'LAPTOP_REPAIR', 'PHONE_REPAIR', 'TABLET_REPAIR',
            'NETWORK_SETUP', 'SOFTWARE_INSTALLATION', 'DATA_RECOVERY', 
            'VIRUS_REMOVAL', 'HARDWARE_UPGRADE', 'CONSULTATION'
        ];
        
        if (!validCategories.includes(category)) {
            return res.status(400).json({
                message: 'Invalid service category'
            });
        }

        // If technician is specified, verify they exist and are available
        if (technicianId) {
            const technician = await prisma.users.findFirst({
                where: {
                    id: technicianId,
                    role: 'TECHNICIAN',
                    isActive: true
                },
                include: {
                    technicianDetails: true
                }
            });

            if (!technician) {
                return res.status(404).json({
                    message: 'Technician not found or not available'
                });
            }

            if (!technician.technicianDetails?.isAvailable) {
                return res.status(400).json({
                    message: 'Selected technician is currently unavailable'
                });
            }

            if (technician.technicianDetails?.approvalStatus !== 'APPROVED') {
                return res.status(400).json({
                    message: 'Selected technician is not approved'
                });
            }
        }

        // Create the booking
        const booking = await prisma.booking.create({
            data: {
                customerId,
                technicianId,
                title,
                description,
                category,
                scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
                location,
                estimatedHours,
                status: technicianId ? 'CONFIRMED' : 'PENDING'
            },
            include: {
                customer: {
                    select: {
                        id: true,
                        fullName: true,
                        email: true,
                        phoneNumber: true
                    }
                },
                technician: {
                    select: {
                        id: true,
                        fullName: true,
                        email: true,
                        phoneNumber: true
                    }
                }
            }
        });

        return res.status(201).json({
            message: 'Booking created successfully',
            booking
        });

    } catch (error) {
        console.error('Error creating booking:', error);
        return res.status(500).json({
            message: 'Internal server error',
            error: error.message
        });
    }
};

// Get all bookings with filtering
const getBookings = async (req, res) => {
    try {
        const userId = req.user.id;
        const userRole = req.user.role;
        const {
            page = 1,
            limit = 10,
            status,
            category,
            search,
            startDate,
            endDate
        } = req.query;

        const offset = (parseInt(page) - 1) * parseInt(limit);

        // Build where conditions based on user role
        let whereConditions = {};

        if (userRole === 'CUSTOMER') {
            whereConditions.customerId = userId;
        } else if (userRole === 'TECHNICIAN') {
            whereConditions.technicianId = userId;
        }
        // ADMIN can see all bookings

        // Add filters
        if (status) {
            whereConditions.status = status.toUpperCase();
        }

        if (category) {
            whereConditions.category = category.toUpperCase();
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
        let bookings = await prisma.booking.findMany({
            where: whereConditions,
            include: {
                customer: {
                    select: {
                        id: true,
                        fullName: true,
                        email: true,
                        phoneNumber: true
                    }
                },
                technician: {
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

        // Apply search filter if provided
        if (search) {
            const searchTerm = search.toLowerCase();
            bookings = bookings.filter(booking =>
                booking.title.toLowerCase().includes(searchTerm) ||
                booking.description.toLowerCase().includes(searchTerm) ||
                booking.customer.fullName.toLowerCase().includes(searchTerm) ||
                (booking.technician && booking.technician.fullName.toLowerCase().includes(searchTerm))
            );
        }

        // Get total count
        const totalBookings = await prisma.booking.count({
            where: whereConditions
        });

        const totalPages = Math.ceil(totalBookings / parseInt(limit));

        return res.status(200).json({
            message: 'Bookings retrieved successfully',
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
        console.error('Error getting bookings:', error);
        return res.status(500).json({
            message: 'Internal server error',
            error: error.message
        });
    }
};

// Get a specific booking
const getBooking = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;
        const userRole = req.user.role;

        const booking = await prisma.booking.findUnique({
            where: { id: parseInt(id) },
            include: {
                customer: {
                    select: {
                        id: true,
                        fullName: true,
                        email: true,
                        phoneNumber: true
                    }
                },
                technician: {
                    select: {
                        id: true,
                        fullName: true,
                        email: true,
                        phoneNumber: true
                    }
                }
            }
        });

        if (!booking) {
            return res.status(404).json({
                message: 'Booking not found'
            });
        }

        // Check authorization
        if (userRole === 'CUSTOMER' && booking.customerId !== userId) {
            return res.status(403).json({
                message: 'Access denied'
            });
        }

        if (userRole === 'TECHNICIAN' && booking.technicianId !== userId) {
            return res.status(403).json({
                message: 'Access denied'
            });
        }

        return res.status(200).json({
            message: 'Booking retrieved successfully',
            booking
        });

    } catch (error) {
        console.error('Error getting booking:', error);
        return res.status(500).json({
            message: 'Internal server error',
            error: error.message
        });
    }
};

// Update a booking
const updateBooking = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;
        const userRole = req.user.role;
        const {
            title,
            description,
            scheduledAt,
            location,
            estimatedHours,
            actualHours,
            notes
        } = req.body;

        // Find the booking
        const existingBooking = await prisma.booking.findUnique({
            where: { id: parseInt(id) }
        });

        if (!existingBooking) {
            return res.status(404).json({
                message: 'Booking not found'
            });
        }

        // Check authorization
        if (userRole === 'CUSTOMER' && existingBooking.customerId !== userId) {
            return res.status(403).json({
                message: 'Access denied'
            });
        }

        if (userRole === 'TECHNICIAN' && existingBooking.technicianId !== userId) {
            return res.status(403).json({
                message: 'Access denied'
            });
        }

        // Prepare update data
        const updateData = {};
        if (title) updateData.title = title;
        if (description) updateData.description = description;
        if (scheduledAt) updateData.scheduledAt = new Date(scheduledAt);
        if (location) updateData.location = location;
        if (estimatedHours) updateData.estimatedHours = estimatedHours;
        if (actualHours) updateData.actualHours = actualHours;
        if (notes) updateData.notes = notes;

        updateData.updatedAt = new Date();

        // Update the booking
        const updatedBooking = await prisma.booking.update({
            where: { id: parseInt(id) },
            data: updateData,
            include: {
                customer: {
                    select: {
                        id: true,
                        fullName: true,
                        email: true,
                        phoneNumber: true
                    }
                },
                technician: {
                    select: {
                        id: true,
                        fullName: true,
                        email: true,
                        phoneNumber: true
                    }
                }
            }
        });

        return res.status(200).json({
            message: 'Booking updated successfully',
            booking: updatedBooking
        });

    } catch (error) {
        console.error('Error updating booking:', error);
        return res.status(500).json({
            message: 'Internal server error',
            error: error.message
        });
    }
};

// Update booking status
const updateBookingStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const userId = req.user.id;
        const userRole = req.user.role;

        const validStatuses = ['PENDING', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'REJECTED'];
        
        if (!status || !validStatuses.includes(status.toUpperCase())) {
            return res.status(400).json({
                message: 'Invalid status'
            });
        }

        // Find the booking
        const booking = await prisma.booking.findUnique({
            where: { id: parseInt(id) }
        });

        if (!booking) {
            return res.status(404).json({
                message: 'Booking not found'
            });
        }

        // Check authorization and allowed status transitions
        let updateData = { status: status.toUpperCase(), updatedAt: new Date() };

        if (userRole === 'CUSTOMER') {
            // Customers can only cancel their own bookings
            if (booking.customerId !== userId) {
                return res.status(403).json({
                    message: 'Access denied'
                });
            }
            if (status.toUpperCase() !== 'CANCELLED') {
                return res.status(400).json({
                    message: 'Customers can only cancel bookings'
                });
            }
        } else if (userRole === 'TECHNICIAN') {
            // Technicians can update status for their assigned bookings
            if (booking.technicianId !== userId) {
                return res.status(403).json({
                    message: 'Access denied'
                });
            }
        }

        // Add completion timestamp for completed bookings
        if (status.toUpperCase() === 'COMPLETED') {
            updateData.completedAt = new Date();
        }

        // Update the booking
        const updatedBooking = await prisma.booking.update({
            where: { id: parseInt(id) },
            data: updateData,
            include: {
                customer: {
                    select: {
                        id: true,
                        fullName: true,
                        email: true,
                        phoneNumber: true
                    }
                },
                technician: {
                    select: {
                        id: true,
                        fullName: true,
                        email: true,
                        phoneNumber: true
                    }
                }
            }
        });

        return res.status(200).json({
            message: 'Booking status updated successfully',
            booking: updatedBooking
        });

    } catch (error) {
        console.error('Error updating booking status:', error);
        return res.status(500).json({
            message: 'Internal server error',
            error: error.message
        });
    }
};

// Assign technician to booking
const assignTechnician = async (req, res) => {
    try {
        const { id } = req.params;
        const { technicianId } = req.body;
        const userRole = req.user.role;

        // Only admins can assign technicians
        if (userRole !== 'ADMIN') {
            return res.status(403).json({
                message: 'Only admins can assign technicians'
            });
        }

        // Verify technician exists and is available
        const technician = await prisma.users.findFirst({
            where: {
                id: technicianId,
                role: 'TECHNICIAN',
                isActive: true
            },
            include: {
                technicianDetails: true
            }
        });

        if (!technician || !technician.technicianDetails?.isAvailable) {
            return res.status(400).json({
                message: 'Technician not found or not available'
            });
        }

        // Update the booking
        const updatedBooking = await prisma.booking.update({
            where: { id: parseInt(id) },
            data: {
                technicianId,
                status: 'CONFIRMED',
                updatedAt: new Date()
            },
            include: {
                customer: {
                    select: {
                        id: true,
                        fullName: true,
                        email: true,
                        phoneNumber: true
                    }
                },
                technician: {
                    select: {
                        id: true,
                        fullName: true,
                        email: true,
                        phoneNumber: true
                    }
                }
            }
        });

        return res.status(200).json({
            message: 'Technician assigned successfully',
            booking: updatedBooking
        });

    } catch (error) {
        console.error('Error assigning technician:', error);
        return res.status(500).json({
            message: 'Internal server error',
            error: error.message
        });
    }
};

// Delete/Cancel booking
const deleteBooking = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;
        const userRole = req.user.role;

        // Find the booking
        const booking = await prisma.booking.findUnique({
            where: { id: parseInt(id) }
        });

        if (!booking) {
            return res.status(404).json({
                message: 'Booking not found'
            });
        }

        // Check authorization
        if (userRole === 'CUSTOMER' && booking.customerId !== userId) {
            return res.status(403).json({
                message: 'Access denied'
            });
        }

        if (userRole === 'TECHNICIAN' && booking.technicianId !== userId) {
            return res.status(403).json({
                message: 'Access denied'
            });
        }

        // Instead of deleting, mark as cancelled
        const updatedBooking = await prisma.booking.update({
            where: { id: parseInt(id) },
            data: {
                status: 'CANCELLED',
                updatedAt: new Date()
            }
        });

        return res.status(200).json({
            message: 'Booking cancelled successfully',
            booking: updatedBooking
        });

    } catch (error) {
        console.error('Error cancelling booking:', error);
        return res.status(500).json({
            message: 'Internal server error',
            error: error.message
        });
    }
};

module.exports = {
    createBooking,
    getBookings,
    getBooking,
    updateBooking,
    updateBookingStatus,
    assignTechnician,
    deleteBooking
};