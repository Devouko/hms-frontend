# Role-Based Access Control (RBAC) Implementation

## Overview
The Hospital Management System now implements proper role-based access control where administrators assign roles to users, and users have access only to features relevant to their assigned role.

## Changes Made

### 1. Signup Process
- **Removed** user self-selection of roles during signup
- All new users are automatically assigned the `user` role
- Only administrators can change user roles after account creation

### 2. Available Roles

| Role | Description | Access Level |
|------|-------------|--------------|
| `user` | Basic user with limited access | Minimal access |
| `receptionist` | Front desk staff | Front Office, Patients, Appointments, Payments |
| `doctor` | Medical doctors | Patients, Appointments, Doctor Portal, Laboratory |
| `nurse` | Nursing staff | Patients, Appointments, Nursing Station |
| `pharmacist` | Pharmacy staff | Pharmacy, Inventory |
| `lab_technician` | Laboratory staff | Laboratory |
| `admin` | System administrator | Full access except super admin functions |
| `super_admin` | Super administrator | Complete system access including user management |

### 3. Menu Access by Role

#### Dashboard
- **Access:** All roles

#### Front Office
- **Access:** receptionist, admin, super_admin

#### Patients
- **Access:** doctor, nurse, receptionist, admin, super_admin

#### Appointments
- **Access:** doctor, nurse, receptionist, admin, super_admin

#### Payments
- **Access:** receptionist, admin, super_admin

#### Employee Management
- **Access:** admin, super_admin

#### Activity
- **Access:** admin, super_admin

#### Statistics
- **Access:** admin, super_admin

#### User Management
- **Access:** admin, super_admin

#### Doctor Portal
- **Access:** doctor, admin, super_admin

#### Pharmacy & Inventory
- **Access:** pharmacist, admin, super_admin

#### Laboratory
- **Access:** lab_technician, doctor, admin, super_admin

#### Nursing Station
- **Access:** nurse, admin, super_admin

### 4. How to Assign Roles

1. **Login as Admin or Super Admin**
2. Navigate to **User Management** from the sidebar
3. Find the user you want to assign a role to
4. Click the **Edit** button (pencil icon)
5. Select the appropriate role from the dropdown
6. Click **Update Role**

### 5. User Experience

- Users only see menu items they have access to
- If a user tries to access a restricted page, they see an "Access Denied" message
- User's current role is displayed in the header next to their name
- Role information is visible in the Profile Edit dialog (read-only)

## Security Features

1. **Role Assignment:** Only admins and super admins can assign roles
2. **Access Control:** Each page checks user role before rendering
3. **Menu Filtering:** Sidebar only shows accessible menu items
4. **Default Role:** New signups default to 'user' role with minimal access

## Testing the Implementation

1. **Create a new account** - Verify it defaults to 'user' role
2. **Login as admin** - Assign different roles to test users
3. **Login with different roles** - Verify each role sees only their authorized menus
4. **Try accessing restricted pages** - Verify access denied message appears

## Future Enhancements

- Add more granular permissions within each role
- Implement department-based access control
- Add audit logging for role changes
- Create custom role builder for flexible permissions
