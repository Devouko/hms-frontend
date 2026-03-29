import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, Edit, Trash2, Eye } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Label } from './ui/label';
import { toast } from 'sonner';
import { patientsApi } from '../utils/api';



interface PatientsPageProps {
  session: any;
}

export function PatientsPage({ session }: PatientsPageProps) {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [formData, setFormData] = useState<Partial<Patient>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      const data = await patientsApi.getAll();
      setPatients(data || []);
    } catch (error) {
      setPatients([]);
    }
  };

  const filteredPatients = patients.filter(patient =>
    patient.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.phone?.includes(searchTerm) ||
    patient.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAdd = async () => {
    if (!formData.name || !formData.phone) {
      toast.error('Please fill in all required fields (Name and Phone)');
      return;
    }

    setLoading(true);
    try {
      const newPatient = {
        id: Date.now().toString(),
        name: formData.name,
        phone: formData.phone,
        email: formData.email || '',
        address: formData.address || '',
        age: formData.age || 0,
        gender: formData.gender || '',
        bloodType: formData.bloodType || '',
        patientType: formData.patientType || 'outpatient',
        condition: formData.condition || 'Stable',
        admissionDate: formData.admissionDate || new Date().toISOString().split('T')[0],
        date_of_birth: formData.admissionDate || '',
        medical_history: formData.condition || '',
        workflow_stage: 'registration',
        workflow_status: 'active',
        created_at: new Date().toISOString()
      };
      
      const savedPatient = await patientsApi.create(newPatient);
      setPatients([...patients, savedPatient]);
      
      setFormData({});
      setIsAddModalOpen(false);
      toast.success('Patient added successfully!');
    } catch (error) {
      console.error('Error adding patient:', error);
      toast.error('Failed to add patient. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (patient: Patient) => {
    setSelectedPatient(patient);
    setFormData(patient);
    setIsAddModalOpen(true);
  };

  const handleUpdate = async () => {
    if (!selectedPatient) return;
    if (!formData.name || !formData.phone) {
      toast.error('Please fill in all required fields (Name and Phone)');
      return;
    }
    
    setLoading(true);
    
    try {
      const updatedPatient = await patientsApi.update(selectedPatient.id, {
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        address: formData.address,
        date_of_birth: formData.admissionDate,
        gender: formData.gender,
        medical_history: formData.condition
      });
      
      setPatients(patients.map(p => p.id === selectedPatient.id ? updatedPatient : p));
      setSelectedPatient(null);
      setFormData({});
      setIsAddModalOpen(false);
      toast.success('Patient updated successfully!');
    } catch (error) {
      console.error('Error updating patient:', error);
      toast.error('Failed to update patient. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this patient?')) return;
    
    try {
      await patientsApi.delete(id);
      setPatients(patients.filter(patient => patient.id !== id));
      toast.success('Patient deleted successfully!');
    } catch (error) {
      console.error('Error deleting patient:', error);
      toast.error('Failed to delete patient. Please try again.');
    }
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card className="glass-card">
          <CardHeader>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <CardTitle className="text-lg sm:text-xl">Patient Management</CardTitle>
              <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
                <DialogTrigger asChild>
                  <Button 
                    onClick={() => {
                      setSelectedPatient(null);
                      setFormData({});
                    }}
                    className="bg-primary hover:bg-primary/90 w-full sm:w-auto"
                  >
                    <Plus className="size-4 mr-2" />
                    Add Patient
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto mx-4">
                  <DialogHeader>
                    <DialogTitle className="text-lg">{selectedPatient ? 'Edit Patient' : 'Add New Patient'}</DialogTitle>
                  </DialogHeader>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-sm">Full Name *</Label>
                      <Input
                        id="name"
                        value={formData.name || ''}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Enter full name"
                        className="h-10"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="age" className="text-sm">Age</Label>
                      <Input
                        id="age"
                        type="number"
                        value={formData.age || ''}
                        onChange={(e) => setFormData({ ...formData, age: e.target.value ? parseInt(e.target.value) || 0 : 0 })}
                        placeholder="Enter age"
                        className="h-10"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="gender" className="text-sm">Gender</Label>
                      <select
                        id="gender"
                        value={formData.gender || ''}
                        onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                        className="w-full px-3 py-2 h-10 rounded-md bg-background border border-input text-sm"
                      >
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="bloodType" className="text-sm">Blood Type</Label>
                      <select
                        id="bloodType"
                        value={formData.bloodType || ''}
                        onChange={(e) => setFormData({ ...formData, bloodType: e.target.value })}
                        className="w-full px-3 py-2 h-10 rounded-md bg-background border border-input text-sm"
                      >
                        <option value="">Select Blood Type</option>
                        <option value="A+">A+</option>
                        <option value="A-">A-</option>
                        <option value="B+">B+</option>
                        <option value="B-">B-</option>
                        <option value="AB+">AB+</option>
                        <option value="AB-">AB-</option>
                        <option value="O+">O+</option>
                        <option value="O-">O-</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-sm">Phone *</Label>
                      <Input
                        id="phone"
                        value={formData.phone || ''}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="Enter phone number"
                        className="h-10"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-sm">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email || ''}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="Enter email"
                        className="h-10"
                      />
                    </div>
                    <div className="space-y-2 sm:col-span-2">
                      <Label htmlFor="address" className="text-sm">Address</Label>
                      <Input
                        id="address"
                        value={formData.address || ''}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        placeholder="Enter address"
                        className="h-10"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="patientType" className="text-sm">Patient Type</Label>
                      <select
                        id="patientType"
                        value={formData.patientType || ''}
                        onChange={(e) => setFormData({ ...formData, patientType: e.target.value })}
                        className="w-full px-3 py-2 h-10 rounded-md bg-background border border-input text-sm"
                      >
                        <option value="">Select Type</option>
                        <option value="inpatient">Inpatient</option>
                        <option value="outpatient">Outpatient</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="condition" className="text-sm">Condition</Label>
                      <select
                        id="condition"
                        value={formData.condition || ''}
                        onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
                        className="w-full px-3 py-2 h-10 rounded-md bg-background border border-input text-sm"
                      >
                        <option value="">Select Condition</option>
                        <option value="Stable">Stable</option>
                        <option value="Critical">Critical</option>
                        <option value="Serious">Serious</option>
                        <option value="Fair">Fair</option>
                        <option value="Good">Good</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="admissionDate" className="text-sm">Admission Date</Label>
                      <Input
                        id="admissionDate"
                        type="date"
                        value={formData.admissionDate || ''}
                        onChange={(e) => setFormData({ ...formData, admissionDate: e.target.value })}
                        className="h-10"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row justify-end gap-2">
                    <Button variant="outline" onClick={() => setIsAddModalOpen(false)} className="w-full sm:w-auto">
                      Cancel
                    </Button>
                    <Button 
                      onClick={selectedPatient ? handleUpdate : handleAdd}
                      disabled={loading || !formData.name || !formData.phone}
                      className="bg-primary hover:bg-primary/90 w-full sm:w-auto"
                    >
                      {loading ? 'Saving...' : selectedPatient ? 'Update' : 'Add'} Patient
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground size-4" />
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
                  className="glass-bg rounded-lg p-4 hover:shadow-md transition-all"
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div className="flex-1 w-full">
                      {/* Mobile Layout */}
                      <div className="block sm:hidden space-y-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium text-foreground">{patient.name}</p>
                            <p className="text-sm text-muted-foreground">{patient.age} years, {patient.gender}</p>
                          </div>
                          <span className={`inline-block px-2 py-1 rounded text-xs ${
                            patient.condition === 'Critical' ? 'bg-red-100 text-destructive' :
                            patient.condition === 'Stable' ? 'bg-green-100 text-primary' :
                            'bg-yellow-100 text-yellow-700'
                          }`}>
                            {patient.condition}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Phone:</span>
                          <span className="text-foreground">{patient.phone}</span>
                        </div>
                        {patient.bloodType && (
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Blood:</span>
                            <span className="text-foreground">{patient.bloodType}</span>
                          </div>
                        )}
                      </div>
                      
                      {/* Desktop Layout */}
                      <div className="hidden sm:grid sm:grid-cols-5 gap-4">
                        <div>
                          <p className="text-xs text-muted-foreground">Name</p>
                          <p className="text-sm text-foreground">{patient.name}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Age / Gender</p>
                          <p className="text-sm text-foreground">{patient.age} / {patient.gender}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Blood Type</p>
                          <p className="text-sm text-foreground">{patient.bloodType}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Phone</p>
                          <p className="text-sm text-foreground">{patient.phone}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Condition</p>
                          <span className={`inline-block px-2 py-1 rounded text-xs ${
                            patient.condition === 'Critical' ? 'bg-red-100 text-destructive' :
                            patient.condition === 'Stable' ? 'bg-green-100 text-primary' :
                            'bg-yellow-100 text-yellow-700'
                          }`}>
                            {patient.condition}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 w-full sm:w-auto">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(patient)}
                        className="flex-1 sm:flex-none"
                      >
                        <Edit className="size-4 sm:mr-1" />
                        <span className="hidden sm:inline">Edit</span>
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(patient.id)}
                        className="flex-1 sm:flex-none"
                      >
                        <Trash2 className="size-4 text-destructive sm:mr-1" />
                        <span className="hidden sm:inline">Delete</span>
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}

              {filteredPatients.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                  No patients found. Click "Add Patient" to create one.
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}


