# Database Setup Guide

## Prerequisites
- Supabase account and project created
- Project URL and anon key configured in `src/utils/supabase/info.tsx`

## Setup Steps

### 1. Run Database Schema
1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Copy and paste the contents of `src/utils/supabase/schema.sql`
4. Run the SQL script to create all necessary tables and policies

### 2. Configure Authentication
1. In Supabase dashboard, go to Authentication > Settings
2. Enable email authentication
3. Configure email templates if needed
4. Set up any additional auth providers if required

### 3. Test Database Connection
1. Start the application with `npm run dev`
2. Try creating a new account
3. Test basic CRUD operations in the app

## Database Tables Created

### Core Tables
- `patients` - Patient information and medical history
- `appointments` - Appointment scheduling and management
- `payments` - Payment records and billing
- `medical_records` - Patient medical records and diagnoses
- `lab_tests` - Laboratory test orders and results
- `prescriptions` - Medication prescriptions

### Features
- Row Level Security (RLS) enabled on all tables
- Automatic `updated_at` timestamp triggers
- Proper foreign key relationships
- Indexed columns for better performance
- UUID primary keys for security

## Data Migration (Optional)
If you have existing data, you can:
1. Export data from your current system
2. Format it according to the table schemas
3. Use Supabase's import functionality or SQL INSERT statements

## Troubleshooting
- Ensure your Supabase project has the correct permissions
- Check that RLS policies allow your operations
- Verify that the anon key has the necessary permissions
- Check browser console for any CORS or authentication errors

## Local Development
The app will fall back to localStorage for data persistence if Supabase is not available or configured incorrectly. This allows for local development without requiring a database connection.