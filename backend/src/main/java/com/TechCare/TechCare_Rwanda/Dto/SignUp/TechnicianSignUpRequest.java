package com.TechCare.TechCare_Rwanda.Dto.SignUp;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TechnicianSignUpRequest {

    private String fullName;
    private String email;
    private String phoneNumber;
    private String specialization;
    private String age;
    private String gender;
    private String imageUrl;
    private String certificationUrl;



}
