import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  Calendar as CalendarIcon,
  Phone,
  Scissors,
  Users,
  TrendingUp,
  TrendingDown,
  Plus,
  ExternalLink,
  MoreVertical,
  Building2,
  Bed,
  AlertCircle,
  UserPlus,
  CalendarPlus,
  FileText,
  DollarSign,
  ClipboardList,
  UserCheck,
  Activity,
  ArrowRight,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { GlassCard } from './ui/glass-card';
import { Button } from './ui/button';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { projectId, publicAnonKey } from '../utils/supabase/info';
import { TodoListWidget } from './TodoListWidget';

interface NewDashboardProps {
  session: any;
}

export function NewDashboard({ session }: NewDashboardProps) {
  const [statistics, setStatistics] = useState<any>(null);
  const userName = session?.user?.user_metadata?.name || 'User';

  useEffect(() => {
    fetchStatistics();
  }, []);

  const fetchStatistics = async () => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-d8a3a34f/statistics`,
        {
          headers: {
            Authorization: `Bearer ${session?.access_token}`,
          },
        }
      );
      const data = await response.json();
      setStatistics(data.statistics);
    } catch (error) {
      console.error('Error fetching statistics:', error);
    }
  };

  const statsCards = [
    {
      label: 'Appointments',
      value: statistics?.appointments || 1250,
      change: '+4.8%',
      trend: 'up',
      icon: CalendarIcon,
      color: 'from-primary to-primary/90',
      iconBg: 'bg-primary/10',
      iconColor: 'text-primary',
    },
    {
      label: 'Call consultancy',
      value: statistics?.callConsultancy || 1002,
      change: '+4.0%',
      trend: 'up',
      icon: Phone,
      color: 'from-primary to-primary/80',
      iconBg: 'bg-primary/10',
      iconColor: 'text-primary',
    },
    {
      label: 'Surgeries',
      value: statistics?.surgeries || 60,
      change: '+25%',
      trend: 'up',
      icon: Scissors,
      color: 'from-primary to-primary/80',
      iconBg: 'bg-primary/10',
      iconColor: 'text-primary',
    },
    {
      label: 'Total patient',
      value: statistics?.totalPatients || 1835,
      change: '+2.1%',
      trend: 'up',
      icon: Users,
      color: 'from-primary to-primary/90',
      iconBg: 'bg-primary/10',
      iconColor: 'text-primary',
    },
  ];

  const chartData = [
    { month: 'JAN', total: 800, inpatient: 400 },
    { month: 'FEB', total: 900, inpatient: 500 },
    { month: 'MAR', total: 1100, inpatient: 600 },
    { month: 'APR', total: 1000, inpatient: 550 },
    { month: 'MAY', total: 1300, inpatient: 700 },
    { month: 'JUN', total: 1500, inpatient: 800 },
    { month: 'JUL', total: 1856, inpatient: 900 },
    { month: 'Aug', total: 1600, inpatient: 850 },
    { month: 'Sep', total: 1400, inpatient: 750 },
    { month: 'Oct', total: 1500, inpatient: 800 },
    { month: 'Nov', total: 1700, inpatient: 900 },
    { month: 'Dec', total: 1800, inpatient: 950 },
  ];

  const incomeData = [
    { month: 'Jan', value: 8000000 },
    { month: 'Feb', value: 8200000 },
    { month: 'Mar', value: 8100000 },
    { month: 'Apr', value: 8300000 },
    { month: 'May', value: 8135450 },
  ];

  const expenseData = [
    { month: 'Jan', value: 7800000 },
    { month: 'Feb', value: 7900000 },
    { month: 'Mar', value: 7850000 },
    { month: 'Apr', value: 7950000 },
    { month: 'May', value: 7999000 },
  ];

  const todayAppointments = [
    { time: '09:00', title: 'Dentist meetup', duration: '09:00am - 11:00pm' },
    { time: '10:00', title: '', duration: '' },
    { time: '11:00', title: '', duration: '' },
    { time: '12:00', title: 'Procedures', duration: '12:00pm - 04:00pm' },
    { time: '01:00', title: '', duration: '' },
  ];

  const currentDate = new Date();
  const weekDays = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat'];

  const reports = [
    { title: 'A shower broken in room 123...', time: '1 minute ago' },
    { title: 'A shower broken in room 123...', time: '1 minute ago' },
  ];

  const balance = statistics ? ((statistics.income / (statistics.income + statistics.expense)) * 100).toFixed(0) : 87;
  const roomOccupancy = statistics?.roomOccupancy || { general: 124, private: 52 };
  const totalRooms = roomOccupancy.general + roomOccupancy.private;

  const frontOfficeActions = [
    {
      title: 'Patient Registration',
      description: 'Register new patients',
      icon: UserPlus,
      color: 'bg-primary',
      action: 'register',
    },
    {
      title: 'New Appointment',
      description: 'Schedule appointments',
      icon: CalendarPlus,
      color: 'bg-primary',
      action: 'appointment',
    },
    {
      title: 'Generate Invoice',
      description: 'Create billing invoice',
      icon: FileText,
      color: 'bg-primary',
      action: 'invoice',
    },
    {
      title: 'Admit Patient',
      description: 'Patient admission process',
      icon: UserCheck,
      color: 'bg-primary',
      action: 'admit',
    },
    {
      title: 'OPD Queue',
      description: 'Outpatient department',
      icon: ClipboardList,
      color: 'bg-pink-500',
      action: 'opd',
    },
    {
      title: 'Billing Center',
      description: 'Payment & transactions',
      icon: DollarSign,
      color: 'bg-primary',
      action: 'billing',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Greeting */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-gray-900">Hello, {userName} 👋</h1>
        <p className="text-muted-foreground text-sm mt-1">
          There is the latest update for the last 7 days. check now
        </p>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {statsCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <GlassCard className="p-6 hover:bg-card/75 transition-all">
                <div className="flex items-start justify-between mb-4">
                  <div className={`${stat.iconBg} p-3 rounded-xl`}>
                    <Icon className={`size-6 ${stat.iconColor}`} />
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                  <div className="flex items-end justify-between">
                    <h3 className="text-3xl font-semibold text-foreground">{stat.value.toLocaleString()}</h3>
                    <div className="flex items-center gap-1 text-sm">
                      {stat.trend === 'up' ? (
                        <TrendingUp className="size-4 text-primary" />
                      ) : (
                        <TrendingDown className="size-4 text-destructive" />
                      )}
                      <span className={stat.trend === 'up' ? 'text-primary' : 'text-destructive'}>
                        {stat.change}
                      </span>
                      <span className="text-muted-foreground text-xs">from last week</span>
                    </div>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          );
        })}
      </div>

      {/* Workflow Status Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <GlassCard className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold">Patient Workflow Status</h3>
              <p className="text-sm text-muted-foreground mt-1">Real-time patient journey tracking across departments</p>
            </div>
            <Activity className="size-5 text-primary" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="text-center p-4 bg-blue-50/50 rounded-lg">
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mx-auto mb-2">
                <UserPlus className="size-6 text-card-foreground" />
              </div>
              <p className="text-2xl text-primary mb-1">12</p>
              <p className="text-xs text-muted-foreground">Registered</p>
            </div>
            <div className="text-center p-4 bg-green-50/50 rounded-lg">
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mx-auto mb-2">
                <CalendarIcon className="size-6 text-card-foreground" />
              </div>
              <p className="text-2xl text-primary mb-1">8</p>
              <p className="text-xs text-muted-foreground">In Queue</p>
            </div>
            <div className="text-center p-4 bg-yellow-50/50 rounded-lg">
              <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-2">
                <Activity className="size-6 text-card-foreground" />
              </div>
              <p className="text-2xl text-yellow-600 mb-1">5</p>
              <p className="text-xs text-muted-foreground">In Consultation</p>
            </div>
            <div className="text-center p-4 bg-purple-50/50 rounded-lg">
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mx-auto mb-2">
                <FileText className="size-6 text-card-foreground" />
              </div>
              <p className="text-2xl text-primary mb-1">3</p>
              <p className="text-xs text-muted-foreground">Lab/Pharmacy</p>
            </div>
            <div className="text-center p-4 bg-teal-50/50 rounded-lg">
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mx-auto mb-2">
                <DollarSign className="size-6 text-card-foreground" />
              </div>
              <p className="text-2xl text-primary mb-1">15</p>
              <p className="text-xs text-muted-foreground">Completed</p>
            </div>
          </div>
        </GlassCard>
      </motion.div>

      {/* Front Office Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <GlassCard className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold">Front Office - Quick Actions</h3>
              <p className="text-sm text-muted-foreground mt-1">Common front office operations for faster workflow</p>
            </div>
            <Activity className="size-5 text-primary" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {frontOfficeActions.map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.button
                  key={item.action}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + index * 0.05 }}
                  className="flex items-start gap-4 p-4 bg-card/40 backdrop-blur-sm rounded-xl hover:bg-card/60 transition-all group"
                >
                  <div className={`${item.color} p-3 rounded-lg text-card-foreground`}>
                    <Icon className="size-6" />
                  </div>
                  <div className="flex-1 text-left">
                    <h4 className="text-sm text-foreground mb-1 group-hover:text-primary transition-colors">{item.title}</h4>
                    <p className="text-xs text-muted-foreground">{item.description}</p>
                  </div>
                  <ArrowRight className="size-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                </motion.button>
              );
            })}
          </div>
        </GlassCard>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Patient Statistics Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="lg:col-span-2"
        >
          <GlassCard className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold">Patient statistics</h3>
              <div className="flex items-center gap-4">
                <div className="flex gap-4 text-sm">
                  <button className="px-3 py-1 rounded hover:bg-card/40">Week</button>
                  <button className="px-3 py-1 rounded hover:bg-card/40">Month</button>
                  <button className="px-3 py-1 rounded bg-card/40">Year-2022</button>
                </div>
              </div>
            </div>
            <div className="w-full h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" stroke="#888" />
                  <YAxis stroke="#888" />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="total"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="inpatient"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    dot={{ fill: '#55c4ed', r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="flex items-center justify-center gap-6 mt-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-gray-800"></div>
                <span className="text-muted-foreground">Total patients</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-primary"></div>
                <span className="text-muted-foreground">Inpatients</span>
              </div>
            </div>
          </GlassCard>
        </motion.div>

        {/* Calendar & Today's Appointments */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm">Today 4th Sep 2023</CardTitle>
                <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                  <Plus className="size-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {/* Mini Calendar */}
              <div className="grid grid-cols-7 gap-2 mb-6">
                {weekDays.map((day, i) => (
                  <div key={day} className="text-center">
                    <div className="text-xs text-muted-foreground mb-2">{day}</div>
                    <div
                      className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm ${
                        i === 3
                          ? 'bg-primary text-card-foreground'
                          : 'text-foreground hover:bg-muted cursor-pointer'
                      }`}
                    >
                      {i + 3}
                    </div>
                  </div>
                ))}
              </div>

              {/* Time Slots */}
              <div className="space-y-3">
                {todayAppointments.map((apt, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <span className="text-xs text-muted-foreground w-12">{apt.time}</span>
                    {apt.title ? (
                      <div className="flex-1 bg-gradient-to-r from-primary/10 to-primary/20 border-l-4 border-primary rounded-lg p-3">
                        <p className="text-sm text-gray-900">{apt.title}</p>
                        <p className="text-xs text-muted-foreground mt-1">{apt.duration}</p>
                      </div>
                    ) : (
                      <div className="flex-1 border-l-2 border-border pl-3 h-8"></div>
                    )}
                    {apt.title && (
                      <button className="p-1 hover:bg-muted rounded">
                        <MoreVertical className="size-4 text-muted-foreground" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Balance */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm">Balance</CardTitle>
                <button className="flex items-center gap-1 text-sm text-primary hover:text-primary/80">
                  <span>Open</span>
                  <ExternalLink className="size-4" />
                </button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center mb-6">
                <div className="relative w-32 h-32">
                  <svg className="w-32 h-32 transform -rotate-90">
                    <circle
                      cx="64"
                      cy="64"
                      r="56"
                      stroke="hsl(var(--border))"
                      strokeWidth="12"
                      fill="none"
                    />
                    <circle
                      cx="64"
                      cy="64"
                      r="56"
                      stroke="hsl(var(--primary))"
                      strokeWidth="12"
                      fill="none"
                      strokeDasharray={`${(Number(balance) / 100) * 352} 352`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-2xl text-gray-900">{balance}%</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Total Transaction Revenue</p>
                  <div className="flex items-center justify-between">
                    <h4 className="text-gray-900">${((statistics?.income || 8135450) / 1000000).toFixed(2)}M</h4>
                    <div className="w-20 h-8">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={incomeData}>
                          <Area type="monotone" dataKey="value" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.3} />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                  <p className="text-xs text-primary">Total income</p>
                </div>

                <div>
                  <div className="flex items-center justify-between">
                    <h4 className="text-gray-900">${((statistics?.expense || 7999000) / 1000000).toFixed(2)}M</h4>
                    <div className="w-20 h-8">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={expenseData}>
                          <Area type="monotone" dataKey="value" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.3} />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">Total expense</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Room Occupancy */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm">Room occupancy</CardTitle>
                <button>
                  <MoreVertical className="size-4 text-muted-foreground" />
                </button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline gap-2 mb-6">
                <h2 className="text-gray-900">{totalRooms}</h2>
                <span className="text-sm text-success">+12%</span>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-primary/10 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="bg-primary p-2 rounded-lg">
                      <Building2 className="size-5 text-card-foreground" />
                    </div>
                    <span className="text-sm text-foreground">General room</span>
                  </div>
                  <span className="text-gray-900">{roomOccupancy.general}</span>
                </div>

                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="bg-gray-600 p-2 rounded-lg">
                      <Bed className="size-5 text-card-foreground" />
                    </div>
                    <span className="text-sm text-foreground">Private room</span>
                  </div>
                  <span className="text-gray-900">{roomOccupancy.private}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Reports */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
        >
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm">Reports</CardTitle>
                <button>
                  <MoreVertical className="size-4 text-muted-foreground" />
                </button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {reports.map((report, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors cursor-pointer">
                    <div className="bg-warning/20 p-2 rounded-lg">
                      <AlertCircle className="size-4 text-warning" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-900 mb-1">{report.title}</p>
                      <p className="text-xs text-muted-foreground">{report.time}</p>
                    </div>
                    <button className="text-sm text-primary hover:text-primary/80">
                      View report →
                    </button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Todo List Widget */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
        >
          <TodoListWidget session={session} maxItems={4} />
        </motion.div>
      </div>
    </div>
  );
}