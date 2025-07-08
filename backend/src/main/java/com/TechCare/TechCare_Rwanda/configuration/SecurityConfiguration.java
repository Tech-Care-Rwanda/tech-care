package com.TechCare.TechCare_Rwanda.configuration;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@RequiredArgsConstructor
public class SecurityConfiguration {

    private final CustomUserDetailsService customUserDetailsService;
    private final JwtValidator jwtValidator;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider daoAuthenticationProvider = new DaoAuthenticationProvider();
        daoAuthenticationProvider.setPasswordEncoder(passwordEncoder());
        daoAuthenticationProvider.setUserDetailsService(customUserDetailsService);
        return daoAuthenticationProvider;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        //  Public endpoints - ORDER MATTERS!
                        .requestMatchers(
                                "/api/v1/customer/signup",
                                "/api/v1/customer/login",
                                "/api/v1/customer/forgot-password",
                                "/api/v1/customer/reset-password",
                                "/api/v1/admin/signup",
                                "/api/v1/admin/login",
                                "/api/v1/technician/signup",
                                "/api/v1/technician/login",
                                "/api/v1/customer/hello",
                                "/uploads/**",
                                "/reset-password",
                                "/reset-password.html",
                                "/forgot-password",
                                "/forgot-password.html"
                        ).permitAll()

                        //  Protected routes by role - specific paths first
                        .requestMatchers("/api/v1/admin/**").hasRole("ADMIN")
                        .requestMatchers("/api/v1/technician/**").hasRole("TECHNICIAN")
                        .requestMatchers("/api/v1/customer/**").hasRole("CUSTOMER")

                        //  Catch-all: any other request must be authenticated
                        .anyRequest().authenticated()
                )
                .addFilterBefore(jwtValidator, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();

        // Allow all origins with patterns (works with Postman)
        configuration.setAllowedOriginPatterns(List.of("*"));
        configuration.setAllowCredentials(false);  // Must be false when using "*"
        
        // Allow all HTTP methods
        configuration.setAllowedMethods(List.of("*"));
        
        // Allow all headers
        configuration.setAllowedHeaders(List.of("*"));
        
        // Expose headers that client can access
        configuration.setExposedHeaders(List.of("*"));
        
        // Cache preflight requests for 1 hour
        configuration.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}