const multer = require('multer');
const { createClient } = require('@supabase/supabase-js');
const path = require('path');

// Initialize Supabase client with SERVICE ROLE KEY for backend operations
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY; // Use service key instead of anon key
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Configure multer for memory storage
const storage = multer.memoryStorage();

// File filter function
const fileFilter = (req, file, cb) => {
    // For profile images
    if (file.fieldname === 'profileImage') {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Profile image must be an image file'), false);
        }
    }
    // For certificate documents
    else if (file.fieldname === 'certificateDocument') {
        const allowedMimeTypes = [
            'application/pdf',
            'image/jpeg',
            'image/jpg',
            'image/png',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        ];
        
        if (allowedMimeTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Certificate must be a PDF, DOC, DOCX, or image file'), false);
        }
    }
    else {
        cb(new Error('Unexpected field'), false);
    }
};

// Configure multer
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
    }
});

// Function to upload file to Supabase
const uploadToSupabase = async (file, bucketName, folderName = '') => {
    try {
        console.log(`Uploading to bucket: ${bucketName}, folder: ${folderName}`);
        console.log(`File: ${file.originalname}, Size: ${file.size}, Type: ${file.mimetype}`);
        
        // Generate unique filename
        const timestamp = Date.now();
        const randomString = Math.random().toString(36).substring(2, 15);
        const fileExtension = path.extname(file.originalname);
        const fileName = `${timestamp}-${randomString}${fileExtension}`;
        
        // Create the full path
        const filePath = folderName ? `${folderName}/${fileName}` : fileName;
        
        // Upload file to Supabase Storage with proper options
        const { data, error } = await supabase.storage
            .from(bucketName)
            .upload(filePath, file.buffer, {
                contentType: file.mimetype,
                upsert: false,
                duplex: false // Add this for Node.js compatibility
            });

        if (error) {
            console.error('Supabase upload error details:', error);
            return {
                success: false,
                error: error.message,
                details: error
            };
        }

        console.log('Upload successful:', data);

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
            .from(bucketName)
            .getPublicUrl(filePath);

        console.log('Generated public URL:', publicUrl);

        return {
            success: true,
            data: data,
            publicUrl: publicUrl,
            fileName: filePath,
            filePath: filePath
        };

    } catch (error) {
        console.error('Error uploading to Supabase:', error);
        return {
            success: false,
            error: error.message
        };
    }
};

// Function to delete file from Supabase
const deleteFromSupabase = async (bucketName, filePath) => {
    try {
        const { error } = await supabase.storage
            .from(bucketName)
            .remove([filePath]);

        if (error) {
            console.error('Supabase delete error:', error);
            return {
                success: false,
                error: error.message
            };
        }

        return {
            success: true,
            message: 'File deleted successfully'
        };

    } catch (error) {
        console.error('Error deleting from Supabase:', error);
        return {
            success: false,
            error: error.message
        };
    }
};

// Middleware configuration for different routes
const uploadMiddleware = {
    technicianFiles: upload.fields([
        { name: 'profileImage', maxCount: 1 },
        { name: 'certificateDocument', maxCount: 1 }
    ]),
    profileImage: upload.single('profileImage'),
    certificate: upload.single('certificateDocument')
};

const uploadTechnicianFiles = upload.fields([
    { name: 'profileImage', maxCount: 1 },
    { name: 'certificateDocument', maxCount: 1 }
]);

module.exports = {
    uploadToSupabase,
    deleteFromSupabase,
    uploadMiddleware,
    uploadTechnicianFiles,
    upload,
    supabase
};