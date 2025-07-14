const express = require('express');
const { verifyAdmin} = require('../MiddleWare/AuthMiddleWare');
const {getAdminProfile, 
    checkingIfAdminIsAutheticated, 
    getAllTechnicians, 
    ApproveTechnician,
    RejectTechnician,
    getTechnicianDetails, 
    Logout, PromoteCustomerToAdmin
} = require('../Controllers/AdminControllers');
const router = express.Router();


// Route to get admin profile
router.get('/profile', verifyAdmin, getAdminProfile);

// Route to check  if admin is autheticated
router.get('/check-isAuth', verifyAdmin, checkingIfAdminIsAutheticated)

// Route to get technicians with various filters
router.get('/get-technicians', verifyAdmin, getAllTechnicians);

// Route  to approve Technicians
router.put('/technicians/:technicianId/approve', verifyAdmin,  ApproveTechnician)

// Route to reject Technicians
router.put('/technicians/:technicianId/reject', verifyAdmin, RejectTechnician);

// Route to  get  Technician  Details
router.get('/technicians/:technicianId', verifyAdmin, getTechnicianDetails);

// Route  to promote Customer to Admin
router.put('/customer-to-admin/:customerId', verifyAdmin,  PromoteCustomerToAdmin)

// Route to  Logout
router.get('/logout', verifyAdmin, Logout);




module.exports = router;