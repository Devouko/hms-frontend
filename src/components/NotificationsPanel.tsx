import { useState } from 'react';
import { Bell, Mail, User, Calendar, DollarSign, Settings as SettingsIcon, X, Activity, Stethoscope, FlaskConical, Pill } from 'lucide-react';
import { Button } from './ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from './ui/sheet';
import { Switch } from './ui/switch';
import { Label } from './ui/label';

interface Notification {
  id: string;
  type: 'email' | 'patient' | 'appointment' | 'system' | 'billing' | 'workflow' | 'lab' | 'pharmacy';
  title: string;
  message: string;
  time: string;
  read: boolean;
}

export function NotificationsPanel() {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'appointment',
      title: 'Patient Ready for Consultation',
      message: 'John Smith is checked in and waiting',
      time: '2 min ago',
      read: false,
    },
    {
      id: '2',
      type: 'patient',
      title: 'Lab Results Available',
      message: 'Blood test results ready for Sarah Johnson',
      time: '10 min ago',
      read: false,
    },
    {
      id: '3',
      type: 'billing',
      title: 'Prescription Ready',
      message: 'Medication ready for dispensing - Michael Brown',
      time: '15 min ago',
      read: false,
    },
    {
      id: '4',
      type: 'system',
      title: 'Workflow Alert',
      message: '5 patients pending lab test completion',
      time: '30 min ago',
      read: false,
    },
    {
      id: '5',
      type: 'billing',
      title: 'Payment Collected',
      message: 'Bill payment received for Emily Davis',
      time: '1 hour ago',
      read: true,
    },
  ]);

  const [settings, setSettings] = useState({
    emailNotifications: true,
    patientUpdates: true,
    appointmentReminders: true,
    systemUpdates: false,
    billingAlerts: true,
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'email': return <Mail className="size-4" />;
      case 'patient': return <User className="size-4" />;
      case 'appointment': return <Calendar className="size-4" />;
      case 'system': return <SettingsIcon className="size-4" />;
      case 'billing': return <DollarSign className="size-4" />;
      case 'workflow': return <Activity className="size-4" />;
      case 'lab': return <FlaskConical className="size-4" />;
      case 'pharmacy': return <Pill className="size-4" />;
      default: return <Bell className="size-4" />;
    }
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <button className="relative p-2 hover:bg-muted rounded-lg transition-colors">
          <Bell className="size-5 text-muted-foreground" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full"></span>
          )}
        </button>
      </SheetTrigger>
      <SheetContent className="w-96">
        <SheetHeader>
          <SheetTitle>Notifications</SheetTitle>
        </SheetHeader>
        
        <div className="mt-6 space-y-4">
          {/* Notifications List */}
          <div className="space-y-2">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium">Recent</h3>
              {notifications.length > 0 && (
                <Button variant="ghost" size="sm" onClick={clearAll} className="text-xs">
                  Clear all
                </Button>
              )}
            </div>
            
            {notifications.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Bell className="size-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No notifications</p>
              </div>
            ) : (
              <div className="space-y-2">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-3 rounded-lg border transition-all ${
                      notification.read 
                        ? 'bg-card border-border' 
                        : 'bg-primary/5 border-primary/20'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-lg ${
                        notification.type === 'billing' ? 'bg-warning/10 text-warning' :
                        notification.type === 'patient' ? 'bg-success/10 text-success' :
                        notification.type === 'appointment' ? 'bg-primary/10 text-primary' :
                        notification.type === 'workflow' ? 'bg-blue-100 text-primary' :
                        notification.type === 'lab' ? 'bg-purple-100 text-primary' :
                        notification.type === 'pharmacy' ? 'bg-green-100 text-primary' :
                        'bg-muted text-muted-foreground'
                      }`}>
                        {getIcon(notification.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">{notification.title}</p>
                        <p className="text-xs text-muted-foreground mt-1">{notification.message}</p>
                        <p className="text-xs text-muted-foreground mt-1">{notification.time}</p>
                      </div>
                      {!notification.read && (
                        <button
                          onClick={() => markAsRead(notification.id)}
                          className="text-muted-foreground hover:text-muted-foreground"
                        >
                          <X className="size-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Notification Settings */}
          <div className="border-t pt-4 mt-6">
            <h3 className="text-sm font-medium mb-3">Notification Settings</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Mail className="size-4 text-muted-foreground" />
                  <Label htmlFor="email" className="text-sm cursor-pointer">Email Notifications</Label>
                </div>
                <Switch
                  id="email"
                  checked={settings.emailNotifications}
                  onCheckedChange={(checked) => setSettings({ ...settings, emailNotifications: checked })}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <User className="size-4 text-muted-foreground" />
                  <Label htmlFor="patient" className="text-sm cursor-pointer">Patient Updates</Label>
                </div>
                <Switch
                  id="patient"
                  checked={settings.patientUpdates}
                  onCheckedChange={(checked) => setSettings({ ...settings, patientUpdates: checked })}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calendar className="size-4 text-muted-foreground" />
                  <Label htmlFor="appointment" className="text-sm cursor-pointer">Appointment Reminders</Label>
                </div>
                <Switch
                  id="appointment"
                  checked={settings.appointmentReminders}
                  onCheckedChange={(checked) => setSettings({ ...settings, appointmentReminders: checked })}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <SettingsIcon className="size-4 text-muted-foreground" />
                  <Label htmlFor="system" className="text-sm cursor-pointer">System Updates</Label>
                </div>
                <Switch
                  id="system"
                  checked={settings.systemUpdates}
                  onCheckedChange={(checked) => setSettings({ ...settings, systemUpdates: checked })}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <DollarSign className="size-4 text-muted-foreground" />
                  <Label htmlFor="billing" className="text-sm cursor-pointer">Billing Alerts</Label>
                </div>
                <Switch
                  id="billing"
                  checked={settings.billingAlerts}
                  onCheckedChange={(checked) => setSettings({ ...settings, billingAlerts: checked })}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Activity className="size-4 text-muted-foreground" />
                  <Label htmlFor="workflow" className="text-sm cursor-pointer">Workflow Updates</Label>
                </div>
                <Switch
                  id="workflow"
                  checked={settings.workflowUpdates || true}
                  onCheckedChange={(checked) => setSettings({ ...settings, workflowUpdates: checked })}
                />
              </div>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
