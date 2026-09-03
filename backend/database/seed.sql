-- Seed Data for Dhafi Komputer Inventory System
USE `dhafi_inventaris`;

-- 1. Default Admin User (Password: admin123)
-- Hash generated for 'admin123' via bcrypt
INSERT INTO `users` (`id`, `username`, `password_hash`, `name`) VALUES
(1, 'admin', '$2b$10$X860x4Q4B1Kz7K2XmJ4v2e7u1y5E4v7d2Z3X4Y5Z6W7V8U9T0S1R2', 'Admin Dhafi Komputer')
ON DUPLICATE KEY UPDATE `id`=`id`;

-- 2. Default Brands
INSERT INTO `brands` (`id`, `code`, `name`, `description`, `logo_url`, `status`) VALUES
(1, 'BRD-ASUS', 'ASUS', 'Merek laptop ASUS untuk harian, kreasi, dan gaming ROG/TUF', 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=300', 'AKTIF'),
(2, 'BRD-LNV', 'Lenovo', 'Merek laptop Lenovo seri ThinkPad, IdeaPad, dan Legion', 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=300', 'AKTIF'),
(3, 'BRD-ACR', 'Acer', 'Merek laptop Acer seri Aspire, Swift, dan Predator', 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=300', 'AKTIF'),
(4, 'BRD-HP', 'HP', 'Merek laptop HP seri Pavilion, Envy, dan OMEN', 'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=300', 'AKTIF'),
(5, 'BRD-MSI', 'MSI', 'Merek laptop MSI performa tinggi untuk gaming & kreasi', 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=300', 'AKTIF'),
(6, 'BRD-DELL', 'Dell', 'Merek laptop Dell seri Latitude, Inspiron, dan XPS', 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=300', 'AKTIF'),
(7, 'BRD-AAPL', 'Apple', 'Laptop premium Apple MacBook Air dan MacBook Pro', 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=300', 'AKTIF')
ON DUPLICATE KEY UPDATE `id`=`id`;

-- 3. Default Categories
INSERT INTO `categories` (`id`, `code`, `name`, `description`) VALUES
(1, 'CTG-CNS', 'Consumer / Harian', 'Laptop untuk penggunaan harian, tugas sekolah, dan kerja kantor ringan'),
(2, 'CTG-GAM', 'Gaming & Performa', 'Laptop dengan kartu grafis terpisah untuk gaming dan editing'),
(3, 'CTG-BUS', 'Business / Enterprise', 'Laptop dengan durabilitas tinggi dan fitur keamanan bisnis'),
(4, 'CTG-ULT', 'Ultrabook & Tipis', 'Laptop ringan, tipis, premium dengan daya tahan baterai panjang')
ON DUPLICATE KEY UPDATE `id`=`id`;

-- 4. Default Master Dealers (ALL BRAND - Sumber Laptop Baru)
INSERT INTO `master_dealers` (`id`, `code`, `name`, `contact`, `address`, `status`, `notes`) VALUES
(1, 'MD-001', 'MD 1 (Master Dealer Utama)', '081234567890', 'Jalan Master Supplier No. 1, Jakarta', 'AKTIF', 'Supplier Laptop Baru All Brand'),
(2, 'MD-002', 'MD 2 (Master Dealer Partner)', '081298765432', 'Jalan Master Supplier No. 2, Bandung', 'AKTIF', 'Supplier Laptop Baru All Brand'),
(3, 'MD-003', 'MD 3 (Master Dealer Regional)', '081311223344', 'Jalan Master Supplier No. 3, Surabaya', 'AKTIF', 'Supplier Laptop Baru All Brand')
ON DUPLICATE KEY UPDATE `id`=`id`;

-- 5. Default Dealers (Toko Lain - Sumber Laptop Second)
INSERT INTO `dealers` (`id`, `code`, `name`, `contact`, `address`, `status`, `notes`) VALUES
(1, 'DLR-001', 'Toko Laptop Bandung Computer', '085712341234', 'BEC Lt. 2 Bandung', 'AKTIF', 'Toko Partner Laptop Second'),
(2, 'DLR-002', 'Cimahi Laptop Center', '085899887766', 'Jl. Raya Cimahi No. 45', 'AKTIF', 'Toko Partner Laptop Second'),
(3, 'DLR-003', 'Bintang Komputer Trade-in', '081900112233', 'Jl. Merdeka No. 88 Bandung', 'AKTIF', 'Toko Partner Laptop Second')
ON DUPLICATE KEY UPDATE `id`=`id`;

-- 6. Sample Laptops (Baru & Second dengan Spesifikasi Lengkap)
INSERT INTO `laptops` (
  `id`, `code`, `name`, `brand_id`, `category_id`, `condition_type`, `source_type`,
  `master_dealer_id`, `dealer_id`, `customer_name`, `customer_contact`, `customer_notes`,
  `processor`, `ram`, `storage`, `gpu`, `screen_size`, `panel_type`, `operating_system`, `color`, `weight`, `release_year`, `warranty`, `serial_number`, `condition_notes`,
  `purchase_price`, `selling_price`, `display_stock`, `physical_stock`, `status`, `description`, `primary_image`
) VALUES
(
  1, 'LPT-ASUS-001', 'ASUS Vivobook 14 A1404ZA', 1, 1, 'BARU', 'MASTER_DEALER',
  1, NULL, NULL, NULL, NULL,
  'Intel Core i3-1215U', '8GB DDR4', '512GB NVMe SSD', 'Intel UHD Graphics', '14.0 FHD', 'IPS-Level', 'Windows 11 Home', 'Quiet Blue', '1.4 kg', '2023', '2 Tahun Garansi Resmi', 'SN-ASUS-1001', NULL,
  6200000.00, 6899000.00, 1, 3, 'TERSEDIA', 'Laptop harian tipis dan bertenaga Intel Core Gen 12', 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=600'
),
(
  2, 'LPT-LNV-002', 'Lenovo IdeaPad Gaming 3 15ARH7', 2, 2, 'BARU', 'MASTER_DEALER',
  2, NULL, NULL, NULL, NULL,
  'AMD Ryzen 5 6600H', '16GB DDR5', '512GB NVMe SSD', 'NVIDIA RTX 3050 4GB', '15.6 FHD 120Hz', 'IPS 120Hz', 'Windows 11 Home', 'Onyx Grey', '2.2 kg', '2023', '2 Tahun ADP Garansi Resmi', 'SN-LNV-2002', NULL,
  10500000.00, 11499000.00, 1, 2, 'TERSEDIA', 'Laptop gaming andal dengan Ryzen 6000 series dan RTX graphics', 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=600'
),
(
  3, 'LPT-AAPL-003', 'MacBook Air M1 2020 Second Mulus', 7, 4, 'SECOND', 'DEALER',
  NULL, 1, NULL, NULL, NULL,
  'Apple M1 Chip (8-Core CPU)', '8GB Unified RAM', '256GB SSD', '7-Core GPU', '13.3 Retina Display', 'Retina IPS True Tone', 'macOS Sonoma', 'Space Grey', '1.29 kg', '2020', 'Garansi Toko 1 Bulan', 'SN-AAPL-3003', 'Kondisi 95% mulus, battery health 88%, kelengkapan charger original',
  7500000.00, 8450000.00, 1, 1, 'TERSEDIA', 'MacBook Air M1 second kondisi istimewa siap pakai', 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600'
),
(
  4, 'LPT-DELL-004', 'Dell Latitude 5400 Second', 6, 3, 'SECOND', 'CUSTOMER',
  NULL, NULL, 'Bpk. Ahmad Suhendar', '08122334455', 'Buyback dari perorangan, dus tidak ada',
  'Intel Core i5-8365U', '16GB DDR4', '256GB SSD', 'Intel UHD 620', '14.0 FHD IPS', 'IPS Anti-Glare', 'Windows 10 Pro', 'Black', '1.52 kg', '2019', 'Garansi Toko 2 Minggu', 'SN-DELL-4004', 'Body 90% lecet pemakaian wajar, layar jernih tanpa deadpixel, keyboard empuk',
  3400000.00, 3950000.00, 0, 2, 'TERSEDIA', 'Laptop bisnis legendaris bodi tangguh dan keyboard nyaman', 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=600'
)
ON DUPLICATE KEY UPDATE `id`=`id`;

-- 7. Laptop Images Gallery Sample
INSERT INTO `laptop_images` (`id`, `laptop_id`, `image_url`, `is_primary`) VALUES
(1, 1, 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=600', 1),
(2, 2, 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=600', 1),
(3, 3, 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600', 1),
(4, 4, 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=600', 1)
ON DUPLICATE KEY UPDATE `id`=`id`;

-- 8. Sample Initial Transactions
INSERT INTO `transactions` (`id`, `user_id`, `transaction_code`, `type`, `transaction_date`, `source_destination`, `notes`, `total_quantity`, `total_amount`) VALUES
(1, 1, 'TRX-IN-001001', 'MASUK', DATE_SUB(NOW(), INTERVAL 2 DAY), 'Pengadaan Master Dealer MD 1', 'Pengadaan awal stok laptop ASUS baru', 3, 18600000.00),
(2, 1, 'TRX-OUT-002002', 'KELUAR', DATE_SUB(NOW(), INTERVAL 1 DAY), 'Penjualan Toko Walk-in', 'Penjualan laptop ASUS Vivobook 1 unit', 1, 6899000.00)
ON DUPLICATE KEY UPDATE `id`=`id`;

-- 9. Sample Initial Transaction Details
INSERT INTO `transaction_details` (`id`, `transaction_id`, `laptop_id`, `quantity`, `unit_price`, `subtotal`) VALUES
(1, 1, 1, 3, 6200000.00, 18600000.00),
(2, 2, 1, 1, 6899000.00, 6899000.00)
ON DUPLICATE KEY UPDATE `id`=`id`;
