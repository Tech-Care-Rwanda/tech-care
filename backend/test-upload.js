const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 3500;

// Create uploads directory if it doesn't exist
const uploadDir = path.join(__dirname, 'test-uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Basic multer setup for testing
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function(req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'test-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/test-uploads', express.static(path.join(__dirname, 'test-uploads')));

// Serve the test form
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'test-form.html'));
});

// Test upload endpoint
app.post('/test-upload', upload.fields([
    { name: 'profileImage', maxCount: 1 },
    { name: 'certificateDocument', maxCount: 1 }
]), (req, res) => {
    console.log('Test upload - Body:', req.body);
    console.log('Test upload - Files:', req.files);
    
    if (!req.files || !req.files.profileImage || !req.files.certificateDocument) {
        return res.status(400).json({
            message: 'Files missing',
            receivedFiles: req.files || 'No files'
        });
    }
    
    res.json({
        message: 'Upload successful',
        body: req.body,
        files: {
            profileImage: req.files.profileImage[0].filename,
            certificateDocument: req.files.certificateDocument[0].filename
        }
    });
});

app.listen(port, () => {
    console.log(`Test server running at http://localhost:${port}`);
});
