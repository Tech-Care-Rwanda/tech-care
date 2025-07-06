package com.TechCare.TechCare_Rwanda.Services.FileUploadService;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Optional;
import java.util.UUID;
import java.util.function.Function;

import static java.nio.file.StandardCopyOption.REPLACE_EXISTING;

@Service
@Slf4j
public class FileUploadService {

    private static final String PHOTO_DIRECTORY = System.getProperty("user.home") + "/techcare-uploads/images";
    private static final String DOC_DIRECTORY = System.getProperty("user.home") + "/techcare-uploads/documents";

    private final Function<String, String> fileExtension = fileName -> Optional.ofNullable(fileName)
            .filter(name -> name.contains("."))
            .map(name -> name.substring(fileName.lastIndexOf('.') + 1))
            .orElse("png");

    /**
     * Upload customer profile image
     * @param customerId Customer ID
     * @param file Image file
     * @return Image URL
     */
    public String uploadCustomerImage(Long customerId, MultipartFile file) {
        try {
            validateImageFile(file);
            
            Path storage = Paths.get(PHOTO_DIRECTORY).toAbsolutePath().normalize();
            if (!Files.exists(storage)) {
                Files.createDirectories(storage);
            }

            String ext = fileExtension.apply(file.getOriginalFilename());
            String fileName = "customer_" + customerId + "." + ext;
            
            Files.copy(file.getInputStream(), storage.resolve(fileName), REPLACE_EXISTING);
            
            String imageUrl = ServletUriComponentsBuilder.fromCurrentContextPath()
                    .path("/uploads/images/" + fileName)
                    .toUriString();
            
            log.info("Customer image uploaded successfully: {}", imageUrl);
            return imageUrl;

        } catch (IOException e) {
            log.error("Failed to upload customer image for customer ID: {}", customerId, e);
            throw new RuntimeException("Failed to upload customer image: " + e.getMessage(), e);
        }
    }

    /**
     * Upload general image file
     * @param file Image file
     * @param prefix File name prefix (optional)
     * @return Image URL
     */
    public String uploadImage(MultipartFile file, String prefix) {
        try {
            validateImageFile(file);
            
            Path storage = Paths.get(PHOTO_DIRECTORY).toAbsolutePath().normalize();
            if (!Files.exists(storage)) {
                Files.createDirectories(storage);
            }

            String ext = fileExtension.apply(file.getOriginalFilename());
            String fileName = (prefix != null ? prefix + "_" : "") + UUID.randomUUID() + "." + ext;
            
            Files.copy(file.getInputStream(), storage.resolve(fileName), REPLACE_EXISTING);
            
            String imageUrl = ServletUriComponentsBuilder.fromCurrentContextPath()
                    .path("/uploads/images/" + fileName)
                    .toUriString();
            
            log.info("Image uploaded successfully: {}", imageUrl);
            return imageUrl;

        } catch (IOException e) {
            log.error("Failed to upload image", e);
            throw new RuntimeException("Failed to upload image: " + e.getMessage(), e);
        }
    }

    /**
     * Upload document file
     * @param file Document file
     * @param prefix File name prefix (optional)
     * @return Document URL
     */
    public String uploadDocument(MultipartFile file, String prefix) {
        try {
            validateDocumentFile(file);
            
            Path storage = Paths.get(DOC_DIRECTORY).toAbsolutePath().normalize();
            if (!Files.exists(storage)) {
                Files.createDirectories(storage);
            }

            String ext = fileExtension.apply(file.getOriginalFilename());
            String fileName = (prefix != null ? prefix + "_" : "") + UUID.randomUUID() + "." + ext;
            
            Files.copy(file.getInputStream(), storage.resolve(fileName), REPLACE_EXISTING);
            
            String documentUrl = ServletUriComponentsBuilder.fromCurrentContextPath()
                    .path("/uploads/documents/" + fileName)
                    .toUriString();
            
            log.info("Document uploaded successfully: {}", documentUrl);
            return documentUrl;

        } catch (IOException e) {
            log.error("Failed to upload document", e);
            throw new RuntimeException("Failed to upload document: " + e.getMessage(), e);
        }
    }

    /**
     * Delete file from storage
     * @param fileName File name to delete
     * @param isImage True if it's an image, false if it's a document
     * @return True if deleted successfully
     */
    public boolean deleteFile(String fileName, boolean isImage) {
        try {
            Path storage = Paths.get(isImage ? PHOTO_DIRECTORY : DOC_DIRECTORY).toAbsolutePath().normalize();
            Path filePath = storage.resolve(fileName);
            
            if (Files.exists(filePath)) {
                Files.delete(filePath);
                log.info("File deleted successfully: {}", fileName);
                return true;
            }
            return false;
        } catch (IOException e) {
            log.error("Failed to delete file: {}", fileName, e);
            return false;
        }
    }

    /**
     * Validate image file
     * @param file File to validate
     */
    private void validateImageFile(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("Image file is required");
        }

        // Check file size (max 10MB as per application.properties)
        if (file.getSize() > 10 * 1024 * 1024) {
            throw new IllegalArgumentException("Image file size cannot exceed 10MB");
        }

        // Check file type
        String contentType = file.getContentType();
        if (contentType == null || !contentType.startsWith("image/")) {
            throw new IllegalArgumentException("Only image files are allowed");
        }

        // Check file extension
        String fileName = file.getOriginalFilename();
        if (fileName == null || !fileName.matches(".*\\.(jpg|jpeg|png|gif|bmp|webp)$")) {
            throw new IllegalArgumentException("Only image files with extensions .jpg, .jpeg, .png, .gif, .bmp, .webp are allowed");
        }
    }

    /**
     * Validate document file
     * @param file File to validate
     */
    private void validateDocumentFile(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("Document file is required");
        }

        // Check file size (max 10MB as per application.properties)
        if (file.getSize() > 10 * 1024 * 1024) {
            throw new IllegalArgumentException("Document file size cannot exceed 10MB");
        }

        // Check file extension
        String fileName = file.getOriginalFilename();
        if (fileName == null || !fileName.matches(".*\\.(pdf|doc|docx|txt|rtf)$")) {
            throw new IllegalArgumentException("Only document files with extensions .pdf, .doc, .docx, .txt, .rtf are allowed");
        }
    }
}
