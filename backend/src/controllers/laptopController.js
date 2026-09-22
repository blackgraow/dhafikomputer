const { pool, mockDb, isMysqlOnline } = require('../config/db');

// GET /api/laptops (Admin List with full fields & filters)
const getLaptops = async (req, res) => {
  try {
    const {
      search,
      brand_id,
      category_id,
      condition_type,
      source_type,
      status,
      page = 1,
      limit = 12,
      sort_by = 'id',
      sort_dir = 'DESC'
    } = req.query;

    if (isMysqlOnline()) {
      const offset = (parseInt(page) - 1) * parseInt(limit);

      let query = `
        SELECT 
          l.*,
          b.name AS brand_name,
          b.code AS brand_code,
          b.logo_url AS brand_logo_url,
          c.name AS category_name,
          md.name AS master_dealer_name,
          dl.name AS dealer_name
        FROM laptops l
        JOIN brands b ON l.brand_id = b.id
        JOIN categories c ON l.category_id = c.id
        LEFT JOIN master_dealers md ON l.master_dealer_id = md.id
        LEFT JOIN dealers dl ON l.dealer_id = dl.id
        WHERE 1=1
      `;

      const params = [];

      if (search) {
        query += ` AND (l.code LIKE ? OR l.name LIKE ? OR l.processor LIKE ? OR l.serial_number LIKE ?)`;
        params.push(`%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`);
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

      if (source_type) {
        query += ` AND l.source_type = ?`;
        params.push(source_type);
      }

      if (status) {
        query += ` AND l.status = ?`;
        params.push(status);
      }

      const countQuery = `SELECT COUNT(*) as total FROM (${query}) as sub`;
      const [countRows] = await pool.query(countQuery, params);
      const totalItems = countRows[0].total;

      const validSortColumns = ['id', 'code', 'name', 'selling_price', 'physical_stock', 'created_at'];
      const sortColumn = validSortColumns.includes(sort_by) ? sort_by : 'id';
      const sortDirection = sort_dir.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

      query += ` ORDER BY l.${sortColumn} ${sortDirection} LIMIT ? OFFSET ?`;
      params.push(parseInt(limit), parseInt(offset));

      const [rows] = await pool.query(query, params);

      return res.json({
        success: true,
        data: rows,
        pagination: {
          total_items: totalItems,
          total_pages: Math.ceil(totalItems / limit),
          current_page: parseInt(page),
          limit: parseInt(limit)
        }
      });
    } else {
      let filtered = [...mockDb.laptops];

      if (search) {
        const s = search.toLowerCase();
        filtered = filtered.filter(l => 
          l.code.toLowerCase().includes(s) ||
          l.name.toLowerCase().includes(s) ||
          (l.processor && l.processor.toLowerCase().includes(s)) ||
          (l.serial_number && l.serial_number.toLowerCase().includes(s))
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

      if (source_type) {
        filtered = filtered.filter(l => l.source_type === source_type);
      }

      if (status) {
        filtered = filtered.filter(l => l.status === status);
      }

      filtered.sort((a, b) => b.id - a.id);

      const totalItems = filtered.length;
      const offset = (parseInt(page) - 1) * parseInt(limit);
      const paginated = filtered.slice(offset, offset + parseInt(limit));

      const populated = paginated.map(l => {
        const brand = mockDb.brands.find(b => b.id === l.brand_id);
        const category = mockDb.categories.find(c => c.id === l.category_id);
        const md = mockDb.master_dealers.find(m => m.id === l.master_dealer_id);
        const dlr = mockDb.dealers.find(d => d.id === l.dealer_id);
        return {
          ...l,
          brand_name: brand?.name || 'Brand',
          brand_code: brand?.code || 'BRD',
          brand_logo_url: brand?.logo_url || null,
          category_name: category?.name || 'Category',
          master_dealer_name: md?.name || null,
          dealer_name: dlr?.name || null
        };
      });

      return res.json({
        success: true,
        data: populated,
        pagination: {
          total_items: totalItems,
          total_pages: Math.ceil(totalItems / limit),
          current_page: parseInt(page),
          limit: parseInt(limit)
        }
      });
    }
  } catch (error) {
    console.error('Get laptops error:', error);
    return res.status(500).json({ success: false, message: 'Gagal mengambil data laptop.' });
  }
};

// GET /api/laptops/:id (Admin Comprehensive Detail View per Section 36)
const getLaptopDetail = async (req, res) => {
  try {
    const { id } = req.params;

    if (isMysqlOnline()) {
      const query = `
        SELECT 
          l.*,
          b.name AS brand_name,
          b.code AS brand_code,
          b.logo_url AS brand_logo_url,
          c.name AS category_name,
          md.name AS master_dealer_name,
          dl.name AS dealer_name
        FROM laptops l
        JOIN brands b ON l.brand_id = b.id
        JOIN categories c ON l.category_id = c.id
        LEFT JOIN master_dealers md ON l.master_dealer_id = md.id
        LEFT JOIN dealers dl ON l.dealer_id = dl.id
        WHERE l.id = ?
      `;

      const [rows] = await pool.query(query, [id]);

      if (rows.length === 0) {
        return res.status(404).json({ success: false, message: 'Data laptop tidak ditemukan.' });
      }

      const laptop = rows[0];

      // Images
      const [images] = await pool.query(
        'SELECT id, image_url, is_primary FROM laptop_images WHERE laptop_id = ? ORDER BY is_primary DESC',
        [id]
      );

      // Specific Transaction History for this laptop (Audit Ledger)
      const [transactions] = await pool.query(
        `SELECT 
          t.id AS transaction_id,
          t.transaction_code,
          t.type,
          t.transaction_date,
          t.source_destination,
          t.notes,
          td.quantity,
          td.unit_price,
          td.subtotal
        FROM transaction_details td
        JOIN transactions t ON td.transaction_id = t.id
        WHERE td.laptop_id = ?
        ORDER BY t.transaction_date DESC, t.id DESC`,
        [id]
      );

      const margin = parseFloat(laptop.selling_price || 0) - parseFloat(laptop.purchase_price || 0);
      const total_asset_value = parseInt(laptop.physical_stock || 0) * parseFloat(laptop.selling_price || 0);

      return res.json({
        success: true,
        data: {
          ...laptop,
          // Aliases for complete frontend compatibility
          display_size: laptop.screen_size || laptop.display_size || '',
          item_type: laptop.condition_type,
          inventory_status: laptop.status,
          photo_url: laptop.primary_image || '',
          notes: laptop.description || '',
          margin,
          total_asset_value,
          images: images.length > 0 ? images : [{ id: 1, image_url: laptop.primary_image, is_primary: 1 }],
          transactions
        }
      });
    } else {
      const laptop = mockDb.laptops.find(l => l.id === parseInt(id));
      if (!laptop) {
        return res.status(404).json({ success: false, message: 'Data laptop tidak ditemukan.' });
      }
      const brand = mockDb.brands.find(b => b.id === laptop.brand_id);
      const category = mockDb.categories.find(c => c.id === laptop.category_id);
      const md = mockDb.master_dealers.find(m => m.id === laptop.master_dealer_id);
      const dlr = mockDb.dealers.find(d => d.id === laptop.dealer_id);

      // Find transactions for this laptop
      const matchingDetails = mockDb.transaction_details.filter(td => td.laptop_id === parseInt(id));
      const transactions = matchingDetails.map(td => {
        const tx = mockDb.transactions.find(t => t.id === td.transaction_id);
        return {
          transaction_id: tx?.id,
          transaction_code: tx?.transaction_code || 'TRX',
          type: tx?.type || 'MASUK',
          transaction_date: tx?.transaction_date || new Date().toISOString(),
          source_destination: tx?.source_destination || '-',
          notes: tx?.notes || '-',
          quantity: td.quantity,
          unit_price: td.unit_price,
          subtotal: td.subtotal
        };
      }).sort((a, b) => new Date(b.transaction_date) - new Date(a.transaction_date));

      const margin = parseFloat(laptop.selling_price || 0) - parseFloat(laptop.purchase_price || 0);
      const total_asset_value = parseInt(laptop.physical_stock || 0) * parseFloat(laptop.selling_price || 0);

      return res.json({
        success: true,
        data: {
          ...laptop,
          brand_name: brand?.name || 'Brand',
          brand_code: brand?.code || 'BRD',
          brand_logo_url: brand?.logo_url || null,
          category_name: category?.name || 'Category',
          master_dealer_name: md?.name || null,
          dealer_name: dlr?.name || null,
          display_size: laptop.screen_size || laptop.display_size || '',
          item_type: laptop.condition_type,
          inventory_status: laptop.status,
          photo_url: laptop.primary_image || '',
          notes: laptop.description || '',
          margin,
          total_asset_value,
          images: [{ id: 1, image_url: laptop.primary_image, is_primary: 1 }],
          transactions
        }
      });
    }
  } catch (error) {
    console.error('Get laptop detail error:', error);
    return res.status(500).json({ success: false, message: 'Gagal mengambil detail laptop.' });
  }
};

// POST /api/laptops
const createLaptop = async (req, res) => {
  try {
    const {
      code,
      name,
      brand_id,
      category_id,
      condition_type,
      item_type,
      source_type,
      master_dealer_id,
      dealer_id,
      customer_name,
      customer_contact,
      customer_notes,
      processor,
      ram,
      storage,
      gpu,
      screen_size,
      display_size,
      panel_type,
      operating_system,
      os,
      color,
      weight,
      release_year,
      warranty,
      serial_number,
      condition_notes,
      purchase_price,
      selling_price,
      display_stock,
      physical_stock,
      status,
      inventory_status,
      description,
      notes,
      primary_image,
      photo_url
    } = req.body;

    const actualCondition = condition_type || item_type || 'BARU';
    const actualScreenSize = screen_size || display_size || null;
    const actualOS = operating_system || os || null;
    const actualStatus = status || inventory_status || 'TERSEDIA';
    const actualDesc = description || notes || null;
    const actualImage = primary_image || photo_url || null;

    let actualSource = source_type;
    if (actualSource === 'PEMILIK') {
      actualSource = 'CUSTOMER';
    }
    if (actualCondition === 'BARU') {
      actualSource = 'MASTER_DEALER';
    }

    if (!code || !name || !brand_id || !category_id || !actualCondition || !actualSource || selling_price === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Mohon lengkapi field wajib (Kode, Nama, Merek, Kategori, Jenis Barang, Sumber, Harga Jual).'
      });
    }

    if (actualCondition === 'BARU' && actualSource !== 'MASTER_DEALER') {
      return res.status(400).json({
        success: false,
        message: 'Laptop Baru wajib bersumber dari Master Dealer.'
      });
    }

    if (actualSource === 'MASTER_DEALER' && !master_dealer_id) {
      return res.status(400).json({
        success: false,
        message: 'Master Dealer wajib dipilih untuk pengadaan Laptop Baru.'
      });
    }

    if (actualSource === 'DEALER' && !dealer_id) {
      return res.status(400).json({
        success: false,
        message: 'Dealer / Toko Lain wajib dipilih.'
      });
    }

    if (actualSource === 'CUSTOMER' && (!customer_name || !customer_name.trim())) {
      return res.status(400).json({
        success: false,
        message: 'Nama Pemilik / Customer wajib diisi untuk sumber Customer / Trade-in.'
      });
    }

    const initialDisplayStock = parseInt(display_stock || 0);
    const initialPhysicalStock = parseInt(physical_stock || 0);

    if (initialDisplayStock < 0 || initialPhysicalStock < 0) {
      return res.status(400).json({
        success: false,
        message: 'Jumlah stok fisik dan display tidak boleh negatif.'
      });
    }

    if (!isMysqlOnline()) {
      const existing = mockDb.laptops.find(l => l.code.toLowerCase() === code.trim().toLowerCase());
      if (existing) {
        return res.status(400).json({
          success: false,
          message: `Kode Laptop SKU "${code}" sudah terdaftar.`
        });
      }
    }

    const laptopStatus = actualStatus || (initialPhysicalStock > 0 ? 'TERSEDIA' : 'HABIS');

    if (isMysqlOnline()) {
      const [result] = await pool.query(
        `INSERT INTO laptops (
          code, name, brand_id, category_id, condition_type, source_type,
          master_dealer_id, dealer_id, customer_name, customer_contact, customer_notes,
          processor, ram, storage, gpu, screen_size, panel_type, operating_system, color, weight, release_year,
          warranty, serial_number, condition_notes, purchase_price, selling_price,
          display_stock, physical_stock, status, description, primary_image
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          code, name, brand_id, category_id, actualCondition, actualSource,
          master_dealer_id || null, dealer_id || null, customer_name || null, customer_contact || null, customer_notes || null,
          processor || null, ram || null, storage || null, gpu || null, actualScreenSize, panel_type || null, actualOS, color || null, weight || null,
          release_year || null, warranty || null, serial_number || null, condition_notes || null, parseFloat(purchase_price) || 0, parseFloat(selling_price) || 0,
          initialDisplayStock, initialPhysicalStock, laptopStatus, actualDesc, actualImage
        ]
      );

      return res.status(201).json({
        success: true,
        message: 'Data laptop berhasil ditambahkan.',
        data: { id: result.insertId, code, name }
      });
    } else {
      const newLaptop = {
        id: mockDb.laptops.length > 0 ? Math.max(...mockDb.laptops.map(l => l.id)) + 1 : 1,
        code,
        name,
        brand_id: parseInt(brand_id),
        category_id: parseInt(category_id),
        condition_type: actualCondition,
        source_type: actualSource,
        master_dealer_id: master_dealer_id ? parseInt(master_dealer_id) : null,
        dealer_id: dealer_id ? parseInt(dealer_id) : null,
        customer_name: customer_name || null,
        customer_contact: customer_contact || null,
        customer_notes: customer_notes || null,
        processor: processor || null,
        ram: ram || null,
        storage: storage || null,
        gpu: gpu || null,
        screen_size: actualScreenSize,
        panel_type: panel_type || null,
        operating_system: actualOS,
        color: color || null,
        weight: weight || null,
        release_year: release_year || null,
        warranty: warranty || null,
        serial_number: serial_number || null,
        condition_notes: condition_notes || null,
        purchase_price: parseFloat(purchase_price || 0),
        selling_price: parseFloat(selling_price || 0),
        display_stock: initialDisplayStock,
        physical_stock: initialPhysicalStock,
        status: laptopStatus,
        description: actualDesc,
        primary_image: actualImage,
        created_at: new Date().toISOString()
      };
      mockDb.laptops.push(newLaptop);
      return res.status(201).json({
        success: true,
        message: 'Data laptop berhasil ditambahkan.',
        data: newLaptop
      });
    }
  } catch (error) {
    console.error('Create laptop error:', error);
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({
        success: false,
        message: `Kode Laptop (SKU) "${req.body.code || ''}" sudah terdaftar. Silakan gunakan kode lain atau klik Auto.`
      });
    }
    if (error.code === 'ER_NO_REFERENCED_ROW_2' || error.code === 'ER_NO_REFERENCED_ROW') {
      return res.status(400).json({
        success: false,
        message: 'Data referensi (Merek, Kategori, atau Dealer) tidak valid.'
      });
    }
    if (error.code === 'ER_DATA_TOO_LONG') {
      return res.status(400).json({
        success: false,
        message: 'Ukuran data atau foto melebihi batas database.'
      });
    }
    return res.status(500).json({ 
      success: false, 
      message: 'Gagal menambahkan data laptop.',
      detail: error.message 
    });
  }
};

// PUT /api/laptops/:id
const updateLaptop = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      code,
      name,
      brand_id,
      category_id,
      condition_type,
      item_type,
      source_type,
      master_dealer_id,
      dealer_id,
      customer_name,
      customer_contact,
      customer_notes,
      processor,
      ram,
      storage,
      gpu,
      screen_size,
      display_size,
      panel_type,
      operating_system,
      os,
      color,
      weight,
      release_year,
      warranty,
      serial_number,
      condition_notes,
      purchase_price,
      selling_price,
      display_stock,
      physical_stock,
      status,
      inventory_status,
      description,
      notes,
      primary_image,
      photo_url
    } = req.body;

    const actualCondition = condition_type || item_type || 'BARU';
    const actualScreenSize = screen_size || display_size || null;
    const actualOS = operating_system || os || null;
    const actualStatus = status || inventory_status || 'TERSEDIA';
    const actualDesc = description || notes || null;
    const actualImage = primary_image || photo_url || null;

    let actualSource = source_type;
    if (actualSource === 'PEMILIK') {
      actualSource = 'CUSTOMER';
    }
    if (actualCondition === 'BARU') {
      actualSource = 'MASTER_DEALER';
    }

    const currentPhysicalStock = parseInt(physical_stock || 0);
    const currentDisplayStock = parseInt(display_stock || 0);
    const laptopStatus = actualStatus || (currentPhysicalStock > 0 ? 'TERSEDIA' : 'HABIS');

    if (isMysqlOnline()) {
      const [result] = await pool.query(
        `UPDATE laptops SET
          code = COALESCE(?, code), name = ?, brand_id = ?, category_id = ?, condition_type = ?, source_type = ?,
          master_dealer_id = ?, dealer_id = ?, customer_name = ?, customer_contact = ?, customer_notes = ?,
          processor = ?, ram = ?, storage = ?, gpu = ?, screen_size = ?, panel_type = ?, operating_system = ?, color = ?, weight = ?,
          release_year = ?, warranty = ?, serial_number = ?, condition_notes = ?, purchase_price = ?, selling_price = ?,
          display_stock = ?, physical_stock = ?, status = ?, description = ?, primary_image = ?
        WHERE id = ?`,
        [
          code || null, name, brand_id, category_id, actualCondition, actualSource,
          master_dealer_id || null, dealer_id || null, customer_name || null, customer_contact || null, customer_notes || null,
          processor || null, ram || null, storage || null, gpu || null, actualScreenSize, panel_type || null, actualOS, color || null, weight || null,
          release_year || null, warranty || null, serial_number || null, condition_notes || null, parseFloat(purchase_price || 0), parseFloat(selling_price || 0),
          currentDisplayStock, currentPhysicalStock, laptopStatus, actualDesc, actualImage, id
        ]
      );
      if (result.affectedRows === 0) {
        return res.status(404).json({ success: false, message: 'Data laptop tidak ditemukan.' });
      }
      return res.json({ success: true, message: 'Data laptop berhasil diperbarui.' });
    } else {
      const index = mockDb.laptops.findIndex(l => l.id === parseInt(id));
      if (index === -1) {
        return res.status(404).json({ success: false, message: 'Data laptop tidak ditemukan.' });
      }
      mockDb.laptops[index] = {
        ...mockDb.laptops[index],
        code: code || mockDb.laptops[index].code,
        name: name !== undefined ? name : mockDb.laptops[index].name,
        brand_id: brand_id ? parseInt(brand_id) : mockDb.laptops[index].brand_id,
        category_id: category_id ? parseInt(category_id) : mockDb.laptops[index].category_id,
        condition_type: actualCondition,
        source_type: actualSource || mockDb.laptops[index].source_type,
        master_dealer_id: master_dealer_id ? parseInt(master_dealer_id) : null,
        dealer_id: dealer_id ? parseInt(dealer_id) : null,
        customer_name: customer_name !== undefined ? customer_name : mockDb.laptops[index].customer_name,
        customer_contact: customer_contact !== undefined ? customer_contact : mockDb.laptops[index].customer_contact,
        customer_notes: customer_notes !== undefined ? customer_notes : mockDb.laptops[index].customer_notes,
        processor: processor !== undefined ? processor : mockDb.laptops[index].processor,
        ram: ram !== undefined ? ram : mockDb.laptops[index].ram,
        storage: storage !== undefined ? storage : mockDb.laptops[index].storage,
        gpu: gpu !== undefined ? gpu : mockDb.laptops[index].gpu,
        screen_size: actualScreenSize !== null ? actualScreenSize : mockDb.laptops[index].screen_size,
        panel_type: panel_type !== undefined ? panel_type : mockDb.laptops[index].panel_type,
        operating_system: actualOS !== null ? actualOS : mockDb.laptops[index].operating_system,
        color: color !== undefined ? color : mockDb.laptops[index].color,
        weight: weight !== undefined ? weight : mockDb.laptops[index].weight,
        release_year: release_year !== undefined ? release_year : mockDb.laptops[index].release_year,
        warranty: warranty !== undefined ? warranty : mockDb.laptops[index].warranty,
        serial_number: serial_number !== undefined ? serial_number : mockDb.laptops[index].serial_number,
        condition_notes: condition_notes !== undefined ? condition_notes : mockDb.laptops[index].condition_notes,
        purchase_price: purchase_price !== undefined ? parseFloat(purchase_price) : mockDb.laptops[index].purchase_price,
        selling_price: selling_price !== undefined ? parseFloat(selling_price) : mockDb.laptops[index].selling_price,
        display_stock: currentDisplayStock,
        physical_stock: currentPhysicalStock,
        status: laptopStatus,
        description: actualDesc !== null ? actualDesc : mockDb.laptops[index].description,
        primary_image: actualImage !== null ? actualImage : mockDb.laptops[index].primary_image
      };
      return res.json({ success: true, message: 'Data laptop berhasil diperbarui.', data: mockDb.laptops[index] });
    }
  } catch (error) {
    console.error('Update laptop error:', error);
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({
        success: false,
        message: `Kode Laptop (SKU) "${req.body.code || ''}" sudah terdaftar pada laptop lain.`
      });
    }
    if (error.code === 'ER_NO_REFERENCED_ROW_2' || error.code === 'ER_NO_REFERENCED_ROW') {
      return res.status(400).json({
        success: false,
        message: 'Data referensi (Merek, Kategori, atau Dealer) tidak valid.'
      });
    }
    return res.status(500).json({ 
      success: false, 
      message: 'Gagal memperbarui data laptop.',
      detail: error.message 
    });
  }
};

// DELETE /api/laptops/:id
const deleteLaptop = async (req, res) => {
  try {
    const { id } = req.params;

    if (isMysqlOnline()) {
      const [txDetails] = await pool.query('SELECT COUNT(*) as count FROM transaction_details WHERE laptop_id = ?', [id]);
      if (txDetails[0].count > 0) {
        return res.status(400).json({
          success: false,
          message: 'Data laptop tidak dapat dihapus karena memiliki riwayat transaksi.'
        });
      }
      await pool.query('DELETE FROM laptop_images WHERE laptop_id = ?', [id]);
      const [result] = await pool.query('DELETE FROM laptops WHERE id = ?', [id]);
      if (result.affectedRows === 0) {
        return res.status(404).json({ success: false, message: 'Data laptop tidak ditemukan.' });
      }
      return res.json({ success: true, message: 'Data laptop berhasil dihapus.' });
    } else {
      const index = mockDb.laptops.findIndex(l => l.id === parseInt(id));
      if (index === -1) {
        return res.status(404).json({ success: false, message: 'Data laptop tidak ditemukan.' });
      }
      mockDb.laptops.splice(index, 1);
      return res.json({ success: true, message: 'Data laptop berhasil dihapus.' });
    }
  } catch (error) {
    console.error('Delete laptop error:', error);
    return res.status(500).json({ success: false, message: 'Gagal menghapus data laptop.' });
  }
};

module.exports = {
  getLaptops,
  getLaptopDetail,
  createLaptop,
  updateLaptop,
  deleteLaptop
};
