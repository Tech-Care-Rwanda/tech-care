# Claude Code Execution Prompt for TechCare MVP Implementation

## Initial Setup Instructions

Hey Claude! I need you to help me implement the TechCare MVP based on the detailed task list in `IMPLEMENTATION_TASKS.md`. Before we start coding, I need you to understand the current database structure.

**IMPORTANT INSTRUCTIONS:**
- **DO NOT run any SQL commands yourself** - I will run them in Supabase and provide you the results
- **DO NOT use any database connection tools** - just give me the SQL commands to run
- Read the `IMPLEMENTATION_TASKS.md` file first to understand what we're building
- Focus on Phase 1 (Critical Path) first - the data foundation must be solid before anything else

## Step 1: Database Analysis

First, provide me with these SQL commands so I can run them in Supabase and give you the current database structure:

```sql
-- Command 1: List all tables
SELECT table_name, table_schema 
FROM information_schema.tables 
WHERE table_schema = 'public';

-- Command 2: Get profiles table structure
SELECT column_name, data_type, is_nullable, column_default, character_maximum_length
FROM information_schema.columns 
WHERE table_name = 'profiles' AND table_schema = 'public'
ORDER BY ordinal_position;

-- Command 3: Get jobs table structure  
SELECT column_name, data_type, is_nullable, column_default, character_maximum_length
FROM information_schema.columns 
WHERE table_name = 'jobs' AND table_schema = 'public'
ORDER BY ordinal_position;

-- Command 4: Check foreign key constraints
SELECT
    tc.table_name, 
    kcu.column_name, 
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name,
    tc.constraint_name
FROM information_schema.table_constraints AS tc 
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
  AND tc.table_schema = kcu.table_schema
JOIN information_schema.constraint_column_usage AS ccu
  ON ccu.constraint_name = tc.constraint_name
  AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY' 
  AND tc.table_schema = 'public'
  AND (tc.table_name = 'profiles' OR tc.table_name = 'jobs');

-- Command 5: Sample data from profiles table
SELECT id, full_name, email, role, specialization, created_at 
FROM profiles 
LIMIT 10;

-- Command 6: Sample data from jobs table
SELECT id, customer_id, technician_id, service_type, status, created_at 
FROM jobs 
LIMIT 10;

-- Command 7: Check for any other relevant tables
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name IN ('reviews', 'bookings', 'services', 'users', 'technicians', 'customers');
```

## Step 2: After Database Analysis

Once I provide you with the SQL results, please:

1. **Analyze the current database structure** and identify any issues with:
   - Missing foreign key constraints
   - Incorrect data types
   - Missing required columns
   - Data integrity problems

2. **Create a plan for Task 1.1 (Fix Database Schema & Connection Layer)** including:
   - Any SQL migrations needed to fix the schema
   - Code changes needed in the signup flows
   - Code changes needed in the booking flow
   - Validation and error handling improvements

3. **Start implementing the fixes** by:
   - Reading the current codebase files
   - Identifying where the database operations happen
   - Proposing specific code changes
   - Following the task priorities in `IMPLEMENTATION_TASKS.md`

## Important Context

**Current State:** The app is mostly broken with these critical issues:
- New technicians sign up but don't appear for customers to book
- Customers book services but technicians never see the requests
- Technician signup redirects to 404 error page
- Dashboard shows fake data and infinite loading
- No real data connection between frontend and database

**Goal:** Create a stable end-to-end experience where customers can find and book technicians, and technicians can see and manage those bookings.

**Priority Order:**
1. Fix database schema and data connections (Phase 1)
2. Build technician discovery system (Phase 2)  
3. Fix UI bugs and navigation (Phase 3)
4. Add missing features (Phase 4)

## Working Style

- Use the TodoWrite tool to track progress on each task
- Read existing code before making changes to follow current patterns
- Test each change thoroughly before moving to the next
- Ask me to run any database commands - don't attempt to run them yourself
- Focus on one task at a time and complete it fully before moving on

Ready to start? Please give me those SQL commands to run first, then we'll begin the implementation!