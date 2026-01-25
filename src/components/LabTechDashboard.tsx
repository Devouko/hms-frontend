import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  Activity,
  FileText,
  DollarSign,
  FlaskConical,
  ClipboardList,
  Beaker,
  AlertCircle,
  CheckCircle,
  Clock,
  ArrowRight,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { toast } from 'sonner';

interface LabTechDashboardProps {
  session: any;
  onNavigate?: (tab: string) => void;
}

export function LabTechDashboard({ session, onNavigate }: LabTechDashboardProps) {
  const userName = session?.user?.user_metadata?.name || 'Lab Technician';

  // Lab-specific statistics
  const labStats = [
    {
      label: 'Lab Tests Today',
      value: 45,
      change: '+8 from yesterday',
      icon: FlaskConical,
      color: 'from-blue-500 to-blue-600',
    },
    {
      label: 'Pending Tests',
      value: 12,
      change: 'Awaiting processing',
      icon: Clock,
      color: 'from-yellow-500 to-yellow-600',
    },
    {
      label: 'Completed Tests',
      value: 33,
      change: 'Ready for review',
      icon: CheckCircle,
      color: 'from-green-500 to-green-600',
    },
    {
      label: 'Urgent/Critical Results',
      value: 3,
      change: 'Requires immediate attention',
      icon: AlertCircle,
      color: 'from-red-500 to-red-600',
    },
  ];

  // Lab-specific quick actions
  const labActions = [
    {
      title: 'Generate Invoice',
      description: 'Create billing for lab tests',
      icon: FileText,
      color: 'bg-purple-500',
      action: () => onNavigate ? onNavigate('lab-invoice') : toast.success('Lab invoice generator opened!'),
    },
    {
      title: 'Lab Results Entry',
      description: 'Enter test results',
      icon: Beaker,
      color: 'bg-blue-500',
      action: () => onNavigate ? onNavigate('lab-results') : toast.success('Lab results entry opened!'),
    },
    {
      title: 'Test Queue Management',
      description: 'Manage test queue',
      icon: ClipboardList,
      color: 'bg-green-500',
      action: () => onNavigate ? onNavigate('test-queue') : toast.success('Test queue management opened!'),
    },
    {
      title: 'Specimen Tracking',
      description: 'Track specimen status',
      icon: FlaskConical,
      color: 'bg-orange-500',
      action: () => onNavigate ? onNavigate('specimen-tracking') : toast.success('Specimen tracking opened!'),
    },
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
          Here's your lab workload and test status overview
        </p>
      </motion.div>

      {/* Lab Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {labStats.map((stat, index) => {
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
                    <div className="flex items-end justify-between">
                      <h3 className="text-gray-900">{stat.value}</h3>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{stat.change}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Patient Workflow Status - Lab Focus */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Patient Workflow Status - Lab Focus</CardTitle>
                <p className="text-sm text-gray-600 mt-1">Track patients requiring lab work</p>
              </div>
              <Activity className="size-5 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-yellow-50 rounded-lg">
                <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Activity className="size-6 text-white" />
                </div>
                <p className="text-2xl text-yellow-600 mb-1">5</p>
                <p className="text-xs text-gray-600">In Consultation</p>
                <p className="text-xs text-gray-500 mt-1">Patients being examined</p>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-2">
                  <FlaskConical className="size-6 text-white" />
                </div>
                <p className="text-2xl text-purple-600 mb-1">12</p>
                <p className="text-xs text-gray-600">Lab/Pharmacy</p>
                <p className="text-xs text-gray-500 mt-1">YOUR MAIN AREA</p>
              </div>
              <div className="text-center p-4 bg-teal-50 rounded-lg">
                <div className="w-12 h-12 bg-teal-500 rounded-full flex items-center justify-center mx-auto mb-2">
                  <CheckCircle className="size-6 text-white" />
                </div>
                <p className="text-2xl text-teal-600 mb-1">33</p>
                <p className="text-xs text-gray-600">Completed</p>
                <p className="text-xs text-gray-500 mt-1">Finished lab tests</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Lab Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Lab Quick Actions</CardTitle>
                <p className="text-sm text-gray-600 mt-1">Essential lab operations for faster workflow</p>
              </div>
              <FlaskConical className="size-5 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {labActions.map((item, index) => {
                const Icon = item.icon;
                return (
                  <motion.button
                    key={item.title}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + index * 0.05 }}
                    onClick={item.action}
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
    </div>
  );
}