package com.TechCare.TechCare_Rwanda.Domain;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.validator.constraints.URL;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;

@Entity
@Table(name = "technician")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Technician implements UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Full name is required")
    @Size(min = 2, max = 100, message = "Full name must be between 2 and 100 characters")
    @Column(name = "full_name", nullable = false, length = 100)
    private String fullName;

    @NotBlank(message = "Email is required")
    @Email(message = "Please provide a valid email address")
    @Size(max = 150, message = "Email must not exceed 150 characters")
    @Column(name = "email", nullable = false, unique = true, length = 150)
    private String email;

    @NotBlank(message = "Phone number is required")
    @Pattern(regexp = "^\\+?[1-9]\\d{1,14}$", message = "Please provide a valid phone number")
    @Column(name = "phone_number", nullable = false, length = 20)
    private String phoneNumber;

    @NotBlank(message = "Password is required")
    @Size(min = 8, message = "Password must be at least 8 characters long")
    @Column(name = "password", nullable = false)
    private String password;

    @NotBlank(message = "Specialization is required")
    @Size(min = 2, max = 100, message = "Specialization must be between 2 and 100 characters")
    @Column(name = "specialization", nullable = false, length = 100)
    private String specialization;

    @DecimalMin(value = "0.0", message = "Rating cannot be negative")
    @DecimalMax(value = "5.0", message = "Rating cannot exceed 5.0")
    @Column(name = "rating", columnDefinition = "DECIMAL(2,1) DEFAULT 0.0")
    private Double rating = 0.0;

    @URL(message = "Please provide a valid image URL")
    @Size(max = 500, message = "Image URL must not exceed 500 characters")
    @Column(name = "image_url", length = 500)
    private String imageUrl;

    @URL(message = "Please provide a valid certification URL")
    @Size(max = 500, message = "Certification URL must not exceed 500 characters")
    @Column(name = "certification_url", length = 500)
    private String certificationUrl;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private TechnicianStatus status = TechnicianStatus.PENDING;

    @Column(name = "is_available", nullable = false)
    private Boolean isAvailable = true;

    // Enum for technician status
    public enum TechnicianStatus {
        PENDING,
        APPROVED,
        REJECTED,
        SUSPENDED
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority("ROLE_TECHNICIAN"));
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public String getUsername() {
        return email;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return status != TechnicianStatus.SUSPENDED;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return status == TechnicianStatus.APPROVED;
    }

    // Custom validation method
    public boolean isApproved() {
        return status == TechnicianStatus.APPROVED;
    }

    // Helper method to check if technician can accept orders
    public boolean canAcceptOrders() {
        return isApproved() && isAvailable && isAccountNonLocked();
    }
}