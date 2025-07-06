package com.TechCare.TechCare_Rwanda.configuration;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.context.ApplicationContextInitializer;
import org.springframework.context.ConfigurableApplicationContext;
import org.springframework.core.env.ConfigurableEnvironment;
import org.springframework.core.env.PropertiesPropertySource;

import java.util.Properties;

public class EnvironmentConfig implements ApplicationContextInitializer<ConfigurableApplicationContext> {

    @Override
    public void initialize(ConfigurableApplicationContext context) {
        try {
            // Load .env file from the backend directory
            Dotenv dotenv = Dotenv.configure()
                    .directory("./")
                    .ignoreIfMissing()
                    .load();

            // Create properties from .env file
            Properties properties = new Properties();
            dotenv.entries().forEach(entry -> {
                String key = entry.getKey();
                String value = entry.getValue();
                properties.setProperty(key, value);
            });

            // Add properties to Spring environment with high priority
            ConfigurableEnvironment environment = context.getEnvironment();
            environment.getPropertySources().addFirst(new PropertiesPropertySource("dotenv", properties));

            System.out.println("Environment variables loaded from .env file");
        } catch (Exception e) {
            System.err.println("Could not load .env file: " + e.getMessage());
            System.err.println("Make sure .env file exists in the backend directory");
        }
    }
}
