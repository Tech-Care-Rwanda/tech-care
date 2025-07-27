# TechCare MVP Implementation Task List

## Overview
This document outlines the critical tasks needed to transform TechCare from its current broken state into a functional MVP. Based on the current state assessment and MVP requirements, these tasks are prioritized to establish core functionality first, then build upon it.

---

## 🚨 CRITICAL PATH - PHASE 1: Core Data Foundation

### Task 1.1: Fix Database Schema & Connection Layer ✅ COMPLETED
**Priority:** CRITICAL | **Estimated Time:** 2-3 days | **Status:** COMPLETED ✅

**Problem:** The core data connection between customers and technicians is broken. New technicians don't appear for customers, bookings don't reach technicians.

**Implementation Steps:**
1. **Audit Current Database Schema** ✅ COMPLETED
   - ✅ Reviewed actual Supabase database structure (`users`, `bookings`, `technician_details`)
   - ✅ Identified table name mismatch (code expected `profiles`/`jobs`, database has `users`/`bookings`)
   - ✅ Found column name mismatch (code used `user_id`, database has `id`)

2. **Fix Profile Creation Flow** ✅ COMPLETED
   - ✅ Fixed technician signup to create proper `users` row with correct columns
   - ✅ Fixed customer signup to create `users` row with proper role
   - ✅ Added proper error handling for database failures
   - ✅ Implemented UPSERT logic to handle email constraint conflicts

3. **Fix Schema Alignment** ✅ COMPLETED
   - ✅ Updated code to use `users.id` instead of `user_id` 
   - ✅ Fixed authentication flow to query correct columns
   - ✅ Updated User interface to match actual database schema
   - ✅ Fixed technician_details relationship to properly reference users.id

4. **Add Data Validation** ✅ COMPLETED
   - ✅ Fixed database constraint handling (email uniqueness)
   - ✅ Implemented proper transaction handling
   - ✅ Added comprehensive logging for failed database operations

**Acceptance Criteria:**
- ✅ New technician signup creates visible profile in database
- ⚠️ Customer booking creates job record linked to both customer and technician (NEXT PRIORITY)
- ✅ All database operations have proper error handling  
- ✅ No orphaned records in database

**Current Issues Identified:**
- 53 users with NULL emails in database (cleanup needed)
- Authentication state persistence needs improvement
- Booking flow integration pending testing

---

### Task 1.2: Fix Authentication State & User Experience ✅ COMPLETED
**Priority:** CRITICAL | **Estimated Time:** 1 day | **Status:** COMPLETED ✅

**Problem:** Users cannot sign out, authentication state persists incorrectly, and signup page shows for authenticated users.

**Implementation Steps:**
1. **Fix SignOut Function** ✅ COMPLETED
   - ✅ Enhanced signOut function to properly clear all auth state
   - ✅ Added proper error handling and user feedback
   - ✅ Implemented force page reload to clear cached state

2. **Fix Auth State Persistence** ✅ COMPLETED
   - ✅ Fixed auth state change listener to handle SIGNED_OUT event
   - ✅ Added explicit state clearing on sign out
   - ✅ Added debugging logs for auth state changes

3. **Fix Signup Page Experience** ✅ COMPLETED
   - ✅ Added authentication check to signup page
   - ✅ Implemented redirect for already authenticated users
   - ✅ Added loading state while checking authentication
   - ✅ Fixed import path for useSupabaseAuth hook

**Acceptance Criteria:**
- ✅ Users can successfully sign out and auth state clears
- ✅ Signup page redirects authenticated users appropriately  
- ✅ No authentication state persistence issues
- ✅ Proper loading states during auth checks

---

### Task 1.3: Fix UI Navigation & Data Display Issues ✅ COMPLETED
**Priority:** HIGH | **Estimated Time:** 1 day | **Status:** COMPLETED ✅

**Problem:** Navigation shows incorrect state, hardcoded data displayed, and technicians not appearing on map.

**Implementation Steps:**
1. **Fix Navigation State Display** ✅ COMPLETED
   - ✅ Fixed navigation to show user profile when authenticated
   - ✅ Removed hardcoded booking counts and replaced with real database queries
   - ✅ Fixed role-based navigation items

2. **Fix Login Redirect Flow** ✅ COMPLETED  
   - ✅ Updated login to redirect customers to homepage (`/`) instead of bookings
   - ✅ Maintained technician redirect to dashboard
   - ✅ Improved redirect logic with proper role handling

3. **Fix Technician Map Display** ✅ COMPLETED
   - ✅ Fixed data transformation to use proper `location: { lat, lng }` objects
   - ✅ Added proper distance calculation and estimated arrival times
   - ✅ Ensured technicians display with default Kigali coordinates when location missing

4. **Remove Hardcoded Mock Data** ✅ COMPLETED
   - ✅ Replaced hardcoded booking count with real database queries
   - ✅ Added proper loading states and error handling
   - ✅ Implemented real-time booking count updates

**Acceptance Criteria:**
- ✅ Navigation bar shows correct authentication state
- ✅ Login redirects to appropriate pages by role
- ✅ Technicians appear properly on map with markers
- ✅ No hardcoded data - all counts from database
- ✅ Real-time updates for booking counts

---

### Task 1.4: Fix Critical Booking Flow Issues ⚠️ IN PROGRESS  
**Priority:** CRITICAL | **Estimated Time:** 1 day | **Status:** IN PROGRESS ⚠️

**Problem:** Booking flow is broken because getTechnicianById fails to find technician records, navigation has missing imports, foreign key constraints, and technician locations appearing outside Kigali.

**Implementation Steps:**
1. **Fix getTechnicianById Function** ⚠️ PARTIAL
   - ✅ Updated function to query `users` table instead of `technician_details`
   - ✅ Added fallback logic for missing technician details
   - ✅ Improved error handling and logging
   - ✅ Ensured data structure matches expected format
   - ✅ Added missing `approval_status` property to fix type errors
   - ❌ **STILL BROKEN**: Function still fails to find technicians by ID

2. **Fix Navigation Import Errors** ✅ COMPLETED
   - ✅ Added missing `HelpCircle` import to NavigationBar
   - ✅ Fixed console errors when clicking profile dropdown

3. **Fix Map Location Consistency** ✅ COMPLETED
   - ✅ Replaced random coordinates with deterministic hash-based generation
   - ✅ Technicians now appear at consistent locations based on their ID
   - ✅ Updated coordinate formula to keep technicians within Kigali bounds (±0.05 degrees)

4. **Fix Booking Foreign Key Constraint** ✅ COMPLETED
   - ✅ Removed hardcoded test customer UUID `"550e8400-e29b-41d4-a716-446655440011"`
   - ✅ Updated booking form to use authenticated user's ID (`profile.id`)
   - ✅ Added authentication validation before booking submission
   - ✅ Fixed booking API to accept real customer data

**Current Error:**
```
Error: Technician with ID a869b8bc-ac10-44bc-9d86-76b8df3f9b86 not found
```

**Remaining Issues:**
- ❌ getTechnicianById function fails to find technicians in database
- ❌ ID mismatch between map display and database queries
- ❌ Booking flow completely broken at technician lookup step

**Acceptance Criteria:**
- ❌ Booking flow works from map click to booking page without errors
- ✅ Navigation dropdown works without console errors  
- ✅ Technicians appear at consistent map locations within Kigali
- ✅ Error handling provides clear debugging information
- ✅ Foreign key constraints pass with authenticated user data
- ✅ Booking creation uses real customer_id instead of test data

**Next Actions Required:**
1. Debug ID mismatch between map technicians and database
2. Fix getTechnicianById query logic
3. Test complete booking flow end-to-end

---

## 🏗️ PHASE 2: Core User Experience

### Task 2.1: Build Technician Discovery System
**Priority:** HIGH | **Estimated Time:** 3-4 days

**Problem:** Customers can't browse technicians or see their profiles. Homepage filters are broken.

**Implementation Steps:**
1. **Transform Homepage (`/`)**
   - Create `TechnicianProfileCard` component
   - Fetch all technicians from `profiles` table where `role: 'technician'`
   - Display technician cards with photo, name, rating, specialties
   - Remove or replace current map-based approach

2. **Fix Popular Services Filtering**
   - Make service filter buttons functional
   - Implement real-time filtering of technician cards
   - Add "No technicians found" state for empty results

3. **Create Technician Profile Page (`/technician/[id]`)**
   - Create new Next.js dynamic route
   - Build comprehensive profile view with:
     - Large profile photo
     - Detailed bio and experience
     - Complete skills list
     - Customer reviews section
   - Add prominent "Book This Technician" button

**Files to Create/Modify:**
- `frontend/src/app/technician/[id]/page.tsx` (NEW)
- `frontend/src/components/technician/TechnicianProfileCard.tsx` (NEW)
- `frontend/src/app/page.tsx` (MODIFY)
- `frontend/src/components/technician/TechnicianProfile.tsx` (NEW)

**Acceptance Criteria:**
- ✅ Homepage displays list of all available technicians
- ✅ Service filters work and update technician list instantly
- ✅ Clicking technician card navigates to detailed profile page
- ✅ Profile page shows complete technician information
- ✅ "Book This Technician" button works properly

### Task 2.2: Fix Technician Onboarding & Dashboard
**Priority:** HIGH | **Estimated Time:** 2-3 days

**Problem:** Technician signup redirects to 404, dashboard has infinite loading and fake data.

**Implementation Steps:**
1. **Fix Signup Redirect**
   - Remove redirect to `/signup/pending-approval`
   - Redirect technicians directly to `/technician/dashboard` after successful signup
   - Add proper success handling and error states

2. **Fix Dashboard Infinite Loading**
   - Identify and fix the infinite loop in job fetching
   - Add proper loading states and error handling
   - Display "No new jobs" message when no data exists

3. **Replace Fake Data with Real Data**
   - Calculate real statistics from database:
     - Active jobs count from `jobs` table
     - Monthly earnings from completed jobs
     - Average rating from `reviews` table
   - Show "0" or "No data" when no records exist
   - Remove all hardcoded values (like "RWF 85,000")

4. **Fix Duplicate Navigation**
   - Remove duplicate navigation bars
   - Ensure consistent layout across all pages

**Files to Modify:**
- `frontend/src/app/signup/page.tsx`
- `frontend/src/app/technician/dashboard/page.tsx`
- `frontend/src/components/layout/NavigationBar.tsx`

**Acceptance Criteria:**
- ✅ Technician signup completes without 404 error
- ✅ Dashboard loads without infinite spinner
- ✅ All statistics show real data or proper zero states
- ✅ Single navigation bar across all pages

---

## 🎨 PHASE 3: UI/UX Fixes

### Task 3.1: Fix Navigation & Authentication States
**Priority:** MEDIUM | **Estimated Time:** 1-2 days

**Problem:** Navigation doesn't reflect user login status, confusing UX.

**Implementation Steps:**
1. **Smart Navigation Bar**
   - Hide "Login" and "Get Started" for logged-in users
   - Show "My Bookings" and profile menu for customers
   - Show "My Jobs" and profile menu for technicians
   - Add proper logout functionality

2. **Fix Post-Login Redirects**
   - Send customers to homepage (`/`) after login
   - Send technicians to dashboard (`/technician/dashboard`) after login
   - Maintain redirect URL for protected pages

**Files to Modify:**
- `frontend/src/components/layout/NavigationBar.tsx`
- `frontend/src/app/login/page.tsx`

**Acceptance Criteria:**
- ✅ Navigation changes based on user authentication state
- ✅ Users redirected to appropriate pages after login
- ✅ Logout functionality works properly

### Task 3.2: Fix Customer Dashboard
**Priority:** MEDIUM | **Estimated Time:** 1-2 days

**Problem:** Customer dashboard shows "No active bookings" even when bookings exist, placeholder contact info.

**Implementation Steps:**
1. **Fix Booking Display**
   - Fetch real bookings from `jobs` table
   - Display actual booking status and details
   - Handle empty states properly

2. **Fix Contact Information**
   - Replace placeholder phone numbers with real technician contact info
   - Implement proper call/message functionality
   - Add error handling for missing contact details

**Files to Modify:**
- `frontend/src/app/dashboard/page.tsx`
- Related booking components

**Acceptance Criteria:**
- ✅ Dashboard shows real booking data
- ✅ Contact buttons use real technician information
- ✅ Proper handling of empty states

---

## 🔧 PHASE 4: Essential Missing Features

### Task 4.1: Fix Password Reset Flow
**Priority:** MEDIUM | **Estimated Time:** 1-2 days

**Problem:** "Forgot password" link leads to nowhere.

**Implementation Steps:**
1. Create password reset page (`/forgot-password`)
2. Implement email-based reset flow using Supabase Auth
3. Create password reset confirmation page
4. Add proper error handling and success states

**Files to Create:**
- `frontend/src/app/forgot-password/page.tsx`
- `frontend/src/app/reset-password/page.tsx`

### Task 4.2: Implement Search Functionality
**Priority:** LOW | **Estimated Time:** 1 day

**Problem:** Search bar exists but doesn't work.

**Implementation Steps:**
1. Connect search bar to technician filtering
2. Add search by name, specialty, and location
3. Implement real-time search results

### Task 4.3: Fix File Upload System
**Priority:** MEDIUM | **Estimated Time:** 2 days

**Problem:** Technician registration file uploads only store filenames.

**Implementation Steps:**
1. Implement proper file upload to Supabase Storage
2. Store file URLs in database instead of filenames
3. Add file validation and size limits
4. Display uploaded files properly in profiles

---

### Task 2.1: Populate Missing Technician Details (Data Integrity)
**Priority:** MEDIUM | **Estimated Time:** 0.5 days | **Status:** PENDING ⏳

**Problem:** Existing technicians in `users` table have no corresponding records in `technician_details` table, causing incomplete profiles.

**Current State:**
- 4 technicians exist in `users` table with role='TECHNICIAN'
- 0 records exist in `technician_details` table
- All technicians show default "General Tech Support" specialization

**Proposed Solution:**
1. **Create Migration Script**
   - Query all users with role='TECHNICIAN'
   - Create corresponding `technician_details` records with default values
   - Set specializations based on existing user data or surveys

2. **Database Script:**
   ```sql
   -- Create technician_details for existing technicians
   INSERT INTO technician_details (
     user_id, specialization, experience, rate, is_available, created_at, updated_at
   )
   SELECT 
     id as user_id,
     'Computer Repair' as specialization,  -- Default specialization
     'Experienced technician' as experience,
     15000 as rate,
     true as is_available,
     NOW() as created_at,
     NOW() as updated_at
   FROM users 
   WHERE role = 'TECHNICIAN' 
     AND id NOT IN (SELECT user_id FROM technician_details)
   ON CONFLICT (user_id) DO NOTHING;
   ```

3. **Verification Steps:**
   - Confirm all technicians have detail records
   - Test booking flow with populated data  
   - Update specializations with real data

**Acceptance Criteria:**
- All existing technicians have `technician_details` records
- Technicians show proper specializations instead of "General Tech Support"
- Booking flow works with complete technician profiles
- No data loss or corruption during migration

---

## 📋 TESTING & VALIDATION PHASE

### Task 5.1: End-to-End Flow Testing
**Priority:** HIGH | **Estimated Time:** 1-2 days

**Test Scenarios:**
1. **New Customer Journey**
   - Sign up as customer → View technicians → Book service → View booking in dashboard
2. **New Technician Journey** 
   - Sign up as technician → Complete profile → View dashboard → Receive booking
3. **Complete Booking Flow**
   - Customer books → Technician sees request → Technician accepts → Both see status update

### Task 5.2: Data Integrity Validation
**Priority:** HIGH | **Estimated Time:** 1 day

**Validation Checks:**
- All user registrations create proper database records
- All bookings create linked job records
- No orphaned data in database
- All foreign key relationships work properly

---

## 🚀 DEPLOYMENT PREPARATION

### Task 6.1: Environment Configuration
**Priority:** MEDIUM | **Estimated Time:** 0.5 days

- Verify all environment variables are properly set
- Test database connections in production environment
- Ensure Supabase configuration is correct

### Task 6.2: Performance Optimization
**Priority:** LOW | **Estimated Time:** 1 day

- Optimize database queries
- Add proper loading states throughout app
- Implement error boundaries for better error handling

---

## 📊 SUCCESS METRICS

After completing these tasks, the application should achieve:

✅ **Core Functionality Working:**
- Customers can find and book technicians
- Technicians can see and manage bookings  
- All user journeys complete without errors

✅ **Data Integrity:**
- All database operations work reliably
- No broken relationships or orphaned records
- Real data displayed throughout application

✅ **User Experience:**
- No 404 errors in critical flows
- Consistent navigation and layout
- Proper loading and error states

---

## ⚠️ IMPLEMENTATION NOTES

### Critical Dependencies
1. **Task 1.1 must be completed first** - Everything else depends on proper data foundation
2. **Phase 2 tasks should be done in parallel** after Phase 1 completion
3. **Testing should happen continuously**, not just at the end

### Risk Mitigation
- Test each task thoroughly before moving to next
- Keep database backups before making schema changes
- Use feature flags for major UI changes
- Have rollback plan for each deployment

### Resource Requirements
- **Total Estimated Time:** 15-20 development days
- **Database Access:** Full Supabase admin access required
- **Testing Environment:** Staging environment recommended
- **Code Review:** All critical path changes should be reviewed

---

*This task list is designed to transform TechCare from its current broken state into a functional MVP that provides real value to both customers and technicians. Focus on the Critical Path first - without proper data foundation, no other features will work reliably.*