const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
require('dotenv').config();

let isMysqlOnline = false;
let checkConnectionPromise = null;

const pool = mysql.createPool({
const poolConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306'),
  port: parseInt(process.env.DB_PORT || '3306', 10),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'dhafi_inventaris',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  dateStrings: true
});
};

// Enable SSL with rejectUnauthorized: false when connecting to remote hosts (such as Railway TCP proxy)
if (process.env.DB_SSL === 'true' || (process.env.DB_HOST && process.env.DB_HOST !== 'localhost' && process.env.DB_HOST !== '127.0.0.1')) {
  poolConfig.ssl = {
    rejectUnauthorized: false
  };
}

const pool = mysql.createPool(poolConfig);

// Asynchronous connection checker without altering database or executing DDL schema changes
async function checkDbConnection() {
  try {
    const conn = await pool.getConnection();
    await conn.query('SELECT 1');
    conn.release();
    isMysqlOnline = true;
    console.log(`✅ Terhubung ke database MySQL: ${poolConfig.database}`);
    return true;
  } catch (err) {
    isMysqlOnline = false;
    console.warn(`⚠️ MySQL offline / tidak dapat terhubung (${err.message}). Menggunakan In-Memory Resilience Mode.`);
    return false;
  }
}

function ensureDbConnected() {
  if (!checkConnectionPromise) {
    checkConnectionPromise = checkDbConnection();
  }
  return checkConnectionPromise;
}

// Inisialisasi pengecekan koneksi saat modul pertama kali di-load
ensureDbConnected();

// In-memory fallback dataset for seamless offline / development testing
const mockDb = {
  users: [
    {
      id: 1,
      username: 'admin',
      password_hash: '$2b$10$X860x4Q4B1Kz7K2XmJ4v2e7u1y5E4v7d2Z3X4Y5Z6W7V8U9T0S1R2', // admin123
      name: 'Admin Dhafi Komputer'
    }
  ],
  brands: [
    { id: 1, code: 'BRD-ACR', name: 'Acer', description: 'Merek laptop Acer', logo_url: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=300', status: 'AKTIF', laptop_count: 12 },
    { id: 2, code: 'BRD-AAPL', name: 'Apple', description: 'Merek laptop Apple', logo_url: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=300', status: 'AKTIF', laptop_count: 18 },
    { id: 3, code: 'BRD-ASUS', name: 'ASUS', description: 'Merek laptop ASUS', logo_url: 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=300', status: 'AKTIF', laptop_count: 45 },
    { id: 4, code: 'BRD-DELL', name: 'Dell', description: 'Merek laptop Dell', logo_url: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=300', status: 'AKTIF', laptop_count: 32 },
    { id: 5, code: 'BRD-HP', name: 'HP', description: 'Merek laptop HP', logo_url: 'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=300', status: 'AKTIF', laptop_count: 28 },
    { id: 6, code: 'BRD-LNV', name: 'Lenovo', description: 'Merek laptop Lenovo', logo_url: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=300', status: 'AKTIF', laptop_count: 22 },
    { id: 7, code: 'BRD-MSI', name: 'MSI', description: 'Merek laptop MSI', logo_url: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=300', status: 'AKTIF', laptop_count: 17 }
  ],
  categories: [
    { id: 1, code: 'CTG-CNS', name: 'Consumer / Harian', description: 'Laptop harian, tugas sekolah, dan kerja kantor ringan' },
    { id: 2, code: 'CTG-GAM', name: 'Gaming & Performa', description: 'Laptop dengan kartu grafis terpisah untuk gaming dan editing' },
    { id: 3, code: 'CTG-BUS', name: 'Business / Enterprise', description: 'Laptop dengan durabilitas tinggi dan fitur keamanan bisnis' },
    { id: 4, code: 'CTG-ULT', name: 'Ultrabook & Tipis', description: 'Laptop ringan, tipis, premium dengan daya tahan baterai panjang' }
  ],
  master_dealers: [
    { id: 1, code: 'MD-001', name: 'MD 1 (Master Dealer Utama)', contact: '081234567890', address: 'Jalan Master Supplier No. 1, Jakarta', status: 'AKTIF', notes: 'Supplier Laptop Baru All Brand' },
    { id: 2, code: 'MD-002', name: 'MD 2 (Master Dealer Partner)', contact: '081298765432', address: 'Jalan Master Supplier No. 2, Bandung', status: 'AKTIF', notes: 'Supplier Laptop Baru All Brand' },
    { id: 3, code: 'MD-003', name: 'MD 3 (Master Dealer Regional)', contact: '081311223344', address: 'Jalan Master Supplier No. 3, Surabaya', status: 'AKTIF', notes: 'Supplier Laptop Baru All Brand' }
  ],
  dealers: [
    { id: 1, code: 'DLR-001', name: 'Toko Laptop Bandung Computer', contact: '085712341234', address: 'BEC Lt. 2 Bandung', status: 'AKTIF', notes: 'Toko Partner Laptop Second' },
    { id: 2, code: 'DLR-002', name: 'Cimahi Laptop Center', contact: '085899887766', address: 'Jl. Raya Cimahi No. 45', status: 'AKTIF', notes: 'Toko Partner Laptop Second' },
    { id: 3, code: 'DLR-003', name: 'Bintang Komputer Trade-in', contact: '081900112233', address: 'Jl. Merdeka No. 88 Bandung', status: 'AKTIF', notes: 'Toko Partner Laptop Second' }
  ],
  laptops: [
    {
      id: 1,
      code: 'LPT-ASUS-001',
      name: 'ASUS Vivobook 14 A1404ZA',
      brand_id: 1,
      category_id: 1,
      condition_type: 'BARU',
      source_type: 'MASTER_DEALER',
      master_dealer_id: 1,
      dealer_id: null,
      customer_name: null,
      customer_contact: null,
      customer_notes: null,
      processor: 'Intel Core i3-1215U',
      ram: '8GB DDR4',
      storage: '512GB NVMe SSD',
      gpu: 'Intel UHD Graphics',
      screen_size: '14.0 FHD',
      panel_type: 'IPS-Level',
      operating_system: 'Windows 11 Home',
      color: 'Quiet Blue',
      weight: '1.4 kg',
      release_year: '2023',
      warranty: '2 Tahun Garansi Resmi',
      serial_number: 'SN-ASUS-1001',
      condition_notes: null,
      purchase_price: 6200000.00,
      selling_price: 6899000.00,
      display_stock: 1,
      physical_stock: 3,
      status: 'TERSEDIA',
      description: 'Laptop harian tipis dan bertenaga Intel Core Gen 12',
      primary_image: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=600',
      created_at: new Date().toISOString()
    },
    {
      id: 2,
      code: 'LPT-LNV-002',
      name: 'Lenovo IdeaPad Gaming 3 15ARH7',
      brand_id: 2,
      category_id: 2,
      condition_type: 'BARU',
      source_type: 'MASTER_DEALER',
      master_dealer_id: 2,
      dealer_id: null,
      customer_name: null,
      customer_contact: null,
      customer_notes: null,
      processor: 'AMD Ryzen 5 6600H',
      ram: '16GB DDR5',
      storage: '512GB NVMe SSD',
      gpu: 'NVIDIA RTX 3050 4GB',
      screen_size: '15.6 FHD 120Hz',
      panel_type: 'IPS 120Hz',
      operating_system: 'Windows 11 Home',
      color: 'Onyx Grey',
      weight: '2.2 kg',
      release_year: '2023',
      warranty: '2 Tahun ADP Garansi Resmi',
      serial_number: 'SN-LNV-2002',
      condition_notes: null,
      purchase_price: 10500000.00,
      selling_price: 11499000.00,
      display_stock: 1,
      physical_stock: 2,
      status: 'TERSEDIA',
      description: 'Laptop gaming andal dengan Ryzen 6000 series dan RTX graphics',
      primary_image: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=600',
      created_at: new Date().toISOString()
    },
    {
      id: 3,
      code: 'LPT-AAPL-003',
      name: 'MacBook Air M1 2020 Second Mulus',
      brand_id: 7,
      category_id: 4,
      condition_type: 'SECOND',
      source_type: 'DEALER',
      master_dealer_id: null,
      dealer_id: 1,
      customer_name: null,
      customer_contact: null,
      customer_notes: null,
      processor: 'Apple M1 Chip (8-Core CPU)',
      ram: '8GB Unified RAM',
      storage: '256GB SSD',
      gpu: '7-Core GPU',
      screen_size: '13.3 Retina Display',
      panel_type: 'Retina IPS True Tone',
      operating_system: 'macOS Sonoma',
      color: 'Space Grey',
      weight: '1.29 kg',
      release_year: '2020',
      warranty: 'Garansi Toko 1 Bulan',
      serial_number: 'SN-AAPL-3003',
      condition_notes: 'Kondisi 95% mulus, battery health 88%, kelengkapan charger original',
      purchase_price: 7500000.00,
      selling_price: 8450000.00,
      display_stock: 1,
      physical_stock: 1,
      status: 'TERSEDIA',
      description: 'MacBook Air M1 second kondisi istimewa siap pakai',
      primary_image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600',
      created_at: new Date().toISOString()
    },
    {
      id: 4,
      code: 'LPT-DELL-004',
      name: 'Dell Latitude 5400 Second',
      brand_id: 6,
      category_id: 3,
      condition_type: 'SECOND',
      source_type: 'CUSTOMER',
      master_dealer_id: null,
      dealer_id: null,
      customer_name: 'Bpk. Ahmad Suhendar',
      customer_contact: '08122334455',
      customer_notes: 'Buyback dari perorangan, dus tidak ada',
      processor: 'Intel Core i5-8365U',
      ram: '16GB DDR4',
      storage: '256GB SSD',
      gpu: 'Intel UHD 620',
      screen_size: '14.0 FHD IPS',
      panel_type: 'IPS Anti-Glare',
      operating_system: 'Windows 10 Pro',
      color: 'Black',
      weight: '1.52 kg',
      release_year: '2019',
      warranty: 'Garansi Toko 2 Minggu',
      serial_number: 'SN-DELL-4004',
      condition_notes: 'Body 90% lecet pemakaian wajar, layar jernih tanpa deadpixel, keyboard empuk',
      purchase_price: 3400000.00,
      selling_price: 3950000.00,
      display_stock: 0,
      physical_stock: 2,
      status: 'TERSEDIA',
      description: 'Laptop bisnis legendaris bodi tangguh dan keyboard nyaman',
      primary_image: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=600',
      created_at: new Date().toISOString()
    },
    {
      id: 5,
      code: 'LPT-TEST-0043',
      name: 'ASUS Zenbook S 13 OLED (Updated Edition)',
      brand_id: 1,
      category_id: 4,
      condition_type: 'BARU',
      source_type: 'MASTER_DEALER',
      master_dealer_id: 1,
      dealer_id: null,
      customer_name: null,
      customer_contact: null,
      customer_notes: null,
      processor: 'Intel Core i7-13650HX',
      ram: '16 GB DDR5',
      storage: '1 TB NVMe SSD',
      gpu: 'NVIDIA GeForce RTX 4060 8GB',
      screen_size: '14 Inch',
      panel_type: 'OLED',
      operating_system: 'Windows 11 Home',
      color: 'Silver',
      weight: '1.2 Kg',
      release_year: '2024',
      warranty: 'Resmi 2 Tahun',
      serial_number: 'SN-ASUS-5005',
      condition_notes: null,
      purchase_price: 18000000.00,
      selling_price: 21999000.00,
      display_stock: 1,
      physical_stock: 5,
      status: 'TERSEDIA',
      description: 'Laptop untuk display toko dan penjualan.',
      primary_image: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=600',
      created_at: new Date().toISOString()
    }
  ],
  transactions: [
    {
      id: 1,
      transaction_code: 'TRX-IN-001001',
      type: 'MASUK',
      transaction_date: new Date(Date.now() - 86400000 * 2).toISOString(),
      source_destination: 'Pengadaan Master Dealer MD 1',
      notes: 'Pengadaan awal stok laptop ASUS baru',
      total_quantity: 3,
      total_amount: 18600000.00
    },
    {
      id: 2,
      transaction_code: 'TRX-OUT-002002',
      type: 'KELUAR',
      transaction_date: new Date(Date.now() - 86400000).toISOString(),
      source_destination: 'Penjualan Toko Walk-in',
      notes: 'Penjualan laptop ASUS Vivobook 1 unit',
      total_quantity: 1,
      total_amount: 6899000.00
    }
  ],
  transaction_details: [
    { id: 1, transaction_id: 1, laptop_id: 1, quantity: 3, unit_price: 6200000.00, subtotal: 18600000.00 },
    { id: 2, transaction_id: 2, laptop_id: 1, quantity: 1, unit_price: 6899000.00, subtotal: 6899000.00 }
  ]
};

// Auto initialize database & tables if MySQL is running
// Auto initialize database & tables if MySQL is running (untuk setup lokal)
async function initDb() {
  try {
    const rootConn = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '3306'),
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || ''
    });
    // Coba create database jika di localhost
    if (!process.env.DB_HOST || process.env.DB_HOST === 'localhost' || process.env.DB_HOST === '127.0.0.1') {
      try {
        const rootConn = await mysql.createConnection({
          host: process.env.DB_HOST || 'localhost',
          port: parseInt(process.env.DB_PORT || '3306', 10),
          user: process.env.DB_USER || 'root',
          password: process.env.DB_PASSWORD || ''
        });

    await rootConn.query(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME || 'dhafi_inventaris'}\` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`);
    await rootConn.end();
        await rootConn.query(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME || 'dhafi_inventaris'}\` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`);
        await rootConn.end();
      } catch (rootErr) {
        // Abaikan jika tidak memiliki izin create database di remote host
      }
    }

    const conn = await pool.getConnection();

    // Users
    await conn.query(`
      CREATE TABLE IF NOT EXISTS \`users\` (
        \`id\` INT AUTO_INCREMENT PRIMARY KEY,
        \`username\` VARCHAR(50) NOT NULL UNIQUE,
        \`password_hash\` VARCHAR(255) NOT NULL,
        \`name\` VARCHAR(100) NOT NULL DEFAULT 'Admin Dhafi Komputer',
        \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        \`updated_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // Brands
    await conn.query(`
      CREATE TABLE IF NOT EXISTS \`brands\` (
        \`id\` INT AUTO_INCREMENT PRIMARY KEY,
        \`code\` VARCHAR(20) NOT NULL UNIQUE,
        \`name\` VARCHAR(50) NOT NULL UNIQUE,
        \`description\` TEXT NULL,
        \`logo_url\` LONGTEXT NULL,
        \`status\` ENUM('AKTIF', 'NONAKTIF') DEFAULT 'AKTIF',
        \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        \`updated_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // Categories
    await conn.query(`
      CREATE TABLE IF NOT EXISTS \`categories\` (
        \`id\` INT AUTO_INCREMENT PRIMARY KEY,
        \`code\` VARCHAR(20) NOT NULL UNIQUE,
        \`name\` VARCHAR(50) NOT NULL UNIQUE,
        \`description\` TEXT NULL,
        \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        \`updated_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // Master Dealers
    await conn.query(`
      CREATE TABLE IF NOT EXISTS \`master_dealers\` (
        \`id\` INT AUTO_INCREMENT PRIMARY KEY,
        \`code\` VARCHAR(20) NOT NULL UNIQUE,
        \`name\` VARCHAR(100) NOT NULL,
        \`contact\` VARCHAR(50) NULL,
        \`address\` TEXT NULL,
        \`status\` ENUM('AKTIF', 'NONAKTIF') DEFAULT 'AKTIF',
        \`notes\` TEXT NULL,
        \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        \`updated_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // Dealers
    await conn.query(`
      CREATE TABLE IF NOT EXISTS \`dealers\` (
        \`id\` INT AUTO_INCREMENT PRIMARY KEY,
        \`code\` VARCHAR(20) NOT NULL UNIQUE,
        \`name\` VARCHAR(100) NOT NULL,
        \`contact\` VARCHAR(50) NULL,
        \`address\` TEXT NULL,
        \`status\` ENUM('AKTIF', 'NONAKTIF') DEFAULT 'AKTIF',
        \`notes\` TEXT NULL,
        \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        \`updated_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // Laptops
    await conn.query(`
      CREATE TABLE IF NOT EXISTS \`laptops\` (
        \`id\` INT AUTO_INCREMENT PRIMARY KEY,
        \`code\` VARCHAR(50) NOT NULL UNIQUE,
        \`name\` VARCHAR(150) NOT NULL,
        \`brand_id\` INT NOT NULL,
        \`category_id\` INT NOT NULL,
        \`condition_type\` ENUM('BARU', 'SECOND') NOT NULL,
        \`source_type\` ENUM('MASTER_DEALER', 'DEALER', 'CUSTOMER') NOT NULL,
        \`master_dealer_id\` INT NULL,
        \`dealer_id\` INT NULL,
        \`customer_name\` VARCHAR(100) NULL,
        \`customer_contact\` VARCHAR(50) NULL,
        \`customer_notes\` TEXT NULL,
        \`processor\` VARCHAR(100) NULL,
        \`ram\` VARCHAR(50) NULL,
        \`storage\` VARCHAR(100) NULL,
        \`gpu\` VARCHAR(100) NULL,
        \`screen_size\` VARCHAR(50) NULL,
        \`operating_system\` VARCHAR(50) NULL,
        \`color\` VARCHAR(50) NULL,
        \`weight\` VARCHAR(50) NULL,
        \`release_year\` VARCHAR(10) NULL,
        \`warranty\` VARCHAR(100) NULL,
        \`serial_number\` VARCHAR(100) NULL,
        \`condition_notes\` TEXT NULL,
        \`purchase_price\` DECIMAL(15,2) DEFAULT 0.00,
        \`selling_price\` DECIMAL(15,2) NOT NULL DEFAULT 0.00,
        \`display_stock\` INT NOT NULL DEFAULT 0,
        \`physical_stock\` INT NOT NULL DEFAULT 0,
        \`status\` ENUM('TERSEDIA', 'HABIS', 'DISPLAY', 'TERJUAL', 'TIDAK_AKTIF', 'DRAFT') DEFAULT 'TERSEDIA',
        \`description\` TEXT NULL,
        \`primary_image\` LONGTEXT NULL,
        \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        \`updated_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (\`brand_id\`) REFERENCES \`brands\`(\`id\`) ON DELETE RESTRICT,
        FOREIGN KEY (\`category_id\`) REFERENCES \`categories\`(\`id\`) ON DELETE RESTRICT,
        FOREIGN KEY (\`master_dealer_id\`) REFERENCES \`master_dealers\`(\`id\`) ON DELETE SET NULL,
        FOREIGN KEY (\`dealer_id\`) REFERENCES \`dealers\`(\`id\`) ON DELETE SET NULL
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // Ensure brands columns exist if table was previously created
    try {
      await conn.query('ALTER TABLE `brands` ADD COLUMN `description` TEXT NULL AFTER `name`');
    } catch (e) { /* ignore if already exists */ }
    try {
      await conn.query('ALTER TABLE `brands` ADD COLUMN `status` ENUM(\'AKTIF\', \'NONAKTIF\') DEFAULT \'AKTIF\' AFTER `logo_url`');
    } catch (e) { /* ignore if already exists */ }
    try {
      await conn.query('ALTER TABLE `brands` MODIFY COLUMN `logo_url` LONGTEXT NULL');
    } catch (e) { /* ignore if already exists */ }

    // Ensure panel_type, weight, and expanded status exist if table was previously created
    try {
      await conn.query('ALTER TABLE `laptops` ADD COLUMN `panel_type` VARCHAR(50) NULL AFTER `screen_size`');
    } catch (e) { /* ignore if already exists */ }
    try {
      await conn.query('ALTER TABLE `laptops` ADD COLUMN `weight` VARCHAR(50) NULL AFTER `color`');
    } catch (e) { /* ignore if already exists */ }
    try {
      await conn.query("ALTER TABLE `laptops` MODIFY COLUMN `status` ENUM('TERSEDIA', 'HABIS', 'DISPLAY', 'TERJUAL', 'TIDAK_AKTIF', 'DRAFT') DEFAULT 'TERSEDIA'");
    } catch (e) { /* ignore if already exists */ }
    try {
      await conn.query('ALTER TABLE `laptops` MODIFY COLUMN `primary_image` LONGTEXT NULL');
    } catch (e) { /* ignore if already exists */ }

    // Laptop Images
    await conn.query(`
      CREATE TABLE IF NOT EXISTS \`laptop_images\` (
        \`id\` INT AUTO_INCREMENT PRIMARY KEY,
        \`laptop_id\` INT NOT NULL,
        \`image_url\` LONGTEXT NOT NULL,
        \`is_primary\` TINYINT(1) DEFAULT 0,
        \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (\`laptop_id\`) REFERENCES \`laptops\`(\`id\`) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);
    try {
      await conn.query('ALTER TABLE `laptop_images` MODIFY COLUMN `image_url` LONGTEXT NOT NULL');
    } catch (e) { /* ignore if already exists */ }

    // Transactions
    await conn.query(`
      CREATE TABLE IF NOT EXISTS \`transactions\` (
        \`id\` INT AUTO_INCREMENT PRIMARY KEY,
        \`user_id\` INT NULL,
        \`transaction_code\` VARCHAR(50) NOT NULL UNIQUE,
        \`type\` ENUM('MASUK', 'KELUAR') NOT NULL,
        \`transaction_date\` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        \`source_destination\` VARCHAR(150) NULL,
        \`notes\` TEXT NULL,
        \`total_quantity\` INT NOT NULL DEFAULT 0,
        \`total_amount\` DECIMAL(15,2) NOT NULL DEFAULT 0.00,
        \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        \`updated_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE SET NULL
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);
    try {
      await conn.query('ALTER TABLE `transactions` ADD COLUMN `user_id` INT NULL AFTER `id`');
    } catch (e) { /* ignore if already exists */ }

    // Transaction Details
    await conn.query(`
      CREATE TABLE IF NOT EXISTS \`transaction_details\` (
        \`id\` INT AUTO_INCREMENT PRIMARY KEY,
        \`transaction_id\` INT NOT NULL,
        \`laptop_id\` INT NOT NULL,
        \`quantity\` INT NOT NULL,
        \`unit_price\` DECIMAL(15,2) NOT NULL DEFAULT 0.00,
        \`subtotal\` DECIMAL(15,2) NOT NULL DEFAULT 0.00,
        FOREIGN KEY (\`transaction_id\`) REFERENCES \`transactions\`(\`id\`) ON DELETE CASCADE,
        FOREIGN KEY (\`laptop_id\`) REFERENCES \`laptops\`(\`id\`) ON DELETE RESTRICT
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // Note: Auto-seeding has been disabled. Seeding should be executed manually via database/seed.sql.

    conn.release();
    isMysqlOnline = true;
    console.log('✅ MySQL Database connection and schema initialized.');
  } catch (err) {
    isMysqlOnline = false;
    console.warn('⚠️ MySQL offline or connection refused. Switched to In-Memory Resilience Mode.');
  }
}

module.exports = {
  pool,
  initDb,
  mockDb,
  isMysqlOnline: () => isMysqlOnline
  isMysqlOnline: () => isMysqlOnline,
  ensureDbConnected
};
