import { Hono } from 'npm:hono';
import { cors } from 'npm:hono/cors';
import { logger } from 'npm:hono/logger';
import { createClient } from 'npm:@supabase/supabase-js@2';
import * as kv from './kv_store.tsx';

const app = new Hono();

app.use('*', cors());
app.use('*', logger(console.log));

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
);

// Auth Routes
app.post('/make-server-d8a3a34f/signup', async (c) => {
  try {
    const { email, password, name, role } = await c.req.json();
    
    // Default role is 'user', only super_admin can create admin/super_admin
    const userRole = role || 'user';
    
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { name, role: userRole },
      email_confirm: true // Automatically confirm the user's email since an email server hasn't been configured.
    });

    if (error) {
      console.log(`Signup error: ${error.message}`);
      return c.json({ error: error.message }, 400);
    }

    return c.json({ user: data.user });
  } catch (error) {
    console.log(`Signup exception: ${error}`);
    return c.json({ error: 'Internal server error during signup' }, 500);
  }
});

// Helper function to check user role
const checkUserRole = async (accessToken: string | undefined, requiredRoles: string[]) => {
  if (!accessToken) {
    return { authorized: false, user: null, role: null };
  }

  const { data: { user }, error } = await supabase.auth.getUser(accessToken);
  
  if (!user?.id) {
    return { authorized: false, user: null, role: null };
  }

  const userRole = user.user_metadata?.role || 'user';
  const authorized = requiredRoles.includes(userRole);

  return { authorized, user, role: userRole };
};

// Admin Routes - Get all users (admin and super_admin only)
app.get('/make-server-d8a3a34f/users', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { authorized, role } = await checkUserRole(accessToken, ['admin', 'super_admin']);
    
    if (!authorized) {
      return c.json({ error: 'Unauthorized - Admin access required' }, 403);
    }

    const { data, error } = await supabase.auth.admin.listUsers();
    
    if (error) {
      console.log(`Error fetching users: ${error.message}`);
      return c.json({ error: 'Failed to fetch users' }, 500);
    }

    // If admin (not super_admin), filter out super_admin users
    let users = data.users;
    if (role === 'admin') {
      users = users.filter(u => u.user_metadata?.role !== 'super_admin');
    }

    return c.json({ users: users.map(u => ({
      id: u.id,
      email: u.email,
      name: u.user_metadata?.name,
      role: u.user_metadata?.role || 'user',
      created_at: u.created_at,
      last_sign_in_at: u.last_sign_in_at
    })) });
  } catch (error) {
    console.log(`Error fetching users: ${error}`);
    return c.json({ error: 'Failed to fetch users' }, 500);
  }
});

// Update user role (super_admin only)
app.put('/make-server-d8a3a34f/users/:id/role', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { authorized } = await checkUserRole(accessToken, ['super_admin']);
    
    if (!authorized) {
      return c.json({ error: 'Unauthorized - Super Admin access required' }, 403);
    }

    const userId = c.req.param('id');
    const { role } = await c.req.json();

    const { data, error } = await supabase.auth.admin.updateUserById(userId, {
      user_metadata: { role }
    });

    if (error) {
      console.log(`Error updating user role: ${error.message}`);
      return c.json({ error: 'Failed to update user role' }, 500);
    }

    return c.json({ user: data.user });
  } catch (error) {
    console.log(`Error updating user role: ${error}`);
    return c.json({ error: 'Failed to update user role' }, 500);
  }
});

// Delete user (super_admin only)
app.delete('/make-server-d8a3a34f/users/:id', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { authorized } = await checkUserRole(accessToken, ['super_admin']);
    
    if (!authorized) {
      return c.json({ error: 'Unauthorized - Super Admin access required' }, 403);
    }

    const userId = c.req.param('id');

    const { error } = await supabase.auth.admin.deleteUser(userId);

    if (error) {
      console.log(`Error deleting user: ${error.message}`);
      return c.json({ error: 'Failed to delete user' }, 500);
    }

    return c.json({ success: true });
  } catch (error) {
    console.log(`Error deleting user: ${error}`);
    return c.json({ error: 'Failed to delete user' }, 500);
  }
});

// Get all payments (admin and super_admin can see all, users see only theirs)
app.get('/make-server-d8a3a34f/payments', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { authorized, user, role } = await checkUserRole(accessToken, ['user', 'admin', 'super_admin']);
    
    if (!authorized || !user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const payments = await kv.getByPrefix('payment:');
    let filteredPayments = payments.map(p => p.value);

    // Regular users only see their own payments
    if (role === 'user') {
      filteredPayments = filteredPayments.filter(p => p.userId === user.id);
    }

    return c.json({ payments: filteredPayments });
  } catch (error) {
    console.log(`Error fetching payments: ${error}`);
    return c.json({ error: 'Failed to fetch payments' }, 500);
  }
});

app.post('/make-server-d8a3a34f/payments', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { authorized, user } = await checkUserRole(accessToken, ['user', 'admin', 'super_admin']);
    
    if (!authorized || !user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const payment = await c.req.json();
    const id = payment.id || Date.now().toString();
    await kv.set(`payment:${id}`, { ...payment, id, userId: user.id });
    
    return c.json({ payment: { ...payment, id } });
  } catch (error) {
    console.log(`Error creating payment: ${error}`);
    return c.json({ error: 'Failed to create payment' }, 500);
  }
});

app.delete('/make-server-d8a3a34f/payments/:id', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { authorized } = await checkUserRole(accessToken, ['admin', 'super_admin']);
    
    if (!authorized) {
      return c.json({ error: 'Unauthorized - Admin access required' }, 403);
    }

    const id = c.req.param('id');
    await kv.del(`payment:${id}`);
    
    return c.json({ success: true });
  } catch (error) {
    console.log(`Error deleting payment: ${error}`);
    return c.json({ error: 'Failed to delete payment' }, 500);
  }
});

// Employee Routes
app.get('/make-server-d8a3a34f/employees', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { authorized } = await checkUserRole(accessToken, ['user', 'admin', 'super_admin']);
    
    if (!authorized) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const employees = await kv.getByPrefix('employee:');
    return c.json({ employees: employees.map(e => e.value) });
  } catch (error) {
    console.log(`Error fetching employees: ${error}`);
    return c.json({ error: 'Failed to fetch employees' }, 500);
  }
});

app.post('/make-server-d8a3a34f/employees', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { authorized, user } = await checkUserRole(accessToken, ['admin', 'super_admin']);
    
    if (!authorized) {
      return c.json({ error: 'Unauthorized - Admin access required' }, 403);
    }

    const employee = await c.req.json();
    const id = employee.id || Date.now().toString();
    await kv.set(`employee:${id}`, { ...employee, id, createdBy: user?.id });
    
    return c.json({ employee: { ...employee, id } });
  } catch (error) {
    console.log(`Error creating employee: ${error}`);
    return c.json({ error: 'Failed to create employee' }, 500);
  }
});

app.put('/make-server-d8a3a34f/employees/:id', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { authorized } = await checkUserRole(accessToken, ['admin', 'super_admin']);
    
    if (!authorized) {
      return c.json({ error: 'Unauthorized - Admin access required' }, 403);
    }

    const id = c.req.param('id');
    const employee = await c.req.json();
    await kv.set(`employee:${id}`, { ...employee, id });
    
    return c.json({ employee: { ...employee, id } });
  } catch (error) {
    console.log(`Error updating employee: ${error}`);
    return c.json({ error: 'Failed to update employee' }, 500);
  }
});

app.delete('/make-server-d8a3a34f/employees/:id', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { authorized } = await checkUserRole(accessToken, ['admin', 'super_admin']);
    
    if (!authorized) {
      return c.json({ error: 'Unauthorized - Admin access required' }, 403);
    }

    const id = c.req.param('id');
    await kv.del(`employee:${id}`);
    
    return c.json({ success: true });
  } catch (error) {
    console.log(`Error deleting employee: ${error}`);
    return c.json({ error: 'Failed to delete employee' }, 500);
  }
});

// Patient Routes
app.get('/make-server-d8a3a34f/patients', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { authorized } = await checkUserRole(accessToken, ['user', 'admin', 'super_admin']);
    
    if (!authorized) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const patients = await kv.getByPrefix('patient:');
    return c.json({ patients: patients.map(p => p.value) });
  } catch (error) {
    console.log(`Error fetching patients: ${error}`);
    return c.json({ error: 'Failed to fetch patients' }, 500);
  }
});

app.post('/make-server-d8a3a34f/patients', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { authorized, user } = await checkUserRole(accessToken, ['user', 'admin', 'super_admin']);
    
    if (!authorized || !user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const patient = await c.req.json();
    const id = patient.id || Date.now().toString();
    await kv.set(`patient:${id}`, { ...patient, id, userId: user.id });
    
    return c.json({ patient: { ...patient, id } });
  } catch (error) {
    console.log(`Error creating patient: ${error}`);
    return c.json({ error: 'Failed to create patient' }, 500);
  }
});

app.put('/make-server-d8a3a34f/patients/:id', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { authorized, user } = await checkUserRole(accessToken, ['user', 'admin', 'super_admin']);
    
    if (!authorized || !user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const id = c.req.param('id');
    const patient = await c.req.json();
    await kv.set(`patient:${id}`, { ...patient, id, userId: user.id });
    
    return c.json({ patient: { ...patient, id } });
  } catch (error) {
    console.log(`Error updating patient: ${error}`);
    return c.json({ error: 'Failed to update patient' }, 500);
  }
});

app.delete('/make-server-d8a3a34f/patients/:id', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { authorized } = await checkUserRole(accessToken, ['admin', 'super_admin']);
    
    if (!authorized) {
      return c.json({ error: 'Unauthorized - Admin access required' }, 403);
    }

    const id = c.req.param('id');
    await kv.del(`patient:${id}`);
    
    return c.json({ success: true });
  } catch (error) {
    console.log(`Error deleting patient: ${error}`);
    return c.json({ error: 'Failed to delete patient' }, 500);
  }
});

// Appointment Routes
app.get('/make-server-d8a3a34f/appointments', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { authorized } = await checkUserRole(accessToken, ['user', 'admin', 'super_admin']);
    
    if (!authorized) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const appointments = await kv.getByPrefix('appointment:');
    return c.json({ appointments: appointments.map(a => a.value) });
  } catch (error) {
    console.log(`Error fetching appointments: ${error}`);
    return c.json({ error: 'Failed to fetch appointments' }, 500);
  }
});

app.post('/make-server-d8a3a34f/appointments', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { authorized, user } = await checkUserRole(accessToken, ['user', 'admin', 'super_admin']);
    
    if (!authorized || !user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const appointment = await c.req.json();
    const id = appointment.id || Date.now().toString();
    await kv.set(`appointment:${id}`, { ...appointment, id, userId: user.id });
    
    return c.json({ appointment: { ...appointment, id } });
  } catch (error) {
    console.log(`Error creating appointment: ${error}`);
    return c.json({ error: 'Failed to create appointment' }, 500);
  }
});

app.delete('/make-server-d8a3a34f/appointments/:id', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { authorized } = await checkUserRole(accessToken, ['admin', 'super_admin']);
    
    if (!authorized) {
      return c.json({ error: 'Unauthorized - Admin access required' }, 403);
    }

    const id = c.req.param('id');
    await kv.del(`appointment:${id}`);
    
    return c.json({ success: true });
  } catch (error) {
    console.log(`Error deleting appointment: ${error}`);
    return c.json({ error: 'Failed to delete appointment' }, 500);
  }
});

// Statistics Route
app.get('/make-server-d8a3a34f/statistics', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { authorized } = await checkUserRole(accessToken, ['user', 'admin', 'super_admin']);
    
    if (!authorized) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const stats = await kv.get('statistics') || {
      appointments: 1250,
      callConsultancy: 1002,
      surgeries: 60,
      totalPatients: 1835,
      income: 8135450,
      expense: 7999000,
      roomOccupancy: { general: 124, private: 52 }
    };
    
    return c.json({ statistics: stats });
  } catch (error) {
    console.log(`Error fetching statistics: ${error}`);
    return c.json({ error: 'Failed to fetch statistics' }, 500);
  }
});

Deno.serve(app.fetch);