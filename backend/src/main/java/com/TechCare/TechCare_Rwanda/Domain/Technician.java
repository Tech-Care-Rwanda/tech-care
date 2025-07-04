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

import java.math.BigDecimal;
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
    @Column(name = "full_name", nullable = false, length = 100)
    private String fullName;

    @NotBlank(message = "Email is required")
    @Email(message = "Please provide a valid email address")
    @Column(name = "email", nullable = false, unique = true)
    private String email;

    @NotBlank(message = "Age is required")
    @Column(name = "age", nullable = false)
    private String age;

    @NotBlank(message = "Gender is required")
    @Column(name = "gender", nullable = false)
    private String gender;

    @NotBlank(message = "Phone number is required")
    @Pattern(regexp = "^\\+?[1-9]\\d{1,14}$", message = "Please provide a valid phone number")
    @Column(name = "phone_number", nullable = false)
    private String phoneNumber;

    private String password;

    @NotBlank(message = "Specialization is required")
    private String specialization;

    @Column(name = "rating", precision = 2, scale = 1)
    private BigDecimal rating = BigDecimal.valueOf(0.0);

    private String imageUrl;

    private String certificationUrl;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private TechnicianStatus status = TechnicianStatus.PENDING;

    @Column(name = "is_available", nullable = false)
    private Boolean isAvailable = true;

    public Technician(String fullName, String phoneNumber, String email, String specialization, String age, String gender, String certificationUrl, String imageUrl) {
        this.fullName = fullName;
        this.phoneNumber = phoneNumber;
        this.email = email;
        this.specialization = specialization;
        this.age = age;
        this.gender = gender;
        this.certificationUrl = certificationUrl;
        this.imageUrl = imageUrl;
    }

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
    public String getUsername() {
        return this.email;
    }

    @Override
    public String getPassword() {
        return this.password;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return !this.status.equals(TechnicianStatus.SUSPENDED);
    }
}