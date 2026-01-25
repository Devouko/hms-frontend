import { useState } from 'react';
import { motion } from 'motion/react';
import {
  LayoutDashboard,
  Users,
  Calendar,
  CreditCard,
  UserCog,
  Activity,
  BarChart3,
  HelpCircle,
  Settings,
  FileText,
  Search,
  Plus,
  Bell,
  LogOut,
  Shield,
  ShieldAlert,
  Stethoscope,
  Pill,
  FlaskConical,
  Heart,
  Package,
  User,
  ClipboardList,
  Bot,
  TrendingUp,
  TrendingDown,
  Car,
  MessageSquare,
  Building,
  DollarSign,
  Clock,
  Bed,
  Zap,
  GitBranch,
  Database,
  Key,
} from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { NewDashboard } from './NewDashboard';
import { ReceptionistDashboard } from './ReceptionistDashboard';
import { LabTechDashboard } from './LabTechDashboard';
import { LabInvoiceGenerator } from './LabInvoiceGenerator';
import { LabResultsEntry } from './LabResultsEntry';
import { TestQueueManagement } from './TestQueueManagement';
import { SpecimenTracking } from './SpecimenTracking';
import { PatientsPage } from './PatientsPage';
import { AppointmentsPage } from './AppointmentsPage';
import { PaymentsPage } from './PaymentsPage';
import { EmployeePageNew } from './EmployeePageNew';
import { StatisticsPage } from './StatisticsPage';
import { UserManagement } from './UserManagement';
import { DoctorManagement } from './DoctorManagement';
import { DoctorPortal } from './DoctorPortal';
import { PharmacyManagement } from './PharmacyManagement';
import { LaboratoryManagement } from './LaboratoryManagement';
import { NursingStation } from './NursingStation';
import { ProfileEdit } from './ProfileEdit';
import { FrontOffice } from './FrontOffice';
import { AccessDenied } from './AccessDenied';
import { NotificationsPanel } from './NotificationsPanel';
import { WorkflowManagement } from './WorkflowManagement';
import { OutpatientManagement } from './OutpatientManagement';
import { InpatientManagement } from './InpatientManagement';
import { AdminDashboard } from './AdminDashboard';
import { ActivityPage } from './ActivityPage';
import { HelpCenter } from './HelpCenter';
import { SettingsPage } from './SettingsPage';
import { ReportsPage } from './ReportsPage';
import { ThemeToggle } from './ThemeToggle';
import { FloatingAIButton } from './FloatingAIButtonRobust';
import { NavbarAIChat } from './NavbarAIChat';
import { BloodBankManagement } from './BloodBankManagement';
import { MedicalRecordsManagement } from './MedicalRecordsManagement';
import { ExpenseManagement } from './ExpenseManagement';
import { IncomeManagement } from './IncomeManagement';
import { VehicleManagement } from './VehicleManagement';
import { ComplaintManagement } from './ComplaintManagement';
import { SystemSettings } from './SystemSettings';
import { BedManagement } from './BedManagementNew';
import { EmergencyManagement } from './EmergencyManagement';
import { PatientWorkflowManagement } from './PatientWorkflowManagement';
import { InventoryManagement } from './InventoryManagementNew';
import { 
  DepartmentManagement, 
  PayrollManagement, 
  AttendanceManagement, 
  RadiologyManagement, 
  OperationTheatreManagement, 
  BackupManagement, 
  ChangePassword 
} from './SuperAdminComponentsNew';
import { useThemeInitialization } from '../hooks/useThemeInitialization';

type TabType = 'dashboard' | 'patients' | 'search-patients' | 'appointments' | 'payments' | 'employee' | 'activity' | 'statistics' | 'help' | 'settings' | 'reports' | 'users' | 'doctors' | 'doctor-portal' | 'pharmacy' | 'laboratory' | 'nursing' | 'inventory' | 'front-office' | 'workflow' | 'super-admin' | 'outpatient' | 'inpatient' | 'lab-invoice' | 'lab-results' | 'test-queue' | 'specimen-tracking' | 'ai-assistant' | 'blood-bank' | 'medical-records' | 'bed-management' | 'emergency' | 'expense-management' | 'income-management' | 'vehicle-management' | 'complaint-management' | 'system-settings' | 'gynecology' | 'departments' | 'payroll' | 'attendance' | 'visitors' | 'queue-management' | 'pathology' | 'radiology' | 'ambulance' | 'operation-theatre' | 'billing' | 'workflows' | 'backup' | 'change-password';

interface MainAppProps {
  session: any;
  supabase: any;
}

export function MainApp({ session, supabase }: MainAppProps) {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [profileEditOpen, setProfileEditOpen] = useState(false);
  const [aiChatOpen, setAiChatOpen] = useState(false);

  // Initialize theme system
  useThemeInitialization();

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const userName = session?.user?.user_metadata?.name || 'User';
  const userRole = session?.user?.user_metadata?.role || 'user';
  const isAdmin = userRole === 'admin' || userRole === 'super_admin';
  const isSuperAdmin = userRole === 'super_admin';

  const hasAccess = (roles: string[]) => isSuperAdmin || roles.includes(userRole);

  const getPageRoles = (tab: TabType): string[] => {
    return regularMenuItems.find(m => m.id === tab)?.roles || [];
  };

  const renderPage = () => {
    const pageRoles = getPageRoles(activeTab);
    
    if (!hasAccess(pageRoles)) {
      return <AccessDenied userRole={userRole} requiredRoles={pageRoles} onGoBack={() => setActiveTab('dashboard')} />;
    }

    switch (activeTab) {
      case 'dashboard': 
        return isSuperAdmin ? <AdminDashboard session={session} /> : 
               userRole === 'receptionist' ? <ReceptionistDashboard session={session} /> : 
               userRole === 'lab_technician' ? <LabTechDashboard session={session} onNavigate={(tab) => setActiveTab(tab as TabType)} /> : 
               <NewDashboard session={session} />;
      case 'workflow': return <PatientWorkflowManagement session={session} />;
      case 'outpatient': return <OutpatientManagement session={session} />;
      case 'inpatient': return <InpatientManagement session={session} />;
      case 'front-office': return <FrontOffice session={session} />;
      case 'patients': return <PatientsPage session={session} />;
      case 'appointments': return <AppointmentsPage session={session} />;
      case 'payments': return <PaymentsPage session={session} />;
      case 'employee': return <EmployeePageNew session={session} />;
      case 'statistics': return <StatisticsPage session={session} />;
      case 'users': return <UserManagement session={session} />;
      case 'doctors': return <DoctorManagement />;
      case 'doctor-portal': return <DoctorPortal session={session} />;
      case 'pharmacy': return <PharmacyManagement />;
      case 'laboratory': return <LaboratoryManagement />;
      case 'nursing': return <NursingStation />;
      case 'inventory': return <InventoryManagement session={session} />;
      case 'activity': return <ActivityPage />;
      case 'help': return <HelpCenter />;
      case 'settings': return <SettingsPage />;
      case 'reports': return <ReportsPage />;
      case 'lab-invoice': return <LabInvoiceGenerator />;
      case 'lab-results': return <LabResultsEntry />;
      case 'test-queue': return <TestQueueManagement />;
      case 'specimen-tracking': return <SpecimenTracking />;
      case 'blood-bank': return <BloodBankManagement session={session} />;
      case 'medical-records': return <MedicalRecordsManagement session={session} />;
      case 'bed-management': return <BedManagement session={session} />;
      case 'emergency': return <EmergencyManagement session={session} />;
      case 'expense-management': return <ExpenseManagement session={session} />;
      case 'income-management': return <IncomeManagement session={session} />;
      case 'vehicle-management': return <VehicleManagement session={session} />;
      case 'complaint-management': return <ComplaintManagement session={session} />;
      case 'system-settings': return <SystemSettings session={session} />;
      default: return <NewDashboard session={session} />;
    }
  };

  const superAdminMenuItems = [
    // Core Dashboard
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, category: 'core' },
    
    // Patient Management (merged)
    { id: 'patients', label: 'Patient Records', icon: Users, category: 'patients' },
    { id: 'appointments', label: 'Appointments', icon: Calendar, category: 'patients' },
    { id: 'workflow', label: 'Patient Workflow', icon: Activity, category: 'patients' },
    
    // Staff Management (merged)
    { id: 'doctors', label: 'Doctors', icon: Stethoscope, category: 'staff' },
    { id: 'employee', label: 'Staff & HR', icon: UserCog, category: 'staff' },
    { id: 'departments', label: 'Departments', icon: Building, category: 'staff' },
    
    // Patient Care (merged)
    { id: 'inpatient', label: 'IPD Management', icon: Bed, category: 'care' },
    { id: 'outpatient', label: 'OPD Management', icon: User, category: 'care' },
    { id: 'emergency', label: 'Emergency', icon: ShieldAlert, category: 'care' },
    { id: 'bed-management', label: 'Bed & Queue', icon: Package, category: 'care' },
    
    // Medical Services (merged)
    { id: 'pharmacy', label: 'Pharmacy', icon: Pill, category: 'medical' },
    { id: 'laboratory', label: 'Lab & Pathology', icon: FlaskConical, category: 'medical' },
    { id: 'radiology', label: 'Radiology', icon: Zap, category: 'medical' },
    { id: 'blood-bank', label: 'Blood Bank', icon: Heart, category: 'medical' },
    { id: 'vehicle-management', label: 'Ambulance & Vehicles', icon: Car, category: 'medical' },
    { id: 'operation-theatre', label: 'Operation Theatre', icon: Activity, category: 'medical' },
    
    // Financial Management (merged)
    { id: 'payments', label: 'Billing & Payments', icon: CreditCard, category: 'finance' },
    { id: 'expense-management', label: 'Financial Reports', icon: TrendingUp, category: 'finance' },
    
    // System Administration (merged)
    { id: 'users', label: 'User Management', icon: Shield, category: 'admin' },
    { id: 'reports', label: 'Reports & Analytics', icon: FileText, category: 'admin' },
    { id: 'system-settings', label: 'System Settings', icon: Settings, category: 'admin' },
    { id: 'backup', label: 'Backup & Security', icon: Database, category: 'admin' },
  ];

  const regularMenuItems = [
    // Core Hospital Operations
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: ['user', 'doctor', 'nurse', 'pharmacist', 'lab_technician', 'receptionist', 'admin', 'super_admin'] },
    { id: 'emergency', label: 'Emergency', icon: ShieldAlert, roles: ['doctor', 'nurse', 'receptionist', 'admin', 'super_admin'] },
    { id: 'front-office', label: 'Front Office', icon: ClipboardList, roles: ['receptionist', 'admin', 'super_admin'] },
    
    // Patient Management
    { id: 'patients', label: 'Patients', icon: Users, roles: ['doctor', 'nurse', 'receptionist', 'admin', 'super_admin'] },
    { id: 'appointments', label: 'Appointments', icon: Calendar, roles: ['doctor', 'nurse', 'receptionist', 'admin', 'super_admin'] },
    { id: 'workflow', label: 'Patient Workflow', icon: Activity, roles: ['doctor', 'nurse', 'pharmacist', 'lab_technician', 'receptionist', 'admin', 'super_admin'] },
    { id: 'outpatient', label: 'Outpatient (OPD)', icon: User, roles: ['doctor', 'nurse', 'receptionist', 'admin', 'super_admin'] },
    { id: 'inpatient', label: 'Inpatient (IPD)', icon: Users, roles: ['doctor', 'nurse', 'admin', 'super_admin'] },
    
    // Medical Services
    { id: 'doctor-portal', label: 'Doctor Portal', icon: Stethoscope, roles: ['doctor', 'admin', 'super_admin'] },
    { id: 'nursing', label: 'Nursing Station', icon: Heart, roles: ['nurse', 'admin', 'super_admin'] },
    { id: 'pharmacy', label: 'Pharmacy', icon: Pill, roles: ['pharmacist', 'admin', 'super_admin'] },
    { id: 'laboratory', label: 'Laboratory', icon: FlaskConical, roles: ['lab_technician', 'doctor', 'admin', 'super_admin'] },
    { id: 'blood-bank', label: 'Blood Bank', icon: Heart, roles: ['lab_technician', 'doctor', 'nurse', 'admin', 'super_admin'] },
    { id: 'medical-records', label: 'Medical Records', icon: FileText, roles: ['doctor', 'nurse', 'admin', 'super_admin'] },
    
    // Hospital Resources
    { id: 'bed-management', label: 'Bed Management', icon: Package, roles: ['nurse', 'receptionist', 'admin', 'super_admin'] },
    { id: 'inventory', label: 'Inventory', icon: Package, roles: ['pharmacist', 'nurse', 'admin', 'super_admin'] },
    { id: 'vehicle-management', label: 'Ambulance & Vehicles', icon: Car, roles: ['admin', 'super_admin'] },
    
    // Financial Management
    { id: 'payments', label: 'Billing & Payments', icon: CreditCard, roles: ['receptionist', 'admin', 'super_admin'] },
    { id: 'expense-management', label: 'Expenses', icon: TrendingUp, roles: ['admin', 'super_admin'] },
    { id: 'income-management', label: 'Income', icon: TrendingUp, roles: ['admin', 'super_admin'] },
    
    // Staff Management
    { id: 'employee', label: 'Staff Management', icon: UserCog, roles: ['admin', 'super_admin'] },
    { id: 'users', label: 'User Accounts', icon: Shield, roles: ['admin', 'super_admin'] },
    
    // Reports & Analytics
    { id: 'statistics', label: 'Statistics', icon: BarChart3, roles: ['admin', 'super_admin'] },
    { id: 'reports', label: 'Reports', icon: FileText, roles: ['admin', 'super_admin'] },
    { id: 'activity', label: 'Activity Logs', icon: Activity, roles: ['admin', 'super_admin'] },
    
    // Support & Tools
    { id: 'ai-assistant', label: 'AI Assistant', icon: Bot, roles: ['user', 'doctor', 'nurse', 'pharmacist', 'lab_technician', 'receptionist', 'admin', 'super_admin'] },
    { id: 'complaint-management', label: 'Complaints', icon: MessageSquare, roles: ['admin', 'super_admin', 'receptionist'] },
    { id: 'help', label: 'Help Center', icon: HelpCircle, roles: ['user', 'doctor', 'nurse', 'pharmacist', 'lab_technician', 'receptionist', 'admin', 'super_admin'] },
    
    // System Administration
    { id: 'system-settings', label: 'System Settings', icon: Settings, roles: ['super_admin'] },
    { id: 'settings', label: 'General Settings', icon: Settings, roles: ['admin', 'super_admin'] },
  ];

  // Use single menu for all users
  const menuItems = isSuperAdmin ? superAdminMenuItems : regularMenuItems.filter((item) => item.roles.includes(userRole));

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="w-52 glass-sidebar text-white flex flex-col h-screen overflow-y-auto smooth-transition bg-gradient-to-b from-[#38bdf8] to-[#0ea5e9] dark:from-slate-800 dark:to-slate-900">
        {/* Logo */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/20 glass">
          <div className="flex items-center gap-2 text-white">
            <Activity className="size-6 text-white glow" />
            <span className="text-xl font-semibold text-white">SmartCare</span>
          </div>
        </div>

        {/* Main Menu */}
        <div className="flex-1 overflow-y-auto">
          <div className="px-4 py-6">
            {isSuperAdmin ? (
              // Super Admin Single Menu
              <>
                <p className="text-xs text-white/70 mb-3 px-2">HOSPITAL MANAGEMENT</p>
                <nav className="space-y-1">
                  {superAdminMenuItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;
                    return (
                      <motion.button
                        key={item.id}
                        whileHover={{ x: 4, scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setActiveTab(item.id as TabType)}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg smooth-transition glow-hover ${
                          isActive
                            ? 'glass-card text-white shadow-lg bg-white/20 dark:bg-slate-700/50'
                            : 'text-white/90 hover:glass hover:text-white hover:bg-white/10 dark:hover:bg-slate-700/30'
                        }`}
                      >
                        <Icon className="size-5" />
                        <span className="text-sm">{item.label}</span>
                      </motion.button>
                    );
                  })}
                </nav>
              </>
            ) : (
              // Regular User Menu
              <>
                <p className="text-xs text-white/70 mb-3 px-2">HOSPITAL MANAGEMENT</p>
                <nav className="space-y-1">
                  {menuItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;
                    return (
                      <motion.button
                        key={item.id}
                        whileHover={{ x: 4, scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setActiveTab(item.id as TabType)}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg smooth-transition glow-hover ${
                          isActive
                            ? 'glass-card text-white shadow-lg bg-white/20 dark:bg-slate-700/50'
                            : 'text-white/90 hover:glass hover:text-white hover:bg-white/10 dark:hover:bg-slate-700/30'
                        }`}
                      >
                        <Icon className="size-5" />
                        <span className="text-sm">{item.label}</span>
                      </motion.button>
                    );
                  })}
                </nav>
              </>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="glass-header px-8 py-4 smooth-transition">
          <div className="flex items-center justify-between">
            <div className="flex-1 max-w-xl">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground size-5" />
                <Input
                  type="search"
                  placeholder="Search here..."
                  className="pl-10 glass-input border-0 smooth-transition glow-hover"
                />
              </div>
            </div>

            <div className="flex items-center gap-4">
              <ThemeToggle />

              <Button
                variant="ghost"
                size="icon"
                onClick={() => setAiChatOpen(!aiChatOpen)}
                className="relative glass-button smooth-transition"
                title="AI Assistant"
              >
                <Bot className="size-5" />
                {!aiChatOpen && (
                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-[#38bdf8] rounded-full animate-pulse glow" />
                )}
              </Button>

              <NotificationsPanel />

              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-sm text-foreground">{userName}</p>
                  <span className={`text-xs px-2 py-0.5 rounded-full glass smooth-transition ${
                    userRole === 'super_admin' 
                      ? 'bg-destructive/10 text-destructive' 
                      : userRole === 'admin'
                      ? 'bg-warning/10 text-warning'
                      : 'bg-[#38bdf8]/10 text-[#38bdf8]'
                  }`}>
                    {userRole === 'super_admin' ? 'Super Admin' 
                      : userRole === 'admin' ? 'Admin'
                      : userRole === 'doctor' ? 'Doctor'
                      : userRole === 'nurse' ? 'Nurse'
                      : userRole === 'pharmacist' ? 'Pharmacist'
                      : userRole === 'lab_technician' ? 'Lab Technician'
                      : userRole === 'receptionist' ? 'Receptionist'
                      : 'User'}
                  </span>
                </div>
                <button
                  onClick={() => setProfileEditOpen(true)}
                  className="w-10 h-10 bg-[#38bdf8] rounded-full flex items-center justify-center text-white hover:bg-[#0ea5e9] smooth-transition cursor-pointer glow-hover float"
                  title="Edit Profile"
                >
                  {userName.charAt(0).toUpperCase()}
                </button>
                <button
                  onClick={handleLogout}
                  className="p-2 hover:bg-muted rounded-lg smooth-transition glass-button"
                  title="Logout"
                >
                  <LogOut className="size-4 text-muted-foreground" />
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-8 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-slate-900 dark:to-slate-800">
          {renderPage()}
        </main>
      </div>

      {/* Profile Edit Dialog */}
      <ProfileEdit
        open={profileEditOpen}
        onClose={() => setProfileEditOpen(false)}
        session={session}
        supabase={supabase}
      />

      {/* Floating AI Assistant */}
      <FloatingAIButton currentPage={activeTab} userRole={userRole} />

      {/* Navbar AI Chat */}
      <NavbarAIChat 
        session={session} 
        isOpen={aiChatOpen} 
        onClose={() => setAiChatOpen(false)} 
      />
    </div>
  );
}