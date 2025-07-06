package com.TechCare.TechCare_Rwanda.AuthService.AdminAuthService;

import com.TechCare.TechCare_Rwanda.Domain.Admin;
import com.TechCare.TechCare_Rwanda.Domain.Technician;
import com.TechCare.TechCare_Rwanda.Dto.Response.JwtResponse;
import com.TechCare.TechCare_Rwanda.Dto.SignUp.AdminSignUpRequest;
import com.TechCare.TechCare_Rwanda.Dto.login.AdminLoginRequest;
import com.TechCare.TechCare_Rwanda.Repositories.AdminRepo.AdminRepo;
import com.TechCare.TechCare_Rwanda.Repositories.TechnicianRepo.TechnicianRepo;
import com.TechCare.TechCare_Rwanda.Services.AdminServices.IApproveService;
import com.TechCare.TechCare_Rwanda.configuration.CustomUserDetailsService;
import com.TechCare.TechCare_Rwanda.configuration.JwtProvider;
import lombok.RequiredArgsConstructor;

import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AuthService implements IAuthService{
    private final AdminRepo adminRepo;
    private final PasswordEncoder passwordEncoder;
    private final CustomUserDetailsService customUserDetailsService;
    private final TechnicianRepo technicianRepo;
    private final IApproveService approveService;
    @Override
    public Admin signUp(AdminSignUpRequest request) {
        Admin existingAdmin = adminRepo.findByEmail(request.getEmail());
        if (existingAdmin != null){
            throw new  ResponseStatusException(
                    org.springframework.http.HttpStatus.BAD_REQUEST, "user  with this email" + request.getEmail() + "already exists"
            );
        }

        Admin admin = createAdmin(request);


        return adminRepo.save(admin);
    }


    private Admin createAdmin(AdminSignUpRequest request){
        return new Admin(
                request.getFullName(),
                request.getPhoneNumber(),
                request.getEmail(),
                passwordEncoder.encode(request.getPassword())
            

        );
    }


    @Override
    public JwtResponse login(AdminLoginRequest request) {
        String username = request.getEmail();
        String password = request.getPassword();

        UserDetails userDetails = customUserDetailsService.loadUserByUsername(username);;
        if (userDetails == null) {
            throw new BadCredentialsException("Invalid username or password");
        }

        if(!passwordEncoder.matches(password,userDetails.getPassword())){
            throw new BadCredentialsException("Invalid username or password");
        }

        org.springframework.security.authentication.UsernamePasswordAuthenticationToken auth =
                new org.springframework.security.authentication.UsernamePasswordAuthenticationToken(
                        userDetails, password, userDetails.getAuthorities());


        SecurityContextHolder.getContext().setAuthentication(auth);

        // Generate JWT (with authorities)
        String jwt = JwtProvider.generateToken(auth);

        return new JwtResponse(jwt);
    }

    @Override
    public void logout(String token) {
        // Stateless JWT: logout is handled on the client by deleting the token.
        // If you want to blacklist tokens, implement a blacklist here.
        // For now, do nothing (stateless logout).
    }

    @Override
    public Admin checkIfAdminIsAuthenticated(String token) {
        if (token == null || token.isEmpty()) {
            // Simulate logout by throwing unauthorized and optionally log the event
            throw new org.springframework.web.server.ResponseStatusException(
                org.springframework.http.HttpStatus.UNAUTHORIZED, "Token is missing. You have been logged out."
            );
        }
        // Remove Bearer prefix if present
        if (token.startsWith("Bearer ")) {
            token = token.substring(7);
        }
        try {
            String email = JwtProvider.getEmailFromToken(token);
            Admin admin = adminRepo.findByEmail(email);
            if (admin == null) {
                throw new org.springframework.web.server.ResponseStatusException(
                    org.springframework.http.HttpStatus.UNAUTHORIZED, "Invalid or expired token. You have been logged out."
                );
            }
            return admin;
        } catch (Exception e) {
            // Token is invalid or expired
            throw new org.springframework.web.server.ResponseStatusException(
                org.springframework.http.HttpStatus.UNAUTHORIZED, "Token is invalid or expired. You have been logged out."
            );
        }
    }

    @Override
    public Admin getAdminById(Long id) {
        return adminRepo.findById(id).orElse(null);
    }

    // Technician management methods
    @Override
    public List<Technician> getAllPendingTechnicians() {
        return technicianRepo.findByStatus(Technician.TechnicianStatus.PENDING);
    }

    @Override
    public List<Technician> getAllTechnicians() {
        return technicianRepo.findAll();
    }

    @Override
    public Technician approveTechnician(Long technicianId) {
        return approveService.approveTechnician(technicianId);
    }

    @Override
    public Technician rejectTechnician(Long technicianId, String reason) {
        return approveService.rejectTechnician(technicianId, reason);
    }


}
