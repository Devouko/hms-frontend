import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  FileText, 
  Download, 
  Calendar, 
  Filter, 
  Search, 
  Users, 
  Clock, 
  DollarSign,
  TrendingUp,
  Eye,
  Printer,
  RefreshCw,
  BarChart3,
  PieChart
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart as RechartsPieChart, Pie, Cell } from 'recharts';
import { toast } from 'sonner';

interface OPDRecord {
  id: string;
  patientId: string;
  patientName: string;
  age: number;
  gender: 'Male' | 'Female';
  department: string;
  doctor: string;
  visitDate: string;
  visitTime: string;
  diagnosis: string;
  treatment: string;
  status: 'Completed' | 'In Progress' | 'Cancelled';
  amount: number;
  paymentStatus: 'Paid' | 'Pending' | 'Partial';
}

export function OPDReport() {
  const [loading, setLoading] = useState(false);
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedDoctor, setSelectedDoctor] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [opdRecords, setOpdRecords] = useState<OPDRecord[]>([]);

  // Sample data - in real app, this would come from API
  const sampleOPDData: OPDRecord[] = [
    {
      id: 'OPD001',
      patientId: 'P001',
      patientName: 'John Doe',
      age: 35,
      gender: 'Male',
      department: 'Cardiology',
      doctor: 'Dr. Smith',
      visitDate: '2024-01-15',
      visitTime: '09:30',
      diagnosis: 'Hypertension',
      treatment: 'Medication prescribed',
      status: 'Completed',
      amount: 2500,
      paymentStatus: 'Paid'
    },
    {
      id: 'OPD002',
      patientId: 'P002',
      patientName: 'Jane Smith',
      age: 28,
      gender: 'Female',
      department: 'Neurology',
      doctor: 'Dr. Johnson',
      visitDate: '2024-01-15',
      visitTime: '10:15',
      diagnosis: 'Migraine',
      treatment: 'Pain management',
      status: 'Completed',
      amount: 1800,
      paymentStatus: 'Paid'
    },
    {
      id: 'OPD003',
      patientId: 'P003',
      patientName: 'Robert Wilson',
      age: 45,
      gender: 'Male',
      department: 'Orthopedics',
      doctor: 'Dr. Brown',
      visitDate: '2024-01-16',
      visitTime: '11:00',
      diagnosis: 'Knee Pain',
      treatment: 'Physiotherapy recommended',
      status: 'In Progress',
      amount: 3200,
      paymentStatus: 'Pending'
    }
  ];

  const departments = ['Cardiology', 'Neurology', 'Orthopedics', 'Pediatrics', 'General Medicine'];
  const doctors = ['Dr. Smith', 'Dr. Johnson', 'Dr. Brown', 'Dr. Davis', 'Dr. Wilson'];

  useEffect(() => {
    setOpdRecords(sampleOPDData);
    // Set default date range (last 30 days)
    const today = new Date();
    const thirtyDaysAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
    setDateTo(today.toISOString().split('T')[0]);
    setDateFrom(thirtyDaysAgo.toISOString().split('T')[0]);
  }, []);

  const filteredRecords = opdRecords.filter(record => {
    const matchesSearch = record.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.patientId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.diagnosis.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = selectedDepartment === 'all' || record.department === selectedDepartment;
    const matchesDoctor = selectedDoctor === 'all' || record.doctor === selectedDoctor;
    const matchesStatus = selectedStatus === 'all' || record.status === selectedStatus;
    const matchesDateRange = (!dateFrom || record.visitDate >= dateFrom) && 
                            (!dateTo || record.visitDate <= dateTo);
    
    return matchesSearch && matchesDepartment && matchesDoctor && matchesStatus && matchesDateRange;
  });

  // Analytics data
  const departmentStats = departments.map(dept => ({
    name: dept,
    patients: filteredRecords.filter(r => r.department === dept).length,
    revenue: filteredRecords.filter(r => r.department === dept).reduce((sum, r) => sum + r.amount, 0)
  }));

  const statusStats = [
    { name: 'Completed', value: filteredRecords.filter(r => r.status === 'Completed').length, color: '#10b981' },
    { name: 'In Progress', value: filteredRecords.filter(r => r.status === 'In Progress').length, color: '#f59e0b' },
    { name: 'Cancelled', value: filteredRecords.filter(r => r.status === 'Cancelled').length, color: '#ef4444' }
  ];

  const genderStats = [
    { name: 'Male', value: filteredRecords.filter(r => r.gender === 'Male').length, color: '#3b82f6' },
    { name: 'Female', value: filteredRecords.filter(r => r.gender === 'Female').length, color: '#ec4899' }
  ];

  const totalPatients = filteredRecords.length;
  const totalRevenue = filteredRecords.reduce((sum, record) => sum + record.amount, 0);
  const completedVisits = filteredRecords.filter(r => r.status === 'Completed').length;
  const pendingPayments = filteredRecords.filter(r => r.paymentStatus === 'Pending').length;

  const handleExport = (format: 'pdf' | 'excel' | 'csv') => {
    setLoading(true);
    // Simulate export process
    setTimeout(() => {
      setLoading(false);
      toast.success(`OPD Report exported as ${format.toUpperCase()}`);
    }, 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const resetFilters = () => {
    setSelectedDepartment('all');
    setSelectedDoctor('all');
    setSelectedStatus('all');
    setSearchTerm('');
    const today = new Date();
    const thirtyDaysAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
    setDateTo(today.toISOString().split('T')[0]);
    setDateFrom(thirtyDaysAgo.toISOString().split('T')[0]);
  };

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
              <FileText className="size-8 text-primary" />
              OPD Report
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Comprehensive outpatient department analytics and reporting
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={handlePrint}>
              <Printer className="size-4 mr-2" />
              Print
            </Button>
            <Button variant="outline" onClick={resetFilters}>
              <RefreshCw className="size-4 mr-2" />
              Reset
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="size-5" />
            Filters & Search
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <div className="space-y-2">
              <Label>From Date</Label>
              <Input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>To Date</Label>
              <Input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Department</Label>
              <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  {departments.map(dept => (
                    <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Doctor</Label>
              <Select value={selectedDoctor} onValueChange={setSelectedDoctor}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Doctors</SelectItem>
                  {doctors.map(doctor => (
                    <SelectItem key={doctor} value={doctor}>{doctor}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Search</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground size-4" />
                <Input
                  placeholder="Search by patient name, ID, or diagnosis..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Patients</p>
                <p className="text-2xl font-bold text-foreground">{totalPatients}</p>
              </div>
              <Users className="size-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Revenue</p>
                <p className="text-2xl font-bold text-foreground">kSH {totalRevenue.toLocaleString()}</p>
              </div>
              <DollarSign className="size-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Completed Visits</p>
                <p className="text-2xl font-bold text-foreground">{completedVisits}</p>
              </div>
              <TrendingUp className="size-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending Payments</p>
                <p className="text-2xl font-bold text-foreground">{pendingPayments}</p>
              </div>
              <Clock className="size-8 text-destructive" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="data" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="data">Data View</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="export">Export</TabsTrigger>
        </TabsList>

        <TabsContent value="data" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>OPD Records ({filteredRecords.length} records)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Patient ID</TableHead>
                      <TableHead>Patient Name</TableHead>
                      <TableHead>Age/Gender</TableHead>
                      <TableHead>Department</TableHead>
                      <TableHead>Doctor</TableHead>
                      <TableHead>Visit Date</TableHead>
                      <TableHead>Diagnosis</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Payment</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredRecords.map((record) => (
                      <TableRow key={record.id}>
                        <TableCell className="font-medium">{record.patientId}</TableCell>
                        <TableCell>{record.patientName}</TableCell>
                        <TableCell>{record.age}Y / {record.gender}</TableCell>
                        <TableCell>{record.department}</TableCell>
                        <TableCell>{record.doctor}</TableCell>
                        <TableCell>{record.visitDate}</TableCell>
                        <TableCell>{record.diagnosis}</TableCell>
                        <TableCell>
                          <Badge variant={
                            record.status === 'Completed' ? 'default' :
                            record.status === 'In Progress' ? 'secondary' : 'destructive'
                          }>
                            {record.status}
                          </Badge>
                        </TableCell>
                        <TableCell>kSH {record.amount.toLocaleString()}</TableCell>
                        <TableCell>
                          <Badge variant={
                            record.paymentStatus === 'Paid' ? 'default' :
                            record.paymentStatus === 'Partial' ? 'secondary' : 'destructive'
                          }>
                            {record.paymentStatus}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="size-5" />
                  Department Statistics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={departmentStats}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="patients" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="size-5" />
                  Visit Status Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsPieChart>
                    <Pie
                      data={statusStats}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={100}
                      fill="hsl(var(--primary))"
                      dataKey="value"
                    >
                      {statusStats.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Gender Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsPieChart>
                    <Pie
                      data={genderStats}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={100}
                      fill="hsl(var(--primary))"
                      dataKey="value"
                    >
                      {genderStats.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Department Revenue</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={departmentStats}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="revenue" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="export" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Download className="size-5" />
                Export Options
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button 
                  onClick={() => handleExport('pdf')} 
                  disabled={loading}
                  className="h-20 flex flex-col items-center justify-center"
                >
                  <FileText className="size-6 mb-2" />
                  Export as PDF
                </Button>
                <Button 
                  onClick={() => handleExport('excel')} 
                  disabled={loading}
                  variant="outline"
                  className="h-20 flex flex-col items-center justify-center"
                >
                  <BarChart3 className="size-6 mb-2" />
                  Export as Excel
                </Button>
                <Button 
                  onClick={() => handleExport('csv')} 
                  disabled={loading}
                  variant="outline"
                  className="h-20 flex flex-col items-center justify-center"
                >
                  <FileText className="size-6 mb-2" />
                  Export as CSV
                </Button>
              </div>
              
              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-medium mb-2">Export Summary</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Date Range:</span>
                    <p>{dateFrom} to {dateTo}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Total Records:</span>
                    <p>{filteredRecords.length}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Department:</span>
                    <p>{selectedDepartment === 'all' ? 'All Departments' : selectedDepartment}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Doctor:</span>
                    <p>{selectedDoctor === 'all' ? 'All Doctors' : selectedDoctor}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}