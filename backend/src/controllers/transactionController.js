const { pool, mockDb, isMysqlOnline } = require('../config/db');

// POST /api/transactions/in (Barang Masuk)
const createBarangMasuk = async (req, res) => {
  const { source_destination, notes, items } = req.body;

  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({
      success: false,
      message: 'Daftar barang masuk (items) wajib diisi.'
    });
  }

  const transactionCode = `TRX-IN-${Date.now().toString().slice(-6)}${Math.floor(Math.random() * 100)}`;
  let totalQuantity = 0;
  let totalAmount = 0;

  for (const item of items) {
    const qty = parseInt(item.quantity || 0);
    const price = parseFloat(item.unit_price || 0);
    if (qty <= 0) {
      return res.status(400).json({
        success: false,
        message: `Jumlah barang harus lebih dari 0 untuk laptop ID ${item.laptop_id}.`
      });
    }
    totalQuantity += qty;
    totalAmount += qty * price;
  }

  if (isMysqlOnline()) {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      const [txResult] = await connection.query(
        `INSERT INTO transactions (transaction_code, type, transaction_date, source_destination, notes, total_quantity, total_amount)
         VALUES (?, 'MASUK', NOW(), ?, ?, ?, ?)`,
        [transactionCode, source_destination || 'Pengadaan Barang Masuk', notes || null, totalQuantity, totalAmount]
      );

      const transactionId = txResult.insertId;

      for (const item of items) {
        const qty = parseInt(item.quantity);
        const price = parseFloat(item.unit_price || 0);
        const subtotal = qty * price;

        await connection.query(
          `INSERT INTO transaction_details (transaction_id, laptop_id, quantity, unit_price, subtotal)
           VALUES (?, ?, ?, ?, ?)`,
          [transactionId, item.laptop_id, qty, price, subtotal]
        );

        await connection.query(
          `UPDATE laptops 
           SET physical_stock = physical_stock + ?, 
               status = CASE WHEN (physical_stock + ?) > 0 THEN 'TERSEDIA' ELSE status END
           WHERE id = ?`,
          [qty, qty, item.laptop_id]
        );
      }

      await connection.commit();

      return res.status(201).json({
        success: true,
        message: 'Transaksi Barang Masuk berhasil disimpan dan stok fisik telah bertambah.',
        data: { transaction_id: transactionId, transaction_code: transactionCode, total_quantity: totalQuantity, total_amount: totalAmount }
      });
    } catch (error) {
      await connection.rollback();
      console.error('Barang Masuk Error:', error);
      return res.status(500).json({ success: false, message: 'Gagal memproses Barang Masuk. Transaksi di-rollback.' });
    } finally {
      connection.release();
    }
  } else {
    // In-memory transaction
    const newTx = {
      id: mockDb.transactions.length + 1,
      transaction_code: transactionCode,
      type: 'MASUK',
      transaction_date: new Date().toISOString(),
      source_destination: source_destination || 'Pengadaan Barang Masuk',
      notes: notes || null,
      total_quantity: totalQuantity,
      total_amount: totalAmount
    };

    mockDb.transactions.push(newTx);

    for (const item of items) {
      const qty = parseInt(item.quantity);
      const price = parseFloat(item.unit_price || 0);
      const subtotal = qty * price;

      mockDb.transaction_details.push({
        id: mockDb.transaction_details.length + 1,
        transaction_id: newTx.id,
        laptop_id: parseInt(item.laptop_id),
        quantity: qty,
        unit_price: price,
        subtotal
      });

      const laptop = mockDb.laptops.find(l => l.id === parseInt(item.laptop_id));
      if (laptop) {
        laptop.physical_stock += qty;
        if (laptop.physical_stock > 0) laptop.status = 'TERSEDIA';
      }
    }

    return res.status(201).json({
      success: true,
      message: 'Transaksi Barang Masuk berhasil disimpan dan stok fisik telah bertambah.',
      data: newTx
    });
  }
};

// POST /api/transactions/out (Barang Keluar)
const createBarangKeluar = async (req, res) => {
  const { source_destination, notes, items } = req.body;

  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({
      success: false,
      message: 'Daftar barang keluar (items) wajib diisi.'
    });
  }

  const transactionCode = `TRX-OUT-${Date.now().toString().slice(-6)}${Math.floor(Math.random() * 100)}`;
  let totalQuantity = 0;
  let totalAmount = 0;

  if (isMysqlOnline()) {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      for (const item of items) {
        const qty = parseInt(item.quantity || 0);
        if (qty <= 0) {
          await connection.rollback();
          return res.status(400).json({ success: false, message: 'Jumlah barang keluar harus lebih dari 0.' });
        }

        const [laptopRows] = await connection.query('SELECT id, name, physical_stock, selling_price FROM laptops WHERE id = ? FOR UPDATE', [item.laptop_id]);
        if (laptopRows.length === 0) {
          await connection.rollback();
          return res.status(404).json({ success: false, message: `Laptop ID ${item.laptop_id} tidak ditemukan.` });
        }

        const laptop = laptopRows[0];
        if (qty > laptop.physical_stock) {
          await connection.rollback();
          return res.status(400).json({
            success: false,
            message: `Stok tidak mencukupi untuk "${laptop.name}". Permintaan: ${qty}, Stok Fisik: ${laptop.physical_stock}.`
          });
        }

        const price = parseFloat(item.unit_price || laptop.selling_price);
        totalQuantity += qty;
        totalAmount += qty * price;
      }

      const [txResult] = await connection.query(
        `INSERT INTO transactions (transaction_code, type, transaction_date, source_destination, notes, total_quantity, total_amount)
         VALUES (?, 'KELUAR', NOW(), ?, ?, ?, ?)`,
        [transactionCode, source_destination || 'Penjualan Walk-in', notes || null, totalQuantity, totalAmount]
      );

      const transactionId = txResult.insertId;

      for (const item of items) {
        const qty = parseInt(item.quantity);
        const [laptopRows] = await connection.query('SELECT selling_price FROM laptops WHERE id = ?', [item.laptop_id]);
        const price = parseFloat(item.unit_price || laptopRows[0].selling_price);
        const subtotal = qty * price;

        await connection.query(
          `INSERT INTO transaction_details (transaction_id, laptop_id, quantity, unit_price, subtotal)
           VALUES (?, ?, ?, ?, ?)`,
          [transactionId, item.laptop_id, qty, price, subtotal]
        );

        await connection.query(
          `UPDATE laptops 
           SET physical_stock = physical_stock - ?, 
               status = CASE WHEN (physical_stock - ?) <= 0 THEN 'HABIS' ELSE status END
           WHERE id = ?`,
          [qty, qty, item.laptop_id]
        );
      }

      await connection.commit();

      return res.status(201).json({
        success: true,
        message: 'Transaksi Barang Keluar berhasil diproses dan stok telah berkurang.',
        data: { transaction_id: transactionId, transaction_code: transactionCode, total_quantity: totalQuantity, total_amount: totalAmount }
      });
    } catch (error) {
      await connection.rollback();
      console.error('Barang Keluar Error:', error);
      return res.status(500).json({ success: false, message: 'Gagal memproses Barang Keluar. Transaksi di-rollback.' });
    } finally {
      connection.release();
    }
  } else {
    // In-memory verification & deduction
    for (const item of items) {
      const qty = parseInt(item.quantity || 0);
      const laptop = mockDb.laptops.find(l => l.id === parseInt(item.laptop_id));
      if (!laptop) {
        return res.status(404).json({ success: false, message: `Laptop ID ${item.laptop_id} tidak ditemukan.` });
      }
      if (qty > laptop.physical_stock) {
        return res.status(400).json({
          success: false,
          message: `Stok tidak mencukupi untuk "${laptop.name}". Permintaan: ${qty}, Stok Fisik: ${laptop.physical_stock}.`
        });
      }
      const price = parseFloat(item.unit_price || laptop.selling_price);
      totalQuantity += qty;
      totalAmount += qty * price;
    }

    const newTx = {
      id: mockDb.transactions.length + 1,
      transaction_code: transactionCode,
      type: 'KELUAR',
      transaction_date: new Date().toISOString(),
      source_destination: source_destination || 'Penjualan Walk-in',
      notes: notes || null,
      total_quantity: totalQuantity,
      total_amount: totalAmount
    };

    mockDb.transactions.push(newTx);

    for (const item of items) {
      const qty = parseInt(item.quantity);
      const laptop = mockDb.laptops.find(l => l.id === parseInt(item.laptop_id));
      const price = parseFloat(item.unit_price || laptop.selling_price);
      const subtotal = qty * price;

      mockDb.transaction_details.push({
        id: mockDb.transaction_details.length + 1,
        transaction_id: newTx.id,
        laptop_id: parseInt(item.laptop_id),
        quantity: qty,
        unit_price: price,
        subtotal
      });

      laptop.physical_stock -= qty;
      if (laptop.physical_stock <= 0) laptop.status = 'HABIS';
    }

    return res.status(201).json({
      success: true,
      message: 'Transaksi Barang Keluar berhasil diproses dan stok telah berkurang.',
      data: newTx
    });
  }
};

// GET /api/transactions (Riwayat)
const getTransactions = async (req, res) => {
  try {
    const { type, search, start_date, end_date, page = 1, limit = 10 } = req.query;

    if (isMysqlOnline()) {
      const offset = (parseInt(page) - 1) * parseInt(limit);

      let query = `SELECT t.* FROM transactions t WHERE 1=1`;
      const params = [];

      if (type) {
        query += ` AND t.type = ?`;
        params.push(type);
      }
      if (search) {
        query += ` AND (t.transaction_code LIKE ? OR t.source_destination LIKE ? OR t.notes LIKE ?)`;
        params.push(`%${search}%`, `%${search}%`, `%${search}%`);
      }
      if (start_date) {
        query += ` AND DATE(t.transaction_date) >= ?`;
        params.push(start_date);
      }
      if (end_date) {
        query += ` AND DATE(t.transaction_date) <= ?`;
        params.push(end_date);
      }

      const countQuery = `SELECT COUNT(*) as total FROM (${query}) as sub`;
      const [countRows] = await pool.query(countQuery, params);
      const totalItems = countRows[0].total;

      query += ` ORDER BY t.transaction_date DESC LIMIT ? OFFSET ?`;
      params.push(parseInt(limit), parseInt(offset));

      const [transactions] = await pool.query(query, params);

      for (const tx of transactions) {
        const [details] = await pool.query(
          `SELECT td.*, l.name as laptop_name, l.code as laptop_code, b.name as brand_name
           FROM transaction_details td
           JOIN laptops l ON td.laptop_id = l.id
           JOIN brands b ON l.brand_id = b.id
           WHERE td.transaction_id = ?`,
          [tx.id]
        );
        tx.items = details;
      }

      return res.json({
        success: true,
        data: transactions,
        pagination: {
          total_items: totalItems,
          total_pages: Math.ceil(totalItems / limit),
          current_page: parseInt(page),
          limit: parseInt(limit)
        }
      });
    } else {
      let filtered = [...mockDb.transactions];

      if (type) {
        filtered = filtered.filter(t => t.type === type);
      }
      if (search) {
        const s = search.toLowerCase();
        filtered = filtered.filter(t => 
          t.transaction_code.toLowerCase().includes(s) ||
          (t.source_destination && t.source_destination.toLowerCase().includes(s))
        );
      }

      filtered.sort((a, b) => new Date(b.transaction_date) - new Date(a.transaction_date));

      const populated = filtered.map(tx => {
        const details = mockDb.transaction_details.filter(td => td.transaction_id === tx.id).map(td => {
          const l = mockDb.laptops.find(x => x.id === td.laptop_id);
          const b = l ? mockDb.brands.find(br => br.id === l.brand_id) : null;
          return {
            ...td,
            laptop_name: l?.name || 'Laptop',
            laptop_code: l?.code || 'SKU',
            brand_name: b?.name || 'Brand'
          };
        });
        return {
          ...tx,
          items: details
        };
      });

      return res.json({
        success: true,
        data: populated,
        pagination: {
          total_items: populated.length,
          total_pages: 1,
          current_page: 1,
          limit: 20
        }
      });
    }
  } catch (error) {
    console.error('Get transactions error:', error);
    return res.status(500).json({ success: false, message: 'Gagal mengambil riwayat transaksi.' });
  }
};

// GET /api/transactions/:id
const getTransactionDetail = async (req, res) => {
  try {
    const { id } = req.params;

    if (isMysqlOnline()) {
      const [rows] = await pool.query('SELECT * FROM transactions WHERE id = ?', [id]);
      if (rows.length === 0) {
        return res.status(404).json({ success: false, message: 'Transaksi tidak ditemukan.' });
      }

      const [details] = await pool.query(
        `SELECT td.*, l.name as laptop_name, l.code as laptop_code, b.name as brand_name
         FROM transaction_details td
         JOIN laptops l ON td.laptop_id = l.id
         JOIN brands b ON l.brand_id = b.id
         WHERE td.transaction_id = ?`,
        [id]
      );

      return res.json({
        success: true,
        data: {
          ...rows[0],
          items: details
        }
      });
    } else {
      const tx = mockDb.transactions.find(t => t.id === parseInt(id));
      if (!tx) {
        return res.status(404).json({ success: false, message: 'Transaksi tidak ditemukan.' });
      }
      const details = mockDb.transaction_details.filter(td => td.transaction_id === tx.id).map(td => {
        const l = mockDb.laptops.find(x => x.id === td.laptop_id);
        const b = l ? mockDb.brands.find(br => br.id === l.brand_id) : null;
        return {
          ...td,
          laptop_name: l?.name || 'Laptop',
          laptop_code: l?.code || 'SKU',
          brand_name: b?.name || 'Brand'
        };
      });

      return res.json({
        success: true,
        data: {
          ...tx,
          items: details
        }
      });
    }
  } catch (error) {
    console.error('Get transaction detail error:', error);
    return res.status(500).json({ success: false, message: 'Gagal mengambil detail transaksi.' });
  }
};

// DELETE /api/transactions/:id
const deleteTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const { revert_stock = 'false' } = req.query;

    if (isMysqlOnline()) {
      const connection = await pool.getConnection();
      try {
        await connection.beginTransaction();

        const [rows] = await connection.query('SELECT * FROM transactions WHERE id = ?', [id]);
        if (rows.length === 0) {
          await connection.rollback();
          return res.status(404).json({ success: false, message: 'Transaksi tidak ditemukan.' });
        }
        const tx = rows[0];

        // If revert_stock is requested, adjust laptop stock accordingly
        if (revert_stock === 'true' || revert_stock === true) {
          const [details] = await connection.query('SELECT laptop_id, quantity FROM transaction_details WHERE transaction_id = ?', [id]);
          for (const item of details) {
            if (tx.type === 'MASUK') {
              // Revert stock in by deducting
              await connection.query(
                `UPDATE laptops SET physical_stock = GREATEST(0, physical_stock - ?) WHERE id = ?`,
                [item.quantity, item.laptop_id]
              );
            } else if (tx.type === 'KELUAR') {
              // Revert stock out by adding back
              await connection.query(
                `UPDATE laptops SET physical_stock = physical_stock + ?, status = 'TERSEDIA' WHERE id = ?`,
                [item.quantity, item.laptop_id]
              );
            }
          }
        }

        // Delete child rows first
        await connection.query('DELETE FROM transaction_details WHERE transaction_id = ?', [id]);
        // Delete transaction header
        await connection.query('DELETE FROM transactions WHERE id = ?', [id]);

        await connection.commit();

        return res.json({
          success: true,
          message: `Transaksi ${tx.transaction_code} berhasil dihapus.`
        });
      } catch (err) {
        await connection.rollback();
        console.error('Delete transaction error:', err);
        return res.status(500).json({ success: false, message: 'Gagal menghapus transaksi.' });
      } finally {
        connection.release();
      }
    } else {
      const txIndex = mockDb.transactions.findIndex(t => t.id === parseInt(id));
      if (txIndex === -1) {
        return res.status(404).json({ success: false, message: 'Transaksi tidak ditemukan.' });
      }
      const tx = mockDb.transactions[txIndex];

      if (revert_stock === 'true' || revert_stock === true) {
        const details = mockDb.transaction_details.filter(td => td.transaction_id === tx.id);
        for (const item of details) {
          const laptop = mockDb.laptops.find(l => l.id === item.laptop_id);
          if (laptop) {
            if (tx.type === 'MASUK') {
              laptop.physical_stock = Math.max(0, laptop.physical_stock - item.quantity);
            } else if (tx.type === 'KELUAR') {
              laptop.physical_stock += item.quantity;
              laptop.status = 'TERSEDIA';
            }
          }
        }
      }

      mockDb.transaction_details = mockDb.transaction_details.filter(td => td.transaction_id !== tx.id);
      mockDb.transactions.splice(txIndex, 1);

      return res.json({
        success: true,
        message: `Transaksi ${tx.transaction_code} berhasil dihapus.`
      });
    }
  } catch (error) {
    console.error('Delete transaction error:', error);
    return res.status(500).json({ success: false, message: 'Gagal menghapus transaksi.' });
  }
};

module.exports = {
  createBarangMasuk,
  createBarangKeluar,
  getTransactions,
  getTransactionDetail
  getTransactionDetail,
  deleteTransaction
};
