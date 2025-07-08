package com.TechCare.TechCare_Rwanda.AuthService.TechnisianAuthService;

import com.TechCare.TechCare_Rwanda.Domain.Technician;
import com.TechCare.TechCare_Rwanda.Dto.Response.JwtResponse;
import com.TechCare.TechCare_Rwanda.Dto.SignUp.TechnicianSignUpRequest;
import com.TechCare.TechCare_Rwanda.Dto.login.TechnicianLoginRequest;
import com.TechCare.TechCare_Rwanda.EmailConfiguration.EmailDtos;
import com.TechCare.TechCare_Rwanda.EmailConfiguration.EmailService.EmailService;
import com.TechCare.TechCare_Rwanda.Repositories.TechnicianRepo.TechnicianRepo;
import com.TechCare.TechCare_Rwanda.configuration.CustomUserDetailsService;
import com.TechCare.TechCare_Rwanda.configuration.JwtProvider;
import io.jsonwebtoken.io.IOException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.security.SecureRandom;
import java.util.Optional;
import java.util.function.BiFunction;
import java.util.function.Function;

import static java.nio.file.StandardCopyOption.REPLACE_EXISTING;
import static org.springframework.http.HttpStatus.BAD_REQUEST;

@Service
@RequiredArgsConstructor
public class TechnicianAuthService implements ITechnicianAuthService{
    private final TechnicianRepo technicianRepo;
    private final CustomUserDetailsService customUserDetailsService;
    private final JwtProvider jwtProvider;
    private final EmailService emailService;
    private final PasswordEncoder passwordEncoder;
   
   
    private static final String PHOTO_DIRECTORY = System.getProperty("user.home") + "/techcare-uploads/images";
    private static final String DOC_DIRECTORY = System.getProperty("user.home") + "/techcare-uploads/documents";


    private final Function<String, String> fileExtension = fileName -> Optional.ofNullable(fileName)
            .filter(name -> name.contains("."))
            .map(name -> name.substring(fileName.lastIndexOf('.') + 1))
            .orElse("png");

    
    // Function to save the photo and return the file path
    // This function takes an ID and a MultipartFile, saves the file, and returns the file path as a string.
    private final BiFunction<Long, MultipartFile, String> photoFunction = (id, file) -> {
        try {
            Path storage = Paths.get(PHOTO_DIRECTORY).toAbsolutePath().normalize();

            if(!Files.exists(storage)) Files.createDirectories(storage);
            String ext = fileExtension.apply(file.getOriginalFilename());
            String fileName = id + "." + ext;
            Files.copy(file.getInputStream(), storage.resolve(fileName), REPLACE_EXISTING);

            return ServletUriComponentsBuilder.fromCurrentContextPath()
                    .path("/uploads/images/" + fileName)
                    .toUriString();

        }
        catch(IOException e) {
            throw new RuntimeException("Failed to save photo", e);
        } catch (java.io.IOException e) {
            throw new RuntimeException(e);
        }
    } ;
    
    //Function  to save  document and return the file path 
    private final BiFunction<Long, MultipartFile, String> documentFunction = (id, doc) -> {
        try {

              Path storage = Paths.get(DOC_DIRECTORY).toAbsolutePath().normalize();
              if(!Files.exists(storage)) Files.createDirectories(storage);
              String ext = fileExtension.apply(doc.getOriginalFilename());
              String fileName = id + "." + ext;
              Files.copy(doc.getInputStream(), storage.resolve(fileName), REPLACE_EXISTING);

              return ServletUriComponentsBuilder.fromCurrentContextPath()
                    .path("/uploads/documents/" + fileName)
                    .toUriString();


        }catch(IOException e) {
            throw new RuntimeException("Failed to save document", e);
        } catch (java.io.IOException e) {
            throw new RuntimeException(e);
        }
    };


    @Override
    public Technician TechnicianSignUp(TechnicianSignUpRequest request) {
        if(technicianRepo.existsByEmail(request.getEmail())){
            throw new ResponseStatusException(BAD_REQUEST, "Email already exists with this email: " + request.getEmail());
        }

        // Create technician with PENDING status (no password set yet)
        Technician technician = new Technician();
        technician.setFullName(request.getFullName());
        technician.setEmail(request.getEmail());
        technician.setPhoneNumber(request.getPhoneNumber());
        technician.setSpecialization(request.getSpecialization());
        technician.setAge(request.getAge());
        technician.setGender(request.getGender());
        // Status defaults to PENDING in the entity
        
        Technician savedTechnician = technicianRepo.save(technician);

        // Upload photo and document
        String imageUrl = photoFunction.apply(savedTechnician.getId(), request.getImageFile());
        String certUrl = documentFunction.apply(savedTechnician.getId(), request.getCertificationUrl());

        // Set the image and document URLs
        savedTechnician.setImageUrl(imageUrl);
        savedTechnician.setCertificationUrl(certUrl);

        technicianRepo.save(savedTechnician);

        // Send application received email
        sendApplicationReceivedEmail(request.getEmail(), request.getFullName());

        return savedTechnician;
    }

    private void sendApplicationReceivedEmail(String email, String fullName) {
        EmailDtos emailDto = new EmailDtos();
        emailDto.setRecipient(email);
        emailDto.setSubject("TechCare - Application Received");
        emailDto.setMessageBody(
            "<html>" +
            "<head>" +
            "    <style>" +
            "        .container { background: #f7f7f7; padding: 30px; border-radius: 10px; font-family: Arial, sans-serif; }" +
            "        .header { color: #2d8cf0; font-size: 24px; font-weight: bold; margin-bottom: 10px; }" +
            "        .body { color: #333; font-size: 16px; margin-bottom: 20px; }" +
            "        .footer { color: #888; font-size: 14px; }" +
            "    </style>" +
            "</head>" +
            "<body>" +
            "    <div class='container'>" +
            "        <div class='header'>Thank you for your interest in TechCare!</div>" +
            "        <div class='body'>" +
            "            Dear " + fullName + ",<br><br>" +
            "            Thank you for submitting your technician application to TechCare.<br>" +
            "            Your application is now under review by our admin team.<br><br>" +
            "            <strong>What happens next:</strong><br>" +
            "            • Our team will review your documents and credentials<br>" +
            "            • You will be notified within 24-48 hours about the status<br>" +
            "            • If approved, you will receive login credentials via email<br><br>" +
            "            We appreciate your patience during this process." +
            "        </div>" +
            "        <div class='footer'>" +
            "            Best regards,<br>" +
            "            <span style='color:#2d8cf0;'>TechCare Team</span>" +
            "        </div>" +
            "    </div>" +
            "</body>" +
            "</html>"
        );
        emailService.sendEmail(emailDto);
    }



    @Override
    public JwtResponse TechnicianLogin(TechnicianLoginRequest request) {
        String email = request.getEmail();
        String password = request.getPassword();

        // Check if technician exists
        Technician technician = technicianRepo.findByEmail(email);
        if (technician == null) {
            throw new BadCredentialsException("Invalid email or password");
        }

        // Check if technician is approved
        if (technician.getStatus() != Technician.TechnicianStatus.APPROVED) {
            throw new ResponseStatusException(BAD_REQUEST, "Account not approved yet. Please wait for admin approval.");
        }

        // Check if password is set (should be set after approval)
        if (technician.getPassword() == null) {
            throw new ResponseStatusException(BAD_REQUEST, "Account setup incomplete. Please contact admin.");
        }

        // Validate password
        if (!passwordEncoder.matches(password, technician.getPassword())) {
            throw new BadCredentialsException("Invalid email or password");
        }

        // Create authentication token
        UserDetails userDetails = customUserDetailsService.loadUserByUsername(email);
        Authentication auth = new org.springframework.security.authentication.UsernamePasswordAuthenticationToken(
                userDetails, null, userDetails.getAuthorities());

        SecurityContextHolder.getContext().setAuthentication(auth);

        // Generate JWT token
        String jwt = JwtProvider.generateToken(auth);

        return new JwtResponse(jwt);
    }

    @Override
    public Technician getTechnicianById(Long id) {
        return technicianRepo.findById(id).orElse(null);
    }

    @Override
    public Void logoutTechnician(String token) {
        // Stateless JWT: logout is handled on the client by deleting the token
        // For enhanced security, you could implement a token blacklist here
        return null;
    }

    @Override
    public Technician checkIfTechnicianAutheticated(String token) {
        if (token == null || token.isEmpty()) {
            throw new ResponseStatusException(
                org.springframework.http.HttpStatus.UNAUTHORIZED, "Token is missing"
            );
        }
        
        // Remove Bearer prefix if present
        if (token.startsWith("Bearer ")) {
            token = token.substring(7);
        }
        
        try {
            String email = JwtProvider.getEmailFromToken(token);
            Technician technician = technicianRepo.findByEmail(email);
            if (technician == null) {
                throw new ResponseStatusException(
                    org.springframework.http.HttpStatus.UNAUTHORIZED, "Invalid token"
                );
            }
            return technician;
        } catch (Exception e) {
            throw new ResponseStatusException(
                org.springframework.http.HttpStatus.UNAUTHORIZED, "Invalid or expired token"
            );
        }
    }

    @Override
    public Technician getTechnicianProfileFromToken(String token) {
        return checkIfTechnicianAutheticated(token);
    }


    @Override
    public Technician changePassword(String token, String currentPassword, String newPassword) {
        Technician technician = checkIfTechnicianAutheticated(token);
        
        if (!passwordEncoder.matches(currentPassword, technician.getPassword())) {
            throw new BadCredentialsException("Current password is incorrect");
        }
        
        technician.setPassword(passwordEncoder.encode(newPassword));
        return technicianRepo.save(technician);
    }

    

}
