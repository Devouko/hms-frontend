import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { MessageSquare, Send, Users, Mail, Phone, Bell, Plus, Search, Filter } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Checkbox } from './ui/checkbox';
import { toast } from 'sonner';

interface Message {
  id: string;
  title: string;
  content: string;
  sender: string;
  recipients: string[];
  type: 'email' | 'sms' | 'notification';
  status: 'draft' | 'sent' | 'delivered' | 'failed';
  createdAt: string;
  scheduledAt?: string;
  readBy: string[];
}

interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  department: string;
}

interface NotificationTemplate {
  id: string;
  name: string;
  subject: string;
  content: string;
  type: 'email' | 'sms' | 'notification';
  variables: string[];
}

export function MessagingSystem() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [templates, setTemplates] = useState<NotificationTemplate[]>([]);
  const [activeTab, setActiveTab] = useState('compose');
  const [searchTerm, setSearchTerm] = useState('');
  const [showComposeDialog, setShowComposeDialog] = useState(false);
  const [selectedContacts, setSelectedContacts] = useState<string[]>([]);
  const [messageType, setMessageType] = useState<'email' | 'sms' | 'notification'>('email');

  const [composeForm, setComposeForm] = useState({
    title: '',
    content: '',
    type: 'email' as 'email' | 'sms' | 'notification',
    recipients: [] as string[],
    scheduledAt: '',
    template: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    // Load messages, contacts, and templates
    setMessages([
      {
        id: '1',
        title: 'Appointment Reminder',
        content: 'Your appointment is scheduled for tomorrow at 10:00 AM',
        sender: 'System',
        recipients: ['patient1@email.com'],
        type: 'email',
        status: 'sent',
        createdAt: '2024-01-15T10:00:00Z',
        readBy: []
      }
    ]);

    setContacts([
      {
        id: '1',
        name: 'Dr. John Smith',
        email: 'john.smith@hospital.com',
        phone: '+1234567890',
        role: 'Doctor',
        department: 'Cardiology'
      },
      {
        id: '2',
        name: 'Jane Doe',
        email: 'jane.doe@hospital.com',
        phone: '+1987654321',
        role: 'Nurse',
        department: 'Emergency'
      }
    ]);

    setTemplates([
      {
        id: '1',
        name: 'Appointment Reminder',
        subject: 'Appointment Reminder - {{date}}',
        content: 'Dear {{patientName}}, your appointment is scheduled for {{date}} at {{time}}.',
        type: 'email',
        variables: ['patientName', 'date', 'time']
      },
      {
        id: '2',
        name: 'Lab Results Ready',
        subject: 'Lab Results Available',
        content: 'Your lab results are ready. Please visit the hospital to collect them.',
        type: 'sms',
        variables: ['patientName']
      }
    ]);
  };

  const handleSendMessage = async () => {
    try {
      const newMessage: Message = {
        id: Date.now().toString(),
        title: composeForm.title,
        content: composeForm.content,
        sender: 'Current User', // This would be the logged-in user
        recipients: composeForm.recipients,
        type: composeForm.type,
        status: composeForm.scheduledAt ? 'draft' : 'sent',
        createdAt: new Date().toISOString(),
        scheduledAt: composeForm.scheduledAt || undefined,
        readBy: []
      };

      setMessages(prev => [newMessage, ...prev]);
      
      // Reset form
      setComposeForm({
        title: '',
        content: '',
        type: 'email',
        recipients: [],
        scheduledAt: '',
        template: ''
      });
      setSelectedContacts([]);
      setShowComposeDialog(false);
      
      toast.success('Message sent successfully');
    } catch (error) {
      toast.error('Failed to send message');
    }
  };

  const handleContactSelection = (contactId: string, checked: boolean) => {
    if (checked) {
      setSelectedContacts(prev => [...prev, contactId]);
      const contact = contacts.find(c => c.id === contactId);
      if (contact) {
        const recipient = composeForm.type === 'sms' ? contact.phone : contact.email;
        setComposeForm(prev => ({
          ...prev,
          recipients: [...prev.recipients, recipient]
        }));
      }
    } else {
      setSelectedContacts(prev => prev.filter(id => id !== contactId));
      const contact = contacts.find(c => c.id === contactId);
      if (contact) {
        const recipient = composeForm.type === 'sms' ? contact.phone : contact.email;
        setComposeForm(prev => ({
          ...prev,
          recipients: prev.recipients.filter(r => r !== recipient)
        }));
      }
    }
  };

  const handleTemplateSelect = (templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    if (template) {
      setComposeForm(prev => ({
        ...prev,
        title: template.subject,
        content: template.content,
        type: template.type,
        template: templateId
      }));
    }
  };

  const filteredMessages = messages.filter(message =>
    message.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    message.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <MessageSquare className="size-8 text-primary" />
              Messaging System
            </h1>
            <p className="text-muted-foreground mt-1">Send notifications, emails, and SMS to staff and patients</p>
          </div>
          <Dialog open={showComposeDialog} onOpenChange={setShowComposeDialog}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="size-4 mr-2" />
                Compose Message
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Compose New Message</DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-3 gap-6">
                <div className="col-span-2 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Message Type</Label>
                      <Select
                        value={composeForm.type}
                        onValueChange={(value: 'email' | 'sms' | 'notification') => {
                          setComposeForm(prev => ({ ...prev, type: value, recipients: [] }));
                          setSelectedContacts([]);
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="email">
                            <div className="flex items-center gap-2">
                              <Mail className="size-4" />
                              Email
                            </div>
                          </SelectItem>
                          <SelectItem value="sms">
                            <div className="flex items-center gap-2">
                              <Phone className="size-4" />
                              SMS
                            </div>
                          </SelectItem>
                          <SelectItem value="notification">
                            <div className="flex items-center gap-2">
                              <Bell className="size-4" />
                              Notification
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Template (Optional)</Label>
                      <Select
                        value={composeForm.template}
                        onValueChange={handleTemplateSelect}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select template" />
                        </SelectTrigger>
                        <SelectContent>
                          {templates
                            .filter(t => t.type === composeForm.type)
                            .map(template => (
                              <SelectItem key={template.id} value={template.id}>
                                {template.name}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Subject/Title</Label>
                    <Input
                      value={composeForm.title}
                      onChange={(e) => setComposeForm(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="Enter message subject"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Message Content</Label>
                    <Textarea
                      value={composeForm.content}
                      onChange={(e) => setComposeForm(prev => ({ ...prev, content: e.target.value }))}
                      placeholder="Enter your message"
                      rows={8}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Schedule (Optional)</Label>
                    <Input
                      type="datetime-local"
                      value={composeForm.scheduledAt}
                      onChange={(e) => setComposeForm(prev => ({ ...prev, scheduledAt: e.target.value }))}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Recipients ({composeForm.recipients.length} selected)</Label>
                    <div className="flex flex-wrap gap-2">
                      {composeForm.recipients.map((recipient, index) => (
                        <Badge key={index} variant="secondary">
                          {recipient}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label>Select Recipients</Label>
                    <div className="mt-2 space-y-2 max-h-96 overflow-y-auto border rounded-md p-2">
                      {filteredContacts.map(contact => (
                        <div key={contact.id} className="flex items-center space-x-2 p-2 hover:bg-muted/50 rounded">
                          <Checkbox
                            checked={selectedContacts.includes(contact.id)}
                            onCheckedChange={(checked) => handleContactSelection(contact.id, checked as boolean)}
                          />
                          <div className="flex-1">
                            <div className="font-medium text-sm">{contact.name}</div>
                            <div className="text-xs text-muted-foreground">
                              {composeForm.type === 'sms' ? contact.phone : contact.email}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {contact.role} - {contact.department}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-6">
                <Button variant="outline" onClick={() => setShowComposeDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSendMessage}>
                  <Send className="size-4 mr-2" />
                  {composeForm.scheduledAt ? 'Schedule' : 'Send'} Message
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </motion.div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground size-4" />
          <Input
            placeholder="Search messages or contacts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="compose">Compose</TabsTrigger>
          <TabsTrigger value="messages">Messages</TabsTrigger>
          <TabsTrigger value="contacts">Contacts</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
        </TabsList>

        <TabsContent value="compose" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button
                  variant="outline"
                  className="h-20 flex flex-col items-center gap-2"
                  onClick={() => {
                    setComposeForm(prev => ({ ...prev, type: 'email' }));
                    setShowComposeDialog(true);
                  }}
                >
                  <Mail className="size-6" />
                  Send Email
                </Button>
                <Button
                  variant="outline"
                  className="h-20 flex flex-col items-center gap-2"
                  onClick={() => {
                    setComposeForm(prev => ({ ...prev, type: 'sms' }));
                    setShowComposeDialog(true);
                  }}
                >
                  <Phone className="size-6" />
                  Send SMS
                </Button>
                <Button
                  variant="outline"
                  className="h-20 flex flex-col items-center gap-2"
                  onClick={() => {
                    setComposeForm(prev => ({ ...prev, type: 'notification' }));
                    setShowComposeDialog(true);
                  }}
                >
                  <Bell className="size-6" />
                  Send Notification
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="messages" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Message History</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Recipients</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Sent At</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredMessages.map((message) => (
                    <TableRow key={message.id}>
                      <TableCell className="font-medium">{message.title}</TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {message.type === 'email' && <Mail className="size-3 mr-1" />}
                          {message.type === 'sms' && <Phone className="size-3 mr-1" />}
                          {message.type === 'notification' && <Bell className="size-3 mr-1" />}
                          {message.type}
                        </Badge>
                      </TableCell>
                      <TableCell>{message.recipients.length} recipients</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            message.status === 'sent' ? 'default' :
                            message.status === 'delivered' ? 'default' :
                            message.status === 'failed' ? 'destructive' : 'secondary'
                          }
                        >
                          {message.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{new Date(message.createdAt).toLocaleString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contacts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Contact Directory</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredContacts.map((contact) => (
                    <TableRow key={contact.id}>
                      <TableCell className="font-medium">{contact.name}</TableCell>
                      <TableCell>{contact.role}</TableCell>
                      <TableCell>{contact.department}</TableCell>
                      <TableCell>{contact.email}</TableCell>
                      <TableCell>{contact.phone}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Message Templates</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {templates.map((template) => (
                  <div key={template.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium">{template.name}</h3>
                      <Badge variant="outline">
                        {template.type === 'email' && <Mail className="size-3 mr-1" />}
                        {template.type === 'sms' && <Phone className="size-3 mr-1" />}
                        {template.type === 'notification' && <Bell className="size-3 mr-1" />}
                        {template.type}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{template.subject}</p>
                    <p className="text-sm">{template.content}</p>
                    <div className="mt-2">
                      <span className="text-xs text-muted-foreground">
                        Variables: {template.variables.join(', ')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}