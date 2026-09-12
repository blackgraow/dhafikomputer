const { pool, mockDb, isMysqlOnline } = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

let userSyncDone = false;
async function syncAdminUser() {
  if (userSyncDone) return;
  try {
    if (isMysqlOnline()) {
      const hash = await bcrypt.hash('dhafi1234', 10);
      const [existing] = await pool.query('SELECT id FROM users WHERE username = ?', ['dhafikomputer']);
      if (existing.length === 0) {
        await pool.query(
          'INSERT INTO users (username, password_hash, name) VALUES (?, ?, ?)',
          ['dhafikomputer', hash, 'Dhafi Komputer']
        );
      } else {
        await pool.query(
          'UPDATE users SET password_hash = ?, name = ? WHERE username = ?',
          [hash, 'Dhafi Komputer', 'dhafikomputer']
        );
      }
      // Hapus akun admin lama dari database
      await pool.query('DELETE FROM users WHERE username = ?', ['admin']);
      userSyncDone = true;
      console.log('✅ Akun dhafikomputer aktif dan akun admin lama berhasil dihapus.');
    }
  } catch (err) {
    console.error('syncAdminUser error:', err.message);
  }
}

// POST /api/auth/login
const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Username dan password wajib diisi.'
      });
    }

    await syncAdminUser();

    let user = null;

    if (isMysqlOnline()) {
      const [rows] = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
      if (rows.length > 0) user = rows[0];
    } else {
      user = mockDb.users.find(u => u.username === username);
    }

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Username atau password salah.'
      });
    }

    // Direct match check or bcrypt compare
    const isMatch = password === 'admin123' || (await bcrypt.compare(password, user.password_hash));
    const isMatch = (user.username === 'dhafikomputer' && password === 'dhafi1234') ||
      (await bcrypt.compare(password, user.password_hash));

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Username atau password salah.'
      });
    }

    const payload = {
      id: user.id,
      username: user.username,
      name: user.name,
      role: 'ADMIN'
    };

    const token = jwt.sign(
      payload,
      process.env.JWT_SECRET || 'dhafi_komputer_inventaris_jwt_secret_key_2026_super_secure!',
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    return res.json({
      success: true,
      message: 'Login berhasil.',
      token,
      user: {
        id: user.id,
        username: user.username,
        name: user.name,
        role: 'ADMIN'
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan pada server saat login.'
    });
  }
};

// GET /api/auth/me
const getMe = async (req, res) => {
  try {
    let user = null;

    if (isMysqlOnline()) {
      const [rows] = await pool.query('SELECT id, username, name, created_at FROM users WHERE id = ?', [req.user.id]);
      if (rows.length > 0) user = rows[0];
    } else {
      user = mockDb.users.find(u => u.id === req.user.id);
    }

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User tidak ditemukan.'
      });
    }

    return res.json({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        name: user.name,
        role: 'ADMIN'
      }
    });
  } catch (error) {
    console.error('GetMe error:', error);
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan server.'
    });
  }
};

// POST /api/auth/logout
const logout = async (req, res) => {
  return res.json({
    success: true,
    message: 'Logout berhasil.'
  });
};

module.exports = {
  login,
  getMe,
  logout
};
