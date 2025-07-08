package com.TechCare.TechCare_Rwanda.Controller.TechnisianController;

import com.TechCare.TechCare_Rwanda.Domain.Technician;
import com.TechCare.TechCare_Rwanda.Dto.PasswordChangeRequest;
import com.TechCare.TechCare_Rwanda.Dto.Response.JwtResponse;
import com.TechCare.TechCare_Rwanda.Dto.SignUp.TechnicianSignUpRequest;
import com.TechCare.TechCare_Rwanda.Dto.login.TechnicianLoginRequest;
import com.TechCare.TechCare_Rwanda.AuthService.TechnisianAuthService.ITechnicianAuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/technician")
@RequiredArgsConstructor
public class TechnicianAuthController {

    private final ITechnicianAuthService technicianAuthService;

    @PostMapping("/signup")
    public ResponseEntity<Technician> signup(@ModelAttribute TechnicianSignUpRequest request) {
        return ResponseEntity.ok(technicianAuthService.TechnicianSignUp(request));
    }

    @PostMapping("/login")
    public ResponseEntity<JwtResponse> login(@RequestBody TechnicianLoginRequest request) {
        return ResponseEntity.ok(technicianAuthService.TechnicianLogin(request));
    }

    @GetMapping("/profile")
    @PreAuthorize("hasRole('TECHNICIAN')")
    public ResponseEntity<Technician> getProfile(@RequestHeader("Authorization") String token) {
        return ResponseEntity.ok(technicianAuthService.getTechnicianProfileFromToken(token));
    }

    @PostMapping("/logout")
    @PreAuthorize("hasRole('TECHNICIAN')")
    public ResponseEntity<String> logout(@RequestHeader("Authorization") String token) {
        technicianAuthService.logoutTechnician(token);
        return ResponseEntity.ok("Logged out successfully");
    }

    @PostMapping("/change-password")
    @PreAuthorize("hasRole('TECHNICIAN')")
    public ResponseEntity<String> changePassword(
            @RequestHeader("Authorization") String token,
            @RequestBody PasswordChangeRequest request) {

        if (!request.getNewPassword().equals(request.getConfirmPassword())) {
            return ResponseEntity.badRequest().body("New passwords do not match");
        }

        technicianAuthService.changePassword(token, request.getCurrentPassword(), request.getNewPassword());
        return ResponseEntity.ok("Password changed successfully");
    }
}
