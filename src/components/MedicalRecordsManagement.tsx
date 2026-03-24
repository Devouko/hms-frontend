import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, Edit, Eye, FileText, User, Calendar, Stethoscope, Pill, FlaskConical } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

interface MedicalRecord {
  id: string;
  patient_id: string;
  patient_name: string;
  date: string;
  doctor: string;
  diagnosis: string;
  symptoms: string;
  treatment: string;
  medications: string[];
  lab_tests: string[];
  notes: string;
  status: 'active' | 'completed' | 'follow_up';
}

interface MedicalRecordsManagementProps {
  session: any;
}

export function MedicalRecordsManagement({ session }: MedicalRecordsManagementProps) {
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddRecord, setShowAddRecord] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<MedicalRecord | null>(null);

  useEffect(() => {
    // Mock data
    setRecords([
      {
        id: '1',
        patient_id: 'P001',
        patient_name: 'John Doe',
        date: '2024-01-15',
        doctor: 'Dr. Smith',
        diagnosis: 'Hypertension',
        symptoms: 'High blood pressure, headaches',
        treatment: 'Medication and lifestyle changes',
        medications: ['Lisinopril 10mg', 'Amlodipine 5mg'],
        lab_tests: ['Blood Pressure Monitor', 'ECG'],
        notes: 'Patient responding well to treatment',
        status: 'active'
      },
      {
        id: '2',
        patient_id: 'P002',
        patient_name: 'Jane Smith',
        date: '2024-01-20',
        doctor: 'Dr. Johnson',
        diagnosis: 'Type 2 Diabetes',
        symptoms: 'Increased thirst, frequent urination',
        treatment: 'Insulin therapy and diet control',
        medications: ['Metformin 500mg', 'Insulin'],
        lab_tests: ['HbA1c', 'Glucose Test'],
        notes: 'Regular monitoring required',
        status: 'follow_up'
      }
    ]);
  }, []);

  const filteredRecords = records.filter(record =>
    record.patient_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.diagnosis.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.doctor.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'follow_up': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-muted text-gray-800';
    }
  };

  const RecordCard = ({ record }: { record: MedicalRecord }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card rounded-lg border p-6 hover:shadow-md transition-shadow"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
            <FileText className="size-6 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{record.patient_name}</h3>
            <p className="text-sm text-muted-foreground">Patient ID: {record.patient_id}</p>
          </div>
        </div>
        <Badge className={getStatusColor(record.status)}>
          {record.status.replace('_', ' ')}
        </Badge>
      </div>

      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-muted-foreground">Date:</span>
            <p className="font-medium">{new Date(record.date).toLocaleDateString()}</p>
          </div>
          <div>
            <span className="text-muted-foreground">Doctor:</span>
            <p className="font-medium">{record.doctor}</p>
          </div>
        </div>

        <div>
          <span className="text-muted-foreground text-sm">Diagnosis:</span>
          <p className="font-medium text-primary">{record.diagnosis}</p>
        </div>

        <div>
          <span className="text-muted-foreground text-sm">Symptoms:</span>
          <p className="text-sm">{record.symptoms}</p>
        </div>

        {record.medications.length > 0 && (
          <div>
            <span className="text-muted-foreground text-sm">Medications:</span>
            <div className="flex flex-wrap gap-1 mt-1">
              {record.medications.map((med, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  <Pill className="size-3 mr-1" />
                  {med}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="flex gap-2 mt-4 pt-4 border-t">
        <Button variant="outline" size="sm" onClick={() => setSelectedRecord(record)}>
          <Eye className="size-4 mr-2" />
          View Details
        </Button>
        <Button variant="outline" size="sm">
          <Edit className="size-4 mr-2" />
          Edit
        </Button>
      </div>
    </motion.div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Medical Records</h1>
          <p className="text-muted-foreground">Manage patient medical records and history</p>
        </div>
        <Button onClick={() => setShowAddRecord(true)}>
          <Plus className="size-4 mr-2" />
          Add Record
        </Button>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground size-4" />
        <Input
          placeholder="Search records..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRecords.map((record) => (
          <RecordCard key={record.id} record={record} />
        ))}
      </div>

      {/* Add Record Modal */}
      <Dialog open={showAddRecord} onOpenChange={setShowAddRecord}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add Medical Record</DialogTitle>
          </DialogHeader>
          <form className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="patient_name">Patient Name</Label>
                <Input id="patient_name" placeholder="Enter patient name" />
              </div>
              <div>
                <Label htmlFor="patient_id">Patient ID</Label>
                <Input id="patient_id" placeholder="Enter patient ID" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="doctor">Doctor</Label>
                <Input id="doctor" placeholder="Enter doctor name" />
              </div>
              <div>
                <Label htmlFor="date">Date</Label>
                <Input id="date" type="date" />
              </div>
            </div>
            <div>
              <Label htmlFor="diagnosis">Diagnosis</Label>
              <Input id="diagnosis" placeholder="Enter diagnosis" />
            </div>
            <div>
              <Label htmlFor="symptoms">Symptoms</Label>
              <Textarea id="symptoms" placeholder="Describe symptoms" />
            </div>
            <div>
              <Label htmlFor="treatment">Treatment</Label>
              <Textarea id="treatment" placeholder="Describe treatment plan" />
            </div>
            <div>
              <Label htmlFor="medications">Medications</Label>
              <Textarea id="medications" placeholder="List medications (one per line)" />
            </div>
            <div>
              <Label htmlFor="notes">Notes</Label>
              <Textarea id="notes" placeholder="Additional notes" />
            </div>
            <div className="flex gap-2 pt-4">
              <Button type="submit" className="flex-1">Add Record</Button>
              <Button type="button" variant="outline" onClick={() => setShowAddRecord(false)}>Cancel</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* View Record Modal */}
      <Dialog open={!!selectedRecord} onOpenChange={() => setSelectedRecord(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Medical Record Details</DialogTitle>
          </DialogHeader>
          {selectedRecord && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Patient Name</Label>
                  <p className="font-medium">{selectedRecord.patient_name}</p>
                </div>
                <div>
                  <Label>Patient ID</Label>
                  <p className="font-medium">{selectedRecord.patient_id}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Doctor</Label>
                  <p className="font-medium">{selectedRecord.doctor}</p>
                </div>
                <div>
                  <Label>Date</Label>
                  <p className="font-medium">{new Date(selectedRecord.date).toLocaleDateString()}</p>
                </div>
              </div>
              <div>
                <Label>Diagnosis</Label>
                <p className="font-medium text-primary">{selectedRecord.diagnosis}</p>
              </div>
              <div>
                <Label>Symptoms</Label>
                <p>{selectedRecord.symptoms}</p>
              </div>
              <div>
                <Label>Treatment</Label>
                <p>{selectedRecord.treatment}</p>
              </div>
              <div>
                <Label>Medications</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {selectedRecord.medications.map((med, index) => (
                    <Badge key={index} variant="outline">
                      <Pill className="size-3 mr-1" />
                      {med}
                    </Badge>
                  ))}
                </div>
              </div>
              {selectedRecord.lab_tests.length > 0 && (
                <div>
                  <Label>Lab Tests</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {selectedRecord.lab_tests.map((test, index) => (
                      <Badge key={index} variant="outline">
                        <FlaskConical className="size-3 mr-1" />
                        {test}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              <div>
                <Label>Notes</Label>
                <p>{selectedRecord.notes}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

