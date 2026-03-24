import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Settings, 
  Users, 
  DollarSign, 
  Bed, 
  Printer, 
  UserCheck, 
  Pill, 
  FlaskConical, 
  Zap, 
  TrendingUp, 
  Baby, 
  UserCog, 
  Package 
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { SystemSettings } from './SystemSettings';
import { PatientSetup } from './setup/PatientSetup';
import { HospitalChargesSetup } from './setup/HospitalChargesSetup';
import { BedSetup } from './setup/BedSetup';
import PrintHeaderFooterSetup from './setup/PrintHeaderFooterSetup';
import PharmacySetup from './setup/PharmacySetup';
import PathologySetup from './setup/PathologySetup';
import RadiologySetup from './setup/RadiologySetup';
import FinanceSetup from './setup/FinanceSetup';
import FrontOfficeSetup from './setup/FrontOfficeSetup';
import HumanResourceSetup from './setup/HumanResourceSetup';
import InventorySetup from './setup/InventorySetup';
import BirthDeathRecordSetup from './setup/BirthDeathRecordSetup';

type SetupSection = 
  | 'overview'
  | 'settings'
  | 'patient'
  | 'hospital-charges'
  | 'bed'
  | 'print-header-footer'
  | 'front-office'
  | 'pharmacy'
  | 'pathology'
  | 'radiology'
  | 'finance'
  | 'birth-death-record'
  | 'human-resource'
  | 'inventory';

interface SetupModuleProps {
  session: any;
}

export function SetupModule({ session }: SetupModuleProps) {
  const [activeSection, setActiveSection] = useState<SetupSection>('overview');

  const setupSections = [
    {
      id: 'settings' as SetupSection,
      title: 'Settings',
      description: 'General settings, notifications, SMS, email, payment methods',
      icon: Settings,
      color: 'bg-blue-500'
    },
    {
      id: 'patient' as SetupSection,
      title: 'Patient',
      description: 'Patient management and configuration',
      icon: Users,
      color: 'bg-green-500'
    },
    {
      id: 'hospital-charges' as SetupSection,
      title: 'Hospital Charges',
      description: 'Charge categories and pricing setup',
      icon: DollarSign,
      color: 'bg-yellow-500'
    },
    {
      id: 'bed' as SetupSection,
      title: 'Bed Management',
      description: 'Floors, bed groups, bed types and bed allocation',
      icon: Bed,
      color: 'bg-purple-500'
    },
    {
      id: 'print-header-footer' as SetupSection,
      title: 'Print Header Footer',
      description: 'Configure headers and footers for bills and prescriptions',
      icon: Printer,
      color: 'bg-indigo-500'
    },
    {
      id: 'front-office' as SetupSection,
      title: 'Front Office',
      description: 'Visitor purposes, complaint types and sources',
      icon: UserCheck,
      color: 'bg-pink-500'
    },
    {
      id: 'pharmacy' as SetupSection,
      title: 'Pharmacy',
      description: 'Medicine categories, suppliers and dosages',
      icon: Pill,
      color: 'bg-red-500'
    },
    {
      id: 'pathology' as SetupSection,
      title: 'Pathology',
      description: 'Pathology test categories and configuration',
      icon: FlaskConical,
      color: 'bg-orange-500'
    },
    {
      id: 'radiology' as SetupSection,
      title: 'Radiology',
      description: 'Radiology test categories and configuration',
      icon: Zap,
      color: 'bg-cyan-500'
    },
    {
      id: 'finance' as SetupSection,
      title: 'Finance',
      description: 'Income and expense heads configuration',
      icon: TrendingUp,
      color: 'bg-emerald-500'
    },
    {
      id: 'birth-death-record' as SetupSection,
      title: 'Birth & Death Record',
      description: 'Custom fields for birth and death records',
      icon: Baby,
      color: 'bg-teal-500'
    },
    {
      id: 'human-resource' as SetupSection,
      title: 'Human Resource',
      description: 'Leave types, departments and designations',
      icon: UserCog,
      color: 'bg-violet-500'
    },
    {
      id: 'inventory' as SetupSection,
      title: 'Inventory',
      description: 'Item categories, stores and suppliers',
      icon: Package,
      color: 'bg-slate-500'
    }
  ];

  const renderContent = () => {
    switch (activeSection) {
      case 'settings':
        return <SystemSettings session={session} />;
      case 'patient':
        return <PatientSetup session={session} />;
      case 'hospital-charges':
        return <HospitalChargesSetup session={session} />;
      case 'bed':
        return <BedSetup session={session} />;
      case 'print-header-footer':
        return <PrintHeaderFooterSetup />;
      case 'front-office':
        return <FrontOfficeSetup />;
      case 'pharmacy':
        return <PharmacySetup />;
      case 'pathology':
        return <PathologySetup />;
      case 'radiology':
        return <RadiologySetup />;
      case 'finance':
        return <FinanceSetup />;
      case 'birth-death-record':
        return <BirthDeathRecordSetup />;
      case 'human-resource':
        return <HumanResourceSetup />;
      case 'inventory':
        return <InventorySetup />;
      default:
        return (
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="size-6" />
                    Setup Overview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-6">
                    Configure your hospital management system by setting up various modules and their configurations. 
                    Each section allows you to customize different aspects of the system according to your hospital's needs.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {setupSections.map((section, index) => {
                      const Icon = section.icon;
                      return (
                        <motion.div
                          key={section.id}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <Card 
                            className="cursor-pointer hover:shadow-md transition-all glass-bg"
                            onClick={() => setActiveSection(section.id)}
                          >
                            <CardContent className="p-4">
                              <div className="flex items-start gap-3">
                                <div className={`p-2 rounded-lg ${section.color} text-white`}>
                                  <Icon className="size-5" />
                                </div>
                                <div className="flex-1">
                                  <h3 className="font-semibold text-foreground mb-1">{section.title}</h3>
                                  <p className="text-sm text-muted-foreground">{section.description}</p>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        );
    }
  };

  return (
    <div className="space-y-6">
      {activeSection !== 'overview' && (
        <div className="flex items-center gap-4 mb-6">
          <Button 
            variant="outline" 
            onClick={() => setActiveSection('overview')}
          >
            ← Back to Setup Overview
          </Button>
          <h1 className="text-2xl font-bold">
            {setupSections.find(s => s.id === activeSection)?.title || 'Setup'}
          </h1>
        </div>
      )}
      
      {renderContent()}
    </div>
  );
}

