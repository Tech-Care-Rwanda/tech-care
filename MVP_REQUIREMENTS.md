# TechCare MVP - Core Requirements Only

**CRITICAL RULE: NEVER USE MOCK DATA. ALL DATA MUST COME FROM THE DATABASE.**

## What We're Building (MVP Only)

A basic technician booking platform where:
1. Users can see technicians on a map ✅
2. Users can click technicians to see details and book
3. Technicians have dashboards to manage bookings  
4. Complete booking system flow works end-to-end

## Current Status ✅

### ✅ COMPLETED
- **Frontend-Database Connection**: Direct Supabase connection working
- **Map System**: Shows real technicians from Supabase with GPS coordinates
- **Technician Data**: Real 5 technicians in Kigali with specializations
- **No Mock Data**: All mock/demo data removed, shows empty states when no data
- **UI Components**: Map, cards, buttons, profile dropdown working
- **Database**: Supabase with tables: users, technician_details, bookings (empty), reviews

### ❌ NEXT PHASE TO BUILD

## Phase 3: Core User & Technician Workflows

### 3.1 Fix Popular Services Filtering 🔥
**PRIORITY: HIGH - BROKEN**
- [ ] Popular Services filter buttons not working (Computer Repair, Mobile & Devices, Network Setup)
- [ ] Fix filtering logic in SERVICE_CATEGORIES mapping
- [ ] Ensure filtered technician count updates correctly
- [ ] Add "Book Now" button to Popular Services widget for quick booking

### 3.2 Complete Booking System Flow 🔥  
**PRIORITY: HIGH - CORE FEATURE**
- [ ] Design booking flow: Map → Select Technician → Book Now → Booking Form → Confirmation
- [ ] Create `src/app/book/[technicianId]/page.tsx` - booking form page
- [ ] Booking form: service type, date/time, location, notes, customer info
- [ ] Save bookings to Supabase bookings table
- [ ] Show booking confirmation with details
- [ ] Update My Bookings page to show real created bookings

### 3.3 Technician Dashboard Design & Flow
**PRIORITY: MEDIUM - NEW FEATURE**
- [ ] Create `src/app/technician/dashboard/page.tsx`
- [ ] Technician sees: Pending bookings, Confirmed bookings, Schedule, Profile
- [ ] Accept/Decline booking functionality
- [ ] Update booking status (In Progress, Completed)
- [ ] Real-time booking notifications (simple list refresh)

### 3.4 Authentication & User Management
**PRIORITY: MEDIUM - REQUIRED FOR BOOKINGS**
- [ ] Connect to existing JWT auth system
- [ ] Role-based routing (customer vs technician dashboards)
- [ ] Profile management for both user types
- [ ] Session management and protected routes

### 3.5 Final Cleanup
**PRIORITY: LOW - POLISH**
- [ ] Remove any remaining mock data references
- [ ] Fix all broken navigation links
- [ ] Ensure consistent Airbnb red (#FF385C) colors throughout
- [ ] Test all user flows end-to-end

## User Flow Design

### Customer Journey:
1. **Find Technicians** (Working ✅) → Map shows real technicians  
2. **Filter Services** (Broken ❌) → Popular Services buttons filter map
3. **Select & Book** (Missing ❌) → Click technician → Book Now → Form → Confirmation
4. **Manage Bookings** (Partial ✅) → My Bookings shows real bookings, cancel/modify

### Technician Journey:
1. **Dashboard** (Missing ❌) → See pending/confirmed bookings
2. **Manage Requests** (Missing ❌) → Accept/decline bookings  
3. **Update Status** (Missing ❌) → Mark in-progress/completed
4. **Profile** (Missing ❌) → Update availability, location, services

## Database Schema (Current)
- **users**: id, full_name, email, phone_number, role, is_active
- **technician_details**: id, user_id, specialization, experience, rate, is_available, latitude, longitude  
- **bookings**: (exists but empty - needs proper structure)
- **reviews**: (exists)

## Success Criteria
- [ ] Popular Services filtering works perfectly
- [ ] User can book a technician through complete flow
- [ ] Booking appears in My Bookings page  
- [ ] Technician can see and manage bookings in their dashboard
- [ ] Zero mock data anywhere in the system

## What NOT to Build (MVP)
- Real-time updates, push notifications
- Advanced matching algorithms, photo verification
- Analytics, multi-language support, mobile app
- Payment processing (just track bookings)

---

**Next Implementation Priority**: 
1. Fix Popular Services filtering (broken functionality)
2. Build complete booking system flow  
3. Create technician dashboard
4. Connect authentication system