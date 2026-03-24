interface AIMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface AIResponse {
  content: string;
  error?: string;
}

class AIService {
  private apiKey: string;
  private baseUrl = 'https://api.groq.com/openai/v1/chat/completions';

  constructor() {
    this.apiKey = process.env.NEXT_PUBLIC_GROQ_API_KEY || '';
  }

  private getRolePermissions(userRole: string): string[] {
    const permissions = {
      user: ['general_medical', 'appointment_help', 'basic_info'],
      doctor: ['medical_diagnosis', 'patient_care', 'treatment_plans', 'medical_records'],
      nurse: ['patient_care', 'medication_info', 'vital_signs', 'nursing_procedures'],
      pharmacist: ['medication_info', 'drug_interactions', 'pharmacy_operations'],
      lab_technician: ['lab_procedures', 'test_results', 'specimen_handling'],
      receptionist: ['appointment_scheduling', 'patient_registration', 'billing_info'],
      admin: ['system_management', 'reports', 'user_management', 'hospital_operations'],
      super_admin: ['all_permissions', 'system_config', 'security_settings', 'advanced_analytics']
    };
    return permissions[userRole as keyof typeof permissions] || permissions.user;
  }

  private getSystemPrompt(userRole: string, currentPage: string): string {
    const permissions = this.getRolePermissions(userRole);
    
    return `You are SmartCare AI Assistant, an intelligent medical assistant for SmartCare Hospital Management System.

SYSTEM OVERVIEW:
SmartCare is a comprehensive hospital management platform with the following modules:

1. PATIENT MANAGEMENT
   - Patient Registration & Records
   - Medical History & Documents
   - Admission & Discharge
   - Patient Workflow Tracking
   - OPD (Outpatient) & IPD (Inpatient) Management

2. APPOINTMENT SYSTEM
   - Schedule & Manage Appointments
   - Doctor Availability
   - Appointment Reminders
   - Queue Management

3. FRONT OFFICE
   - Patient Check-in/Registration
   - Visitor Management
   - Queue Management
   - Token System

4. MEDICAL SERVICES
   - Doctor Portal (Consultations, Prescriptions)
   - Nursing Station (Patient Care, Vitals)
   - Pharmacy (Medication, Inventory)
   - Laboratory (Tests, Results, Specimens)
   - Radiology (Imaging, Reports)
   - Blood Bank (Inventory, Requests)
   - Operation Theatre Management

5. HOSPITAL RESOURCES
   - Bed Management & Allocation
   - Inventory Management
   - Ambulance & Vehicle Tracking
   - Emergency Management

6. FINANCIAL MANAGEMENT
   - Billing & Payments
   - Insurance Processing
   - Expense Tracking
   - Income Reports
   - Invoice Generation

7. STAFF MANAGEMENT
   - Employee Records
   - Doctor Management
   - Department Management
   - Payroll & Attendance
   - User Accounts & Permissions

8. REPORTS & ANALYTICS
   - Statistics Dashboard
   - Custom Reports
   - Activity Logs
   - Performance Metrics

9. SYSTEM ADMINISTRATION
   - User Management
   - Role-Based Access Control
   - System Settings
   - Backup & Security
   - Complaint Management

CURRENT CONTEXT:
User Role: ${userRole}
Current Page: ${currentPage}
Permissions: ${permissions.join(', ')}

ROLE-BASED ACCESS:
- User: Basic access to patient info, appointments, payments
- Receptionist: Front office, registration, appointments, billing
- Doctor: Patient care, medical records, prescriptions, consultations
- Nurse: Patient care, vitals, medication administration, nursing procedures
- Pharmacist: Medication management, inventory, prescriptions
- Lab Technician: Lab tests, results, specimen tracking
- Admin: Staff management, reports, system operations
- Super Admin: Full system access, configuration, security

YOUR CAPABILITIES:
- Answer questions about system features and navigation
- Explain how to use specific modules
- Provide role-specific guidance
- Help with common tasks and workflows
- Explain medical terminology when needed
- Guide users through processes step-by-step

RESTRICTIONS:
- Only provide information within user's permission scope
- Don't share sensitive data or admin credentials
- Politely decline requests outside user's role
- Focus on hospital management and medical topics

Provide clear, helpful, and accurate responses. Be concise but thorough.`;
  }

  async sendMessage(
    messages: AIMessage[], 
    userRole: string = 'user', 
    currentPage: string = 'dashboard'
  ): Promise<AIResponse> {
    try {
      if (!this.apiKey) {
        return { 
          content: 'AI assistant is not configured. Please contact your administrator.',
          error: 'Missing API key'
        };
      }

      const systemPrompt = this.getSystemPrompt(userRole, currentPage);
      
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages: [
            { role: 'system', content: systemPrompt },
            ...messages
          ],
          temperature: 0.7,
          max_tokens: 1000,
        })
      });

      if (!response.ok) {
        return { 
          content: 'I apologize, but I\'m having trouble connecting to the AI service right now. Please try again later.',
          error: `API request failed: ${response.status}`
        };
      }

      const data = await response.json();
      return { content: data.choices[0]?.message?.content || 'No response' };
    } catch (error) {
      console.error('AI Service Error:', error);
      return { 
        content: 'AI service temporarily unavailable. Please try again later.',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  async getContextualHelp(userRole: string, currentPage: string, query?: string): Promise<string> {
    const contextPrompts = {
      dashboard: 'Provide an overview of key hospital metrics and what to focus on.',
      patients: 'Help with patient management, registration, and medical records.',
      appointments: 'Assist with appointment scheduling, management, and optimization.',
      pharmacy: 'Provide guidance on medication management and pharmacy operations.',
      laboratory: 'Help with lab procedures, test management, and result interpretation.',
      billing: 'Assist with billing processes, insurance, and financial management.',
      reports: 'Guide on generating and interpreting hospital reports and analytics.'
    };

    const prompt = query || contextPrompts[currentPage as keyof typeof contextPrompts] || 'How can I help you with hospital management?';
    
    const response = await this.sendMessage([
      { role: 'user', content: prompt }
    ], userRole, currentPage);

    return response.content;
  }
}

export const aiService = new AIService();