import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Baby, Skull, Plus, Search, Edit, Trash2, FileText, Calendar, User } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { toast } from 'sonner';

interface BirthRecord {
  id: string;
  childName: string;
  motherName: string;
  fatherName: string;
  birthDate: string;
  weight: number;
  gender: 'male' | 'female';
  address: string;
  contact: string;
  refNo: string;
  opdIpdNo?: string;
  birthReport?: string;
}

interface DeathRecord {
  id: string;
  patientId: string;
  patientName: string;
  guardianName: string;
  deathDate: string;
  deathReport: string;
  address: string;
  contact: string;
  opdIpdNo?: string;
  gender: 'male' | 'female';
}

export function BirthDeathRecords() {
  const [birthRecords, setBirthRecords] = useState<BirthRecord[]>([]);
  const [deathRecords, setDeathRecords] = useState<DeathRecord[]>([]);
  const [activeTab, setActiveTab] = useState('birth');
  const [searchTerm, setSearchTerm] = useState('');
  const [showBirthDialog, setShowBirthDialog] = useState(false);
  const [showDeathDialog, setShowDeathDialog] = useState(false);
  const [editingBirth, setEditingBirth] = useState<BirthRecord | null>(null);
  const [editingDeath, setEditingDeath] = useState<DeathRecord | null>(null);

  const [birthForm, setBirthForm] = useState<Partial<BirthRecord>>({
    childName: '',
    motherName: '',
    fatherName: '',
    birthDate: '',
    weight: 0,
    gender: 'male',
    address: '',
    contact: '',
    opdIpdNo: '',
    birthReport: ''
  });

  const [deathForm, setDeathForm] = useState<Partial<DeathRecord>>({
    patientId: '',
    patientName: '',
    guardianName: '',
    deathDate: '',
    deathReport: '',
    address: '',
    contact: '',
    opdIpdNo: '',
    gender: 'male'
  });

  useEffect(() => {
    loadRecords();
  }, []);

  const loadRecords = async () => {
    // Load birth and death records from database
    // This would be replaced with actual API calls
    setBirthRecords([
      {
        id: '1',
        childName: 'John Doe Jr.',
        motherName: 'Jane Doe',
        fatherName: 'John Doe Sr.',
        birthDate: '2024-01-15',
        weight: 3.2,
        gender: 'male',
        address: '123 Main St',
        contact: '+1234567890',
        refNo: 'BR20241',
        opdIpdNo: 'OPD001'
      }
    ]);

    setDeathRecords([
      {
        id: '1',
        patientId: 'P001',
        patientName: 'Robert Smith',
        guardianName: 'Mary Smith',
        deathDate: '2024-01-10',
        deathReport: 'Natural causes',
        address: '456 Oak Ave',
        contact: '+1987654321',
        opdIpdNo: 'IPD001',
        gender: 'male'
      }
    ]);
  };

  const handleBirthSubmit = async () => {
    try {
      if (editingBirth) {
        // Update existing record
        setBirthRecords(prev => prev.map(record => 
          record.id === editingBirth.id ? { ...record, ...birthForm } : record
        ));
        toast.success('Birth record updated successfully');
      } else {
        // Create new record
        const newRecord: BirthRecord = {
          ...birthForm as BirthRecord,
          id: Date.now().toString(),
          refNo: `BR${new Date().getFullYear()}${Date.now()}`
        };
        setBirthRecords(prev => [...prev, newRecord]);
        toast.success('Birth record created successfully');
      }
      
      setShowBirthDialog(false);
      setEditingBirth(null);
      setBirthForm({
        childName: '',
        motherName: '',
        fatherName: '',
        birthDate: '',
        weight: 0,
        gender: 'male',
        address: '',
        contact: '',
        opdIpdNo: '',
        birthReport: ''
      });
    } catch (error) {
      toast.error('Failed to save birth record');
    }
  };

  const handleDeathSubmit = async () => {
    try {
      if (editingDeath) {
        // Update existing record
        setDeathRecords(prev => prev.map(record => 
          record.id === editingDeath.id ? { ...record, ...deathForm } : record
        ));
        toast.success('Death record updated successfully');
      } else {
        // Create new record
        const newRecord: DeathRecord = {
          ...deathForm as DeathRecord,
          id: Date.now().toString()
        };
        setDeathRecords(prev => [...prev, newRecord]);
        toast.success('Death record created successfully');
      }
      
      setShowDeathDialog(false);
      setEditingDeath(null);
      setDeathForm({
        patientId: '',
        patientName: '',
        guardianName: '',
        deathDate: '',
        deathReport: '',
        address: '',
        contact: '',
        opdIpdNo: '',
        gender: 'male'
      });
    } catch (error) {
      toast.error('Failed to save death record');
    }
  };

  const handleEditBirth = (record: BirthRecord) => {
    setEditingBirth(record);
    setBirthForm(record);
    setShowBirthDialog(true);
  };

  const handleEditDeath = (record: DeathRecord) => {
    setEditingDeath(record);
    setDeathForm(record);
    setShowDeathDialog(true);
  };

  const handleDeleteBirth = async (id: string) => {
    try {
      setBirthRecords(prev => prev.filter(record => record.id !== id));
      toast.success('Birth record deleted successfully');
    } catch (error) {
      toast.error('Failed to delete birth record');
    }
  };

  const handleDeleteDeath = async (id: string) => {
    try {
      setDeathRecords(prev => prev.filter(record => record.id !== id));
      toast.success('Death record deleted successfully');
    } catch (error) {
      toast.error('Failed to delete death record');
    }
  };

  const filteredBirthRecords = birthRecords.filter(record =>
    record.childName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.motherName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.refNo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredDeathRecords = deathRecords.filter(record =>
    record.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.guardianName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <FileText className="size-8 text-primary" />
              Birth & Death Records
            </h1>
            <p className="text-muted-foreground mt-1">Manage hospital birth and death certificates</p>
          </div>
        </div>
      </motion.div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground size-4" />
          <Input
            placeholder="Search records..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="birth" className="flex items-center gap-2">
            <Baby className="size-4" />
            Birth Records
          </TabsTrigger>
          <TabsTrigger value="death" className="flex items-center gap-2">
            <Skull className="size-4" />
            Death Records
          </TabsTrigger>
        </TabsList>

        <TabsContent value="birth" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Birth Records</h2>
            <Dialog open={showBirthDialog} onOpenChange={setShowBirthDialog}>
              <DialogTrigger asChild>
                <Button onClick={() => {
                  setEditingBirth(null);
                  setBirthForm({
                    childName: '',
                    motherName: '',
                    fatherName: '',
                    birthDate: '',
                    weight: 0,
                    gender: 'male',
                    address: '',
                    contact: '',
                    opdIpdNo: '',
                    birthReport: ''
                  });
                }}>
                  <Plus className="size-4 mr-2" />
                  Add Birth Record
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>
                    {editingBirth ? 'Edit Birth Record' : 'Add Birth Record'}
                  </DialogTitle>
                </DialogHeader>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Child Name *</Label>
                    <Input
                      value={birthForm.childName}
                      onChange={(e) => setBirthForm(prev => ({ ...prev, childName: e.target.value }))}
                      placeholder="Enter child name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Gender *</Label>
                    <Select
                      value={birthForm.gender}
                      onValueChange={(value: 'male' | 'female') => setBirthForm(prev => ({ ...prev, gender: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Mother Name *</Label>
                    <Input
                      value={birthForm.motherName}
                      onChange={(e) => setBirthForm(prev => ({ ...prev, motherName: e.target.value }))}
                      placeholder="Enter mother name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Father Name</Label>
                    <Input
                      value={birthForm.fatherName}
                      onChange={(e) => setBirthForm(prev => ({ ...prev, fatherName: e.target.value }))}
                      placeholder="Enter father name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Birth Date *</Label>
                    <Input
                      type="datetime-local"
                      value={birthForm.birthDate}
                      onChange={(e) => setBirthForm(prev => ({ ...prev, birthDate: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Weight (kg) *</Label>
                    <Input
                      type="number"
                      step="0.1"
                      value={birthForm.weight}
                      onChange={(e) => setBirthForm(prev => ({ ...prev, weight: parseFloat(e.target.value) }))}
                      placeholder="Enter weight"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Contact</Label>
                    <Input
                      value={birthForm.contact}
                      onChange={(e) => setBirthForm(prev => ({ ...prev, contact: e.target.value }))}
                      placeholder="Enter contact number"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>OPD/IPD No</Label>
                    <Input
                      value={birthForm.opdIpdNo}
                      onChange={(e) => setBirthForm(prev => ({ ...prev, opdIpdNo: e.target.value }))}
                      placeholder="Enter OPD/IPD number"
                    />
                  </div>
                  <div className="col-span-2 space-y-2">
                    <Label>Address</Label>
                    <Textarea
                      value={birthForm.address}
                      onChange={(e) => setBirthForm(prev => ({ ...prev, address: e.target.value }))}
                      placeholder="Enter address"
                    />
                  </div>
                  <div className="col-span-2 space-y-2">
                    <Label>Birth Report</Label>
                    <Textarea
                      value={birthForm.birthReport}
                      onChange={(e) => setBirthForm(prev => ({ ...prev, birthReport: e.target.value }))}
                      placeholder="Enter birth report details"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2 mt-4">
                  <Button variant="outline" onClick={() => setShowBirthDialog(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleBirthSubmit}>
                    {editingBirth ? 'Update' : 'Create'} Record
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Ref No</TableHead>
                    <TableHead>Child Name</TableHead>
                    <TableHead>Mother Name</TableHead>
                    <TableHead>Birth Date</TableHead>
                    <TableHead>Weight</TableHead>
                    <TableHead>Gender</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredBirthRecords.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell className="font-medium">{record.refNo}</TableCell>
                      <TableCell>{record.childName}</TableCell>
                      <TableCell>{record.motherName}</TableCell>
                      <TableCell>{new Date(record.birthDate).toLocaleDateString()}</TableCell>
                      <TableCell>{record.weight} kg</TableCell>
                      <TableCell>
                        <Badge variant={record.gender === 'male' ? 'default' : 'secondary'}>
                          {record.gender}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditBirth(record)}
                          >
                            <Edit className="size-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteBirth(record.id)}
                          >
                            <Trash2 className="size-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="death" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Death Records</h2>
            <Dialog open={showDeathDialog} onOpenChange={setShowDeathDialog}>
              <DialogTrigger asChild>
                <Button onClick={() => {
                  setEditingDeath(null);
                  setDeathForm({
                    patientId: '',
                    patientName: '',
                    guardianName: '',
                    deathDate: '',
                    deathReport: '',
                    address: '',
                    contact: '',
                    opdIpdNo: '',
                    gender: 'male'
                  });
                }}>
                  <Plus className="size-4 mr-2" />
                  Add Death Record
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>
                    {editingDeath ? 'Edit Death Record' : 'Add Death Record'}
                  </DialogTitle>
                </DialogHeader>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Patient Name *</Label>
                    <Input
                      value={deathForm.patientName}
                      onChange={(e) => setDeathForm(prev => ({ ...prev, patientName: e.target.value }))}
                      placeholder="Enter patient name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Guardian Name *</Label>
                    <Input
                      value={deathForm.guardianName}
                      onChange={(e) => setDeathForm(prev => ({ ...prev, guardianName: e.target.value }))}
                      placeholder="Enter guardian name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Death Date *</Label>
                    <Input
                      type="datetime-local"
                      value={deathForm.deathDate}
                      onChange={(e) => setDeathForm(prev => ({ ...prev, deathDate: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Gender</Label>
                    <Select
                      value={deathForm.gender}
                      onValueChange={(value: 'male' | 'female') => setDeathForm(prev => ({ ...prev, gender: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Contact</Label>
                    <Input
                      value={deathForm.contact}
                      onChange={(e) => setDeathForm(prev => ({ ...prev, contact: e.target.value }))}
                      placeholder="Enter contact number"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>OPD/IPD No</Label>
                    <Input
                      value={deathForm.opdIpdNo}
                      onChange={(e) => setDeathForm(prev => ({ ...prev, opdIpdNo: e.target.value }))}
                      placeholder="Enter OPD/IPD number"
                    />
                  </div>
                  <div className="col-span-2 space-y-2">
                    <Label>Address</Label>
                    <Textarea
                      value={deathForm.address}
                      onChange={(e) => setDeathForm(prev => ({ ...prev, address: e.target.value }))}
                      placeholder="Enter address"
                    />
                  </div>
                  <div className="col-span-2 space-y-2">
                    <Label>Death Report *</Label>
                    <Textarea
                      value={deathForm.deathReport}
                      onChange={(e) => setDeathForm(prev => ({ ...prev, deathReport: e.target.value }))}
                      placeholder="Enter cause of death and other details"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2 mt-4">
                  <Button variant="outline" onClick={() => setShowDeathDialog(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleDeathSubmit}>
                    {editingDeath ? 'Update' : 'Create'} Record
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Patient Name</TableHead>
                    <TableHead>Guardian Name</TableHead>
                    <TableHead>Death Date</TableHead>
                    <TableHead>Gender</TableHead>
                    <TableHead>OPD/IPD No</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDeathRecords.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell className="font-medium">{record.patientName}</TableCell>
                      <TableCell>{record.guardianName}</TableCell>
                      <TableCell>{new Date(record.deathDate).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Badge variant={record.gender === 'male' ? 'default' : 'secondary'}>
                          {record.gender}
                        </Badge>
                      </TableCell>
                      <TableCell>{record.opdIpdNo}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditDeath(record)}
                          >
                            <Edit className="size-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteDeath(record.id)}
                          >
                            <Trash2 className="size-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}