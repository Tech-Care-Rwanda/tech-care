const { PrismaClient } = require('../generated/prisma');
const emailService = require('../Configuration/EmailConfig');
const crypto = require('crypto');

const prisma = new PrismaClient();

// geting  admin  profile  from  jwt
const getAdminProfile = async (req, res) => {
    try {

        // the  user information  is  alrady  attached to  req.user by  the  verufication  middleware
        const adminId = req.user.id;

        // Fetching the  admin profile from database
        const admin = await prisma.user.findUnique(
            {
                where: {
                    id: adminId,
                    role: 'ADMIN'
                },
                select: {
                     id: true,
                   fullName: true,
                   email: true,
                   phoneNumber: true,
                   role: true,
                   isActive: true,
                   createdAt: true,
                   updatedAt: true

                }
            }
        );

        // Checking if admin exist
        if (!admin) {
            return res.status(404).json(
                {
                    message: 'Admin not found'
                }
            )
        }

        // Checking if admin account  is  active
        if (!admin.isActive) {
            return res.status(403).json(
                {
                    message: 'Admin account is not active'
                }
            )
        }

        // Returning the  admin profile
        return res.status(200).json({
            message: 'Admin profile retrieved successfully',
            admin: admin,
            jwtInfo: {
                userId: req.user.id,
                email: req.user.email,
                role: req.user.role,
                fullName: req.user.fullName
            }
        });

    }
    catch(error){
        console.error('Error in getAdminProfile:', error);
        return res.status(500).json(
            {
                message: 'Internal server error',
                error: error.message
            }
        )
    }
}


// Checking  if  admin  is autheticated
const checkingIfAdminIsAutheticated = async(req, res) => {
       try {

            const adminId = req.user.id;

            // Double-check admin exists in database and is still active
            const admin = await prisma.user.findUnique({
                where : {
                    id : adminId,
                    role: 'ADMIN'
                },
                select : {
                    id: true,
                    fullName: true,
                    email: true,
                    role: true,
                    isActive: true,
                    createdAt: true
                }
            });

            // Check if  admin still exist
            if (!admin){
                return res.status(401).json({

                   isAuthenticated: false,
                   shouldLogout: true,
                   message: 'Admin account not found. Please login again.'

                })
            }

            //Check if admin account is still active
            if(!admin.isActive){
                return res.status(403).json({
                isAuthenticated: false,
                shouldLogout: true,
                message: 'Admin account has been deactivated. Please contact support.'
                })
            }

            // If we reach here, admin is properly authenticated
        return res.status(200).json({
            isAuthenticated: true,
            shouldLogout: false,
            message: 'Admin is authenticated',
            admin: {
                id: admin.id,
                fullName: admin.fullName,
                email: admin.email,
                role: admin.role
            },
            tokenInfo: {
                userId: req.user.id,
                email: req.user.email,
                role: req.user.role,
                fullName: req.user.fullName
            },
            sessionStatus: 'active'
        });

       }
       catch(err){
         console.log('Error in checkingIfAdminIsAutheticated:', err);
         return res.status(500).json({
            message: 'Internal server error',
            error: err.message
         })

       }
}



//  =========== Technician Management =============

// getting all technician 
const getAllTechnicians = async (req, res) => {
    try {
        // get query parameters for filtering and pagination
        const {
            page = 1,
            limit = 10,
            status,
            approvalStatus,
            search,
            isAvailable
        } = req.query;

        // Calculate offset for pagination
        const offset = (parseInt(page) - 1) * parseInt(limit);

        // Build where conditions
        const whereConditions = {
            role: 'TECHNICIAN'
        };

        // Add status filter if provided
        if (status !== undefined) {
            whereConditions.isActive = status === 'active';
        }

        // Fetching all technicians from the database with their details
        const technicians = await prisma.user.findMany({
            where: whereConditions,
            select: {
                id: true,
                fullName: true,
                email: true,
                phoneNumber: true,
                role: true,
                isActive: true,
                createdAt: true,
                updatedAt: true,

                // Include technician details with correct field names
                technicianDetails: {
                    select: {
                        id: true,
                        userId: true,
                        gender: true,
                        age: true,
                        DateOfBirth: true,  // Note: Capital D and B as shown in error
                        experience: true,
                        specialization: true,
                        imageUtl: true,     // Note: imageUtl not imageUrl
                        certificateUrl: true,
                        isAvailable: true,
                        rate: true,
                        approvalStatus: true,
                        createdAt: true,
                        updatedAt: true
                    }
                }
            },

            skip: offset,
            take: parseInt(limit),
            orderBy: {
                createdAt: 'desc'
            }
        });

        // Filter by search term if provided
        let filteredTechnicians = technicians;
        if (search) {
            const searchTerm = search.toLowerCase();
            filteredTechnicians = technicians.filter(tech =>
                tech.fullName.toLowerCase().includes(searchTerm) ||
                tech.email.toLowerCase().includes(searchTerm) ||
                (tech.technicianDetails?.specialization &&
                 tech.technicianDetails.specialization.toLowerCase().includes(searchTerm))
            );
        }

        // Filter by approval status if provided
        if (approvalStatus) {
            filteredTechnicians = filteredTechnicians.filter(tech =>
                tech.technicianDetails?.approvalStatus === approvalStatus.toUpperCase()
            );
        }

        // Filter by availability if provided
        if (isAvailable !== undefined) {
            const availabilityFilter = isAvailable === 'true';
            filteredTechnicians = filteredTechnicians.filter(tech =>
                tech.technicianDetails?.isAvailable === availabilityFilter
            );
        }

        // Get total count for pagination
        const totalTechnicians = await prisma.user.count({
            where: whereConditions
        });

        // Calculate pagination info
        const totalPages = Math.ceil(totalTechnicians / parseInt(limit));
        const hasNextPage = parseInt(page) < totalPages;
        const hasPreviousPage = parseInt(page) > 1;

        // Transform data to include summary information
        const technicianSummary = filteredTechnicians.map(tech => ({
            id: tech.id,
            fullName: tech.fullName,
            email: tech.email,
            phoneNumber: tech.phoneNumber,
            isActive: tech.isActive,
            joinedDate: tech.createdAt,
            lastUpdated: tech.updatedAt,
            technicianProfile: tech.technicianDetails ? {
                id: tech.technicianDetails.id,
                userId: tech.technicianDetails.userId,
                gender: tech.technicianDetails.gender,
                age: tech.technicianDetails.age,
                dateOfBirth: tech.technicianDetails.DateOfBirth, // Using correct field name
                experience: tech.technicianDetails.experience,
                specialization: tech.technicianDetails.specialization,
                approvalStatus: tech.technicianDetails.approvalStatus,
                isAvailable: tech.technicianDetails.isAvailable,
                rate: tech.technicianDetails.rate,
                hasProfileImage: !!tech.technicianDetails.imageUtl, // Using correct field name
                hasCertificate: !!tech.technicianDetails.certificateUrl,
                profileImageUrl: tech.technicianDetails.imageUtl,
                certificateUrl: tech.technicianDetails.certificateUrl,
                profileCompletedAt: tech.technicianDetails.createdAt
            } : null
        }));

        // Count technicians by status for dashboard stats
        const statusCounts = {
            total: totalTechnicians,
            active: filteredTechnicians.filter(t => t.isActive).length,
            inactive: filteredTechnicians.filter(t => !t.isActive).length,
            pending: filteredTechnicians.filter(t => t.technicianDetails?.approvalStatus === 'PENDING').length,
            approved: filteredTechnicians.filter(t => t.technicianDetails?.approvalStatus === 'APPROVED').length,
            rejected: filteredTechnicians.filter(t => t.technicianDetails?.approvalStatus === 'REJECTED').length,
            available: filteredTechnicians.filter(t => t.technicianDetails?.isAvailable === true).length,
            unavailable: filteredTechnicians.filter(t => t.technicianDetails?.isAvailable === false).length
        };

        return res.status(200).json({
            message: 'Technicians retrieved successfully',
            data: {
                technicians: technicianSummary,
                pagination: {
                    currentPage: parseInt(page),
                    totalPages: totalPages,
                    totalItems: totalTechnicians,
                    itemsPerPage: parseInt(limit),
                    hasNextPage: hasNextPage,
                    hasPreviousPage: hasPreviousPage
                },
                filters: {
                    search: search || null,
                    status: status || null,
                    approvalStatus: approvalStatus || null,
                    isAvailable: isAvailable || null
                },
                statistics: statusCounts
            }
        });

    } catch (err) {
        // Handle specific database errors gracefully
        if (err.code === 'P2025') {
            return res.status(404).json({
                message: 'No technicians found'
            });
        }

        // Remove console.error to avoid exposing sensitive error info
        return res.status(500).json({
            message: 'Internal server error'
        });
    }
};


// Approving technician  
const ApproveTechnician = async (req, res) => {
    try {
        // Get technician ID from request parameters
        const { technicianId } = req.params;

        // Get optional approval message from request body
        const { approvalMessage, adminNotes } = req.body;

        // Validate technician ID
        if (!technicianId) {
            return res.status(400).json({
                message: 'Technician ID is required'
            });
        }

        // Check if technician exists and get their details
        const technician = await prisma.user.findUnique({
            where: {
                id: parseInt(technicianId),
                role: 'TECHNICIAN'
            },
            select: {
                id: true,
                fullName: true,
                email: true,
                isActive: true,
                technicianDetails: {
                    select: {
                        id: true,
                        approvalStatus: true,
                        specialization: true,
                        experience: true
                    }
                }
            }
        });

        // Check if technician exists
        if (!technician) {
            return res.status(404).json({
                message: 'Technician not found'
            });
        }

        // Check if technician account is active
        if (!technician.isActive) {
            return res.status(400).json({
                message: 'Cannot approve an inactive technician account'
            });
        }

        // Check if technician has completed their profile
        if (!technician.technicianDetails) {
            return res.status(400).json({
                message: 'Technician has not completed their profile. Cannot approve.'
            });
        }

        // Check current approval status
        const currentStatus = technician.technicianDetails.approvalStatus;

        if (currentStatus === 'APPROVED') {
            return res.status(400).json({
                message: 'Technician is already approved',
                currentStatus: currentStatus
            });
        }

        // Update technician approval status to APPROVED
        const updatedTechnicianDetails = await prisma.technicianDetails.update({
            where: {
                id: technician.technicianDetails.id
            },
            data: {
                approvalStatus: 'APPROVED',
                updatedAt: new Date()
            },
            select: {
                id: true,
                userId: true,
                approvalStatus: true,
                specialization: true,
                experience: true,
                isAvailable: true,
                updatedAt: true
            }
        });

        // Send approval email to technician
        try {
            const approvalEmailHtml = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>TechCare - Account Approved</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        line-height: 1.6;
                        color: #333;
                        margin: 0;
                        padding: 0;
                    }
                    .container {
                        max-width: 600px;
                        margin: 0 auto;
                        padding: 20px;
                    }
                    .header {
                        background-color: #f44336;
                        padding: 20px;
                        text-align: center;
                        color: white;
                        border-radius: 5px 5px 0 0;
                    }
                    .content {
                        background-color: #f9f9f9;
                        padding: 30px 20px;
                        border-radius: 0 0 5px 5px;
                        border: 1px solid #ddd;
                        border-top: none;
                    }
                    .success-message {
                        background-color: #d4edda;
                        border: 1px solid #c3e6cb;
                        padding: 15px;
                        border-radius: 5px;
                        margin: 15px 0;
                    }
                    .login-button {
                        display: inline-block;
                        background-color: #4CAF50;
                        color: white !important;
                        padding: 12px 30px;
                        text-decoration: none !important;
                        border-radius: 5px;
                        font-weight: bold;
                        margin: 20px 0;
                    }
                    .footer {
                        text-align: center;
                        margin-top: 20px;
                        font-size: 12px;
                        color: #666;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>Account Approved!</h1>
                    </div>
                    <div class="content">
                        <h2>Congratulations ${technician.fullName}!</h2>
                        <div class="success-message">
                            <strong>Great news!</strong> Your TechCare technician account has been approved and activated.
                        </div>
                        
                        <p>You can now:</p>
                        <ul>
                            <li>Log in to your technician dashboard</li>
                            <li>Receive and accept service requests</li>
                            <li> Manage your availability status</li>
                            <li>Update your profile and specializations</li>
                        </ul>

                        <div style="text-align: center;">
                            <a href="http://localhost:3000/login" class="login-button">Login to Dashboard</a>
                        </div>

                        <p><strong>Your Specialization:</strong> ${technician.technicianDetails.specialization || 'General Technical Services'}</p>
                        
                        ${approvalMessage ? `<p><strong>Admin Message:</strong> ${approvalMessage}</p>` : ''}
                        
                        <p>Welcome to the TechCare technician network! We're excited to have you on board.</p>
                        
                        <p>If you have any questions, please don't hesitate to contact our support team.</p>
                        
                        <p>Best regards,<br>The TechCare Team</p>
                    </div>
                    <div class="footer">
                        <p>© 2025 TechCare. All rights reserved.</p>
                    </div>
                </div>
            </body>
            </html>
            `;

            await emailService.sendEmail(
                technician.email,
                'TechCare - Your Technician Account Has Been Approved! ',
                approvalEmailHtml
            );

        } catch (emailError) {
            // Log email error but don't fail the approval process
            console.warn('Failed to send approval email:', emailError.message);
        }

        // Return success response
        return res.status(200).json({
            message: 'Technician approved successfully',
            data: {
                technicianId: technician.id,
                fullName: technician.fullName,
                email: technician.email,
                previousStatus: currentStatus,
                newStatus: 'APPROVED',
                approvedAt: updatedTechnicianDetails.updatedAt,
                technicianDetails: {
                    id: updatedTechnicianDetails.id,
                    specialization: updatedTechnicianDetails.specialization,
                    experience: updatedTechnicianDetails.experience,
                    isAvailable: updatedTechnicianDetails.isAvailable,
                    approvalStatus: updatedTechnicianDetails.approvalStatus
                }
            }
        });

    } catch (error) {
        // Handle specific Prisma errors
        if (error.code === 'P2025') {
            return res.status(404).json({
                message: 'Technician details not found'
            });
        }

        return res.status(500).json({
            message: 'Internal server error'
        });
    }
};


const RejectTechnician = async(req, res) => {
    try {
        // Get technician ID from request parameters
        const { technicianId } = req.params;

        // Get optional rejection reason and admin notes from request body
        const { rejectionReason, adminNotes, feedback } = req.body;

        // Validate technician ID
        if (!technicianId) {
            return res.status(400).json({
                message: 'Technician ID is required'
            });
        }

        // Check if technician exists and get their details
        const technician = await prisma.user.findUnique({
            where: {
                id: parseInt(technicianId),
                role: 'TECHNICIAN'
            },
            select: {
                id: true,
                fullName: true,
                email: true,
                isActive: true,
                technicianDetails: {
                    select: {
                        id: true,
                        approvalStatus: true,
                        specialization: true,
                        experience: true,
                        imageUtl: true,
                        certificateUrl: true
                    }
                }
            }
        });

        // Check if technician exists
        if (!technician) {
            return res.status(404).json({
                message: 'Technician not found'
            });
        }

        // Check if technician has completed their profile
        if (!technician.technicianDetails) {
            return res.status(400).json({
                message: 'Technician profile not found. Cannot reject.'
            });
        }

        // Check current approval status
        const currentStatus = technician.technicianDetails.approvalStatus;

        if (currentStatus === 'REJECTED') {
            return res.status(400).json({
                message: 'Technician has already been rejected',
                currentStatus: currentStatus
            });
        }

        if (currentStatus === 'APPROVED') {
            return res.status(400).json({
                message: 'Cannot reject an already approved technician. Please deactivate their account instead.',
                currentStatus: currentStatus
            });
        }

        // Update technician approval status to REJECTED
        const updatedTechnicianDetails = await prisma.technicianDetails.update({
            where: {
                id: technician.technicianDetails.id
            },
            data: {
                approvalStatus: 'REJECTED',
                updatedAt: new Date()
            },
            select: {
                id: true,
                userId: true,
                approvalStatus: true,
                specialization: true,
                experience: true,
                isAvailable: true,
                updatedAt: true
            }
        });

        // Send rejection email to technician
        try {
            const rejectionEmailHtml = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>TechCare - Application Update</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        line-height: 1.6;
                        color: #333;
                        margin: 0;
                        padding: 0;
                    }
                    .container {
                        max-width: 600px;
                        margin: 0 auto;
                        padding: 20px;
                    }
                    .header {
                        background-color: #f44336;
                        padding: 20px;
                        text-align: center;
                        color: white;
                        border-radius: 5px 5px 0 0;
                    }
                    .content {
                        background-color: #f9f9f9;
                        padding: 30px 20px;
                        border-radius: 0 0 5px 5px;
                        border: 1px solid #ddd;
                        border-top: none;
                    }
                    .rejection-message {
                        background-color: #f8d7da;
                        border: 1px solid #f5c6cb;
                        padding: 15px;
                        border-radius: 5px;
                        margin: 15px 0;
                    }
                    .feedback-box {
                        background-color: #e2e3e5;
                        border: 1px solid #d1d3d4;
                        padding: 15px;
                        border-radius: 5px;
                        margin: 15px 0;
                    }
                    .reapply-button {
                        display: inline-block;
                        background-color: #007bff;
                        color: white !important;
                        padding: 12px 30px;
                        text-decoration: none !important;
                        border-radius: 5px;
                        font-weight: bold;
                        margin: 20px 0;
                    }
                    .footer {
                        text-align: center;
                        margin-top: 20px;
                        font-size: 12px;
                        color: #666;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>Application Update</h1>
                    </div>
                    <div class="content">
                        <h2>Dear ${technician.fullName},</h2>
                        
                        <div class="rejection-message">
                            <strong>Application Status:</strong> Unfortunately, your TechCare technician application has not been approved at this time.
                        </div>
                        
                        <p>Thank you for your interest in joining the TechCare technician network. After careful review of your application, we are unable to approve it at this time.</p>
                        
                        ${rejectionReason ? `
                        <div class="feedback-box">
                            <strong>Reason for rejection:</strong><br>
                            ${rejectionReason}
                        </div>
                        ` : ''}
                        
                        ${feedback ? `
                        <div class="feedback-box">
                            <strong>Feedback from our team:</strong><br>
                            ${feedback}
                        </div>
                        ` : ''}
                        
                        <p><strong>What you can do next:</strong></p>
                        <ul>
                            <li>Review and update your qualifications or certifications</li>
                            <li>Gain additional experience in your specialization area</li>
                            <li>Ensure all required documents are properly uploaded and clear</li>
                            <li>Reapply after addressing the feedback provided</li>
                        </ul>

                        <div style="text-align: center;">
                            <a href="http://localhost:3000/technician/signup" class="reapply-button">Reapply Here</a>
                        </div>
                        
                        <p>We encourage you to address any concerns mentioned above and reapply in the future. Our standards are high to ensure the best service for our customers.</p>
                        
                        <p>If you have any questions about this decision or would like clarification on how to improve your application, please don't hesitate to contact our support team.</p>
                        
                        <p>Thank you for your understanding.</p>
                        
                        <p>Best regards,<br>The TechCare Team</p>
                    </div>
                    <div class="footer">
                        <p>© 2025 TechCare. All rights reserved.</p>
                    </div>
                </div>
            </body>
            </html>
            `;

            await emailService.sendEmail(
                technician.email,
                'TechCare - Application Status Update',
                rejectionEmailHtml
            );

        } catch (emailError) {
            // Log email error but don't fail the rejection process
            console.warn('Failed to send rejection email:', emailError.message);
        }

        // Return success response
        return res.status(200).json({
            message: 'Technician application rejected successfully',
            data: {
                technicianId: technician.id,
                fullName: technician.fullName,
                email: technician.email,
                previousStatus: currentStatus,
                newStatus: 'REJECTED',
                rejectedAt: updatedTechnicianDetails.updatedAt,
                rejectionDetails: {
                    reason: rejectionReason || 'No specific reason provided',
                    feedback: feedback || null,
                    adminNotes: adminNotes || null
                },
                technicianDetails: {
                    id: updatedTechnicianDetails.id,
                    specialization: updatedTechnicianDetails.specialization,
                    experience: updatedTechnicianDetails.experience,
                    approvalStatus: updatedTechnicianDetails.approvalStatus
                }
            },
            adminInfo: {
                rejectedBy: req.user.fullName,
                rejectedByEmail: req.user.email,
                rejectionTimestamp: new Date().toISOString()
            }
        });

    } catch (error) {
        // Handle specific Prisma errors
        if (error.code === 'P2025') {
            return res.status(404).json({
                message: 'Technician details not found'
            });
        }

        return res.status(500).json({
            message: 'Internal server error'
        });
    }
};


// Get Technician Details - Simple database info only
const getTechnicianDetails = async (req, res) => {
    try {
        // Get technician ID from request parameters
        const { technicianId } = req.params;

        // Validate technician ID
        if (!technicianId) {
            return res.status(400).json({
                message: 'Technician ID is required'
            });
        }

        // Fetch technician information from database
        const technician = await prisma.user.findUnique({
            where: {
                id: parseInt(technicianId),
                role: 'TECHNICIAN'
            },
            select: {
                id: true,
                fullName: true,
                email: true,
                phoneNumber: true,
                role: true,
                isActive: true,
                createdAt: true,
                updatedAt: true,

                // Include technician details
                technicianDetails: {
                    select: {
                        id: true,
                        userId: true,
                        gender: true,
                        age: true,
                        DateOfBirth: true,
                        experience: true,
                        specialization: true,
                        imageUtl: true,
                        certificateUrl: true,
                        isAvailable: true,
                        rate: true,
                        approvalStatus: true,
                        createdAt: true,
                        updatedAt: true
                    }
                }
            }
        });

        // Check if technician exists
        if (!technician) {
            return res.status(404).json({
                message: 'Technician not found'
            });
        }

        // Return raw data from database
        return res.status(200).json({
            message: 'Technician details retrieved successfully',
            data: technician
        });

    } catch (err) {
        return res.status(500).json({
            message: 'Internal server error'
        });
    }
};

// Promote customer know to admin
const PromoteCustomerToAdmin = async (req, res) => {
    try {
        // Get customer ID from request parameters
        const { customerId } = req.params;
        const { email } = req.body;

        // Validate customer ID
        if (!customerId || !email) {
            return res.status(400).json({
                message: 'Customer ID and email are required'
            });
        }

        // Check if customer exists and get their details
        const customer = await prisma.user.findUnique({
            where: {
                id: parseInt(customerId),
                email: email,
                role: 'CUSTOMER',
            },
            select: {
                id: true,
                email: true,
                isActive: true,
                role: true,
            }
        });

        // Check if customer exists
        if (!customer) {
            return res.status(404).json({
                message: 'Customer not found'
            });
        }

        // Check if customer account is active
        if (!customer.isActive) {
            return res.status(403).json({
                message: 'Cannot promote an inactive customer account'
            });
        }

        const updatedCustomerDetails = await prisma.user.update({
            where: {
                id: customerId,
                email: email,
                role: 'CUSTOMER',
            },
            data: {
                role: 'ADMIN',
                updatedAt: new Date()
            },
            omit: {
                password: true,
            }
        });

        return res.status(200).json({
            message: 'Customer promoted to Admin successfully',
            data: updatedCustomerDetails,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: 'Internal server error'
        });
    }
}


// Logout  Method
const  Logout = async (req, res) => {
    try {

        return res.status(200).json({
            message: 'Logout successful'
        });
    }
    catch(err) {
        console.log("Internal Server  error ")

        return res.status(500).json({
            message: 'Internal server error'
        });
    }
}







module.exports = {
    getAdminProfile,
    checkingIfAdminIsAutheticated,
    getAllTechnicians,
    ApproveTechnician,
    RejectTechnician,
    getTechnicianDetails,
    PromoteCustomerToAdmin,
    Logout
};






