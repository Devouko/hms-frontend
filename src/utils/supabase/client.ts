import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Ensure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set in your .env file.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database table interfaces
export interface Patient {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  date_of_birth?: string;
  gender?: string;
  emergency_contact?: string;
  medical_history?: string;
  workflow_stage?: string;
  workflow_status?: string;
  created_at: string;
  updated_at: string;
}

export interface Appointment {
  id: string;
  patient_id: string;
  doctor_name: string;
  appointment_date: string;
  appointment_time: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface Payment {
  id: string;
  patient_id: string;
  amount: number;
  payment_method: string;
  status: 'pending' | 'completed' | 'failed';
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface Employee {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  position?: string;
  department?: string;
  salary?: number;
  hire_date?: string;
  status: 'active' | 'inactive';
  created_at: string;
  updated_at: string;
}

export interface Inventory {
  id: string;
  name: string;
  category?: string;
  quantity: number;
  unit_price?: number;
  supplier?: string;
  expiry_date?: string;
  status: 'in_stock' | 'low_stock' | 'out_of_stock';
  created_at: string;
  updated_at: string;
}

// Helper functions for data operations
export const patientService = {
  async getAll() {
    const { data, error } = await supabase
      .from('patients')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  async create(patient: Omit<Patient, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('patients')
      .insert([patient])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async update(id: string, updates: Partial<Patient>) {
    const { data, error } = await supabase
      .from('patients')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('patients')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
};

export const appointmentService = {
  async getAll() {
    try {
      const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .order('appointment_date', { ascending: true });
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      // Fallback to localStorage
      const localData = localStorage.getItem('hospital_appointments');
      return localData ? JSON.parse(localData) : [];
    }
  },

  async create(appointment: Partial<Appointment>) {
    const newAppointment = {
      id: appointment.id || Date.now().toString(),
      patient_id: appointment.patient_id || 'temp-patient-id',
      doctor_name: appointment.doctor_name || '',
      appointment_date: appointment.appointment_date || '',
      appointment_time: appointment.appointment_time || '',
      status: appointment.status || 'scheduled',
      notes: appointment.notes || '',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    try {
      const { data, error } = await supabase
        .from('appointments')
        .insert([newAppointment])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      // Fallback to localStorage
      const localData = localStorage.getItem('hospital_appointments');
      const appointments = localData ? JSON.parse(localData) : [];
      appointments.push(newAppointment);
      localStorage.setItem('hospital_appointments', JSON.stringify(appointments));
      return newAppointment;
    }
  },

  async update(id: string, updates: Partial<Appointment>) {
    try {
      const { data, error } = await supabase
        .from('appointments')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      // Fallback to localStorage
      const localData = localStorage.getItem('hospital_appointments');
      const appointments = localData ? JSON.parse(localData) : [];
      const index = appointments.findIndex((apt: any) => apt.id === id);
      if (index !== -1) {
        appointments[index] = { ...appointments[index], ...updates, updated_at: new Date().toISOString() };
        localStorage.setItem('hospital_appointments', JSON.stringify(appointments));
        return appointments[index];
      }
      throw error;
    }
  },

  async delete(id: string) {
    try {
      const { error } = await supabase
        .from('appointments')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    } catch (error) {
      // Fallback to localStorage
      const localData = localStorage.getItem('hospital_appointments');
      const appointments = localData ? JSON.parse(localData) : [];
      const filtered = appointments.filter((apt: any) => apt.id !== id);
      localStorage.setItem('hospital_appointments', JSON.stringify(filtered));
    }
  }
};

export const paymentService = {
  async getAll() {
    const { data, error } = await supabase
      .from('payments')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  async create(payment: Omit<Payment, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('payments')
      .insert([payment])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async update(id: string, updates: Partial<Payment>) {
    const { data, error } = await supabase
      .from('payments')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('payments')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
};

export const employeeService = {
  async getAll() {
    const { data, error } = await supabase
      .from('employees')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  async create(employee: Omit<Employee, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('employees')
      .insert([employee])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async update(id: string, updates: Partial<Employee>) {
    const { data, error } = await supabase
      .from('employees')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('employees')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
};

export const inventoryService = {
  async getAll() {
    const { data, error } = await supabase
      .from('inventory')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  async create(item: Omit<Inventory, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('inventory')
      .insert([item])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async update(id: string, updates: Partial<Inventory>) {
    const { data, error } = await supabase
      .from('inventory')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('inventory')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
};