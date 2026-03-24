import { motion } from 'framer-motion';
import { UserCog, Users, Briefcase, Award } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

interface EmployeePageProps {
  session: any;
}

export function EmployeePage({ session }: EmployeePageProps) {
  const stats = [
    { label: 'Total Employees', value: '156', icon: Users, color: 'from-blue-500 to-blue-600' },
    { label: 'Doctors', value: '56', icon: UserCog, color: 'from-teal-500 to-teal-600' },
    { label: 'Nurses', value: '78', icon: Briefcase, color: 'from-purple-500 to-purple-600' },
    { label: 'Admin Staff', value: '22', icon: Award, color: 'from-orange-500 to-orange-600' },
  ];

  const employees = [
    { name: 'Dr. Sarah Johnson', role: 'Cardiologist', department: 'Cardiology', status: 'Active' },
    { name: 'Dr. Michael Chen', role: 'Neurologist', department: 'Neurology', status: 'Active' },
    { name: 'Dr. Emily Brown', role: 'Pediatrician', department: 'Pediatrics', status: 'On Leave' },
    { name: 'Nurse Jennifer Davis', role: 'Head Nurse', department: 'ICU', status: 'Active' },
    { name: 'Dr. James Wilson', role: 'Orthopedic', department: 'Orthopedics', status: 'Active' },
  ];

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className="text-gray-900 mb-2">Employee Management</h2>
        <p className="text-muted-foreground text-sm">Manage hospital staff and personnel</p>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`bg-gradient-to-br ${stat.color} p-3 rounded-xl`}>
                      <Icon className="size-6 text-card-foreground" />
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                  <h3 className="text-gray-900">{stat.value}</h3>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Employees List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Staff Directory</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {employees.map((employee, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + index * 0.05 }}
                  className="flex items-center justify-between p-4 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-teal-400 to-teal-600 rounded-full flex items-center justify-center text-card-foreground">
                      {employee.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <p className="text-gray-900">{employee.name}</p>
                      <p className="text-sm text-muted-foreground">{employee.role} • {employee.department}</p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    employee.status === 'Active' 
                      ? 'bg-green-100 text-primary' 
                      : 'bg-orange-100 text-primary'
                  }`}>
                    {employee.status}
                  </span>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}



