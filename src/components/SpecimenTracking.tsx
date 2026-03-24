import { useState } from 'react';
import { motion } from 'framer-motion';
import { FlaskConical, MapPin, Clock, Truck, CheckCircle, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { toast } from 'sonner';

interface Specimen {
  id: string;
  patientName: string;
  testType: string;
  sampleType: string;
  collectionTime: string;
  location: string;
  status: 'collected' | 'in-transit' | 'received' | 'processing' | 'completed' | 'rejected';
  temperature?: string;
  expiryTime?: string;
  notes?: string;
}

export function SpecimenTracking() {
  const [specimens, setSpecimens] = useState<Specimen[]>([
    {
      id: 'SPEC-001',
      patientName: 'John Smith',
      testType: 'CBC',
      sampleType: 'Blood',
      collectionTime: '08:30',
      location: 'Lab Reception',
      status: 'received',
      temperature: '4°C',
      expiryTime: '12:30',
    },
    {
      id: 'SPEC-002',
      patientName: 'Emily Davis',
      testType: 'Lipid Panel',
      sampleType: 'Serum',
      collectionTime: '09:00',
      location: 'Chemistry Lab',
      status: 'processing',
      temperature: '2°C',
      expiryTime: '15:00',
    },
    {
      id: 'SPEC-003',
      patientName: 'Michael Brown',
      testType: 'Urinalysis',
      sampleType: 'Urine',
      collectionTime: '09:15',
      location: 'Collection Point',
      status: 'in-transit',
      expiryTime: '11:15',
    },
    {
      id: 'SPEC-004',
      patientName: 'Sarah Wilson',
      testType: 'Culture',
      sampleType: 'Swab',
      collectionTime: '07:45',
      location: 'Microbiology Lab',
      status: 'completed',
      temperature: 'Room Temp',
    },
  ]);

  const [searchId, setSearchId] = useState('');
  const [selectedSpecimen, setSelectedSpecimen] = useState<Specimen | null>(null);

  const handleStatusUpdate = (specimenId: string, newStatus: Specimen['status'], newLocation?: string) => {
    setSpecimens(specimens.map(spec => 
      spec.id === specimenId 
        ? { ...spec, status: newStatus, location: newLocation || spec.location }
        : spec
    ));
    toast.success(`Specimen ${specimenId} status updated to ${newStatus}!`);
  };

  const handleSearch = () => {
    const found = specimens.find(spec => spec.id.toLowerCase().includes(searchId.toLowerCase()));
    if (found) {
      setSelectedSpecimen(found);
      toast.success('Specimen found!');
    } else {
      toast.error('Specimen not found!');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'collected': return 'bg-blue-100 text-primary';
      case 'in-transit': return 'bg-yellow-100 text-yellow-700';
      case 'received': return 'bg-purple-100 text-primary';
      case 'processing': return 'bg-orange-100 text-primary';
      case 'completed': return 'bg-green-100 text-primary';
      case 'rejected': return 'bg-red-100 text-destructive';
      default: return 'bg-muted text-foreground';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'collected': return <FlaskConical className="size-4" />;
      case 'in-transit': return <Truck className="size-4" />;
      case 'received': return <MapPin className="size-4" />;
      case 'processing': return <Clock className="size-4" />;
      case 'completed': return <CheckCircle className="size-4" />;
      case 'rejected': return <AlertTriangle className="size-4" />;
      default: return <FlaskConical className="size-4" />;
    }
  };

  const isExpiringSoon = (expiryTime?: string) => {
    if (!expiryTime) return false;
    const now = new Date();
    const expiry = new Date();
    const [hours, minutes] = expiryTime.split(':').map(Number);
    expiry.setHours(hours, minutes, 0, 0);
    const diffMinutes = (expiry.getTime() - now.getTime()) / (1000 * 60);
    return diffMinutes <= 60 && diffMinutes > 0;
  };

  const statusCounts = {
    collected: specimens.filter(s => s.status === 'collected').length,
    inTransit: specimens.filter(s => s.status === 'in-transit').length,
    received: specimens.filter(s => s.status === 'received').length,
    processing: specimens.filter(s => s.status === 'processing').length,
    completed: specimens.filter(s => s.status === 'completed').length,
    rejected: specimens.filter(s => s.status === 'rejected').length,
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl text-gray-900">Specimen Tracking</h1>
        <p className="text-muted-foreground">Track specimen status and location</p>
      </div>

      {/* Status Overview */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-3 text-center">
            <div className="text-lg font-bold text-primary">{statusCounts.collected}</div>
            <div className="text-xs text-muted-foreground">Collected</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 text-center">
            <div className="text-lg font-bold text-yellow-600">{statusCounts.inTransit}</div>
            <div className="text-xs text-muted-foreground">In Transit</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 text-center">
            <div className="text-lg font-bold text-primary">{statusCounts.received}</div>
            <div className="text-xs text-muted-foreground">Received</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 text-center">
            <div className="text-lg font-bold text-primary">{statusCounts.processing}</div>
            <div className="text-xs text-muted-foreground">Processing</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 text-center">
            <div className="text-lg font-bold text-primary">{statusCounts.completed}</div>
            <div className="text-xs text-muted-foreground">Completed</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 text-center">
            <div className="text-lg font-bold text-destructive">{statusCounts.rejected}</div>
            <div className="text-xs text-muted-foreground">Rejected</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Search & Track */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FlaskConical className="size-5 text-primary" />
              Track Specimen
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
                placeholder="Enter specimen ID"
              />
              <Button onClick={handleSearch}>Track</Button>
            </div>

            {selectedSpecimen && (
              <div className="p-3 border rounded-lg">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold">{selectedSpecimen.id}</p>
                    <Badge className={getStatusColor(selectedSpecimen.status)}>
                      {getStatusIcon(selectedSpecimen.status)}
                      {selectedSpecimen.status}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">{selectedSpecimen.patientName}</p>
                  <p className="text-xs text-muted-foreground">{selectedSpecimen.testType} • {selectedSpecimen.sampleType}</p>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <MapPin className="size-3" />
                    {selectedSpecimen.location}
                  </div>
                  {selectedSpecimen.temperature && (
                    <p className="text-xs text-muted-foreground">Temp: {selectedSpecimen.temperature}</p>
                  )}
                  {selectedSpecimen.expiryTime && (
                    <p className={`text-xs ${isExpiringSoon(selectedSpecimen.expiryTime) ? 'text-destructive' : 'text-muted-foreground'}`}>
                      Expires: {selectedSpecimen.expiryTime}
                    </p>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* All Specimens */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="size-5 text-primary" />
                All Specimens
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {specimens.map((specimen, index) => (
                  <motion.div
                    key={specimen.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="p-3 border rounded-lg hover:shadow-md transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="text-sm font-semibold">{specimen.id}</p>
                          <Badge className={getStatusColor(specimen.status)}>
                            {getStatusIcon(specimen.status)}
                            {specimen.status}
                          </Badge>
                          {isExpiringSoon(specimen.expiryTime) && (
                            <Badge className="bg-red-100 text-destructive">
                              <AlertTriangle className="size-3 mr-1" />
                              Expiring Soon
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground">{specimen.patientName}</p>
                        <p className="text-xs text-muted-foreground">{specimen.testType} • {specimen.sampleType}</p>
                        <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Clock className="size-3" />
                            {specimen.collectionTime}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="size-3" />
                            {specimen.location}
                          </span>
                          {specimen.temperature && (
                            <span>Temp: {specimen.temperature}</span>
                          )}
                        </div>
                      </div>

                      <div className="flex gap-1">
                        {specimen.status === 'collected' && (
                          <Button
                            size="sm"
                            onClick={() => handleStatusUpdate(specimen.id, 'in-transit')}
                          >
                            Ship
                          </Button>
                        )}
                        {specimen.status === 'in-transit' && (
                          <Button
                            size="sm"
                            onClick={() => handleStatusUpdate(specimen.id, 'received', 'Lab Reception')}
                          >
                            Receive
                          </Button>
                        )}
                        {specimen.status === 'received' && (
                          <Button
                            size="sm"
                            onClick={() => handleStatusUpdate(specimen.id, 'processing')}
                          >
                            Process
                          </Button>
                        )}
                        {specimen.status === 'processing' && (
                          <Button
                            size="sm"
                            onClick={() => handleStatusUpdate(specimen.id, 'completed')}
                          >
                            Complete
                          </Button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

