package com.TechCare.TechCare_Rwanda.Services.FileUploadService;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Optional;
import java.util.UUID;
import java.util.function.Function;

@Service
@Slf4j
public class FileUploadService {

    @Value("${supabase.url}")
    private String supabaseUrl;

    @Value("${supabase.anon.key}")
    private String supabaseAnonKey;

    @Value("${supabase.service.role.key}")
    private String supabaseServiceKey;

    private final RestTemplate restTemplate = new RestTemplate();

    private final Function<String, String> fileExtension = fileName -> Optional.ofNullable(fileName)
            .filter(name -> name.contains("."))
            .map(name -> name.substring(fileName.lastIndexOf('.') + 1))
            .orElse("png");

    /**
     * Upload customer profile image to Supabase Storage
     * @param customerId Customer ID
     * @param file Image file
     * @return Public URL of the uploaded image
     */
    public String uploadCustomerImage(Long customerId, MultipartFile file) {
        try {
            validateImageFile(file);

            String ext = fileExtension.apply(file.getOriginalFilename());
            String fileName = "customer_" + customerId + "." + ext;

            return uploadToSupabase(file, "images", fileName);

        } catch (IOException e) {
            log.error("Failed to upload customer image for customer ID: {}", customerId, e);
            throw new RuntimeException("Failed to upload customer image: " + e.getMessage(), e);
        }
    }

    /**
     * Upload general image file to Supabase Storage
     * @param file Image file
     * @param prefix File name prefix (optional)
     * @return Public URL of the uploaded image
     */
    public String uploadImage(MultipartFile file, String prefix) {
        try {
            validateImageFile(file);

            String ext = fileExtension.apply(file.getOriginalFilename());
            String fileName = (prefix != null ? prefix + "_" : "") + UUID.randomUUID() + "." + ext;

            return uploadToSupabase(file, "images", fileName);

        } catch (IOException e) {
            log.error("Failed to upload image", e);
            throw new RuntimeException("Failed to upload image: " + e.getMessage(), e);
        }
    }

    /**
     * Upload document file to Supabase Storage
     * @param file Document file
     * @param prefix File name prefix (optional)
     * @return Public URL of the uploaded document
     */
    public String uploadDocument(MultipartFile file, String prefix) {
        try {
            validateDocumentFile(file);

            String ext = fileExtension.apply(file.getOriginalFilename());
            String fileName = (prefix != null ? prefix + "_" : "") + UUID.randomUUID() + "." + ext;

            return uploadToSupabase(file, "documents", fileName);

        } catch (IOException e) {
            log.error("Failed to upload document", e);
            throw new RuntimeException("Failed to upload document: " + e.getMessage(), e);
        }
    }

    /**
     * Upload file to Supabase Storage
     * @param file MultipartFile to upload
     * @param bucket Supabase storage bucket name
     * @param fileName File name in storage
     * @return Public URL of the uploaded file
     */
    private String uploadToSupabase(MultipartFile file, String bucket, String fileName) throws IOException {
        String uploadUrl = supabaseUrl + "/storage/v1/object/" + bucket + "/" + fileName;

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.parseMediaType(file.getContentType()));
        headers.setBearerAuth(supabaseServiceKey);

        HttpEntity<byte[]> requestEntity = new HttpEntity<>(file.getBytes(), headers);

        try {
            ResponseEntity<String> response = restTemplate.exchange(
                    uploadUrl,
                    HttpMethod.POST,
                    requestEntity,
                    String.class
            );

            if (response.getStatusCode().is2xxSuccessful()) {
                String publicUrl = supabaseUrl + "/storage/v1/object/public/" + bucket + "/" + fileName;
                log.info("File uploaded successfully to Supabase: {}", publicUrl);
                return publicUrl;
            } else {
                throw new RuntimeException("Failed to upload to Supabase: " + response.getBody());
            }

        } catch (Exception e) {
            log.error("Error uploading to Supabase Storage", e);
            throw new RuntimeException("Failed to upload to Supabase Storage: " + e.getMessage(), e);
        }
    }

    /**
     * Delete file from Supabase Storage
     * @param fileName File name to delete
     * @param bucket Bucket name (images or documents)
     * @return True if deleted successfully
     */
    public boolean deleteFile(String fileName, String bucket) {
        try {
            String deleteUrl = supabaseUrl + "/storage/v1/object/" + bucket + "/" + fileName;

            HttpHeaders headers = new HttpHeaders();
            headers.setBearerAuth(supabaseServiceKey);

            HttpEntity<String> requestEntity = new HttpEntity<>(headers);

            ResponseEntity<String> response = restTemplate.exchange(
                    deleteUrl,
                    HttpMethod.DELETE,
                    requestEntity,
                    String.class
            );

            if (response.getStatusCode().is2xxSuccessful()) {
                log.info("File deleted successfully from Supabase: {}", fileName);
                return true;
            } else {
                log.error("Failed to delete file from Supabase: {}", response.getBody());
                return false;
            }

        } catch (Exception e) {
            log.error("Error deleting file from Supabase Storage: {}", fileName, e);
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

        // Check file size (max 10MB)
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

        // Check file size (max 10MB)
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