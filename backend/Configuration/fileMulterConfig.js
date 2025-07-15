const multer = require('multer');
const path = require('path');
const fs = require('fs');
const req = require('express/lib/request');


// Ensure upload directories exist
const createUploadDirectories = () => {
    const directories = ['./uploads', './uploads/images', './uploads/certificatesdocs'];

    directories.forEach(dir => {
        if (!fs.existsSync(dir)){
            fs.mkdirSync(dir, { recursive: true });
        }
    })
};

// Create directories on module load 
createUploadDirectories();

// Configure storage for images
const imageStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads/images');
  },
  filename: function (req, file, cb){
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);

    cb(null,'technician' + uniqueSuffix + path.extname(file.originalname));

  }
  
})

// Configure Storage for certificates and documents
const certificateStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./uploads/certificatesdocs");
    },

    filename: function (req, file, cb){
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'technician' + uniqueSuffix + path.extname(file.originalname));
    }
});


// File filter for images
const imageFileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (extname && mimetype) {
        cb(null, true);
    }
    else {
        cb(new Error('Only image files (jpeg, jpg, png, gif) are allowed!'), false);
    }
};

// File filter for certificate documents
const certificateFileFilter = (req, file, cb) => {
    const allowedTypes = /pdf|doc|docx|jpeg|jpg|png/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    
   if (extname) {
    return cb(null, true);
  } else {
    cb(new Error('Only PDF, DOC, DOCX, JPG, JPEG, or PNG files are allowed for certificates!'));
  }
};

// Create upload instance for images
const uploadImage = multer({
    storage: imageStorage,
    limits: {fileSize: 5 * 1024 * 1024}, // Limit to 5MB
    fileFilter: imageFileFilter
});


// Create upload instance for certificates and documents
const uploadCertificate = multer({
    storage: certificateStorage,
    limits: {fileSize: 10 * 1024 * 1024}, // Limit to 10MB
    fileFilter: certificateFileFilter
});

// Create a combined upload for handling both files at once
const uploadTechnicianFiles = multer({
    storage: multer.diskStorage({
        destination: function(req, file, cb) {
            if (file.fieldname === 'profileImage') {
                cb(null, './uploads/images');
            } else if (file.fieldname === 'certificateDocument') {
                cb(null, './uploads/certificatesdocs');
            } else {
                // Default path for any other files
                cb(null, './uploads');
            }
        },
        filename: function(req, file, cb) {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
            cb(null, 'technician-' + uniqueSuffix + path.extname(file.originalname));
        }
    }),
    limits: {
        fileSize: 10 * 1024 * 1024 // Setting a general limit of 10MB
    },
    fileFilter: function(req, file, cb) {
        if (file.fieldname === 'profileImage') {
            // For profile images, we'll check both extension and mimetype
            const allowedTypes = /jpeg|jpg|png|gif/;
            const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
            const mimetype = allowedTypes.test(file.mimetype);
            
            if (extname && mimetype) {
                cb(null, true);
            } else {
                cb(new Error('Only image files (jpeg, jpg, png, gif) are allowed for profile images!'), false);
            }
        } else if (file.fieldname === 'certificateDocument') {
            // For certificates, we'll just check the extension
            const allowedTypes = /pdf|doc|docx|jpeg|jpg|png/;
            const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
            
            if (extname) {
                cb(null, true);
            } else {
                cb(new Error('Only PDF, DOC, DOCX, JPG, JPEG, or PNG files are allowed for certificates!'), false);
            }
        } else {
            cb(new Error('Unexpected field: ' + file.fieldname), false);
        }
    }
});

module.exports = {
    uploadImage,
    uploadCertificate,
    uploadTechnicianFiles
}