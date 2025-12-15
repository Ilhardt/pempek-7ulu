const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
require('dotenv').config();

async function createAdmin() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'pempek_7ulu'
    });

    console.log('✅ Connected to database');

    // Create users table if not exists
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        name VARCHAR(100),
        role ENUM('admin', 'user') DEFAULT 'admin',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log('✅ Users table ready');

    // Check if admin exists
    const [existingUsers] = await connection.execute(
      'SELECT * FROM users WHERE username = ?',
      ['admin']
    );

    if (existingUsers.length > 0) {
      console.log('⚠️  Admin user already exists!');
      
      // Update password
      const hashedPassword = await bcrypt.hash('admin123', 10);
      await connection.execute(
        'UPDATE users SET password = ?, role = ? WHERE username = ?',
        [hashedPassword, 'admin', 'admin']
      );
      console.log('✅ Admin password updated');
    } else {
      // Create new admin user
      const hashedPassword = await bcrypt.hash('admin123', 10);
      
      await connection.execute(
        'INSERT INTO users (username, password, name, role) VALUES (?, ?, ?, ?)',
        ['admin', hashedPassword, 'Admin Pempek 7 ULU', 'admin']
      );

      console.log('✅ Admin user created successfully!');
    }

    console.log('\n📋 Login credentials:');
    console.log('Username: admin');
    console.log('Password: admin123');

    await connection.end();
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

createAdmin();