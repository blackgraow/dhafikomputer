const jwt = require('jsonwebtoken');
require('dotenv').config();

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Akses ditolak. Token autentikasi tidak ditemukan.'
    });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'dhafi_komputer_inventaris_jwt_secret_key_2026_super_secure!', (err, user) => {
    if (err) {
      return res.status(403).json({
        success: false,
        message: 'Token tidak valid atau sudah kadaluwarsa.'
      });
    }

    req.user = user;
    next();
  });
};

module.exports = {
  authenticateToken
};
