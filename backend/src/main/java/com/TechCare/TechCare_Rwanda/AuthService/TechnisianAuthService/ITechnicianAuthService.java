package com.TechCare.TechCare_Rwanda.AuthService.TechnisianAuthService;

import com.TechCare.TechCare_Rwanda.Domain.Technician;
import com.TechCare.TechCare_Rwanda.Dto.Response.JwtResponse;
import com.TechCare.TechCare_Rwanda.Dto.SignUp.TechnicianSignUpRequest;
import com.TechCare.TechCare_Rwanda.Dto.login.TechnicianLoginRequest;
import org.springframework.web.multipart.MultipartFile;

public interface ITechnicianAuthService {
    public Technician TechnicianSignUp(TechnicianSignUpRequest request);
    public JwtResponse TechnicianLogin(TechnicianLoginRequest request);
    public Technician getTechnicianById(Long id);
    public Void logoutTechnician(String token);
    public Technician checkIfTechnicianAutheticated(String token);
    public Technician getTechnicianProfileFromToken(String token);
    public Technician changePassword(String token, String currentPassword, String newPassword);
    

}
