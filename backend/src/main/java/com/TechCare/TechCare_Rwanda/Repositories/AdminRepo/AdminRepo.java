package com.TechCare.TechCare_Rwanda.Repositories.AdminRepo;

import com.TechCare.TechCare_Rwanda.Domain.Admin;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AdminRepo extends JpaRepository<Admin, Long> {
}
