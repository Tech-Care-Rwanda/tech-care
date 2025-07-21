const {PrismaClient} = require('@prisma/client');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const emailService = require('../Configuration/EmailConfig');
const { uploadToSupabase, deleteFromSupabase } = require('../Configuration/fileMulterConfig');

const dotenv = require('dotenv');
const prisma = new PrismaClient();

// Load environment variables
dotenv.config();
prisma.$connect();

// Customer SignUp or Admin Controllers
const CustomerOrAdminSignUp = async (req, res) => {
    try {
        // Extract the user from request body
        const { fullName, email, password, phoneNumber } = req.body;

        // Input validation
        if (!fullName || !email || !password || !phoneNumber) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Check if user already exists
        const existingUser = await prisma.users.findUnique({
            where: { email }
        });

        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create the new User
        const newUser = await prisma.users.create({
            data: {
                fullName,
                email,
                password: hashedPassword,
                phoneNumber,
                role: 'CUSTOMER' // Default role is CUSTOMER
            }
        });

        // Generate JWT token
        const VerificationToken = jwt.sign(
            { userId: newUser.id },
            process.env.JWT_SECRET_KEY,
            { expiresIn: '24h' }
        );

        // Create welcome email HTML
        const welcome = `
          <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Welcome to TechCare</title>
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
                        padding: 20px;
                        border-radius: 0 0 5px 5px;
                        border: 1px solid #ddd;
                        border-top: none;
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
                        <h1>Welcome to TechCare</h1>
                    </div>
                    <div class="content">
                        <h2>Hello ${fullName},</h2>
                        <p>Thank you for joining TechCare! We're excited to have you on board.</p>
                        <p>Your account has been successfully created and you can now log in to access our services.</p>
                        <p>With TechCare, you can:</p>
                        <ul>
                            <li>Request technical assistance for your devices</li>
                            <li>Schedule appointments with qualified technicians</li>
                            <li>Get real-time updates on your service requests</li>
                            <li>Access troubleshooting guides and resources</li>
                        </ul>
                        <p>If you have any questions or need assistance, our support team is here to help you.</p>
                        <p>Best regards,<br>The TechCare Team</p>
                    </div>
                    <div class="footer">
                        <p>© ${new Date().getFullYear()} TechCare. All rights reserved.</p>
                    </div>
                </div>
            </body>
            </html>
        `;

        // Send Welcome Email
        await emailService.sendEmail(
            email,
            'Welcome to TechCare',
            welcome
        );

        // Return success response without password
        const { password: _, ...userWithoutPassword } = newUser;
        return res.status(201).json({
            message: 'User created successfully',
            user: userWithoutPassword,
            token: VerificationToken
        });

    } catch (error) {
        console.error('Error during sign up:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

// Technician SignUp Controller - FIXED VERSION WITH SUPABASE
const TechnicianSignUp = async (req, res) => {
    try {
        // Extract form data from the request
        const {
            fullName,
            email,
            password,
            phoneNumber,
            gender,
            age,
            dateOfBirth,
            experience,
            specialization
        } = req.body;

        // Handle the case where field names might have trailing spaces
        const ageValue = age || req.body['age '] || req.body[' age'] || req.body[' age '];

        // Check for required fields
        if (!fullName?.trim() || !email?.trim() || !password?.trim() ||
            !phoneNumber?.trim() || !gender?.trim() || !ageValue ||
            !dateOfBirth?.trim() || !experience?.trim() || !specialization?.trim()) {

            return res.status(400).json({
                message: 'All fields are required'
            });
        }

        // Check if files were uploaded
        if (!req.files || !req.files.profileImage || !req.files.certificateDocument) {
            return res.status(400).json({
                message: 'Profile image and certificate are required'
            });
        }

        // Check if user with email already exists
        const existingUser = await prisma.users.findUnique({
            where: { email }
        });

        if (existingUser) {
            return res.status(400).json({ message: 'User with this email already exists' });
        }

        // Upload files to Supabase
        const profileImageFile = req.files.profileImage[0];
        const certificateFile = req.files.certificateDocument[0];

        // Upload profile image to 'images' bucket
        const imageUploadResult = await uploadToSupabase(
            profileImageFile,
            'images',
            'technician-profiles'
        );

        if (!imageUploadResult.success) {
            return res.status(500).json({
                message: 'Failed to upload profile image',
                error: imageUploadResult.error
            });
        }

        // Upload certificate to 'documents' bucket
        const certificateUploadResult = await uploadToSupabase(
            certificateFile,
            'documents',
            'technician-certificates'
        );

        if (!certificateUploadResult.success) {
            // Clean up uploaded image if certificate upload fails
            await deleteFromSupabase('images', imageUploadResult.fileName);

            return res.status(500).json({
                message: 'Failed to upload certificate document',
                error: certificateUploadResult.error
            });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user with technician details in a transaction
        const newTechnician = await prisma.$transaction(async (tx) => {
            // Create user first
            const user = await tx.users.create({
                data: {
                    fullName,
                    email,
                    password: hashedPassword,
                    phoneNumber,
                    role: 'TECHNICIAN'
                }
            });

            // Create technician details with Supabase URLs
            const techDetails = await tx.technicianDetails.create({
                data: {
                    userId: user.id,
                    gender: gender.trim(),
                    age: parseInt(ageValue) || parseInt(age) || 0,
                    dateOfBirth: new Date(dateOfBirth.trim()),
                    experience: experience.trim(),
                    specialization: specialization.trim(),
                    imageUrl: imageUploadResult.publicUrl,
                    certificateUrl: certificateUploadResult.publicUrl,
                    isAvailable: true,
                    rate: 0
                }
            });

            return { user, techDetails };
        });

        // Generate JWT token for the new technician
        const token = jwt.sign(
            {
                userId: newTechnician.user.id,
                role: newTechnician.user.role,
                technicianId: newTechnician.techDetails.id
            },
            process.env.JWT_SECRET_KEY,
            { expiresIn: '1h' }
        );

        // Create Welcome email HTML
        const welcomeHtml = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>TechCare - Registration Confirmation</title>
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
              padding: 20px;
              border-radius: 0 0 5px 5px;
              border: 1px solid #ddd;
              border-top: none;
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
              <h1>Technician Registration Confirmation</h1>
            </div>
            <div class="content">
              <h2>Hello ${fullName},</h2>
              <p>Thank you for registering as a technician with TechCare!</p>
              <p>Your application has been received and is currently under review. Our team will verify your credentials and you'll receive a notification once your account is approved.</p>
              <p>This process typically takes 1-2 business days.</p>
              <p>If you have any questions in the meantime, please don't hesitate to contact our support team.</p>
              <p>Best regards,<br>The TechCare Team</p>
            </div>
            <div class="footer">
              <p>© ${new Date().getFullYear()} TechCare. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `;

        // Send welcome email to the technician
        await emailService.sendEmail(
            email,
            'TechCare - Technician Registration Confirmation',
            welcomeHtml
        );

        // Remove password from the response
        const { password: _, ...userWithoutPassword } = newTechnician.user;

        // Send success response
        return res.status(201).json({
            message: 'Technician registered successfully',
            user: userWithoutPassword,
            technicianDetails: {
                ...newTechnician.techDetails,
                profileImageUrl: imageUploadResult.publicUrl,
                certificateUrl: certificateUploadResult.publicUrl
            },
            token
        });

    } catch (error) {
        console.error('Error during technician sign up:', error);
        return res.status(500).json({
            message: 'Internal server error',
            error: error.message
        });
    }
};

// Login for Customer, Admin and Technician
const Login = async (req, res) => {
    try {
        // Extract email and password from request body
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            return res.status(400).json({
                message: 'Email and password are required'
            });
        }

        // Find user by email in database with technician details
        const user = await prisma.users.findUnique({
            where: { email },
            include: {
                technicianDetails: true
            }
        });

        // Check if user exists
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Check if user account is active
        if (!user.isActive) {
            return res.status(403).json({
                message: 'Your account has been deactivated. Please contact support.'
            });
        }

        // Verify password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Role-based status validation
        switch (user.role) {
            case 'CUSTOMER':
                break;

            case 'ADMIN':
                break;

            case 'TECHNICIAN':
                // Special validation for technicians
                if (!user.technicianDetails) {
                    return res.status(403).json({
                        message: 'Access denied - Technician profile not found. Please contact support.'
                    });
                }

                // Check technician approval status
                if (user.technicianDetails.approvalStatus === 'PENDING') {
                    return res.status(403).json({
                        message: 'Your technician account is not approved. Please wait for approval before logging in'
                    });
                }

                if (user.technicianDetails.approvalStatus === 'REJECTED') {
                    return res.status(403).json({
                        message: 'Your technician account has been rejected. Please contact support for assistance.'
                    });
                }

                if (user.technicianDetails.approvalStatus !== 'APPROVED') {
                    return res.status(403).json({
                        message: 'Your technician account is not approved. Please wait for the admin to approve them please'
                    });
                }

                break;

            default:
                return res.status(403).json({
                    message: 'Invalid user role. Please contact support.'
                });
        }

        // Generate JWT token with user info details
        const tokenPayload = {
            userId: user.id,
            email: user.email,
            role: user.role,
            fullName: user.fullName,
            technicianDetails: user.technicianDetails ? user.technicianDetails.id : null
        };

        // Add technician Id if user is a technician
        if (user.role === 'TECHNICIAN' && user.technicianDetails) {
            tokenPayload.technicianId = user.technicianDetails.id;
        }

        const token = jwt.sign(
            tokenPayload,
            process.env.JWT_SECRET_KEY,
            { expiresIn: '24h' }
        );

        // Remove password from the response
        const { password: _, ...userWithoutPassword } = user;

        // Role-specific response message
        const roleMessage = {
            CUSTOMER: 'Customer login successful',
            ADMIN: 'Administrator login successful',
            TECHNICIAN: 'Technician login successful'
        };

        // Send success response
        return res.status(200).json({
            message: roleMessage[user.role] || 'Login successful',
            user: userWithoutPassword,
            token,
            role: user.role,
            loginTime: new Date().toISOString()
        });

    } catch (error) {
        console.error('Error during login:', error);
        return res.status(500).json({
            message: 'Internal server error',
            error: error.message
        });
    }
};

module.exports = {
    TechnicianSignUp,
    CustomerOrAdminSignUp,
    Login
};