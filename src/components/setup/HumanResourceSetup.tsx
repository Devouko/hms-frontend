import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Label } from '../ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Trash2, Edit, Plus, Search, Calendar, Building2, UserCog } from 'lucide-react';

interface LeaveType {
  id: string;
  type: string;
  isActive: boolean;
  createdAt: string;
}

interface Department {
  id: string;
  departmentName: string;
  isActive: boolean;
  createdAt: string;
}

interface Designation {
  id: string;
  name: string;
  isActive: boolean;
  createdAt: string;
}

export default function HumanResourceSetup() {
  const [leaveTypes, setLeaveTypes] = useState<LeaveType[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [designations, setDesignations] = useState<Designation[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('leaves');

  const [isLeaveDialogOpen, setIsLeaveDialogOpen] = useState(false);
  const [isDeptDialogOpen, setIsDeptDialogOpen] = useState(false);
  const [isDesigDialogOpen, setIsDesigDialogOpen] = useState(false);

  const [editingLeave, setEditingLeave] = useState<LeaveType | null>(null);
  const [editingDept, setEditingDept] = useState<Department | null>(null);
  const [editingDesig, setEditingDesig] = useState<Designation | null>(null);

  const [leaveForm, setLeaveForm] = useState({ type: '' });
  const [deptForm, setDeptForm] = useState({ departmentName: '' });
  const [desigForm, setDesigForm] = useState({ name: '' });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    try {
      const savedLeaves = localStorage.getItem('leave_types');
      const savedDepts = localStorage.getItem('departments');
      const savedDesigs = localStorage.getItem('designations');

      if (savedLeaves) {
        setLeaveTypes(JSON.parse(savedLeaves));
      } else {
        const defaultLeaves: LeaveType[] = [
          { id: '1', type: 'Sick Leave', isActive: true, createdAt: new Date().toISOString() },
          { id: '2', type: 'Casual Leave', isActive: true, createdAt: new Date().toISOString() },
          { id: '3', type: 'Annual Leave', isActive: true, createdAt: new Date().toISOString() },
          { id: '4', type: 'Maternity Leave', isActive: true, createdAt: new Date().toISOString() },
          { id: '5', type: 'Emergency Leave', isActive: true, createdAt: new Date().toISOString() }
        ];
        setLeaveTypes(defaultLeaves);
        localStorage.setItem('leave_types', JSON.stringify(defaultLeaves));
      }

      if (savedDepts) {
        setDepartments(JSON.parse(savedDepts));
      } else {
        const defaultDepts: Department[] = [
          { id: '1', departmentName: 'Cardiology', isActive: true, createdAt: new Date().toISOString() },
          { id: '2', departmentName: 'Neurology', isActive: true, createdAt: new Date().toISOString() },
          { id: '3', departmentName: 'Orthopedics', isActive: true, createdAt: new Date().toISOString() },
          { id: '4', departmentName: 'Pediatrics', isActive: true, createdAt: new Date().toISOString() },
          { id: '5', departmentName: 'Emergency', isActive: true, createdAt: new Date().toISOString() },
          { id: '6', departmentName: 'Administration', isActive: true, createdAt: new Date().toISOString() }
        ];
        setDepartments(defaultDepts);
        localStorage.setItem('departments', JSON.stringify(defaultDepts));
      }

      if (savedDesigs) {
        setDesignations(JSON.parse(savedDesigs));
      } else {
        const defaultDesigs: Designation[] = [
          { id: '1', name: 'Chief Medical Officer', isActive: true, createdAt: new Date().toISOString() },
          { id: '2', name: 'Senior Consultant', isActive: true, createdAt: new Date().toISOString() },
          { id: '3', name: 'Junior Doctor', isActive: true, createdAt: new Date().toISOString() },
          { id: '4', name: 'Staff Nurse', isActive: true, createdAt: new Date().toISOString() },
          { id: '5', name: 'Pharmacist', isActive: true, createdAt: new Date().toISOString() },
          { id: '6', name: 'Lab Technician', isActive: true, createdAt: new Date().toISOString() },
          { id: '7', name: 'Receptionist', isActive: true, createdAt: new Date().toISOString() }
        ];
        setDesignations(defaultDesigs);
        localStorage.setItem('designations', JSON.stringify(defaultDesigs));
      }
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const handleLeaveSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!leaveForm.type.trim()) return;

    const leaveData: LeaveType = {
      id: editingLeave?.id || Date.now().toString(),
      type: leaveForm.type.trim(),
      isActive: true,
      createdAt: editingLeave?.createdAt || new Date().toISOString()
    };

    const newLeaves = editingLeave
      ? leaveTypes.map(l => l.id === editingLeave.id ? leaveData : l)
      : [...leaveTypes, leaveData];

    setLeaveTypes(newLeaves);
    localStorage.setItem('leave_types', JSON.stringify(newLeaves));
    resetLeaveForm();
    setIsLeaveDialogOpen(false);
  };

  const handleDeptSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!deptForm.departmentName.trim()) return;

    const deptData: Department = {
      id: editingDept?.id || Date.now().toString(),
      departmentName: deptForm.departmentName.trim(),
      isActive: true,
      createdAt: editingDept?.createdAt || new Date().toISOString()
    };

    const newDepts = editingDept
      ? departments.map(d => d.id === editingDept.id ? deptData : d)
      : [...departments, deptData];

    setDepartments(newDepts);
    localStorage.setItem('departments', JSON.stringify(newDepts));
    resetDeptForm();
    setIsDeptDialogOpen(false);
  };

  const handleDesigSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!desigForm.name.trim()) return;

    const desigData: Designation = {
      id: editingDesig?.id || Date.now().toString(),
      name: desigForm.name.trim(),
      isActive: true,
      createdAt: editingDesig?.createdAt || new Date().toISOString()
    };

    const newDesigs = editingDesig
      ? designations.map(d => d.id === editingDesig.id ? desigData : d)
      : [...designations, desigData];

    setDesignations(newDesigs);
    localStorage.setItem('designations', JSON.stringify(newDesigs));
    resetDesigForm();
    setIsDesigDialogOpen(false);
  };

  const resetLeaveForm = () => {
    setLeaveForm({ type: '' });
    setEditingLeave(null);
  };

  const resetDeptForm = () => {
    setDeptForm({ departmentName: '' });
    setEditingDept(null);
  };

  const resetDesigForm = () => {
    setDesigForm({ name: '' });
    setEditingDesig(null);
  };

  const filteredLeaves = leaveTypes.filter(l =>
    l.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredDepts = departments.filter(d =>
    d.departmentName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredDesigs = designations.filter(d =>
    d.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Human Resource Setup</h2>
          <p className="text-gray-600">Manage leave types, departments, and designations</p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 w-64"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="flex items-center p-6">
            <Calendar className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Leave Types</p>
              <p className="text-2xl font-bold">{leaveTypes.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center p-6">
            <Building2 className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Departments</p>
              <p className="text-2xl font-bold">{departments.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center p-6">
            <UserCog className="h-8 w-8 text-purple-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Designations</p>
              <p className="text-2xl font-bold">{designations.length}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="leaves">Leave Types</TabsTrigger>
          <TabsTrigger value="departments">Departments</TabsTrigger>
          <TabsTrigger value="designations">Designations</TabsTrigger>
        </TabsList>

        <TabsContent value="leaves" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Leave Types ({filteredLeaves.length})</h3>
            <Dialog open={isLeaveDialogOpen} onOpenChange={setIsLeaveDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={resetLeaveForm}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Leave Type
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    {editingLeave ? 'Edit Leave Type' : 'Add Leave Type'}
                  </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleLeaveSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="leaveType">Leave Type Name *</Label>
                    <Input
                      id="leaveType"
                      value={leaveForm.type}
                      onChange={(e) => setLeaveForm(prev => ({ ...prev, type: e.target.value }))}
                      placeholder="Enter leave type name"
                      required
                    />
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button type="button" variant="outline" onClick={() => setIsLeaveDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit">
                      {editingLeave ? 'Update' : 'Save'}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid gap-4">
            {filteredLeaves.map(leave => (
              <Card key={leave.id}>
                <CardHeader>
                  <CardTitle className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-5 h-5 text-blue-600" />
                      <span>{leave.type}</span>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setEditingLeave(leave);
                          setLeaveForm({ type: leave.type });
                          setIsLeaveDialogOpen(true);
                        }}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          if (confirm('Are you sure?')) {
                            const newLeaves = leaveTypes.filter(l => l.id !== leave.id);
                            setLeaveTypes(newLeaves);
                            localStorage.setItem('leave_types', JSON.stringify(newLeaves));
                          }
                        }}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardTitle>
                </CardHeader>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="departments" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Departments ({filteredDepts.length})</h3>
            <Dialog open={isDeptDialogOpen} onOpenChange={setIsDeptDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={resetDeptForm}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Department
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    {editingDept ? 'Edit Department' : 'Add Department'}
                  </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleDeptSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="deptName">Department Name *</Label>
                    <Input
                      id="deptName"
                      value={deptForm.departmentName}
                      onChange={(e) => setDeptForm(prev => ({ ...prev, departmentName: e.target.value }))}
                      placeholder="Enter department name"
                      required
                    />
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button type="button" variant="outline" onClick={() => setIsDeptDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit">
                      {editingDept ? 'Update' : 'Save'}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid gap-4">
            {filteredDepts.map(dept => (
              <Card key={dept.id}>
                <CardHeader>
                  <CardTitle className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      <Building2 className="w-5 h-5 text-green-600" />
                      <span>{dept.departmentName}</span>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setEditingDept(dept);
                          setDeptForm({ departmentName: dept.departmentName });
                          setIsDeptDialogOpen(true);
                        }}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          if (confirm('Are you sure?')) {
                            const newDepts = departments.filter(d => d.id !== dept.id);
                            setDepartments(newDepts);
                            localStorage.setItem('departments', JSON.stringify(newDepts));
                          }
                        }}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardTitle>
                </CardHeader>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="designations" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Designations ({filteredDesigs.length})</h3>
            <Dialog open={isDesigDialogOpen} onOpenChange={setIsDesigDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={resetDesigForm}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Designation
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    {editingDesig ? 'Edit Designation' : 'Add Designation'}
                  </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleDesigSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="desigName">Designation Name *</Label>
                    <Input
                      id="desigName"
                      value={desigForm.name}
                      onChange={(e) => setDesigForm(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Enter designation name"
                      required
                    />
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button type="button" variant="outline" onClick={() => setIsDesigDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit">
                      {editingDesig ? 'Update' : 'Save'}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid gap-4">
            {filteredDesigs.map(desig => (
              <Card key={desig.id}>
                <CardHeader>
                  <CardTitle className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      <UserCog className="w-5 h-5 text-purple-600" />
                      <span>{desig.name}</span>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setEditingDesig(desig);
                          setDesigForm({ name: desig.name });
                          setIsDesigDialogOpen(true);
                        }}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          if (confirm('Are you sure?')) {
                            const newDesigs = designations.filter(d => d.id !== desig.id);
                            setDesignations(newDesigs);
                            localStorage.setItem('designations', JSON.stringify(newDesigs));
                          }
                        }}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardTitle>
                </CardHeader>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
