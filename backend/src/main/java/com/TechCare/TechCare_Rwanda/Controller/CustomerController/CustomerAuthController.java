package com.TechCare.TechCare_Rwanda.Controller.CustomerController;

import com.TechCare.TechCare_Rwanda.AuthService.CustomerAuthService.CustomerAuthService;
import com.TechCare.TechCare_Rwanda.Domain.Customer;
import com.TechCare.TechCare_Rwanda.Dto.Response.JwtResponse;
import com.TechCare.TechCare_Rwanda.Dto.SignUp.CustomerSignupRequest;
import com.TechCare.TechCare_Rwanda.Dto.login.CustomerLoginRequest;
import com.TechCare.TechCare_Rwanda.Repositories.CustomerRepo.CustomerRepo;
import com.TechCare.TechCare_Rwanda.Dto.PasswordReset.ForgotPasswordRequest;
import com.TechCare.TechCare_Rwanda.Dto.PasswordReset.ResetPasswordRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import jakarta.servlet.http.HttpServletRequest;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/customer")
@RequiredArgsConstructor
@CrossOrigin(origins = "*", maxAge = 3600)
@Slf4j
public class CustomerAuthController {
    private final CustomerAuthService customerAuthService;
    private final CustomerRepo customerRepo;


    @PostMapping("/signup")
    public ResponseEntity<?> signUpCustomer(@Valid @RequestBody CustomerSignupRequest request) {
        try {
            Customer customer = customerAuthService.CustomerSignUp(request);
            
            // Create success response
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Customer registered successfully!");
            response.put("customer", customer);
            
            return ResponseEntity.ok(response);
            
        } catch (RuntimeException e) {
            // Handle specific errors
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", e.getMessage());
            
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
            
        } catch (Exception e) {
            // Handle general errors
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "An error occurred during registration: " + e.getMessage());
            
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    @PostMapping("/login")
    public ResponseEntity<JwtResponse> loginCustomer(@RequestBody CustomerLoginRequest request) {
        JwtResponse jwt = customerAuthService.CustomerLogin(request);
        return ResponseEntity.ok(jwt);
    }

    @GetMapping("/profile")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<Customer> getProfile(HttpServletRequest request) {
        String token = request.getHeader("Authorization");
        Customer customer = customerAuthService.getCustomerProfileFromToken(token);
        return ResponseEntity.ok(customer);
    }

    @PostMapping("/logout")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<String> logoutCustomer(@RequestHeader("Authorization") String token) {
        customerAuthService.logoutCustomer(token);
        return ResponseEntity.ok("Logged out successfully");
    }

    @GetMapping("/check-auth")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<Customer> checkIfCustomerAuthenticated(@RequestHeader("Authorization") String token) {
        Customer customer = customerAuthService.checkIfCustomerAutheticated(token);
        return ResponseEntity.ok(customer);
    }

    @PostMapping("/upload-image")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<?> uploadCustomerImage(@RequestHeader("Authorization") String token, 
                                                @RequestParam("image") MultipartFile imageFile) {
        try {
            Customer customer = customerAuthService.uploadCustomerImageWithToken(token, imageFile);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Image uploaded successfully!");
            response.put("customer", customer);
            
            return ResponseEntity.ok(response);
            
        } catch (IllegalArgumentException e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Invalid file: " + e.getMessage());
            
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
            
        } catch (RuntimeException e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", e.getMessage());
            
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
            
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "An error occurred during image upload: " + e.getMessage());
            
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    @PutMapping("/update-profile")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<?> updateCustomerProfile(@RequestHeader("Authorization") String token,
                                                  @RequestParam(value = "fullName", required = false) String fullName,
                                                  @RequestParam(value = "phoneNumber", required = false) String phoneNumber,
                                                  @RequestParam(value = "image", required = false) MultipartFile imageFile) {
        try {
            // Log incoming request
            System.out.println("=== UPDATE PROFILE REQUEST ===");
            System.out.println("fullName: '" + fullName + "'");
            System.out.println("phoneNumber: '" + phoneNumber + "'");
            System.out.println("hasImage: " + (imageFile != null && !imageFile.isEmpty()));
            
            Customer customer = customerAuthService.updateCustomerProfileWithToken(token, fullName, phoneNumber, imageFile);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Profile updated successfully!");
            response.put("customer", customer);
            
            System.out.println("=== UPDATE PROFILE SUCCESS ===");
            System.out.println("Updated name: '" + customer.getFullName() + "'");
            System.out.println("Updated phone: '" + customer.getPhoneNumber() + "'");
            
            return ResponseEntity.ok(response);
            
        } catch (IllegalArgumentException e) {
            System.err.println("=== VALIDATION ERROR ===");
            System.err.println("Error: " + e.getMessage());
            
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Invalid input: " + e.getMessage());
            
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
            
        } catch (RuntimeException e) {
            System.err.println("=== RUNTIME ERROR ===");
            System.err.println("Error: " + e.getMessage());
            e.printStackTrace();
            
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", e.getMessage());
            
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
            
        } catch (Exception e) {
            System.err.println("=== GENERAL ERROR ===");
            System.err.println("Error: " + e.getMessage());
            e.printStackTrace();
            
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "An error occurred during profile update: " + e.getMessage());
            
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    /**
     * Request password reset - sends reset token to user's email
     * @param request Contains email address
     * @return Success message
     */
    @PostMapping("/forgot-password")
    public ResponseEntity<String> forgotPassword(@Valid @RequestBody ForgotPasswordRequest request) {
        log.info("Password reset requested for email: {}", request.getEmail());
        
        try {
            customerAuthService.sendPasswordResetEmail(request.getEmail());
            
            // Always return success message for security (don't reveal if email exists)
            return ResponseEntity.ok("If an account with this email exists, a password reset link has been sent.");
            
        } catch (Exception e) {
            log.error("Error processing password reset request for email: {}", request.getEmail(), e);
            return ResponseEntity.status(500).body("An error occurred while processing your request. Please try again later.");
        }
    }
    
    /**
     * Reset password using reset token
     * @param request Contains reset token and new password
     * @return Success message
     */
    @PostMapping("/reset-password")
    public ResponseEntity<String> resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
        log.info("Password reset attempted with token: {}", request.getResetToken());
        
        // Validate that passwords match
        if (!request.getNewPassword().equals(request.getConfirmPassword())) {
            return ResponseEntity.badRequest().body("Passwords do not match.");
        }
        
        try {
            customerAuthService.resetPassword(request.getResetToken(), request.getNewPassword());
            return ResponseEntity.ok("Password reset successfully. You can now log in with your new password.");
            
        } catch (RuntimeException e) {
            log.warn("Password reset failed with token: {}, error: {}", request.getResetToken(), e.getMessage());
            return ResponseEntity.badRequest().body(e.getMessage());
            
        } catch (Exception e) {
            log.error("Unexpected error during password reset with token: {}", request.getResetToken(), e);
            return ResponseEntity.status(500).body("An error occurred while resetting your password. Please try again later.");
        }
    }
}
