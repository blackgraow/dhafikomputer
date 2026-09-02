const { pool, mockDb, isMysqlOnline } = require('../config/db');

// GET /api/dashboard/summary
const getDashboardSummary = async (req, res) => {
  try {
    if (isMysqlOnline()) {
      // CARD 1: Total Laptop
      const [totalRows] = await pool.query('SELECT COUNT(*) as total_laptop FROM laptops');
      const total_laptop = totalRows[0].total_laptop || 0;

      // CARD 2: Laptop Baru
      const [baruRows] = await pool.query("SELECT COUNT(*) as laptop_baru FROM laptops WHERE condition_type = 'BARU'");
      const laptop_baru = baruRows[0].laptop_baru || 0;

      // CARD 3: Laptop Second
      const [secondRows] = await pool.query("SELECT COUNT(*) as laptop_second FROM laptops WHERE condition_type = 'SECOND'");
      const laptop_second = secondRows[0].laptop_second || 0;

      // CARD 4: Estimasi Nilai Stok Fisik (SUM(physical_stock * selling_price))
      const [nilaiRows] = await pool.query('SELECT COALESCE(SUM(physical_stock * selling_price), 0) as estimasi_nilai_stok FROM laptops');
      const estimasi_nilai_stok = parseFloat(nilaiRows[0].estimasi_nilai_stok || 0);

      // ROW 2: Ringkasan Stok Berdasarkan Brand
      const [brandSummary] = await pool.query(`
        SELECT 
          b.id as brand_id,
          b.name as brand_name,
          b.logo_url,
          COUNT(l.id) as total_laptop_types,
          COALESCE(SUM(l.physical_stock), 0) as total_physical_stock,
          COALESCE(SUM(l.display_stock), 0) as total_display_stock,
          COALESCE(SUM(l.physical_stock * l.selling_price), 0) as total_asset_value
        FROM brands b
        LEFT JOIN laptops l ON b.id = l.brand_id
        GROUP BY b.id, b.name, b.logo_url
        ORDER BY total_physical_stock DESC, b.name ASC
      `);

      // ROW 3: Transaksi Terbaru
      const [latestTransactions] = await pool.query(`
        SELECT 
          t.id,
          t.transaction_code,
          t.type,
          t.transaction_date,
          t.source_destination,
          t.total_quantity,
          t.total_amount
        FROM transactions t
        ORDER BY t.transaction_date DESC, t.id DESC
        LIMIT 5
      `);

      return res.json({
        success: true,
        data: {
          cards: {
            total_laptop,
            laptop_baru,
            laptop_second,
            estimasi_nilai_stok
          },
          brand_summary: brandSummary,
          latest_transactions: latestTransactions
        }
      });
    } else {
      const total_laptop = mockDb.laptops.length;
      const laptop_baru = mockDb.laptops.filter(l => l.condition_type === 'BARU').length;
      const laptop_second = mockDb.laptops.filter(l => l.condition_type === 'SECOND').length;
      const estimasi_nilai_stok = mockDb.laptops.reduce((acc, l) => acc + (l.physical_stock * l.selling_price), 0);

      const brandSummary = mockDb.brands.map(b => {
        const matchingLaptops = mockDb.laptops.filter(l => l.brand_id === b.id);
        const total_physical_stock = matchingLaptops.reduce((acc, l) => acc + l.physical_stock, 0);
        const total_display_stock = matchingLaptops.reduce((acc, l) => acc + l.display_stock, 0);
        const total_asset_value = matchingLaptops.reduce((acc, l) => acc + (l.physical_stock * l.selling_price), 0);
        return {
          brand_id: b.id,
          brand_name: b.name,
          logo_url: b.logo_url,
          total_laptop_types: matchingLaptops.length,
          total_physical_stock,
          total_display_stock,
          total_asset_value
        };
      }).sort((a, b) => b.total_physical_stock - a.total_physical_stock);

      const latestTransactions = [...mockDb.transactions]
        .sort((a, b) => new Date(b.transaction_date) - new Date(a.transaction_date))
        .slice(0, 5);

      return res.json({
        success: true,
        data: {
          cards: {
            total_laptop,
            laptop_baru,
            laptop_second,
            estimasi_nilai_stok
          },
          brand_summary: brandSummary,
          latest_transactions: latestTransactions
        }
      });
    }
  } catch (error) {
    console.error('Dashboard summary error:', error);
    return res.status(500).json({ success: false, message: 'Gagal mengambil ringkasan dashboard.' });
  }
};

module.exports = {
  getDashboardSummary
};
