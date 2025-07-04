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
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.io.IOException;
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

    private static final String PHOTO_DIRECTORY = System.getProperty("user.home") + "/techcare-uploads/images";

    private final Function<String, String> fileExtension = filename -> Optional.ofNullable(filename)
            .filter(name -> name.contains("."))
            .map(name -> name.substring(filename.lastIndexOf(".") + 1))
            .orElse("png");

    private final BiFunction<Long, MultipartFile, String> photoFunction = (id, image) -> {
        try {
            Path fileStorageLocation = Paths.get(PHOTO_DIRECTORY).toAbsolutePath().normalize();
            if (!Files.exists(fileStorageLocation)) {
                Files.createDirectories(fileStorageLocation);
            }
            String extension = fileExtension.apply(image.getOriginalFilename());
            String fileName = id + "." + extension;
            Files.copy(image.getInputStream(), fileStorageLocation.resolve(fileName), REPLACE_EXISTING);
            return ServletUriComponentsBuilder
                    .fromCurrentContextPath()
                    .path("/uploads/images/" + fileName)
                    .toUriString();
        } catch (IOException e) {
            throw new RuntimeException("Couldn't create directory for photo storage", e);
        }
    };

    @Override
    public Technician TechnicianSignUp(TechnicianSignUpRequest request) {
        Technician existingTechnician = technicianRepo.findByEmail(request.getEmail());
        if(existingTechnician != null){
            throw new ResponseStatusException(BAD_REQUEST, "User with this email " + request.getEmail() + " already exists");

        }
        Technician technician = technicianRepo.save(createTechnician(request));

        // Send Welcome Email message with HTML and CSS
        EmailDtos emailDtos = new EmailDtos();
        emailDtos.setRecipient(request.getEmail());
        emailDtos.setSubject("Welcome to TechCare - Technician Application Received");
        emailDtos.setMessageBody(
            """
<html>
<head>
    <style>
        .container { background: #f7f7f7; padding: 30px; border-radius: 10px; font-family: Arial, sans-serif; }
        .header { color: #2d8cf0; font-size: 24px; font-weight: bold; margin-bottom: 10px; }
        .body { color: #333; font-size: 16px; margin-bottom: 20px; }
        .footer { color: #888; font-size: 14px; }
    </style>
</head>
<body>
    <div class='container'>
        <div class='header'>Thank you for joining TechCare!</div>
        <div class='body'>
            Thank you for joining our platform and completing your application.<br>
            Your account will be reviewed and approved by an admin within <b>24 hours</b>.<br><br>
            We appreciate your interest in becoming a technician with us.
        </div>
        <div class='footer'>
            Best regards,<br>
            <span style='color:#2d8cf0;'>TechCare Team</span>
        </div>
    </div>
</body>
</html>
""");
        emailService.sendEmail(emailDtos);
        
        return null;
    }


    private Technician createTechnician(TechnicianSignUpRequest request) {
        return new Technician(
                request.getEmail(),
                request.getPhoneNumber(),
                request.getEmail(),
                request.getSpecialization(),
                request.getAge(),
                request.getGender(),
                request.getCertificationUrl(),
                request.getImageUrl()
        );
    }

    @Override
    public JwtResponse TechnicianLogin(TechnicianLoginRequest request) {
        return null;
    }

    @Override
    public Technician getTechnicianById(Long id) {
        return null;
    }

    @Override
    public Void logoutTechnician(String token) {
        return null;
    }

    @Override
    public Technician checkIfTechnicianAutheticated(String token) {
        return null;
    }

    @Override
    public Technician getTechnicianProfileFromToken(String token) {
        return null;
    }


}
