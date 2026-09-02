const { pool, mockDb, isMysqlOnline } = require('../config/db');

// GET /api/master-dealers
const getMasterDealers = async (req, res) => {
  try {
    if (isMysqlOnline()) {
      const [rows] = await pool.query(`
        SELECT md.*, COUNT(l.id) AS laptop_count
        FROM master_dealers md
        LEFT JOIN laptops l ON l.master_dealer_id = md.id
        GROUP BY md.id
        ORDER BY md.id ASC
      `);
      return res.json({ success: true, data: rows });
    } else {
      const result = mockDb.master_dealers.map(md => ({
        ...md,
        laptop_count: mockDb.laptops.filter(l => l.master_dealer_id === md.id).length
      }));
      return res.json({ success: true, data: result });
    }
  } catch (error) {
    console.error('Get master dealers error:', error);
    return res.json({ success: true, data: mockDb.master_dealers });
  }
};

// GET /api/master-dealers/:id
const getMasterDealerById = async (req, res) => {
  try {
    const { id } = req.params;
    if (isMysqlOnline()) {
      const [rows] = await pool.query(`
        SELECT md.*, COUNT(l.id) AS laptop_count
        FROM master_dealers md
        LEFT JOIN laptops l ON l.master_dealer_id = md.id
        WHERE md.id = ?
        GROUP BY md.id
      `, [id]);
      if (rows.length === 0) {
        return res.status(404).json({ success: false, message: 'Master Dealer tidak ditemukan.' });
      }
      return res.json({ success: true, data: rows[0] });
    } else {
      const md = mockDb.master_dealers.find(m => m.id === parseInt(id));
      if (!md) {
        return res.status(404).json({ success: false, message: 'Master Dealer tidak ditemukan.' });
      }
      const count = mockDb.laptops.filter(l => l.master_dealer_id === md.id).length;
      return res.json({ success: true, data: { ...md, laptop_count: count } });
    }
  } catch (error) {
    console.error('Get master dealer by id error:', error);
    return res.status(500).json({ success: false, message: 'Gagal memuat data Master Dealer.' });
  }
};

// POST /api/master-dealers
const createMasterDealer = async (req, res) => {
  try {
    const { code, name, contact, address, status, notes } = req.body;

    if (!name) {
      return res.status(400).json({ success: false, message: 'Nama Master Dealer wajib diisi.' });
    }

    const mdCode = code || `MD-${Date.now().toString().slice(-5)}`;

    if (isMysqlOnline()) {
      const [result] = await pool.query(
        'INSERT INTO master_dealers (code, name, contact, address, status, notes) VALUES (?, ?, ?, ?, ?, ?)',
        [mdCode, name, contact || null, address || null, status || 'AKTIF', notes || null]
      );
      return res.status(201).json({
        success: true,
        message: 'Master Dealer berhasil ditambahkan.',
        data: { id: result.insertId, code: mdCode, name, contact, address, status: status || 'AKTIF', notes }
      });
    } else {
      const existing = mockDb.master_dealers.find(m => m.code === mdCode);
      if (existing) {
        return res.status(400).json({ success: false, message: 'Kode Master Dealer sudah ada.' });
      }
      const newMD = {
        id: mockDb.master_dealers.length > 0 ? Math.max(...mockDb.master_dealers.map(m => m.id)) + 1 : 1,
        code: mdCode,
        name,
        contact: contact || null,
        address: address || null,
        status: status || 'AKTIF',
        notes: notes || 'Supplier Laptop Baru All Brand',
        created_at: new Date().toISOString()
      };
      mockDb.master_dealers.push(newMD);
      return res.status(201).json({
        success: true,
        message: 'Master Dealer berhasil ditambahkan.',
        data: newMD
      });
    }
  } catch (error) {
    console.error('Create Master Dealer error:', error);
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ success: false, message: 'Kode Master Dealer sudah ada.' });
    }
    return res.status(500).json({ success: false, message: 'Gagal menambahkan Master Dealer.' });
  }
};

// PUT /api/master-dealers/:id
const updateMasterDealer = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, contact, address, status, notes } = req.body;

    if (!name) {
      return res.status(400).json({ success: false, message: 'Nama Master Dealer wajib diisi.' });
    }

    if (isMysqlOnline()) {
      const [result] = await pool.query(
        'UPDATE master_dealers SET name = ?, contact = ?, address = ?, status = ?, notes = ? WHERE id = ?',
        [name, contact || null, address || null, status || 'AKTIF', notes || null, id]
      );
      if (result.affectedRows === 0) {
        return res.status(404).json({ success: false, message: 'Master Dealer tidak ditemukan.' });
      }
      return res.json({ success: true, message: 'Master Dealer berhasil diperbarui.' });
    } else {
      const index = mockDb.master_dealers.findIndex(m => m.id === parseInt(id));
      if (index === -1) {
        return res.status(404).json({ success: false, message: 'Master Dealer tidak ditemukan.' });
      }
      mockDb.master_dealers[index].name = name;
      mockDb.master_dealers[index].contact = contact || null;
      mockDb.master_dealers[index].address = address || null;
      mockDb.master_dealers[index].status = status || 'AKTIF';
      mockDb.master_dealers[index].notes = notes || null;
      return res.json({ success: true, message: 'Master Dealer berhasil diperbarui.', data: mockDb.master_dealers[index] });
    }
  } catch (error) {
    console.error('Update Master Dealer error:', error);
    return res.status(500).json({ success: false, message: 'Gagal memperbarui Master Dealer.' });
  }
};

// DELETE /api/master-dealers/:id
const deleteMasterDealer = async (req, res) => {
  try {
    const { id } = req.params;

    if (isMysqlOnline()) {
      const [laptops] = await pool.query('SELECT COUNT(*) as count FROM laptops WHERE master_dealer_id = ?', [id]);
      if (laptops[0].count > 0) {
        return res.status(400).json({
          success: false,
          message: 'Master Dealer tidak dapat dihapus karena masih digunakan dalam data pengadaan laptop.'
        });
      }
      const [result] = await pool.query('DELETE FROM master_dealers WHERE id = ?', [id]);
      if (result.affectedRows === 0) {
        return res.status(404).json({ success: false, message: 'Master Dealer tidak ditemukan.' });
      }
      return res.json({ success: true, message: 'Master Dealer berhasil dihapus.' });
    } else {
      const isUsed = mockDb.laptops.some(l => l.master_dealer_id === parseInt(id));
      if (isUsed) {
        return res.status(400).json({
          success: false,
          message: 'Master Dealer tidak dapat dihapus karena masih digunakan dalam data pengadaan laptop.'
        });
      }
      const index = mockDb.master_dealers.findIndex(m => m.id === parseInt(id));
      if (index === -1) {
        return res.status(404).json({ success: false, message: 'Master Dealer tidak ditemukan.' });
      }
      mockDb.master_dealers.splice(index, 1);
      return res.json({ success: true, message: 'Master Dealer berhasil dihapus.' });
    }
  } catch (error) {
    console.error('Delete Master Dealer error:', error);
    return res.status(500).json({ success: false, message: 'Gagal menghapus Master Dealer.' });
  }
};

module.exports = {
  getMasterDealers,
  getMasterDealerById,
  createMasterDealer,
  updateMasterDealer,
  deleteMasterDealer
};
