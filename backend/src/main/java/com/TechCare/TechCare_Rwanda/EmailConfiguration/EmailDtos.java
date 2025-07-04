package com.TechCare.TechCare_Rwanda.EmailConfiguration;

import lombok.Data;

@Data
public class EmailDtos {
    private String recipient;
    private String messageBody;
    private String subject;
    private String attachment;
    private String HTMLBody;

}
