package com.TechCare.TechCare_Rwanda.AuthService.CustomerAuthService;

import com.TechCare.TechCare_Rwanda.Domain.Customer;
import com.TechCare.TechCare_Rwanda.Dto.Response.JwtResponse;
import com.TechCare.TechCare_Rwanda.Dto.SignUp.CustomerSignupRequest;
import com.TechCare.TechCare_Rwanda.Dto.login.CustomerLoginRequest;
import org.springframework.web.multipart.MultipartFile;

public interface ICustomerAuthService {
    public Customer CustomerSignUp(CustomerSignupRequest request);
    public JwtResponse CustomerLogin(CustomerLoginRequest request);
    public Customer getCustomerById(Long id);
    public void logoutCustomer(String token);
    public Customer checkIfCustomerAutheticated(String token);
    public Customer getCustomerProfileFromToken(String token);
    
    // Image upload methods
    public Customer uploadCustomerImage(Long customerId, MultipartFile imageFile);
    public Customer uploadCustomerImageWithToken(String token, MultipartFile imageFile);
    public Customer updateCustomerProfile(Long customerId, String fullName, String phoneNumber, MultipartFile imageFile);
    public Customer updateCustomerProfileWithToken(String token, String fullName, String phoneNumber, MultipartFile imageFile);
    
    // Password reset methods
    public void sendPasswordResetEmail(String email);
    public void resetPassword(String resetToken, String newPassword);
}
