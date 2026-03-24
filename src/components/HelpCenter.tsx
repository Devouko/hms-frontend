import { motion } from 'framer-motion';
import { HelpCircle, Book, MessageCircle, Mail, Phone } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';

export function HelpCenter() {
  const faqs = [
    { q: 'How do I reset my password?', a: 'Go to Profile > Security > Update Password' },
    { q: 'How to add a new patient?', a: 'Click the "Add Patient" button in the Patients section' },
    { q: 'How to schedule appointments?', a: 'Navigate to Appointments and click "New Appointment"' },
    { q: 'How to generate reports?', a: 'Go to Reports section and select the report type' },
  ];

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
          <HelpCircle className="size-8 text-primary" />
          Help & Support Center
        </h1>
        <p className="text-sm text-muted-foreground mt-1">Get help and support for using the system</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6 text-center">
            <Book className="size-12 text-primary mx-auto mb-4" />
            <h3 className="font-semibold text-gray-900 mb-2">Documentation</h3>
            <p className="text-sm text-muted-foreground mb-4">Browse our comprehensive guides</p>
            <Button variant="outline" size="sm">View Docs</Button>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <MessageCircle className="size-12 text-primary mx-auto mb-4" />
            <h3 className="font-semibold text-gray-900 mb-2">Live Chat</h3>
            <p className="text-sm text-muted-foreground mb-4">Chat with our support team</p>
            <Button variant="outline" size="sm">Start Chat</Button>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <Mail className="size-12 text-primary mx-auto mb-4" />
            <h3 className="font-semibold text-gray-900 mb-2">Email Support</h3>
            <p className="text-sm text-muted-foreground mb-4">support@hospital.com</p>
            <Button variant="outline" size="sm">Send Email</Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Frequently Asked Questions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-4 border rounded-lg"
              >
                <h4 className="font-semibold text-gray-900 mb-2">{faq.q}</h4>
                <p className="text-sm text-muted-foreground">{faq.a}</p>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


