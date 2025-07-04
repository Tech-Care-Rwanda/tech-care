package com.TechCare.TechCare_Rwanda.EmailConfiguration.EmailService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import com.TechCare.TechCare_Rwanda.EmailConfiguration.EmailDtos;


@Service

public class EmailService implements IEmailService {


    @Autowired
    private  JavaMailSender mailSender;


    @Value("${spring.mail.username}")
    private String senderEmail;


    @Override
    public void sendEmail(EmailDtos emailRequest) {

        try{
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(senderEmail);
            message.setTo(emailRequest.getRecipient());
            message.setText(emailRequest.getMessageBody());
            message.setSubject(emailRequest.getSubject());

            mailSender.send(message);

        }
        catch (MailException e){
            throw new RuntimeException("Failed to send email");
        }

        
    }
}
