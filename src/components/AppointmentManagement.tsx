import { useState } from 'react';
import { motion } from 'motion/react';
import { Plus, Search, Edit, Trash2, Calendar as CalendarIcon } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Label } from './ui/label';
import { useLocalStorage } from '../hooks/useLocalStorage';

interface Appointment {
  id: string;
  patientName: string;
  doctorName: string;
  date: string;
  time: string;
  department: string;
  reason: string;
  status: 'Scheduled' | 'Completed' | 'Cancelled';
}

export function AppointmentManagement() {
  const [appointments, setAppointments] = useLocalStorage<Appointment[]>('appointments', [
    {
      id: '1',
      patientName: 'John Doe',
      doctorName: 'Dr. Sarah Johnson',
      date: '2024-12-01',
      time: '10:00',
      department: 'Cardiology',
      reason: 'Regular checkup',
      status: 'Scheduled'
    },
    {
      id: '2',
      patientName: 'Jane Smith',
      doctorName: 'Dr. Michael Chen',
      date: '2024-12-01',
      time: '14:30',
      department: 'Neurology',
      reason: 'Follow-up consultation',
      status: 'Scheduled'
    },
    {
      id: '3',
      patientName: 'Robert Wilson',
      doctorName: 'Dr. Emily Brown',
      date: '2024-11-30',
      time: '11:00',
      department: 'Pediatrics',
      reason: 'Vaccination',
      status: 'Completed'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [formData, setFormData] = useState<Partial<Appointment>>({});

  const filteredAppointments = appointments.filter(appointment =>
    appointment.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    appointment.doctorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    appointment.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAdd = () => {
    const newAppointment: Appointment = {
      id: Date.now().toString(),
      patientName: formData.patientName || '',
      doctorName: formData.doctorName || '',
      date: formData.date || '',
      time: formData.time || '',
      department: formData.department || '',
      reason: formData.reason || '',
      status: (formData.status as Appointment['status']) || 'Scheduled'
    };
    setAppointments([...appointments, newAppointment]);
    setFormData({});
    setIsAddModalOpen(false);
  };

  const handleEdit = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setFormData(appointment);
    setIsAddModalOpen(true);
  };

  const handleUpdate = () => {
    if (selectedAppointment) {
      setAppointments(appointments.map(a => 
        a.id === selectedAppointment.id ? { ...selectedAppointment, ...formData } : a
      ));
      setSelectedAppointment(null);
      setFormData({});
      setIsAddModalOpen(false);
    }
  };

  const handleDelete = (id: string) => {
    setAppointments(appointments.filter(a => a.id !== id));
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
              <CardTitle>Appointment Management</CardTitle>
              <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
                <DialogTrigger asChild>
                  <Button 
                    onClick={() => {
                      setSelectedAppointment(null);
                      setFormData({});
                    }}
                    className="bg-gradient-to-r from-purple-500 to-pink-600"
                  >
                    <Plus className="size-4 mr-2" />
                    Schedule Appointment
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>{selectedAppointment ? 'Edit Appointment' : 'Schedule New Appointment'}</DialogTitle>
                  </DialogHeader>
                  <div className="grid grid-cols-2 gap-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="patientName">Patient Name</Label>
                      <Input
                        id="patientName"
                        value={formData.patientName || ''}
                        onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
                        placeholder="Enter patient name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="doctorName">Doctor Name</Label>
                      <Input
                        id="doctorName"
                        value={formData.doctorName || ''}
                        onChange={(e) => setFormData({ ...formData, doctorName: e.target.value })}
                        placeholder="Enter doctor name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="department">Department</Label>
                      <Input
                        id="department"
                        value={formData.department || ''}
                        onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                        placeholder="e.g., Cardiology"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="date">Date</Label>
                      <Input
                        id="date"
                        type="date"
                        value={formData.date || ''}
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="time">Time</Label>
                      <Input
                        id="time"
                        type="time"
                        value={formData.time || ''}
                        onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="status">Status</Label>
                      <select
                        id="status"
                        value={formData.status || 'Scheduled'}
                        onChange={(e) => setFormData({ ...formData, status: e.target.value as Appointment['status'] })}
                        className="w-full px-3 py-2 border border-border rounded-md"
                      >
                        <option value="Scheduled">Scheduled</option>
                        <option value="Completed">Completed</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </div>
                    <div className="space-y-2 col-span-2">
                      <Label htmlFor="reason">Reason for Visit</Label>
                      <Input
                        id="reason"
                        value={formData.reason || ''}
                        onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                        placeholder="Enter reason for appointment"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={selectedAppointment ? handleUpdate : handleAdd}>
                      {selectedAppointment ? 'Update' : 'Schedule'} Appointment
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
                  placeholder="Search appointments by patient, doctor, or department..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-3">
              {filteredAppointments.map((appointment, index) => (
                <motion.div
                  key={appointment.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4 hover:shadow-md transition-all border border-purple-100"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      <div className="bg-gradient-to-br from-purple-500 to-pink-600 p-3 rounded-xl text-card-foreground">
                        <CalendarIcon className="size-6" />
                      </div>
                      <div className="grid grid-cols-5 gap-4 flex-1">
                        <div>
                          <p className="text-xs text-muted-foreground">Patient</p>
                          <p className="text-sm text-gray-900">{appointment.patientName}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Doctor</p>
                          <p className="text-sm text-gray-900">{appointment.doctorName}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Department</p>
                          <p className="text-sm text-gray-900">{appointment.department}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Date & Time</p>
                          <p className="text-sm text-gray-900">{appointment.date} {appointment.time}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Status</p>
                          <span className={`inline-block px-2 py-1 rounded text-xs ${
                            appointment.status === 'Scheduled' ? 'bg-blue-100 text-primary' :
                            appointment.status === 'Completed' ? 'bg-green-100 text-primary' :
                            'bg-red-100 text-destructive'
                          }`}>
                            {appointment.status}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(appointment)}
                      >
                        <Edit className="size-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(appointment.id)}
                      >
                        <Trash2 className="size-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                  <div className="mt-3 ml-16">
                    <p className="text-xs text-muted-foreground">Reason:</p>
                    <p className="text-sm text-gray-900">{appointment.reason}</p>
                  </div>
                </motion.div>
              ))}

              {filteredAppointments.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                  No appointments found
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
