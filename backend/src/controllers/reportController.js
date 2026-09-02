const { pool, mockDb, isMysqlOnline } = require('../config/db');

// GET /api/reports/inventory (PRD Section 40.1)
const getInventoryReport = async (req, res) => {
  try {
    const { brand_id, category_id, condition_type, master_dealer_id, dealer_id, status } = req.query;

    if (isMysqlOnline()) {
      let query = `
        SELECT 
          l.id,
          l.code,
          l.name,
          b.name AS brand_name,
          c.name AS category_name,
          l.condition_type,
          l.source_type,
          md.name AS master_dealer_name,
          dl.name AS dealer_name,
          l.customer_name,
          l.processor,
          l.ram,
          l.storage,
          l.purchase_price,
          l.selling_price,
          l.display_stock,
          l.physical_stock,
          (l.physical_stock * l.selling_price) AS total_asset_value,
          l.status,
          l.created_at
        FROM laptops l
        JOIN brands b ON l.brand_id = b.id
        JOIN categories c ON l.category_id = c.id
        LEFT JOIN master_dealers md ON l.master_dealer_id = md.id
        LEFT JOIN dealers dl ON l.dealer_id = dl.id
        WHERE 1=1
      `;

      const params = [];
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
      if (master_dealer_id) {
        query += ` AND l.master_dealer_id = ?`;
        params.push(master_dealer_id);
      }
      if (dealer_id) {
        query += ` AND l.dealer_id = ?`;
        params.push(dealer_id);
      }
      if (status) {
        query += ` AND l.status = ?`;
        params.push(status);
      }

      query += ` ORDER BY b.name ASC, l.name ASC`;
      const [rows] = await pool.query(query, params);

      let totalPhysicalStock = 0;
      let totalDisplayStock = 0;
      let totalAssetValue = 0;

      rows.forEach(item => {
        totalPhysicalStock += parseInt(item.physical_stock || 0);
        totalDisplayStock += parseInt(item.display_stock || 0);
        totalAssetValue += parseFloat(item.total_asset_value || 0);
      });

      return res.json({
        success: true,
        summary: {
          total_items: rows.length,
          total_physical_stock: totalPhysicalStock,
          total_display_stock: totalDisplayStock,
          total_asset_value: totalAssetValue
        },
        data: rows
      });
    } else {
      let filtered = [...mockDb.laptops];

      if (brand_id) filtered = filtered.filter(l => l.brand_id === parseInt(brand_id));
      if (category_id) filtered = filtered.filter(l => l.category_id === parseInt(category_id));
      if (condition_type) filtered = filtered.filter(l => l.condition_type === condition_type);
      if (master_dealer_id) filtered = filtered.filter(l => l.master_dealer_id === parseInt(master_dealer_id));
      if (dealer_id) filtered = filtered.filter(l => l.dealer_id === parseInt(dealer_id));
      if (status) filtered = filtered.filter(l => l.status === status);

      const populated = filtered.map(l => {
        const b = mockDb.brands.find(br => br.id === l.brand_id);
        const c = mockDb.categories.find(cr => cr.id === l.category_id);
        const md = mockDb.master_dealers.find(m => m.id === l.master_dealer_id);
        const d = mockDb.dealers.find(dl => dl.id === l.dealer_id);
        return {
          ...l,
          brand_name: b?.name || 'Brand',
          category_name: c?.name || 'Category',
          master_dealer_name: md?.name || null,
          dealer_name: d?.name || null,
          total_asset_value: l.physical_stock * l.selling_price
        };
      });

      const totalPhysicalStock = populated.reduce((acc, l) => acc + l.physical_stock, 0);
      const totalDisplayStock = populated.reduce((acc, l) => acc + l.display_stock, 0);
      const totalAssetValue = populated.reduce((acc, l) => acc + l.total_asset_value, 0);

      return res.json({
        success: true,
        summary: {
          total_items: populated.length,
          total_physical_stock: totalPhysicalStock,
          total_display_stock: totalDisplayStock,
          total_asset_value: totalAssetValue
        },
        data: populated
      });
    }
  } catch (error) {
    console.error('Inventory report error:', error);
    return res.status(500).json({ success: false, message: 'Gagal mengambil laporan inventaris.' });
  }
};

// GET /api/reports/transactions-in (PRD Section 40.2)
const getBarangMasukReport = async (req, res) => {
  try {
    const { start_date, end_date, brand_id, condition_type } = req.query;

    if (isMysqlOnline()) {
      let query = `
        SELECT 
          t.transaction_code,
          t.transaction_date,
          t.source_destination,
          t.notes,
          td.laptop_id,
          l.code AS laptop_code,
          l.name AS laptop_name,
          b.name AS brand_name,
          l.condition_type,
          td.quantity,
          td.unit_price,
          td.subtotal
        FROM transactions t
        JOIN transaction_details td ON t.id = td.transaction_id
        JOIN laptops l ON td.laptop_id = l.id
        JOIN brands b ON l.brand_id = b.id
        WHERE t.type = 'MASUK'
      `;

      const params = [];
      if (start_date) {
        query += ` AND DATE(t.transaction_date) >= ?`;
        params.push(start_date);
      }
      if (end_date) {
        query += ` AND DATE(t.transaction_date) <= ?`;
        params.push(end_date);
      }
      if (brand_id) {
        query += ` AND l.brand_id = ?`;
        params.push(brand_id);
      }
      if (condition_type) {
        query += ` AND l.condition_type = ?`;
        params.push(condition_type);
      }

      query += ` ORDER BY t.transaction_date DESC`;
      const [rows] = await pool.query(query, params);

      let totalQuantity = 0;
      let totalAmount = 0;

      rows.forEach(item => {
        totalQuantity += parseInt(item.quantity || 0);
        totalAmount += parseFloat(item.subtotal || 0);
      });

      return res.json({
        success: true,
        summary: {
          total_records: rows.length,
          total_quantity: totalQuantity,
          total_amount: totalAmount
        },
        data: rows
      });
    } else {
      const masukTxs = mockDb.transactions.filter(t => t.type === 'MASUK');
      let rows = [];

      masukTxs.forEach(t => {
        const details = mockDb.transaction_details.filter(td => td.transaction_id === t.id);
        details.forEach(td => {
          const l = mockDb.laptops.find(x => x.id === td.laptop_id);
          const b = l ? mockDb.brands.find(br => br.id === l.brand_id) : null;
          rows.push({
            transaction_code: t.transaction_code,
            transaction_date: t.transaction_date,
            source_destination: t.source_destination,
            notes: t.notes,
            laptop_id: td.laptop_id,
            brand_id: l?.brand_id,
            laptop_code: l?.code || 'SKU',
            laptop_name: l?.name || 'Laptop',
            brand_name: b?.name || 'Brand',
            condition_type: l?.condition_type || 'BARU',
            quantity: td.quantity,
            unit_price: td.unit_price,
            subtotal: td.subtotal
          });
        });
      });

      if (start_date) {
        rows = rows.filter(r => new Date(r.transaction_date) >= new Date(start_date));
      }
      if (end_date) {
        const end = new Date(end_date);
        end.setHours(23, 59, 59, 999);
        rows = rows.filter(r => new Date(r.transaction_date) <= end);
      }
      if (brand_id) {
        rows = rows.filter(r => r.brand_id === parseInt(brand_id));
      }
      if (condition_type) {
        rows = rows.filter(r => r.condition_type === condition_type);
      }

      const totalQuantity = rows.reduce((acc, r) => acc + r.quantity, 0);
      const totalAmount = rows.reduce((acc, r) => acc + r.subtotal, 0);

      return res.json({
        success: true,
        summary: {
          total_records: rows.length,
          total_quantity: totalQuantity,
          total_amount: totalAmount
        },
        data: rows
      });
    }
  } catch (error) {
    console.error('Barang Masuk report error:', error);
    return res.status(500).json({ success: false, message: 'Gagal mengambil laporan barang masuk.' });
  }
};

// GET /api/reports/transactions-out (PRD Section 40.3)
const getBarangKeluarReport = async (req, res) => {
  try {
    const { start_date, end_date, brand_id, condition_type } = req.query;

    if (isMysqlOnline()) {
      let query = `
        SELECT 
          t.transaction_code,
          t.transaction_date,
          t.source_destination,
          t.notes,
          td.laptop_id,
          l.code AS laptop_code,
          l.name AS laptop_name,
          b.name AS brand_name,
          l.condition_type,
          td.quantity,
          td.unit_price,
          td.subtotal
        FROM transactions t
        JOIN transaction_details td ON t.id = td.transaction_id
        JOIN laptops l ON td.laptop_id = l.id
        JOIN brands b ON l.brand_id = b.id
        WHERE t.type = 'KELUAR'
      `;

      const params = [];
      if (start_date) {
        query += ` AND DATE(t.transaction_date) >= ?`;
        params.push(start_date);
      }
      if (end_date) {
        query += ` AND DATE(t.transaction_date) <= ?`;
        params.push(end_date);
      }
      if (brand_id) {
        query += ` AND l.brand_id = ?`;
        params.push(brand_id);
      }
      if (condition_type) {
        query += ` AND l.condition_type = ?`;
        params.push(condition_type);
      }

      query += ` ORDER BY t.transaction_date DESC`;
      const [rows] = await pool.query(query, params);

      let totalQuantity = 0;
      let totalAmount = 0;

      rows.forEach(item => {
        totalQuantity += parseInt(item.quantity || 0);
        totalAmount += parseFloat(item.subtotal || 0);
      });

      return res.json({
        success: true,
        summary: {
          total_records: rows.length,
          total_quantity: totalQuantity,
          total_amount: totalAmount
        },
        data: rows
      });
    } else {
      const keluarTxs = mockDb.transactions.filter(t => t.type === 'KELUAR');
      let rows = [];

      keluarTxs.forEach(t => {
        const details = mockDb.transaction_details.filter(td => td.transaction_id === t.id);
        details.forEach(td => {
          const l = mockDb.laptops.find(x => x.id === td.laptop_id);
          const b = l ? mockDb.brands.find(br => br.id === l.brand_id) : null;
          rows.push({
            transaction_code: t.transaction_code,
            transaction_date: t.transaction_date,
            source_destination: t.source_destination,
            notes: t.notes,
            laptop_id: td.laptop_id,
            brand_id: l?.brand_id,
            laptop_code: l?.code || 'SKU',
            laptop_name: l?.name || 'Laptop',
            brand_name: b?.name || 'Brand',
            condition_type: l?.condition_type || 'SECOND',
            quantity: td.quantity,
            unit_price: td.unit_price,
            subtotal: td.subtotal
          });
        });
      });

      if (start_date) {
        rows = rows.filter(r => new Date(r.transaction_date) >= new Date(start_date));
      }
      if (end_date) {
        const end = new Date(end_date);
        end.setHours(23, 59, 59, 999);
        rows = rows.filter(r => new Date(r.transaction_date) <= end);
      }
      if (brand_id) {
        rows = rows.filter(r => r.brand_id === parseInt(brand_id));
      }
      if (condition_type) {
        rows = rows.filter(r => r.condition_type === condition_type);
      }

      const totalQuantity = rows.reduce((acc, r) => acc + r.quantity, 0);
      const totalAmount = rows.reduce((acc, r) => acc + r.subtotal, 0);

      return res.json({
        success: true,
        summary: {
          total_records: rows.length,
          total_quantity: totalQuantity,
          total_amount: totalAmount
        },
        data: rows
      });
    }
  } catch (error) {
    console.error('Barang Keluar report error:', error);
    return res.status(500).json({ success: false, message: 'Gagal mengambil laporan barang keluar.' });
  }
};

module.exports = {
  getInventoryReport,
  getBarangMasukReport,
  getBarangKeluarReport
};
