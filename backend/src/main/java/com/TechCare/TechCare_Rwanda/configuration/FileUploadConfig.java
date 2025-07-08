package com.TechCare.TechCare_Rwanda.configuration;

import org.springframework.context.annotation.Configuration;
import org.springframework.lang.NonNull;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class FileUploadConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(@NonNull ResourceHandlerRegistry registry) {
        // Serve uploaded images
        registry.addResourceHandler("/uploads/images/**")
                .addResourceLocations("file:" + System.getProperty("user.home") + "/techcare-uploads/images/");
        
        // Serve uploaded documents
        registry.addResourceHandler("/uploads/documents/**")
                .addResourceLocations("file:" + System.getProperty("user.home") + "/techcare-uploads/documents/");
    }
}
