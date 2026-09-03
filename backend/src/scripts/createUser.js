const bcrypt = require('bcryptjs');
const readline = require('readline');
const { pool } = require('../config/db');

async function askQuestion(rl, query) {
  return new Promise(resolve => rl.question(query, resolve));
}

async function createUser() {
  const args = process.argv.slice(2);
  let username = args[0];
  let password = args[1];
  let name = args[2];

  if (!username || !password) {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    console.log('==============================================');
    console.log('  Dhafi Komputer - Tambah Akun Admin Baru     ');
    console.log('==============================================\n');

    if (!username) {
      username = await askQuestion(rl, 'Masukkan Username: ');
    }
    if (!password) {
      password = await askQuestion(rl, 'Masukkan Password: ');
    }
    if (!name) {
      name = await askQuestion(rl, 'Masukkan Nama Lengkap (opsional, default: Admin Dhafi Komputer): ');
    }

    rl.close();
  }

  username = (username || '').trim();
  password = (password || '').trim();
  name = (name || '').trim() || 'Admin Dhafi Komputer';

  if (!username || !password) {
    console.error('❌ Error: Username dan Password wajib diisi.');
    process.exit(1);
  }

  try {
    // Check duplicate
    const [existing] = await pool.query('SELECT id FROM users WHERE username = ?', [username]);
    if (existing.length > 0) {
      console.error(`❌ Error: Username "${username}" sudah terdaftar di database.`);
      process.exit(1);
    }

    // Generate bcrypt hash
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Insert user
    const [result] = await pool.query(
      'INSERT INTO users (username, password_hash, name) VALUES (?, ?, ?)',
      [username, passwordHash, name]
    );

    console.log('\n✅ Berhasil membuat akun admin!');
    console.log(`- ID        : ${result.insertId}`);
    console.log(`- Username  : ${username}`);
    console.log(`- Nama      : ${name}`);
    console.log(`- Password  : ${password}`);
    console.log('Akun ini sekarang dapat langsung digunakan untuk login ke Dashboard Admin.\n');
  } catch (error) {
    console.error('❌ Gagal menambahkan akun ke database:', error.message);
  } finally {
    await pool.end();
    process.exit(0);
  }
}

createUser();
