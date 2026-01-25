import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Plus, Search, Trash2, Edit, Building, Users, DollarSign, Clock, Database, Key, Eye, EyeOff, Save } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Label } from './ui/label';
import { toast } from 'sonner';

interface Department {
  id: string;
  name: string;
  description: string;
  headOfDepartment: string;
  location: string;
  phone: string;
  email: string;
  totalStaff: number;
  status: 'Active' | 'Inactive';
  createdAt: string;
}

// Department Management Component
export function DepartmentManagement({ session }: { session: any }) {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<Department>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      const localDepartments = localStorage.getItem('hospital_departments');
      if (localDepartments) {
        setDepartments(JSON.parse(localDepartments));
      }
    } catch (error) {
      console.error('Error fetching departments:', error);
    }
  };

  const filteredDepartments = departments.filter(dept =>
    dept.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dept.headOfDepartment?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAdd = async () => {
    if (!formData.name || !formData.headOfDepartment) {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      const newDepartment: Department = {
        id: Date.now().toString(),
        name: formData.name || '',
        description: formData.description || '',
        headOfDepartment: formData.headOfDepartment || '',
        location: formData.location || '',
        phone: formData.phone || '',
        email: formData.email || '',
        totalStaff: formData.totalStaff || 0,
        status: 'Active',
        createdAt: new Date().toISOString()
      };

      const updatedDepartments = [...departments, newDepartment];
      setDepartments(updatedDepartments);
      localStorage.setItem('hospital_departments', JSON.stringify(updatedDepartments));
      
      setFormData({});
      setIsAddModalOpen(false);
      toast.success('Department added successfully!');
    } catch (error) {
      console.error('Error adding department:', error);
      toast.error('Failed to add department. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusToggle = (id: string) => {
    const updatedDepartments = departments.map(dept => 
      dept.id === id 
        ? { ...dept, status: dept.status === 'Active' ? 'Inactive' as const : 'Active' as const }
        : dept
    );
    setDepartments(updatedDepartments);
    localStorage.setItem('hospital_departments', JSON.stringify(updatedDepartments));
    toast.success('Department status updated successfully!');
  };

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Building className="size-5" />
                Department Management
              </CardTitle>
              <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
                <DialogTrigger asChild>
                  <Button onClick={() => setFormData({})}>
                    <Plus className="size-4 mr-2" />
                    Add Department
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Add New Department</DialogTitle>
                  </DialogHeader>
                  <div className="grid grid-cols-2 gap-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Department Name *</Label>
                      <Input
                        id="name"
                        value={formData.name || ''}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Enter department name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="headOfDepartment">Head of Department *</Label>
                      <Input
                        id="headOfDepartment"
                        value={formData.headOfDepartment || ''}
                        onChange={(e) => setFormData({ ...formData, headOfDepartment: e.target.value })}
                        placeholder="Enter HOD name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="location">Location</Label>
                      <Input
                        id="location"
                        value={formData.location || ''}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        placeholder="Department location"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        value={formData.phone || ''}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="Contact number"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email || ''}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="Department email"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="totalStaff">Total Staff</Label>
                      <Input
                        id="totalStaff"
                        type="number"
                        value={formData.totalStaff || ''}
                        onChange={(e) => setFormData({ ...formData, totalStaff: parseInt(e.target.value) })}
                        placeholder="Number of staff"
                      />
                    </div>
                    <div className="col-span-2 space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <textarea
                        id="description"
                        value={formData.description || ''}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        placeholder="Department description"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        rows={3}
                      />
                    </div>
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>Cancel</Button>
                    <Button onClick={handleAdd} disabled={loading}>
                      {loading ? 'Adding...' : 'Add Department'}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2 mb-4">
              <Search className="size-4 text-gray-400" />
              <Input
                placeholder="Search departments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredDepartments.map((department) => (
                <motion.div
                  key={department.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Building className="size-5 text-primary" />
                      <h3 className="font-semibold">{department.name}</h3>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs ${
                      department.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {department.status}
                    </span>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <p><span className="font-medium">HOD:</span> {department.headOfDepartment}</p>
                    <p><span className="font-medium">Location:</span> {department.location}</p>
                    <p><span className="font-medium">Staff:</span> {department.totalStaff}</p>
                    <p><span className="font-medium">Phone:</span> {department.phone}</p>
                  </div>

                  <div className="mt-4 flex space-x-2">
                    <Button
                      size="sm"
                      variant={department.status === 'Active' ? 'destructive' : 'default'}
                      onClick={() => handleStatusToggle(department.id)}
                      className="flex-1"
                    >
                      {department.status === 'Active' ? 'Deactivate' : 'Activate'}
                    </Button>
                    <Button size="sm" variant="outline">
                      <Edit className="size-4" />
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>

            {filteredDepartments.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No departments found.
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

// Re-export existing components
export { PayrollManagement } from './PayrollManagement';
export { AttendanceManagement } from './AttendanceManagement';
export { RadiologyManagement } from './RadiologyManagement';
export { OperationTheatreManagement } from './OperationTheatreManagement';
export { BackupManagement } from './BackupManagement';

// Change Password Component
export function ChangePassword({ session }: { session: any }) {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!formData.currentPassword || !formData.newPassword || !formData.confirmPassword) {
      toast.error('Please fill in all fields');
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    if (formData.newPassword.length < 8) {
      toast.error('Password must be at least 8 characters long');
      return;
    }

    setLoading(true);
    try {
      // Simulate password change
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setFormData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      toast.success('Password changed successfully!');
    } catch (error) {
      console.error('Error changing password:', error);
      toast.error('Failed to change password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Key className="size-5" />
              Change Password
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Current Password</Label>
              <div className="relative">
                <Input
                  id="currentPassword"
                  type={showPasswords.current ? 'text' : 'password'}
                  value={formData.currentPassword}
                  onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                  placeholder="Enter current password"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPasswords({ ...showPasswords, current: !showPasswords.current })}
                >
                  {showPasswords.current ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <div className="relative">
                <Input
                  id="newPassword"
                  type={showPasswords.new ? 'text' : 'password'}
                  value={formData.newPassword}
                  onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                  placeholder="Enter new password"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })}
                >
                  {showPasswords.new ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showPasswords.confirm ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  placeholder="Confirm new password"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })}
                >
                  {showPasswords.confirm ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </Button>
              </div>
            </div>

            <div className="pt-4">
              <Button onClick={handleSubmit} disabled={loading} className="w-full">
                <Save className="size-4 mr-2" />
                {loading ? 'Changing Password...' : 'Change Password'}
              </Button>
            </div>

            <div className="text-xs text-gray-500 space-y-1">
              <p>Password requirements:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>At least 8 characters long</li>
                <li>Include uppercase and lowercase letters</li>
                <li>Include at least one number</li>
                <li>Include at least one special character</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}