package com.TechCare.TechCare_Rwanda.Services.AdminServices;

import com.TechCare.TechCare_Rwanda.Domain.Technician;
import com.TechCare.TechCare_Rwanda.EmailConfiguration.EmailDtos;
import com.TechCare.TechCare_Rwanda.EmailConfiguration.EmailService.EmailService;
import com.TechCare.TechCare_Rwanda.Repositories.TechnicianRepo.TechnicianRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.security.SecureRandom;

import static org.springframework.http.HttpStatus.BAD_REQUEST;

@Service
@RequiredArgsConstructor
public class ApproveService implements IApproveService {
    private final TechnicianRepo technicianRepo;
    private final EmailService emailService;
    private final PasswordEncoder passwordEncoder;


    @Override
    public Technician approveTechnician(Long technicianId) {
        Technician technician = technicianRepo.findById(technicianId)
                .orElseThrow(() -> new ResponseStatusException(BAD_REQUEST, "Technician not found"));

        if (technician.getStatus() == Technician.TechnicianStatus.APPROVED) {
            throw new ResponseStatusException(BAD_REQUEST, "Technician already approved");
        }

        // Generate secure password
        String generatedPassword = generateSecurePassword();
        String hashedPassword = passwordEncoder.encode(generatedPassword);

        // Update technician status and password
        technician.setPassword(hashedPassword);
        technician.setStatus(Technician.TechnicianStatus.APPROVED);

        Technician savedTechnician = technicianRepo.save(technician);

        // Send approval email with credentials
        sendApprovalEmail(technician.getEmail(), technician.getFullName(), generatedPassword);

        return savedTechnician;
    }

    @Override
    public Technician rejectTechnician(Long technicianId, String reason) {
        Technician technician = technicianRepo.findById(technicianId)
                .orElseThrow(() -> new ResponseStatusException(BAD_REQUEST, "Technician not found"));

        technician.setStatus(Technician.TechnicianStatus.REJECTED);
        Technician savedTechnician = technicianRepo.save(technician);

        // Send rejection email
        sendRejectionEmail(technician.getEmail(), technician.getFullName(), reason);

        return savedTechnician;
    }



    private String generateSecurePassword() {
        // Generate a secure 12-character password
        String chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
        SecureRandom random = new SecureRandom();
        StringBuilder password = new StringBuilder();

        for (int i = 0; i < 12; i++) {
            password.append(chars.charAt(random.nextInt(chars.length())));
        }

        return password.toString();
    }

    private void sendApprovalEmail(String email, String fullName, String password) {
        EmailDtos emailDto = new EmailDtos();
        emailDto.setRecipient(email);
        emailDto.setSubject("TechCare - Account Approved! Your Login Credentials");
        emailDto.setMessageBody(
                "<html>" +
                        "<head>" +
                        "    <style>" +
                        "        .container { background: #f7f7f7; padding: 30px; border-radius: 10px; font-family: Arial, sans-serif; }" +
                        "        .header { color: #2d8cf0; font-size: 24px; font-weight: bold; margin-bottom: 10px; }" +
                        "        .body { color: #333; font-size: 16px; margin-bottom: 20px; }" +
                        "        .credentials { background: #e8f4f8; padding: 15px; border-radius: 5px; margin: 15px 0; }" +
                        "        .footer { color: #888; font-size: 14px; }" +
                        "        .warning { color: #d4af37; font-weight: bold; }" +
                        "    </style>" +
                        "</head>" +
                        "<body>" +
                        "    <div class='container'>" +
                        "        <div class='header'>🎉 Congratulations! Your TechCare Account is Approved</div>" +
                        "        <div class='body'>" +
                        "            Dear " + fullName + ",<br><br>" +
                        "            Great news! Your technician application has been approved by our admin team.<br>" +
                        "            Your account is now active and ready to use.<br><br>" +
                        "            <div class='credentials'>" +
                        "                <strong>Your Login Credentials:</strong><br>" +
                        "                <strong>Email:</strong> " + email + "<br>" +
                        "                <strong>Password:</strong> " + password + "<br>" +
                        "            </div>" +
                        "            <div class='warning'>" +
                        "                ⚠️ IMPORTANT: Please change your password after first login for security reasons." +
                        "            </div><br>" +
                        "            <strong>Next Steps:</strong><br>" +
                        "            1. Log in to your account using the credentials above<br>" +
                        "            2. Complete your profile setup<br>" +
                        "            3. Start receiving service requests<br><br>" +
                        "            Welcome to the TechCare family!" +
                        "        </div>" +
                        "        <div class='footer'>" +
                        "            Best regards,<br>" +
                        "            <span style='color:#2d8cf0;'>TechCare Team</span>" +
                        "        </div>" +
                        "    </div>" +
                        "</body>" +
                        "</html>"
        );
        emailService.sendEmail(emailDto);
    }

    private void sendRejectionEmail(String email, String fullName, String reason) {
        EmailDtos emailDto = new EmailDtos();
        emailDto.setRecipient(email);
        emailDto.setSubject("TechCare - Application Status Update");
        emailDto.setMessageBody(
                "<html>" +
                        "<head>" +
                        "    <style>" +
                        "        .container { background: #f7f7f7; padding: 30px; border-radius: 10px; font-family: Arial, sans-serif; }" +
                        "        .header { color: #d32f2f; font-size: 24px; font-weight: bold; margin-bottom: 10px; }" +
                        "        .body { color: #333; font-size: 16px; margin-bottom: 20px; }" +
                        "        .reason { background: #ffebee; padding: 15px; border-radius: 5px; margin: 15px 0; }" +
                        "        .footer { color: #888; font-size: 14px; }" +
                        "    </style>" +
                        "</head>" +
                        "<body>" +
                        "    <div class='container'>" +
                        "        <div class='header'>Application Status Update</div>" +
                        "        <div class='body'>" +
                        "            Dear " + fullName + ",<br><br>" +
                        "            Thank you for your interest in joining TechCare as a technician.<br>" +
                        "            After careful review, we are unable to approve your application at this time.<br><br>" +
                        (reason != null && !reason.isEmpty() ?
                                "            <div class='reason'>" +
                                        "                <strong>Reason:</strong> " + reason +
                                        "            </div>" : "") +
                        "            <strong>What you can do:</strong><br>" +
                        "            • Review the feedback provided above<br>" +
                        "            • Update your qualifications or documents<br>" +
                        "            • Reapply when you meet the requirements<br><br>" +
                        "            We appreciate your understanding and encourage you to apply again in the future." +
                        "        </div>" +
                        "        <div class='footer'>" +
                        "            Best regards,<br>" +
                        "            <span style='color:#2d8cf0;'>TechCare Team</span>" +
                        "        </div>" +
                        "    </div>" +
                        "</body>" +
                        "</html>"
        );
        emailService.sendEmail(emailDto);
    }
}
