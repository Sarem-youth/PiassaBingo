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

// Dummy users data
const dummyUsers = [
  {
    username: 'admin',
    email: 'admin@piassabingo.com',
    password: 'admin123',
    role: 'admin',
    commission_rate: 0.00,
    balance: 100000.00
  },
  {
    username: 'cashier1',
    email: 'cashier1@piassabingo.com',
    password: 'cashier123',
    role: 'cashier',
    commission_rate: 5.00,
    balance: 1000.00
  },
  {
    username: 'cashier2',
    email: 'cashier2@piassabingo.com',
    password: 'cashier123',
    role: 'cashier',
    commission_rate: 5.00,
    balance: 1000.00
  },
  {
    username: 'agent1',
    email: 'agent1@piassabingo.com',
    password: 'agent123',
    role: 'agent',
    commission_rate: 10.00,
    balance: 5000.00
  },
  {
    username: 'shop1',
    email: 'shop1@piassabingo.com',
    password: 'shop123',
    role: 'shop',
    commission_rate: 15.00,
    balance: 2000.00
  }
];

async function createUser(userData) {
  try {
    console.log(`Creating user: ${userData.username}...`);
    
    // Check if user already exists in Supabase Auth
    const { data: existingUsers, error: checkError } = await supabase
      .from('users')
      .select('id, email')
      .eq('email', userData.email)
      .maybeSingle();
      
    if (checkError && checkError.code !== 'PGRST116') { // PGRST116 means not found
      console.error(`Check error for ${userData.username}:`, checkError.message);
      return false;
    }
    
    if (existingUsers) {
      console.log(`⏭️  User ${userData.username} already exists, skipping...`);
      return 'exists';
    }
    
    // Create user in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: userData.email,
      password: userData.password,
      email_confirm: true,
      user_metadata: {
        username: userData.username
      }
    });

    if (authError) {
      console.error(`Auth error for ${userData.username}:`, authError.message);
      return false;
    }

    if (authData.user) {
      // Add user to the public.users table
      const { error: userError } = await supabase
        .from('users')
        .insert([
          { 
            id: authData.user.id, 
            username: userData.username, 
            email: userData.email, 
            role: userData.role, 
            commission_rate: userData.commission_rate,
            balance: userData.balance,
            status: 'active'
          },
        ]);

      if (userError) {
        console.error(`User table error for ${userData.username}:`, userError.message);
        // Try to clean up the auth user
        try {
          await supabase.auth.admin.deleteUser(authData.user.id);
        } catch (cleanupError) {
          console.error(`Cleanup error for ${userData.username}:`, cleanupError.message);
        }
        return false;
      }

      console.log(`✅ User ${userData.username} created successfully with ID: ${authData.user.id}`);
      return true;
    }
    
    return false;
  } catch (err) {
    console.error(`Unexpected error creating ${userData.username}:`, err.message);
    return false;
  }
}

async function checkUserExists(email) {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('id, username, email')
      .eq('email', email)
      .single();
    
    if (error && error.code !== 'PGRST116') { // PGRST116 is "not found" error
      console.error('Error checking user existence:', error.message);
      return false;
    }
    
    return !!data;
  } catch (err) {
    console.error('Unexpected error checking user existence:', err.message);
    return false;
  }
}

async function seedUsers() {
  console.log('🌱 Starting database seeding...');
  console.log('=====================================');
  
  let successCount = 0;
  let skipCount = 0;
  let errorCount = 0;

  for (const userData of dummyUsers) {
    // Check if user already exists
    const exists = await checkUserExists(userData.email);
    
    if (exists) {
      console.log(`⏭️  User ${userData.username} already exists, skipping...`);
      skipCount++;
      continue;
    }

    const success = await createUser(userData);
    if (success) {
      successCount++;
    } else {
      errorCount++;
    }
    
    // Add a small delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  console.log('=====================================');
  console.log('🎉 Seeding completed!');
  console.log(`✅ Successfully created: ${successCount} users`);
  console.log(`⏭️  Skipped (already exist): ${skipCount} users`);
  console.log(`❌ Failed: ${errorCount} users`);
  console.log('');
  console.log('Default login credentials:');
  console.log('Admin: admin@piassabingo.com / admin123');
  console.log('Cashier: cashier1@piassabingo.com / cashier123');
  console.log('Agent: agent1@piassabingo.com / agent123');
  console.log('Shop: shop1@piassabingo.com / shop123');
}

// Run the seeder
if (require.main === module) {
  seedUsers()
    .then(() => {
      console.log('Seeding process finished.');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Seeding failed:', error);
      process.exit(1);
    });
}

module.exports = { seedUsers, dummyUsers };
