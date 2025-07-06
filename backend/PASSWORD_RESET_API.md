# Customer Password Reset API Documentation

## Overview
The password reset feature allows customers to reset their passwords when they forget them. This is a two-step process:

1. **Request Password Reset**: Customer provides their email address to receive a reset token
2. **Reset Password**: Customer uses the reset token to set a new password

## Security Features

- **Reset tokens expire after 24 hours** for security
- **Secure token generation** using UUID
- **No user enumeration** - same response whether email exists or not
- **Password validation** - minimum 8 characters
- **Email confirmations** for both reset request and successful reset
- **Token cleanup** - tokens are cleared after successful reset

## API Endpoints

### 1. Request Password Reset

**Endpoint**: `POST /api/v1/customer/forgot-password`

**Description**: Sends a password reset token to the customer's email address.

**Request Body**:
```json
{
  "email": "customer@example.com"
}
```

**Response**:
- **200 OK**: Always returns success message for security reasons
```json
"If an account with this email exists, a password reset link has been sent."
```

**Example cURL**:
```bash
curl -X POST http://localhost:5001/api/v1/customer/forgot-password \
  -H "Content-Type: application/json" \
  -d '{
    "email": "customer@example.com"
  }'
```

### 2. Reset Password

**Endpoint**: `POST /api/v1/customer/reset-password`

**Description**: Resets the customer's password using the reset token.

**Request Body**:
```json
{
  "resetToken": "550e8400-e29b-41d4-a716-446655440000",
  "newPassword": "NewSecurePassword123!",
  "confirmPassword": "NewSecurePassword123!"
}
```

**Response**:
- **200 OK**: Password reset successful
```json
"Password reset successfully. You can now log in with your new password."
```

- **400 Bad Request**: Various error conditions
```json
"Passwords do not match."
"Invalid or expired reset token"
"Reset token has expired. Please request a new password reset."
```

**Example cURL**:
```bash
curl -X POST http://localhost:5001/api/v1/customer/reset-password \
  -H "Content-Type: application/json" \
  -d '{
    "resetToken": "550e8400-e29b-41d4-a716-446655440000",
    "newPassword": "NewSecurePassword123!",
    "confirmPassword": "NewSecurePassword123!"
  }'
```

## Email Templates

### Password Reset Request Email

The customer receives an email with:
- Professional HTML design
- Clear instructions
- The reset token
- Security warnings
- 24-hour expiration notice

### Password Reset Confirmation Email

After successful reset, the customer receives:
- Confirmation that password was changed
- Security tips
- Instructions to contact support if unauthorized

## Database Schema

The `customer` table includes these new fields:

```sql
ALTER TABLE customer ADD COLUMN reset_password_token VARCHAR(255);
ALTER TABLE customer ADD COLUMN reset_password_token_expiry TIMESTAMP;
```

## Testing

### Test Scripts

1. **Basic password reset test**:
   ```bash
   ./test_password_reset.sh
   ```

2. **Complete flow test**:
   ```bash
   ./test_complete_password_reset.sh
   ```

### Manual Testing with Postman

1. **Import the following collection**:

**Collection**: Password Reset Tests

**Request 1**: Forgot Password
- Method: POST
- URL: `{{baseUrl}}/api/v1/customer/forgot-password`
- Body (JSON):
  ```json
  {
    "email": "{{customerEmail}}"
  }
  ```

**Request 2**: Reset Password
- Method: POST
- URL: `{{baseUrl}}/api/v1/customer/reset-password`
- Body (JSON):
  ```json
  {
    "resetToken": "{{resetToken}}",
    "newPassword": "{{newPassword}}",
    "confirmPassword": "{{newPassword}}"
  }
  ```

**Request 3**: Login with New Password
- Method: POST
- URL: `{{baseUrl}}/api/v1/customer/login`
- Body (JSON):
  ```json
  {
    "email": "{{customerEmail}}",
    "password": "{{newPassword}}"
  }
  ```

### Environment Variables for Postman

```json
{
  "baseUrl": "http://localhost:5001",
  "customerEmail": "your@email.com",
  "newPassword": "NewSecurePassword123!",
  "resetToken": "get-from-email-or-database"
}
```

## Error Handling

| Error | HTTP Status | Message |
|-------|-------------|---------|
| Invalid email format | 400 | Validation error |
| Passwords don't match | 400 | "Passwords do not match." |
| Invalid/expired token | 400 | "Invalid or expired reset token" |
| Token expired | 400 | "Reset token has expired. Please request a new password reset." |
| Server error | 500 | "An error occurred while processing your request." |

## Security Considerations

1. **Token Expiration**: 24-hour expiration prevents long-term token abuse
2. **No User Enumeration**: Same response for existing and non-existing emails
3. **Secure Token Generation**: UUID-based tokens are cryptographically secure
4. **Password Validation**: Minimum 8 characters required
5. **Email Verification**: Reset tokens sent only to verified email addresses
6. **Single Use**: Tokens are cleared after successful reset
7. **Rate Limiting**: Consider implementing rate limiting for password reset requests

## Integration with Frontend

### React/Angular Example

```javascript
// Request password reset
const forgotPassword = async (email) => {
  try {
    const response = await fetch('/api/v1/customer/forgot-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });
    
    const message = await response.text();
    alert(message);
  } catch (error) {
    console.error('Error:', error);
  }
};

// Reset password
const resetPassword = async (resetToken, newPassword, confirmPassword) => {
  try {
    const response = await fetch('/api/v1/customer/reset-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        resetToken,
        newPassword,
        confirmPassword,
      }),
    });
    
    const message = await response.text();
    if (response.ok) {
      alert('Password reset successful!');
      // Redirect to login page
    } else {
      alert(message);
    }
  } catch (error) {
    console.error('Error:', error);
  }
};
```

## Monitoring and Logging

The system logs the following events:
- Password reset requests (with email)
- Successful password resets (with customer ID)
- Failed attempts (invalid tokens, etc.)
- Email sending failures

Monitor these logs for:
- Unusual password reset patterns
- Failed email delivery
- Potential security issues

## Future Enhancements

1. **Rate Limiting**: Prevent abuse by limiting requests per IP/email
2. **SMS Reset**: Alternative reset method via SMS
3. **2FA Integration**: Require 2FA for password reset
4. **Password History**: Prevent reuse of recent passwords
5. **Account Lockout**: Lock accounts after multiple failed attempts
6. **Audit Trail**: Track all password changes with timestamps
