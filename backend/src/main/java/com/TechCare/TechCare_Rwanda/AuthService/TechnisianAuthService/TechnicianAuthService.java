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


@Servive
public class TechnicianAuthService implements ITechnicianAuthService{
    private final TechnicianRepo technicianRepo;
    private final CustomUserDetailsService customUserDetailsService;
    private final JwtProvider jwtProvider;
    private final EmailService emailService;
   
   
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
        }
    } ;
    
    //Function  to save  document and return the file path 
    private final BiFunction<Long, MultipartFile, String> documentFunction = (id, doc) -> {
        try {

              Path storage = Path.get(DOC_DIRECTORY).toAbsolutePath().normalize();
              if(!Files.exists(storage)) Files.createDirectories(storage);
                String ext = fileExtension.apply(doc.getOriginalFilename());
                String fileName = id + "." + ext;
                Files.copy(doc.getInputStream(), storage.resolve(fileName), REPLACE_EXISTING);

                return ServletUriComponentsBuilder.fromCurrentContextPath()
                    .path("/uploads/documents/" + fileName)
                    .toUriString();


        }catch(IOException e) {
            throw new RuntimeException("Failed to save document", e);
        }
    };


    @Override
    public Technician technicianSignUp(TechnicianSignUpRequest request) {
        if(technicianRepo.existsByEmail(request.getEmail())){
            throw new ResponseStatusException(BAD_REQUEST, "Email already exists with this  email :" + request.getEmail());

        }

        // saving information in the database
        Technician technician = new Technician();
        technician.setFullName(request.getFullName());
        technician.setEmail(request.getEmail());
        technician.setPhoneNumber(request.getPhoneNumber());
        technician.setSpecialization(request.getSpecialization());
        technician.setAge(request.getAge());
        technician.setGender(request.getGender());

        Technician savedTechnician = technicianRepo.save(technician);

        //Uploading photo and document
         String imageUrl = photoFunction.apply(savedTechnician.getId(), request.getImageFile());
         String certUrl  = documentFunction.apply(savedTechnician.getId(), request.getCertificationUrl());

        //Setting the image and document URL to the technician
        savedTechnician.setImageUrl(imageUrl);
        savedTechnician.setCertificationUrl(certUrl);

        technicianRepo.save(savedTechnician);


        // Sending email notification
        EmailDtos email = new EmailDtos();
        email.setRecipient(request.getEmail());
        email.setSubject("Welcome to TechCare - Technician Application Received");
        email.setMessageBody(
               "<html>\n" +
               "<head>\n" +
               "    <style>\n" +
               "        .container { background: #f7f7f7; padding: 30px; border-radius: 10px; font-family: Arial, sans-serif; }\n" +
               "        .header { color: #2d8cf0; font-size: 24px; font-weight: bold; margin-bottom: 10px; }\n" +
               "        .body { color: #333; font-size: 16px; margin-bottom: 20px; }\n" +
               "        .footer { color: #888; font-size: 14px; }\n" +
               "    </style>\n" +
               "</head>\n" +
               "<body>\n" +
               "    <div class='container'>\n" +
               "        <div class='header'>Thank you for joining TechCare!</div>\n" +
               "        <div class='body'>\n" +
               "            Thank you for joining our platform and completing your application.<br>\n" +
               "            Your account will be reviewed and approved by an admin within <b>24 hours</b>.<br><br>\n" +
               "            We appreciate your interest in becoming a technician with us.\n" +
               "        </div>\n" +
               "        <div class='footer'>\n" +
               "            Best regards,<br>\n" +
               "            <span style='color:#2d8cf0;'>TechCare Team</span>\n" +
               "        </div>\n" +
               "    </div>\n" +
               "</body>\n" +
               "</html>\n"
        );

        emailService.sendEmail(email);

        return savedTechnician;
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
