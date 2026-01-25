// Quick Admin Account Creator
// Run this script once to create your first super admin account
// Usage: node create-admin.js

const SUPABASE_URL = 'YOUR_SUPABASE_URL'; // e.g., https://xxxxx.supabase.co
const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY';

const adminAccount = {
  email: 'admin@hospital.com',
  password: 'Admin@123456',
  name: 'Super Admin',
  role: 'super_admin'
};

async function createAdmin() {
  try {
    console.log('Creating super admin account...');
    
    const response = await fetch(
      `${SUPABASE_URL}/functions/v1/make-server-d8a3a34f/signup`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify(adminAccount),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to create admin account');
    }

    console.log('✅ Super admin account created successfully!');
    console.log('\nLogin credentials:');
    console.log('Email:', adminAccount.email);
    console.log('Password:', adminAccount.password);
    console.log('\n⚠️  Please change the password after first login!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.log('\nPlease check:');
    console.log('1. SUPABASE_URL and SUPABASE_ANON_KEY are correct');
    console.log('2. The backend function is deployed');
    console.log('3. The email is not already registered');
  }
}

// Check if credentials are set
if (SUPABASE_URL === 'YOUR_SUPABASE_URL' || SUPABASE_ANON_KEY === 'YOUR_SUPABASE_ANON_KEY') {
  console.log('❌ Please update SUPABASE_URL and SUPABASE_ANON_KEY in this file first!');
  console.log('\nYou can find these values in:');
  console.log('src/utils/supabase/info.ts');
  process.exit(1);
}

createAdmin();
