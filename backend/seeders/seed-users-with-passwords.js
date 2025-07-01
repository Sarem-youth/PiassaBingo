require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const bcrypt = require('bcryptjs');

// Create a Supabase client with service role for admin operations
const supabaseUrl = 'https://rasbfgnfgoqlrbyjxypx.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// Dummy users data with passwords - using UUIDs for development
const dummyUsers = [
  {
    id: '11111111-1111-1111-1111-111111111111',
    username: 'admin',
    name: 'Administrator',
    email: 'admin@piassabingo.com',
    password: 'admin123',
    role: 'admin',
    commission_rate: 0.00,
    balance: 100000.00,
    status: 'active'
  },
  {
    id: '22222222-2222-2222-2222-222222222222',
    username: 'cashier1',
    name: 'Cashier One',
    email: 'cashier1@piassabingo.com',
    password: 'cashier123',
    role: 'cashier',
    commission_rate: 5.00,
    balance: 1000.00,
    status: 'active'
  },
  {
    id: '33333333-3333-3333-3333-333333333333',
    username: 'cashier2',
    name: 'Cashier Two',
    email: 'cashier2@piassabingo.com',
    password: 'cashier123',
    role: 'cashier',
    commission_rate: 5.00,
    balance: 1000.00,
    status: 'active'
  },
  {
    id: '44444444-4444-4444-4444-444444444444',
    username: 'agent1',
    name: 'Agent One',
    email: 'agent1@piassabingo.com',
    password: 'agent123',
    role: 'agent',
    commission_rate: 10.00,
    balance: 5000.00,
    status: 'active'
  },
  {
    id: '55555555-5555-5555-5555-555555555555',
    username: 'shop1',
    name: 'Shop One',
    email: 'shop1@piassabingo.com',
    password: 'shop123',
    role: 'shop',
    commission_rate: 15.00,
    balance: 2000.00,
    status: 'active',
    parent_id: '44444444-4444-4444-4444-444444444444' // Under agent1
  }
];

async function createUserWithPassword(userData) {
  try {
    console.log(`Creating user: ${userData.username}...`);
    
    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(userData.password, salt);
    
    // Prepare user data for insertion
    const userToInsert = {
      id: userData.id,
      username: userData.username,
      email: userData.email,
      password_hash: hashedPassword,
      name: userData.name,
      role: userData.role,
      commission_rate: userData.commission_rate,
      balance: userData.balance,
      status: userData.status
    };
    
    if (userData.parent_id) {
      userToInsert.parent_id = userData.parent_id;
    }
    
    // Insert user directly into the public.users table
    const { data, error } = await supabase
      .from('users')
      .insert([userToInsert])
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

async function seedUsersWithPasswords() {
  console.log('🌱 Starting user seeding with hashed passwords...');
  console.log('=====================================');
  console.log('⚠️  Note: This creates users directly in the database for development.');
  console.log('⚠️  Passwords will be properly hashed using bcrypt.');
  console.log('=====================================');
  
  let successCount = 0;
  let skipCount = 0;
  let errorCount = 0;

  for (const userData of dummyUsers) {
    const result = await createUserWithPassword(userData);
    
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
  console.log('🎉 User seeding with passwords completed!');
  console.log(`✅ Successfully created: ${successCount} users`);
  console.log(`⏭️  Skipped (already exist): ${skipCount} users`);
  console.log(`❌ Failed: ${errorCount} users`);
  console.log('');
  console.log('Available test users and passwords:');
  dummyUsers.forEach(user => {
    console.log(`- ${user.role}: ${user.username} / ${user.password}`);
  });
}

// Run the seeder
if (require.main === module) {
  seedUsersWithPasswords()
    .then(() => {
      console.log('User seeding with passwords process finished.');
      process.exit(0);
    })
    .catch((error) => {
      console.error('User seeding with passwords failed:', error);
      process.exit(1);
    });
}

module.exports = { seedUsersWithPasswords, dummyUsers };
