# TechCare API - Booking and Technician Management

This document describes the newly implemented core business logic APIs for booking and technician management.

## Authentication

Most endpoints require authentication using JWT tokens. Include the token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

## Booking Management APIs

### Create Booking
- **Endpoint:** `POST /api/v1/bookings`
- **Authentication:** Required (Customer role)
- **Description:** Creates a new service booking

**Request Body:**
```json
{
  "title": "Computer Repair Service",
  "description": "My laptop is not turning on",
  "category": "COMPUTER_REPAIR",
  "location": "123 Main Street, Kigali",
  "scheduledAt": "2024-01-15T10:00:00Z",
  "estimatedHours": 2,
  "technicianId": 5
}
```

**Service Categories:**
- `COMPUTER_REPAIR`
- `LAPTOP_REPAIR`
- `PHONE_REPAIR`
- `TABLET_REPAIR`
- `NETWORK_SETUP`
- `SOFTWARE_INSTALLATION`
- `DATA_RECOVERY`
- `VIRUS_REMOVAL`
- `HARDWARE_UPGRADE`
- `CONSULTATION`

### Get Bookings
- **Endpoint:** `GET /api/v1/bookings`
- **Authentication:** Required
- **Description:** Retrieves bookings (filtered by user role)

**Query Parameters:**
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10)
- `status` - Filter by booking status
- `category` - Filter by service category
- `search` - Search in title/description
- `startDate` - Filter by start date
- `endDate` - Filter by end date

### Get Booking Details
- **Endpoint:** `GET /api/v1/bookings/:id`
- **Authentication:** Required
- **Description:** Retrieves details of a specific booking

### Update Booking
- **Endpoint:** `PUT /api/v1/bookings/:id`
- **Authentication:** Required (Owner or assigned technician)
- **Description:** Updates booking details

### Update Booking Status
- **Endpoint:** `PUT /api/v1/bookings/:id/status`
- **Authentication:** Required
- **Description:** Updates booking status

**Request Body:**
```json
{
  "status": "IN_PROGRESS"
}
```

**Booking Statuses:**
- `PENDING` - Waiting for technician assignment
- `CONFIRMED` - Technician assigned
- `IN_PROGRESS` - Work in progress
- `COMPLETED` - Service completed
- `CANCELLED` - Cancelled by customer
- `REJECTED` - Rejected by technician/admin

### Assign Technician (Admin Only)
- **Endpoint:** `PUT /api/v1/bookings/:id/assign-technician`
- **Authentication:** Required (Admin role)
- **Description:** Assigns a technician to a booking

**Request Body:**
```json
{
  "technicianId": 5
}
```

### Cancel Booking
- **Endpoint:** `DELETE /api/v1/bookings/:id`
- **Authentication:** Required (Owner)
- **Description:** Cancels a booking

## Technician Management APIs

### Get Available Technicians (Public)
- **Endpoint:** `GET /api/v1/technicians`
- **Authentication:** Not required
- **Description:** Retrieves list of available technicians

**Query Parameters:**
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10)
- `specialization` - Filter by specialization
- `isAvailable` - Filter by availability (true/false)
- `search` - Search in name/specialization
- `minRate` - Minimum hourly rate
- `maxRate` - Maximum hourly rate

### Get Technician Profile (Public)
- **Endpoint:** `GET /api/v1/technicians/:id`
- **Authentication:** Not required
- **Description:** Retrieves public profile of a technician

### Get Technician Schedule (Public)
- **Endpoint:** `GET /api/v1/technicians/:id/schedule`
- **Authentication:** Not required
- **Description:** Retrieves technician's weekly schedule

### Update Availability
- **Endpoint:** `PUT /api/v1/technicians/:id/availability`
- **Authentication:** Required (Technician owner or Admin)
- **Description:** Updates technician's general availability status

**Request Body:**
```json
{
  "isAvailable": true
}
```

### Update Schedule
- **Endpoint:** `PUT /api/v1/technicians/:id/schedule`
- **Authentication:** Required (Technician owner or Admin)
- **Description:** Updates technician's weekly schedule

**Request Body:**
```json
{
  "schedule": [
    {
      "dayOfWeek": 1,
      "startTime": "09:00",
      "endTime": "17:00",
      "isAvailable": true
    },
    {
      "dayOfWeek": 2,
      "startTime": "09:00",
      "endTime": "17:00",
      "isAvailable": true
    }
  ]
}
```

**Day of Week:**
- `0` - Sunday
- `1` - Monday
- `2` - Tuesday
- `3` - Wednesday
- `4` - Thursday
- `5` - Friday
- `6` - Saturday

### Get Technician Bookings
- **Endpoint:** `GET /api/v1/technicians/:id/bookings`
- **Authentication:** Required (Technician owner or Admin)
- **Description:** Retrieves bookings assigned to a technician

**Query Parameters:**
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10)
- `status` - Filter by booking status
- `startDate` - Filter by start date
- `endDate` - Filter by end date

## User Roles

### Customer
- Can create bookings
- Can view their own bookings
- Can update their own bookings
- Can cancel their own bookings

### Technician
- Can view assigned bookings
- Can update status of assigned bookings
- Can update their own availability and schedule
- Can update details of assigned bookings

### Admin
- Full access to all bookings
- Can assign technicians to bookings
- Can manage technician availability and schedules
- Can view all system data

## Error Responses

All endpoints return consistent error responses:

```json
{
  "message": "Error description",
  "error": "Detailed error message",
  "errors": [
    {
      "field": "fieldName",
      "message": "Validation error message"
    }
  ]
}
```

Common HTTP status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (authentication required)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `500` - Internal Server Error

## Migration Notes

A new database migration has been created: `20250108000000_add_booking_models`

This migration adds:
- `bookings` table with all booking-related fields
- `technician_availability` table for scheduling
- `BookingStatus` enum
- `ServiceCategory` enum
- Proper foreign key relationships

To apply the migration in a real environment:
```bash
npx prisma migrate deploy
```