package com.TechCare.TechCare_Rwanda;

import com.TechCare.TechCare_Rwanda.configuration.EnvironmentConfig;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class TechCareRwandaApplication {

	public static void main(String[] args) {
		SpringApplication app = new SpringApplication(TechCareRwandaApplication.class);
		app.addInitializers(new EnvironmentConfig());
		app.run(args);
	}

}
