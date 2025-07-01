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

// Sample cartela groups
const cartelaGroups = [
  {
    name: 'Morning Game',
    status: 'active'
  },
  {
    name: 'Afternoon Game',
    status: 'active'
  },
  {
    name: 'Evening Game',
    status: 'active'
  }
];

async function createCartelaGroup(groupData) {
  try {
    console.log(`Creating cartela group: ${groupData.name}...`);
    
    const { data, error } = await supabase
      .from('cartela_groups')
      .insert([groupData])
      .select()
      .single();

    if (error) {
      console.error(`Error creating cartela group ${groupData.name}:`, error.message);
      return null;
    }

    console.log(`✅ Cartela group ${groupData.name} created successfully with ID: ${data.id}`);
    return data;
  } catch (err) {
    console.error(`Unexpected error creating cartela group ${groupData.name}:`, err.message);
    return null;
  }
}

async function createCartelas(groupId, groupName, count = 100) {
  try {
    console.log(`Creating ${count} cartelas for group: ${groupName}...`);
    
    const cartelas = [];
    for (let i = 1; i <= count; i++) {
      cartelas.push({
        cartela_number: i,
        cartela_group_id: groupId,
        status: 'available'
      });
    }

    const { data, error } = await supabase
      .from('cartelas')
      .insert(cartelas);

    if (error) {
      console.error(`Error creating cartelas for ${groupName}:`, error.message);
      return false;
    }

    console.log(`✅ ${count} cartelas created successfully for ${groupName}`);
    return true;
  } catch (err) {
    console.error(`Unexpected error creating cartelas for ${groupName}:`, err.message);
    return false;
  }
}

async function checkCartelaGroupExists(name) {
  try {
    const { data, error } = await supabase
      .from('cartela_groups')
      .select('id, name')
      .eq('name', name)
      .single();
    
    if (error && error.code !== 'PGRST116') {
      console.error('Error checking cartela group existence:', error.message);
      return null;
    }
    
    return data;
  } catch (err) {
    console.error('Unexpected error checking cartela group existence:', err.message);
    return null;
  }
}

async function seedCartelaData() {
  console.log('🎯 Starting cartela data seeding...');
  console.log('=====================================');
  
  let successCount = 0;
  let skipCount = 0;
  let errorCount = 0;

  for (const groupData of cartelaGroups) {
    // Check if cartela group already exists
    const existingGroup = await checkCartelaGroupExists(groupData.name);
    
    if (existingGroup) {
      console.log(`⏭️  Cartela group ${groupData.name} already exists, skipping...`);
      skipCount++;
      continue;
    }

    const createdGroup = await createCartelaGroup(groupData);
    if (createdGroup) {
      // Create cartelas for this group
      const cartelasCreated = await createCartelas(createdGroup.id, createdGroup.name, 100);
      if (cartelasCreated) {
        successCount++;
      } else {
        errorCount++;
      }
    } else {
      errorCount++;
    }
    
    // Add a small delay
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  console.log('=====================================');
  console.log('🎯 Cartela seeding completed!');
  console.log(`✅ Successfully created: ${successCount} cartela groups with cartelas`);
  console.log(`⏭️  Skipped (already exist): ${skipCount} cartela groups`);
  console.log(`❌ Failed: ${errorCount} cartela groups`);
}

// Run the seeder
if (require.main === module) {
  seedCartelaData()
    .then(() => {
      console.log('Cartela seeding process finished.');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Cartela seeding failed:', error);
      process.exit(1);
    });
}

module.exports = { seedCartelaData, cartelaGroups };
