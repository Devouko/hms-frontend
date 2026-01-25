import { createClient } from '@supabase/supabase-js';
import { projectId, publicAnonKey } from './info';

const supabase = createClient(
  `https://${projectId}.supabase.co`,
  publicAnonKey
);

export class DatabaseService {
  // Patients
  static async getPatients() {
    try {
      const { data, error } = await supabase.from('patients').select('*');
      if (error) throw error;
      return { data: data || [], error: null };
    } catch (error) {
      const fallback = JSON.parse(localStorage.getItem('hospital_patients') || '[]');
      return { data: fallback, error };
    }
  }

  static async createPatient(patient: any) {
    try {
      const { data, error } = await supabase.from('patients').insert(patient).select();
      if (error) throw error;
      return { data: data?.[0], error: null };
    } catch (error) {
      const patients = JSON.parse(localStorage.getItem('hospital_patients') || '[]');
      const newPatient = { ...patient, id: Date.now().toString() };
      patients.push(newPatient);
      localStorage.setItem('hospital_patients', JSON.stringify(patients));
      return { data: newPatient, error };
    }
  }

  static async updatePatient(id: string, updates: any) {
    try {
      const { data, error } = await supabase.from('patients').update(updates).eq('id', id).select();
      if (error) throw error;
      return { data: data?.[0], error: null };
    } catch (error) {
      const patients = JSON.parse(localStorage.getItem('hospital_patients') || '[]');
      const index = patients.findIndex((p: any) => p.id === id);
      if (index !== -1) {
        patients[index] = { ...patients[index], ...updates };
        localStorage.setItem('hospital_patients', JSON.stringify(patients));
        return { data: patients[index], error };
      }
      return { data: null, error };
    }
  }

  // Appointments
  static async getAppointments() {
    try {
      const { data, error } = await supabase.from('appointments').select('*');
      if (error) throw error;
      return { data: data || [], error: null };
    } catch (error) {
      const fallback = JSON.parse(localStorage.getItem('hospital_appointments') || '[]');
      return { data: fallback, error };
    }
  }

  static async createAppointment(appointment: any) {
    try {
      const { data, error } = await supabase.from('appointments').insert(appointment).select();
      if (error) throw error;
      return { data: data?.[0], error: null };
    } catch (error) {
      const appointments = JSON.parse(localStorage.getItem('hospital_appointments') || '[]');
      const newAppointment = { ...appointment, id: Date.now().toString() };
      appointments.push(newAppointment);
      localStorage.setItem('hospital_appointments', JSON.stringify(appointments));
      return { data: newAppointment, error };
    }
  }

  // Staff
  static async getStaff() {
    try {
      const { data, error } = await supabase.from('staff').select('*');
      if (error) throw error;
      return { data: data || [], error: null };
    } catch (error) {
      const fallback = JSON.parse(localStorage.getItem('hospital_staff') || '[]');
      return { data: fallback, error };
    }
  }

  static async createStaff(staff: any) {
    try {
      const { data, error } = await supabase.from('staff').insert(staff).select();
      if (error) throw error;
      return { data: data?.[0], error: null };
    } catch (error) {
      const staffList = JSON.parse(localStorage.getItem('hospital_staff') || '[]');
      const newStaff = { ...staff, id: Date.now().toString() };
      staffList.push(newStaff);
      localStorage.setItem('hospital_staff', JSON.stringify(staffList));
      return { data: newStaff, error };
    }
  }

  // Departments
  static async getDepartments() {
    try {
      const { data, error } = await supabase.from('departments').select('*');
      if (error) throw error;
      return { data: data || [], error: null };
    } catch (error) {
      const fallback = JSON.parse(localStorage.getItem('hospital_departments') || '[]');
      return { data: fallback, error };
    }
  }

  static async createDepartment(department: any) {
    try {
      const { data, error } = await supabase.from('departments').insert(department).select();
      if (error) throw error;
      return { data: data?.[0], error: null };
    } catch (error) {
      const departments = JSON.parse(localStorage.getItem('hospital_departments') || '[]');
      const newDepartment = { ...department, id: Date.now().toString() };
      departments.push(newDepartment);
      localStorage.setItem('hospital_departments', JSON.stringify(departments));
      return { data: newDepartment, error };
    }
  }

  // Beds
  static async getBeds() {
    try {
      const { data, error } = await supabase.from('beds').select('*');
      if (error) throw error;
      return { data: data || [], error: null };
    } catch (error) {
      const fallback = JSON.parse(localStorage.getItem('hospital_beds') || '[]');
      return { data: fallback, error };
    }
  }

  static async createBed(bed: any) {
    try {
      const { data, error } = await supabase.from('beds').insert(bed).select();
      if (error) throw error;
      return { data: data?.[0], error: null };
    } catch (error) {
      const beds = JSON.parse(localStorage.getItem('hospital_beds') || '[]');
      const newBed = { ...bed, id: Date.now().toString() };
      beds.push(newBed);
      localStorage.setItem('hospital_beds', JSON.stringify(beds));
      return { data: newBed, error };
    }
  }

  // Emergency Cases
  static async getEmergencyCases() {
    try {
      const { data, error } = await supabase.from('emergency_cases').select('*');
      if (error) throw error;
      return { data: data || [], error: null };
    } catch (error) {
      const fallback = JSON.parse(localStorage.getItem('hospital_emergency_cases') || '[]');
      return { data: fallback, error };
    }
  }

  static async createEmergencyCase(emergencyCase: any) {
    try {
      const { data, error } = await supabase.from('emergency_cases').insert(emergencyCase).select();
      if (error) throw error;
      return { data: data?.[0], error: null };
    } catch (error) {
      const cases = JSON.parse(localStorage.getItem('hospital_emergency_cases') || '[]');
      const newCase = { ...emergencyCase, id: Date.now().toString() };
      cases.push(newCase);
      localStorage.setItem('hospital_emergency_cases', JSON.stringify(cases));
      return { data: newCase, error };
    }
  }

  // Inpatient Admissions
  static async getInpatientAdmissions() {
    try {
      const { data, error } = await supabase.from('inpatient_admissions').select('*');
      if (error) throw error;
      return { data: data || [], error: null };
    } catch (error) {
      const fallback = JSON.parse(localStorage.getItem('hospital_inpatient_admissions') || '[]');
      return { data: fallback, error };
    }
  }

  static async createInpatientAdmission(admission: any) {
    try {
      const { data, error } = await supabase.from('inpatient_admissions').insert(admission).select();
      if (error) throw error;
      return { data: data?.[0], error: null };
    } catch (error) {
      const admissions = JSON.parse(localStorage.getItem('hospital_inpatient_admissions') || '[]');
      const newAdmission = { ...admission, id: Date.now().toString() };
      admissions.push(newAdmission);
      localStorage.setItem('hospital_inpatient_admissions', JSON.stringify(admissions));
      return { data: newAdmission, error };
    }
  }

  // Outpatient Appointments
  static async getOutpatientAppointments() {
    try {
      const { data, error } = await supabase.from('outpatient_appointments').select('*');
      if (error) throw error;
      return { data: data || [], error: null };
    } catch (error) {
      const fallback = JSON.parse(localStorage.getItem('hospital_outpatient_appointments') || '[]');
      return { data: fallback, error };
    }
  }

  static async createOutpatientAppointment(appointment: any) {
    try {
      const { data, error } = await supabase.from('outpatient_appointments').insert(appointment).select();
      if (error) throw error;
      return { data: data?.[0], error: null };
    } catch (error) {
      const appointments = JSON.parse(localStorage.getItem('hospital_outpatient_appointments') || '[]');
      const newAppointment = { ...appointment, id: Date.now().toString() };
      appointments.push(newAppointment);
      localStorage.setItem('hospital_outpatient_appointments', JSON.stringify(appointments));
      return { data: newAppointment, error };
    }
  }

  // Visitors
  static async getVisitors() {
    try {
      const { data, error } = await supabase.from('visitors').select('*');
      if (error) throw error;
      return { data: data || [], error: null };
    } catch (error) {
      const fallback = JSON.parse(localStorage.getItem('hospital_visitors') || '[]');
      return { data: fallback, error };
    }
  }

  static async createVisitor(visitor: any) {
    try {
      const { data, error } = await supabase.from('visitors').insert(visitor).select();
      if (error) throw error;
      return { data: data?.[0], error: null };
    } catch (error) {
      const visitors = JSON.parse(localStorage.getItem('hospital_visitors') || '[]');
      const newVisitor = { ...visitor, id: Date.now().toString() };
      visitors.push(newVisitor);
      localStorage.setItem('hospital_visitors', JSON.stringify(visitors));
      return { data: newVisitor, error };
    }
  }

  // Pharmacy
  static async getMedicines() {
    try {
      const { data, error } = await supabase.from('medicines').select('*');
      if (error) throw error;
      return { data: data || [], error: null };
    } catch (error) {
      const fallback = JSON.parse(localStorage.getItem('hospital_medicines') || '[]');
      return { data: fallback, error };
    }
  }

  static async createMedicine(medicine: any) {
    try {
      const { data, error } = await supabase.from('medicines').insert(medicine).select();
      if (error) throw error;
      return { data: data?.[0], error: null };
    } catch (error) {
      const medicines = JSON.parse(localStorage.getItem('hospital_medicines') || '[]');
      const newMedicine = { ...medicine, id: Date.now().toString() };
      medicines.push(newMedicine);
      localStorage.setItem('hospital_medicines', JSON.stringify(medicines));
      return { data: newMedicine, error };
    }
  }

  // Pathology
  static async getPathologyTests() {
    try {
      const { data, error } = await supabase.from('pathology_tests').select('*');
      if (error) throw error;
      return { data: data || [], error: null };
    } catch (error) {
      const fallback = JSON.parse(localStorage.getItem('hospital_pathology_tests') || '[]');
      return { data: fallback, error };
    }
  }

  static async createPathologyTest(test: any) {
    try {
      const { data, error } = await supabase.from('pathology_tests').insert(test).select();
      if (error) throw error;
      return { data: data?.[0], error: null };
    } catch (error) {
      const tests = JSON.parse(localStorage.getItem('hospital_pathology_tests') || '[]');
      const newTest = { ...test, id: Date.now().toString() };
      tests.push(newTest);
      localStorage.setItem('hospital_pathology_tests', JSON.stringify(tests));
      return { data: newTest, error };
    }
  }

  // Radiology
  static async getRadiologyTests() {
    try {
      const { data, error } = await supabase.from('radiology_tests').select('*');
      if (error) throw error;
      return { data: data || [], error: null };
    } catch (error) {
      const fallback = JSON.parse(localStorage.getItem('hospital_radiology_tests') || '[]');
      return { data: fallback, error };
    }
  }

  static async createRadiologyTest(test: any) {
    try {
      const { data, error } = await supabase.from('radiology_tests').insert(test).select();
      if (error) throw error;
      return { data: data?.[0], error: null };
    } catch (error) {
      const tests = JSON.parse(localStorage.getItem('hospital_radiology_tests') || '[]');
      const newTest = { ...test, id: Date.now().toString() };
      tests.push(newTest);
      localStorage.setItem('hospital_radiology_tests', JSON.stringify(tests));
      return { data: newTest, error };
    }
  }

  // Blood Bank
  static async getBloodBank() {
    try {
      const { data, error } = await supabase.from('blood_bank').select('*');
      if (error) throw error;
      return { data: data || [], error: null };
    } catch (error) {
      const fallback = JSON.parse(localStorage.getItem('hospital_blood_bank') || '[]');
      return { data: fallback, error };
    }
  }

  static async createBloodEntry(entry: any) {
    try {
      const { data, error } = await supabase.from('blood_bank').insert(entry).select();
      if (error) throw error;
      return { data: data?.[0], error: null };
    } catch (error) {
      const bloodBank = JSON.parse(localStorage.getItem('hospital_blood_bank') || '[]');
      const newEntry = { ...entry, id: Date.now().toString() };
      bloodBank.push(newEntry);
      localStorage.setItem('hospital_blood_bank', JSON.stringify(bloodBank));
      return { data: newEntry, error };
    }
  }

  // Bills
  static async getBills() {
    try {
      const { data, error } = await supabase.from('bills').select('*');
      if (error) throw error;
      return { data: data || [], error: null };
    } catch (error) {
      const fallback = JSON.parse(localStorage.getItem('hospital_bills') || '[]');
      return { data: fallback, error };
    }
  }

  static async createBill(bill: any) {
    try {
      const { data, error } = await supabase.from('bills').insert(bill).select();
      if (error) throw error;
      return { data: data?.[0], error: null };
    } catch (error) {
      const bills = JSON.parse(localStorage.getItem('hospital_bills') || '[]');
      const newBill = { ...bill, id: Date.now().toString() };
      bills.push(newBill);
      localStorage.setItem('hospital_bills', JSON.stringify(bills));
      return { data: newBill, error };
    }
  }

  // Expenses
  static async getExpenses() {
    try {
      const { data, error } = await supabase.from('expenses').select('*');
      if (error) throw error;
      return { data: data || [], error: null };
    } catch (error) {
      const fallback = JSON.parse(localStorage.getItem('hospital_expenses') || '[]');
      return { data: fallback, error };
    }
  }

  static async createExpense(expense: any) {
    try {
      const { data, error } = await supabase.from('expenses').insert(expense).select();
      if (error) throw error;
      return { data: data?.[0], error: null };
    } catch (error) {
      const expenses = JSON.parse(localStorage.getItem('hospital_expenses') || '[]');
      const newExpense = { ...expense, id: Date.now().toString() };
      expenses.push(newExpense);
      localStorage.setItem('hospital_expenses', JSON.stringify(expenses));
      return { data: newExpense, error };
    }
  }

  // Income
  static async getIncome() {
    try {
      const { data, error } = await supabase.from('income').select('*');
      if (error) throw error;
      return { data: data || [], error: null };
    } catch (error) {
      const fallback = JSON.parse(localStorage.getItem('hospital_income') || '[]');
      return { data: fallback, error };
    }
  }

  static async createIncome(income: any) {
    try {
      const { data, error } = await supabase.from('income').insert(income).select();
      if (error) throw error;
      return { data: data?.[0], error: null };
    } catch (error) {
      const incomeList = JSON.parse(localStorage.getItem('hospital_income') || '[]');
      const newIncome = { ...income, id: Date.now().toString() };
      incomeList.push(newIncome);
      localStorage.setItem('hospital_income', JSON.stringify(incomeList));
      return { data: newIncome, error };
    }
  }

  // Ambulance
  static async getAmbulanceCalls() {
    try {
      const { data, error } = await supabase.from('ambulance_calls').select('*');
      if (error) throw error;
      return { data: data || [], error: null };
    } catch (error) {
      const fallback = JSON.parse(localStorage.getItem('hospital_ambulance_calls') || '[]');
      return { data: fallback, error };
    }
  }

  static async createAmbulanceCall(call: any) {
    try {
      const { data, error } = await supabase.from('ambulance_calls').insert(call).select();
      if (error) throw error;
      return { data: data?.[0], error: null };
    } catch (error) {
      const calls = JSON.parse(localStorage.getItem('hospital_ambulance_calls') || '[]');
      const newCall = { ...call, id: Date.now().toString() };
      calls.push(newCall);
      localStorage.setItem('hospital_ambulance_calls', JSON.stringify(calls));
      return { data: newCall, error };
    }
  }

  // Operation Theatre
  static async getSurgeries() {
    try {
      const { data, error } = await supabase.from('surgeries').select('*');
      if (error) throw error;
      return { data: data || [], error: null };
    } catch (error) {
      const fallback = JSON.parse(localStorage.getItem('hospital_surgeries') || '[]');
      return { data: fallback, error };
    }
  }

  static async createSurgery(surgery: any) {
    try {
      const { data, error } = await supabase.from('surgeries').insert(surgery).select();
      if (error) throw error;
      return { data: data?.[0], error: null };
    } catch (error) {
      const surgeries = JSON.parse(localStorage.getItem('hospital_surgeries') || '[]');
      const newSurgery = { ...surgery, id: Date.now().toString() };
      surgeries.push(newSurgery);
      localStorage.setItem('hospital_surgeries', JSON.stringify(surgeries));
      return { data: newSurgery, error };
    }
  }

  // Payroll
  static async getPayrolls() {
    try {
      const { data, error } = await supabase.from('payrolls').select('*');
      if (error) throw error;
      return { data: data || [], error: null };
    } catch (error) {
      const fallback = JSON.parse(localStorage.getItem('hospital_payrolls') || '[]');
      return { data: fallback, error };
    }
  }

  static async createPayroll(payroll: any) {
    try {
      const { data, error } = await supabase.from('payrolls').insert(payroll).select();
      if (error) throw error;
      return { data: data?.[0], error: null };
    } catch (error) {
      const payrolls = JSON.parse(localStorage.getItem('hospital_payrolls') || '[]');
      const newPayroll = { ...payroll, id: Date.now().toString() };
      payrolls.push(newPayroll);
      localStorage.setItem('hospital_payrolls', JSON.stringify(payrolls));
      return { data: newPayroll, error };
    }
  }

  // Attendance
  static async getAttendance() {
    try {
      const { data, error } = await supabase.from('attendance').select('*');
      if (error) throw error;
      return { data: data || [], error: null };
    } catch (error) {
      const fallback = JSON.parse(localStorage.getItem('hospital_attendance') || '[]');
      return { data: fallback, error };
    }
  }

  static async createAttendance(attendance: any) {
    try {
      const { data, error } = await supabase.from('attendance').insert(attendance).select();
      if (error) throw error;
      return { data: data?.[0], error: null };
    } catch (error) {
      const attendanceList = JSON.parse(localStorage.getItem('hospital_attendance') || '[]');
      const newAttendance = { ...attendance, id: Date.now().toString() };
      attendanceList.push(newAttendance);
      localStorage.setItem('hospital_attendance', JSON.stringify(attendanceList));
      return { data: newAttendance, error };
    }
  }
}

export { supabase };