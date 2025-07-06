# Customer Image Upload API Examples

## 1. Upload Customer Profile Image

```bash
# Upload a profile image for an authenticated customer
curl -X POST http://localhost:5001/api/v1/customer/upload-image \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "image=@/path/to/your/image.jpg"
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Image uploaded successfully!",
  "customer": {
    "id": 1,
    "fullName": "John Doe",
    "email": "john@example.com",
    "phoneNumber": "+250788123456",
    "image": "http://localhost:5001/uploads/images/customer_1.jpg"
  }
}
```

## 2. Update Customer Profile (with optional image)

```bash
# Update profile with all fields including image
curl -X PUT http://localhost:5001/api/v1/customer/update-profile \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "fullName=John Doe Updated" \
  -F "phoneNumber=+250788654321" \
  -F "image=@/path/to/your/new_image.jpg"
```

```bash
# Update profile with only name
curl -X PUT http://localhost:5001/api/v1/customer/update-profile \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "fullName=Jane Doe"
```

```bash
# Update profile with only phone number
curl -X PUT http://localhost:5001/api/v1/customer/update-profile \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "phoneNumber=+250788111222"
```

```bash
# Update profile with only image
curl -X PUT http://localhost:5001/api/v1/customer/update-profile \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "image=@/path/to/your/image.jpg"
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Profile updated successfully!",
  "customer": {
    "id": 1,
    "fullName": "John Doe Updated",
    "email": "john@example.com",
    "phoneNumber": "+250788654321",
    "image": "http://localhost:5001/uploads/images/customer_1.jpg"
  }
}
```

## 3. Test Check-Auth Endpoint

```bash
# Check if customer is authenticated
curl -X GET http://localhost:5001/api/v1/customer/check-auth \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Expected Response:**
```json
{
  "id": 1,
  "fullName": "John Doe",
  "email": "john@example.com",
  "phoneNumber": "+250788123456",
  "image": "http://localhost:5001/uploads/images/customer_1.jpg"
}
```

## 4. Error Responses

### Invalid Image File
```json
{
  "success": false,
  "message": "Invalid file: Only image files are allowed"
}
```

### File Too Large
```json
{
  "success": false,
  "message": "Invalid file: Image file size cannot exceed 10MB"
}
```

### Missing JWT Token
```json
{
  "timestamp": "2025-01-07T10:30:00.000+00:00",
  "status": 401,
  "error": "Unauthorized",
  "message": "Access Denied",
  "path": "/api/v1/customer/upload-image"
}
```

## 5. Supported Image Formats

- .jpg / .jpeg
- .png
- .gif
- .bmp
- .webp

## 6. File Size Limits

- Maximum file size: 10MB
- Images are stored in: `~/techcare-uploads/images/`
- Naming convention: `customer_{id}.{extension}`

## 7. Frontend JavaScript Examples

### Upload Image with Fetch API
```javascript
const uploadImage = async (imageFile, token) => {
  const formData = new FormData();
  formData.append('image', imageFile);
  
  const response = await fetch('http://localhost:5001/api/v1/customer/upload-image', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`
    },
    body: formData
  });
  
  const result = await response.json();
  return result;
};
```

### Update Profile with Fetch API
```javascript
const updateProfile = async (profileData, token) => {
  const formData = new FormData();
  
  if (profileData.fullName) {
    formData.append('fullName', profileData.fullName);
  }
  
  if (profileData.phoneNumber) {
    formData.append('phoneNumber', profileData.phoneNumber);
  }
  
  if (profileData.image) {
    formData.append('image', profileData.image);
  }
  
  const response = await fetch('http://localhost:5001/api/v1/customer/update-profile', {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`
    },
    body: formData
  });
  
  const result = await response.json();
  return result;
};
```

### Check Authentication
```javascript
const checkAuth = async (token) => {
  const response = await fetch('http://localhost:5001/api/v1/customer/check-auth', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  
  if (response.ok) {
    const customer = await response.json();
    return customer;
  } else {
    throw new Error('Not authenticated');
  }
};
```
