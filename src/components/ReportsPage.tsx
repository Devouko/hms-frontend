import { motion } from 'motion/react';
import { FileText, Download, Calendar, TrendingUp, Users, DollarSign } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';

export function ReportsPage() {
  const reportTypes = [
    { icon: Users, title: 'Patient Reports', desc: 'Generate patient statistics and demographics', color: 'bg-blue-500' },
    { icon: Calendar, title: 'Appointment Reports', desc: 'View appointment trends and analytics', color: 'bg-green-500' },
    { icon: DollarSign, title: 'Financial Reports', desc: 'Revenue, expenses, and billing reports', color: 'bg-yellow-500' },
    { icon: TrendingUp, title: 'Performance Reports', desc: 'System and staff performance metrics', color: 'bg-purple-500' },
  ];

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
          <FileText className="size-8 text-primary" />
          Reports & Analytics
        </h1>
        <p className="text-sm text-gray-600 mt-1">Generate and download various system reports</p>
      </motion.div>

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
                      <Icon className="size-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-2">{report.title}</h3>
                      <p className="text-sm text-gray-600 mb-4">{report.desc}</p>
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
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
              >
                <div className="flex items-center gap-3">
                  <FileText className="size-5 text-primary" />
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{report.name}</p>
                    <p className="text-xs text-gray-600">{report.date} • {report.size}</p>
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
