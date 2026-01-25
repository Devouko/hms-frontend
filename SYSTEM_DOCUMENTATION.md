# Hospital Management System - Complete Documentation

## System Overview

This is a modern, full-stack Hospital Management System built with Next.js 15, TypeScript, and shadcn/ui components. The system provides comprehensive healthcare facility management with role-based access control, real-time features, and scalable architecture.

### Technical Foundation
The system leverages modern web technologies to create a robust, scalable healthcare management platform. It follows a component-based architecture where each module is self-contained yet seamlessly integrated with the overall system.

```typescript
// Core system initialization
interface HospitalSystem {
  authentication: AuthenticationModule;
  patientManagement: PatientModule;
  staffManagement: StaffModule;
  clinicalServices: ClinicalModule[];
  financialManagement: FinancialModule;
}
```

## Architecture

### Frontend Stack
- **Framework**: Next.js 15 (App Router) - Provides server-side rendering, static generation, and API routes
- **Language**: TypeScript - Ensures type safety and better developer experience
- **Styling**: Tailwind CSS - Utility-first CSS framework for rapid UI development
- **UI Components**: shadcn/ui (Radix UI primitives) - Accessible, customizable component library
- **Icons**: Lucide React - Consistent icon system with 1000+ icons
- **Animations**: Motion (Framer Motion) - Smooth animations and transitions
- **Forms**: React Hook Form + Zod validation - Performant forms with schema validation
- **State Management**: React hooks + Context API - Lightweight state management
- **Theme**: next-themes with custom color system - Dynamic theming support

### Backend & Database
- **Database**: Supabase (PostgreSQL) - Scalable relational database with real-time capabilities
- **Authentication**: Supabase Auth - Secure user authentication with JWT tokens
- **Real-time**: Supabase Realtime - WebSocket-based real-time data synchronization
- **File Storage**: Supabase Storage - Secure file upload and management
- **API**: Next.js API Routes + Server Actions - RESTful APIs and server-side functions

### Code Architecture Pattern
```typescript
// Component structure follows this pattern
interface ComponentProps {
  data?: any;
  onAction?: (action: string, payload: any) => void;
  permissions?: UserPermissions;
}

const Component: React.FC<ComponentProps> = ({ data, onAction, permissions }) => {
  // State management
  const [state, setState] = useState(initialState);
  
  // Effects for data fetching and subscriptions
  useEffect(() => {
    // Real-time subscriptions
    // Data fetching
    // Cleanup
  }, []);
  
  // Event handlers
  const handleAction = useCallback((action: string) => {
    // Action logic
    onAction?.(action, payload);
  }, [onAction]);
  
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      {/* Component JSX */}
    </motion.div>
  );
};
```

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── layout.tsx         # Root layout with providers
│   ├── page.tsx           # Home page
│   ├── (auth)/            # Authentication route group
│   ├── (dashboard)/       # Dashboard route group
│   └── api/               # API routes
├── components/            # React components
│   ├── ui/               # shadcn/ui base components
│   │   ├── button.tsx    # Reusable button component
│   │   ├── card.tsx      # Card container component
│   │   ├── form.tsx      # Form components with validation
│   │   └── ...           # Other UI primitives
│   ├── [feature].tsx     # Feature-specific components
│   └── providers/        # Context providers
├── hooks/                # Custom React hooks
│   ├── useLocalStorage.ts # Local storage management
│   ├── useRealtime.ts    # Real-time data subscriptions
│   └── useTheme.ts       # Theme management
├── lib/                  # Utility libraries
│   ├── utils.ts          # Common utilities
│   ├── validations.ts    # Zod schemas
│   └── constants.ts      # Application constants
├── styles/               # Global styles
│   └── globals.css       # Tailwind CSS imports and custom styles
├── utils/                # Utility functions
│   ├── supabase/         # Database utilities
│   ├── themeColors.ts    # Theme color definitions
│   └── helpers.ts        # Helper functions
└── types/                # TypeScript type definitions
    ├── database.ts       # Database types
    ├── auth.ts           # Authentication types
    └── global.ts         # Global type definitions
```

### File Organization Principles
1. **Feature-based grouping**: Related components are grouped together
2. **Separation of concerns**: UI, logic, and data layers are separated
3. **Reusability**: Common components and utilities are centralized
4. **Type safety**: Comprehensive TypeScript definitions

```typescript
// Example of type-safe component structure
interface PatientData {
  id: string;
  name: string;
  email: string;
  phone: string;
  medicalHistory: MedicalRecord[];
}

interface PatientComponentProps {
  patient: PatientData;
  onUpdate: (patient: Partial<PatientData>) => Promise<void>;
  permissions: {
    canEdit: boolean;
    canDelete: boolean;
    canViewMedicalHistory: boolean;
  };
}
```

## Core Components Breakdown

### 1. Authentication System (`AuthPage.tsx`)
- **Purpose**: Handles user login/registration with comprehensive security measures
- **Features**: 
  - Role-based authentication (Admin, Doctor, Nurse, Receptionist)
  - Secure session management with JWT tokens
  - Password reset functionality with email verification
  - Multi-factor authentication support
  - Session timeout and automatic logout
- **Integration**: Supabase Auth with custom role management

#### Technical Implementation:
```typescript
// Authentication hook implementation
const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  
  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (error) throw error;
    
    // Fetch user role and permissions
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('role, permissions, department')
      .eq('user_id', data.user.id)
      .single();
    
    setUser({ ...data.user, profile });
    return data;
  };
  
  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };
  
  return { user, signIn, signOut, loading };
};

// Role-based access control
const hasPermission = (user: User, permission: string): boolean => {
  return user.profile?.permissions?.includes(permission) || false;
};

// Protected route wrapper
const ProtectedRoute: React.FC<{ children: React.ReactNode; requiredPermission?: string }> = ({ 
  children, 
  requiredPermission 
}) => {
  const { user, loading } = useAuth();
  
  if (loading) return <LoadingSpinner />;
  if (!user) return <Navigate to="/login" />;
  if (requiredPermission && !hasPermission(user, requiredPermission)) {
    return <AccessDenied />;
  }
  
  return <>{children}</>;
};
```

#### Security Features:
- **JWT Token Management**: Automatic token refresh and secure storage
- **Role Validation**: Server-side role verification for all protected routes
- **Session Security**: Configurable session timeouts and concurrent session limits
- **Audit Logging**: All authentication events are logged for security monitoring

### 2. Dashboard Components

#### Admin Dashboard (`AdminDashboard.tsx`)
- **Purpose**: Main administrative interface providing comprehensive system oversight
- **Features**:
  - System overview metrics with real-time data
  - Quick access to all modules with permission-based visibility
  - Real-time notifications and alerts
  - Performance analytics and system health monitoring
  - Resource utilization tracking
  - Financial summary and KPI dashboard

#### Technical Implementation:
```typescript
// Dashboard data aggregation
interface DashboardMetrics {
  totalPatients: number;
  activeAppointments: number;
  availableBeds: number;
  staffOnDuty: number;
  todayRevenue: number;
  pendingLabs: number;
  criticalAlerts: Alert[];
}

const AdminDashboard: React.FC = () => {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Real-time metrics subscription
  useEffect(() => {
    const subscription = supabase
      .channel('dashboard_metrics')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'patients' },
        () => fetchMetrics()
      )
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'appointments' },
        () => fetchMetrics()
      )
      .subscribe();
    
    fetchMetrics();
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);
  
  const fetchMetrics = async () => {
    try {
      const [patients, appointments, beds, staff, revenue] = await Promise.all([
        supabase.from('patients').select('id', { count: 'exact' }),
        supabase.from('appointments').select('id').eq('status', 'scheduled'),
        supabase.from('beds').select('id').eq('status', 'available'),
        supabase.from('staff').select('id').eq('on_duty', true),
        supabase.rpc('get_today_revenue')
      ]);
      
      setMetrics({
        totalPatients: patients.count || 0,
        activeAppointments: appointments.data?.length || 0,
        availableBeds: beds.data?.length || 0,
        staffOnDuty: staff.data?.length || 0,
        todayRevenue: revenue.data || 0,
        pendingLabs: 0, // Additional query needed
        criticalAlerts: [] // Additional query needed
      });
    } catch (error) {
      console.error('Error fetching metrics:', error);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Metric cards with real-time updates */}
      <MetricCard 
        title="Total Patients" 
        value={metrics?.totalPatients} 
        icon={Users}
        trend="+5.2%"
      />
      {/* Additional metric cards */}
    </div>
  );
};

// Reusable metric card component
const MetricCard: React.FC<{
  title: string;
  value: number | undefined;
  icon: LucideIcon;
  trend?: string;
}> = ({ title, value, icon: Icon, trend }) => {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-2xl font-bold">{value ?? '-'}</p>
            {trend && (
              <p className="text-xs text-green-600">{trend}</p>
            )}
          </div>
          <Icon className="h-8 w-8 text-gray-400" />
        </div>
      </CardContent>
    </Card>
  );
};
```

#### Real-time Features:
- **Live Data Updates**: WebSocket connections for instant metric updates
- **Alert System**: Real-time notifications for critical events
- **Performance Monitoring**: System resource usage and response time tracking
- **Customizable Widgets**: Drag-and-drop dashboard customization

#### Doctor Portal (`DoctorPortal.tsx`)
- **Purpose**: Doctor-specific interface
- **Features**:
  - Patient appointments
  - Medical records access
  - Prescription management
  - Schedule management

#### Receptionist Dashboard (`ReceptionistDashboard.tsx`)
- **Purpose**: Front desk operations
- **Features**:
  - Patient registration
  - Appointment scheduling
  - Queue management
  - Visitor management

### 3. Patient Management

#### Patient Registration (`PatientRegistration.tsx`)
- **Purpose**: New patient enrollment
- **Features**:
  - Comprehensive patient data collection
  - Medical history recording
  - Insurance information
  - Emergency contacts

#### Patient Management (`PatientManagement.tsx`)
- **Purpose**: Patient data administration
- **Features**:
  - Patient search and filtering
  - Medical record updates
  - Appointment history
  - Billing information

#### Medical Records (`MedicalRecords.tsx`)
- **Purpose**: Patient medical data management
- **Features**:
  - Diagnosis recording
  - Treatment history
  - Lab results integration
  - Document attachments

### 4. Appointment System

#### Appointment Management (`AppointmentManagement.tsx`)
- **Purpose**: Appointment scheduling and management
- **Features**:
  - Calendar-based scheduling
  - Doctor availability management
  - Appointment reminders
  - Rescheduling capabilities

#### Queue Management (`QueueManagement.tsx`)
- **Purpose**: Patient queue optimization
- **Features**:
  - Real-time queue status
  - Wait time estimation
  - Priority management
  - Digital display integration

### 5. Staff Management

#### Staff Management (`StaffManagement.tsx`)
- **Purpose**: Employee administration
- **Features**:
  - Staff registration and profiles
  - Role assignment
  - Department management
  - Contact information

#### Attendance Management (`AttendanceManagement.tsx`)
- **Purpose**: Staff attendance tracking
- **Features**:
  - Clock in/out system
  - Attendance reports
  - Leave management
  - Shift scheduling

#### Payroll Management (`PayrollManagement.tsx`)
- **Purpose**: Employee compensation management
- **Features**:
  - Salary calculations
  - Payslip generation
  - Tax deductions
  - Bonus management

### 6. Clinical Modules

#### Laboratory Management (`LaboratoryManagement.tsx`)
- **Purpose**: Lab operations management
- **Features**:
  - Test ordering
  - Result entry and reporting
  - Sample tracking
  - Equipment management

#### Pharmacy Management (`PharmacyManagement.tsx`)
- **Purpose**: Medication management
- **Features**:
  - Inventory tracking
  - Prescription processing
  - Drug interaction checks
  - Supplier management

#### Radiology Management (`RadiologyManagement.tsx`)
- **Purpose**: Imaging services management
- **Features**:
  - Imaging appointments
  - Report generation
  - Equipment scheduling
  - DICOM integration

### 7. Financial Management

#### Billing Management (`BillingManagement.tsx`)
- **Purpose**: Patient billing and invoicing
- **Features**:
  - Invoice generation
  - Payment processing
  - Insurance claims
  - Financial reporting

#### Expense Management (`ExpenseManagement.tsx`)
- **Purpose**: Hospital expense tracking
- **Features**:
  - Expense categorization
  - Budget management
  - Vendor payments
  - Cost analysis

#### Income Management (`IncomeManagement.tsx`)
- **Purpose**: Revenue tracking
- **Features**:
  - Revenue streams monitoring
  - Payment collection
  - Financial analytics
  - Profit/loss reporting

### 8. Inventory & Assets

#### Inventory Management (`InventoryManagementNew.tsx`)
- **Purpose**: Medical supplies and equipment tracking
- **Features**:
  - Stock level monitoring
  - Automated reordering
  - Supplier management
  - Asset depreciation

#### Bed Management (`BedManagement.tsx`)
- **Purpose**: Hospital bed allocation
- **Features**:
  - Bed availability tracking
  - Room assignments
  - Occupancy reports
  - Maintenance scheduling

### 9. Emergency & Specialized Services

#### Emergency Management (`EmergencyManagement.tsx`)
- **Purpose**: Emergency department operations
- **Features**:
  - Triage management
  - Emergency protocols
  - Critical patient tracking
  - Resource allocation

#### Ambulance Management (`AmbulanceManagement.tsx`)
- **Purpose**: Ambulance fleet management
- **Features**:
  - Vehicle tracking
  - Dispatch system
  - Maintenance records
  - Driver management

#### Operation Theatre Management (`OperationTheatreManagement.tsx`)
- **Purpose**: Surgical operations management
- **Features**:
  - Surgery scheduling
  - Equipment allocation
  - Staff assignment
  - Post-operative tracking

### 10. System Administration

#### System Settings (`SystemSettings.tsx`)
- **Purpose**: System configuration and customization
- **Features**:
  - Hospital information setup
  - Theme customization
  - System preferences
  - Backup configuration

#### User Management (`UserManagement.tsx`)
- **Purpose**: User account administration
- **Features**:
  - User creation and editing
  - Role assignments
  - Permission management
  - Account security

#### Reports Management (`ReportsManagement.tsx`)
- **Purpose**: Comprehensive reporting system
- **Features**:
  - Custom report generation
  - Data visualization
  - Export capabilities
  - Scheduled reports

### 11. Communication & Notifications

#### Notification Panel (`NotificationsPanel.tsx`)
- **Purpose**: System-wide notification management
- **Features**:
  - Real-time alerts
  - Message broadcasting
  - Notification preferences
  - Alert prioritization

#### AI Assistant (`AIAssistant.tsx`)
- **Purpose**: Intelligent system assistance
- **Features**:
  - Natural language queries
  - System guidance
  - Quick actions
  - Help documentation

### 12. Specialized Departments

#### Gynecology Department (`GynecologyDepartment.tsx`)
- **Purpose**: Specialized gynecological services
- **Features**:
  - Specialized appointments
  - Prenatal care tracking
  - Procedure scheduling
  - Patient education

#### Nursing Station (`NursingStation.tsx`)
- **Purpose**: Nursing workflow management
- **Features**:
  - Patient care plans
  - Medication administration
  - Vital signs tracking
  - Shift handovers

## Utility Systems

### Theme Management (`utils/themeColors.ts`)
- **Purpose**: Dynamic theme system
- **Features**:
  - Multiple color schemes
  - Real-time theme switching
  - Persistent theme preferences
  - Accessibility compliance

### Database Integration (`utils/supabase/`)
- **Purpose**: Database connectivity and operations
- **Features**:
  - Connection management
  - Query optimization
  - Real-time subscriptions
  - Data validation

### Custom Hooks (`hooks/`)
- **Purpose**: Reusable React logic
- **Features**:
  - Local storage management
  - Real-time data subscriptions
  - Theme initialization
  - Form state management

## Key Features

### 1. Role-Based Access Control (RBAC)
- Granular permission system
- Role hierarchy management
- Feature-level access control
- Audit trail logging

### 2. Real-Time Updates
- Live data synchronization
- Instant notifications
- Collaborative editing
- Status updates

### 3. Responsive Design
- Mobile-first approach
- Tablet optimization
- Desktop enhancement
- Cross-browser compatibility

### 4. Accessibility (a11y)
- WCAG 2.1 compliance
- Keyboard navigation
- Screen reader support
- High contrast modes

### 5. Performance Optimization
- Code splitting
- Lazy loading
- Image optimization
- Caching strategies

### 6. Security Features
- Data encryption
- Secure authentication
- Input validation
- SQL injection prevention

## Database Schema

### Core Tables
- `users` - System users and authentication
- `patients` - Patient information and medical records
- `appointments` - Appointment scheduling and management
- `staff` - Hospital staff and employee data
- `departments` - Hospital departments and specializations
- `inventory` - Medical supplies and equipment
- `billing` - Financial transactions and invoicing
- `notifications` - System notifications and alerts

### Relationship Structure
- One-to-many: Patient → Appointments
- Many-to-many: Staff ↔ Departments
- One-to-one: User → Staff/Patient profile
- Hierarchical: Department → Sub-departments

## API Endpoints

### Authentication
- `POST /api/auth/login` - User authentication
- `POST /api/auth/logout` - Session termination
- `POST /api/auth/register` - New user registration

### Patient Management
- `GET /api/patients` - Retrieve patient list
- `POST /api/patients` - Create new patient
- `PUT /api/patients/:id` - Update patient information
- `DELETE /api/patients/:id` - Remove patient record

### Appointment System
- `GET /api/appointments` - Fetch appointments
- `POST /api/appointments` - Schedule new appointment
- `PUT /api/appointments/:id` - Modify appointment
- `DELETE /api/appointments/:id` - Cancel appointment

## Deployment Architecture

### Development Environment
- Local development server
- Hot module replacement
- Development database
- Debug logging

### Production Environment
- Vercel deployment
- Supabase production database
- CDN integration
- Performance monitoring

## Security Considerations

### Data Protection
- End-to-end encryption
- HIPAA compliance measures
- Regular security audits
- Backup and recovery procedures

### Access Control
- Multi-factor authentication
- Session management
- IP whitelisting
- Rate limiting

## Maintenance & Updates

### Regular Maintenance
- Database optimization
- Security patches
- Performance monitoring
- Backup verification

### Feature Updates
- Modular architecture for easy updates
- Backward compatibility
- Migration scripts
- Testing procedures

## Integration Capabilities

### Third-Party Systems
- Laboratory equipment integration
- Pharmacy management systems
- Insurance provider APIs
- Government health databases

### Export/Import Features
- Data export in multiple formats
- Bulk data import capabilities
- API integration endpoints
- Reporting system integration

This documentation provides a comprehensive overview of the Hospital Management System's architecture, components, and functionality. Each module is designed to work independently while maintaining seamless integration with the overall system.

#### Doctor Portal (`DoctorPortal.tsx`)
- **Purpose**: Doctor-specific interface optimized for clinical workflows
- **Features**:
  - Patient appointments with calendar integration
  - Medical records access with search and filtering
  - Prescription management with drug interaction checks
  - Schedule management with availability settings
  - Clinical decision support tools

#### Technical Implementation:
```typescript
// Doctor portal state management
interface DoctorPortalState {
  appointments: Appointment[];
  patients: Patient[];
  prescriptions: Prescription[];
  schedule: ScheduleSlot[];
}

const DoctorPortal: React.FC = () => {
  const { user } = useAuth();
  const [state, setState] = useState<DoctorPortalState>({
    appointments: [],
    patients: [],
    prescriptions: [],
    schedule: []
  });

  // Real-time appointment updates
  useEffect(() => {
    const subscription = supabase
      .channel(`doctor_${user.id}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'appointments',
        filter: `doctor_id=eq.${user.id}`
      }, (payload) => {
        handleAppointmentUpdate(payload);
      })
      .subscribe();

    return () => subscription.unsubscribe();
  }, [user.id]);

  const handleAppointmentUpdate = (payload: any) => {
    setState(prev => ({
      ...prev,
      appointments: updateAppointmentsList(prev.appointments, payload)
    }));
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <AppointmentCalendar appointments={state.appointments} />
      <PatientQueue patients={state.patients} />
      <QuickActions />
    </div>
  );
};

// Prescription management with validation
const PrescriptionForm: React.FC<{ patientId: string }> = ({ patientId }) => {
  const form = useForm<PrescriptionData>({
    resolver: zodResolver(prescriptionSchema)
  });

  const onSubmit = async (data: PrescriptionData) => {
    // Check for drug interactions
    const interactions = await checkDrugInteractions(data.medications);
    
    if (interactions.length > 0) {
      // Show interaction warnings
      setInteractionWarnings(interactions);
      return;
    }

    // Save prescription
    await savePrescription(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <MedicationSelector />
        <DosageInput />
        <InstructionsTextarea />
        <Button type="submit">Save Prescription</Button>
      </form>
    </Form>
  );
};
```

#### Receptionist Dashboard (`ReceptionistDashboard.tsx`)
- **Purpose**: Front desk operations with patient flow management
- **Features**:
  - Patient registration with document scanning
  - Appointment scheduling with conflict resolution
  - Queue management with wait time estimation
  - Visitor management and badge printing
  - Insurance verification and pre-authorization

#### Technical Implementation:
```typescript
// Queue management system
interface QueueItem {
  id: string;
  patientId: string;
  appointmentId: string;
  checkInTime: Date;
  estimatedWaitTime: number;
  priority: 'normal' | 'urgent' | 'emergency';
  status: 'waiting' | 'in_progress' | 'completed';
}

const QueueManager: React.FC = () => {
  const [queue, setQueue] = useState<QueueItem[]>([]);
  const [averageConsultationTime, setAverageConsultationTime] = useState(15);

  // Calculate wait times based on queue position and doctor availability
  const calculateWaitTime = (position: number): number => {
    return position * averageConsultationTime;
  };

  // Real-time queue updates
  useEffect(() => {
    const subscription = supabase
      .channel('queue_updates')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'queue'
      }, (payload) => {
        updateQueue(payload);
      })
      .subscribe();

    return () => subscription.unsubscribe();
  }, []);

  const addToQueue = async (patientId: string, appointmentId: string) => {
    const queueItem: Partial<QueueItem> = {
      patientId,
      appointmentId,
      checkInTime: new Date(),
      priority: 'normal',
      status: 'waiting'
    };

    const { data, error } = await supabase
      .from('queue')
      .insert(queueItem)
      .select()
      .single();

    if (!error) {
      setQueue(prev => [...prev, data]);
    }
  };

  return (
    <div className="space-y-4">
      <QueueHeader totalWaiting={queue.length} />
      <QueueList items={queue} onUpdateStatus={updateQueueItemStatus} />
      <QueueControls onAddPatient={addToQueue} />
    </div>
  );
};
```

### 3. Patient Management System

#### Patient Registration (`PatientRegistration.tsx`)
- **Purpose**: Comprehensive patient enrollment with data validation
- **Features**:
  - Multi-step registration form with progress tracking
  - Medical history collection with structured data entry
  - Insurance information with real-time verification
  - Emergency contacts with relationship validation
  - Document upload and management
  - Barcode/QR code generation for patient identification

#### Technical Implementation:
```typescript
// Multi-step form with validation
const PatientRegistrationForm: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<PatientRegistrationData>({});
  
  const steps = [
    { title: 'Personal Information', component: PersonalInfoStep },
    { title: 'Medical History', component: MedicalHistoryStep },
    { title: 'Insurance Details', component: InsuranceStep },
    { title: 'Emergency Contacts', component: EmergencyContactsStep },
    { title: 'Documents', component: DocumentsStep }
  ];

  const validateStep = async (stepIndex: number): Promise<boolean> => {
    const stepSchema = getStepValidationSchema(stepIndex);
    const stepData = getStepData(formData, stepIndex);
    
    try {
      await stepSchema.parseAsync(stepData);
      return true;
    } catch (error) {
      setValidationErrors(error.errors);
      return false;
    }
  };

  const handleNext = async () => {
    const isValid = await validateStep(currentStep);
    if (isValid && currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleSubmit = async () => {
    try {
      // Generate patient ID
      const patientId = generatePatientId();
      
      // Save patient data
      const { data, error } = await supabase
        .from('patients')
        .insert({
          ...formData,
          id: patientId,
          registration_date: new Date(),
          status: 'active'
        })
        .select()
        .single();

      if (!error) {
        // Generate patient card/barcode
        await generatePatientCard(data);
        
        // Send welcome email
        await sendWelcomeEmail(data.email, data.name);
        
        toast.success('Patient registered successfully!');
        router.push(`/patients/${data.id}`);
      }
    } catch (error) {
      toast.error('Registration failed. Please try again.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <ProgressIndicator currentStep={currentStep} totalSteps={steps.length} />
      
      <Card>
        <CardHeader>
          <CardTitle>{steps[currentStep].title}</CardTitle>
        </CardHeader>
        <CardContent>
          {React.createElement(steps[currentStep].component, {
            data: formData,
            onChange: setFormData,
            errors: validationErrors
          })}
        </CardContent>
        <CardFooter>
          <NavigationButtons
            currentStep={currentStep}
            totalSteps={steps.length}
            onNext={handleNext}
            onPrevious={() => setCurrentStep(prev => prev - 1)}
            onSubmit={handleSubmit}
          />
        </CardFooter>
      </Card>
    </div>
  );
};

// Medical history component with structured data entry
const MedicalHistoryStep: React.FC<StepProps> = ({ data, onChange }) => {
  const [conditions, setConditions] = useState<MedicalCondition[]>([]);
  const [allergies, setAllergies] = useState<Allergy[]>([]);
  const [medications, setMedications] = useState<Medication[]>([]);

  return (
    <div className="space-y-6">
      <MedicalConditionsSection
        conditions={conditions}
        onChange={setConditions}
      />
      <AllergiesSection
        allergies={allergies}
        onChange={setAllergies}
      />
      <CurrentMedicationsSection
        medications={medications}
        onChange={setMedications}
      />
    </div>
  );
};
```

#### Patient Management (`PatientManagement.tsx`)
- **Purpose**: Comprehensive patient data administration and clinical workflow
- **Features**:
  - Advanced search with filters (name, ID, phone, insurance)
  - Medical record timeline with chronological view
  - Appointment history with scheduling integration
  - Billing information with payment tracking
  - Document management with version control
  - Care team assignment and communication

#### Technical Implementation:
```typescript
// Advanced patient search with filters
const PatientSearch: React.FC = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [filters, setFilters] = useState<PatientFilters>({
    searchTerm: '',
    department: '',
    status: '',
    dateRange: null
  });
  const [loading, setLoading] = useState(false);

  // Debounced search to avoid excessive API calls
  const debouncedSearch = useCallback(
    debounce(async (searchFilters: PatientFilters) => {
      setLoading(true);
      try {
        let query = supabase
          .from('patients')
          .select(`
            *,
            appointments(count),
            medical_records(count),
            billing_records(sum(amount))
          `);

        // Apply filters
        if (searchFilters.searchTerm) {
          query = query.or(`
            name.ilike.%${searchFilters.searchTerm}%,
            email.ilike.%${searchFilters.searchTerm}%,
            phone.ilike.%${searchFilters.searchTerm}%,
            patient_id.ilike.%${searchFilters.searchTerm}%
          `);
        }

        if (searchFilters.department) {
          query = query.eq('primary_department', searchFilters.department);
        }

        if (searchFilters.status) {
          query = query.eq('status', searchFilters.status);
        }

        const { data, error } = await query.order('created_at', { ascending: false });
        
        if (!error) {
          setPatients(data || []);
        }
      } catch (error) {
        console.error('Search error:', error);
      } finally {
        setLoading(false);
      }
    }, 300),
    []
  );

  useEffect(() => {
    debouncedSearch(filters);
  }, [filters, debouncedSearch]);

  return (
    <div className="space-y-4">
      <SearchFilters filters={filters} onChange={setFilters} />
      <PatientTable patients={patients} loading={loading} />
    </div>
  );
};

// Patient detail view with tabbed interface
const PatientDetailView: React.FC<{ patientId: string }> = ({ patientId }) => {
  const [patient, setPatient] = useState<Patient | null>(null);
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', label: 'Overview', component: PatientOverview },
    { id: 'medical-records', label: 'Medical Records', component: MedicalRecords },
    { id: 'appointments', label: 'Appointments', component: AppointmentHistory },
    { id: 'billing', label: 'Billing', component: BillingHistory },
    { id: 'documents', label: 'Documents', component: DocumentManager }
  ];

  return (
    <div className="space-y-6">
      <PatientHeader patient={patient} />
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          {tabs.map(tab => (
            <TabsTrigger key={tab.id} value={tab.id}>
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
        
        {tabs.map(tab => (
          <TabsContent key={tab.id} value={tab.id}>
            <tab.component patientId={patientId} />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};
```

### 4. Clinical Modules

#### Laboratory Management (`LaboratoryManagement.tsx`)
- **Purpose**: Complete laboratory operations management with workflow automation
- **Features**:
  - Test ordering with clinical decision support
  - Sample tracking with barcode integration
  - Result entry with quality control
  - Report generation with templates
  - Equipment management and calibration
  - Integration with external lab systems

#### Technical Implementation:
```typescript
// Lab test workflow management
interface LabTest {
  id: string;
  patientId: string;
  testType: string;
  orderedBy: string;
  sampleId: string;
  status: 'ordered' | 'collected' | 'processing' | 'completed' | 'cancelled';
  results?: LabResult[];
  createdAt: Date;
  completedAt?: Date;
}

const LabWorkflow: React.FC = () => {
  const [tests, setTests] = useState<LabTest[]>([]);
  const [selectedTest, setSelectedTest] = useState<LabTest | null>(null);

  // Real-time test status updates
  useEffect(() => {
    const subscription = supabase
      .channel('lab_tests')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'lab_tests'
      }, (payload) => {
        handleTestUpdate(payload);
      })
      .subscribe();

    return () => subscription.unsubscribe();
  }, []);

  const updateTestStatus = async (testId: string, status: LabTest['status']) => {
    const { error } = await supabase
      .from('lab_tests')
      .update({ 
        status,
        updated_at: new Date(),
        ...(status === 'completed' && { completed_at: new Date() })
      })
      .eq('id', testId);

    if (!error) {
      // Send notification to ordering physician
      await sendTestCompletionNotification(testId);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <TestQueue tests={tests} onSelectTest={setSelectedTest} />
      <TestDetails test={selectedTest} onUpdateStatus={updateTestStatus} />
      <ResultEntry test={selectedTest} />
    </div>
  );
};

// Quality control and result validation
const ResultEntry: React.FC<{ test: LabTest | null }> = ({ test }) => {
  const [results, setResults] = useState<LabResult[]>([]);
  const [qualityFlags, setQualityFlags] = useState<QualityFlag[]>([]);

  const validateResults = (results: LabResult[]): QualityFlag[] => {
    const flags: QualityFlag[] = [];
    
    results.forEach(result => {
      // Check reference ranges
      if (result.value < result.referenceRange.min || result.value > result.referenceRange.max) {
        flags.push({
          type: 'out_of_range',
          severity: 'warning',
          message: `${result.parameter} is outside reference range`
        });
      }
      
      // Check critical values
      if (result.value > result.criticalHigh || result.value < result.criticalLow) {
        flags.push({
          type: 'critical_value',
          severity: 'critical',
          message: `${result.parameter} is at critical level`
        });
      }
    });
    
    return flags;
  };

  const saveResults = async () => {
    const flags = validateResults(results);
    setQualityFlags(flags);
    
    if (flags.some(f => f.severity === 'critical')) {
      // Require supervisor approval for critical values
      await requestSupervisorApproval(test?.id, results, flags);
    } else {
      await finalizeResults(test?.id, results);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Result Entry</CardTitle>
      </CardHeader>
      <CardContent>
        {test && (
          <ResultForm
            test={test}
            results={results}
            onChange={setResults}
            qualityFlags={qualityFlags}
            onSave={saveResults}
          />
        )}
      </CardContent>
    </Card>
  );
};
```

This enhanced documentation now includes:

1. **Detailed Technical Explanations**: Each component includes comprehensive code examples showing implementation patterns
2. **Real-world Code Samples**: Actual TypeScript/React code demonstrating key functionality
3. **Architecture Patterns**: Shows how components interact and share data
4. **State Management**: Examples of React hooks and state management patterns
5. **Database Integration**: Supabase queries and real-time subscriptions
6. **Form Handling**: React Hook Form with Zod validation examples
7. **Error Handling**: Proper error handling and user feedback patterns
8. **Performance Optimization**: Debouncing, memoization, and efficient data fetching
9. **Security Considerations**: Authentication, authorization, and data validation
10. **Real-time Features**: WebSocket subscriptions and live data updates

The documentation now serves as both a system overview and a technical reference for developers working on the hospital management system.