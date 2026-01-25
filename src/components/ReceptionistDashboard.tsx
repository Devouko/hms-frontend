import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  Calendar as CalendarIcon,
  Users,
  UserPlus,
  CalendarPlus,
  FileText,
  DollarSign,
  ClipboardList,
  UserCheck,
  Activity,
  ArrowRight,
  Clock,
  Phone,
  MessageSquare,
  Bell,
  Search,
  MapPin,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';

interface ReceptionistDashboardProps {
  session: any;
}

export function ReceptionistDashboard({ session }: ReceptionistDashboardProps) {
  const userName = session?.user?.user_metadata?.name || 'Receptionist';

  // Today's overview stats for receptionist
  const todayStats = [
    {
      label: "Today's Registrations",
      value: 24,
      icon: UserPlus,
      color: 'from-blue-500 to-blue-600',
    },
    {
      label: "Today's Appointments",
      value: 18,
      icon: CalendarIcon,
      color: 'from-green-500 to-green-600',
    },
    {
      label: 'Current Patients',
      value: 42,
      icon: Users,
      color: 'from-purple-500 to-purple-600',
    },
    {
      label: 'Emergency Arrivals',
      value: 3,
      icon: Activity,
      color: 'from-red-500 to-red-600',
    },
  ];

  // Front office quick actions
  const frontOfficeActions = [
    {
      title: 'Patient Registration',
      description: 'Register new patients',
      icon: UserPlus,
      color: 'bg-blue-500',
      action: 'register',
    },
    {
      title: 'New Appointment',
      description: 'Schedule appointments',
      icon: CalendarPlus,
      color: 'bg-green-500',
      action: 'appointment',
    },
    {
      title: 'Generate Invoice',
      description: 'Create billing invoice',
      icon: FileText,
      color: 'bg-purple-500',
      action: 'invoice',
    },
    {
      title: 'Admit Patient',
      description: 'Patient admission process',
      icon: UserCheck,
      color: 'bg-orange-500',
      action: 'admit',
    },
    {
      title: 'OPD Queue',
      description: 'Outpatient department',
      icon: ClipboardList,
      color: 'bg-pink-500',
      action: 'opd',
    },
    {
      title: 'Billing Center',
      description: 'Payment & transactions',
      icon: DollarSign,
      color: 'bg-teal-500',
      action: 'billing',
    },
  ];

  // OPD Queue status
  const queueStatus = [
    { department: 'Cardiology', waiting: 8, avgWait: '25 min' },
    { department: 'Neurology', waiting: 5, avgWait: '15 min' },
    { department: 'Pediatrics', waiting: 12, avgWait: '30 min' },
    { department: 'Orthopedics', waiting: 6, avgWait: '20 min' },
  ];

  // Today's appointments
  const todayAppointments = [
    { time: '09:00', patient: 'John Smith', doctor: 'Dr. Johnson', department: 'Cardiology', status: 'Confirmed' },
    { time: '09:30', patient: 'Sarah Wilson', doctor: 'Dr. Chen', department: 'Neurology', status: 'Waiting' },
    { time: '10:00', patient: 'Mike Brown', doctor: 'Dr. Davis', department: 'Pediatrics', status: 'In Progress' },
    { time: '10:30', patient: 'Lisa Garcia', doctor: 'Dr. Johnson', department: 'Cardiology', status: 'Confirmed' },
    { time: '11:00', patient: 'David Lee', doctor: 'Dr. Wilson', department: 'Orthopedics', status: 'Confirmed' },
  ];

  // Visitor management
  const recentVisitors = [
    { name: 'Robert Johnson', visiting: 'John Smith (Room 205)', time: '10:30 AM', status: 'Active' },
    { name: 'Mary Davis', visiting: 'Sarah Wilson (ICU)', time: '11:15 AM', status: 'Active' },
    { name: 'James Wilson', visiting: 'Mike Brown (Room 312)', time: '09:45 AM', status: 'Completed' },
  ];

  return (
    <div className="space-y-6">
      {/* Greeting */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-gray-900">Hello, {userName} 👋</h1>
        <p className="text-gray-600 text-sm mt-1">
          Welcome to your reception desk. Here's today's overview and quick actions.
        </p>
      </motion.div>

      {/* Today's Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {todayStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`bg-gradient-to-br ${stat.color} p-3 rounded-xl`}>
                      <Icon className="size-6 text-white" />
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                    <h3 className="text-gray-900">{stat.value}</h3>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Patient Workflow Status */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Patient Workflow Status</CardTitle>
                <p className="text-sm text-gray-600 mt-1">Real-time patient journey tracking</p>
              </div>
              <Activity className="size-5 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-2">
                  <UserPlus className="size-6 text-white" />
                </div>
                <p className="text-2xl text-blue-600 mb-1">12</p>
                <p className="text-xs text-gray-600">Registered</p>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-2">
                  <CalendarIcon className="size-6 text-white" />
                </div>
                <p className="text-2xl text-green-600 mb-1">8</p>
                <p className="text-xs text-gray-600">In Queue</p>
              </div>
              <div className="text-center p-4 bg-yellow-50 rounded-lg">
                <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Activity className="size-6 text-white" />
                </div>
                <p className="text-2xl text-yellow-600 mb-1">5</p>
                <p className="text-xs text-gray-600">In Consultation</p>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-2">
                  <FileText className="size-6 text-white" />
                </div>
                <p className="text-2xl text-purple-600 mb-1">3</p>
                <p className="text-xs text-gray-600">Lab/Pharmacy</p>
              </div>
              <div className="text-center p-4 bg-teal-50 rounded-lg">
                <div className="w-12 h-12 bg-teal-500 rounded-full flex items-center justify-center mx-auto mb-2">
                  <DollarSign className="size-6 text-white" />
                </div>
                <p className="text-2xl text-teal-600 mb-1">15</p>
                <p className="text-xs text-gray-600">Completed</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Front Office Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Front Office - Quick Actions</CardTitle>
                <p className="text-sm text-gray-600 mt-1">Common reception operations for faster workflow</p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {frontOfficeActions.map((item, index) => {
                const Icon = item.icon;
                return (
                  <motion.button
                    key={item.action}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + index * 0.05 }}
                    className="flex items-start gap-4 p-4 bg-white border border-gray-200 rounded-xl hover:border-primary hover:shadow-md transition-all group"
                  >
                    <div className={`${item.color} p-3 rounded-lg text-white`}>
                      <Icon className="size-6" />
                    </div>
                    <div className="flex-1 text-left">
                      <h4 className="text-sm text-gray-900 mb-1 group-hover:text-primary transition-colors">{item.title}</h4>
                      <p className="text-xs text-gray-600">{item.description}</p>
                    </div>
                    <ArrowRight className="size-4 text-gray-400 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                  </motion.button>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* OPD Queue Management */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>OPD Queue Status</CardTitle>
              <p className="text-sm text-gray-600">Current waiting patients by department</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {queueStatus.map((queue, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-sm text-gray-900">{queue.department}</p>
                      <p className="text-xs text-gray-600">Avg wait: {queue.avgWait}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg text-primary">{queue.waiting}</p>
                      <p className="text-xs text-gray-600">waiting</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Today's Appointments */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Today's Appointments</CardTitle>
              <p className="text-sm text-gray-600">Scheduled appointments for today</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {todayAppointments.map((apt, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="text-sm text-gray-600 w-16">{apt.time}</div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-900">{apt.patient}</p>
                      <p className="text-xs text-gray-600">{apt.doctor} • {apt.department}</p>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs ${
                      apt.status === 'Confirmed' ? 'bg-green-100 text-green-700' :
                      apt.status === 'Waiting' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-blue-100 text-blue-700'
                    }`}>
                      {apt.status}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Patient Search & Lookup */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Patient Search & Lookup</CardTitle>
              <p className="text-sm text-gray-600">Quick patient information access</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 size-4" />
                  <Input
                    placeholder="Search by name, phone, or patient ID..."
                    className="pl-10"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <Button variant="outline" className="justify-start">
                    <Phone className="size-4 mr-2" />
                    Call Patient
                  </Button>
                  <Button variant="outline" className="justify-start">
                    <MessageSquare className="size-4 mr-2" />
                    Send SMS
                  </Button>
                  <Button variant="outline" className="justify-start">
                    <MapPin className="size-4 mr-2" />
                    Patient Location
                  </Button>
                  <Button variant="outline" className="justify-start">
                    <Bell className="size-4 mr-2" />
                    Notifications
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Visitor Management */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Visitor Management</CardTitle>
                  <p className="text-sm text-gray-600">Recent visitor registrations</p>
                </div>
                <Button size="sm">
                  <UserPlus className="size-4 mr-2" />
                  Register Visitor
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentVisitors.map((visitor, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-sm text-gray-900">{visitor.name}</p>
                      <p className="text-xs text-gray-600">Visiting: {visitor.visiting}</p>
                      <p className="text-xs text-gray-500">{visitor.time}</p>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs ${
                      visitor.status === 'Active' 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-gray-100 text-gray-700'
                    }`}>
                      {visitor.status}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}