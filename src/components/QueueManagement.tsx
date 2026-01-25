import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Plus, Search, ArrowRight, CheckCircle, XCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Label } from './ui/label';


interface QueueItem {
  id: string;
  patientName: string;
  tokenNumber: string;
  department: string;
  doctorName: string;
  priority: 'Normal' | 'Urgent' | 'Emergency';
  status: 'Waiting' | 'In-Progress' | 'Completed' | 'Cancelled';
  queueTime: string;
}

interface QueueManagementProps {
  session: any;
  onUpdate?: () => void;
}

export function QueueManagement({ session, onUpdate }: QueueManagementProps) {
  const [queue, setQueue] = useState<QueueItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<QueueItem>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchQueue();
  }, []);

  const fetchQueue = async () => {
    try {
      const localQueue = localStorage.getItem('hospital_queue');
      if (localQueue) {
        setQueue(JSON.parse(localQueue));
      }
      onUpdate?.();
    } catch (error) {
      console.error('Error fetching queue:', error);
    }
  };

  const filteredQueue = queue.filter(item =>
    item.patientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.tokenNumber?.includes(searchTerm) ||
    item.department?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const generateToken = () => {
    return `T${Date.now().toString().slice(-6)}`;
  };

  const handleAdd = async () => {
    if (!formData.patientName || !formData.department || !formData.doctorName) {
      return;
    }

    setLoading(true);
    try {
      const newItem: QueueItem = {
        id: Date.now().toString(),
        patientName: formData.patientName || '',
        tokenNumber: generateToken(),
        department: formData.department || '',
        doctorName: formData.doctorName || '',
        priority: formData.priority || 'Normal',
        status: 'Waiting',
        queueTime: new Date().toISOString()
      };

      const updatedQueue = [...queue, newItem];
      setQueue(updatedQueue);
      localStorage.setItem('hospital_queue', JSON.stringify(updatedQueue));
      
      setFormData({});
      setIsAddModalOpen(false);
      onUpdate?.();
    } catch (error) {
      console.error('Error adding to queue:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id: string, status: QueueItem['status']) => {
    try {
      const updatedQueue = queue.map(item => 
        item.id === id ? { ...item, status } : item
      );
      setQueue(updatedQueue);
      localStorage.setItem('hospital_queue', JSON.stringify(updatedQueue));
      onUpdate?.();
    } catch (error) {
      console.error('Error updating queue status:', error);
    }
  };

  const formatTime = (isoString: string) => {
    return new Date(isoString).toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="space-y-4 mt-4">
      <div className="flex items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 size-4" />
          <Input
            placeholder="Search by patient, token, or department..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setFormData({})} className="bg-primary hover:bg-primary/90">
              <Plus className="size-4 mr-2" />
              Add to Queue
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Add Patient to Queue</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
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
                <Label htmlFor="department">Department</Label>
                <select
                  id="department"
                  value={formData.department || ''}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="">Select Department</option>
                  <option value="Cardiology">Cardiology</option>
                  <option value="Neurology">Neurology</option>
                  <option value="Orthopedics">Orthopedics</option>
                  <option value="Pediatrics">Pediatrics</option>
                  <option value="General">General</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="doctorName">Doctor Name</Label>
                <Input
                  id="doctorName"
                  value={formData.doctorName || ''}
                  onChange={(e) => setFormData({ ...formData, doctorName: e.target.value })}
                  placeholder="Doctor name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="priority">Priority</Label>
                <select
                  id="priority"
                  value={formData.priority || 'Normal'}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value as QueueItem['priority'] })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="Normal">Normal</option>
                  <option value="Urgent">Urgent</option>
                  <option value="Emergency">Emergency</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAdd} disabled={loading} className="bg-primary hover:bg-primary/90">
                {loading ? 'Adding...' : 'Add to Queue'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-3">
        {filteredQueue.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className={`rounded-lg p-4 hover:shadow-md transition-all ${
              item.priority === 'Emergency' ? 'bg-gradient-to-r from-red-50 to-red-100 border-l-4 border-red-500' :
              item.priority === 'Urgent' ? 'bg-gradient-to-r from-amber-50 to-amber-100 border-l-4 border-amber-500' :
              'bg-gradient-to-r from-gray-50 to-gray-100'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1 grid grid-cols-6 gap-4">
                <div>
                  <p className="text-xs text-gray-600">Token</p>
                  <p className="text-lg text-gray-900">{item.tokenNumber}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600">Patient</p>
                  <p className="text-sm text-gray-900">{item.patientName}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600">Department</p>
                  <p className="text-sm text-gray-900">{item.department}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600">Doctor</p>
                  <p className="text-sm text-gray-900">{item.doctorName}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600">Priority</p>
                  <span className={`inline-block px-2 py-1 rounded text-xs ${
                    item.priority === 'Emergency' ? 'bg-red-100 text-red-700' :
                    item.priority === 'Urgent' ? 'bg-amber-100 text-amber-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {item.priority}
                  </span>
                </div>
                <div>
                  <p className="text-xs text-gray-600">Status</p>
                  <span className={`inline-block px-2 py-1 rounded text-xs ${
                    item.status === 'Waiting' ? 'bg-amber-100 text-amber-700' :
                    item.status === 'In-Progress' ? 'bg-primary/10 text-primary' :
                    item.status === 'Completed' ? 'bg-green-100 text-green-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {item.status}
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                {item.status === 'Waiting' && (
                  <Button
                    size="sm"
                    onClick={() => handleStatusChange(item.id, 'In-Progress')}
                    className="bg-primary hover:bg-primary/90"
                  >
                    <ArrowRight className="size-4 mr-1" />
                    Start
                  </Button>
                )}
                {item.status === 'In-Progress' && (
                  <Button
                    size="sm"
                    onClick={() => handleStatusChange(item.id, 'Completed')}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircle className="size-4 mr-1" />
                    Complete
                  </Button>
                )}
                {(item.status === 'Waiting' || item.status === 'In-Progress') && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleStatusChange(item.id, 'Cancelled')}
                  >
                    <XCircle className="size-4 text-red-600" />
                  </Button>
                )}
              </div>
            </div>
          </motion.div>
        ))}

        {filteredQueue.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No patients in queue. Click "Add to Queue" to add one.
          </div>
        )}
      </div>
    </div>
  );
}
