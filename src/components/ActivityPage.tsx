import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Activity, Clock, User, FileText } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

export function ActivityPage() {
  const [activities, setActivities] = useState([
    { id: 1, user: 'Dr. Smith', action: 'Updated patient record', time: '5 minutes ago', type: 'update' },
    { id: 2, user: 'Nurse Johnson', action: 'Added new medication', time: '15 minutes ago', type: 'create' },
    { id: 3, user: 'Admin', action: 'Modified system settings', time: '1 hour ago', type: 'settings' },
    { id: 4, user: 'Dr. Williams', action: 'Completed appointment', time: '2 hours ago', type: 'complete' },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate new activity
      const newActivity = {
        id: Date.now(),
        user: ['Dr. Smith', 'Nurse Johnson', 'Admin', 'Dr. Williams'][Math.floor(Math.random() * 4)],
        action: ['Updated patient record', 'Added medication', 'Modified settings', 'Completed appointment'][Math.floor(Math.random() * 4)],
        time: 'Just now',
        type: 'update'
      };
      setActivities(prev => [newActivity, ...prev.slice(0, 9)]);
    }, 15000); // Add new activity every 15 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
          <Activity className="size-8 text-primary" />
          Activity Log
        </h1>
        <p className="text-sm text-muted-foreground mt-1">Track all system activities and user actions</p>
      </motion.div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CardTitle>Recent Activities</CardTitle>
              <div className="flex items-center gap-2 text-xs text-primary">
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                Live Updates
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {activities.map((activity, index) => (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center gap-4 p-4 border rounded-lg hover:bg-muted/50"
              >
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                  <FileText className="size-5 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-900">{activity.user}</p>
                  <p className="text-sm text-muted-foreground">{activity.action}</p>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Clock className="size-4" />
                  {activity.time}
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
