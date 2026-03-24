import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, UserPlus, ClipboardList, Clock, CheckCircle, XCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { PatientRegistration } from './PatientRegistration';
import { VisitorManagement } from './VisitorManagement';
import { QueueManagement } from './QueueManagement';
import { projectId } from '../utils/supabase/info';

interface FrontOfficeProps {
  session: any;
}

export function FrontOffice({ session }: FrontOfficeProps) {
  const [stats, setStats] = useState({
    todayRegistrations: 0,
    activeVisitors: 0,
    queueLength: 0,
    completedToday: 0,
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-d8a3a34f/front-office/stats`,
        {
          headers: {
            Authorization: `Bearer ${session?.access_token}`,
          },
        }
      );
      const data = await response.json();
      setStats(data.stats || stats);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const statCards = [
    { title: 'Today Registrations', value: stats.todayRegistrations, icon: UserPlus, color: 'bg-primary' },
    { title: 'Active Visitors', value: stats.activeVisitors, icon: Users, color: 'bg-success' },
    { title: 'Queue Length', value: stats.queueLength, icon: Clock, color: 'bg-warning' },
    { title: 'Completed Today', value: stats.completedToday, icon: CheckCircle, color: 'bg-primary' },
  ];

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl text-gray-900 mb-6">Front Office Management</h1>

        <div className="grid grid-cols-4 gap-4 mb-6">
          {statCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">{stat.title}</p>
                        <p className="text-3xl mt-2">{stat.value}</p>
                      </div>
                      <div className={`${stat.color} p-3 rounded-xl text-card-foreground`}>
                        <Icon className="size-6" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        <Card>
          <CardContent className="p-6">
            <Tabs defaultValue="registration" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="registration">Patient Registration</TabsTrigger>
                <TabsTrigger value="visitors">Visitor Management</TabsTrigger>
                <TabsTrigger value="queue">Queue Management</TabsTrigger>
              </TabsList>
              <TabsContent value="registration">
                <PatientRegistration session={session} onUpdate={fetchStats} />
              </TabsContent>
              <TabsContent value="visitors">
                <VisitorManagement session={session} onUpdate={fetchStats} />
              </TabsContent>
              <TabsContent value="queue">
                <QueueManagement session={session} onUpdate={fetchStats} />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}


