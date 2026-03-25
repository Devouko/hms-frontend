import { motion } from 'framer-motion';
import { Users, Calendar, Stethoscope, Bed, TrendingUp, Activity } from 'lucide-react';
import { GlassCard } from './ui/glass-card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { AIInsightPanel } from './AIInsightPanel';

export function Dashboard() {
  const stats = [
    { label: 'Total Patients', value: '1,234', change: '+12%', icon: Users, color: 'bg-primary/15 text-primary' },
    { label: 'Appointments Today', value: '48', change: '+5%', icon: Calendar, color: 'bg-secondary/50 text-primary' },
    { label: 'Active Doctors', value: '56', change: '+2%', icon: Stethoscope, color: 'bg-accent/50 text-primary' },
    { label: 'Available Beds', value: '23/100', change: '-8%', icon: Bed, color: 'bg-muted text-primary' },
  ];

  const appointmentData = [
    { day: 'Mon', appointments: 45 },
    { day: 'Tue', appointments: 52 },
    { day: 'Wed', appointments: 48 },
    { day: 'Thu', appointments: 61 },
    { day: 'Fri', appointments: 55 },
    { day: 'Sat', appointments: 38 },
    { day: 'Sun', appointments: 25 },
  ];

  const patientData = [
    { month: 'Jan', patients: 240 },
    { month: 'Feb', patients: 280 },
    { month: 'Mar', patients: 320 },
    { month: 'Apr', patients: 380 },
    { month: 'May', patients: 420 },
    { month: 'Jun', patients: 450 },
  ];

  const departmentData = [
    { name: 'Cardiology', value: 30 },
    { name: 'Neurology', value: 25 },
    { name: 'Orthopedics', value: 20 },
    { name: 'Pediatrics', value: 15 },
    { name: 'Others', value: 10 },
  ];

  // Get CSS variables for chart colors
  const getChartColors = () => {
    if (typeof window === 'undefined') return ['hsl(221.2 83.2% 53.3%)'];
    const style = getComputedStyle(document.documentElement);
    return [
      `hsl(${style.getProperty('--chart-1').trim()})`,
      `hsl(${style.getProperty('--chart-2').trim()})`,
      `hsl(${style.getProperty('--chart-3').trim()})`,
      `hsl(${style.getProperty('--chart-4').trim()})`,
      `hsl(${style.getProperty('--chart-5').trim()})`,
    ];
  };

  const COLORS = getChartColors();

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              <GlassCard className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                    <h3 className="text-3xl font-semibold text-foreground mb-2">{stat.value}</h3>
                    <div className="flex items-center gap-1">
                      <TrendingUp className="size-4 text-primary" />
                      <span className="text-sm text-primary">{stat.change}</span>
                    </div>
                  </div>
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className={`h-12 w-12 rounded-xl ${stat.color} flex items-center justify-center`}
                  >
                    <Icon className="size-6" />
                  </motion.div>
                </div>
              </GlassCard>
            </motion.div>
          );
        })}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Appointments */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <GlassCard className="p-6">
            <div className="flex items-center gap-2 mb-6">
              <Activity className="size-5 text-primary" />
              <h3 className="text-lg font-semibold text-foreground">Weekly Appointments</h3>
            </div>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={appointmentData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    color: 'hsl(var(--card-foreground))'
                  }}
                />
                <Bar dataKey="appointments" fill={COLORS[0]} radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </GlassCard>
        </motion.div>

        {/* Patient Growth */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <GlassCard className="p-6">
            <div className="flex items-center gap-2 mb-6">
              <TrendingUp className="size-5 text-primary" />
              <h3 className="text-lg font-semibold text-foreground">Patient Growth</h3>
            </div>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={patientData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    color: 'hsl(var(--card-foreground))'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="patients" 
                  stroke={COLORS[1]} 
                  strokeWidth={3}
                  dot={{ fill: COLORS[1], r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </GlassCard>
        </motion.div>
      </div>

      {/* Department Distribution & Recent Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Department Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <GlassCard className="p-6">
            <h3 className="text-lg font-semibold mb-6 text-foreground">Department Distribution</h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={departmentData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill={COLORS[0]}
                  dataKey="value"
                >
                  {departmentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    color: 'hsl(var(--card-foreground))'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </GlassCard>
        </motion.div>

        {/* Recent Activities */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <GlassCard className="p-6">
            <h3 className="text-lg font-semibold mb-6 text-foreground">Recent Activities</h3>
            <div className="space-y-4">
              {[
                { action: 'New patient registered', time: '5 min ago', color: 'bg-primary' },
                { action: 'Appointment scheduled', time: '12 min ago', color: 'bg-primary/80' },
                { action: 'Medical record updated', time: '25 min ago', color: 'bg-primary/60' },
                { action: 'Billing invoice created', time: '1 hour ago', color: 'bg-primary/40' },
                { action: 'Bed assigned to patient', time: '2 hours ago', color: 'bg-primary/20' },
              ].map((activity, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 + index * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <div className={`w-2 h-2 ${activity.color} rounded-full`} />
                  <div className="flex-1">
                    <p className="text-sm text-foreground">{activity.action}</p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </GlassCard>
        </motion.div>
      </div>

      {/* AI Insights Panel */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9 }}>
        <AIInsightPanel
          title="AI Hospital Insights"
          prompt={`Analyze this hospital dashboard data and provide 3-4 actionable insights:
- Total Patients: 1,234 (+12% this month)
- Appointments Today: 48 (+5%)
- Active Doctors: 56
- Bed Occupancy: 77/100 (77%)
- Top departments: Cardiology 30%, Neurology 25%, Orthopedics 20%, Pediatrics 15%
- Weekly appointments peak on Thursday (61), lowest Sunday (25)

Provide: 1) Key observations, 2) Potential risks, 3) Recommended actions for hospital management.`}
        />
      </motion.div>
    </div>
  );
}



