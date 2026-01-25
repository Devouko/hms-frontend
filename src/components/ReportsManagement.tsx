import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { BarChart3, FileText, Download, Calendar, Users, DollarSign } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Label } from './ui/label';

interface ReportsManagementProps {
  session: any;
}

export function ReportsManagement({ session }: ReportsManagementProps) {
  const [dateFrom, setDateFrom] = useState(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);
  const [dateTo, setDateTo] = useState(new Date().toISOString().split('T')[0]);
  const [reportData, setReportData] = useState({
    totalPatients: 0,
    totalAppointments: 0,
    totalRevenue: 0,
    pendingBills: 0,
    completedTests: 0,
    bloodUnits: 0
  });

  useEffect(() => {
    generateReportData();
  }, [dateFrom, dateTo]);

  const generateReportData = () => {
    try {
      const patients = JSON.parse(localStorage.getItem('hospital_patients') || '[]');
      const appointments = JSON.parse(localStorage.getItem('hospital_appointments') || '[]');
      const bills = JSON.parse(localStorage.getItem('hospital_bills') || '[]');
      const pathologyTests = JSON.parse(localStorage.getItem('hospital_pathology_tests') || '[]');
      const radiologyTests = JSON.parse(localStorage.getItem('hospital_radiology_tests') || '[]');
      const bloodBank = JSON.parse(localStorage.getItem('hospital_blood_bank') || '[]');

      const filteredAppointments = appointments.filter((apt: any) => 
        apt.date >= dateFrom && apt.date <= dateTo
      );
      
      const filteredBills = bills.filter((bill: any) => 
        bill.billDate >= dateFrom && bill.billDate <= dateTo
      );

      const completedTests = [...pathologyTests, ...radiologyTests].filter((test: any) => 
        test.status === 'Completed' && 
        (test.reportDate >= dateFrom && test.reportDate <= dateTo)
      );

      setReportData({
        totalPatients: patients.length,
        totalAppointments: filteredAppointments.length,
        totalRevenue: filteredBills.reduce((sum: number, bill: any) => sum + (bill.paidAmount || 0), 0),
        pendingBills: filteredBills.filter((bill: any) => bill.status === 'Pending').length,
        completedTests: completedTests.length,
        bloodUnits: bloodBank.reduce((sum: number, item: any) => sum + (item.quantity || 0), 0)
      });
    } catch (error) {
      console.error('Error generating report data:', error);
    }
  };

  const generateReport = (type: string) => {
    const reportContent = `
Hospital Management System Report
Report Type: ${type}
Date Range: ${dateFrom} to ${dateTo}
Generated: ${new Date().toLocaleString()}

Summary:
- Total Patients: ${reportData.totalPatients}
- Total Appointments: ${reportData.totalAppointments}
- Total Revenue: $${reportData.totalRevenue.toFixed(2)}
- Pending Bills: ${reportData.pendingBills}
- Completed Tests: ${reportData.completedTests}
- Blood Units Available: ${reportData.bloodUnits}
    `;

    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${type}_report_${dateFrom}_to_${dateTo}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const reportTypes = [
    { id: 'patient', name: 'Patient Report', icon: Users, description: 'Patient registration and demographics' },
    { id: 'appointment', name: 'Appointment Report', icon: Calendar, description: 'Appointment statistics and trends' },
    { id: 'financial', name: 'Financial Report', icon: DollarSign, description: 'Revenue and billing analysis' },
    { id: 'pathology', name: 'Pathology Report', icon: FileText, description: 'Lab test results and statistics' },
    { id: 'radiology', name: 'Radiology Report', icon: BarChart3, description: 'Imaging test statistics' },
    { id: 'inventory', name: 'Inventory Report', icon: FileText, description: 'Pharmacy and blood bank inventory' }
  ];

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Reports Management</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="space-y-2">
                <Label htmlFor="dateFrom">From Date</Label>
                <Input
                  id="dateFrom"
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dateTo">To Date</Label>
                <Input
                  id="dateTo"
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{reportData.totalPatients}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Appointments</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{reportData.totalAppointments}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Revenue</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${reportData.totalRevenue.toFixed(2)}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Pending Bills</CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{reportData.pendingBills}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Completed Tests</CardTitle>
                  <BarChart3 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{reportData.completedTests}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Blood Units</CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{reportData.bloodUnits}</div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {reportTypes.map((report) => {
                const Icon = report.icon;
                return (
                  <Card key={report.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-center space-x-2">
                        <Icon className="h-6 w-6 text-blue-600" />
                        <CardTitle className="text-lg">{report.name}</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600 mb-4">{report.description}</p>
                      <Button 
                        onClick={() => generateReport(report.id)}
                        className="w-full"
                      >
                        <Download className="size-4 mr-2" />
                        Generate Report
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}