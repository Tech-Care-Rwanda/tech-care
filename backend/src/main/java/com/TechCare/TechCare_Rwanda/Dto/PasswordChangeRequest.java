package com.TechCare.TechCare_Rwanda.Dto;

import lombok.Data;

@Data
public class PasswordChangeRequest {
    private String currentPassword;
    private String newPassword;
    private String confirmPassword;
}
