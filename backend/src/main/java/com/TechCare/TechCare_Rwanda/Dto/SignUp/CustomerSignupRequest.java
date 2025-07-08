package com.TechCare.TechCare_Rwanda.Dto.SignUp;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class CustomerSignupRequest {
    
    @NotBlank(message = "Full name is required")
    @Size(min = 2, max = 100, message = "Full name must be between 2 and 100 characters")
    private String fullName;
    
    @NotBlank(message = "Phone number is required")
    @Pattern(regexp = "^(\\+250|0)[0-9]{9}$", message = "Please provide a valid Rwandan phone number (e.g., +250123456789 or 0123456789)")
    private String phoneNumber;
    
    @NotBlank(message = "Email is required")
    @Email(message = "Please provide a valid email address")
    private String email;
    
    @NotBlank(message = "Password is required")
    @Size(min = 8, message = "Password must be at least 8 characters long")
    private String password;
    
    @Size(max = 255, message = "Image URL must not exceed 255 characters")
    private String image;
}
