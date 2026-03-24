import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Settings, Building2, Bell, Mail, Phone, CreditCard, Globe, Shield, Users, Database, Languages, Grid3X3, Save } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Switch } from './ui/switch';
import { Separator } from './ui/separator';
import { Badge } from './ui/badge';
import { toast } from 'sonner';

interface GeneralSettings {
  hospitalName: string;
  address: string;
  phone: string;
  email: string;
  hospitalCode: string;
  language: string;
  isRtl: boolean;
  timezone: string;
  dateFormat: string;
  timeFormat: string;
  currency: string;
  currencySymbol: string;
  creditLimit: number;
  doctorRestriction: boolean;
  superadminVisibility: boolean;
}

export function SuperAdminSettings() {
  const [activeTab, setActiveTab] = useState('general');
  const [loading, setLoading] = useState(false);

  const [generalSettings, setGeneralSettings] = useState<GeneralSettings>({
    hospitalName: 'ROFAM TECH SERVICES',
    address: 'Your Hospital Address',
    phone: 'Your Hospital Phone',
    email: 'Your Hospital Email',
    hospitalCode: 'Your Hospital Code',
    language: 'English',
    isRtl: false,
    timezone: 'UTC',
    dateFormat: 'dd-mm-yyyy',
    timeFormat: '12',
    currency: 'KES',
    currencySymbol: 'kSH',
    creditLimit: 20000,
    doctorRestriction: false,
    superadminVisibility: true
  });

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Spanish' },
    { code: 'fr', name: 'French' },
    { code: 'de', name: 'German' },
    { code: 'ar', name: 'Arabic' },
    { code: 'hi', name: 'Hindi' }
  ];

  const timezones = [
    'UTC', 'EST', 'PST', 'GMT', 'IST', 'CET', 'JST', 'AEST'
  ];

  const currencies = [
    { code: 'USD', symbol: '$' },
    { code: 'EUR', symbol: '€' },
    { code: 'GBP', symbol: '£' },
    { code: 'KES', symbol: 'kSH' },
    { code: 'INR', symbol: '₹' },
    { code: 'JPY', symbol: '¥' }
  ];

  const handleSaveSettings = async (settingsType: string) => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success(`${settingsType} settings saved successfully`);
    } catch (error) {
      toast.error(`Failed to save ${settingsType} settings`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <Settings className="size-8 text-primary" />
              Super Admin Settings
            </h1>
            <p className="text-muted-foreground mt-1">Configure system-wide settings and preferences</p>
          </div>
        </div>
      </motion.div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5 lg:grid-cols-10">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="sms">SMS</TabsTrigger>
          <TabsTrigger value="email">Email</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
          <TabsTrigger value="cms">Front CMS</TabsTrigger>
          <TabsTrigger value="roles">Roles</TabsTrigger>
          <TabsTrigger value="backup">Backup</TabsTrigger>
          <TabsTrigger value="languages">Languages</TabsTrigger>
          <TabsTrigger value="modules">Modules</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="size-5" />
                General Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Hospital Name *</Label>
                  <Input
                    value={generalSettings.hospitalName}
                    onChange={(e) => setGeneralSettings(prev => ({ ...prev, hospitalName: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Hospital Code</Label>
                  <Input
                    value={generalSettings.hospitalCode}
                    onChange={(e) => setGeneralSettings(prev => ({ ...prev, hospitalCode: e.target.value }))}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Address *</Label>
                <Textarea
                  value={generalSettings.address}
                  onChange={(e) => setGeneralSettings(prev => ({ ...prev, address: e.target.value }))}
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Phone *</Label>
                  <Input
                    value={generalSettings.phone}
                    onChange={(e) => setGeneralSettings(prev => ({ ...prev, phone: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Email *</Label>
                  <Input
                    type="email"
                    value={generalSettings.email}
                    onChange={(e) => setGeneralSettings(prev => ({ ...prev, email: e.target.value }))}
                  />
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label>Language</Label>
                  <Select
                    value={generalSettings.language}
                    onValueChange={(value) => setGeneralSettings(prev => ({ ...prev, language: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {languages.map(lang => (
                        <SelectItem key={lang.code} value={lang.name}>{lang.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Timezone</Label>
                  <Select
                    value={generalSettings.timezone}
                    onValueChange={(value) => setGeneralSettings(prev => ({ ...prev, timezone: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {timezones.map(tz => (
                        <SelectItem key={tz} value={tz}>{tz}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Date Format</Label>
                  <Select
                    value={generalSettings.dateFormat}
                    onValueChange={(value) => setGeneralSettings(prev => ({ ...prev, dateFormat: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dd-mm-yyyy">DD-MM-YYYY</SelectItem>
                      <SelectItem value="mm-dd-yyyy">MM-DD-YYYY</SelectItem>
                      <SelectItem value="yyyy-mm-dd">YYYY-MM-DD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label>Time Format</Label>
                  <Select
                    value={generalSettings.timeFormat}
                    onValueChange={(value) => setGeneralSettings(prev => ({ ...prev, timeFormat: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="12">12 Hour</SelectItem>
                      <SelectItem value="24">24 Hour</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Currency</Label>
                  <Select
                    value={generalSettings.currency}
                    onValueChange={(value) => {
                      const currency = currencies.find(c => c.code === value);
                      setGeneralSettings(prev => ({ 
                        ...prev, 
                        currency: value,
                        currencySymbol: currency?.symbol || value
                      }));
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {currencies.map(curr => (
                        <SelectItem key={curr.code} value={curr.code}>
                          {curr.code} ({curr.symbol})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Currency Symbol</Label>
                  <Input
                    value={generalSettings.currencySymbol}
                    onChange={(e) => setGeneralSettings(prev => ({ ...prev, currencySymbol: e.target.value }))}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Credit Limit ({generalSettings.currencySymbol})</Label>
                <Input
                  type="number"
                  value={generalSettings.creditLimit}
                  onChange={(e) => setGeneralSettings(prev => ({ ...prev, creditLimit: parseFloat(e.target.value) }))}
                />
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Language RTL Text Mode</Label>
                    <p className="text-sm text-muted-foreground">Enable right-to-left text direction</p>
                  </div>
                  <Switch
                    checked={generalSettings.isRtl}
                    onCheckedChange={(checked) => setGeneralSettings(prev => ({ ...prev, isRtl: checked }))}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Doctor Restriction Mode</Label>
                    <p className="text-sm text-muted-foreground">Restrict doctor access to assigned patients only</p>
                  </div>
                  <Switch
                    checked={generalSettings.doctorRestriction}
                    onCheckedChange={(checked) => setGeneralSettings(prev => ({ ...prev, doctorRestriction: checked }))}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Superadmin Visibility</Label>
                    <p className="text-sm text-muted-foreground">Show superadmin in user lists</p>
                  </div>
                  <Switch
                    checked={generalSettings.superadminVisibility}
                    onCheckedChange={(checked) => setGeneralSettings(prev => ({ ...prev, superadminVisibility: checked }))}
                  />
                </div>
              </div>

              <Button onClick={() => handleSaveSettings('General')} disabled={loading}>
                <Save className="size-4 mr-2" />
                Save General Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="size-5" />
                Notification Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">Send notifications via email</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>SMS Notifications</Label>
                    <p className="text-sm text-muted-foreground">Send notifications via SMS</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Push Notifications</Label>
                    <p className="text-sm text-muted-foreground">Send browser push notifications</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Appointment Reminders</Label>
                    <p className="text-sm text-muted-foreground">Automatic appointment reminders</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
              <Button onClick={() => handleSaveSettings('Notification')}>
                <Save className="size-4 mr-2" />
                Save Notification Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sms" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Phone className="size-5" />
                SMS Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>SMS Gateway</Label>
                  <Select defaultValue="twilio">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="twilio">Twilio</SelectItem>
                      <SelectItem value="nexmo">Nexmo</SelectItem>
                      <SelectItem value="textlocal">TextLocal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>API Key</Label>
                  <Input placeholder="Enter SMS API Key" type="password" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Sender ID</Label>
                  <Input placeholder="Hospital" />
                </div>
                <div className="space-y-2">
                  <Label>SMS Template</Label>
                  <Textarea placeholder="Dear {name}, your appointment is scheduled for {date} at {time}." />
                </div>
              </div>
              <Button onClick={() => handleSaveSettings('SMS')}>
                <Save className="size-4 mr-2" />
                Save SMS Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="email" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="size-5" />
                Email Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>SMTP Host</Label>
                  <Input placeholder="smtp.gmail.com" />
                </div>
                <div className="space-y-2">
                  <Label>SMTP Port</Label>
                  <Input placeholder="587" type="number" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Username</Label>
                  <Input placeholder="your-email@gmail.com" />
                </div>
                <div className="space-y-2">
                  <Label>Password</Label>
                  <Input placeholder="App Password" type="password" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>From Email</Label>
                <Input placeholder="noreply@hospital.com" />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Enable SSL/TLS</Label>
                  <p className="text-sm text-muted-foreground">Use secure connection</p>
                </div>
                <Switch defaultChecked />
              </div>
              <Button onClick={() => handleSaveSettings('Email')}>
                <Save className="size-4 mr-2" />
                Save Email Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payments" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="size-5" />
                Payment Methods
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Cash Payments</Label>
                    <p className="text-sm text-muted-foreground">Accept cash payments</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Credit Card</Label>
                    <p className="text-sm text-muted-foreground">Accept credit card payments</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Mobile Money</Label>
                    <p className="text-sm text-muted-foreground">M-Pesa, Airtel Money, etc.</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Bank Transfer</Label>
                    <p className="text-sm text-muted-foreground">Direct bank transfers</p>
                  </div>
                  <Switch />
                </div>
              </div>
              <Separator />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Payment Gateway</Label>
                  <Select defaultValue="stripe">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="stripe">Stripe</SelectItem>
                      <SelectItem value="paypal">PayPal</SelectItem>
                      <SelectItem value="mpesa">M-Pesa</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>API Key</Label>
                  <Input placeholder="Payment Gateway API Key" type="password" />
                </div>
              </div>
              <Button onClick={() => handleSaveSettings('Payment')}>
                <Save className="size-4 mr-2" />
                Save Payment Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cms" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="size-5" />
                Front CMS Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Enable Public Website</Label>
                    <p className="text-sm text-muted-foreground">Show public hospital website</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Online Appointments</Label>
                    <p className="text-sm text-muted-foreground">Allow online appointment booking</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Patient Portal</Label>
                    <p className="text-sm text-muted-foreground">Enable patient self-service portal</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Website Title</Label>
                <Input defaultValue="ROFAM TECH SERVICES - Hospital Management" />
              </div>
              <div className="space-y-2">
                <Label>Meta Description</Label>
                <Textarea placeholder="Hospital management system providing quality healthcare services..." />
              </div>
              <Button onClick={() => handleSaveSettings('CMS')}>
                <Save className="size-4 mr-2" />
                Save CMS Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="roles" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="size-5" />
                Roles & Permissions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                {['Super Admin', 'Admin', 'Doctor', 'Nurse', 'Pharmacist', 'Lab Technician', 'Receptionist'].map((role) => (
                  <div key={role} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <Label>{role}</Label>
                      <p className="text-sm text-muted-foreground">Manage {role.toLowerCase()} permissions</p>
                    </div>
                    <Button variant="outline" size="sm">
                      Configure
                    </Button>
                  </div>
                ))}
              </div>
              <Button onClick={() => handleSaveSettings('Roles')}>
                <Save className="size-4 mr-2" />
                Save Role Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="backup" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="size-5" />
                Backup / Restore
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Auto Backup</Label>
                    <p className="text-sm text-muted-foreground">Automatic daily backups</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="space-y-2">
                  <Label>Backup Frequency</Label>
                  <Select defaultValue="daily">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hourly">Hourly</SelectItem>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex gap-4">
                <Button onClick={() => handleSaveSettings('Backup')}>
                  <Database className="size-4 mr-2" />
                  Create Backup
                </Button>
                <Button variant="outline">
                  Restore Backup
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="languages" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Languages className="size-5" />
                Languages
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                {languages.map((lang) => (
                  <div key={lang.code} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <Label>{lang.name}</Label>
                      <p className="text-sm text-muted-foreground">Language code: {lang.code}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={lang.name === 'English' ? 'default' : 'secondary'}>
                        {lang.name === 'English' ? 'Default' : 'Available'}
                      </Badge>
                      <Switch defaultChecked={lang.name === 'English'} />
                    </div>
                  </div>
                ))}
              </div>
              <Button onClick={() => handleSaveSettings('Languages')}>
                <Save className="size-4 mr-2" />
                Save Language Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="modules" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Grid3X3 className="size-5" />
                Modules
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                {[
                  { name: 'Patient Management', enabled: true },
                  { name: 'Appointment System', enabled: true },
                  { name: 'Pharmacy Management', enabled: true },
                  { name: 'Laboratory Management', enabled: true },
                  { name: 'Radiology Management', enabled: true },
                  { name: 'Blood Bank', enabled: true },
                  { name: 'Ambulance Management', enabled: false },
                  { name: 'Birth & Death Records', enabled: false },
                  { name: 'TPA Management', enabled: false }
                ].map((module) => (
                  <div key={module.name} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <Label>{module.name}</Label>
                      <p className="text-sm text-muted-foreground">
                        {module.enabled ? 'Module is active' : 'Module is disabled'}
                      </p>
                    </div>
                    <Switch defaultChecked={module.enabled} />
                  </div>
                ))}
              </div>
              <Button onClick={() => handleSaveSettings('Modules')}>
                <Save className="size-4 mr-2" />
                Save Module Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Additional tabs would continue here with similar structure */}
      </Tabs>
    </div>
  );
}

