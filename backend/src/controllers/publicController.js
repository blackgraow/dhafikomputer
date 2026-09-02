const { pool, mockDb, isMysqlOnline } = require('../config/db');

// Helper to sanitize public laptop data (prevents data leak of purchase_price, supplier info, etc.)
const sanitizePublicLaptop = (l) => {
  const brand = mockDb.brands.find(b => b.id === l.brand_id);
  const category = mockDb.categories.find(c => c.id === l.category_id);
  return {
    id: l.id,
    code: l.code,
    name: l.name,
    brand_id: l.brand_id,
    brand_name: brand?.name || 'Brand',
    category_id: l.category_id,
    category_name: category?.name || 'Category',
    condition_type: l.condition_type,
    processor: l.processor,
    ram: l.ram,
    storage: l.storage,
    gpu: l.gpu,
    screen_size: l.screen_size,
    operating_system: l.operating_system,
    color: l.color,
    release_year: l.release_year,
    warranty: l.warranty,
    condition_notes: l.condition_notes,
    selling_price: l.selling_price,
    physical_stock: l.physical_stock,
    status: l.status,
    primary_image: l.primary_image,
    description: l.description,
    images: [l.primary_image].filter(Boolean)
  };
};

// GET /api/public/products (PRD Section 14, 21, 53)
const getPublicProducts = async (req, res) => {
  try {
    const { search, brand_id, category_id, condition_type, sort_price } = req.query;

    if (isMysqlOnline()) {
      let query = `
        SELECT 
          l.id,
          l.code,
          l.name,
          l.brand_id,
          b.name AS brand_name,
          l.category_id,
          c.name AS category_name,
          l.condition_type,
          l.processor,
          l.ram,
          l.storage,
          l.gpu,
          l.screen_size,
          l.operating_system,
          l.color,
          l.release_year,
          l.warranty,
          l.condition_notes,
          l.selling_price,
          l.physical_stock,
          l.status,
          l.primary_image,
          l.description
        FROM laptops l
        JOIN brands b ON l.brand_id = b.id
        JOIN categories c ON l.category_id = c.id
        WHERE l.physical_stock > 0 AND l.status = 'TERSEDIA'
      `;

      const params = [];

      if (search) {
        query += ` AND (l.name LIKE ? OR l.processor LIKE ? OR b.name LIKE ?)`;
        params.push(`%${search}%`, `%${search}%`, `%${search}%`);
      }

      if (brand_id) {
        query += ` AND l.brand_id = ?`;
        params.push(brand_id);
      }

      if (category_id) {
        query += ` AND l.category_id = ?`;
        params.push(category_id);
      }

      if (condition_type) {
        query += ` AND l.condition_type = ?`;
        params.push(condition_type);
      }

      if (sort_price === 'asc') {
        query += ` ORDER BY l.selling_price ASC`;
      } else if (sort_price === 'desc') {
        query += ` ORDER BY l.selling_price DESC`;
      } else {
        query += ` ORDER BY l.id DESC`;
      }

      const [products] = await pool.query(query, params);

      return res.json({
        success: true,
        count: products.length,
        data: products
      });
    } else {
      let filtered = mockDb.laptops.filter(l => l.physical_stock > 0 && l.status === 'TERSEDIA');

      if (search) {
        const s = search.toLowerCase();
        filtered = filtered.filter(l => 
          l.name.toLowerCase().includes(s) || 
          (l.processor && l.processor.toLowerCase().includes(s)) ||
          l.code.toLowerCase().includes(s)
        );
      }

      if (brand_id) {
        filtered = filtered.filter(l => l.brand_id === parseInt(brand_id));
      }

      if (category_id) {
        filtered = filtered.filter(l => l.category_id === parseInt(category_id));
      }

      if (condition_type) {
        filtered = filtered.filter(l => l.condition_type === condition_type);
      }

      if (sort_price === 'asc') {
        filtered.sort((a, b) => a.selling_price - b.selling_price);
      } else if (sort_price === 'desc') {
        filtered.sort((a, b) => b.selling_price - a.selling_price);
      } else {
        filtered.sort((a, b) => b.id - a.id);
      }

      const sanitizedList = filtered.map(sanitizePublicLaptop);

      return res.json({
        success: true,
        count: sanitizedList.length,
        data: sanitizedList
      });
    }
  } catch (error) {
    console.error('Public products fetch error:', error);
    return res.status(500).json({
      success: false,
      message: 'Gagal mengambil data katalog produk.'
    });
  }
};

// GET /api/public/products/:id
const getPublicProductDetail = async (req, res) => {
  try {
    const { id } = req.params;

    if (isMysqlOnline()) {
      const query = `
        SELECT 
          l.id,
          l.code,
          l.name,
          l.brand_id,
          b.name AS brand_name,
          l.category_id,
          c.name AS category_name,
          l.condition_type,
          l.processor,
          l.ram,
          l.storage,
          l.gpu,
          l.screen_size,
          l.operating_system,
          l.color,
          l.release_year,
          l.warranty,
          l.condition_notes,
          l.selling_price,
          l.physical_stock,
          l.status,
          l.description,
          l.primary_image
        FROM laptops l
        JOIN brands b ON l.brand_id = b.id
        JOIN categories c ON l.category_id = c.id
        WHERE l.id = ? AND l.physical_stock > 0 AND l.status = 'TERSEDIA'
      `;

      const [rows] = await pool.query(query, [id]);

      if (rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Produk tidak ditemukan atau stok tidak tersedia.'
        });
      }

      const [images] = await pool.query(
        'SELECT image_url, is_primary FROM laptop_images WHERE laptop_id = ? ORDER BY is_primary DESC',
        [id]
      );

      return res.json({
        success: true,
        data: {
          ...rows[0],
          images: images.length > 0 ? images.map(img => img.image_url) : [rows[0].primary_image].filter(Boolean)
        }
      });
    } else {
      const laptop = mockDb.laptops.find(l => l.id === parseInt(id) && l.physical_stock > 0 && l.status === 'TERSEDIA');
      if (!laptop) {
        return res.status(404).json({
          success: false,
          message: 'Produk tidak ditemukan atau stok tidak tersedia.'
        });
      }

      return res.json({
        success: true,
        data: sanitizePublicLaptop(laptop)
      });
    }
  } catch (error) {
    console.error('Public product detail error:', error);
    return res.status(500).json({
      success: false,
      message: 'Gagal mengambil detail produk.'
    });
  }
};

// GET /api/public/metadata
const getPublicMetadata = async (req, res) => {
  try {
    if (isMysqlOnline()) {
      const [brands] = await pool.query('SELECT id, code, name, logo_url FROM brands ORDER BY name ASC');
      const [categories] = await pool.query('SELECT id, code, name FROM categories ORDER BY name ASC');

      return res.json({
        success: true,
        brands,
        categories
      });
    } else {
      return res.json({
        success: true,
        brands: mockDb.brands,
        categories: mockDb.categories
      });
    }
  } catch (error) {
    console.error('Public metadata fetch error:', error);
    return res.json({
      success: true,
      brands: mockDb.brands,
      categories: mockDb.categories
    });
  }
};

module.exports = {
  getPublicProducts,
  getPublicProductDetail,
  getPublicMetadata
};
