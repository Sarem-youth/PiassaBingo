require('dotenv').config();
const { seedUsers } = require('./seed-users');
const { seedUsersDirectly } = require('./seed-users-direct');
const { seedCartelaData } = require('./seed-cartelas');

async function runAllSeeders() {
  console.log('🚀 Starting complete database seeding...');
  console.log('=========================================');
  
  try {
    // Use direct seeding without trying Supabase Auth first
    console.log('\n👥 Step 1: Seeding users...');
    await seedUsersDirectly();
    
    // Then seed cartela data
    console.log('\n🎯 Step 2: Seeding cartela data...');
    await seedCartelaData();
    
    console.log('\n🎉 All seeding operations completed successfully!');
    console.log('=========================================');
    console.log('\nYour database is now ready with:');
    console.log('- Admin user (admin@piassabingo.com)');
    console.log('- Cashier users (cashier1@piassabingo.com, cashier2@piassabingo.com)');
    console.log('- Agent user (agent1@piassabingo.com)');
    console.log('- Shop user (shop1@piassabingo.com)');
    console.log('- Cartela groups with 100 cartelas each');
    console.log('\nYou can now start your application and test with these accounts.');
    
  } catch (error) {
    console.error('❌ Seeding process failed:', error);
    throw error;
  }
}

// Run all seeders
if (require.main === module) {
  runAllSeeders()
    .then(() => {
      console.log('\n✅ Database seeding completed successfully!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n❌ Database seeding failed:', error);
      process.exit(1);
    });
}

module.exports = { runAllSeeders };
