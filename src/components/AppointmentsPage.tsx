import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Plus, Search, Trash2, Calendar as CalendarIcon } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Label } from './ui/label';
import { toast } from 'sonner';
import { appointmentService, Appointment } from '../utils/supabase/client';



interface AppointmentsPageProps {
  session: any;
}

export function AppointmentsPage({ session }: AppointmentsPageProps) {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<Appointment>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const data = await appointmentService.getAll();
      setAppointments(data);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      // Fallback to localStorage
      const localAppointments = localStorage.getItem('hospital_appointments');
      if (localAppointments) {
        setAppointments(JSON.parse(localAppointments));
      } else {
        setAppointments([]);
      }
    }
  };

  const filteredAppointments = appointments.filter(appointment =>
    appointment && (
      appointment.doctor_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.notes?.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const handleAdd = async () => {
    if (!formData.doctor_name || !formData.appointment_date || !formData.appointment_time) {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      const newAppointment: Appointment = {
        id: Date.now().toString(),
        patient_id: formData.patient_id || 'temp-patient-id',
        doctor_name: formData.doctor_name,
        appointment_date: formData.appointment_date,
        appointment_time: formData.appointment_time,
        status: formData.status || 'scheduled',
        notes: formData.notes || '',
        created_at: new Date().toISOString()
      };

      // Try Supabase first, fallback to localStorage
      try {
        const savedAppointment = await appointmentService.create(newAppointment);
        setAppointments([...appointments, savedAppointment]);
      } catch (dbError) {
        console.warn('Database save failed, using localStorage:', dbError);
        // Save to localStorage as fallback
        const updatedAppointments = [...appointments, newAppointment];
        setAppointments(updatedAppointments);
        localStorage.setItem('hospital_appointments', JSON.stringify(updatedAppointments));
      }
      
      setFormData({});
      setIsAddModalOpen(false);
      toast.success('Appointment scheduled successfully!');
    } catch (error) {
      console.error('Error adding appointment:', error);
      toast.error('Failed to schedule appointment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this appointment?')) return;
    
    try {
      await appointmentService.delete(id);
      setAppointments(appointments.filter(appointment => appointment.id !== id));
      toast.success('Appointment deleted successfully!');
    } catch (error) {
      console.error('Error deleting appointment:', error);
      toast.error('Failed to delete appointment. Please try again.');
    }
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
                    onClick={() => setFormData({})}
                    className="bg-primary hover:bg-primary/90"
                  >
                    <Plus className="size-4 mr-2" />
                    Schedule Appointment
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Schedule New Appointment</DialogTitle>
                    <DialogDescription>
                      Fill in the details to schedule a new appointment.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid grid-cols-2 gap-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="doctor_name">Doctor Name</Label>
                      <Input
                        id="doctor_name"
                        value={formData.doctor_name || ''}
                        onChange={(e) => setFormData({ ...formData, doctor_name: e.target.value })}
                        placeholder="Enter doctor name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="appointment_date">Date</Label>
                      <Input
                        id="appointment_date"
                        type="date"
                        value={formData.appointment_date || ''}
                        onChange={(e) => setFormData({ ...formData, appointment_date: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="appointment_time">Time</Label>
                      <Input
                        id="appointment_time"
                        type="time"
                        value={formData.appointment_time || ''}
                        onChange={(e) => setFormData({ ...formData, appointment_time: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="status">Status</Label>
                      <select
                        id="status"
                        value={formData.status || 'scheduled'}
                        onChange={(e) => setFormData({ ...formData, status: e.target.value as 'scheduled' | 'completed' | 'cancelled' })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      >
                        <option value="scheduled">Scheduled</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>
                    <div className="space-y-2 col-span-2">
                      <Label htmlFor="notes">Notes</Label>
                      <Input
                        id="notes"
                        value={formData.notes || ''}
                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                        placeholder="Enter appointment notes"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>
                      Cancel
                    </Button>
                    <Button 
                      onClick={handleAdd}
                      disabled={loading || !formData.doctor_name || !formData.appointment_date || !formData.appointment_time}
                      className="bg-primary hover:bg-primary/90"
                    >
                      {loading ? 'Scheduling...' : 'Schedule'} Appointment
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
                  className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg p-4 hover:shadow-md transition-all"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      <div className="bg-primary p-3 rounded-xl text-white">
                        <CalendarIcon className="size-6" />
                      </div>
                      <div className="grid grid-cols-5 gap-4 flex-1">
                        <div>
                          <p className="text-xs text-gray-600">Doctor</p>
                          <p className="text-sm text-gray-900">{appointment.doctor_name}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600">Date & Time</p>
                          <p className="text-sm text-gray-900">{appointment.appointment_date} {appointment.appointment_time}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600">Status</p>
                          <span className={`inline-block px-2 py-1 rounded text-xs ${
                            appointment.status === 'scheduled' ? 'bg-amber-100 text-amber-700' :
                            appointment.status === 'completed' ? 'bg-green-100 text-green-700' :
                            'bg-red-100 text-red-700'
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
                        onClick={() => handleDelete(appointment.id)}
                      >
                        <Trash2 className="size-4 text-red-600" />
                      </Button>
                    </div>
                  </div>
                  {appointment.notes && (
                    <div className="mt-3 ml-16">
                      <p className="text-xs text-gray-600">Notes:</p>
                      <p className="text-sm text-gray-900">{appointment.notes}</p>
                    </div>
                  )}
                </motion.div>
              ))}

              {filteredAppointments.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                  No appointments found. Click "Schedule Appointment" to create one.
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}