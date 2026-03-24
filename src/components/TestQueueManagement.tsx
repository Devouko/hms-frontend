import { useState } from 'react';
import { motion } from 'framer-motion';
import { ClipboardList, Clock, AlertCircle, User, ArrowUp, ArrowDown } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { toast } from 'sonner';

interface QueueTest {
  id: string;
  patientName: string;
  testType: string;
  priority: 'routine' | 'urgent' | 'stat';
  orderTime: string;
  estimatedTime: number; // minutes
  assignedTo?: string;
  status: 'waiting' | 'in-progress' | 'completed';
  category: string;
}

export function TestQueueManagement() {
  const [queue, setQueue] = useState<QueueTest[]>([
    {
      id: '1',
      patientName: 'John Smith',
      testType: 'CBC',
      priority: 'stat',
      orderTime: '08:30',
      estimatedTime: 15,
      status: 'waiting',
      category: 'Hematology',
    },
    {
      id: '2',
      patientName: 'Emily Davis',
      testType: 'Lipid Panel',
      priority: 'routine',
      orderTime: '09:00',
      estimatedTime: 20,
      status: 'in-progress',
      assignedTo: 'Tech A',
      category: 'Chemistry',
    },
    {
      id: '3',
      patientName: 'Michael Brown',
      testType: 'Thyroid Panel',
      priority: 'urgent',
      orderTime: '09:15',
      estimatedTime: 25,
      status: 'waiting',
      category: 'Chemistry',
    },
    {
      id: '4',
      patientName: 'Sarah Wilson',
      testType: 'Urinalysis',
      priority: 'routine',
      orderTime: '09:30',
      estimatedTime: 10,
      status: 'waiting',
      category: 'Microbiology',
    },
  ]);

  const technicians = ['Tech A', 'Tech B', 'Tech C', 'Available'];

  const handleAssignTest = (testId: string, technician: string) => {
    setQueue(queue.map(test => 
      test.id === testId 
        ? { ...test, assignedTo: technician, status: 'in-progress' as const }
        : test
    ));
    toast.success(`Test assigned to ${technician}!`);
  };

  const handleCompleteTest = (testId: string) => {
    setQueue(queue.map(test => 
      test.id === testId 
        ? { ...test, status: 'completed' as const }
        : test
    ));
    toast.success('Test marked as completed!');
  };

  const handlePriorityChange = (testId: string, newPriority: QueueTest['priority']) => {
    setQueue(queue.map(test => 
      test.id === testId 
        ? { ...test, priority: newPriority }
        : test
    ));
    toast.success(`Priority updated to ${newPriority}!`);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'stat': return 'bg-red-100 text-destructive';
      case 'urgent': return 'bg-orange-100 text-primary';
      case 'routine': return 'bg-muted text-foreground';
      default: return 'bg-muted text-foreground';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'waiting': return 'bg-yellow-100 text-yellow-700';
      case 'in-progress': return 'bg-blue-100 text-primary';
      case 'completed': return 'bg-green-100 text-primary';
      default: return 'bg-muted text-foreground';
    }
  };

  const sortedQueue = [...queue].sort((a, b) => {
    const priorityOrder = { stat: 3, urgent: 2, routine: 1 };
    return priorityOrder[b.priority] - priorityOrder[a.priority];
  });

  const queueStats = {
    waiting: queue.filter(t => t.status === 'waiting').length,
    inProgress: queue.filter(t => t.status === 'in-progress').length,
    completed: queue.filter(t => t.status === 'completed').length,
    stat: queue.filter(t => t.priority === 'stat').length,
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl text-gray-900">Test Queue Management</h1>
        <p className="text-muted-foreground">Manage test queue and assign to technicians</p>
      </div>

      {/* Queue Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-yellow-600">{queueStats.waiting}</div>
            <div className="text-sm text-muted-foreground">Waiting</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">{queueStats.inProgress}</div>
            <div className="text-sm text-muted-foreground">In Progress</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">{queueStats.completed}</div>
            <div className="text-sm text-muted-foreground">Completed</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-destructive">{queueStats.stat}</div>
            <div className="text-sm text-muted-foreground">STAT Priority</div>
          </CardContent>
        </Card>
      </div>

      {/* Test Queue */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ClipboardList className="size-5 text-primary" />
            Test Queue (Priority Sorted)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {sortedQueue.map((test, index) => (
              <motion.div
                key={test.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="p-4 border rounded-lg hover:shadow-md transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <div className="text-lg font-bold text-primary">#{index + 1}</div>
                      <div className="text-xs text-muted-foreground">Queue</div>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-sm font-semibold">{test.patientName}</p>
                        <Badge className={getPriorityColor(test.priority)}>
                          {test.priority.toUpperCase()}
                        </Badge>
                        <Badge className={getStatusColor(test.status)}>
                          {test.status}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">{test.testType} • {test.category}</p>
                      <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="size-3" />
                          Ordered: {test.orderTime}
                        </span>
                        <span>Est: {test.estimatedTime}min</span>
                        {test.assignedTo && (
                          <span className="flex items-center gap-1">
                            <User className="size-3" />
                            {test.assignedTo}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Priority Controls */}
                    <div className="flex flex-col gap-1">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handlePriorityChange(test.id, 'stat')}
                        disabled={test.priority === 'stat'}
                      >
                        <ArrowUp className="size-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handlePriorityChange(test.id, 'routine')}
                        disabled={test.priority === 'routine'}
                      >
                        <ArrowDown className="size-3" />
                      </Button>
                    </div>

                    {/* Assignment */}
                    {test.status === 'waiting' && (
                      <select
                        onChange={(e) => handleAssignTest(test.id, e.target.value)}
                        className="px-2 py-1 border rounded text-sm"
                        defaultValue=""
                      >
                        <option value="" disabled>Assign to...</option>
                        {technicians.map(tech => (
                          <option key={tech} value={tech}>{tech}</option>
                        ))}
                      </select>
                    )}

                    {/* Complete */}
                    {test.status === 'in-progress' && (
                      <Button
                        size="sm"
                        onClick={() => handleCompleteTest(test.id)}
                      >
                        Complete
                      </Button>
                    )}

                    {test.status === 'completed' && (
                      <Badge className="bg-green-100 text-primary">
                        ✓ Done
                      </Badge>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

