package com.TechCare.TechCare_Rwanda.Repositories.TechnicianRepo;

import com.TechCare.TechCare_Rwanda.Domain.Technician;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TechnicianRepo extends JpaRepository<Technician,Long> {
    Technician findByEmail(String username);
    boolean existsByEmail(String email);
    List<Technician> findByStatus(Technician.TechnicianStatus status);
}
