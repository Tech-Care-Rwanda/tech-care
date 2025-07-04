package com.TechCare.TechCare_Rwanda.AuthService.AdminAuthService;

import com.TechCare.TechCare_Rwanda.Domain.Admin;
import com.TechCare.TechCare_Rwanda.Dto.Response.JwtResponse;
import com.TechCare.TechCare_Rwanda.Dto.SignUp.AdminSignUpRequest;
import com.TechCare.TechCare_Rwanda.Dto.login.AdminLoginRequest;


public interface IAuthService {
    public Admin signUp(AdminSignUpRequest request);
    public JwtResponse login(AdminLoginRequest request);
    public void logout(String token);
    public Admin checkIfAdminIsAuthenticated(String token);
    public Admin getAdminById(Long id);
}
