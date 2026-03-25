'use client';

import { useState } from 'react';
import { Wand2, Loader2 } from 'lucide-react';
import { Button } from './ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { toast } from 'sonner';

interface AutoFillButtonProps {
  formType: string;
  onFill: (data: Record<string, any>) => void;
  sampleData?: Record<string, any>;
}

// Sample data generators per form type
const sampleDataMap: Record<string, Record<string, any>> = {
  appointment: {
    doctor_name: 'Dr. Sarah Johnson',
    appointment_date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    appointment_time: '10:00',
    status: 'scheduled',
    notes: 'Routine follow-up consultation',
  },
  patient: {
    patient_name: 'John Doe',
    age: 35,
    gender: 'Male',
    date_of_birth: '1990-01-15',
    blood_group: 'O+',
    phone: '+254700000000',
    emergency_contact: '+254711000000',
    emergency_contact_relation: 'Spouse',
    address: '123 Main Street',
    city: 'Nairobi',
    state: 'Nairobi County',
    postal_code: '00100',
    insurance_provider: 'NHIF',
    insurance_number: 'NHIF-123456',
    medical_history: 'No significant medical history',
    allergies: 'None known',
    current_medications: 'None',
  },
  employee: {
    name: 'Jane Smith',
    email: 'jane.smith@hospital.com',
    phone: '+254700000001',
    position: 'Nurse',
    department: 'General Medicine',
    salary: 80000,
    hire_date: new Date().toISOString().split('T')[0],
    status: 'active',
  },
  billing: {
    patientName: 'John Doe',
    amount: 5000,
    services: ['Consultation', 'Lab Tests'],
    discount: 0,
    tax: 16,
    notes: 'Standard consultation and diagnostics',
    dueDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
  },
  inventory: {
    name: 'Paracetamol 500mg',
    category: 'Medication',
    quantity: 100,
    unit_price: 50,
    supplier: 'PharmaCo Ltd',
    expiry_date: '2026-12-31',
    status: 'in_stock',
  },
};

export function AutoFillButton({ formType, onFill, sampleData }: AutoFillButtonProps) {
  const [open, setOpen] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAutoFill = async () => {
    setLoading(true);
    try {
      // Use provided sampleData or fall back to built-in map
      const base = sampleData || sampleDataMap[formType] || {};

      // Simple prompt-based overrides (no AI API needed)
      const data = { ...base };

      if (prompt.trim()) {
        const p = prompt.toLowerCase();

        // Parse common overrides from the prompt
        const nameMatch = p.match(/(?:name[:\s]+)([a-z\s]+?)(?:,|age|$)/i);
        if (nameMatch) {
          data.patient_name = nameMatch[1].trim();
          data.name = nameMatch[1].trim();
        }

        const ageMatch = p.match(/age[:\s]+(\d+)/i);
        if (ageMatch) data.age = parseInt(ageMatch[1]);

        const genderMatch = p.match(/\b(male|female|other)\b/i);
        if (genderMatch) data.gender = genderMatch[1].charAt(0).toUpperCase() + genderMatch[1].slice(1).toLowerCase();

        const doctorMatch = p.match(/dr\.?\s+([a-z\s]+?)(?:,|dept|$)/i);
        if (doctorMatch) data.doctor_name = `Dr. ${doctorMatch[1].trim()}`;

        const deptMatch = p.match(/(?:dept|department)[:\s]+([a-z\s]+?)(?:,|$)/i);
        if (deptMatch) data.department = deptMatch[1].trim();

        const dateMatch = p.match(/(\d{4}-\d{2}-\d{2})/);
        if (dateMatch) {
          data.appointment_date = dateMatch[1];
          data.date_of_birth = dateMatch[1];
        }
      }

      onFill(data);
      toast.success('Form auto-filled successfully');
      setOpen(false);
      setPrompt('');
    } catch (err) {
      toast.error('Auto-fill failed');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickFill = () => {
    const data = sampleData || sampleDataMap[formType] || {};
    onFill(data);
    toast.success('Form filled with sample data');
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <div className="flex gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleQuickFill}
          className="gap-2 text-xs"
        >
          <Wand2 className="size-3" />
          Quick Fill
        </Button>
        <DialogTrigger asChild>
          <Button type="button" variant="outline" size="sm" className="gap-2 text-xs">
            <Wand2 className="size-3" />
            Fill with Prompt
          </Button>
        </DialogTrigger>
      </div>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Wand2 className="size-4" />
            Auto-fill Form
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Describe what to fill in, or leave blank to use sample data.
          </p>
          <div>
            <Label htmlFor="autofill-prompt">Prompt (optional)</Label>
            <Textarea
              id="autofill-prompt"
              placeholder={`e.g. "Name: John Doe, Age: 45, Male, Dr. Chen, Dept: Cardiology"`}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={3}
              className="mt-1"
            />
          </div>
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={handleAutoFill} disabled={loading} className="gap-2">
              {loading ? <Loader2 className="size-4 animate-spin" /> : <Wand2 className="size-4" />}
              Fill Form
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
