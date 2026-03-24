import { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Plus, Search, Printer } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { toast } from 'sonner';

interface LabTest {
  id: string;
  name: string;
  price: number;
}

interface Invoice {
  id: string;
  patientName: string;
  patientId: string;
  tests: LabTest[];
  total: number;
  date: string;
  status: 'draft' | 'sent' | 'paid';
}

export function LabInvoiceGenerator() {
  const [invoices, setInvoices] = useState<Invoice[]>([
    { id: 'INV-001', patientName: 'John Smith', patientId: 'P001', tests: [{ id: '1', name: 'CBC', price: 50 }], total: 50, date: '2024-12-08', status: 'paid' },
    { id: 'INV-002', patientName: 'Emily Davis', patientId: 'P002', tests: [{ id: '2', name: 'Lipid Panel', price: 75 }], total: 75, date: '2024-12-08', status: 'sent' },
  ]);

  const [newInvoice, setNewInvoice] = useState({
    patientName: '',
    patientId: '',
    selectedTests: [] as LabTest[],
  });

  const availableTests = [
    { id: '1', name: 'Complete Blood Count (CBC)', price: 50 },
    { id: '2', name: 'Lipid Panel', price: 75 },
    { id: '3', name: 'Thyroid Function Test', price: 90 },
    { id: '4', name: 'Liver Function Test', price: 65 },
    { id: '5', name: 'Kidney Function Test', price: 55 },
  ];

  const handleCreateInvoice = () => {
    if (!newInvoice.patientName || !newInvoice.patientId || newInvoice.selectedTests.length === 0) {
      toast.error('Please fill all fields and select at least one test');
      return;
    }

    const invoice: Invoice = {
      id: `INV-${String(invoices.length + 1).padStart(3, '0')}`,
      patientName: newInvoice.patientName,
      patientId: newInvoice.patientId,
      tests: newInvoice.selectedTests,
      total: newInvoice.selectedTests.reduce((sum, test) => sum + test.price, 0),
      date: new Date().toISOString().split('T')[0],
      status: 'draft',
    };

    setInvoices([...invoices, invoice]);
    setNewInvoice({ patientName: '', patientId: '', selectedTests: [] });
    toast.success('Lab invoice created successfully!');
  };

  const toggleTest = (test: LabTest) => {
    const exists = newInvoice.selectedTests.find(t => t.id === test.id);
    if (exists) {
      setNewInvoice({
        ...newInvoice,
        selectedTests: newInvoice.selectedTests.filter(t => t.id !== test.id)
      });
    } else {
      setNewInvoice({
        ...newInvoice,
        selectedTests: [...newInvoice.selectedTests, test]
      });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl text-gray-900">Lab Invoice Generator</h1>
        <p className="text-muted-foreground">Create billing for lab tests</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Create New Invoice */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="size-5 text-primary" />
              Create New Invoice
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Patient Name</Label>
                <Input
                  value={newInvoice.patientName}
                  onChange={(e) => setNewInvoice({ ...newInvoice, patientName: e.target.value })}
                  placeholder="Enter patient name"
                />
              </div>
              <div className="space-y-2">
                <Label>Patient ID</Label>
                <Input
                  value={newInvoice.patientId}
                  onChange={(e) => setNewInvoice({ ...newInvoice, patientId: e.target.value })}
                  placeholder="Enter patient ID"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Select Lab Tests</Label>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {availableTests.map((test) => (
                  <div key={test.id} className="flex items-center justify-between p-2 border rounded">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={newInvoice.selectedTests.some(t => t.id === test.id)}
                        onChange={() => toggleTest(test)}
                      />
                      <span className="text-sm">{test.name}</span>
                    </div>
                    <span className="text-sm font-semibold">${test.price}</span>
                  </div>
                ))}
              </div>
            </div>

            {newInvoice.selectedTests.length > 0 && (
              <div className="p-3 bg-muted/50 rounded">
                <p className="text-sm font-semibold">
                  Total: ${newInvoice.selectedTests.reduce((sum, test) => sum + test.price, 0)}
                </p>
              </div>
            )}

            <Button onClick={handleCreateInvoice} className="w-full">
              Create Invoice
            </Button>
          </CardContent>
        </Card>

        {/* Recent Invoices */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="size-5 text-primary" />
              Recent Invoices
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {invoices.map((invoice) => (
              <div key={invoice.id} className="p-3 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="text-sm font-semibold">{invoice.id}</p>
                    <p className="text-xs text-muted-foreground">{invoice.patientName} ({invoice.patientId})</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold">${invoice.total}</p>
                    <span className={`text-xs px-2 py-1 rounded ${
                      invoice.status === 'paid' ? 'bg-green-100 text-primary' :
                      invoice.status === 'sent' ? 'bg-blue-100 text-primary' :
                      'bg-yellow-100 text-yellow-700'
                    }`}>
                      {invoice.status}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => toast.success('Invoice printed!')}>
                    <Printer className="size-4 mr-1" />
                    Print
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => toast.success('Invoice sent!')}>
                    Send
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

