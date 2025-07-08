package com.TechCare.TechCare_Rwanda.Services.AdminServices;

import com.TechCare.TechCare_Rwanda.Domain.Technician;

public interface IApproveService {
    public Technician approveTechnician(Long technicianId);
    public Technician rejectTechnician(Long technicianId, String reason);
}
