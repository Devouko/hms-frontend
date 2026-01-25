import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Plus, Search, Trash2, DollarSign, FileText } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Label } from './ui/label';
import { toast } from 'sonner';

interface Bill {
  id: string;
  patientId: string;
  patientName: string;
  billDate: string;
  dueDate: string;
  amount: number;
  paidAmount: number;
  status: 'Pending' | 'Partial' | 'Paid';
  services: string[];
  discount: number;
  tax: number;
  notes?: string;
}

interface BillingManagementProps {
  session: any;
}

export function BillingManagement({ session }: BillingManagementProps) {
  const [bills, setBills] = useState<Bill[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<Bill>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchBills();
  }, []);

  const fetchBills = async () => {
    try {
      const localBills = localStorage.getItem('hospital_bills');
      if (localBills) {
        setBills(JSON.parse(localBills));
      }
    } catch (error) {
      console.error('Error fetching bills:', error);
    }
  };

  const filteredBills = bills.filter(bill =>
    bill.patientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    bill.id?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAdd = async () => {
    if (!formData.patientName || !formData.amount) {
      toast.error('Please fill in required fields');
      return;
    }

    setLoading(true);
    try {
      const newBill: Bill = {
        id: `BILL-${Date.now()}`,
        patientId: Date.now().toString(),
        patientName: formData.patientName || '',
        billDate: formData.billDate || new Date().toISOString().split('T')[0],
        dueDate: formData.dueDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        amount: formData.amount || 0,
        paidAmount: formData.paidAmount || 0,
        status: (formData.paidAmount || 0) >= (formData.amount || 0) ? 'Paid' : 
                (formData.paidAmount || 0) > 0 ? 'Partial' : 'Pending',
        services: formData.services || [],
        discount: formData.discount || 0,
        tax: formData.tax || 0,
        notes: formData.notes || ''
      };

      const updatedBills = [...bills, newBill];
      setBills(updatedBills);
      localStorage.setItem('hospital_bills', JSON.stringify(updatedBills));
      
      setFormData({});
      setIsAddModalOpen(false);
      toast.success('Bill created successfully!');
    } catch (error) {
      console.error('Error adding bill:', error);
      toast.error('Failed to create bill. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = (id: string, amount: number) => {
    const updatedBills = bills.map(bill => {
      if (bill.id === id) {
        const newPaidAmount = bill.paidAmount + amount;
        return {
          ...bill,
          paidAmount: newPaidAmount,
          status: newPaidAmount >= bill.amount ? 'Paid' : 'Partial'
        };
      }
      return bill;
    });
    setBills(updatedBills);
    localStorage.setItem('hospital_bills', JSON.stringify(updatedBills));
    toast.success('Payment recorded successfully!');
  };

  const handleDelete = (id: string) => {
    if (!confirm('Are you sure you want to delete this bill?')) return;
    
    const updatedBills = bills.filter(bill => bill.id !== id);
    setBills(updatedBills);
    localStorage.setItem('hospital_bills', JSON.stringify(updatedBills));
    toast.success('Bill deleted successfully!');
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Billing Management</CardTitle>
              <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
                <DialogTrigger asChild>
                  <Button onClick={() => setFormData({})}>
                    <Plus className="size-4 mr-2" />
                    Create Bill
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Create New Bill</DialogTitle>
                    <DialogDescription>
                      Enter the billing details below.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid grid-cols-2 gap-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="patientName">Patient Name *</Label>
                      <Input
                        id="patientName"
                        value={formData.patientName || ''}
                        onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
                        placeholder="Enter patient name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="amount">Amount ($) *</Label>
                      <Input
                        id="amount"
                        type="number"
                        value={formData.amount || ''}
                        onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) })}
                        placeholder="Enter amount"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="billDate">Bill Date</Label>
                      <Input
                        id="billDate"
                        type="date"
                        value={formData.billDate || new Date().toISOString().split('T')[0]}
                        onChange={(e) => setFormData({ ...formData, billDate: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="dueDate">Due Date</Label>
                      <Input
                        id="dueDate"
                        type="date"
                        value={formData.dueDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
                        onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="paidAmount">Paid Amount ($)</Label>
                      <Input
                        id="paidAmount"
                        type="number"
                        value={formData.paidAmount || ''}
                        onChange={(e) => setFormData({ ...formData, paidAmount: parseFloat(e.target.value) })}
                        placeholder="Enter paid amount"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="discount">Discount ($)</Label>
                      <Input
                        id="discount"
                        type="number"
                        value={formData.discount || ''}
                        onChange={(e) => setFormData({ ...formData, discount: parseFloat(e.target.value) })}
                        placeholder="Enter discount"
                      />
                    </div>
                    <div className="col-span-2 space-y-2">
                      <Label htmlFor="notes">Notes</Label>
                      <textarea
                        id="notes"
                        value={formData.notes || ''}
                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                        placeholder="Enter any additional notes"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        rows={3}
                      />
                    </div>
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleAdd} disabled={loading}>
                      {loading ? 'Creating...' : 'Create Bill'}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2 mb-4">
              <Search className="size-4 text-gray-400" />
              <Input
                placeholder="Search bills..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-200">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border border-gray-200 px-4 py-2 text-left">Bill ID</th>
                    <th className="border border-gray-200 px-4 py-2 text-left">Patient</th>
                    <th className="border border-gray-200 px-4 py-2 text-left">Amount</th>
                    <th className="border border-gray-200 px-4 py-2 text-left">Paid</th>
                    <th className="border border-gray-200 px-4 py-2 text-left">Balance</th>
                    <th className="border border-gray-200 px-4 py-2 text-left">Status</th>
                    <th className="border border-gray-200 px-4 py-2 text-left">Due Date</th>
                    <th className="border border-gray-200 px-4 py-2 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBills.map((bill) => (
                    <tr key={bill.id} className="hover:bg-gray-50">
                      <td className="border border-gray-200 px-4 py-2">{bill.id}</td>
                      <td className="border border-gray-200 px-4 py-2">{bill.patientName}</td>
                      <td className="border border-gray-200 px-4 py-2">${bill.amount}</td>
                      <td className="border border-gray-200 px-4 py-2">${bill.paidAmount}</td>
                      <td className="border border-gray-200 px-4 py-2">${bill.amount - bill.paidAmount}</td>
                      <td className="border border-gray-200 px-4 py-2">
                        <span className={`px-2 py-1 rounded text-sm ${
                          bill.status === 'Paid' ? 'bg-green-100 text-green-800' :
                          bill.status === 'Partial' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {bill.status}
                        </span>
                      </td>
                      <td className="border border-gray-200 px-4 py-2">{bill.dueDate}</td>
                      <td className="border border-gray-200 px-4 py-2">
                        <div className="flex space-x-2">
                          {bill.status !== 'Paid' && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                const amount = prompt('Enter payment amount:');
                                if (amount) handlePayment(bill.id, parseFloat(amount));
                              }}
                            >
                              <DollarSign className="size-4" />
                            </Button>
                          )}
                          <Button size="sm" variant="outline">
                            <FileText className="size-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDelete(bill.id)}
                          >
                            <Trash2 className="size-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredBills.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No bills found.
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}