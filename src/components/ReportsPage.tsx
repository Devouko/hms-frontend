import { motion } from 'motion/react';
import { FileText, Download, Calendar, TrendingUp, Users, DollarSign, BarChart3, PieChart } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart as RechartsPieChart, Pie, Cell, AreaChart, Area } from 'recharts';

export function ReportsPage() {
  const reportTypes = [
    { icon: Users, title: 'Patient Reports', desc: 'Generate patient statistics and demographics', color: 'bg-primary' },
    { icon: Calendar, title: 'Appointment Reports', desc: 'View appointment trends and analytics', color: 'bg-primary' },
    { icon: DollarSign, title: 'Financial Reports', desc: 'Revenue, expenses, and billing reports', color: 'bg-yellow-500' },
    { icon: TrendingUp, title: 'Performance Reports', desc: 'System and staff performance metrics', color: 'bg-primary' },
  ];

  // Sample data for charts
  const monthlyPatients = [
    { month: 'Jan', patients: 240, revenue: 45000 },
    { month: 'Feb', patients: 280, revenue: 52000 },
    { month: 'Mar', patients: 320, revenue: 61000 },
    { month: 'Apr', patients: 380, revenue: 68000 },
    { month: 'May', patients: 420, revenue: 72000 },
    { month: 'Jun', patients: 450, revenue: 78000 },
  ];

  const departmentStats = [
    { name: 'Cardiology', patients: 120, revenue: 25000 },
    { name: 'Neurology', patients: 95, revenue: 22000 },
    { name: 'Orthopedics', patients: 85, revenue: 18000 },
    { name: 'Pediatrics', patients: 75, revenue: 15000 },
    { name: 'General', patients: 65, revenue: 12000 },
  ];

  const appointmentTrends = [
    { day: 'Mon', scheduled: 45, completed: 42, cancelled: 3 },
    { day: 'Tue', scheduled: 52, completed: 48, cancelled: 4 },
    { day: 'Wed', scheduled: 48, completed: 45, cancelled: 3 },
    { day: 'Thu', scheduled: 61, completed: 58, cancelled: 3 },
    { day: 'Fri', scheduled: 55, completed: 52, cancelled: 3 },
    { day: 'Sat', scheduled: 38, completed: 35, cancelled: 3 },
    { day: 'Sun', scheduled: 25, completed: 23, cancelled: 2 },
  ];

  const patientDemographics = [
    { name: '0-18', value: 15, color: 'hsl(var(--primary))' },
    { name: '19-35', value: 30, color: 'hsl(var(--primary))' },
    { name: '36-50', value: 25, color: 'hsl(var(--primary))' },
    { name: '51-65', value: 20, color: 'hsl(var(--primary))' },
    { name: '65+', value: 10, color: 'hsl(var(--destructive))' },
  ];

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
          <FileText className="size-8 text-primary" />
          Reports & Analytics
        </h1>
        <p className="text-sm text-muted-foreground mt-1">Generate and download various system reports</p>
      </motion.div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="patients">Patients</TabsTrigger>
          <TabsTrigger value="appointments">Appointments</TabsTrigger>
          <TabsTrigger value="financial">Financial</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {reportTypes.map((report, index) => {
              const Icon = report.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className={`${report.color} p-3 rounded-lg`}>
                          <Icon className="size-6 text-card-foreground" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 mb-2">{report.title}</h3>
                          <p className="text-sm text-muted-foreground mb-4">{report.desc}</p>
                          <Button size="sm" variant="outline" className="gap-2">
                            <Download className="size-4" />
                            Generate Report
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>

          {/* Monthly Overview Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="size-5 text-primary" />
                Monthly Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={monthlyPatients}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Area yAxisId="left" type="monotone" dataKey="patients" stackId="1" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.6} />
                  <Line yAxisId="right" type="monotone" dataKey="revenue" stroke="hsl(var(--primary))" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="patients" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Patient Demographics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="size-5 text-primary" />
                  Patient Demographics by Age
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsPieChart>
                    <Pie
                      data={patientDemographics}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={100}
                      fill="hsl(var(--primary))"
                      dataKey="value"
                    >
                      {patientDemographics.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Department Statistics */}
            <Card>
              <CardHeader>
                <CardTitle>Department Statistics</CardTitle>
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
          </div>
        </TabsContent>

        <TabsContent value="appointments" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Weekly Appointment Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={appointmentTrends}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="scheduled" fill="hsl(var(--primary))" name="Scheduled" />
                  <Bar dataKey="completed" fill="hsl(var(--primary))" name="Completed" />
                  <Bar dataKey="cancelled" fill="hsl(var(--destructive))" name="Cancelled" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="financial" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Revenue Trend */}
            <Card>
              <CardHeader>
                <CardTitle>Revenue Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={monthlyPatients}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="revenue" stroke="hsl(var(--primary))" strokeWidth={3} dot={{ fill: 'hsl(var(--primary))', r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Department Revenue */}
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
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>Recent Reports</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { name: 'Monthly Patient Report - January 2024', date: '2024-01-31', size: '2.4 MB' },
              { name: 'Financial Summary Q4 2023', date: '2024-01-15', size: '1.8 MB' },
              { name: 'Appointment Analytics - December', date: '2024-01-05', size: '3.1 MB' },
            ].map((report, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50"
              >
                <div className="flex items-center gap-3">
                  <FileText className="size-5 text-primary" />
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{report.name}</p>
                    <p className="text-xs text-muted-foreground">{report.date} • {report.size}</p>
                  </div>
                </div>
                <Button size="sm" variant="ghost">
                  <Download className="size-4" />
                </Button>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
