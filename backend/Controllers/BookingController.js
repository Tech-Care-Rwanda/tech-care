const { PrismaClient } = require('@prisma/client');
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
            technicianId,
            serviceId,
            locationId,
            availabilityId
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
                message: `Invalid service category. Try ${validCategories.join(', ').toLowerCase()}.`
            });
        }

        // If technician is specified, verify they exist and are available
        if (technicianId) {
            const technician = await prisma.users.findFirst({
                where: {
                    role: 'TECHNICIAN',
                    isActive: true,
                },
                select: {
                    id: true,
                    technicianDetails: {
                        where: {
                            id: technicianId
                        },
                    }
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
                technicianId,
                // description,
                // category,
                scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
                locationId,
                estimatedHours,
                // status: technicianId ? 'CONFIRMED' : 'PENDING',
                duration: 120,
                totalPrice: 1200,
                customerId,
                serviceId,
                availabilityId,
                customerNotes: description || null // Store description as customerNotes
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
                        user: {
                            select: {
                                fullName: true,
                                phoneNumber: true
                            }
                        },
                        imageUrl: true,
                        rate: true
                    }
                },
                service: {
                    select: {
                        id: true,
                        serviceName: true,
                        description: true,
                        price: true
                    }
                },
                location: {
                    select: {
                        id: true,
                        description: true,
                        district: true,
                        province: true
                    }
                },
                availability: {
                    select: {
                        id: true,
                        date: true,
                        timeSlot: {
                            select: {
                                startTime: true,
                                endTime: true
                            }
                        }
                    }
                }
            }
        });

        // Enhance the booking response with fields needed by the frontend
        const enhancedBooking = {
            ...booking,
            // Add fields needed by frontend but not available in the API response
            technician: {
                ...booking.technician,
                name: booking.technician.user?.fullName || 'Unknown Technician', // Use technician name from user relation
                image: booking.technician.imageUrl || '/default-technician.jpg', // Use technician image from imageUrl
                rating: booking.technician.rate || 0, // Use technician rate as rating
                reviews: 0, // Dummy data - not available in API
                phone: booking.technician.user?.phoneNumber || 'Not available' // Use technician phone from user relation
            },
            // Convert service object to string for frontend
            service: booking.service?.serviceName || 'Unknown Service',
            // Extract date and time from scheduledDate or availability
            date: booking.availability?.date ? new Date(booking.availability.date).toISOString().split('T')[0] : 'Not scheduled',
            time: booking.availability?.timeSlot ? 
                  `${new Date(booking.availability.timeSlot.startTime).toLocaleTimeString()} - ${new Date(booking.availability.timeSlot.endTime).toLocaleTimeString()}` : 
                  'Not scheduled',
            // Convert location object to string for frontend
            location: booking.location ? 
                     `${booking.location.description}, ${booking.location.district}, ${booking.location.province}` : 
                     'No location specified',
            // Format price for frontend
            price: `${booking.totalPrice} RWF`,
            // Convert status to frontend format
            status: booking.status.toLowerCase(),
            // Set booking date
            bookingDate: booking.createdAt.toISOString(),
            // Add devices array (dummy data - not available in API)
            devices: ['Device information not available'] // Comment: devices field is missing in the API
        };

        return res.status(201).json({
            message: 'Booking created successfully',
            booking: enhancedBooking
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
                        user: {
                            select: {
                                fullName: true,
                                phoneNumber: true
                            }
                        },
                        imageUrl: true,
                        rate: true
                    }
                },
                service: {
                    select: {
                        id: true,
                        serviceName: true,
                        description: true,
                        price: true
                    }
                },
                location: {
                    select: {
                        id: true,
                        description: true,
                        district: true,
                        province: true
                    }
                },
                availability: {
                    select: {
                        id: true,
                        date: true,
                        timeSlot: {
                            select: {
                                startTime: true,
                                endTime: true
                            }
                        }
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
                (booking.customerNotes && booking.customerNotes.toLowerCase().includes(searchTerm)) ||
                booking.customer.fullName.toLowerCase().includes(searchTerm) ||
                (booking.technician && booking.technician.user && booking.technician.user.fullName.toLowerCase().includes(searchTerm))
            );
        }

        // Transform bookings to match frontend expectations
        const enhancedBookings = bookings.map(booking => ({
            ...booking,
            // Add fields needed by frontend but not available in the API response
            technician: {
                ...booking.technician,
                name: booking.technician.user?.fullName || 'Unknown Technician', // Use technician name from user relation
                image: booking.technician.imageUrl || '/default-technician.jpg', // Use technician image from imageUrl
                rating: booking.technician.rate || 0, // Use technician rate as rating
                reviews: 0, // Dummy data - not available in API
                phone: booking.technician.user?.phoneNumber || 'Not available' // Use technician phone from user relation
            },
            // Convert service object to string for frontend
            service: booking.service?.serviceName || 'Unknown Service',
            // Extract date and time from scheduledDate or availability
            date: booking.availability?.date ? new Date(booking.availability.date).toISOString().split('T')[0] : 'Not scheduled',
            time: booking.availability?.timeSlot ? 
                  `${new Date(booking.availability.timeSlot.startTime).toLocaleTimeString()} - ${new Date(booking.availability.timeSlot.endTime).toLocaleTimeString()}` : 
                  'Not scheduled',
            // Convert location object to string for frontend
            location: booking.location ? 
                     `${booking.location.description}, ${booking.location.district}, ${booking.location.province}` : 
                     'No location specified',
            // Format price for frontend
            price: `${booking.totalPrice} RWF`,
            // Convert status to frontend format
            status: booking.status.toLowerCase(),
            // Set booking date
            bookingDate: booking.createdAt.toISOString(),
            // Add devices array (dummy data - not available in API)
            devices: ['Device information not available'] // Comment: devices field is missing in the API
        }));

        // Get total count
        const totalBookings = await prisma.booking.count({
            where: whereConditions
        });

        const totalPages = Math.ceil(totalBookings / parseInt(limit));

        return res.status(200).json({
            message: 'Bookings retrieved successfully',
            data: {
                bookings: enhancedBookings,
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
                        user: {
                            select: {
                                fullName: true,
                                phoneNumber: true
                            }
                        },
                        imageUrl: true,
                        rate: true
                    }
                },
                service: {
                    select: {
                        id: true,
                        serviceName: true,
                        description: true,
                        price: true
                    }
                },
                location: {
                    select: {
                        id: true,
                        description: true,
                        district: true,
                        province: true
                    }
                },
                availability: {
                    select: {
                        id: true,
                        date: true,
                        timeSlot: {
                            select: {
                                startTime: true,
                                endTime: true
                            }
                        }
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

        // Enhance the booking response with fields needed by the frontend
        const enhancedBooking = {
            ...booking,
            // Add fields needed by frontend but not available in the API response
            technician: {
                ...booking.technician,
                name: booking.technician.user?.fullName || 'Unknown Technician', // Use technician name from user relation
                image: booking.technician.imageUrl || '/default-technician.jpg', // Use technician image from imageUrl
                rating: booking.technician.rate || 0, // Use technician rate as rating
                reviews: 0, // Dummy data - not available in API
                phone: booking.technician.user?.phoneNumber || 'Not available' // Use technician phone from user relation
            },
            // Convert service object to string for frontend
            service: booking.service?.serviceName || 'Unknown Service',
            // Extract date and time from scheduledDate or availability
            date: booking.availability?.date ? new Date(booking.availability.date).toISOString().split('T')[0] : 'Not scheduled',
            time: booking.availability?.timeSlot ? 
                  `${new Date(booking.availability.timeSlot.startTime).toLocaleTimeString()} - ${new Date(booking.availability.timeSlot.endTime).toLocaleTimeString()}` : 
                  'Not scheduled',
            // Convert location object to string for frontend
            location: booking.location ? 
                     `${booking.location.description}, ${booking.location.district}, ${booking.location.province}` : 
                     'No location specified',
            // Format price for frontend
            price: `${booking.totalPrice} RWF`,
            // Convert status to frontend format
            status: booking.status.toLowerCase(),
            // Set booking date
            bookingDate: booking.createdAt.toISOString(),
            // Add devices array (dummy data - not available in API)
            devices: ['Device information not available'] // Comment: devices field is missing in the API
        };

        return res.status(200).json({
            message: 'Booking retrieved successfully',
            booking: enhancedBooking
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
                        user: {
                            select: {
                                fullName: true,
                                phoneNumber: true
                            }
                        },
                        imageUrl: true,
                        rate: true
                    }
                },
                service: {
                    select: {
                        id: true,
                        serviceName: true,
                        description: true,
                        price: true
                    }
                },
                location: {
                    select: {
                        id: true,
                        description: true,
                        district: true,
                        province: true
                    }
                },
                availability: {
                    select: {
                        id: true,
                        date: true,
                        timeSlot: {
                            select: {
                                startTime: true,
                                endTime: true
                            }
                        }
                    }
                }
            }
        });

        // Enhance the booking response with fields needed by the frontend
        const enhancedBooking = {
            ...updatedBooking,
            // Add fields needed by frontend but not available in the API response
            technician: {
                ...updatedBooking.technician,
                name: updatedBooking.technician.user?.fullName || 'Unknown Technician', // Use technician name from user relation
                image: updatedBooking.technician.imageUrl || '/default-technician.jpg', // Use technician image from imageUrl
                rating: updatedBooking.technician.rate || 0, // Use technician rate as rating
                reviews: 0, // Dummy data - not available in API
                phone: updatedBooking.technician.user?.phoneNumber || 'Not available' // Use technician phone from user relation
            },
            // Convert service object to string for frontend
            service: updatedBooking.service?.serviceName || 'Unknown Service',
            // Extract date and time from scheduledDate or availability
            date: updatedBooking.availability?.date ? new Date(updatedBooking.availability.date).toISOString().split('T')[0] : 'Not scheduled',
            time: updatedBooking.availability?.timeSlot ? 
                  `${new Date(updatedBooking.availability.timeSlot.startTime).toLocaleTimeString()} - ${new Date(updatedBooking.availability.timeSlot.endTime).toLocaleTimeString()}` : 
                  'Not scheduled',
            // Convert location object to string for frontend
            location: updatedBooking.location ? 
                     `${updatedBooking.location.description}, ${updatedBooking.location.district}, ${updatedBooking.location.province}` : 
                     'No location specified',
            // Format price for frontend
            price: `${updatedBooking.totalPrice} RWF`,
            // Convert status to frontend format
            status: updatedBooking.status.toLowerCase(),
            // Set booking date
            bookingDate: updatedBooking.createdAt.toISOString(),
            // Add devices array (dummy data - not available in API)
            devices: ['Device information not available'] // Comment: devices field is missing in the API
        };

        return res.status(200).json({
            message: 'Booking status updated successfully',
            booking: enhancedBooking
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
                        user: {
                            select: {
                                fullName: true,
                                phoneNumber: true
                            }
                        },
                        imageUrl: true,
                        rate: true
                    }
                },
                service: {
                    select: {
                        id: true,
                        serviceName: true,
                        description: true,
                        price: true
                    }
                },
                location: {
                    select: {
                        id: true,
                        description: true,
                        district: true,
                        province: true
                    }
                },
                availability: {
                    select: {
                        id: true,
                        date: true,
                        timeSlot: {
                            select: {
                                startTime: true,
                                endTime: true
                            }
                        }
                    }
                }
            }
        });

        // Enhance the booking response with fields needed by the frontend
        const enhancedBooking = {
            ...updatedBooking,
            // Add fields needed by frontend but not available in the API response
            technician: {
                ...updatedBooking.technician,
                name: updatedBooking.technician.user?.fullName || 'Unknown Technician', // Use technician name from user relation
                image: updatedBooking.technician.imageUrl || '/default-technician.jpg', // Use technician image from imageUrl
                rating: updatedBooking.technician.rate || 0, // Use technician rate as rating
                reviews: 0, // Dummy data - not available in API
                phone: updatedBooking.technician.user?.phoneNumber || 'Not available' // Use technician phone from user relation
            },
            // Convert service object to string for frontend
            service: updatedBooking.service?.serviceName || 'Unknown Service',
            // Extract date and time from scheduledDate or availability
            date: updatedBooking.availability?.date ? new Date(updatedBooking.availability.date).toISOString().split('T')[0] : 'Not scheduled',
            time: updatedBooking.availability?.timeSlot ? 
                  `${new Date(updatedBooking.availability.timeSlot.startTime).toLocaleTimeString()} - ${new Date(updatedBooking.availability.timeSlot.endTime).toLocaleTimeString()}` : 
                  'Not scheduled',
            // Convert location object to string for frontend
            location: updatedBooking.location ? 
                     `${updatedBooking.location.description}, ${updatedBooking.location.district}, ${updatedBooking.location.province}` : 
                     'No location specified',
            // Format price for frontend
            price: `${updatedBooking.totalPrice} RWF`,
            // Convert status to frontend format
            status: updatedBooking.status.toLowerCase(),
            // Set booking date
            bookingDate: updatedBooking.createdAt.toISOString(),
            // Add devices array (dummy data - not available in API)
            devices: ['Device information not available'] // Comment: devices field is missing in the API
        };

        return res.status(200).json({
            message: 'Technician assigned successfully',
            booking: enhancedBooking
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
                updatedAt: new Date(),
                cancelledAt: new Date()
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
                        user: {
                            select: {
                                fullName: true,
                                phoneNumber: true
                            }
                        },
                        imageUrl: true,
                        rate: true
                    }
                },
                service: {
                    select: {
                        id: true,
                        serviceName: true,
                        description: true,
                        price: true
                    }
                },
                location: {
                    select: {
                        id: true,
                        description: true,
                        district: true,
                        province: true
                    }
                },
                availability: {
                    select: {
                        id: true,
                        date: true,
                        timeSlot: {
                            select: {
                                startTime: true,
                                endTime: true
                            }
                        }
                    }
                }
            }
        });

        // Enhance the booking response with fields needed by the frontend
        const enhancedBooking = {
            ...updatedBooking,
            // Add fields needed by frontend but not available in the API response
            technician: {
                ...updatedBooking.technician,
                name: updatedBooking.technician?.user?.fullName || 'Unknown Technician', // Use technician name from user relation
                image: updatedBooking.technician?.imageUrl || '/default-technician.jpg', // Use technician image from imageUrl
                rating: updatedBooking.technician?.rate || 0, // Use technician rate as rating
                reviews: 0, // Dummy data - not available in API
                phone: updatedBooking.technician?.user?.phoneNumber || 'Not available' // Use technician phone from user relation
            },
            // Convert service object to string for frontend
            service: updatedBooking.service?.serviceName || 'Unknown Service',
            // Extract date and time from scheduledDate or availability
            date: updatedBooking.availability?.date ? new Date(updatedBooking.availability.date).toISOString().split('T')[0] : 'Not scheduled',
            time: updatedBooking.availability?.timeSlot ? 
                  `${new Date(updatedBooking.availability.timeSlot.startTime).toLocaleTimeString()} - ${new Date(updatedBooking.availability.timeSlot.endTime).toLocaleTimeString()}` : 
                  'Not scheduled',
            // Convert location object to string for frontend
            location: updatedBooking.location ? 
                     `${updatedBooking.location.description}, ${updatedBooking.location.district}, ${updatedBooking.location.province}` : 
                     'No location specified',
            // Format price for frontend
            price: `${updatedBooking.totalPrice} RWF`,
            // Convert status to frontend format
            status: updatedBooking.status.toLowerCase(),
            // Set booking date
            bookingDate: updatedBooking.createdAt.toISOString(),
            // Add devices array (dummy data - not available in API)
            devices: ['Device information not available'] // Comment: devices field is missing in the API
        };

        return res.status(200).json({
            message: 'Booking cancelled successfully',
            booking: enhancedBooking
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