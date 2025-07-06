package com.TechCare.TechCare_Rwanda.Dto.Update;

import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

@Data
public class CustomerProfileUpdateRequest {
    
    @Size(min = 2, max = 100, message = "Full name must be between 2 and 100 characters")
    private String fullName;
    
    @Pattern(regexp = "^(\\+250|0)[0-9]{9}$", message = "Please provide a valid Rwandan phone number (e.g., +250123456789 or 0123456789)")
    private String phoneNumber;
    
    private MultipartFile image;
}
