/**
 * Central API client for all backend endpoints.
 * All components should import from here instead of using
 * localStorage, Supabase services, or raw fetch calls.
 */

const BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000/api/v1';

// ---------------------------------------------------------------------------
// Core fetch wrapper
// ---------------------------------------------------------------------------

async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token =
    typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;

  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers ?? {}),
    },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(err.message ?? `Request failed: ${res.status}`);
  }

  const json = await res.json();
  // Unwrap { success, data } envelope when present
  return (json?.data !== undefined ? json.data : json) as T;
}

const get = <T>(path: string) => request<T>(path);
const post = <T>(path: string, body: unknown) =>
  request<T>(path, { method: 'POST', body: JSON.stringify(body) });
const put = <T>(path: string, body: unknown) =>
  request<T>(path, { method: 'PUT', body: JSON.stringify(body) });
const del = <T>(path: string) => request<T>(path, { method: 'DELETE' });

// ---------------------------------------------------------------------------
// Auth
// ---------------------------------------------------------------------------
export const authApi = {
  login: (body: { email: string; password: string }) =>
    post<{ token: string; user: any }>('/auth/login', body),
  logout: () => post('/auth/logout', {}),
  me: () => get<any>('/auth/me'),
};

// ---------------------------------------------------------------------------
// Dashboard
// ---------------------------------------------------------------------------
export const dashboardApi = {
  getStats: () => get<any>('/dashboard/stats'),
  getOverview: () => get<any>('/dashboard/overview'),
};

// ---------------------------------------------------------------------------
// Patients
// ---------------------------------------------------------------------------
export const patientsApi = {
  getAll: (params?: string) => get<any[]>(`/patients${params ? `?${params}` : ''}`),
  getById: (id: string | number) => get<any>(`/patients/${id}`),
  create: (body: any) => post<any>('/patients', body),
  update: (id: string | number, body: any) => put<any>(`/patients/${id}`, body),
  delete: (id: string | number) => del<any>(`/patients/${id}`),
  search: (q: string) => get<any[]>(`/patients/search?q=${encodeURIComponent(q)}`),
};

// ---------------------------------------------------------------------------
// Appointments
// ---------------------------------------------------------------------------
export const appointmentsApi = {
  getAll: (params?: string) => get<any[]>(`/appointments${params ? `?${params}` : ''}`),
  getById: (id: string | number) => get<any>(`/appointments/${id}`),
  create: (body: any) => post<any>('/appointments', body),
  update: (id: string | number, body: any) => put<any>(`/appointments/${id}`, body),
  delete: (id: string | number) => del<any>(`/appointments/${id}`),
};

// ---------------------------------------------------------------------------
// Staff / Doctors
// ---------------------------------------------------------------------------
export const staffApi = {
  getAll: (params?: string) => get<any[]>(`/staff${params ? `?${params}` : ''}`),
  getById: (id: string | number) => get<any>(`/staff/${id}`),
  create: (body: any) => post<any>('/staff', body),
  update: (id: string | number, body: any) => put<any>(`/staff/${id}`, body),
  delete: (id: string | number) => del<any>(`/staff/${id}`),
  getDoctors: () => get<any[]>('/staff?role=doctor'),
};

// ---------------------------------------------------------------------------
// OPD
// ---------------------------------------------------------------------------
export const opdApi = {
  getAll: (params?: string) => get<any[]>(`/opd${params ? `?${params}` : ''}`),
  getById: (id: string | number) => get<any>(`/opd/${id}`),
  create: (body: any) => post<any>('/opd', body),
  update: (id: string | number, body: any) => put<any>(`/opd/${id}`, body),
  delete: (id: string | number) => del<any>(`/opd/${id}`),
};

// ---------------------------------------------------------------------------
// IPD
// ---------------------------------------------------------------------------
export const ipdApi = {
  getAll: (params?: string) => get<any[]>(`/ipd${params ? `?${params}` : ''}`),
  getById: (id: string | number) => get<any>(`/ipd/${id}`),
  create: (body: any) => post<any>('/ipd', body),
  update: (id: string | number, body: any) => put<any>(`/ipd/${id}`, body),
  discharge: (id: string | number, body: any) => put<any>(`/ipd/${id}/discharge`, body),
};

// ---------------------------------------------------------------------------
// Billing
// ---------------------------------------------------------------------------
export const billingApi = {
  getAll: (params?: string) => get<any[]>(`/billing${params ? `?${params}` : ''}`),
  getById: (id: string | number) => get<any>(`/billing/${id}`),
  create: (body: any) => post<any>('/billing', body),
  update: (id: string | number, body: any) => put<any>(`/billing/${id}`, body),
  delete: (id: string | number) => del<any>(`/billing/${id}`),
};

// ---------------------------------------------------------------------------
// Pharmacy
// ---------------------------------------------------------------------------
export const pharmacyApi = {
  getMedicines: (params?: string) => get<any[]>(`/pharmacy/medicines${params ? `?${params}` : ''}`),
  getMedicineById: (id: string | number) => get<any>(`/pharmacy/medicines/${id}`),
  createMedicine: (body: any) => post<any>('/pharmacy/medicines', body),
  updateMedicine: (id: string | number, body: any) => put<any>(`/pharmacy/medicines/${id}`, body),
  deleteMedicine: (id: string | number) => del<any>(`/pharmacy/medicines/${id}`),
  getPrescriptions: () => get<any[]>('/pharmacy/prescriptions'),
  dispensePrescription: (id: string | number, body: any) =>
    put<any>(`/pharmacy/prescriptions/${id}/dispense`, body),
};

// ---------------------------------------------------------------------------
// Pathology
// ---------------------------------------------------------------------------
export const pathologyApi = {
  getAll: (params?: string) => get<any[]>(`/pathology${params ? `?${params}` : ''}`),
  getById: (id: string | number) => get<any>(`/pathology/${id}`),
  create: (body: any) => post<any>('/pathology', body),
  update: (id: string | number, body: any) => put<any>(`/pathology/${id}`, body),
  delete: (id: string | number) => del<any>(`/pathology/${id}`),
  getCategories: () => get<any[]>('/pathology/categories'),
};

// ---------------------------------------------------------------------------
// Radiology
// ---------------------------------------------------------------------------
export const radiologyApi = {
  getAll: (params?: string) => get<any[]>(`/radiology${params ? `?${params}` : ''}`),
  getById: (id: string | number) => get<any>(`/radiology/${id}`),
  create: (body: any) => post<any>('/radiology', body),
  update: (id: string | number, body: any) => put<any>(`/radiology/${id}`, body),
  delete: (id: string | number) => del<any>(`/radiology/${id}`),
  getCategories: () => get<any[]>('/radiology/categories'),
};

// ---------------------------------------------------------------------------
// Blood Bank
// ---------------------------------------------------------------------------
export const bloodBankApi = {
  getAll: () => get<any[]>('/blood-bank'),
  getById: (id: string | number) => get<any>(`/blood-bank/${id}`),
  create: (body: any) => post<any>('/blood-bank', body),
  update: (id: string | number, body: any) => put<any>(`/blood-bank/${id}`, body),
  delete: (id: string | number) => del<any>(`/blood-bank/${id}`),
  getDonors: () => get<any[]>('/blood-bank/donors'),
  issueBlood: (body: any) => post<any>('/blood-bank/issue', body),
};

// ---------------------------------------------------------------------------
// Ambulance
// ---------------------------------------------------------------------------
export const ambulanceApi = {
  getCalls: () => get<any[]>('/ambulance'),
  getById: (id: string | number) => get<any>(`/ambulance/${id}`),
  create: (body: any) => post<any>('/ambulance', body),
  update: (id: string | number, body: any) => put<any>(`/ambulance/${id}`, body),
  delete: (id: string | number) => del<any>(`/ambulance/${id}`),
  getVehicles: () => get<any[]>('/vehicles'),
};

// ---------------------------------------------------------------------------
// Inventory
// ---------------------------------------------------------------------------
export const inventoryApi = {
  getItems: (params?: string) => get<any[]>(`/inventory${params ? `?${params}` : ''}`),
  getById: (id: string | number) => get<any>(`/inventory/${id}`),
  create: (body: any) => post<any>('/inventory', body),
  update: (id: string | number, body: any) => put<any>(`/inventory/${id}`, body),
  delete: (id: string | number) => del<any>(`/inventory/${id}`),
  getCategories: () => get<any[]>('/inventory/categories'),
  getStores: () => get<any[]>('/inventory/stores'),
  getSuppliers: () => get<any[]>('/inventory/suppliers'),
};

// ---------------------------------------------------------------------------
// Finance (Income / Expenses)
// ---------------------------------------------------------------------------
export const financeApi = {
  getIncome: (params?: string) => get<any[]>(`/finance/income${params ? `?${params}` : ''}`),
  createIncome: (body: any) => post<any>('/finance/income', body),
  updateIncome: (id: string | number, body: any) => put<any>(`/finance/income/${id}`, body),
  deleteIncome: (id: string | number) => del<any>(`/finance/income/${id}`),
  getExpenses: (params?: string) => get<any[]>(`/finance/expenses${params ? `?${params}` : ''}`),
  createExpense: (body: any) => post<any>('/finance/expenses', body),
  updateExpense: (id: string | number, body: any) => put<any>(`/finance/expenses/${id}`, body),
  deleteExpense: (id: string | number) => del<any>(`/finance/expenses/${id}`),
  getIncomeHeads: () => get<any[]>('/finance/income-heads'),
  getExpenseHeads: () => get<any[]>('/finance/expense-heads'),
};

// ---------------------------------------------------------------------------
// Departments
// ---------------------------------------------------------------------------
export const departmentsApi = {
  getAll: () => get<any[]>('/departments'),
  getById: (id: string | number) => get<any>(`/departments/${id}`),
  create: (body: any) => post<any>('/departments', body),
  update: (id: string | number, body: any) => put<any>(`/departments/${id}`, body),
  delete: (id: string | number) => del<any>(`/departments/${id}`),
};

// ---------------------------------------------------------------------------
// Beds
// ---------------------------------------------------------------------------
export const bedsApi = {
  getBeds: () => get<any[]>('/beds'),
  getBedGroups: () => get<any[]>('/beds/groups'),
  getBedTypes: () => get<any[]>('/beds/types'),
  create: (body: any) => post<any>('/beds', body),
  update: (id: string | number, body: any) => put<any>(`/beds/${id}`, body),
  delete: (id: string | number) => del<any>(`/beds/${id}`),
  allocate: (body: any) => post<any>('/beds/allocate', body),
  release: (id: string | number) => put<any>(`/beds/${id}/release`, {}),
};

// ---------------------------------------------------------------------------
// Charges
// ---------------------------------------------------------------------------
export const chargesApi = {
  getAll: () => get<any[]>('/charges'),
  getCategories: () => get<any[]>('/charges/categories'),
  create: (body: any) => post<any>('/charges', body),
  update: (id: string | number, body: any) => put<any>(`/charges/${id}`, body),
  delete: (id: string | number) => del<any>(`/charges/${id}`),
};

// ---------------------------------------------------------------------------
// Operation Theatre
// ---------------------------------------------------------------------------
export const otApi = {
  getAll: (params?: string) => get<any[]>(`/operation-theatre${params ? `?${params}` : ''}`),
  getById: (id: string | number) => get<any>(`/operation-theatre/${id}`),
  create: (body: any) => post<any>('/operation-theatre', body),
  update: (id: string | number, body: any) => put<any>(`/operation-theatre/${id}`, body),
  delete: (id: string | number) => del<any>(`/operation-theatre/${id}`),
};

// ---------------------------------------------------------------------------
// Front Office (Visitors, Complaints, Enquiries)
// ---------------------------------------------------------------------------
export const visitorsApi = {
  getAll: () => get<any[]>('/visitors'),
  create: (body: any) => post<any>('/visitors', body),
  update: (id: string | number, body: any) => put<any>(`/visitors/${id}`, body),
  delete: (id: string | number) => del<any>(`/visitors/${id}`),
};

export const complaintsApi = {
  getAll: () => get<any[]>('/complaints'),
  create: (body: any) => post<any>('/complaints', body),
  update: (id: string | number, body: any) => put<any>(`/complaints/${id}`, body),
  delete: (id: string | number) => del<any>(`/complaints/${id}`),
};

export const enquiriesApi = {
  getAll: () => get<any[]>('/enquiries'),
  create: (body: any) => post<any>('/enquiries', body),
  update: (id: string | number, body: any) => put<any>(`/enquiries/${id}`, body),
  delete: (id: string | number) => del<any>(`/enquiries/${id}`),
};

// ---------------------------------------------------------------------------
// Birth / Death Reports
// ---------------------------------------------------------------------------
export const birthReportsApi = {
  getAll: () => get<any[]>('/birth-reports'),
  create: (body: any) => post<any>('/birth-reports', body),
  update: (id: string | number, body: any) => put<any>(`/birth-reports/${id}`, body),
  delete: (id: string | number) => del<any>(`/birth-reports/${id}`),
};

export const deathReportsApi = {
  getAll: () => get<any[]>('/death-reports'),
  create: (body: any) => post<any>('/death-reports', body),
  update: (id: string | number, body: any) => put<any>(`/death-reports/${id}`, body),
  delete: (id: string | number) => del<any>(`/death-reports/${id}`),
};

// ---------------------------------------------------------------------------
// TPA
// ---------------------------------------------------------------------------
export const tpaApi = {
  getAll: () => get<any[]>('/tpa'),
  create: (body: any) => post<any>('/tpa', body),
  update: (id: string | number, body: any) => put<any>(`/tpa/${id}`, body),
  delete: (id: string | number) => del<any>(`/tpa/${id}`),
};

// ---------------------------------------------------------------------------
// Vehicles
// ---------------------------------------------------------------------------
export const vehiclesApi = {
  getAll: () => get<any[]>('/vehicles'),
  create: (body: any) => post<any>('/vehicles', body),
  update: (id: string | number, body: any) => put<any>(`/vehicles/${id}`, body),
  delete: (id: string | number) => del<any>(`/vehicles/${id}`),
};

// ---------------------------------------------------------------------------
// Messaging
// ---------------------------------------------------------------------------
export const messagingApi = {
  getAll: () => get<any[]>('/messaging'),
  send: (body: any) => post<any>('/messaging', body),
  delete: (id: string | number) => del<any>(`/messaging/${id}`),
};

// ---------------------------------------------------------------------------
// Notifications
// ---------------------------------------------------------------------------
export const notificationsApi = {
  getAll: () => get<any[]>('/notifications'),
  markRead: (id: string | number) => put<any>(`/notifications/${id}/read`, {}),
  markAllRead: () => put<any>('/notifications/read-all', {}),
};

// ---------------------------------------------------------------------------
// Events / Calendar
// ---------------------------------------------------------------------------
export const eventsApi = {
  getAll: (params?: string) => get<any[]>(`/events${params ? `?${params}` : ''}`),
  create: (body: any) => post<any>('/events', body),
  update: (id: string | number, body: any) => put<any>(`/events/${id}`, body),
  delete: (id: string | number) => del<any>(`/events/${id}`),
};

// ---------------------------------------------------------------------------
// Reports
// ---------------------------------------------------------------------------
export const reportsApi = {
  getPatientReport: (params: string) => get<any>(`/reports/patients?${params}`),
  getAppointmentReport: (params: string) => get<any>(`/reports/appointments?${params}`),
  getFinancialReport: (params: string) => get<any>(`/reports/financial?${params}`),
  getPathologyReport: (params: string) => get<any>(`/reports/pathology?${params}`),
  getRadiologyReport: (params: string) => get<any>(`/reports/radiology?${params}`),
  getInventoryReport: (params: string) => get<any>(`/reports/inventory?${params}`),
};

// ---------------------------------------------------------------------------
// Download Center
// ---------------------------------------------------------------------------
export const downloadCenterApi = {
  getFiles: () => get<any[]>('/download-center'),
  upload: (formData: FormData) =>
    request<any>('/download-center/upload', { method: 'POST', body: formData, headers: {} }),
  delete: (id: string | number) => del<any>(`/download-center/${id}`),
};

// ---------------------------------------------------------------------------
// Settings (re-export from settingsService for consistency)
// ---------------------------------------------------------------------------
export const settingsApi = {
  get: () => get<any>('/settings'),
  save: (body: any) => post<any>('/settings', body),
  update: (body: any) => put<any>('/settings', body),
  getEmailConfig: () => get<any>('/settings/email-config'),
  updateEmailConfig: (body: any) => put<any>('/settings/email-config', body),
  getSmsConfig: () => get<any>('/settings/sms-config'),
  updateSmsConfig: (body: any) => put<any>('/settings/sms-config', body),
  testEmail: (body: any) => post<any>('/settings/test-email', body),
  testSms: (body: any) => post<any>('/settings/test-sms', body),
  createBackup: () => post<any>('/settings/backup', {}),
  restoreBackup: (body: any) => post<any>('/settings/restore', body),
};

// ---------------------------------------------------------------------------
// Upload
// ---------------------------------------------------------------------------
export const uploadApi = {
  upload: (formData: FormData) =>
    request<any>('/upload', { method: 'POST', body: formData, headers: {} }),
};
