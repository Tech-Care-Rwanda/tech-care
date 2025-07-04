package com.TechCare.TechCare_Rwanda.AuthService.CustomerAuthService;

import com.TechCare.TechCare_Rwanda.Domain.Customer;
import com.TechCare.TechCare_Rwanda.Dto.Response.JwtResponse;
import com.TechCare.TechCare_Rwanda.Dto.SignUp.CustomerSignupRequest;
import com.TechCare.TechCare_Rwanda.Dto.login.CustomerLoginRequest;
import com.TechCare.TechCare_Rwanda.EmailConfiguration.EmailDtos;
import com.TechCare.TechCare_Rwanda.EmailConfiguration.EmailService.EmailService;
import com.TechCare.TechCare_Rwanda.Repositories.CustomerRepo.CustomerRepo;
import com.TechCare.TechCare_Rwanda.configuration.CustomUserDetailsService;
import com.TechCare.TechCare_Rwanda.configuration.JwtProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;


@Service
@RequiredArgsConstructor
public class CustomerAuthService implements ICustomerAuthService {
    private final CustomerRepo customerRepo;
    private final JwtProvider jwtProvider;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;
    private  final CustomUserDetailsService customUserDetailsService;


    @Override
    public Customer CustomerSignUp(CustomerSignupRequest request) {
        Customer existingCustomer = customerRepo.findByEmail(request.getEmail());
        if (existingCustomer != null) {
            throw new org.springframework.web.server.ResponseStatusException(
                    org.springframework.http.HttpStatus.BAD_REQUEST, "User with this email " + request.getEmail() + " already exists"
            );
        }
        Customer customer =  customerRepo.save(createCustomer(request));

        // Send Welcome Email message with HTML and CSS
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

        // Optionally, you can return the customer or a success message

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
}