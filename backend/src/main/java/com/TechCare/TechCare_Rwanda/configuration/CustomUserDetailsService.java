package com.TechCare.TechCare_Rwanda.configuration;

import com.TechCare.TechCare_Rwanda.Domain.Admin;
import com.TechCare.TechCare_Rwanda.Domain.Customer;
import com.TechCare.TechCare_Rwanda.Domain.Technician;
import com.TechCare.TechCare_Rwanda.Repositories.AdminRepo.AdminRepo;
import com.TechCare.TechCare_Rwanda.Repositories.CustomerRepo.CustomerRepo;
import com.TechCare.TechCare_Rwanda.Repositories.TechnicianRepo.TechnicianRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;


import java.util.List;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final CustomerRepo customerRepository;
    private final AdminRepo adminRepository;
    private final TechnicianRepo technicianRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Customer customer = customerRepository.findByEmail(username);
        if (customer != null) {
            return new org.springframework.security.core.userdetails.User(
                customer.getEmail(),
                customer.getPassword(),
                List.of(new SimpleGrantedAuthority("ROLE_CUSTOMER"))
            );
        }
        Admin admin = adminRepository.findByEmail(username);
        if (admin != null) {
            return new org.springframework.security.core.userdetails.User(
                admin.getEmail(),
                admin.getPassword(),
                List.of(new SimpleGrantedAuthority("ROLE_ADMIN"))
            );
        }
        Technician technician = technicianRepository.findByEmail(username);
        if (technician != null) {
            return new org.springframework.security.core.userdetails.User(
                technician.getEmail(),
                technician.getPassword(),
                List.of(new SimpleGrantedAuthority("ROLE_TECHNICIAN"))
            );
        }
        throw new UsernameNotFoundException("User not found with email: " + username);
    }
}