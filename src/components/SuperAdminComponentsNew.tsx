import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Users, Clock, UserCheck, Building, DollarSign, Zap, Activity, Database, Key } from 'lucide-react';

export function VisitorManagement({ session }: { session: any }) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Visitor Management</h1>
        <p className="text-muted-foreground">Manage hospital visitors and access control</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserCheck className="size-5" />
            Visitor Registration
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p>Visitor management functionality coming soon...</p>
        </CardContent>
      </Card>
    </div>
  );
}

export function QueueManagement({ session }: { session: any }) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Queue Management</h1>
        <p className="text-muted-foreground">Manage patient queues and waiting times</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="size-5" />
            Patient Queue
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p>Queue management functionality coming soon...</p>
        </CardContent>
      </Card>
    </div>
  );
}

export function GynecologyDepartment({ session }: { session: any }) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Gynecology Department</h1>
        <p className="text-muted-foreground">Specialized gynecology services and management</p>
      </div>
      <Card>
        <CardContent className="p-6">
          <p>Gynecology department functionality coming soon...</p>
        </CardContent>
      </Card>
    </div>
  );
}

export function DepartmentManagement({ session }: { session: any }) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Department Management</h1>
        <p className="text-muted-foreground">Manage hospital departments and organization</p>
      </div>
      <Card>
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

export function PayrollManagement({ session }: { session: any }) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Payroll Management</h1>
        <p className="text-muted-foreground">Manage staff payroll and compensation</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="size-5" />
            Payroll System
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p>Payroll management functionality coming soon...</p>
        </CardContent>
      </Card>
    </div>
  );
}

export function AttendanceManagement({ session }: { session: any }) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Attendance Management</h1>
        <p className="text-muted-foreground">Track staff attendance and working hours</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="size-5" />
            Staff Attendance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p>Attendance management functionality coming soon...</p>
        </CardContent>
      </Card>
    </div>
  );
}

export function RadiologyManagement({ session }: { session: any }) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Radiology Management</h1>
        <p className="text-muted-foreground">Manage radiology services and imaging</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="size-5" />
            Radiology Services
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p>Radiology management functionality coming soon...</p>
        </CardContent>
      </Card>
    </div>
  );
}

export function OperationTheatreManagement({ session }: { session: any }) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Operation Theatre Management</h1>
        <p className="text-muted-foreground">Manage operation theatres and surgical procedures</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="size-5" />
            Operation Theatres
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p>Operation theatre management functionality coming soon...</p>
        </CardContent>
      </Card>
    </div>
  );
}

export function BackupManagement({ session }: { session: any }) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Backup Management</h1>
        <p className="text-muted-foreground">Manage system backups and data recovery</p>
      </div>
      <Card>
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

export function ChangePassword({ session }: { session: any }) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Change Password</h1>
        <p className="text-muted-foreground">Update your account password</p>
      </div>
      <Card>
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