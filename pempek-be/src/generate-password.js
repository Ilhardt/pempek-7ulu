const bcrypt = require('bcryptjs');

const password = 'admin123';
const hash = bcrypt.hashSync(password, 10);

console.log('Password:', password);
console.log('Hash:', hash);
console.log('\nInsert query:');
console.log(`INSERT INTO users (username, password, name, role) VALUES ('admin', '${hash}', 'Admin Pempek 7 ULU', 'admin');`);