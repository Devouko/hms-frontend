import { useState } from 'react';
import { motion } from 'motion/react';
import {
  FlaskConical,
  FileText,
  Clock,
  CheckCircle2,
  AlertCircle,
  Settings,
  Activity,
  Beaker,
  ClipboardList,
  Package,
  Shield,
  User,
  Calendar,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Label } from './ui/label';
import { toast } from 'sonner';

interface LabTest {
  id: string;
  patientName: string;
  testType: string;
  priority: 'routine' | 'urgent' | 'stat';
  status: 'pending' | 'in-progress' | 'completed';
  orderedDate: string;
  category: string;
}

interface Equipment {
  id: string;
  name: string;
  status: 'online' | 'offline' | 'maintenance';
  lastMaintenance: string;
}

export function LaboratoryManagement() {
  const [tests] = useState<LabTest[]>([
    { id: '1', patientName: 'John Smith', testType: 'CBC', priority: 'stat', status: 'pending', orderedDate: '2024-12-08', category: 'Hematology' },
    { id: '2', patientName: 'Emily Davis', testType: 'Lipid Panel', priority: 'routine', status: 'in-progress', orderedDate: '2024-12-08', category: 'Chemistry' },
    { id: '3', patientName: 'Michael Brown', testType: 'Cardiac Enzymes', priority: 'urgent', status: 'pending', orderedDate: '2024-12-08', category: 'Chemistry' },
  ]);

  const [equipment] = useState<Equipment[]>([
    { id: '1', name: 'Hematology Analyzer', status: 'online', lastMaintenance: '2024-12-01' },
    { id: '2', name: 'Chemistry Analyzer', status: 'online', lastMaintenance: '2024-11-28' },
    { id: '3', name: 'Microscope #1', status: 'maintenance', lastMaintenance: '2024-12-07' },
  ]);

  const [resultForm, setResultForm] = useState({ testId: '', result: '', criticalFlag: false });

  const todayStats = {
    pending: tests.filter(t => t.status === 'pending').length,
    inProgress: tests.filter(t => t.status === 'in-progress').length,
    completed: tests.filter(t => t.status === 'completed').length,
    urgent: tests.filter(t => t.priority === 'urgent' || t.priority === 'stat').length,
  };

  const recentActivity = [
    { id: '1', action: 'CBC completed for John Smith', time: '10:30 AM', status: 'completed' },
    { id: '2', action: 'Lipid Panel started for Emily Davis', time: '10:15 AM', status: 'in-progress' },
    { id: '3', action: 'Cardiac Enzymes pending approval', time: '09:45 AM', status: 'pending' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl text-gray-900">Laboratory Dashboard</h1>
        <p className="text-gray-600">Lab technician workspace</p>
      </div>

      <div className="grid grid-cols-5 gap-6">
        {/* LEFT COLUMN (40%) */}
        <div className="col-span-2 space-y-6">
          {/* Today's Lab Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <FlaskConical className="size-5 text-primary" />
                Today's Lab Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-3">
                <div className="text-center p-3 bg-yellow-50 rounded-lg">
                  <div className="text-2xl text-yellow-600">{todayStats.pending}</div>
                  <div className="text-xs text-gray-600">Pending</div>
                </div>
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <div className="text-2xl text-blue-600">{todayStats.inProgress}</div>
                  <div className="text-xs text-gray-600">In Progress</div>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <div className="text-2xl text-green-600">{todayStats.completed}</div>
                  <div className="text-xs text-gray-600">Completed</div>
                </div>
              </div>
              {todayStats.urgent > 0 && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="size-4 text-red-600" />
                    <span className="text-sm text-red-700">{todayStats.urgent} Urgent Tests</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Equipment Status */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Settings className="size-5 text-primary" />
                Equipment Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {equipment.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm text-gray-900">{item.name}</p>
                    <p className="text-xs text-gray-600">Last: {item.lastMaintenance}</p>
                  </div>
                  <Badge className={`${
                    item.status === 'online' ? 'bg-green-100 text-green-700' :
                    item.status === 'offline' ? 'bg-red-100 text-red-700' :
                    'bg-yellow-100 text-yellow-700'
                  }`}>
                    {item.status}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Activity className="size-5 text-primary" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button onClick={() => toast.success('Result entry opened!')} className="w-full justify-start">
                <Beaker className="size-4 mr-2" />
                Result Entry
              </Button>
              <Button onClick={() => toast.success('Inventory check initiated!')} variant="outline" className="w-full justify-start">
                <Package className="size-4 mr-2" />
                Inventory Check
              </Button>
              <Button onClick={() => toast.success('QC procedures started!')} variant="outline" className="w-full justify-start">
                <Shield className="size-4 mr-2" />
                QC Procedures
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* RIGHT COLUMN (60%) */}
        <div className="col-span-3 space-y-6">
          {/* Lab Test Queue */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <ClipboardList className="size-5 text-primary" />
                Lab Test Queue
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {tests.map((test) => (
                <div key={test.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm text-gray-900">{test.patientName}</p>
                      <Badge className={`text-xs ${
                        test.priority === 'stat' ? 'bg-red-100 text-red-700' :
                        test.priority === 'urgent' ? 'bg-orange-100 text-orange-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {test.priority.toUpperCase()}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-600">{test.testType} • {test.category}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={`text-xs ${
                      test.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                      test.status === 'in-progress' ? 'bg-blue-100 text-blue-700' :
                      'bg-green-100 text-green-700'
                    }`}>
                      {test.status}
                    </Badge>
                    <Button size="sm" onClick={() => toast.success(`Assigned ${test.testType} to technician!`)}>
                      Assign
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Test Results Entry */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <FileText className="size-5 text-primary" />
                Test Results Entry
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Test ID</Label>
                  <Input
                    value={resultForm.testId}
                    onChange={(e) => setResultForm({ ...resultForm, testId: e.target.value })}
                    placeholder="Enter test ID"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Result Value</Label>
                  <Input
                    value={resultForm.result}
                    onChange={(e) => setResultForm({ ...resultForm, result: e.target.value })}
                    placeholder="Enter result"
                  />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={resultForm.criticalFlag}
                  onChange={(e) => setResultForm({ ...resultForm, criticalFlag: e.target.checked })}
                />
                <Label className="text-sm">Critical Value Flag</Label>
              </div>
              <Button onClick={() => {
                toast.success('Test result submitted successfully!');
                setResultForm({ testId: '', result: '', criticalFlag: false });
              }}>
                Submit Result
              </Button>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Clock className="size-5 text-primary" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm text-gray-900">{activity.action}</p>
                    <p className="text-xs text-gray-600">{activity.time}</p>
                  </div>
                  <Badge className={`text-xs ${
                    activity.status === 'completed' ? 'bg-green-100 text-green-700' :
                    activity.status === 'in-progress' ? 'bg-blue-100 text-blue-700' :
                    'bg-yellow-100 text-yellow-700'
                  }`}>
                    {activity.status}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}