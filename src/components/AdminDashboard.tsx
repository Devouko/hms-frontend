import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Users, Calendar, Stethoscope, Pill, TestTube, 
  Droplet, FileText, Settings, BarChart3, 
  UserPlus, Activity, Clock, DollarSign, Search,
  Truck, Database, AlertTriangle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { PatientManagement } from './PatientManagement';
import { AppointmentsPage } from './AppointmentsPage';
import { DoctorManagement } from './DoctorManagement';
import { PharmacyManagement } from './PharmacyManagement';
import { BloodBankManagement } from './BloodBankManagement';
import { PathologyManagement } from './PathologyManagement';
import { RadiologyManagement } from './RadiologyManagement';
import { BillingManagement } from './BillingManagement';
import { ReportsManagement } from './ReportsManagement';
import { SystemSettings } from './SystemSettings';
import { BackupManagement } from './BackupManagement';
import { ChangePassword } from './ChangePassword';
import { SearchPatients } from './SearchPatients';
import { ExpenseManagement } from './ExpenseManagement';
import { IncomeManagement } from './IncomeManagement';
import { AmbulanceManagement } from './AmbulanceManagement';
import { OperationTheatreManagement } from './OperationTheatreManagement';
import { StaffManagement } from './StaffManagement';
import { PayrollManagement } from './PayrollManagement';
import { AttendanceManagement } from './AttendanceManagement';
import { BedManagement } from './BedManagement';
import { DepartmentManagement } from './DepartmentManagement';
import { EmergencyManagement } from './EmergencyManagement';
import { InpatientManagement } from './InpatientManagement';
import { OutpatientManagement } from './OutpatientManagement';
import { VisitorManagement } from './VisitorManagement';
import { WorkflowManagement } from './WorkflowManagementNew';
import { QueueManagement } from './QueueManagementNew';
import { UserManagement } from './UserManagementNew';

interface AdminDashboardProps {
  session: any;
}

interface DashboardStats {
  totalPatients: number;
  todayAppointments: number;
  activeDoctors: number;
  pendingBills: number;
  bloodUnits: number;
  pendingTests: number;
  revenue: number;
  bedOccupancy: number;
}

export function AdminDashboard({ session }: AdminDashboardProps) {
  const [stats, setStats] = useState<DashboardStats>({
    totalPatients: 0,
    todayAppointments: 0,
    activeDoctors: 0,
    pendingBills: 0,
    bloodUnits: 0,
    pendingTests: 0,
    revenue: 0,
    bedOccupancy: 0
  });

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      // Get stats from localStorage for demo
      const patients = JSON.parse(localStorage.getItem('hospital_patients') || '[]');
      const appointments = JSON.parse(localStorage.getItem('hospital_appointments') || '[]');
      const doctors = JSON.parse(localStorage.getItem('hospital_doctors') || '[]');
      const bills = JSON.parse(localStorage.getItem('hospital_bills') || '[]');
      const bloodBank = JSON.parse(localStorage.getItem('hospital_blood_bank') || '[]');
      
      const today = new Date().toISOString().split('T')[0];
      const todayAppointments = appointments.filter((apt: any) => apt.date === today);
      const pendingBills = bills.filter((bill: any) => bill.status === 'Pending');
      const totalBloodUnits = bloodBank.reduce((sum: number, item: any) => sum + (item.quantity || 0), 0);
      const totalRevenue = bills.reduce((sum: number, bill: any) => sum + (parseFloat(bill.amount) || 0), 0);

      setStats({
        totalPatients: patients.length,
        todayAppointments: todayAppointments.length,
        activeDoctors: doctors.length,
        pendingBills: pendingBills.length,
        bloodUnits: totalBloodUnits,
        pendingTests: Math.floor(Math.random() * 20) + 5,
        revenue: totalRevenue,
        bedOccupancy: Math.floor(Math.random() * 80) + 60
      });
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    }
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalPatients}</div>
            <p className="text-xs text-muted-foreground">Registered patients</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Appointments</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.todayAppointments}</div>
            <p className="text-xs text-muted-foreground">Scheduled for today</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Doctors</CardTitle>
            <Stethoscope className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeDoctors}</div>
            <p className="text-xs text-muted-foreground">Available doctors</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.revenue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Total revenue</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Blood Units</CardTitle>
            <Droplet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.bloodUnits}</div>
            <p className="text-xs text-muted-foreground">Available units</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Tests</CardTitle>
            <TestTube className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingTests}</div>
            <p className="text-xs text-muted-foreground">Lab tests pending</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Bills</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingBills}</div>
            <p className="text-xs text-muted-foreground">Unpaid bills</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bed Occupancy</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.bedOccupancy}%</div>
            <p className="text-xs text-muted-foreground">Beds occupied</p>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button className="h-20 flex flex-col items-center justify-center bg-primary hover:bg-primary/90 text-white">
                <UserPlus className="h-6 w-6 mb-2" />
                Add Patient
              </Button>
              <Button className="h-20 flex flex-col items-center justify-center bg-primary hover:bg-primary/90 text-white">
                <Clock className="h-6 w-6 mb-2" />
                Schedule Appointment
              </Button>
              <Button className="h-20 flex flex-col items-center justify-center bg-primary hover:bg-primary/90 text-white">
                <Pill className="h-6 w-6 mb-2" />
                Manage Pharmacy
              </Button>
              <Button className="h-20 flex flex-col items-center justify-center bg-primary hover:bg-primary/90 text-white">
                <FileText className="h-6 w-6 mb-2" />
                View Reports
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}