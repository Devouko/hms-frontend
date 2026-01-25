export interface GeneralSettings {
  hospitalName: string;
  address: string;
  phone: string;
  email: string;
  hospitalCode: string;
  language: string;
  languageRTL: boolean;
  timezone: string;
  dateFormat: string;
  timeFormat: '12' | '24';
  currency: string;
  currencySymbol: string;
  creditLimit: number;
  doctorRestrictionMode: boolean;
  superadminVisibility: boolean;
}

export interface NotificationSettings {
  emailNotifications: boolean;
  smsNotifications: boolean;
  pushNotifications: boolean;
  appointmentReminders: boolean;
  paymentReminders: boolean;
  systemAlerts: boolean;
  emergencyAlerts: boolean;
  maintenanceNotifications: boolean;
}

export interface SMSSettings {
  provider: 'twilio' | 'nexmo' | 'aws-sns' | 'custom';
  apiKey: string;
  apiSecret: string;
  senderName: string;
  enabled: boolean;
  templates: {
    appointmentReminder: string;
    paymentDue: string;
    labResults: string;
    emergencyAlert: string;
  };
}

export interface EmailSettings {
  smtpHost: string;
  smtpPort: number;
  smtpUsername: string;
  smtpPassword: string;
  smtpEncryption: 'tls' | 'ssl' | 'none';
  fromEmail: string;
  fromName: string;
  enabled: boolean;
  templates: {
    welcome: string;
    appointmentConfirmation: string;
    passwordReset: string;
    invoiceGenerated: string;
  };
}

export interface PaymentMethod {
  id: string;
  name: string;
  type: 'cash' | 'card' | 'bank_transfer' | 'insurance' | 'online';
  enabled: boolean;
  configuration: Record<string, any>;
}

export interface FrontCMSSettings {
  siteName: string;
  siteDescription: string;
  logo: string;
  favicon: string;
  primaryColor: string;
  secondaryColor: string;
  headerContent: string;
  footerContent: string;
  contactInfo: {
    address: string;
    phone: string;
    email: string;
    workingHours: string;
  };
  socialMedia: {
    facebook?: string;
    twitter?: string;
    linkedin?: string;
    instagram?: string;
  };
  seoSettings: {
    metaTitle: string;
    metaDescription: string;
    keywords: string[];
  };
}

export interface Permission {
  id: string;
  name: string;
  description: string;
  module: string;
  actions: string[];
}

export interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  isSystem: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface BackupSettings {
  autoBackup: boolean;
  frequency: 'daily' | 'weekly' | 'monthly';
  time: string;
  retentionDays: number;
  includeFiles: boolean;
  compressionEnabled: boolean;
  encryptionEnabled: boolean;
  storageLocation: 'local' | 'cloud';
  cloudProvider?: 'aws' | 'google' | 'azure';
  cloudConfiguration?: Record<string, any>;
}

export interface Language {
  code: string;
  name: string;
  nativeName: string;
  rtl: boolean;
  enabled: boolean;
  translations: Record<string, string>;
}

export interface User {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  department?: string;
  phone?: string;
  avatar?: string;
  isActive: boolean;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface SystemModule {
  id: string;
  name: string;
  description: string;
  version: string;
  enabled: boolean;
  dependencies: string[];
  configuration: Record<string, any>;
  permissions: string[];
}

export interface SystemSettings {
  general: GeneralSettings;
  notifications: NotificationSettings;
  sms: SMSSettings;
  email: EmailSettings;
  paymentMethods: PaymentMethod[];
  frontCMS: FrontCMSSettings;
  roles: Role[];
  permissions: Permission[];
  backup: BackupSettings;
  languages: Language[];
  users: User[];
  modules: SystemModule[];
}