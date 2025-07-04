package com.TechCare.TechCare_Rwanda.Dto.SignUp;

import lombok.Data;

@Data
public class AdminSignUpRequest {
    private String fullName;
    private String phoneNumber;
    private String email;
    private String password;
}
