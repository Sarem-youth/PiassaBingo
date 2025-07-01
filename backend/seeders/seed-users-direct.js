require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

// Create a Supabase client with service role for admin operations
const supabaseUrl = 'https://rasbfgnfgoqlrbyjxypx.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// Dummy users data - using UUIDs for development
const dummyUsers = [
  {
    id: '11111111-1111-1111-1111-111111111111',
    username: 'admin',
    email: 'admin@piassabingo.com',
    role: 'admin',
    commission_rate: 0.00,
    balance: 100000.00,
    status: 'active'
  },
  {
    id: '22222222-2222-2222-2222-222222222222',
    username: 'cashier1',
    email: 'cashier1@piassabingo.com',
    role: 'cashier',
    commission_rate: 5.00,
    balance: 1000.00,
    status: 'active'
  },
  {
    id: '33333333-3333-3333-3333-333333333333',
    username: 'cashier2',
    email: 'cashier2@piassabingo.com',
    role: 'cashier',
    commission_rate: 5.00,
    balance: 1000.00,
    status: 'active'
  },
  {
    id: '44444444-4444-4444-4444-444444444444',
    username: 'agent1',
    email: 'agent1@piassabingo.com',
    role: 'agent',
    commission_rate: 10.00,
    balance: 5000.00,
    status: 'active'
  },
  {
    id: '55555555-5555-5555-5555-555555555555',
    username: 'shop1',
    email: 'shop1@piassabingo.com',
    role: 'shop',
    commission_rate: 15.00,
    balance: 2000.00,
    status: 'active',
    parent_id: '44444444-4444-4444-4444-444444444444' // Under agent1
  }
];

async function createUserDirectly(userData) {
  try {
    console.log(`Creating user: ${userData.username}...`);
    
    // Insert user directly into the public.users table
    const { data, error } = await supabase
      .from('users')
      .insert([userData])
      .select()
      .single();

    if (error) {
      if (error.code === '23505') { // Unique constraint violation
        console.log(`⏭️  User ${userData.username} already exists, skipping...`);
        return 'exists';
      }
      console.error(`Error creating user ${userData.username}:`, error.message);
      return false;
    }

    console.log(`✅ User ${userData.username} created successfully with ID: ${data.id}`);
    return true;
  } catch (err) {
    console.error(`Unexpected error creating ${userData.username}:`, err.message);
    return false;
  }
}

async function seedUsersDirectly() {
  console.log('🌱 Starting direct database seeding (bypassing Supabase Auth)...');
  console.log('=====================================');
  console.log('⚠️  Note: This creates users directly in the database for development.');
  console.log('⚠️  For production, use proper Supabase Auth user creation.');
  console.log('=====================================');
  
  let successCount = 0;
  let skipCount = 0;
  let errorCount = 0;

  for (const userData of dummyUsers) {
    const result = await createUserDirectly(userData);
    
    if (result === 'exists') {
      skipCount++;
    } else if (result === true) {
      successCount++;
    } else {
      errorCount++;
    }
    
    // Add a small delay
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  console.log('=====================================');
  console.log('🎉 Direct seeding completed!');
  console.log(`✅ Successfully created: ${successCount} users`);
  console.log(`⏭️  Skipped (already exist): ${skipCount} users`);
  console.log(`❌ Failed: ${errorCount} users`);
  console.log('');
  console.log('⚠️  IMPORTANT: These users are created directly in the database.');
  console.log('⚠️  They will NOT have Supabase Auth accounts.');
  console.log('⚠️  You may need to handle authentication differently for testing.');
  console.log('');
  console.log('Available test users:');
  dummyUsers.forEach(user => {
    console.log(`- ${user.role}: ${user.username} (${user.email})`);
  });
}

// Run the seeder
if (require.main === module) {
  seedUsersDirectly()
    .then(() => {
      console.log('Direct seeding process finished.');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Direct seeding failed:', error);
      process.exit(1);
    });
}

module.exports = { seedUsersDirectly, dummyUsers };
