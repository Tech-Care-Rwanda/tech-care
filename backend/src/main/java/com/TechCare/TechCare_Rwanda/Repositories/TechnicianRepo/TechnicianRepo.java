package com.TechCare.TechCare_Rwanda.Repositories.TechnicianRepo;

import com.TechCare.TechCare_Rwanda.Domain.Technician;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TechnicianRepo extends JpaRepository<Technician,Long> {
}
