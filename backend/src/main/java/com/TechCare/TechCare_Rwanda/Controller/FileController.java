package com.TechCare.TechCare_Rwanda.Controller;

import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@RestController
@RequestMapping("/uploads")
@CrossOrigin(origins = "*", maxAge = 3600)
public class FileController {

    private static final String PHOTO_DIRECTORY = System.getProperty("user.home") + "/techcare-uploads/images";
    private static final String DOC_DIRECTORY = System.getProperty("user.home") + "/techcare-uploads/documents";

    @GetMapping("/images/{filename:.+}")
    public ResponseEntity<Resource> serveImage(@PathVariable String filename) {
        try {
            Path file = Paths.get(PHOTO_DIRECTORY).resolve(filename);
            Resource resource = new UrlResource(file.toUri());

            if (resource.exists() || resource.isReadable()) {
                String contentType = Files.probeContentType(file);
                if (contentType == null) {
                    contentType = "application/octet-stream";
                }

                return ResponseEntity.ok()
                        .contentType(MediaType.parseMediaType(contentType))
                        .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + resource.getFilename() + "\"")
                        .body(resource);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (MalformedURLException e) {
            return ResponseEntity.badRequest().build();
        } catch (IOException e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/documents/{filename:.+}")
    public ResponseEntity<Resource> serveDocument(@PathVariable String filename) {
        try {
            Path file = Paths.get(DOC_DIRECTORY).resolve(filename);
            Resource resource = new UrlResource(file.toUri());

            if (resource.exists() || resource.isReadable()) {
                String contentType = Files.probeContentType(file);
                if (contentType == null) {
                    contentType = "application/octet-stream";
                }

                return ResponseEntity.ok()
                        .contentType(MediaType.parseMediaType(contentType))
                        .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + resource.getFilename() + "\"")
                        .body(resource);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (MalformedURLException e) {
            return ResponseEntity.badRequest().build();
        } catch (IOException e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/test")
    public ResponseEntity<String> testEndpoint() {
        return ResponseEntity.ok("File serving is working! Image directory: " + PHOTO_DIRECTORY);
    }

    @GetMapping("/debug")
    public ResponseEntity<String> debugEndpoint() {
        StringBuilder debug = new StringBuilder();
        debug.append("🔍 DEBUG INFO:\n");
        debug.append("Image Directory: ").append(PHOTO_DIRECTORY).append("\n");
        debug.append("Document Directory: ").append(DOC_DIRECTORY).append("\n");
        
        Path imagePath = Paths.get(PHOTO_DIRECTORY);
        debug.append("Image Directory Exists: ").append(Files.exists(imagePath)).append("\n");
        
        if (Files.exists(imagePath)) {
            try {
                debug.append("Files in image directory:\n");
                Files.list(imagePath).forEach(file -> 
                    debug.append("  - ").append(file.getFileName()).append("\n")
                );
            } catch (IOException e) {
                debug.append("Error listing files: ").append(e.getMessage()).append("\n");
            }
        }
        
        return ResponseEntity.ok(debug.toString());
    }
}
