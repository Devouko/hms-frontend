import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, User, Phone, MapPin, Calendar, Heart, FileText, Save } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { toast } from 'sonner';

interface PatientData {
  patient_name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  date_of_birth: string;
  blood_group: string;
  phone: string;
  emergency_contact: string;
  address: string;
  city: string;
  state: string;
  postal_code: string;
  insurance_provider?: string;
  insurance_number?: string;
  medical_history?: string;
  allergies?: string;
  current_medications?: string;
  emergency_contact_relation: string;
}

interface PatientRegistrationProps {
  session: any;
  onPatientRegistered?: (patientId: string) => void;
}

export function PatientRegistration({ session, onPatientRegistered }: PatientRegistrationProps) {
  const [formData, setFormData] = useState<PatientData>({
    patient_name: '',
    age: 0,
    gender: 'Male',
    date_of_birth: '',
    blood_group: '',
    phone: '',
    emergency_contact: '',
    address: '',
    city: '',
    state: '',
    postal_code: '',
    insurance_provider: '',
    insurance_number: '',
    medical_history: '',
    allergies: '',
    current_medications: '',
    emergency_contact_relation: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  const relations = ['Spouse', 'Parent', 'Child', 'Sibling', 'Friend', 'Other'];

  const handleInputChange = (field: keyof PatientData, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const generatePatientId = () => {
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `P${timestamp}${random}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Generate unique patient ID
      const patientId = generatePatientId();
      
      // Simulate API call - replace with actual Supabase integration
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock successful registration
      toast.success(`Patient registered successfully! ID: ${patientId}`);
      
      // Reset form
      setFormData({
        patient_name: '',
        age: 0,
        gender: 'Male',
        date_of_birth: '',
        blood_group: '',
        phone: '',
        emergency_contact: '',
        address: '',
        city: '',
        state: '',
        postal_code: '',
        insurance_provider: '',
        insurance_number: '',
        medical_history: '',
        allergies: '',
        current_medications: '',
        emergency_contact_relation: ''
      });
      
      setCurrentStep(1);
      
      if (onPatientRegistered) {
        onPatientRegistered(patientId);
      }
      
    } catch (error) {
      toast.error('Failed to register patient. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = () => {
    if (currentStep < 3) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const isStepValid = (step: number) => {
    switch (step) {
      case 1:
        return formData.patient_name && formData.age && formData.gender && formData.date_of_birth;
      case 2:
        return formData.phone && formData.address && formData.city;
      case 3:
        return true; // Optional fields
      default:
        return false;
    }
  };

  const StepIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      {[1, 2, 3].map((step) => (
        <div key={step} className="flex items-center">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center smooth-transition ${
            currentStep >= step 
              ? 'glass-card text-primary glow' 
              : 'glass text-muted-foreground'
          }`}>
            {step}
          </div>
          {step < 3 && (
            <div className={`w-16 h-1 mx-2 rounded smooth-transition ${
              currentStep > step ? 'bg-primary glow' : 'glass'
            }`} />
          )}
        </div>
      ))}
    </div>
  );

  const PersonalInfoStep = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-6"
    >
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>
        <p className="text-sm text-muted-foreground">Basic patient details</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="patient_name">Full Name *</Label>
          <Input
            id="patient_name"
            value={formData.patient_name}
            onChange={(e) => handleInputChange('patient_name', e.target.value)}
            placeholder="Enter full name"
            className="glass-input smooth-transition"
            required
          />
        </div>
        <div>
          <Label htmlFor="age">Age *</Label>
          <Input
            id="age"
            type="number"
            value={formData.age || ''}
            onChange={(e) => handleInputChange('age', parseInt(e.target.value) || 0)}
            placeholder="Enter age"
            className="glass-input smooth-transition"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="gender">Gender *</Label>
          <Select value={formData.gender} onValueChange={(value) => handleInputChange('gender', value)}>
            <SelectTrigger className="glass-input smooth-transition">
              <SelectValue placeholder="Select gender" />
            </SelectTrigger>
            <SelectContent className="glass-modal">
              <SelectItem value="Male">Male</SelectItem>
              <SelectItem value="Female">Female</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="date_of_birth">Date of Birth *</Label>
          <Input
            id="date_of_birth"
            type="date"
            value={formData.date_of_birth}
            onChange={(e) => handleInputChange('date_of_birth', e.target.value)}
            className="glass-input smooth-transition"
            required
          />
        </div>
      </div>

      <div>
        <Label htmlFor="blood_group">Blood Group</Label>
        <Select value={formData.blood_group} onValueChange={(value) => handleInputChange('blood_group', value)}>
          <SelectTrigger className="glass-input smooth-transition">
            <SelectValue placeholder="Select blood group" />
          </SelectTrigger>
          <SelectContent className="glass-modal">
            {bloodGroups.map((group) => (
              <SelectItem key={group} value={group}>{group}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </motion.div>
  );

  const ContactInfoStep = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-6"
    >
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Contact Information</h3>
        <p className="text-sm text-muted-foreground">Address and contact details</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="phone">Phone Number *</Label>
          <Input
            id="phone"
            value={formData.phone}
            onChange={(e) => handleInputChange('phone', e.target.value)}
            placeholder="Enter phone number"
            className="glass-input smooth-transition"
            required
          />
        </div>
        <div>
          <Label htmlFor="emergency_contact">Emergency Contact *</Label>
          <Input
            id="emergency_contact"
            value={formData.emergency_contact}
            onChange={(e) => handleInputChange('emergency_contact', e.target.value)}
            placeholder="Emergency contact number"
            className="glass-input smooth-transition"
            required
          />
        </div>
      </div>

      <div>
        <Label htmlFor="emergency_contact_relation">Emergency Contact Relation</Label>
        <Select value={formData.emergency_contact_relation} onValueChange={(value) => handleInputChange('emergency_contact_relation', value)}>
          <SelectTrigger className="glass-input smooth-transition">
            <SelectValue placeholder="Select relation" />
          </SelectTrigger>
          <SelectContent className="glass-modal">
            {relations.map((relation) => (
              <SelectItem key={relation} value={relation}>{relation}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="address">Address *</Label>
        <Textarea
          id="address"
          value={formData.address}
          onChange={(e) => handleInputChange('address', e.target.value)}
          placeholder="Enter full address"
          className="glass-input smooth-transition"
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="city">City *</Label>
          <Input
            id="city"
            value={formData.city}
            onChange={(e) => handleInputChange('city', e.target.value)}
            placeholder="Enter city"
            className="glass-input smooth-transition"
            required
          />
        </div>
        <div>
          <Label htmlFor="state">State</Label>
          <Input
            id="state"
            value={formData.state}
            onChange={(e) => handleInputChange('state', e.target.value)}
            placeholder="Enter state"
            className="glass-input smooth-transition"
          />
        </div>
        <div>
          <Label htmlFor="postal_code">Postal Code</Label>
          <Input
            id="postal_code"
            value={formData.postal_code}
            onChange={(e) => handleInputChange('postal_code', e.target.value)}
            placeholder="Enter postal code"
            className="glass-input smooth-transition"
          />
        </div>
      </div>
    </motion.div>
  );

  const MedicalInfoStep = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-6"
    >
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Medical Information</h3>
        <p className="text-sm text-muted-foreground">Insurance and medical history (optional)</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="insurance_provider">Insurance Provider</Label>
          <Input
            id="insurance_provider"
            value={formData.insurance_provider}
            onChange={(e) => handleInputChange('insurance_provider', e.target.value)}
            placeholder="Enter insurance provider"
            className="glass-input smooth-transition"
          />
        </div>
        <div>
          <Label htmlFor="insurance_number">Insurance Number</Label>
          <Input
            id="insurance_number"
            value={formData.insurance_number}
            onChange={(e) => handleInputChange('insurance_number', e.target.value)}
            placeholder="Enter insurance number"
            className="glass-input smooth-transition"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="medical_history">Medical History</Label>
        <Textarea
          id="medical_history"
          value={formData.medical_history}
          onChange={(e) => handleInputChange('medical_history', e.target.value)}
          placeholder="Enter relevant medical history"
          className="glass-input smooth-transition"
          rows={3}
        />
      </div>

      <div>
        <Label htmlFor="allergies">Known Allergies</Label>
        <Textarea
          id="allergies"
          value={formData.allergies}
          onChange={(e) => handleInputChange('allergies', e.target.value)}
          placeholder="Enter known allergies"
          className="glass-input smooth-transition"
          rows={2}
        />
      </div>

      <div>
        <Label htmlFor="current_medications">Current Medications</Label>
        <Textarea
          id="current_medications"
          value={formData.current_medications}
          onChange={(e) => handleInputChange('current_medications', e.target.value)}
          placeholder="Enter current medications"
          className="glass-input smooth-transition"
          rows={2}
        />
      </div>
    </motion.div>
  );

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="glass-card smooth-transition">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2">
            <User className="size-6 text-primary glow" />
            Patient Registration
          </CardTitle>
          <p className="text-muted-foreground">Register a new patient in the system</p>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit}>
            <StepIndicator />
            
            <div className="min-h-[500px]">
              {currentStep === 1 && <PersonalInfoStep />}
              {currentStep === 2 && <ContactInfoStep />}
              {currentStep === 3 && <MedicalInfoStep />}
            </div>

            <div className="flex justify-between mt-8 pt-6 border-t glass">
              <Button
                type="button"
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 1}
                className="glass-button smooth-transition"
              >
                Previous
              </Button>
              
              <div className="flex gap-2">
                {currentStep < 3 ? (
                  <Button
                    type="button"
                    onClick={nextStep}
                    disabled={!isStepValid(currentStep)}
                    className="glass-button smooth-transition glow-hover"
                  >
                    Next
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="glass-button smooth-transition glow-hover"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-border border-t-transparent rounded-full animate-spin" />
                        Registering...
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Save className="size-4" />
                        Register Patient
                      </div>
                    )}
                  </Button>
                )}
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

