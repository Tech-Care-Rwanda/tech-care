package com.TechCare.TechCare_Rwanda.Controller.TechnisianController;

import com.TechCare.TechCare_Rwanda.Domain.Technician;
import com.TechCare.TechCare_Rwanda.Repositories.TechnicianRepo.TechnicianRepo;
import com.TechCare.TechCare_Rwanda.configuration.JwtProvider;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/technician")
public class TechnicianAuthController {

    private final TechnicianRepo technicianRepository;
    private final JwtProvider jwtProvider;
    private final BCryptPasswordEncoder passwordEncoder;

    public TechnicianAuthController(TechnicianRepo technicianRepository, JwtProvider jwtProvider) {
        this.technicianRepository = technicianRepository;
        this.jwtProvider = jwtProvider;
        this.passwordEncoder = new BCryptPasswordEncoder();
    }

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody Technician technician) {
        Technician existingTechnician = technicianRepository.findByEmail(technician.getEmail());
        if (existingTechnician != null) {
            return ResponseEntity.badRequest().body("Email already exists");
        }
        technician.setPassword(passwordEncoder.encode(technician.getPassword()));
        technicianRepository.save(technician);
        return ResponseEntity.ok("Technician registered successfully");
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Technician loginRequest) {
        Technician technician = technicianRepository.findByEmail(loginRequest.getEmail());
        if (technician == null || !passwordEncoder.matches(loginRequest.getPassword(), technician.getPassword())) {
            return ResponseEntity.status(401).body("Invalid email or password");
        }
        String token = jwtProvider.generateToken(technician.getEmail(), "TECHNICIAN");
        return ResponseEntity.ok(token);
    }
}
