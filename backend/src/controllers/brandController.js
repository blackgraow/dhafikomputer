const { pool, mockDb, isMysqlOnline } = require('../config/db');

// GET /api/brands
const getBrands = async (req, res) => {
  try {
    if (isMysqlOnline()) {
      const [rows] = await pool.query(`
        SELECT b.*, COUNT(l.id) as laptop_count 
        FROM brands b 
        LEFT JOIN laptops l ON b.id = l.brand_id 
        GROUP BY b.id 
        ORDER BY b.name ASC
      `);
      const mapped = rows.map(r => ({
        ...r,
        laptop_count: Number(r.laptop_count) || 0,
        description: r.description || `Merek laptop ${r.name}`,
        status: r.status || 'AKTIF'
      }));
      return res.json({ success: true, data: mapped });
    } else {
      const populated = mockDb.brands.map(b => {
        const count = mockDb.laptops.filter(l => l.brand_id === b.id).length;
        return {
          ...b,
          laptop_count: count > 0 ? count : (b.laptop_count || 0),
          description: b.description || `Merek laptop ${b.name}`,
          status: b.status || 'AKTIF'
        };
      }).sort((a, b) => a.name.localeCompare(b.name));
      return res.json({ success: true, data: populated });
    }
  } catch (error) {
    console.error('Get brands error:', error);
    const populated = mockDb.brands.map(b => ({
      ...b,
      laptop_count: b.laptop_count || mockDb.laptops.filter(l => l.brand_id === b.id).length || 0,
      description: b.description || `Merek laptop ${b.name}`,
      status: b.status || 'AKTIF'
    })).sort((a, b) => a.name.localeCompare(b.name));
    return res.json({ success: true, data: populated });
  }
};

// POST /api/brands
const createBrand = async (req, res) => {
  try {
    const { code, name, description, logo_url, status } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, message: 'Nama merek wajib diisi.' });
    }

    const brandName = name.trim();
    const brandStatus = status || 'AKTIF';
    const brandDesc = description !== undefined ? description : `Merek laptop ${brandName}`;

    if (isMysqlOnline()) {
      // Check duplicate name
      const [dup] = await pool.query('SELECT id FROM brands WHERE LOWER(name) = LOWER(?)', [brandName]);
      if (dup.length > 0) {
        return res.status(400).json({ success: false, message: `Merek dengan nama "${brandName}" sudah terdaftar.` });
      }

      // Auto generate code if not passed
      let brandCode = code;
      if (!brandCode) {
        const [countRow] = await pool.query('SELECT COUNT(*) as total FROM brands');
        const nextNum = (countRow[0].total || 0) + 1;
        brandCode = `BRD-${nextNum.toString().padStart(3, '0')}`;
      }

      const [result] = await pool.query(
        'INSERT INTO brands (code, name, description, logo_url, status) VALUES (?, ?, ?, ?, ?)',
        [brandCode, brandName, brandDesc, logo_url || null, brandStatus]
      );

      const newBrand = {
        id: result.insertId,
        code: brandCode,
        name: brandName,
        description: brandDesc,
        logo_url: logo_url || null,
        status: brandStatus,
        laptop_count: 0
      };

      return res.status(201).json({
        success: true,
        message: 'Merek berhasil ditambahkan.',
        data: newBrand
      });
    } else {
      const existing = mockDb.brands.find(b => b.name.toLowerCase() === brandName.toLowerCase());
      if (existing) {
        return res.status(400).json({ success: false, message: `Merek dengan nama "${brandName}" sudah terdaftar.` });
      }

      let brandCode = code;
      if (!brandCode) {
        brandCode = `BRD-${(mockDb.brands.length + 1).toString().padStart(3, '0')}`;
      }

      const newBrand = {
        id: mockDb.brands.length > 0 ? Math.max(...mockDb.brands.map(b => b.id)) + 1 : 1,
        code: brandCode,
        name: brandName,
        description: brandDesc,
        logo_url: logo_url || null,
        status: brandStatus,
        laptop_count: 0,
        created_at: new Date().toISOString()
      };
      mockDb.brands.push(newBrand);
      return res.status(201).json({
        success: true,
        message: 'Merek berhasil ditambahkan.',
        data: newBrand
      });
    }
  } catch (error) {
    console.error('Create brand error:', error);
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ success: false, message: 'Kode atau nama merek sudah ada.' });
    }
    return res.status(500).json({ success: false, message: 'Gagal menambahkan merek.', error: error.message });
  }
};

// PUT /api/brands/:id
const updateBrand = async (req, res) => {
  try {
    const { id } = req.params;
    const { code, name, description, logo_url, status } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, message: 'Nama merek wajib diisi.' });
    }

    const brandName = name.trim();
    const brandDesc = description !== undefined ? description : null;
    const brandLogo = logo_url !== undefined ? (logo_url || null) : null;
    const brandStatus = status || 'AKTIF';

    if (isMysqlOnline()) {
      // Check if brand exists
      const [existing] = await pool.query('SELECT * FROM brands WHERE id = ?', [id]);
      if (existing.length === 0) {
        return res.status(404).json({ success: false, message: 'Merek tidak ditemukan.' });
      }

      // Check if another brand already uses this name
      const [dup] = await pool.query('SELECT id FROM brands WHERE LOWER(name) = LOWER(?) AND id != ?', [brandName, id]);
      if (dup.length > 0) {
        return res.status(400).json({ success: false, message: `Merek dengan nama "${brandName}" sudah terdaftar.` });
      }

      await pool.query(
        'UPDATE brands SET name = ?, description = ?, logo_url = ?, status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        [brandName, brandDesc, brandLogo, brandStatus, id]
      );

      const [updatedRows] = await pool.query(`
        SELECT b.*, COUNT(l.id) as laptop_count 
        FROM brands b 
        LEFT JOIN laptops l ON b.id = l.brand_id 
        WHERE b.id = ? 
        GROUP BY b.id
      `, [id]);

      const updated = {
        ...updatedRows[0],
        laptop_count: Number(updatedRows[0]?.laptop_count) || 0
      };

      return res.json({ success: true, message: 'Merek berhasil diperbarui.', data: updated });
    } else {
      const index = mockDb.brands.findIndex(b => b.id === parseInt(id));
      if (index === -1) {
        return res.status(404).json({ success: false, message: 'Merek tidak ditemukan.' });
      }

      const dup = mockDb.brands.find(b => b.name.toLowerCase() === brandName.toLowerCase() && b.id !== parseInt(id));
      if (dup) {
        return res.status(400).json({ success: false, message: `Merek dengan nama "${brandName}" sudah terdaftar.` });
      }

      if (code) mockDb.brands[index].code = code;
      mockDb.brands[index].name = brandName;
      mockDb.brands[index].description = brandDesc;
      mockDb.brands[index].logo_url = brandLogo;
      mockDb.brands[index].status = brandStatus;
      mockDb.brands[index].updated_at = new Date().toISOString();

      return res.json({ success: true, message: 'Merek berhasil diperbarui.', data: mockDb.brands[index] });
    }
  } catch (error) {
    console.error('Update brand error:', error);
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ success: false, message: 'Nama atau kode merek sudah terdaftar di sistem.' });
    }
    return res.status(500).json({ success: false, message: 'Gagal memperbarui merek.', error: error.message });
  }
};

// DELETE /api/brands/:id
const deleteBrand = async (req, res) => {
  try {
    const { id } = req.params;

    if (isMysqlOnline()) {
      const [laptops] = await pool.query('SELECT COUNT(*) as count FROM laptops WHERE brand_id = ?', [id]);
      if (laptops[0].count > 0) {
        return res.status(400).json({
          success: false,
          message: 'Merek tidak dapat dihapus karena masih digunakan oleh data inventaris laptop.'
        });
      }

      const [result] = await pool.query('DELETE FROM brands WHERE id = ?', [id]);
      if (result.affectedRows === 0) {
        return res.status(404).json({ success: false, message: 'Merek tidak ditemukan.' });
      }
      return res.json({ success: true, message: 'Merek berhasil dihapus.' });
    } else {
      const isUsed = mockDb.laptops.some(l => l.brand_id === parseInt(id));
      if (isUsed) {
        return res.status(400).json({
          success: false,
          message: 'Merek tidak dapat dihapus karena masih digunakan oleh data inventaris laptop.'
        });
      }
      const index = mockDb.brands.findIndex(b => b.id === parseInt(id));
      if (index === -1) {
        return res.status(404).json({ success: false, message: 'Merek tidak ditemukan.' });
      }
      mockDb.brands.splice(index, 1);
      return res.json({ success: true, message: 'Merek berhasil dihapus.' });
    }
  } catch (error) {
    console.error('Delete brand error:', error);
    return res.status(500).json({ success: false, message: 'Gagal menghapus merek.' });
  }
};

// GET /api/brands/:id
const getBrandDetail = async (req, res) => {
  try {
    const { id } = req.params;
    if (isMysqlOnline()) {
      const [rows] = await pool.query(`
        SELECT b.*, COUNT(l.id) as laptop_count 
        FROM brands b 
        LEFT JOIN laptops l ON b.id = l.brand_id 
        WHERE b.id = ? 
        GROUP BY b.id
      `, [id]);
      if (rows.length === 0) {
        return res.status(404).json({ success: false, message: 'Merek tidak ditemukan.' });
      }
      const item = {
        ...rows[0],
        laptop_count: Number(rows[0].laptop_count) || 0,
        description: rows[0].description || `Merek laptop ${rows[0].name}`,
        status: rows[0].status || 'AKTIF'
      };
      return res.json({ success: true, data: item });
    } else {
      const brand = mockDb.brands.find(b => b.id === parseInt(id));
      if (!brand) {
        return res.status(404).json({ success: false, message: 'Merek tidak ditemukan.' });
      }
      const count = mockDb.laptops.filter(l => l.brand_id === brand.id).length;
      const item = {
        ...brand,
        laptop_count: count > 0 ? count : (brand.laptop_count || 0),
        description: brand.description || `Merek laptop ${brand.name}`,
        status: brand.status || 'AKTIF'
      };
      return res.json({ success: true, data: item });
    }
  } catch (error) {
    console.error('Get brand detail error:', error);
    return res.status(500).json({ success: false, message: 'Gagal memuat detail merek.' });
  }
};

module.exports = {
  getBrands,
  getBrandDetail,
  createBrand,
  updateBrand,
  deleteBrand
};
