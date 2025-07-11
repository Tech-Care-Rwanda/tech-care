const jwt = require('jsonwebtoken');
const {PrismaClient} = require('../generated/prisma')


const prisma = new  PrismaClient();

// Base token verification middleware 
const verifyToken  = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader ){
            return res.status(401).json({ message: 'Access token is required'});

        }

        const token  = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : authHeader;
        
        if (!token) {
            return res.status(401).json({ message: 'Access token is required' });
        }

        // Verify the  token
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

        // find user in  database
        const user = await prisma.user.findUnique( {
            where: {id: decoded.userId},
            include: {
                technicianDetails: true,
                
            }
        });

        if (!user) {
            return res.status(401).json({ message: 'invalid toke - User not found' });
        }

        if (!user.isActive) {
            return res.status(403).json({ message: 'User is not active' });
        }

        // Attach user to  request
        req.user = {
            id: user.id,
            email: user.email,
            role: user.role,
            fullName: user.fullName,
            technicianDetails: user.technicianDetails

        };

        next();
    }
    catch (error){
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: 'Invalid token' });
        }
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Token has expired' });
        }
        
        console.error('Error in verifyToken middleware:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

// Customer  Authentication middleware 
const verifyCustomer = async (req, res, next) => {
    try {
        // Get  user role from  request
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({ message: 'Access token is required' });
        }

        const token  = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : authHeader;

        if (!token) { 
            return res.status(401).json({ message: 'Access token is required' });
        }

        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

        // Find user in  database
        const user = await prisma.user.findUnique({
            where: { id: decoded.userId }
        })

        if (!user) {
            return res.status(401).json({ message: 'Invalid token - User not found' });
        }

        if (!user.isActive) {
            return res.status(403).json({ message: 'User is not active' });
        }

        // Check if user is a customer
        if (user.role !== 'CUSTOMER') {
            return res.status(403).json({ message: 'Access denied - User is not a customer' });
        }

        // Attach user to  request 
        req.user = {
            id: user.id,
            email: user.email,
            role: user.role,
            fullName: user.fullName
        }

        next();

    }
    catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Session expired. Please login again.' });
        }
        
        console.error('Error in verifyCustomer middleware:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
    }


    // Technician Authentication middleware
    const verifyTechnician = async (req, res, next) => {
        try {
               const authHeader = req.headers.authorization;

               if (!authHeader) {
                return res.status(401).json({message: 'Access token is required' });
               }

               const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : authHeader;

               if (!token){
                return res.status(401).json({ message: 'Access token is required' });
            
               }

               // verify technician token
               const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

               // find user in database with technician details
               const user = await prisma.user.findUnique({
                   where: { id: decoded.userId },
                   include: {
                       technicianDetails: true
                   }
               });

               if (!user) {
                   return res.status(401).json({ message: 'Invalid token - User not found' });
               }

               if (!user.isActive) {
                   return res.status(403).json({ message: 'User is not active' });
               }

               // check if user is a technician
               if (user.role !== 'TECHNICIAN') {
                     return res.status(403).json(
                        {
                            message: 'Access denied - User is not a technician'
                        }
                     )
               }

               // check if  technician account  is  approve
               if (!user.technicianDetails){
                    return res.status(403).json({
                        message: 'Access denied and profile is not found- Technician account is not approved'
                    })
               }

               if (user.technicianDetails.approvalStatus !== 'APPROVED') {
                     const statusMessage = user.technicianDetails.approvalStatus === 'PENDING'
                        ? 'Technician account is pending approval. please wait for account for approval.'
                        : 'Technician account has been rejected. Please contact support.';

                        return res.status(403).json({
                              message: statusMessage
                        });
       
               }

               // Attach user to request
                        req.user = {
                            id: user.id,
                            email: user.email,
                            role: user.role,
                            fullName: user.fullName,
                            technicianDetails: user.technicianDetails.id,
                            technicianDetails: user.technicianDetails
                        }


               next();




        }
        catch(error){
              if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Session expired. Please login again.' });
        }
        
        console.error('Error in verifyTechnician middleware:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
    } 


    // Admin Authentication middleware
    const verifyAdmin = async (req, res, next) => {
        try {

            const authHeader = req.headers.authorization;

            if (!authHeader){
                return res.status(401).json({ message: 'Access token is required' });
            }

            const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : authHeader;

            if (!token) {
                return res.status(401).json({ message: 'Access token is required' });
            }
            
            // Verify the token
            const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

            // Find user in database
            const user = await prisma.user.findUnique({
                where: { id: decoded.userId }
            });

            if (!user) {
                return res.status(401).json({ message: 'Invalid token - User not found' });
            }

            if (!user.isActive) {
                return res.status(403).json({ message: 'User is not active' });
            }
         
            // Check if user is an admin
            if (user.role !== 'ADMIN'){
                return res.status(403).json({
                    message: 'Access denied - User is not an admin'
                })
            }

            // Attach user to  request
            req.user = {
                id: user.id,
                email: user.email,
                role: user.role,
                fullName: user.fullName
            }

            next();
        }
        catch (error) {
            if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: 'Invalid credentials' });
             }
             if (error.name === 'TokenExpiredError') {
              return res.status(401).json({ message: 'Session expired. Please login again.' });
             }
        
        console.error('Error in verifyAdmin middleware:', error);
        return res.status(500).json({ error: 'Internal server error' });

        }
    }

    module.exports = {
        verifyToken,
        verifyCustomer,
        verifyTechnician,
        verifyAdmin
    }
    