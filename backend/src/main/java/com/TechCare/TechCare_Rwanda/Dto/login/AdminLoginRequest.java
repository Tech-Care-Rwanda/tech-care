package com.TechCare.TechCare_Rwanda.Dto.login;

import lombok.Data;

@Data
public class AdminLoginRequest {
    private String email;
    private String password;
}
