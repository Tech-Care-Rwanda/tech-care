package com.TechCare.TechCare_Rwanda.AuthService.CustomerAuthService;

import com.TechCare.TechCare_Rwanda.Domain.Customer;
import com.TechCare.TechCare_Rwanda.Dto.Response.JwtResponse;
import com.TechCare.TechCare_Rwanda.Dto.SignUp.CustomerSignupRequest;
import com.TechCare.TechCare_Rwanda.Dto.login.CustomerLoginRequest;
import com.TechCare.TechCare_Rwanda.EmailConfiguration.EmailDtos;
import com.TechCare.TechCare_Rwanda.EmailConfiguration.EmailService.EmailService;
import com.TechCare.TechCare_Rwanda.Repositories.CustomerRepo.CustomerRepo;
import com.TechCare.TechCare_Rwanda.Services.FileUploadService.FileUploadService;
import com.TechCare.TechCare_Rwanda.configuration.CustomUserDetailsService;
import com.TechCare.TechCare_Rwanda.configuration.JwtProvider;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;




@Service
@RequiredArgsConstructor
@Slf4j
public class CustomerAuthService implements ICustomerAuthService {
    private final CustomerRepo customerRepo;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;
    private final CustomUserDetailsService customUserDetailsService;
    private final FileUploadService fileUploadService;


    @Override
    public Customer CustomerSignUp(CustomerSignupRequest request) {
        Customer existingCustomer = customerRepo.findByEmail(request.getEmail());
        if (existingCustomer != null) {
            throw new RuntimeException("Customer with email " + request.getEmail() + " already exists");
        }
        Customer customer = customerRepo.save(createCustomer(request));

        // Send Welcome Email message with HTML and CSS (optional - don't fail signup if email fails)
        try {
            EmailDtos emailDtos = new EmailDtos();
            emailDtos.setRecipient(request.getEmail());
            emailDtos.setSubject("Welcome to TechCare");
            emailDtos.setMessageBody(
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
                            "        <div class='header'>Welcome to TechCare, " + request.getFullName() + "!</div>" +
                            "        <div class='body'>" +
                            "            Thank you for signing up with <b>TechCare</b>!<br>" +
                            "            We are excited to have you on board.<br><br>" +
                            "            <b>Get started by exploring our platform and services.</b>" +
                            "        </div>" +
                            "        <div class='footer'>" +
                            "            Best regards,<br>" +
                            "            <span style='color:#2d8cf0;'>TechCare Team</span>" +
                            "        </div>" +
                            "    </div>" +
                            "</body>" +
                            "</html>"
            );
            emailService.sendEmail(emailDtos);
        } catch (Exception e) {
            // Log the error but don't fail the signup process
            log.warn("Failed to send welcome email to {}: {}", request.getEmail(), e.getMessage());
        }

        return customer;
    }

    private Customer createCustomer(CustomerSignupRequest request) {
        return new Customer(
                request.getFullName(),
                request.getPhoneNumber(),
                request.getEmail(),
                passwordEncoder.encode(request.getPassword())
        );
    }



    @Override
    public JwtResponse CustomerLogin(CustomerLoginRequest request) {

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
    public Customer getCustomerById(Long id) {
        return customerRepo.findById(id).orElseThrow(() ->
            new org.springframework.web.server.ResponseStatusException(
                org.springframework.http.HttpStatus.NOT_FOUND, "Customer not found")
        );
    }

    // Get customer profile from JWT token
    @Override
    public Customer getCustomerProfileFromToken(String token) {
        if (token == null || token.isEmpty()) {
            throw new org.springframework.web.server.ResponseStatusException(
                org.springframework.http.HttpStatus.UNAUTHORIZED, "Token is missing. You have been logged out.");
        }
        if (token.startsWith("Bearer ")) {
            token = token.substring(7);
        }
        try {
            String email = JwtProvider.getEmailFromToken(token);
            Customer customer = customerRepo.findByEmail(email);
            if (customer == null) {
                throw new org.springframework.web.server.ResponseStatusException(
                    org.springframework.http.HttpStatus.UNAUTHORIZED, "Invalid or expired token. You have been logged out.");
            }
            return customer;
        } catch (Exception e) {
            throw new org.springframework.web.server.ResponseStatusException(
                org.springframework.http.HttpStatus.UNAUTHORIZED, "Token is invalid or expired. You have been logged out.");
        }
    }

    @Override
    public void logoutCustomer(String token) {
        // Stateless JWT: logout is handled on the client by deleting the token.
        // If you want to blacklist tokens, implement a blacklist here.
        // For now, do nothing (stateless logout).
        return;
    }

    @Override
    public Customer checkIfCustomerAutheticated(String token) {
        if (token == null || token.isEmpty()) {
            throw new org.springframework.web.server.ResponseStatusException(
                org.springframework.http.HttpStatus.UNAUTHORIZED, "Token is missing. You have been logged out.");
        }
        if (token.startsWith("Bearer ")) {
            token = token.substring(7);
        }
        try {
            String email = JwtProvider.getEmailFromToken(token);
            Customer customer = customerRepo.findByEmail(email);
            if (customer == null) {
                throw new org.springframework.web.server.ResponseStatusException(
                    org.springframework.http.HttpStatus.UNAUTHORIZED, "Invalid or expired token. You have been logged out.");
            }
            return customer;
        } catch (Exception e) {
            throw new org.springframework.web.server.ResponseStatusException(
                org.springframework.http.HttpStatus.UNAUTHORIZED, "Token is invalid or expired. You have been logged out.");
        }
    }

    /**
     * Upload profile image for a customer
     * @param customerId Customer ID
     * @param imageFile Image file to upload
     * @return Updated customer with image URL
     */
    @Override
    public Customer uploadCustomerImage(Long customerId, MultipartFile imageFile) {
        try {
            // Get customer
            Customer customer = customerRepo.findById(customerId)
                .orElseThrow(() -> new RuntimeException("Customer not found"));

            // Upload image
            String imageUrl = fileUploadService.uploadCustomerImage(customerId, imageFile);

            // Update customer with image URL
            customer.setImage(imageUrl);
            Customer updatedCustomer = customerRepo.save(customer);

            log.info("Customer image uploaded successfully for customer ID: {}", customerId);
            return updatedCustomer;

        } catch (Exception e) {
            log.error("Failed to upload customer image for customer ID: {}", customerId, e);
            throw new RuntimeException("Failed to upload customer image: " + e.getMessage());
        }
    }

    /**
     * Upload profile image for a customer using JWT token
     * @param token JWT token
     * @param imageFile Image file to upload
     * @return Updated customer with image URL
     */
    @Override
    public Customer uploadCustomerImageWithToken(String token, MultipartFile imageFile) {
        try {
            // Get customer from token
            Customer customer = getCustomerProfileFromToken(token);
            
            // Upload image
            return uploadCustomerImage(customer.getId(), imageFile);

        } catch (Exception e) {
            log.error("Failed to upload customer image with token", e);
            throw new RuntimeException("Failed to upload customer image: " + e.getMessage());
        }
    }

    /**
     * Update customer profile information
     * @param customerId Customer ID
     * @param fullName Full name (optional)
     * @param phoneNumber Phone number (optional)
     * @param imageFile Image file (optional)
     * @return Updated customer
     */
    @Override
    public Customer updateCustomerProfile(Long customerId, String fullName, String phoneNumber, MultipartFile imageFile) {
        try {
            // Get customer
            Customer customer = customerRepo.findById(customerId)
                .orElseThrow(() -> new RuntimeException("Customer not found"));

            log.info("=== PROFILE UPDATE DEBUG ===");
            log.info("Customer ID: {}", customerId);
            log.info("Current name: '{}'", customer.getFullName());
            log.info("Current phone: '{}'", customer.getPhoneNumber());
            log.info("Requested fullName: '{}'", fullName);
            log.info("Requested phoneNumber: '{}'", phoneNumber);
            log.info("Has image file: {}", (imageFile != null && !imageFile.isEmpty()));

            boolean hasChanges = false;

            // Update fields if provided and different
            if (fullName != null && !fullName.trim().isEmpty()) {
                String newName = fullName.trim();
                if (!newName.equals(customer.getFullName())) {
                    log.info("Updating fullName from '{}' to '{}'", customer.getFullName(), newName);
                    customer.setFullName(newName);
                    hasChanges = true;
                } else {
                    log.info("fullName is same as current, no update needed");
                }
            } else {
                log.info("fullName not provided or empty, skipping update");
            }
            
            if (phoneNumber != null && !phoneNumber.trim().isEmpty()) {
                String newPhone = phoneNumber.trim();
                
                // Validate phone number format
                String phonePattern = "^(\\+250|0)[0-9]{9}$";
                if (!newPhone.matches(phonePattern)) {
                    throw new RuntimeException("Invalid phone number format. Use +250XXXXXXXXX or 0XXXXXXXXX format");
                }
                
                if (!newPhone.equals(customer.getPhoneNumber())) {
                    log.info("Updating phoneNumber from '{}' to '{}'", customer.getPhoneNumber(), newPhone);
                    customer.setPhoneNumber(newPhone);
                    hasChanges = true;
                } else {
                    log.info("phoneNumber is same as current, no update needed");
                }
            } else {
                log.info("phoneNumber not provided or empty, skipping update");
            }

            // Upload image if provided
            if (imageFile != null && !imageFile.isEmpty()) {
                log.info("Uploading new image for customer ID: {}", customerId);
                String imageUrl = fileUploadService.uploadCustomerImage(customerId, imageFile);
                if (!imageUrl.equals(customer.getImage())) {
                    customer.setImage(imageUrl);
                    hasChanges = true;
                }
            } else {
                log.info("No image file provided, skipping image update");
            }

            if (!hasChanges) {
                log.info("No changes detected, returning current customer without saving");
                return customer;
            }

            log.info("Saving customer with changes...");
            Customer updatedCustomer = customerRepo.save(customer);
            
            log.info("=== SAVE RESULT ===");
            log.info("Saved name: '{}'", updatedCustomer.getFullName());
            log.info("Saved phone: '{}'", updatedCustomer.getPhoneNumber());
            log.info("Saved image: '{}'", updatedCustomer.getImage());
            log.info("===================");
            
            return updatedCustomer;

        } catch (Exception e) {
            log.error("PROFILE UPDATE ERROR for customer ID: {}", customerId, e);
            throw new RuntimeException("Failed to update customer profile: " + e.getMessage());
        }
    }

    /**
     * Update customer profile using JWT token
     * @param token JWT token
     * @param fullName Full name (optional)
     * @param phoneNumber Phone number (optional)
     * @param imageFile Image file (optional)
     * @return Updated customer
     */
    @Override
    public Customer updateCustomerProfileWithToken(String token, String fullName, String phoneNumber, MultipartFile imageFile) {
        try {
            // Get customer from token
            Customer customer = getCustomerProfileFromToken(token);
            
            // Update profile
            return updateCustomerProfile(customer.getId(), fullName, phoneNumber, imageFile);

        } catch (Exception e) {
            log.error("Failed to update customer profile with token", e);
            throw new RuntimeException("Failed to update customer profile: " + e.getMessage());
        }
    }

    // Password reset methods
    @Override
    public void sendPasswordResetEmail(String email) {
        log.info("Processing password reset request for email: {}", email);
        
        // Find customer by email
        Customer customer = customerRepo.findByEmail(email);
        if (customer == null) {
            log.warn("Password reset attempted for non-existent email: {}", email);
            // Don't reveal that user doesn't exist for security reasons
            // Just log and return normally
            return;
        }
        
        // Generate reset token (UUID + current timestamp)
        String resetToken = java.util.UUID.randomUUID().toString();
        
        // Set token expiry (24 hours from now)
        LocalDateTime tokenExpiry = LocalDateTime.now().plusHours(24);
        
        // Save token to customer
        customer.setResetPasswordToken(resetToken);
        customer.setResetPasswordTokenExpiry(tokenExpiry);
        customerRepo.save(customer);
        
        log.info("Password reset token generated for customer: {}", customer.getId());
        
        // Send password reset email
        try {
            sendPasswordResetEmailToCustomer(customer.getEmail(), customer.getFullName(), resetToken);
            log.info("Password reset email sent successfully to: {}", email);
        } catch (Exception e) {
            log.error("Failed to send password reset email to {}: {}", email, e.getMessage());
            // Don't throw exception - reset token is already saved
        }
    }
    
    @Override
    public void resetPassword(String resetToken, String newPassword) {
        log.info("Processing password reset with token: {}", resetToken);
        
        // Find customer by reset token
        Customer customer = customerRepo.findByResetPasswordToken(resetToken);
        if (customer == null) {
            log.warn("Invalid reset token provided: {}", resetToken);
            throw new RuntimeException("Invalid or expired reset token");
        }
        
        // Check if token is expired
        if (customer.getResetPasswordTokenExpiry().isBefore(LocalDateTime.now())) {
            log.warn("Expired reset token used: {}", resetToken);
            throw new RuntimeException("Reset token has expired. Please request a new password reset.");
        }
        
        // Update password
        customer.setPassword(passwordEncoder.encode(newPassword));
        
        // Clear reset token
        customer.setResetPasswordToken(null);
        customer.setResetPasswordTokenExpiry(null);
        
        customerRepo.save(customer);
        
        log.info("Password reset successfully for customer: {}", customer.getId());
        
        // Send password reset confirmation email
        try {
            sendPasswordResetConfirmationEmail(customer.getEmail(), customer.getFullName());
            log.info("Password reset confirmation email sent to: {}", customer.getEmail());
        } catch (Exception e) {
            log.error("Failed to send password reset confirmation email: {}", e.getMessage());
            // Don't throw exception - password was already reset successfully
        }
    }
    
    private void sendPasswordResetEmailToCustomer(String email, String fullName, String resetToken) {
        EmailDtos emailDto = new EmailDtos();
        emailDto.setRecipient(email);
        emailDto.setSubject("TechCare - Password Reset Request");
        emailDto.setMessageBody(
            "<html>" +
            "<head>" +
            "    <style>" +
            "        .container { background: #f7f7f7; padding: 30px; border-radius: 10px; font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; }" +
            "        .header { color: #2d8cf0; font-size: 24px; font-weight: bold; margin-bottom: 20px; text-align: center; }" +
            "        .body { color: #333; font-size: 16px; line-height: 1.6; margin-bottom: 25px; }" +
            "        .token-box { background: #e8f4f8; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #2d8cf0; }" +
            "        .token-code { font-family: monospace; font-size: 16px; font-weight: bold; color: #2d8cf0; word-break: break-all; }" +
            "        .footer { color: #888; font-size: 14px; margin-top: 30px; text-align: center; }" +
            "        .warning { color: #d32f2f; font-weight: bold; margin: 15px 0; }" +
            "        .reset-button { display: inline-block; background: #2d8cf0; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 20px 0; }" +
            "        .instructions { background: #fff3cd; padding: 15px; border-radius: 5px; margin: 15px 0; border: 1px solid #ffeaa7; }" +
            "    </style>" +
            "</head>" +
            "<body>" +
            "    <div class='container'>" +
            "        <div class='header'> Password Reset Request</div>" +
            "        <div class='body'>" +
            "            Dear " + fullName + ",<br><br>" +
            "            We received a request to reset your password for your TechCare account.<br>" +
            "            Click the button below to reset your password:<br><br>" +
            "            <div style='text-align: center;'>" +
            "                <a href='http://localhost:5001/reset-password?token=" + resetToken + "' class='reset-button'>" +
            "                    Reset My Password" +
            "                </a>" +
            "            </div>" +
            "            <div class='instructions'>" +
            "                <strong>Alternative method:</strong><br>" +
            "                If the button doesn't work, copy and paste this token on our password reset page:<br>" +
            "                <div class='token-code'>" + resetToken + "</div>" +
            "                <br>Go to: <a href='http://localhost:5001/reset-password'>http://localhost:5001/reset-password</a>" +
            "            </div>" +
            "            <div class='warning'>" +
            "                 Important Security Notes:<br>" +
            "                • This link expires in 24 hours<br>" +
            "                • If you didn't request this reset, please ignore this email<br>" +
            "                • Never share this link with anyone<br>" +
            "            </div>" +
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
    
    private void sendPasswordResetConfirmationEmail(String email, String fullName) {
        EmailDtos emailDto = new EmailDtos();
        emailDto.setRecipient(email);
        emailDto.setSubject("TechCare - Password Reset Successful");
        emailDto.setMessageBody(
            "<html>" +
            "<head>" +
            "    <style>" +
            "        .container { background: #f7f7f7; padding: 30px; border-radius: 10px; font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; }" +
            "        .header { color: #4caf50; font-size: 24px; font-weight: bold; margin-bottom: 20px; text-align: center; }" +
            "        .body { color: #333; font-size: 16px; line-height: 1.6; margin-bottom: 25px; }" +
            "        .footer { color: #888; font-size: 14px; margin-top: 30px; text-align: center; }" +
            "        .success-box { background: #e8f5e8; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #4caf50; }" +
            "        .security-tips { background: #fff3cd; padding: 15px; border-radius: 5px; margin: 15px 0; border: 1px solid #ffeaa7; }" +
            "    </style>" +
            "</head>" +
            "<body>" +
            "    <div class='container'>" +
            "        <div class='header'>Password Reset Successful</div>" +
            "        <div class='body'>" +
            "            Dear " + fullName + ",<br><br>" +
            "            Your password has been successfully reset for your TechCare account.<br>" +
            "            You can now log in with your new password.<br><br>" +
            "            <div class='success-box'>" +
            "                <strong>✓ Password Updated Successfully</strong><br>" +
            "                Your account is now secure with your new password." +
            "            </div>" +
            "            <div class='security-tips'>" +
            "                <strong>Security Tips:</strong><br>" +
            "                • Use a strong, unique password<br>" +
            "                • Don't share your password with anyone<br>" +
            "                • If you didn't make this change, contact support immediately<br>" +
            "            </div>" +
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
}