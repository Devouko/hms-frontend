import { motion } from 'motion/react';
import { Settings, Bell, Lock, Globe, Database } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Input } from './ui/input';

export function SettingsPage() {
  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
          <Settings className="size-8 text-primary" />
          System Settings
        </h1>
        <p className="text-sm text-muted-foreground mt-1">Configure system preferences and settings</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="size-5" />
              General Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Hospital Name</Label>
              <Input defaultValue="SmartCare Hospital" />
            </div>
            <div>
              <Label>Time Zone</Label>
              <select className="w-full px-3 py-2 border rounded-lg">
                <option>UTC-5 (Eastern Time)</option>
                <option>UTC-6 (Central Time)</option>
                <option>UTC-7 (Mountain Time)</option>
                <option>UTC-8 (Pacific Time)</option>
              </select>
            </div>
            <Button className="bg-primary">Save Changes</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="size-5" />
              Notification Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Email Notifications</Label>
              <input type="checkbox" defaultChecked className="toggle" />
            </div>
            <div className="flex items-center justify-between">
              <Label>SMS Alerts</Label>
              <input type="checkbox" defaultChecked className="toggle" />
            </div>
            <div className="flex items-center justify-between">
              <Label>Push Notifications</Label>
              <input type="checkbox" className="toggle" />
            </div>
            <Button className="bg-primary">Save Changes</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="size-5" />
              Security Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Two-Factor Authentication</Label>
              <input type="checkbox" className="toggle" />
            </div>
            <div className="flex items-center justify-between">
              <Label>Session Timeout (minutes)</Label>
              <Input type="number" defaultValue="30" className="w-24" />
            </div>
            <Button className="bg-primary">Save Changes</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="size-5" />
              Backup Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Auto Backup</Label>
              <input type="checkbox" defaultChecked className="toggle" />
            </div>
            <div>
              <Label>Backup Frequency</Label>
              <select className="w-full px-3 py-2 border rounded-lg">
                <option>Daily</option>
                <option>Weekly</option>
                <option>Monthly</option>
              </select>
            </div>
            <Button className="bg-primary">Save Changes</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
