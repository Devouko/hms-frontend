# Admin Account Setup Guide

## Creating Your First Admin Account

Since the system now requires admins to assign roles, you need to create the first super admin account. Here are your options:

## Option 1: Create Super Admin via Signup (Temporary Method)

### Step 1: Temporarily Enable Admin Signup

Edit `src\components\AuthPage.tsx` and change line 56 to allow super_admin role during signup:

```typescript
// Change this line:
body: JSON.stringify({ email, password, name, role: 'user' }),

// To this (temporarily):
body: JSON.stringify({ email, password, name, role: 'super_admin' }),
```

### Step 2: Create Your Admin Account

1. Run the application: `npm run dev`
2. Click "Sign Up"
3. Fill in the form:
   - **Name:** Admin User
   - **Email:** admin@hospital.com
   - **Password:** Admin@123456
4. Click "Sign Up"

### Step 3: Revert the Change

Change the line back to:
```typescript
body: JSON.stringify({ email, password, name, role: 'user' }),
```

### Step 4: Login

Use these credentials:
- **Email:** admin@hospital.com
- **Password:** Admin@123456

---

## Option 2: Direct Database Method (Recommended)

If you have access to Supabase dashboard:

1. Go to your Supabase project dashboard
2. Navigate to **Authentication** → **Users**
3. Click **Add User**
4. Fill in:
   - Email: admin@hospital.com
   - Password: Admin@123456
   - Auto Confirm User: ✓ (checked)
5. After creating, click on the user
6. Go to **User Metadata** section
7. Add this JSON:
```json
{
  "name": "Admin User",
  "role": "super_admin"
}
```
8. Save changes

---

## Option 3: Create Multiple Test Accounts

Here are suggested test accounts for different roles:

### Super Admin
- Email: admin@hospital.com
- Password: Admin@123456
- Role: super_admin

### Doctor
- Email: doctor@hospital.com
- Password: Doctor@123
- Role: doctor (assign via User Management after login as admin)

### Nurse
- Email: nurse@hospital.com
- Password: Nurse@123
- Role: nurse (assign via User Management)

### Pharmacist
- Email: pharmacist@hospital.com
- Password: Pharma@123
- Role: pharmacist (assign via User Management)

### Receptionist
- Email: reception@hospital.com
- Password: Reception@123
- Role: receptionist (assign via User Management)

### Lab Technician
- Email: lab@hospital.com
- Password: Lab@123
- Role: lab_technician (assign via User Management)

---

## After Creating Admin Account

1. **Login** with admin credentials
2. Navigate to **User Management** (in sidebar under "OTHER MENU")
3. You'll see all registered users
4. Click the **Edit** button (pencil icon) next to any user
5. Select their appropriate role from dropdown
6. Click **Update Role**

---

## Quick Start Commands

```bash
# Install dependencies
npm i

# Run development server
npm run dev
```

The application will be available at: http://localhost:5173

---

## Security Notes

⚠️ **Important:**
- Change default passwords immediately in production
- Never commit credentials to version control
- Use strong passwords for admin accounts
- Regularly audit user roles and permissions
- Keep the super_admin role limited to trusted personnel only
