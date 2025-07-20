const  {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient();


// Add  a new service  (Technician only)
const addService = async (req, res) => {
    try {

        const { serviceName, description, categoryId, price, timeEstimate } = req.body;
        const userId = req.user.id;

        // Check if the user is a technician and get technician details
        const technicianDetails = await prisma.technicianDetails.findUnique({
            where: {
                userId: userId
            },
            include: {
                user: true
            }
        });

        if (!technicianDetails){
            return res.status(403).json({
                success: false,
                message: "Only technicians can add services. Please contact support."
            })
        }

        if (!technicianDetails.approvalStatus !== 'APPROVED') {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to add services. Please contact support."
            });
        }

        // Verify  category exists
        const category = await prisma.category.findUnique({
            where: {
                id: parseInt(categoryId)
            }
        });

        if (!category){
            return res.status(404).json({
                success: false,
                message: "Category not found. Please provide a valid category."
            });
        }
            
        // Create the new service
        const service = await prisma.service.create({
            data: {
                serviceName,
                description,
                categoryId: parseInt(categoryId),
                price: parseFloat(price),
                timeEstimate: parseInt(timeEstimate),
                technicians: {
                    connect: {
                        id: technicianDetails.id
                    }
                }
            }, 
            include: {
                category: true,
                technicians: {
                    user: {
                        select: { id: true, fullName: true, email: true, phoneNumber: true }
                    }
                }
            }
        });

        return res.status(201).json({
            success: true,
            message: "Service added successfully",
            data: service
        })

    }catch (err){
        console.error("Error adding service:", err)
        
        return  res.status(500).json({
            message: "Internal server error while adding service",
            error: err.message
        });
    }
}


// Update service (Technician only)
const updateService = async (req, res) => {
    try {
         const {id} = req.params;
         const { serviceName, description, categoryId, price, timeEstimate, isActive} = req.body;

        const userId = req.user.id;

        // Get technician details
        const technicianDetails = await prisma.technicianDetails.findUnique({
            where: {userId}
        });

        if (!technicianDetails) {
            return res.status(403).json({
                success: false,
                message: "Only technicians can update services. Please contact support."
            })
        }
     // Check if service exists and belongs to this technician
    const existingService = await prisma.service.findFirst({
      where: {
        id: parseInt(id),
        technicians: {
          some: { id: technicianDetails.id }
        }
      }
    });

    if (!existingService){
        return res.status(404).json({
            success: false,
            message: "Service not found or you are not authorized to update this service."
        })
    }


    // Verify category exists if categoryId is provided
    if (categoryId) {
      const category = await prisma.category.findUnique({
        where: { id: parseInt(categoryId) }
      });

      if (!category) {
        return res.status(404).json({
          success: false,
          message: "Category not found"
        });
      }
    }


    //  Update the service 
    const updatedService = await prisma.service.update({
        where: { id: parseInt(id)},
        data: {
            ...(serviceName && {serviceName}),
            ...(description && {description}),
            ...(categoryId && {categoryId: parseInt(categoryId)}),
            ...(price && {price: parseFloat(price)}),
            ...(timeEstimate && {timeEstimate: parseInt(timeEstimate)}),
            ...(isActive !== undefined && {isActive: Boolean(isActive)})
        },

        include: {
            category: true,
            technicians: {
                user: {
                    select: { id: true, fullName: true, email: true, phoneNumber: true }
                }
            }
        }
    });

    return res.status(200).json({
        success: true,
        message: "Service updated successfully",
        data: updatedService
    });

    }
    catch (err){
        console.error("Error updating service:", err);
        return res.status(500).json({
            message: "Internal server error while updating service",
            error: err.message
        });
    }
}


// delete service (Technician only)
const deleteService = async (req, res) => {
    try {
       
        const  {id} = req.params;
        const userId = req.user.id;

        // Get technician details
        const technicianDetails = await prisma.technicianDetails.findUnique({
            where: {userId}
        });

        if (!technicianDetails) {
            return res.status(403).json({
                success: false,
                message: "Only technicians can delete services. Please contact support."
            })
        }

        // Check if service exists and belongs to this technician
        const existingService = await prisma.service.findFirst({
            where : {
                id : parseInt(id),
                technicians: {
                    some: { id: technicianDetails.id }
                }
            }
        });

        if (!existingService) {
            return res.status(404).json({
                success: false,
                message: "Service not found or you are not authorized to delete this service."
            });
        }

        // Delete the service
        await prisma.service.delete({
            where: { id: parseInt(id) }
        });

        return res.status(200).json({
            success: true,
            message: "Service deleted successfully"
        });



    }
    catch (err){
        console.error("Error deleting service:", err);
        return res.status(500).json({
            message: "Internal server error while deleting service",
            error: err.message
        });
    }
}


// Get technician's services (Technician only)
const getTechnicianServices = async (req, res) => {

    try {
         
        const userId = req.user.id;
        const {page = 1, limit = 10, isActive} = req.query;

        // Get technician details
        const technicianDetails = await prisma.technicianDetails.findUnique({
            where: {
                userId
            }
        })

        if (!technicianDetails){
            return res.status(403).json({
                success: false,
                message: "Only technicians can access their services. Please contact support. "
            })
        }


        const skip = (parseInt(page) -1 * parseInt(limit));

        const whereClause = {
            technicians: {
                some: {
                    id: technicianDetails.id
                }
            }
        }

        if (isActive !== undefined) {
            whereClause.isActive = isActive === 'true';
        }

        const [service, totalCount] = await Promise.all([
            prisma.service.findMany({
                where: whereClause,
                include: {
                    category : true ,
                    technicians : {
                        include : {
                            user: {
                                select: { id: true, fullName: true, email : true, phoneNumber: true }
                            }
                        }
                    }
                },
                skip,
                take: parseInt(limit),
                orderBy: {
                    createdAt: 'desc'
                }
            }),
            prisma.service.count({
                where: whereClause
            })
        ]);
        
         return res.status(200).json({
            success: true,
            data: {
                service,
                pagination : {
                    currentPage: parseInt(page),
                    totalPages: Math.ceil(totalCount / parseInt(limit)),
                    totalItems: totalCount,
                    itemsPerPage: parseInt(limit)
                }
            }

         });
    }
    catch(error) {
        console.error("Error getting technician's services:", error);
        return res.status(500).json({
            message: "Internal server error while getting technician's services",
            error: error.message
        })
    }
}


// Get all services (Public - for customers to view)
const getAllServices = async (req, res) => {
  try {
    const { page = 1, limit = 10, categoryId, search, isActive = 'true' } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const whereClause = {
      isActive: isActive === 'true',
      technicians: {
        some: {
          approvalStatus: 'APPROVED',
          isAvailable: true
        }
      }
    };

    if (categoryId) {
      whereClause.categoryId = parseInt(categoryId);
    }

    if (search) {
      whereClause.OR = [
        { serviceName: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ];
    }

    const [services, totalCount] = await Promise.all([
      prisma.service.findMany({
        where: whereClause,
        include: {
          category: true,
          technicians: {
            where: {
              approvalStatus: 'APPROVED',
              isAvailable: true
            },
            include: {
              user: {
                select: { id: true, fullName: true, email: true, phoneNumber: true }
              }
            }
          }
        },
        skip,
        take: parseInt(limit),
        orderBy: { createdAt: 'desc' }
      }),
      prisma.service.count({ where: whereClause })
    ]);

    res.status(200).json({
      success: true,
      data: {
        services,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(totalCount / parseInt(limit)),
          totalItems: totalCount,
          itemsPerPage: parseInt(limit)
        }
      }
    });

  } catch (error) {
    console.error('Error fetching services:', error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};

// Get service by ID (Public)
const getServiceById = async (req, res) => {
  try {
    const { id } = req.params;

    const service = await prisma.service.findUnique({
      where: { 
        id: parseInt(id),
        isActive: true
      },
      include: {
        category: true,
        technicians: {
          where: {
            approvalStatus: 'APPROVED',
            isAvailable: true
          },
          include: {
            user: {
              select: { id: true, fullName: true, email: true, phoneNumber: true }
            }
          }
        }
      }
    });

    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Service not found"
      });
    }

    res.status(200).json({
      success: true,
      data: service
    });

  } catch (error) {
    console.error('Error fetching service:', error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};

// Get services by category (Public)
const getServicesByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const { page = 1, limit = 10 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const whereClause = {
      categoryId: parseInt(categoryId),
      isActive: true,
      technicians: {
        some: {
          approvalStatus: 'APPROVED',
          isAvailable: true
        }
      }
    };

    const [services, totalCount] = await Promise.all([
      prisma.service.findMany({
        where: whereClause,
        include: {
          category: true,
          technicians: {
            where: {
              approvalStatus: 'APPROVED',
              isAvailable: true
            },
            include: {
              user: {
                select: { id: true, fullName: true, email: true, phoneNumber: true }
              }
            }
          }
        },
        skip,
        take: parseInt(limit),
        orderBy: { createdAt: 'desc' }
      }),
      prisma.service.count({ where: whereClause })
    ]);

    res.status(200).json({
      success: true,
      data: {
        services,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(totalCount / parseInt(limit)),
          totalItems: totalCount,
          itemsPerPage: parseInt(limit)
        }
      }
    });

  } catch (error) {
    console.error('Error fetching services by category:', error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};

module.exports = {
  addService,
  updateService,
  deleteService,
  getTechnicianServices,
  getAllServices,
  getServiceById,
  getServicesByCategory
};



