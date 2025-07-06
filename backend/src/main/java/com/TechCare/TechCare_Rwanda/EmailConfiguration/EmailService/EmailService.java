package com.TechCare.TechCare_Rwanda.EmailConfiguration.EmailService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.MailException;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.TechCare.TechCare_Rwanda.EmailConfiguration.EmailDtos;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

@Service
public class EmailService implements IEmailService {

    private static final Logger logger = LoggerFactory.getLogger(EmailService.class);

    @Autowired
    private JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String senderEmail;

    @Override
    public void sendEmail(EmailDtos emailRequest) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            
            helper.setFrom(senderEmail);
            helper.setTo(emailRequest.getRecipient());
            helper.setSubject(emailRequest.getSubject());
            
            // Check if the message body contains HTML
            if (emailRequest.getMessageBody().contains("<html>")) {
                helper.setText(emailRequest.getMessageBody(), true); // true = HTML
            } else {
                helper.setText(emailRequest.getMessageBody(), false); // false = plain text
            }

            mailSender.send(message);
            logger.info("Email sent successfully to: {}", emailRequest.getRecipient());

        } catch (MailException e) {
            logger.error("Failed to send email to {}: {}", emailRequest.getRecipient(), e.getMessage());
            // Don't throw exception - log and continue (email is optional)
            logger.warn("Email sending failed, but customer signup will continue");
        } catch (MessagingException e) {
            logger.error("Failed to create email message: {}", e.getMessage());
            // Don't throw exception - log and continue (email is optional)
            logger.warn("Email creation failed, but customer signup will continue");
        }
    }
}