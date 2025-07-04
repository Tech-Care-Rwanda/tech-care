package com.TechCare.TechCare_Rwanda.AuthService.CustomerAuthService;

import com.TechCare.TechCare_Rwanda.Domain.Customer;
import com.TechCare.TechCare_Rwanda.Dto.Response.JwtResponse;
import com.TechCare.TechCare_Rwanda.Dto.SignUp.CustomerSignupRequest;
import com.TechCare.TechCare_Rwanda.Dto.login.CustomerLoginRequest;

public interface ICustomerAuthService {
    public Customer CustomerSignUp(CustomerSignupRequest request);
    public JwtResponse CustomerLogin(CustomerLoginRequest request);
    public Customer getCustomerById(Long id);
    public void logoutCustomer(String token);
    public Customer checkIfCustomerAutheticated(String token);
    public Customer getCustomerProfileFromToken(String token);
}
