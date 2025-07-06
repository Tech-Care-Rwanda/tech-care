package com.TechCare.TechCare_Rwanda.test;

import com.TechCare.TechCare_Rwanda.Domain.Customer;
import com.TechCare.TechCare_Rwanda.Repositories.CustomerRepo.CustomerRepo;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@Order(1)
public class DatabaseConnectionTest implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(DatabaseConnectionTest.class);

    @Autowired
    private CustomerRepo customerRepo;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        logger.info("🔧 Testing database connection and Customer entity...");
        
        try {
            // Test database connection
            long customerCount = customerRepo.count();
            logger.info("✅ Database connection successful! Current customers: {}", customerCount);
            
            // Test customer creation (without saving to avoid duplicates)
            Customer testCustomer = new Customer();
            testCustomer.setFullName("Test User");
            testCustomer.setEmail("test@example.com");
            testCustomer.setPhoneNumber("+250788123456");
            testCustomer.setPassword(passwordEncoder.encode("password123"));
            
            logger.info("✅ Customer entity creation successful!");
            logger.info("📋 Customer signup endpoint should now work at: /api/v1/customer/signup");
            
        } catch (Exception e) {
            logger.error("❌ Database connection or entity test failed: {}", e.getMessage());
            throw e;
        }
    }
}
