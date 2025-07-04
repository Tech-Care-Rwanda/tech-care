package com.TechCare.TechCare_Rwanda.Dto.SignUp;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

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
    private MultipartFile ImageFile;
    private MultipartFile certificationUrl;



}
