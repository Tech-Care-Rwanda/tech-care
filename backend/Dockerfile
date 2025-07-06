# Use OpenJDK 17 as the base image
FROM openjdk:17-jdk-slim

# Set the working directory inside the container
WORKDIR /app

# Install Maven
RUN apt-get update && apt-get install -y maven && rm -rf /var/lib/apt/lists/*

# Copy the pom.xml and source code
COPY pom.xml .
COPY src ./src

# Build the application
RUN mvn clean package -DskipTests

# Create a directory for file uploads
RUN mkdir -p /app/uploads/images /app/uploads/documents

# Expose the port that the application runs on
EXPOSE 5001

# Set environment variables with default values
ENV SPRING_PROFILES_ACTIVE=docker

# Run the application
CMD ["java", "-jar", "target/TechCare-Rwanda-0.0.1-SNAPSHOT.jar"]
