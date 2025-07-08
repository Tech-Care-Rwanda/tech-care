package com.TechCare.TechCare_Rwanda.Dto;

import lombok.Data;

@Data
public class AdminTechnicianManagementDto {
    
    @Data
    public static class TechnicianRejectionRequest {
        private String reason;
    }
    
    @Data
    public static class TechnicianApprovalResponse {
        private Long id;
        private String fullName;
        private String email;
        private String status;
        private String message;
    }
    
    @Data
    public static class TechnicianRejectionResponse {
        private Long id;
        private String fullName;
        private String email;
        private String status;
        private String reason;
        private String message;
    }
}
