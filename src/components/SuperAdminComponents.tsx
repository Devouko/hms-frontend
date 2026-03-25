import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Building, Users, DollarSign, Clock, Database, Key } from 'lucide-react';

// Department Management Component
export function DepartmentManagement({ session }: { session: any }) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Department Management</h1>
        <p className="text-muted-foreground">Manage hospital departments and their operations</p>
      </div>
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="size-5" />
            Departments
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p>Department management functionality coming soon...</p>
        </CardContent>
      </Card>
    </div>
  );
}

// Payroll Management Component
export function PayrollManagement({ session }: { session: any }) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Payroll Management</h1>
        <p className="text-muted-foreground">Manage staff salaries and payroll processing</p>
      </div>
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="size-5" />
            Payroll
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p>Payroll management functionality coming soon...</p>
        </CardContent>
      </Card>
    </div>
  );
}

// Attendance Management Component
export function AttendanceManagement({ session }: { session: any }) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Attendance Management</h1>
        <p className="text-muted-foreground">Track staff attendance and working hours</p>
      </div>
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="size-5" />
            Attendance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p>Attendance management functionality coming soon...</p>
        </CardContent>
      </Card>
    </div>
  );
}

// Radiology Management Component
export function RadiologyManagement({ session }: { session: any }) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Radiology Management</h1>
        <p className="text-muted-foreground">Manage radiology services and imaging</p>
      </div>
      <Card className="glass-card">
        <CardContent className="p-6">
          <p>Radiology management functionality coming soon...</p>
        </CardContent>
      </Card>
    </div>
  );
}

// Operation Theatre Management Component
export function OperationTheatreManagement({ session }: { session: any }) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Operation Theatre Management</h1>
        <p className="text-muted-foreground">Manage operation theatre scheduling and resources</p>
      </div>
      <Card className="glass-card">
        <CardContent className="p-6">
          <p>Operation theatre management functionality coming soon...</p>
        </CardContent>
      </Card>
    </div>
  );
}

// Backup Management Component
export function BackupManagement({ session }: { session: any }) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Backup Management</h1>
        <p className="text-muted-foreground">Manage system backups and data recovery</p>
      </div>
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="size-5" />
            System Backup
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p>Backup management functionality coming soon...</p>
        </CardContent>
      </Card>
    </div>
  );
}

// Change Password Component
export function ChangePassword({ session }: { session: any }) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Change Password</h1>
        <p className="text-muted-foreground">Update your account password</p>
      </div>
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="size-5" />
            Password Settings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p>Password change functionality coming soon...</p>
        </CardContent>
      </Card>
    </div>
  );
}
