import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, Car, MapPin, Clock, Phone, AlertTriangle, Navigation } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { toast } from 'sonner';

interface Ambulance {
  id: string;
  vehicle_number: string;
  driver_name: string;
  paramedic_name: string;
  status: 'available' | 'dispatched' | 'en_route' | 'at_scene' | 'returning' | 'maintenance';
  location: string;
  equipment_status: 'fully_equipped' | 'partial' | 'needs_restocking';
  last_maintenance: string;
}

interface EmergencyCall {
  id: string;
  call_time: string;
  caller_name: string;
  caller_phone: string;
  incident_location: string;
  incident_type: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  description: string;
  assigned_ambulance?: string;
  status: 'pending' | 'dispatched' | 'en_route' | 'at_scene' | 'completed' | 'cancelled';
  dispatch_time?: string;
  arrival_time?: string;
  completion_time?: string;
  notes?: string;
}

export function AmbulanceDispatch({ session }: { session: any }) {
  const [ambulances, setAmbulances] = useState<Ambulance[]>([]);
  const [emergencyCalls, setEmergencyCalls] = useState<EmergencyCall[]>([]);
  const [activeTab, setActiveTab] = useState<'calls' | 'ambulances'>('calls');
  const [searchTerm, setSearchTerm] = useState('');
  const [showNewCall, setShowNewCall] = useState(false);
  const [showDispatch, setShowDispatch] = useState(false);
  const [selectedCall, setSelectedCall] = useState<EmergencyCall | null>(null);
  const [callFormData, setCallFormData] = useState<Partial<EmergencyCall>>({});

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    // Mock data - replace with actual API calls
    const mockAmbulances: Ambulance[] = [
      {
        id: '1',
        vehicle_number: 'AMB-001',
        driver_name: 'John Driver',
        paramedic_name: 'Sarah Medic',
        status: 'available',
        location: 'Hospital Base',
        equipment_status: 'fully_equipped',
        last_maintenance: '2024-01-10'
      },
      {
        id: '2',
        vehicle_number: 'AMB-002',
        driver_name: 'Mike Wilson',
        paramedic_name: 'Lisa Johnson',
        status: 'dispatched',
        location: 'En route to Main St',
        equipment_status: 'fully_equipped',
        last_maintenance: '2024-01-08'
      },
      {
        id: '3',
        vehicle_number: 'AMB-003',
        driver_name: 'Tom Brown',
        paramedic_name: 'Anna Davis',
        status: 'maintenance',
        location: 'Maintenance Bay',
        equipment_status: 'needs_restocking',
        last_maintenance: '2024-01-15'
      }
    ];

    const mockCalls: EmergencyCall[] = [
      {
        id: '1',
        call_time: '2024-01-15 14:30',
        caller_name: 'Emergency Caller',
        caller_phone: '+1234567890',
        incident_location: '123 Main Street',
        incident_type: 'Cardiac Emergency',
        priority: 'critical',
        description: 'Patient experiencing chest pain and difficulty breathing',
        assigned_ambulance: 'AMB-002',
        status: 'dispatched',
        dispatch_time: '2024-01-15 14:32'
      },
      {
        id: '2',
        call_time: '2024-01-15 15:15',
        caller_name: 'Jane Smith',
        caller_phone: '+1234567891',
        incident_location: '456 Oak Avenue',
        incident_type: 'Fall Injury',
        priority: 'medium',
        description: 'Elderly patient fell and cannot get up, possible hip injury',
        status: 'pending'
      }
    ];

    setAmbulances(mockAmbulances);
    setEmergencyCalls(mockCalls);
  };

  const handleNewCall = () => {
    if (!callFormData.caller_name || !callFormData.incident_location || !callFormData.incident_type) {
      toast.error('Please fill in all required fields');
      return;
    }

    const newCall: EmergencyCall = {
      id: Date.now().toString(),
      call_time: new Date().toISOString(),
      caller_name: callFormData.caller_name!,
      caller_phone: callFormData.caller_phone || '',
      incident_location: callFormData.incident_location!,
      incident_type: callFormData.incident_type!,
      priority: callFormData.priority || 'medium',
      description: callFormData.description || '',
      status: 'pending'
    };

    setEmergencyCalls([newCall, ...emergencyCalls]);
    setCallFormData({});
    setShowNewCall(false);
    toast.success('Emergency call logged successfully!');
  };

  const handleDispatchAmbulance = (callId: string, ambulanceId: string) => {
    // Update call status
    setEmergencyCalls(emergencyCalls.map(call => 
      call.id === callId 
        ? { 
            ...call, 
            status: 'dispatched' as const,
            assigned_ambulance: ambulanceId,
            dispatch_time: new Date().toISOString()
          }
        : call
    ));

    // Update ambulance status
    setAmbulances(ambulances.map(ambulance => 
      ambulance.id === ambulanceId 
        ? { ...ambulance, status: 'dispatched' as const }
        : ambulance
    ));

    setShowDispatch(false);
    setSelectedCall(null);
    toast.success('Ambulance dispatched successfully!');
  };

  const handleUpdateCallStatus = (callId: string, newStatus: EmergencyCall['status']) => {
    const updateTime = new Date().toISOString();
    
    setEmergencyCalls(emergencyCalls.map(call => {
      if (call.id === callId) {
        const updates: Partial<EmergencyCall> = { status: newStatus };
        
        if (newStatus === 'at_scene') {
          updates.arrival_time = updateTime;
        } else if (newStatus === 'completed') {
          updates.completion_time = updateTime;
          
          // Free up the ambulance
          if (call.assigned_ambulance) {
            setAmbulances(ambulances.map(ambulance => 
              ambulance.id === call.assigned_ambulance 
                ? { ...ambulance, status: 'available' as const, location: 'Hospital Base' }
                : ambulance
            ));
          }
        }
        
        return { ...call, ...updates };
      }
      return call;
    }));

    toast.success(`Call status updated to ${newStatus}`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-primary';
      case 'dispatched': return 'bg-blue-100 text-primary';
      case 'en_route': return 'bg-purple-100 text-primary';
      case 'at_scene': return 'bg-orange-100 text-primary';
      case 'returning': return 'bg-yellow-100 text-yellow-700';
      case 'maintenance': return 'bg-red-100 text-destructive';
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      case 'completed': return 'bg-green-100 text-primary';
      case 'cancelled': return 'bg-muted text-foreground';
      default: return 'bg-muted text-foreground';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-100 text-destructive border-red-200';
      case 'high': return 'bg-orange-100 text-primary border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'low': return 'bg-green-100 text-primary border-green-200';
      default: return 'bg-muted text-foreground border-border';
    }
  };

  const availableAmbulances = ambulances.filter(amb => amb.status === 'available');
  const pendingCalls = emergencyCalls.filter(call => call.status === 'pending');

  const filteredCalls = emergencyCalls.filter(call =>
    call.caller_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    call.incident_location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    call.incident_type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Ambulance Dispatch</h1>
          <p className="text-muted-foreground">Manage emergency calls and ambulance dispatch</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setShowNewCall(true)} className="bg-destructive hover:bg-red-700">
            <Plus className="size-4 mr-2" />
            Emergency Call
          </Button>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">{availableAmbulances.length}</div>
            <div className="text-sm text-muted-foreground">Available</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">
              {ambulances.filter(a => a.status === 'dispatched').length}
            </div>
            <div className="text-sm text-muted-foreground">Dispatched</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-destructive">{pendingCalls.length}</div>
            <div className="text-sm text-muted-foreground">Pending Calls</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">
              {emergencyCalls.filter(c => c.status === 'at_scene').length}
            </div>
            <div className="text-sm text-muted-foreground">At Scene</div>
          </CardContent>
        </Card>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-muted p-1 rounded-lg w-fit">
        <button
          onClick={() => setActiveTab('calls')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'calls'
              ? 'bg-card text-primary shadow-sm'
              : 'text-muted-foreground hover:text-gray-900'
          }`}
        >
          <AlertTriangle className="size-4 mr-2 inline" />
          Emergency Calls
        </button>
        <button
          onClick={() => setActiveTab('ambulances')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'ambulances'
              ? 'bg-card text-primary shadow-sm'
              : 'text-muted-foreground hover:text-gray-900'
          }`}
        >
          <Car className="size-4 mr-2 inline" />
          Ambulance Fleet
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground size-4" />
        <Input
          placeholder={`Search ${activeTab}...`}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Content */}
      {activeTab === 'calls' && (
        <div className="space-y-4">
          {filteredCalls.map((call) => (
            <motion.div
              key={call.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`border-2 rounded-lg p-4 hover:shadow-md transition-shadow ${
                call.priority === 'critical' ? 'border-red-200 bg-red-50' :
                call.priority === 'high' ? 'border-orange-200 bg-orange-50' :
                'border-border bg-card'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    call.priority === 'critical' ? 'bg-red-100' :
                    call.priority === 'high' ? 'bg-orange-100' :
                    'bg-blue-100'
                  }`}>
                    <AlertTriangle className={`size-6 ${
                      call.priority === 'critical' ? 'text-destructive' :
                      call.priority === 'high' ? 'text-primary' :
                      'text-primary'
                    }`} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-gray-900">{call.incident_type}</h3>
                      <Badge className={getPriorityColor(call.priority)}>
                        {call.priority}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{call.caller_name}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={getStatusColor(call.status)}>
                    {call.status.replace('_', ' ')}
                  </Badge>
                  {call.status === 'pending' && (
                    <Button
                      size="sm"
                      onClick={() => {
                        setSelectedCall(call);
                        setShowDispatch(true);
                      }}
                      className="bg-primary hover:bg-blue-700"
                    >
                      Dispatch
                    </Button>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm mb-3">
                <div className="flex items-center gap-2">
                  <MapPin className="size-4 text-muted-foreground" />
                  <span>{call.incident_location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="size-4 text-muted-foreground" />
                  <span>{new Date(call.call_time).toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="size-4 text-muted-foreground" />
                  <span>{call.caller_phone}</span>
                </div>
              </div>

              <div className="mb-3">
                <span className="font-medium">Description:</span>
                <p className="text-foreground">{call.description}</p>
              </div>

              {call.assigned_ambulance && (
                <div className="mb-3 p-2 bg-blue-50 rounded">
                  <span className="font-medium text-blue-800">Assigned Ambulance:</span>
                  <span className="text-blue-900 ml-2">{call.assigned_ambulance}</span>
                  {call.dispatch_time && (
                    <span className="text-primary ml-2 text-sm">
                      (Dispatched: {new Date(call.dispatch_time).toLocaleTimeString()})
                    </span>
                  )}
                </div>
              )}

              {call.status !== 'pending' && call.status !== 'completed' && call.status !== 'cancelled' && (
                <div className="flex gap-2 pt-3 border-t">
                  {call.status === 'dispatched' && (
                    <Button
                      size="sm"
                      onClick={() => handleUpdateCallStatus(call.id, 'en_route')}
                    >
                      En Route
                    </Button>
                  )}
                  {call.status === 'en_route' && (
                    <Button
                      size="sm"
                      onClick={() => handleUpdateCallStatus(call.id, 'at_scene')}
                    >
                      At Scene
                    </Button>
                  )}
                  {call.status === 'at_scene' && (
                    <Button
                      size="sm"
                      onClick={() => handleUpdateCallStatus(call.id, 'completed')}
                      className="bg-primary hover:bg-green-700"
                    >
                      Complete
                    </Button>
                  )}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}

      {activeTab === 'ambulances' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ambulances.map((ambulance) => (
            <motion.div
              key={ambulance.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="border rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <Car className="size-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{ambulance.vehicle_number}</h3>
                    <p className="text-sm text-muted-foreground">{ambulance.location}</p>
                  </div>
                </div>
                <Badge className={getStatusColor(ambulance.status)}>
                  {ambulance.status.replace('_', ' ')}
                </Badge>
              </div>

              <div className="space-y-2 text-sm text-muted-foreground">
                <div>
                  <span className="font-medium">Driver:</span> {ambulance.driver_name}
                </div>
                <div>
                  <span className="font-medium">Paramedic:</span> {ambulance.paramedic_name}
                </div>
                <div>
                  <span className="font-medium">Equipment:</span>
                  <Badge variant="outline" className={
                    ambulance.equipment_status === 'fully_equipped' ? 'text-primary' :
                    ambulance.equipment_status === 'partial' ? 'text-yellow-700' : 'text-destructive'
                  }>
                    {ambulance.equipment_status.replace('_', ' ')}
                  </Badge>
                </div>
                <div>
                  <span className="font-medium">Last Maintenance:</span> {ambulance.last_maintenance}
                </div>
              </div>

              <div className="flex gap-2 mt-4 pt-3 border-t">
                <Button variant="outline" size="sm" className="flex-1">
                  <Navigation className="size-4 mr-1" />
                  Track
                </Button>
                <Button variant="outline" size="sm">
                  <Phone className="size-4" />
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* New Call Modal */}
      <Dialog open={showNewCall} onOpenChange={setShowNewCall}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>New Emergency Call</DialogTitle>
          </DialogHeader>
          <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); handleNewCall(); }}>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Caller Name *</Label>
                <Input
                  value={callFormData.caller_name || ''}
                  onChange={(e) => setCallFormData({ ...callFormData, caller_name: e.target.value })}
                  placeholder="Enter caller name"
                />
              </div>
              <div>
                <Label>Phone Number</Label>
                <Input
                  value={callFormData.caller_phone || ''}
                  onChange={(e) => setCallFormData({ ...callFormData, caller_phone: e.target.value })}
                  placeholder="Enter phone number"
                />
              </div>
            </div>
            <div>
              <Label>Incident Location *</Label>
              <Input
                value={callFormData.incident_location || ''}
                onChange={(e) => setCallFormData({ ...callFormData, incident_location: e.target.value })}
                placeholder="Enter incident location"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Incident Type *</Label>
                <Select
                  value={callFormData.incident_type || ''}
                  onValueChange={(value) => setCallFormData({ ...callFormData, incident_type: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select incident type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Cardiac Emergency">Cardiac Emergency</SelectItem>
                    <SelectItem value="Respiratory Emergency">Respiratory Emergency</SelectItem>
                    <SelectItem value="Trauma/Accident">Trauma/Accident</SelectItem>
                    <SelectItem value="Fall Injury">Fall Injury</SelectItem>
                    <SelectItem value="Stroke">Stroke</SelectItem>
                    <SelectItem value="Other Medical">Other Medical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Priority</Label>
                <Select
                  value={callFormData.priority || 'medium'}
                  onValueChange={(value) => setCallFormData({ ...callFormData, priority: value as any })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="critical">Critical</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label>Description</Label>
              <Textarea
                value={callFormData.description || ''}
                onChange={(e) => setCallFormData({ ...callFormData, description: e.target.value })}
                placeholder="Describe the emergency situation"
                rows={3}
              />
            </div>
            <div className="flex gap-2 pt-4">
              <Button type="submit" className="flex-1 bg-destructive hover:bg-red-700">
                Log Emergency Call
              </Button>
              <Button type="button" variant="outline" onClick={() => setShowNewCall(false)}>
                Cancel
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Dispatch Modal */}
      <Dialog open={showDispatch} onOpenChange={setShowDispatch}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Dispatch Ambulance</DialogTitle>
          </DialogHeader>
          {selectedCall && (
            <div className="space-y-4">
              <div className="p-4 bg-muted/50 rounded-lg">
                <h3 className="font-semibold">{selectedCall.incident_type}</h3>
                <p className="text-sm text-muted-foreground">{selectedCall.incident_location}</p>
                <Badge className={getPriorityColor(selectedCall.priority)}>
                  {selectedCall.priority} priority
                </Badge>
              </div>
              
              <div>
                <Label>Select Available Ambulance</Label>
                <div className="space-y-2 mt-2">
                  {availableAmbulances.map((ambulance) => (
                    <div
                      key={ambulance.id}
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 cursor-pointer"
                      onClick={() => handleDispatchAmbulance(selectedCall.id, ambulance.id)}
                    >
                      <div>
                        <p className="font-medium">{ambulance.vehicle_number}</p>
                        <p className="text-sm text-muted-foreground">
                          {ambulance.driver_name} & {ambulance.paramedic_name}
                        </p>
                      </div>
                      <Badge className="bg-green-100 text-primary">Available</Badge>
                    </div>
                  ))}
                </div>
                {availableAmbulances.length === 0 && (
                  <p className="text-center py-4 text-muted-foreground">No ambulances available</p>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}


