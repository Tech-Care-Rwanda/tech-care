const express = require('express');
const { verifyCustomer } = require('../MiddleWare/AuthMiddleWare');
const { 
    getCustomerProfile,
    checkIfCustomerIsAutheticated,
    requestForForgetPassword,
    resetPasswordWithToken,
    changePassword, 
    Logout
} = require('../Controllers/CustomerController');

const router = express.Router();

// Getting customer profile from jwt
router.get('/profile', verifyCustomer, getCustomerProfile);

// Check if customer is authenticated (for preventing re-login)
// Note: This route also uses verifyCustomer middleware which will catch token expiration
router.get('/check-auth', verifyCustomer, checkIfCustomerIsAutheticated);
// Route to logout customer
router.get('/logout', verifyCustomer, Logout);

// Password reset routes
router.post('/forgot-password', requestForForgetPassword);
router.post('/reset-password', resetPasswordWithToken);
router.post('/change-password',  changePassword);


module.exports = router;
