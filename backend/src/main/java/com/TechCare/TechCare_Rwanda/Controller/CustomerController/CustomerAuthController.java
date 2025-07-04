package com.TechCare.TechCare_Rwanda.Controller.CustomerController;

import com.TechCare.TechCare_Rwanda.AuthService.CustomerAuthService.CustomerAuthService;
import com.TechCare.TechCare_Rwanda.Domain.Customer;
import com.TechCare.TechCare_Rwanda.Dto.Response.JwtResponse;
import com.TechCare.TechCare_Rwanda.Dto.SignUp.CustomerSignupRequest;
import com.TechCare.TechCare_Rwanda.Dto.login.CustomerLoginRequest;
import com.TechCare.TechCare_Rwanda.Repositories.CustomerRepo.CustomerRepo;
import com.TechCare.TechCare_Rwanda.configuration.JwtProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/api/v1/customer")
@RequiredArgsConstructor
public class CustomerAuthController {
    private final CustomerAuthService customerAuthService;
    private final CustomerRepo customerRepo;


    @PostMapping("/signup")
    public ResponseEntity<Customer> signUpCustomer(@RequestBody CustomerSignupRequest request) {
        Customer message = customerAuthService.CustomerSignUp(request);
        return ResponseEntity.ok(message);
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
}
