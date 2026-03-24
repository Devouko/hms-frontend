import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { 
  Users, 
  UserPlus, 
  Bed, 
  Pill, 
  TestTube, 
  Zap, 
  Scissors, 
  Droplets, 
  Shield, 
  DollarSign, 
  Truck, 
  Baby, 
  UserCheck, 
  MessageSquare, 
  Download, 
  Package, 
  Globe, 
  BarChart3, 
  Bell, 
  Calendar,
  Settings,
  Building
} from 'lucide-react';

interface HospitalModule {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  status: 'implemented' | 'partial' | 'planned';
  features: string[];
  color: string;
}

const hospitalModules: HospitalModule[] = [
  {
    id: 'front-office',
    title: 'Front Office',
    description: 'OPD appointments, reception activities, enquiries, calls, visitors, postal services',
    icon: Building,
    status: 'partial',
    features: ['Appointments', 'Visitor Book', 'Phone Call Log', 'Postal Receive/Dispatch', 'Complaints'],
    color: 'bg-blue-500'
  },
  {
    id: 'opd',
    title: 'OPD - Out Patient',
    description: 'OPD patient registration, visits, revisits, old OPD patients management',
    icon: UserPlus,
    status: 'planned',
    features: ['Patient Registration', 'Visits & Revisits', 'Prescriptions', 'Diagnosis', 'Timeline'],
    color: 'bg-green-500'
  },
  {
    id: 'ipd',
    title: 'IPD - In Patient',
    description: 'IPD patients admission, consultant register, diagnosis, timeline, charges, payments, bills',
    icon: Bed,
    status: 'planned',
    features: ['Patient Admission', 'Consultant Register', 'Diagnosis', 'Charges & Payments', 'Discharge'],
    color: 'bg-purple-500'
  },
  {
    id: 'pharmacy',
    title: 'Pharmacy',
    description: 'Medicine list, stock management, and pharmacy bills',
    icon: Pill,
    status: 'partial',
    features: ['Medicine Management', 'Stock Control', 'Purchase Orders', 'Sales & Billing', 'Expiry Tracking'],
    color: 'bg-red-500'
  },
  {
    id: 'pathology',
    title: 'Pathology',
    description: 'Pathology test details and patient test records management',
    icon: TestTube,
    status: 'partial',
    features: ['Test Categories', 'Patient Tests', 'Reports', 'Lab Management', 'Result Entry'],
    color: 'bg-orange-500'
  },
  {
    id: 'radiology',
    title: 'Radiology',
    description: 'Radiology test details and patient test records management',
    icon: Zap,
    status: 'partial',
    features: ['Imaging Tests', 'Patient Records', 'Reports', 'Equipment Management', 'Result Entry'],
    color: 'bg-cyan-500'
  },
  {
    id: 'operation-theatre',
    title: 'Operation Theatre',
    description: 'Patient operation activities and operation records management',
    icon: Scissors,
    status: 'planned',
    features: ['Surgery Scheduling', 'OT Management', 'Patient Records', 'Staff Assignment', 'Equipment Tracking'],
    color: 'bg-indigo-500'
  },
  {
    id: 'blood-bank',
    title: 'Blood Bank',
    description: 'Blood group stock, donor details and blood issue management',
    icon: Droplets,
    status: 'planned',
    features: ['Blood Stock', 'Donor Management', 'Blood Issue', 'Compatibility Testing', 'Inventory'],
    color: 'bg-red-600'
  },
  {
    id: 'tpa',
    title: 'TPA Management',
    description: 'Third Party Administrator for insurance and mediclaim companies',
    icon: Shield,
    status: 'planned',
    features: ['Insurance Companies', 'Policy Management', 'Claims Processing', 'Approvals', 'Settlements'],
    color: 'bg-emerald-500'
  },
  {
    id: 'finance',
    title: 'Finance',
    description: 'General income and expense management',
    icon: DollarSign,
    status: 'implemented',
    features: ['Income Management', 'Expense Tracking', 'Financial Reports', 'Budget Planning', 'Accounting'],
    color: 'bg-yellow-500'
  },
  {
    id: 'ambulance',
    title: 'Ambulance',
    description: 'Ambulance vehicles and ambulance call details management',
    icon: Truck,
    status: 'planned',
    features: ['Vehicle Management', 'Call Logging', 'Driver Assignment', 'Route Tracking', 'Billing'],
    color: 'bg-blue-600'
  },
  {
    id: 'birth-death',
    title: 'Birth & Death Record',
    description: 'Newly born babies birth and patients death records management',
    icon: Baby,
    status: 'implemented',
    features: ['Birth Certificates', 'Death Certificates', 'Custom Fields', 'Report Generation', 'Legal Documentation'],
    color: 'bg-pink-500'
  },
  {
    id: 'hr',
    title: 'Human Resource',
    description: 'Staff information, attendance, payroll, leaves management',
    icon: UserCheck,
    status: 'implemented',
    features: ['Staff Directory', 'Attendance', 'Payroll', 'Leave Management', 'Performance'],
    color: 'bg-violet-500'
  },
  {
    id: 'messaging',
    title: 'Messaging',
    description: 'Notice board and messaging system for communication',
    icon: MessageSquare,
    status: 'planned',
    features: ['Notice Board', 'SMS/Email', 'Group Messaging', 'Notifications', 'Announcements'],
    color: 'bg-teal-500'
  },
  {
    id: 'download-center',
    title: 'Download Center',
    description: 'Downloadable documents distribution to staff',
    icon: Download,
    status: 'planned',
    features: ['Document Upload', 'Access Control', 'Version Management', 'Download Tracking', 'Categories'],
    color: 'bg-slate-500'
  },
  {
    id: 'inventory',
    title: 'Inventory',
    description: 'Hospital assets management with stocks and stores',
    icon: Package,
    status: 'implemented',
    features: ['Asset Management', 'Stock Control', 'Issue/Return', 'Suppliers', 'Categories'],
    color: 'bg-amber-500'
  },
  {
    id: 'front-cms',
    title: 'Front CMS',
    description: 'Hospital front website management with pages, menus, events, gallery',
    icon: Globe,
    status: 'planned',
    features: ['Website Pages', 'Menu Management', 'Events', 'Gallery', 'News & Updates'],
    color: 'bg-rose-500'
  },
  {
    id: 'reports',
    title: 'Reports',
    description: 'Various reports related to different modules',
    icon: BarChart3,
    status: 'planned',
    features: ['Financial Reports', 'Patient Reports', 'Staff Reports', 'Inventory Reports', 'Custom Reports'],
    color: 'bg-lime-500'
  },
  {
    id: 'notifications',
    title: 'Notifications',
    description: 'Automated notifications for different events',
    icon: Bell,
    status: 'planned',
    features: ['Event Notifications', 'SMS Alerts', 'Email Notifications', 'Push Notifications', 'Custom Alerts'],
    color: 'bg-sky-500'
  },
  {
    id: 'calendar',
    title: 'Calendar & ToDo List',
    description: 'Track daily/monthly activities and task management',
    icon: Calendar,
    status: 'planned',
    features: ['Event Calendar', 'Task Management', 'Reminders', 'Scheduling', 'Team Calendar'],
    color: 'bg-fuchsia-500'
  },
  {
    id: 'setup',
    title: 'Setup',
    description: 'Hospital configuration settings and master data entry',
    icon: Settings,
    status: 'implemented',
    features: ['System Settings', 'Master Data', 'User Management', 'Permissions', 'Configurations'],
    color: 'bg-gray-500'
  }
];

export default function HospitalModulesOverview() {
  const implementedCount = hospitalModules.filter(m => m.status === 'implemented').length;
  const partialCount = hospitalModules.filter(m => m.status === 'partial').length;
  const plannedCount = hospitalModules.filter(m => m.status === 'planned').length;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'implemented':
        return <Badge className="bg-green-100 text-green-800">Implemented</Badge>;
      case 'partial':
        return <Badge className="bg-yellow-100 text-yellow-800">Partial</Badge>;
      case 'planned':
        return <Badge className="bg-gray-100 text-gray-800">Planned</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold mb-2">Hospital Management System</h2>
        <p className="text-gray-600 mb-6">
          Comprehensive hospital management with 22 integrated modules covering all aspects of hospital operations.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardContent className="flex items-center p-6">
              <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                <div className="h-4 w-4 bg-green-600 rounded-full"></div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Implemented</p>
                <p className="text-2xl font-bold text-green-600">{implementedCount}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center p-6">
              <div className="h-8 w-8 bg-yellow-100 rounded-full flex items-center justify-center">
                <div className="h-4 w-4 bg-yellow-600 rounded-full"></div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Partial</p>
                <p className="text-2xl font-bold text-yellow-600">{partialCount}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center p-6">
              <div className="h-8 w-8 bg-gray-100 rounded-full flex items-center justify-center">
                <div className="h-4 w-4 bg-gray-600 rounded-full"></div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Planned</p>
                <p className="text-2xl font-bold text-gray-600">{plannedCount}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {hospitalModules.map((module) => {
          const Icon = module.icon;
          return (
            <Card key={module.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className={`p-2 rounded-lg ${module.color} text-white`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-lg">{module.title}</span>
                  </div>
                  {getStatusBadge(module.status)}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">{module.description}</p>
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Key Features:</h4>
                  <ul className="text-xs text-gray-500 space-y-1">
                    {module.features.map((feature, index) => (
                      <li key={index} className="flex items-center">
                        <div className="w-1 h-1 bg-gray-400 rounded-full mr-2"></div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>System Capabilities</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-3">Patient Management</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Complete patient lifecycle management</li>
                <li>• OPD and IPD patient handling</li>
                <li>• Medical records and history</li>
                <li>• Appointment scheduling</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Clinical Operations</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Laboratory and radiology management</li>
                <li>• Pharmacy and inventory control</li>
                <li>• Operation theatre scheduling</li>
                <li>• Blood bank management</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Administrative</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Human resource management</li>
                <li>• Financial management</li>
                <li>• Billing and insurance</li>
                <li>• Reporting and analytics</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Communication</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Messaging and notifications</li>
                <li>• Patient portal</li>
                <li>• Staff communication</li>
                <li>• Document management</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
