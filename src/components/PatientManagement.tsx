import { useState } from 'react';
import { motion } from 'motion/react';
import { Plus, Search, Edit, Trash2, Eye } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Label } from './ui/label';
import { useLocalStorage } from '../hooks/useLocalStorage';

interface Patient {
  id: string;
  name: string;
  age: number;
  gender: string;
  phone: string;
  email: string;
  address: string;
  bloodType: string;
  admissionDate: string;
  condition: string;
}

export function PatientManagement() {
  const [patients, setPatients] = useLocalStorage<Patient[]>('patients', [
    {
      id: '1',
      name: 'John Doe',
      age: 45,
      gender: 'Male',
      phone: '+1234567890',
      email: 'john.doe@email.com',
      address: '123 Main St, City',
      bloodType: 'O+',
      admissionDate: '2024-11-25',
      condition: 'Stable'
    },
    {
      id: '2',
      name: 'Jane Smith',
      age: 32,
      gender: 'Female',
      phone: '+1234567891',
      email: 'jane.smith@email.com',
      address: '456 Oak Ave, City',
      bloodType: 'A+',
      admissionDate: '2024-11-28',
      condition: 'Critical'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [formData, setFormData] = useState<Partial<Patient>>({});

  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.phone.includes(searchTerm) ||
    patient.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAdd = () => {
    const newPatient: Patient = {
      id: Date.now().toString(),
      name: formData.name || '',
      age: formData.age || 0,
      gender: formData.gender || '',
      phone: formData.phone || '',
      email: formData.email || '',
      address: formData.address || '',
      bloodType: formData.bloodType || '',
      admissionDate: formData.admissionDate || new Date().toISOString().split('T')[0],
      condition: formData.condition || ''
    };
    setPatients([...patients, newPatient]);
    setFormData({});
    setIsAddModalOpen(false);
  };

  const handleEdit = (patient: Patient) => {
    setSelectedPatient(patient);
    setFormData(patient);
    setIsAddModalOpen(true);
  };

  const handleUpdate = () => {
    if (selectedPatient) {
      setPatients(patients.map(p => p.id === selectedPatient.id ? { ...selectedPatient, ...formData } : p));
      setSelectedPatient(null);
      setFormData({});
      setIsAddModalOpen(false);
    }
  };

  const handleDelete = (id: string) => {
    setPatients(patients.filter(p => p.id !== id));
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Patient Management</CardTitle>
              <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
                <DialogTrigger asChild>
                  <Button 
                    onClick={() => {
                      setSelectedPatient(null);
                      setFormData({});
                    }}
                    className="bg-gradient-to-r from-blue-500 to-purple-600"
                  >
                    <Plus className="size-4 mr-2" />
                    Add Patient
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>{selectedPatient ? 'Edit Patient' : 'Add New Patient'}</DialogTitle>
                  </DialogHeader>
                  <div className="grid grid-cols-2 gap-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        value={formData.name || ''}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Enter full name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="age">Age</Label>
                      <Input
                        id="age"
                        type="number"
                        value={formData.age || ''}
                        onChange={(e) => setFormData({ ...formData, age: parseInt(e.target.value) })}
                        placeholder="Enter age"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="gender">Gender</Label>
                      <Input
                        id="gender"
                        value={formData.gender || ''}
                        onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                        placeholder="Enter gender"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="bloodType">Blood Type</Label>
                      <Input
                        id="bloodType"
                        value={formData.bloodType || ''}
                        onChange={(e) => setFormData({ ...formData, bloodType: e.target.value })}
                        placeholder="e.g., O+, A-, AB+"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        value={formData.phone || ''}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="Enter phone number"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email || ''}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="Enter email"
                      />
                    </div>
                    <div className="space-y-2 col-span-2">
                      <Label htmlFor="address">Address</Label>
                      <Input
                        id="address"
                        value={formData.address || ''}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        placeholder="Enter address"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="admissionDate">Admission Date</Label>
                      <Input
                        id="admissionDate"
                        type="date"
                        value={formData.admissionDate || ''}
                        onChange={(e) => setFormData({ ...formData, admissionDate: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="condition">Condition</Label>
                      <Input
                        id="condition"
                        value={formData.condition || ''}
                        onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
                        placeholder="e.g., Stable, Critical"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={selectedPatient ? handleUpdate : handleAdd}>
                      {selectedPatient ? 'Update' : 'Add'} Patient
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 size-4" />
                <Input
                  placeholder="Search patients by name, phone, or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-3">
              {filteredPatients.map((patient, index) => (
                <motion.div
                  key={patient.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg p-4 hover:shadow-md transition-all"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1 grid grid-cols-5 gap-4">
                      <div>
                        <p className="text-xs text-gray-600">Name</p>
                        <p className="text-sm text-gray-900">{patient.name}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600">Age / Gender</p>
                        <p className="text-sm text-gray-900">{patient.age} / {patient.gender}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600">Blood Type</p>
                        <p className="text-sm text-gray-900">{patient.bloodType}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600">Phone</p>
                        <p className="text-sm text-gray-900">{patient.phone}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600">Condition</p>
                        <span className={`inline-block px-2 py-1 rounded text-xs ${
                          patient.condition === 'Critical' ? 'bg-red-100 text-red-700' :
                          patient.condition === 'Stable' ? 'bg-green-100 text-green-700' :
                          'bg-yellow-100 text-yellow-700'
                        }`}>
                          {patient.condition}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(patient)}
                      >
                        <Edit className="size-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(patient.id)}
                      >
                        <Trash2 className="size-4 text-red-600" />
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}

              {filteredPatients.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                  No patients found
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
