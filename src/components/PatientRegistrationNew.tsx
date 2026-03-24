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
    } finally {\n      setIsSubmitting(false);\n    }\n  };\n\n  const nextStep = () => {\n    if (currentStep < 3) setCurrentStep(currentStep + 1);\n  };\n\n  const prevStep = () => {\n    if (currentStep > 1) setCurrentStep(currentStep - 1);\n  };\n\n  const isStepValid = (step: number) => {\n    switch (step) {\n      case 1:\n        return formData.patient_name && formData.age && formData.gender && formData.date_of_birth;\n      case 2:\n        return formData.phone && formData.address && formData.city;\n      case 3:\n        return true; // Optional fields\n      default:\n        return false;\n    }\n  };\n\n  const StepIndicator = () => (\n    <div className=\"flex items-center justify-center mb-8\">\n      {[1, 2, 3].map((step) => (\n        <div key={step} className=\"flex items-center\">\n          <div className={`w-10 h-10 rounded-full flex items-center justify-center smooth-transition ${\n            currentStep >= step \n              ? 'glass-card text-primary glow' \n              : 'glass text-muted-foreground'\n          }`}>\n            {step}\n          </div>\n          {step < 3 && (\n            <div className={`w-16 h-1 mx-2 rounded smooth-transition ${\n              currentStep > step ? 'bg-primary glow' : 'glass'\n            }`} />\n          )}\n        </div>\n      ))}\n    </div>\n  );\n\n  const PersonalInfoStep = () => (\n    <motion.div\n      initial={{ opacity: 0, x: 20 }}\n      animate={{ opacity: 1, x: 0 }}\n      className=\"space-y-6\"\n    >\n      <div className=\"text-center mb-6\">\n        <h3 className=\"text-lg font-semibold text-gray-900\">Personal Information</h3>\n        <p className=\"text-sm text-muted-foreground\">Basic patient details</p>\n      </div>\n\n      <div className=\"grid grid-cols-1 md:grid-cols-2 gap-4\">\n        <div>\n          <Label htmlFor=\"patient_name\">Full Name *</Label>\n          <Input\n            id=\"patient_name\"\n            value={formData.patient_name}\n            onChange={(e) => handleInputChange('patient_name', e.target.value)}\n            placeholder=\"Enter full name\"\n            className=\"glass-input smooth-transition\"\n            required\n          />\n        </div>\n        <div>\n          <Label htmlFor=\"age\">Age *</Label>\n          <Input\n            id=\"age\"\n            type=\"number\"\n            value={formData.age || ''}\n            onChange={(e) => handleInputChange('age', parseInt(e.target.value) || 0)}\n            placeholder=\"Enter age\"\n            className=\"glass-input smooth-transition\"\n            required\n          />\n        </div>\n      </div>\n\n      <div className=\"grid grid-cols-1 md:grid-cols-2 gap-4\">\n        <div>\n          <Label htmlFor=\"gender\">Gender *</Label>\n          <Select value={formData.gender} onValueChange={(value) => handleInputChange('gender', value)}>\n            <SelectTrigger className=\"glass-input smooth-transition\">\n              <SelectValue placeholder=\"Select gender\" />\n            </SelectTrigger>\n            <SelectContent className=\"glass-modal\">\n              <SelectItem value=\"Male\">Male</SelectItem>\n              <SelectItem value=\"Female\">Female</SelectItem>\n              <SelectItem value=\"Other\">Other</SelectItem>\n            </SelectContent>\n          </Select>\n        </div>\n        <div>\n          <Label htmlFor=\"date_of_birth\">Date of Birth *</Label>\n          <Input\n            id=\"date_of_birth\"\n            type=\"date\"\n            value={formData.date_of_birth}\n            onChange={(e) => handleInputChange('date_of_birth', e.target.value)}\n            className=\"glass-input smooth-transition\"\n            required\n          />\n        </div>\n      </div>\n\n      <div>\n        <Label htmlFor=\"blood_group\">Blood Group</Label>\n        <Select value={formData.blood_group} onValueChange={(value) => handleInputChange('blood_group', value)}>\n          <SelectTrigger className=\"glass-input smooth-transition\">\n            <SelectValue placeholder=\"Select blood group\" />\n          </SelectTrigger>\n          <SelectContent className=\"glass-modal\">\n            {bloodGroups.map((group) => (\n              <SelectItem key={group} value={group}>{group}</SelectItem>\n            ))}\n          </SelectContent>\n        </Select>\n      </div>\n    </motion.div>\n  );\n\n  const ContactInfoStep = () => (\n    <motion.div\n      initial={{ opacity: 0, x: 20 }}\n      animate={{ opacity: 1, x: 0 }}\n      className=\"space-y-6\"\n    >\n      <div className=\"text-center mb-6\">\n        <h3 className=\"text-lg font-semibold text-gray-900\">Contact Information</h3>\n        <p className=\"text-sm text-muted-foreground\">Address and contact details</p>\n      </div>\n\n      <div className=\"grid grid-cols-1 md:grid-cols-2 gap-4\">\n        <div>\n          <Label htmlFor=\"phone\">Phone Number *</Label>\n          <Input\n            id=\"phone\"\n            value={formData.phone}\n            onChange={(e) => handleInputChange('phone', e.target.value)}\n            placeholder=\"Enter phone number\"\n            className=\"glass-input smooth-transition\"\n            required\n          />\n        </div>\n        <div>\n          <Label htmlFor=\"emergency_contact\">Emergency Contact *</Label>\n          <Input\n            id=\"emergency_contact\"\n            value={formData.emergency_contact}\n            onChange={(e) => handleInputChange('emergency_contact', e.target.value)}\n            placeholder=\"Emergency contact number\"\n            className=\"glass-input smooth-transition\"\n            required\n          />\n        </div>\n      </div>\n\n      <div>\n        <Label htmlFor=\"emergency_contact_relation\">Emergency Contact Relation</Label>\n        <Select value={formData.emergency_contact_relation} onValueChange={(value) => handleInputChange('emergency_contact_relation', value)}>\n          <SelectTrigger className=\"glass-input smooth-transition\">\n            <SelectValue placeholder=\"Select relation\" />\n          </SelectTrigger>\n          <SelectContent className=\"glass-modal\">\n            {relations.map((relation) => (\n              <SelectItem key={relation} value={relation}>{relation}</SelectItem>\n            ))}\n          </SelectContent>\n        </Select>\n      </div>\n\n      <div>\n        <Label htmlFor=\"address\">Address *</Label>\n        <Textarea\n          id=\"address\"\n          value={formData.address}\n          onChange={(e) => handleInputChange('address', e.target.value)}\n          placeholder=\"Enter full address\"\n          className=\"glass-input smooth-transition\"\n          required\n        />\n      </div>\n\n      <div className=\"grid grid-cols-1 md:grid-cols-3 gap-4\">\n        <div>\n          <Label htmlFor=\"city\">City *</Label>\n          <Input\n            id=\"city\"\n            value={formData.city}\n            onChange={(e) => handleInputChange('city', e.target.value)}\n            placeholder=\"Enter city\"\n            className=\"glass-input smooth-transition\"\n            required\n          />\n        </div>\n        <div>\n          <Label htmlFor=\"state\">State</Label>\n          <Input\n            id=\"state\"\n            value={formData.state}\n            onChange={(e) => handleInputChange('state', e.target.value)}\n            placeholder=\"Enter state\"\n            className=\"glass-input smooth-transition\"\n          />\n        </div>\n        <div>\n          <Label htmlFor=\"postal_code\">Postal Code</Label>\n          <Input\n            id=\"postal_code\"\n            value={formData.postal_code}\n            onChange={(e) => handleInputChange('postal_code', e.target.value)}\n            placeholder=\"Enter postal code\"\n            className=\"glass-input smooth-transition\"\n          />\n        </div>\n      </div>\n    </motion.div>\n  );\n\n  const MedicalInfoStep = () => (\n    <motion.div\n      initial={{ opacity: 0, x: 20 }}\n      animate={{ opacity: 1, x: 0 }}\n      className=\"space-y-6\"\n    >\n      <div className=\"text-center mb-6\">\n        <h3 className=\"text-lg font-semibold text-gray-900\">Medical Information</h3>\n        <p className=\"text-sm text-muted-foreground\">Insurance and medical history (optional)</p>\n      </div>\n\n      <div className=\"grid grid-cols-1 md:grid-cols-2 gap-4\">\n        <div>\n          <Label htmlFor=\"insurance_provider\">Insurance Provider</Label>\n          <Input\n            id=\"insurance_provider\"\n            value={formData.insurance_provider}\n            onChange={(e) => handleInputChange('insurance_provider', e.target.value)}\n            placeholder=\"Enter insurance provider\"\n            className=\"glass-input smooth-transition\"\n          />\n        </div>\n        <div>\n          <Label htmlFor=\"insurance_number\">Insurance Number</Label>\n          <Input\n            id=\"insurance_number\"\n            value={formData.insurance_number}\n            onChange={(e) => handleInputChange('insurance_number', e.target.value)}\n            placeholder=\"Enter insurance number\"\n            className=\"glass-input smooth-transition\"\n          />\n        </div>\n      </div>\n\n      <div>\n        <Label htmlFor=\"medical_history\">Medical History</Label>\n        <Textarea\n          id=\"medical_history\"\n          value={formData.medical_history}\n          onChange={(e) => handleInputChange('medical_history', e.target.value)}\n          placeholder=\"Enter relevant medical history\"\n          className=\"glass-input smooth-transition\"\n          rows={3}\n        />\n      </div>\n\n      <div>\n        <Label htmlFor=\"allergies\">Known Allergies</Label>\n        <Textarea\n          id=\"allergies\"\n          value={formData.allergies}\n          onChange={(e) => handleInputChange('allergies', e.target.value)}\n          placeholder=\"Enter known allergies\"\n          className=\"glass-input smooth-transition\"\n          rows={2}\n        />\n      </div>\n\n      <div>\n        <Label htmlFor=\"current_medications\">Current Medications</Label>\n        <Textarea\n          id=\"current_medications\"\n          value={formData.current_medications}\n          onChange={(e) => handleInputChange('current_medications', e.target.value)}\n          placeholder=\"Enter current medications\"\n          className=\"glass-input smooth-transition\"\n          rows={2}\n        />\n      </div>\n    </motion.div>\n  );\n\n  return (\n    <div className=\"max-w-4xl mx-auto\">\n      <Card className=\"glass-card smooth-transition\">\n        <CardHeader className=\"text-center\">\n          <CardTitle className=\"flex items-center justify-center gap-2\">\n            <User className=\"size-6 text-primary glow\" />\n            Patient Registration\n          </CardTitle>\n          <p className=\"text-muted-foreground\">Register a new patient in the system</p>\n        </CardHeader>\n        \n        <CardContent>\n          <form onSubmit={handleSubmit}>\n            <StepIndicator />\n            \n            <div className=\"min-h-[500px]\">\n              {currentStep === 1 && <PersonalInfoStep />}\n              {currentStep === 2 && <ContactInfoStep />}\n              {currentStep === 3 && <MedicalInfoStep />}\n            </div>\n\n            <div className=\"flex justify-between mt-8 pt-6 border-t glass\">\n              <Button\n                type=\"button\"\n                variant=\"outline\"\n                onClick={prevStep}\n                disabled={currentStep === 1}\n                className=\"glass-button smooth-transition\"\n              >\n                Previous\n              </Button>\n              \n              <div className=\"flex gap-2\">\n                {currentStep < 3 ? (\n                  <Button\n                    type=\"button\"\n                    onClick={nextStep}\n                    disabled={!isStepValid(currentStep)}\n                    className=\"glass-button smooth-transition glow-hover\"\n                  >\n                    Next\n                  </Button>\n                ) : (\n                  <Button\n                    type=\"submit\"\n                    disabled={isSubmitting}\n                    className=\"glass-button smooth-transition glow-hover\"\n                  >\n                    {isSubmitting ? (\n                      <div className=\"flex items-center gap-2\">\n                        <div className=\"w-4 h-4 border-2 border-border border-t-transparent rounded-full animate-spin\" />\n                        Registering...\n                      </div>\n                    ) : (\n                      <div className=\"flex items-center gap-2\">\n                        <Save className=\"size-4\" />\n                        Register Patient\n                      </div>\n                    )}\n                  </Button>\n                )}\n              </div>\n            </div>\n          </form>\n        </CardContent>\n      </Card>\n    </div>\n  );\n}

