# 🚀 Quick Start Guide - Hospital Management System

## Step 1: Install Dependencies

```bash
npm i
```

## Step 2: Create Super Admin Account

You have **3 easy options**:

### ✅ Option A: Use the HTML Tool (Easiest)

1. Start the dev server:
   ```bash
   npm run dev
   ```

2. Open `create-admin.html` in your browser

3. Click "Create Super Admin Account"

4. Use these credentials to login:
   - **Email:** admin@hospital.com
   - **Password:** Admin@123456

---

### ✅ Option B: Temporary Code Change

1. Open `src\components\AuthPage.tsx`

2. Find line 56 and change:
   ```typescript
   body: JSON.stringify({ email, password, name, role: 'user' }),
   ```
   To:
   ```typescript
   body: JSON.stringify({ email, password, name, role: 'super_admin' }),
   ```

3. Run the app and sign up:
   ```bash
   npm run dev
   ```

4. Create account with:
   - Name: Admin User
   - Email: admin@hospital.com
   - Password: Admin@123456

5. **Important:** Change line 56 back to `role: 'user'`

---

### ✅ Option C: Via Supabase Dashboard

1. Go to your Supabase project
2. Navigate to **Authentication** → **Users**
3. Click **Add User**
4. Create user with email: admin@hospital.com
5. In **User Metadata**, add:
   ```json
   {
     "name": "Admin User",
     "role": "super_admin"
   }
   ```

---

## Step 3: Login & Assign Roles

1. **Login** with admin credentials

2. Go to **User Management** (in sidebar)

3. Create test accounts for different roles:
   - Sign up new users (they'll be 'user' by default)
   - As admin, assign them proper roles:
     - **doctor** - Access to patients, appointments, doctor portal
     - **nurse** - Access to patients, appointments, nursing station
     - **pharmacist** - Access to pharmacy and inventory
     - **lab_technician** - Access to laboratory
     - **receptionist** - Access to front office, patients, billing

---

## Default Admin Credentials

**Email:** admin@hospital.com  
**Password:** Admin@123456

⚠️ **Change this password immediately after first login!**

---

## Test Accounts (Create these for testing)

| Role | Email | Suggested Password |
|------|-------|-------------------|
| Super Admin | admin@hospital.com | Admin@123456 |
| Doctor | doctor@hospital.com | Doctor@123 |
| Nurse | nurse@hospital.com | Nurse@123 |
| Pharmacist | pharmacist@hospital.com | Pharma@123 |
| Lab Tech | lab@hospital.com | Lab@123 |
| Receptionist | reception@hospital.com | Reception@123 |

---

## Role-Based Access Summary

### 🔴 Super Admin
- **Full system access**
- Can manage all users and assign roles
- Access to all features

### 🟠 Admin
- **Full access** except super admin functions
- Can manage employees and settings
- Cannot modify super admin accounts

### 🔵 Doctor
- Dashboard, Patients, Appointments
- Doctor Portal, Laboratory
- Help Center

### 🟢 Nurse
- Dashboard, Patients, Appointments
- Nursing Station
- Help Center

### 🟡 Pharmacist
- Dashboard, Pharmacy
- Inventory Management
- Help Center

### 🟣 Lab Technician
- Dashboard, Laboratory
- Help Center

### 🟤 Receptionist
- Dashboard, Front Office
- Patients, Appointments, Payments
- Help Center

### ⚪ User (Default)
- Dashboard only
- Help Center

---

## Troubleshooting

### "Failed to create account"
- Check if email is already registered
- Verify Supabase credentials in `src/utils/supabase/info.ts`
- Ensure backend function is deployed

### "Cannot access User Management"
- Make sure you're logged in as admin or super_admin
- Check your role in the header (top right)

### "Access Denied" message
- Your role doesn't have permission for that page
- Contact admin to update your role

---

## Next Steps

1. ✅ Create super admin account
2. ✅ Login and explore the dashboard
3. ✅ Create test accounts for different roles
4. ✅ Assign roles via User Management
5. ✅ Test each role's access permissions
6. ✅ Change default passwords
7. ✅ Start using the system!

---

## Support

For detailed information, see:
- `ADMIN_SETUP.md` - Detailed admin setup instructions
- `RBAC_IMPLEMENTATION.md` - Role-based access control details
- `README.md` - General project information

---

**🎉 You're all set! Enjoy using the Hospital Management System!**
