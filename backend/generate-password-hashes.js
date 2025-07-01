const bcrypt = require('bcryptjs');

const passwords = {
  admin: 'admin123',
  cashier1: 'cashier123',
  cashier2: 'cashier123', 
  agent1: 'agent123',
  shop1: 'shop123'
};

async function generateHashes() {
  console.log('-- Generated password hashes for migration:');
  
  for (const [username, password] of Object.entries(passwords)) {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    console.log(`update public.users set password_hash = '${hash}' where username = '${username}'; -- password: ${password}`);
  }
}

generateHashes().catch(console.error);
