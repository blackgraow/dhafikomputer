const { pool, mockDb, isMysqlOnline } = require('../config/db');

// GET /api/dealers
const getDealers = async (req, res) => {
  try {
    if (isMysqlOnline()) {
      const [rows] = await pool.query(`
        SELECT d.*, COUNT(l.id) AS laptop_count
        FROM dealers d
        LEFT JOIN laptops l ON l.dealer_id = d.id
        GROUP BY d.id
        ORDER BY d.name ASC
      `);
      return res.json({ success: true, data: rows });
    } else {
      const result = mockDb.dealers.map(d => ({
        ...d,
        laptop_count: mockDb.laptops.filter(l => l.dealer_id === d.id).length
      }));
      return res.json({ success: true, data: result });
    }
  } catch (error) {
    console.error('Get dealers error:', error);
    return res.json({ success: true, data: mockDb.dealers });
  }
};

// GET /api/dealers/:id
const getDealerById = async (req, res) => {
  try {
    const { id } = req.params;
    if (isMysqlOnline()) {
      const [rows] = await pool.query(`
        SELECT d.*, COUNT(l.id) AS laptop_count
        FROM dealers d
        LEFT JOIN laptops l ON l.dealer_id = d.id
        WHERE d.id = ?
        GROUP BY d.id
      `, [id]);
      if (rows.length === 0) {
        return res.status(404).json({ success: false, message: 'Dealer / Toko Lain tidak ditemukan.' });
      }
      return res.json({ success: true, data: rows[0] });
    } else {
      const dealer = mockDb.dealers.find(d => d.id === parseInt(id));
      if (!dealer) {
        return res.status(404).json({ success: false, message: 'Dealer / Toko Lain tidak ditemukan.' });
      }
      const count = mockDb.laptops.filter(l => l.dealer_id === dealer.id).length;
      return res.json({ success: true, data: { ...dealer, laptop_count: count } });
    }
  } catch (error) {
    console.error('Get dealer by id error:', error);
    return res.status(500).json({ success: false, message: 'Gagal memuat data Dealer.' });
  }
};

// POST /api/dealers
const createDealer = async (req, res) => {
  try {
    const { code, name, contact, address, status, notes } = req.body;

    if (!name) {
      return res.status(400).json({ success: false, message: 'Nama Dealer / Toko Lain wajib diisi.' });
    }

    const dlrCode = code || `DLR-${Date.now().toString().slice(-5)}`;

    if (isMysqlOnline()) {
      const [result] = await pool.query(
        'INSERT INTO dealers (code, name, contact, address, status, notes) VALUES (?, ?, ?, ?, ?, ?)',
        [dlrCode, name, contact || null, address || null, status || 'AKTIF', notes || null]
      );
      return res.status(201).json({
        success: true,
        message: 'Dealer / Toko Lain berhasil ditambahkan.',
        data: { id: result.insertId, code: dlrCode, name, contact, address, status: status || 'AKTIF', notes }
      });
    } else {
      const existing = mockDb.dealers.find(d => d.code === dlrCode);
      if (existing) {
        return res.status(400).json({ success: false, message: 'Kode Dealer sudah ada.' });
      }
      const newDealer = {
        id: mockDb.dealers.length > 0 ? Math.max(...mockDb.dealers.map(d => d.id)) + 1 : 1,
        code: dlrCode,
        name,
        contact: contact || null,
        address: address || null,
        status: status || 'AKTIF',
        notes: notes || 'Toko Partner Laptop Second',
        created_at: new Date().toISOString()
      };
      mockDb.dealers.push(newDealer);
      return res.status(201).json({
        success: true,
        message: 'Dealer / Toko Lain berhasil ditambahkan.',
        data: newDealer
      });
    }
  } catch (error) {
    console.error('Create Dealer error:', error);
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ success: false, message: 'Kode Dealer sudah ada.' });
    }
    return res.status(500).json({ success: false, message: 'Gagal menambahkan Dealer / Toko Lain.' });
  }
};

// PUT /api/dealers/:id
const updateDealer = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, contact, address, status, notes } = req.body;

    if (!name) {
      return res.status(400).json({ success: false, message: 'Nama Dealer / Toko Lain wajib diisi.' });
    }

    if (isMysqlOnline()) {
      const [result] = await pool.query(
        'UPDATE dealers SET name = ?, contact = ?, address = ?, status = ?, notes = ? WHERE id = ?',
        [name, contact || null, address || null, status || 'AKTIF', notes || null, id]
      );
      if (result.affectedRows === 0) {
        return res.status(404).json({ success: false, message: 'Dealer / Toko Lain tidak ditemukan.' });
      }
      return res.json({ success: true, message: 'Dealer / Toko Lain berhasil diperbarui.' });
    } else {
      const index = mockDb.dealers.findIndex(d => d.id === parseInt(id));
      if (index === -1) {
        return res.status(404).json({ success: false, message: 'Dealer / Toko Lain tidak ditemukan.' });
      }
      mockDb.dealers[index].name = name;
      mockDb.dealers[index].contact = contact || null;
      mockDb.dealers[index].address = address || null;
      mockDb.dealers[index].status = status || 'AKTIF';
      mockDb.dealers[index].notes = notes || null;
      return res.json({ success: true, message: 'Dealer / Toko Lain berhasil diperbarui.', data: mockDb.dealers[index] });
    }
  } catch (error) {
    console.error('Update Dealer error:', error);
    return res.status(500).json({ success: false, message: 'Gagal memperbarui Dealer / Toko Lain.' });
  }
};

// DELETE /api/dealers/:id
const deleteDealer = async (req, res) => {
  try {
    const { id } = req.params;

    if (isMysqlOnline()) {
      const [laptops] = await pool.query('SELECT COUNT(*) as count FROM laptops WHERE dealer_id = ?', [id]);
      if (laptops[0].count > 0) {
        return res.status(400).json({
          success: false,
          message: 'Dealer / Toko Lain tidak dapat dihapus karena masih digunakan dalam data laptop second.'
        });
      }
      const [result] = await pool.query('DELETE FROM dealers WHERE id = ?', [id]);
      if (result.affectedRows === 0) {
        return res.status(404).json({ success: false, message: 'Dealer / Toko Lain tidak ditemukan.' });
      }
      return res.json({ success: true, message: 'Dealer / Toko Lain berhasil dihapus.' });
    } else {
      const isUsed = mockDb.laptops.some(l => l.dealer_id === parseInt(id));
      if (isUsed) {
        return res.status(400).json({
          success: false,
          message: 'Dealer / Toko Lain tidak dapat dihapus karena masih digunakan dalam data laptop second.'
        });
      }
      const index = mockDb.dealers.findIndex(d => d.id === parseInt(id));
      if (index === -1) {
        return res.status(404).json({ success: false, message: 'Dealer / Toko Lain tidak ditemukan.' });
      }
      mockDb.dealers.splice(index, 1);
      return res.json({ success: true, message: 'Dealer / Toko Lain berhasil dihapus.' });
    }
  } catch (error) {
    console.error('Delete Dealer error:', error);
    return res.status(500).json({ success: false, message: 'Gagal menghapus Dealer / Toko Lain.' });
  }
};

module.exports = {
  getDealers,
  getDealerById,
  createDealer,
  updateDealer,
  deleteDealer
};
