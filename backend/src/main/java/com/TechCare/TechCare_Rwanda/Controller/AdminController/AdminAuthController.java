package com.TechCare.TechCare_Rwanda.Controller.AdminController;

import com.TechCare.TechCare_Rwanda.Domain.Technician;
import com.TechCare.TechCare_Rwanda.Dto.Response.JwtResponse;
import com.TechCare.TechCare_Rwanda.Dto.SignUp.AdminSignUpRequest;
import com.TechCare.TechCare_Rwanda.Dto.login.AdminLoginRequest;
import com.TechCare.TechCare_Rwanda.AuthService.AdminAuthService.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/admin")
@RequiredArgsConstructor
public class AdminAuthController {
    private final AuthService authService;

    @PostMapping("/signup")
    public ResponseEntity<?> signUpAdmin(@RequestBody AdminSignUpRequest request) {
        return ResponseEntity.ok(authService.signUp(request));
    }

    @PostMapping("/login")
    public ResponseEntity<JwtResponse> loginAdmin(@RequestBody AdminLoginRequest request) {
        JwtResponse jwt = authService.login(request);
        return ResponseEntity.ok(jwt);
    }

    // Example of a protected admin-only endpoint
    @GetMapping("/dashboard")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> adminDashboard() {
        return ResponseEntity.ok("Welcome to the admin dashboard!");
    }

    // Technician management endpoints
    @GetMapping("/technicians/pending")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Technician>> getPendingTechnicians() {
        return ResponseEntity.ok(authService.getAllPendingTechnicians());
    }

    @GetMapping("/technicians")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Technician>> getAllTechnicians() {
        return ResponseEntity.ok(authService.getAllTechnicians());
    }

    @PostMapping("/technicians/{id}/approve")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Technician> approveTechnician(@PathVariable Long id) {
        return ResponseEntity.ok(authService.approveTechnician(id));
    }

    @PostMapping("/technicians/{id}/reject")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Technician> rejectTechnician(
            @PathVariable Long id, 
            @RequestParam(required = false) String reason) {
        return ResponseEntity.ok(authService.rejectTechnician(id, reason));
    }
}
