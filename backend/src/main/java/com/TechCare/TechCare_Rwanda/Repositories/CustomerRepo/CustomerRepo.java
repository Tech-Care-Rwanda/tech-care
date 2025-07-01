
package com.TechCare.TechCare_Rwanda.Repositories.CustomerRepo;

import com.TechCare.TechCare_Rwanda.Domain.Customer;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CustomerRepo extends JpaRepository<Customer, Long> {
    Customer findByEmail(String email);
}