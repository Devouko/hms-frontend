import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, Edit, Eye, Bed, User, Calendar, MapPin, Clock } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

interface BedInfo {
  id: string;
  bed_number: string;
  ward: string;
  bed_type: 'general' | 'icu' | 'private' | 'semi_private';
  status: 'available' | 'occupied' | 'maintenance' | 'reserved';
  patient_name?: string;
  patient_id?: string;
  admission_date?: string;
  expected_discharge?: string;
  assigned_nurse?: string;
  daily_rate: number;
}

interface BedManagementProps {
  session: any;
}

export function BedManagement({ session }: BedManagementProps) {
  const [beds, setBeds] = useState<BedInfo[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterWard, setFilterWard] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showAssignBed, setShowAssignBed] = useState(false);
  const [selectedBed, setSelectedBed] = useState<BedInfo | null>(null);

  useEffect(() => {
    // Mock data
    setBeds([
      {
        id: '1',
        bed_number: 'A101',
        ward: 'General Ward A',
        bed_type: 'general',
        status: 'occupied',
        patient_name: 'John Doe',
        patient_id: 'P001',
        admission_date: '2024-01-15',
        expected_discharge: '2024-01-25',
        assigned_nurse: 'Nurse Smith',
        daily_rate: 150
      },
      {
        id: '2',
        bed_number: 'ICU01',
        ward: 'ICU',
        bed_type: 'icu',
        status: 'occupied',
        patient_name: 'Jane Smith',
        patient_id: 'P002',
        admission_date: '2024-01-20',
        assigned_nurse: 'Nurse Johnson',
        daily_rate: 500
      },
      {
        id: '3',
        bed_number: 'B205',
        ward: 'General Ward B',
        bed_type: 'private',
        status: 'available',
        daily_rate: 300
      },
      {
        id: '4',
        bed_number: 'A102',
        ward: 'General Ward A',
        bed_type: 'general',
        status: 'maintenance',
        daily_rate: 150
      }
    ]);
  }, []);

  const wards = ['General Ward A', 'General Ward B', 'ICU', 'Emergency', 'Maternity'];

  const filteredBeds = beds.filter(bed => {
    const matchesSearch = bed.bed_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         bed.ward.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (bed.patient_name && bed.patient_name.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesWard = filterWard === 'all' || bed.ward === filterWard;
    const matchesStatus = filterStatus === 'all' || bed.status === filterStatus;
    
    return matchesSearch && matchesWard && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800';
      case 'occupied': return 'bg-red-100 text-red-800';
      case 'maintenance': return 'bg-yellow-100 text-yellow-800';
      case 'reserved': return 'bg-blue-100 text-blue-800';
      default: return 'bg-muted text-gray-800';
    }
  };

  const getBedTypeColor = (type: string) => {
    switch (type) {
      case 'icu': return 'bg-red-100 text-red-800';
      case 'private': return 'bg-purple-100 text-purple-800';
      case 'semi_private': return 'bg-blue-100 text-blue-800';
      case 'general': return 'bg-muted text-gray-800';
      default: return 'bg-muted text-gray-800';
    }
  };

  const BedCard = ({ bed }: { bed: BedInfo }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card rounded-lg border p-4 hover:shadow-md transition-shadow"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
            bed.status === 'available' ? 'bg-green-100' :
            bed.status === 'occupied' ? 'bg-red-100' :
            bed.status === 'maintenance' ? 'bg-yellow-100' : 'bg-blue-100'
          }`}>
            <Bed className={`size-6 ${
              bed.status === 'available' ? 'text-primary' :
              bed.status === 'occupied' ? 'text-destructive' :
              bed.status === 'maintenance' ? 'text-yellow-600' : 'text-primary'
            }`} />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Bed {bed.bed_number}</h3>
            <p className="text-sm text-muted-foreground">{bed.ward}</p>
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <Badge className={getStatusColor(bed.status)}>
            {bed.status}
          </Badge>
          <Badge className={getBedTypeColor(bed.bed_type)}>
            {bed.bed_type.replace('_', ' ')}
          </Badge>
        </div>
      </div>

      {bed.status === 'occupied' && bed.patient_name && (
        <div className="space-y-2 text-sm text-muted-foreground mb-3">
          <div className="flex items-center gap-2">
            <User className="size-4" />
            <span>{bed.patient_name} ({bed.patient_id})</span>
          </div>
          {bed.admission_date && (
            <div className="flex items-center gap-2">
              <Calendar className="size-4" />
              <span>Admitted: {new Date(bed.admission_date).toLocaleDateString()}</span>
            </div>
          )}
          {bed.expected_discharge && (
            <div className="flex items-center gap-2">
              <Clock className="size-4" />
              <span>Expected discharge: {new Date(bed.expected_discharge).toLocaleDateString()}</span>
            </div>
          )}
          {bed.assigned_nurse && (
            <div className="flex items-center gap-2">
              <User className="size-4" />
              <span>Nurse: {bed.assigned_nurse}</span>
            </div>
          )}
        </div>
      )}

      <div className="flex items-center justify-between pt-3 border-t">
        <span className="text-sm font-medium text-primary">
          ${bed.daily_rate}/day
        </span>
        <div className="flex gap-2">
          {bed.status === 'available' && (
            <Button variant="outline" size="sm" onClick={() => {
              setSelectedBed(bed);
              setShowAssignBed(true);
            }}>
              Assign
            </Button>
          )}
          <Button variant="outline" size="sm">
            <Eye className="size-4" />
          </Button>
          <Button variant="outline" size="sm">
            <Edit className="size-4" />
          </Button>
        </div>
      </div>
    </motion.div>
  );

  const bedStats = {
    total: beds.length,
    available: beds.filter(b => b.status === 'available').length,
    occupied: beds.filter(b => b.status === 'occupied').length,
    maintenance: beds.filter(b => b.status === 'maintenance').length
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Bed Management</h1>
          <p className="text-muted-foreground">Monitor and manage hospital bed availability</p>
        </div>
        <Button onClick={() => setShowAssignBed(true)}>
          <Plus className="size-4 mr-2" />
          Add Bed
        </Button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-gray-900">{bedStats.total}</div>
            <div className="text-sm text-muted-foreground">Total Beds</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">{bedStats.available}</div>
            <div className="text-sm text-muted-foreground">Available</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-destructive">{bedStats.occupied}</div>
            <div className="text-sm text-muted-foreground">Occupied</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-yellow-600">{bedStats.maintenance}</div>
            <div className="text-sm text-muted-foreground">Maintenance</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex gap-4 items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground size-4" />
          <Input
            placeholder="Search beds..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={filterWard} onValueChange={setFilterWard}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by ward" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Wards</SelectItem>
            {wards.map((ward) => (
              <SelectItem key={ward} value={ward}>{ward}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="available">Available</SelectItem>
            <SelectItem value="occupied">Occupied</SelectItem>
            <SelectItem value="maintenance">Maintenance</SelectItem>
            <SelectItem value="reserved">Reserved</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Bed Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBeds.map((bed) => (
          <BedCard key={bed.id} bed={bed} />
        ))}
      </div>

      {/* Assign Bed Modal */}
      <Dialog open={showAssignBed} onOpenChange={setShowAssignBed}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {selectedBed ? `Assign Bed ${selectedBed.bed_number}` : 'Add New Bed'}
            </DialogTitle>
          </DialogHeader>
          <form className="space-y-4">
            {!selectedBed && (
              <>
                <div>
                  <Label htmlFor="bed_number">Bed Number</Label>
                  <Input id="bed_number" placeholder="Enter bed number" />
                </div>
                <div>
                  <Label htmlFor="ward">Ward</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select ward" />
                    </SelectTrigger>
                    <SelectContent>
                      {wards.map((ward) => (
                        <SelectItem key={ward} value={ward}>{ward}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="bed_type">Bed Type</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select bed type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="general">General</SelectItem>
                      <SelectItem value="private">Private</SelectItem>
                      <SelectItem value="semi_private">Semi Private</SelectItem>
                      <SelectItem value="icu">ICU</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="daily_rate">Daily Rate ($)</Label>
                  <Input id="daily_rate" type="number" placeholder="Enter daily rate" />
                </div>
              </>
            )}
            
            {selectedBed && (
              <>
                <div>
                  <Label htmlFor="patient_name">Patient Name</Label>
                  <Input id="patient_name" placeholder="Enter patient name" />
                </div>
                <div>
                  <Label htmlFor="patient_id">Patient ID</Label>
                  <Input id="patient_id" placeholder="Enter patient ID" />
                </div>
                <div>
                  <Label htmlFor="admission_date">Admission Date</Label>
                  <Input id="admission_date" type="date" />
                </div>
                <div>
                  <Label htmlFor="expected_discharge">Expected Discharge</Label>
                  <Input id="expected_discharge" type="date" />
                </div>
                <div>
                  <Label htmlFor="assigned_nurse">Assigned Nurse</Label>
                  <Input id="assigned_nurse" placeholder="Enter nurse name" />
                </div>
              </>
            )}
            
            <div className="flex gap-2 pt-4">
              <Button type="submit" className="flex-1">
                {selectedBed ? 'Assign Bed' : 'Add Bed'}
              </Button>
              <Button type="button" variant="outline" onClick={() => {
                setShowAssignBed(false);
                setSelectedBed(null);
              }}>
                Cancel
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}


