import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Plus, Search, Edit, Trash2, UserCheck } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Label } from './ui/label';
import { projectId } from '../utils/supabase/info';

interface Registration {
  id: string;
  patientName: string;
  age: number;
  gender: string;
  phone: string;
  email: string;
  emergencyContact: string;
  visitType: string;
  registrationDate: string;
  status: 'Pending' | 'Checked-In' | 'Completed';
}

interface PatientRegistrationProps {
  session: any;
  onUpdate?: () => void;
}

export function PatientRegistration({ session, onUpdate }: PatientRegistrationProps) {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<Registration>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchRegistrations();
  }, []);

  const fetchRegistrations = async () => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-d8a3a34f/registrations`,
        {
          headers: {
            Authorization: `Bearer ${session?.access_token}`,
          },
        }
      );
      const data = await response.json();
      setRegistrations(data.registrations || []);
      onUpdate?.();
    } catch (error) {
      console.error('Error fetching registrations:', error);
    }
  };

  const filteredRegistrations = registrations.filter(reg =>
    reg.patientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    reg.phone?.includes(searchTerm)
  );

  const handleAdd = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-d8a3a34f/registrations`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${session?.access_token}`,
          },
          body: JSON.stringify({ ...formData, status: 'Pending', registrationDate: new Date().toISOString() }),
        }
      );
      
      if (response.ok) {
        await fetchRegistrations();
        setFormData({});
        setIsAddModalOpen(false);
      }
    } catch (error) {
      console.error('Error adding registration:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckIn = async (id: string) => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-d8a3a34f/registrations/${id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${session?.access_token}`,
          },
          body: JSON.stringify({ status: 'Checked-In' }),
        }
      );
      
      if (response.ok) {
        await fetchRegistrations();
      }
    } catch (error) {
      console.error('Error checking in:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this registration?')) return;
    
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-d8a3a34f/registrations/${id}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${session?.access_token}`,
          },
        }
      );
      
      if (response.ok) {
        await fetchRegistrations();
      }
    } catch (error) {
      console.error('Error deleting registration:', error);
    }
  };

  return (
    <div className="space-y-4 mt-4">
      <div className="flex items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 size-4" />
          <Input
            placeholder="Search by name or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setFormData({})} className="bg-primary hover:bg-primary/90">
              <Plus className="size-4 mr-2" />
              New Registration
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Patient Registration</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="patientName">Patient Name</Label>
                <Input
                  id="patientName"
                  value={formData.patientName || ''}
                  onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
                  placeholder="Full name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="age">Age</Label>
                <Input
                  id="age"
                  type="number"
                  value={formData.age || ''}
                  onChange={(e) => setFormData({ ...formData, age: parseInt(e.target.value) })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="gender">Gender</Label>
                <select
                  id="gender"
                  value={formData.gender || ''}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="">Select</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={formData.phone || ''}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email || ''}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="emergencyContact">Emergency Contact</Label>
                <Input
                  id="emergencyContact"
                  value={formData.emergencyContact || ''}
                  onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })}
                />
              </div>
              <div className="space-y-2 col-span-2">
                <Label htmlFor="visitType">Visit Type</Label>
                <select
                  id="visitType"
                  value={formData.visitType || ''}
                  onChange={(e) => setFormData({ ...formData, visitType: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="">Select</option>
                  <option value="OPD">OPD</option>
                  <option value="Emergency">Emergency</option>
                  <option value="Consultation">Consultation</option>
                  <option value="Follow-up">Follow-up</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAdd} disabled={loading} className="bg-primary hover:bg-primary/90">
                {loading ? 'Registering...' : 'Register'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-3">
        {filteredRegistrations.map((reg, index) => (
          <motion.div
            key={reg.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg p-4 hover:shadow-md transition-all"
          >
            <div className="flex items-center justify-between">
              <div className="flex-1 grid grid-cols-5 gap-4">
                <div>
                  <p className="text-xs text-gray-600">Patient</p>
                  <p className="text-sm text-gray-900">{reg.patientName}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600">Age / Gender</p>
                  <p className="text-sm text-gray-900">{reg.age} / {reg.gender}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600">Phone</p>
                  <p className="text-sm text-gray-900">{reg.phone}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600">Visit Type</p>
                  <p className="text-sm text-gray-900">{reg.visitType}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600">Status</p>
                  <span className={`inline-block px-2 py-1 rounded text-xs ${
                    reg.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                    reg.status === 'Checked-In' ? 'bg-green-100 text-green-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {reg.status}
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                {reg.status === 'Pending' && (
                  <Button
                    size="sm"
                    onClick={() => handleCheckIn(reg.id)}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <UserCheck className="size-4 mr-1" />
                    Check-In
                  </Button>
                )}
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleDelete(reg.id)}
                >
                  <Trash2 className="size-4 text-red-600" />
                </Button>
              </div>
            </div>
          </motion.div>
        ))}

        {filteredRegistrations.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No registrations found. Click "New Registration" to add one.
          </div>
        )}
      </div>
    </div>
  );
}
