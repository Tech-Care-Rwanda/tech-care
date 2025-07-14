const { PrismaClient } = require('../generated/prisma');
const emailService = require('../Configuration/EmailConfig');
const crypto = require('crypto');

const prisma = new PrismaClient();

// Generate a secure random token
function generateResetToken() {
    return crypto.randomBytes(32).toString('hex');
}

// getting Customer  profile  from  jwt 
const getCustomerProfile = async (req, res) => {
    try {
      // the  user  information is  already attached to req.user by the  verifyCustomer middleware
      const customerId = req.user.id;

      //Fetch complete customer profile from database
      const customer = await prisma.users.findUnique({
         where: {
            id: customerId,
            role: 'CUSTOMER'
         },
         select : {
            id : true,
            fullName: true,
            email: true,
            phoneNumber: true,
            role: true,
            isActive: true,
            createdAt: true,
            updatedAt: true

         }

      });

      // Check  if  customer exists
      if (!customer){
          return res.status(404).json({
            message: 'Customer not found'
          })
      }

      // Check  if account  is  active
     if (!customer.isActive) {
            return res.status(403).json({
                message: 'Customer account is deactivated'
            });
        }

          // Return customer profile
        return res.status(200).json({
            message: 'Customer profile retrieved successfully',
            customer: customer,
            jwtInfo: {
                userId: req.user.id,
                email: req.user.email,
                role: req.user.role,
                fullName: req.user.fullName
            }
        });


    }
    catch (err) {
        console.error('Error getting customer profile:', err);
        res.status(500).json({ 
            message: 'Internal server error',
            error: err.message 
        });

    }
    }

    // method  for  checking  if  the  user  is  autheticated  for  prevent relogin
    const checkIfCustomerIsAutheticated = async (req, res) => {
        try {
             const customerId = req.user.id;

             // Double-check user exist in  database and  is still active
             const customer = await prisma.users.findUnique({
                  where: {
                      id : customerId,
                      role: 'CUSTOMER'
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

             // Check  if  customer  still exists
             if(!customer) {
                return res.status(401).json({
                isAuthenticated: false,
                shouldLogout: true,
                message: 'Customer account not found. Please login again.'
            });
             }

             // Check  if  customer  account is  still  active
             if (!customer.isActive) {
                 return res.status(403).json({
                     isAuthenticated: false,
                     shouldLogout: true,
                     message: 'Customer account has been deactivated. Please contact support.'
                 })
             }

              // If we reach here, customer is properly authenticated
              return  res.status(200).json({
                  isAuthenticated: true,
                  shouldLogout: false,
                  message: 'Customer is authenticated',

                  customer: {
                    id: customer.id,
                    fullName: customer.fullName,
                    email: customer.email,
                    role: customer.role
                  }, 

                  tokenInfo : {
                      userId: req.user.id,
                      email: req.user.email,
                      role: req.user.role,
                      fullName: req.user.fullName
                  }, 

                   sessionStatus: 'active'


              })
              
        }
        catch(err){

            console.error('Error checking customer authentication:', err);
        
        // Check if the error is related to JWT token expiration
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({
                isAuthenticated: false,
                shouldLogout: true,
                message: 'Session expired. Please login again.',
                errorType: 'TOKEN_EXPIRED'
            });
        }

        if (err.name === 'JsonWebTokenError') {
            return res.status(401).json({
                isAuthenticated: false,
                shouldLogout: true,
                message: 'Invalid session. Please login again.',
                errorType: 'INVALID_TOKEN'
            });
        }

        // Return authentication failed for any other errors
        return res.status(401).json({
            isAuthenticated: false,
            shouldLogout: true,
            message: 'Authentication check failed. Please login again.',
            errorType: 'AUTH_ERROR',
            error: err.message
        });
    }
           
}

// Request for forgot password - sends email with reset token
const requestForForgetPassword = async(req, res) => {
    try {
        const { email } = req.body;

        // Validate input
        if (!email) {
            return res.status(400).json({
                message: 'Email is required'
            });
        }

        // Find customer by email
        const customer = await prisma.users.findUnique({
            where: { 
                email: email.toLowerCase().trim(),
                role: 'CUSTOMER'
            }
        });

        // For security, always return success message even if email doesn't exist
        if (!customer) {
            return res.status(200).json({
                message: 'If your email is registered, you will receive a password reset link shortly.'
            });
        }

        // Check if account is active
        if (!customer.isActive) {
            return res.status(403).json({
                message: 'Account is deactivated. Please contact support.'
            });
        }

        // Generate reset token (expires in 1 hour)
        const resetToken = generateResetToken();
        const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour from now

        console.log('Generated reset token:', resetToken);
        console.log('Token expires at:', expiresAt);

        // Store the reset token in database
        try {
            await prisma.$executeRaw`
                INSERT INTO password_reset_tokens (token, "userId", "expiresAt", used)
                VALUES (${resetToken}, ${customer.id}, ${expiresAt}, false)
            `;
            console.log('Token stored successfully for user:', customer.id);
        } catch (error) {
            console.error('Error storing reset token:', error);
            return res.status(500).json({
                message: 'Failed to generate reset token. Please try again.',
                error: error.message
            });
        }

        // Create reset link (adjust URL to match your frontend)
        const resetLink = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`;

 //  Prepare reset email HTML   
const resetEmailHtml = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>TechCare - Password Reset</title>
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
        .reset-button {
            display: inline-block;
            background-color: #f44336;
            color: white !important;
            padding: 12px 30px;
            text-decoration: none !important;
            border-radius: 5px;
            font-weight: bold;
            margin: 20px 0;
        }
        .reset-button:visited {
            color: white !important;
        }
        .reset-button:hover {
            background-color: #d32f2f;
            color: white !important;
        }
        .footer {
            text-align: center;
            margin-top: 20px;
            font-size: 12px;
            color: #666;
        }
        .warning {
            background-color: #fff3cd;
            border: 1px solid #ffeaa7;
            padding: 10px;
            border-radius: 5px;
            margin: 15px 0;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Password Reset Request</h1>
        </div>
        <div class="content">
            <h2>Hello ${customer.fullName},</h2>
            <p>We received a request to reset your TechCare account password.</p>
            <p>Click the button below to reset your password:</p>
            
            <div style="text-align: center;">
                <a href="${resetLink}" class="reset-button">Reset My Password</a>
            </div>
            
            <div class="warning">
                <strong>Important:</strong>
                <ul>
                    <li>This link will expire in 1 hour</li>
                    <li>If you didn't request this reset, please ignore this email</li>
                    <li>Never share this link with anyone</li>
                </ul>
            </div>
            
            <p>If the button doesn't work, copy and paste this link into your browser:</p>
            <p style="word-break: break-all; background-color: #e9ecef; padding: 10px; border-radius: 5px;">${resetLink}</p>
            
            <p>If you didn't request this password reset, please ignore this email or contact our support team.</p>
            <p>Best regards,<br>The TechCare Team</p>
        </div>
        <div class="footer">
            <p>© 2025 TechCare. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
`;
        

        // Send reset email
        await emailService.sendEmail(
            customer.email,
            'TechCare - Password Reset Request',
            resetEmailHtml
        );

        return res.status(200).json({
            message: 'Password reset link has been sent to your email address.',
            email: customer.email
        });

    } catch(err) {
        console.error('Error in requestForForgetPassword:', err);
        res.status(500).json({ 
            message: 'Internal server error',
            error: err.message 
        });
    }
}

// Reset password using token from email

const resetPasswordWithToken = async(req, res) => {
    try {
        console.log('=== RESET PASSWORD DEBUG ===');
        console.log('Request body:', req.body);
        console.log('Request headers:', req.headers);
        
        const { token, newPassword } = req.body;

        // Validate input
        if (!token || !newPassword) {
            console.log('Missing token or password:', { token: !!token, newPassword: !!newPassword });
            return res.status(400).json({
                message: 'Reset token and new password are required'
            });
        }

        // Validate password strength
        if (newPassword.length < 8) {
            return res.status(400).json({
                message: 'Password must be at least 8 characters long'
            });
        }

        console.log('Looking for token:', token);
        console.log('Token length:', token.length);

        // Verify reset token
        let resetTokenRecord;
        try {
            const result = await prisma.$queryRaw`
                SELECT prt.*, u.id as user_id, u."fullName", u.email, u.role, u."isActive", u.password
                FROM password_reset_tokens prt
                JOIN users u ON prt."userId" = u.id
                WHERE prt.token = ${token}
                LIMIT 1
            `;
            console.log('Query result length:', result.length);
            console.log('Query result:', result);
            resetTokenRecord = result[0];
        } catch (error) {
            console.error('Error fetching reset token:', error);
            return res.status(500).json({
                message: 'Database error. Please try again.',
                error: error.message
            });
        }

        if (!resetTokenRecord) {
            console.log('No token record found');
            // Let's check if any tokens exist at all
            try {
                const allTokens = await prisma.$queryRaw`
                    SELECT token, "userId", "expiresAt", used, "createdAt"
                    FROM password_reset_tokens
                    ORDER BY "createdAt" DESC
                    LIMIT 5
                `;
                console.log('Recent tokens in database:', allTokens);
            } catch (err) {
                console.error('Error checking tokens:', err);
            }
            
            return res.status(400).json({
                message: 'Invalid reset token. Please request a new password reset.'
            });
        }

        console.log('Token record found:', resetTokenRecord);
        console.log('Token used status:', resetTokenRecord.used);
        console.log('Token expires at:', resetTokenRecord.expiresAt);
        console.log('Current time:', new Date());

        if (resetTokenRecord.used) {
            return res.status(400).json({
                message: 'Reset token has already been used. Please request a new password reset.'
            });
        }

        if (new Date() > new Date(resetTokenRecord.expiresAt)) {
            return res.status(400).json({
                message: 'Password reset token has expired. Please request a new one.'
            });
        }

        const customer = {
            id: resetTokenRecord.user_id,
            fullName: resetTokenRecord.fullName,
            email: resetTokenRecord.email,
            role: resetTokenRecord.role,
            isActive: resetTokenRecord.isActive,
            password: resetTokenRecord.password
        };

        console.log('Customer found:', customer.email);

        if (!customer.isActive) {
            return res.status(403).json({
                message: 'Account is deactivated. Please contact support.'
            });
        }

        // Hash new password
        const bcrypt = require('bcryptjs');
        const hashedNewPassword = await bcrypt.hash(newPassword, 12);

        console.log('Updating password for user:', customer.id);

        // Update password and mark token as used
        try {
            await prisma.$executeRaw`
                UPDATE users SET password = ${hashedNewPassword}, "updatedAt" = ${new Date()}
                WHERE id = ${customer.id}
            `;
            
            await prisma.$executeRaw`
                UPDATE password_reset_tokens SET used = true
                WHERE token = ${token}
            `;
            
            console.log('Password updated successfully');
        } catch (error) {
            console.error('Error updating password:', error);
            return res.status(500).json({
                message: 'Failed to update password. Please try again.'
            });
        }

        // Send confirmation email (keeping existing code)
        const confirmationEmailHtml = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <title>TechCare - Password Changed</title>
            <style>
                body { font-family: Arial, sans-serif; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background-color: #4CAF50; padding: 20px; text-align: center; color: white; }
                .content { background-color: #f9f9f9; padding: 20px; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>Password Successfully Changed</h1>
                </div>
                <div class="content">
                    <h2>Hello ${customer.fullName},</h2>
                    <p>Your TechCare account password has been successfully changed.</p>
                    <p>If you made this change, no further action is required.</p>
                    <p>If you did not change your password, please contact our support team immediately.</p>
                    <p>Best regards,<br>The TechCare Team</p>
                </div>
            </div>
        </body>
        </html>
        `;

        try {
            await emailService.sendEmail(
                customer.email,
                'TechCare - Password Successfully Changed',
                confirmationEmailHtml
            );
            console.log('Confirmation email sent');
        } catch (emailError) {
            console.error('Error sending confirmation email:', emailError);
            // Don't fail the password reset if email fails
        }

        return res.status(200).json({
            message: 'Password has been successfully reset. You can now log in with your new password.',
            redirectTo: '/login?success=password-reset'
        });

    } catch(err) {
        console.error('Error in resetPasswordWithToken:', err);
        res.status(500).json({ 
            message: 'Internal server error',
            error: err.message 
        });
    }
}

// Change password for authenticated user
const changePassword = async(req, res) => {
    try {
        const customerId = req.user.id;
        const { currentPassword, newPassword } = req.body;

        // Validate input
        if (!currentPassword || !newPassword) {
            return res.status(400).json({
                message: 'Current password and new password are required'
            });
        }

        // Validate new password strength
        if (newPassword.length < 8) {
            return res.status(400).json({
                message: 'New password must be at least 8 characters long'
            });
        }

        // Get current customer with password
        const customer = await prisma.users.findUnique({
            where: { 
                id: customerId,
                role: 'CUSTOMER'
            }
        });

        if (!customer) {
            return res.status(404).json({
                message: 'Customer not found'
            });
        }

        // Verify current password
        const bcrypt = require('bcryptjs');
        const isCurrentPasswordValid = await bcrypt.compare(currentPassword, customer.password);
        
        if (!isCurrentPasswordValid) {
            return res.status(401).json({
                message: 'Current password is incorrect'
            });
        }

        // Check if new password is different from current
        const isSamePassword = await bcrypt.compare(newPassword, customer.password);
        if (isSamePassword) {
            return res.status(400).json({
                message: 'New password must be different from current password'
            });
        }

        // Hash new password
        const hashedNewPassword = await bcrypt.hash(newPassword, 12);

        // Update password
        await prisma.users.update({
            where: { id: customerId },
            data: { 
                password: hashedNewPassword,
                updatedAt: new Date()
            }
        });

        return res.status(200).json({
            message: 'Password changed successfully',
            redirectTo: '/dashboard'
        });

    } catch(err) {
        console.error('Error in changePassword:', err);
        res.status(500).json({ 
            message: 'Internal server error',
            error: err.message 
        });
    }
}

// Cleanup expired tokens (call this periodically or in a cron job)
const cleanupExpiredTokens = async () => {
    try {
        await prisma.$executeRaw`
            DELETE FROM password_reset_tokens
            WHERE "expiresAt" < ${new Date()} OR used = true
        `;
    } catch (error) {
        console.error('Error cleaning up expired tokens:', error);
    }
};


//Logout Method
const  Logout  = async (req, res) => {
    try {

        return  res.status(200).json({
            message: 'Logout successful',
            shouldClearToken: true
        });

    }
    catch (err) {
        console.log("Internal  server error")

        return res.status(5000).json({
            message: 'Internal server error',
            error: err.message 
        })
    }
}

module.exports = {
    getCustomerProfile, 
    checkIfCustomerIsAutheticated, 
    requestForForgetPassword,
    resetPasswordWithToken,
    changePassword,
    cleanupExpiredTokens,
    Logout
}

