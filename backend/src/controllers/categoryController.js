const { pool, mockDb, isMysqlOnline } = require('../config/db');

// GET /api/categories
const getCategories = async (req, res) => {
  try {
    if (isMysqlOnline()) {
      const [rows] = await pool.query(`
        SELECT c.*, COUNT(l.id) AS laptop_count
        FROM categories c
        LEFT JOIN laptops l ON l.category_id = c.id
        GROUP BY c.id
        ORDER BY c.name ASC
      `);
      return res.json({ success: true, data: rows });
    } else {
      const result = mockDb.categories.map(c => ({
        ...c,
        laptop_count: mockDb.laptops.filter(l => l.category_id === c.id).length
      })).sort((a, b) => a.name.localeCompare(b.name));
      return res.json({ success: true, data: result });
    }
  } catch (error) {
    console.error('Get categories error:', error);
    const sorted = [...mockDb.categories].sort((a, b) => a.name.localeCompare(b.name));
    return res.json({ success: true, data: sorted });
  }
};

// GET /api/categories/:id
const getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    if (isMysqlOnline()) {
      const [rows] = await pool.query(`
        SELECT c.*, COUNT(l.id) AS laptop_count
        FROM categories c
        LEFT JOIN laptops l ON l.category_id = c.id
        WHERE c.id = ?
        GROUP BY c.id
      `, [id]);
      if (rows.length === 0) {
        return res.status(404).json({ success: false, message: 'Kategori tidak ditemukan.' });
      }
      return res.json({ success: true, data: rows[0] });
    } else {
      const cat = mockDb.categories.find(c => c.id === parseInt(id));
      if (!cat) {
        return res.status(404).json({ success: false, message: 'Kategori tidak ditemukan.' });
      }
      const count = mockDb.laptops.filter(l => l.category_id === cat.id).length;
      return res.json({ success: true, data: { ...cat, laptop_count: count } });
    }
  } catch (error) {
    console.error('Get category by id error:', error);
    return res.status(500).json({ success: false, message: 'Gagal memuat data kategori.' });
  }
};

// POST /api/categories
const createCategory = async (req, res) => {
  try {
    const { code, name, description } = req.body;
    if (!name) {
      return res.status(400).json({ success: false, message: 'Nama kategori wajib diisi.' });
    }
    const catCode = code || `CTG-${Date.now().toString().slice(-5)}`;

    if (isMysqlOnline()) {
      const [result] = await pool.query(
        'INSERT INTO categories (code, name, description) VALUES (?, ?, ?)',
        [catCode, name, description || null]
      );
      return res.status(201).json({
        success: true,
        message: 'Kategori berhasil ditambahkan.',
        data: { id: result.insertId, code: catCode, name, description }
      });
    } else {
      const existing = mockDb.categories.find(c => c.name.toLowerCase() === name.toLowerCase() || c.code === catCode);
      if (existing) {
        return res.status(400).json({ success: false, message: 'Kode atau nama kategori sudah ada.' });
      }
      const newCategory = {
        id: mockDb.categories.length > 0 ? Math.max(...mockDb.categories.map(c => c.id)) + 1 : 1,
        code: catCode,
        name,
        description: description || null,
        created_at: new Date().toISOString()
      };
      mockDb.categories.push(newCategory);
      return res.status(201).json({
        success: true,
        message: 'Kategori berhasil ditambahkan.',
        data: newCategory
      });
    }
  } catch (error) {
    console.error('Create category error:', error);
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ success: false, message: 'Kode atau nama kategori sudah ada.' });
    }
    return res.status(500).json({ success: false, message: 'Gagal menambahkan kategori.' });
  }
};

// PUT /api/categories/:id
const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({ success: false, message: 'Nama kategori wajib diisi.' });
    }

    if (isMysqlOnline()) {
      const [result] = await pool.query(
        'UPDATE categories SET name = ?, description = ? WHERE id = ?',
        [name, description || null, id]
      );
      if (result.affectedRows === 0) {
        return res.status(404).json({ success: false, message: 'Kategori tidak ditemukan.' });
      }
      return res.json({ success: true, message: 'Kategori berhasil diperbarui.' });
    } else {
      const index = mockDb.categories.findIndex(c => c.id === parseInt(id));
      if (index === -1) {
        return res.status(404).json({ success: false, message: 'Kategori tidak ditemukan.' });
      }
      mockDb.categories[index].name = name;
      mockDb.categories[index].description = description || null;
      return res.json({ success: true, message: 'Kategori berhasil diperbarui.', data: mockDb.categories[index] });
    }
  } catch (error) {
    console.error('Update category error:', error);
    return res.status(500).json({ success: false, message: 'Gagal memperbarui kategori.' });
  }
};

// DELETE /api/categories/:id
const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    if (isMysqlOnline()) {
      const [laptops] = await pool.query('SELECT COUNT(*) as count FROM laptops WHERE category_id = ?', [id]);
      if (laptops[0].count > 0) {
        return res.status(400).json({
          success: false,
          message: 'Kategori tidak dapat dihapus karena masih digunakan oleh data inventaris laptop.'
        });
      }

      const [result] = await pool.query('DELETE FROM categories WHERE id = ?', [id]);
      if (result.affectedRows === 0) {
        return res.status(404).json({ success: false, message: 'Kategori tidak ditemukan.' });
      }
      return res.json({ success: true, message: 'Kategori berhasil dihapus.' });
    } else {
      const isUsed = mockDb.laptops.some(l => l.category_id === parseInt(id));
      if (isUsed) {
        return res.status(400).json({
          success: false,
          message: 'Kategori tidak dapat dihapus karena masih digunakan oleh data inventaris laptop.'
        });
      }
      const index = mockDb.categories.findIndex(c => c.id === parseInt(id));
      if (index === -1) {
        return res.status(404).json({ success: false, message: 'Kategori tidak ditemukan.' });
      }
      mockDb.categories.splice(index, 1);
      return res.json({ success: true, message: 'Kategori berhasil dihapus.' });
    }
  } catch (error) {
    console.error('Delete category error:', error);
    return res.status(500).json({ success: false, message: 'Gagal menghapus kategori.' });
  }
};

module.exports = {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory
};
