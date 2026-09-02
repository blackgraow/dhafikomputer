-- Database Schema for Dhafi Komputer Inventory System
CREATE DATABASE IF NOT EXISTS `dhafi_inventaris` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `dhafi_inventaris`;

-- Users Table (Admin Authentication)
CREATE TABLE IF NOT EXISTS `users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `username` VARCHAR(50) NOT NULL UNIQUE,
  `password_hash` VARCHAR(255) NOT NULL,
  `name` VARCHAR(100) NOT NULL DEFAULT 'Admin Dhafi Komputer',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Brands Table (Merek Laptop)
CREATE TABLE IF NOT EXISTS `brands` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `code` VARCHAR(20) NOT NULL UNIQUE,
  `name` VARCHAR(50) NOT NULL UNIQUE,
  `logo_url` VARCHAR(255) NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Categories Table (Kategori Laptop)
CREATE TABLE IF NOT EXISTS `categories` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `code` VARCHAR(20) NOT NULL UNIQUE,
  `name` VARCHAR(50) NOT NULL UNIQUE,
  `description` TEXT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Master Dealers Table (Sumber Laptop Baru: MD 1, MD 2, MD 3 - All Brand)
CREATE TABLE IF NOT EXISTS `master_dealers` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `code` VARCHAR(20) NOT NULL UNIQUE,
  `name` VARCHAR(100) NOT NULL,
  `contact` VARCHAR(50) NULL,
  `address` TEXT NULL,
  `status` ENUM('AKTIF', 'NONAKTIF') DEFAULT 'AKTIF',
  `notes` TEXT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Dealers Table (Toko Lain - Sumber Laptop Second)
CREATE TABLE IF NOT EXISTS `dealers` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `code` VARCHAR(20) NOT NULL UNIQUE,
  `name` VARCHAR(100) NOT NULL,
  `contact` VARCHAR(50) NULL,
  `address` TEXT NULL,
  `status` ENUM('AKTIF', 'NONAKTIF') DEFAULT 'AKTIF',
  `notes` TEXT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Laptops Table (Main Inventory Table)
CREATE TABLE IF NOT EXISTS `laptops` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `code` VARCHAR(50) NOT NULL UNIQUE, -- Kode Laptop / SKU
  `name` VARCHAR(150) NOT NULL,
  `brand_id` INT NOT NULL,
  `category_id` INT NOT NULL,
  `condition_type` ENUM('BARU', 'SECOND') NOT NULL,
  `source_type` ENUM('MASTER_DEALER', 'DEALER', 'CUSTOMER') NOT NULL,
  `master_dealer_id` INT NULL,
  `dealer_id` INT NULL,
  `customer_name` VARCHAR(100) NULL,
  `customer_contact` VARCHAR(50) NULL,
  `customer_notes` TEXT NULL,
  
  -- Specification
  `processor` VARCHAR(100) NULL,
  `ram` VARCHAR(50) NULL,
  `storage` VARCHAR(100) NULL,
  `gpu` VARCHAR(100) NULL,
  `screen_size` VARCHAR(50) NULL,
  `operating_system` VARCHAR(50) NULL,
  `color` VARCHAR(50) NULL,
  `release_year` VARCHAR(10) NULL,
  `warranty` VARCHAR(100) NULL,
  `serial_number` VARCHAR(100) NULL,
  `condition_notes` TEXT NULL, -- For second hand laptop detail condition
  
  -- Inventory & Stock
  `purchase_price` DECIMAL(15,2) DEFAULT 0.00,
  `selling_price` DECIMAL(15,2) NOT NULL DEFAULT 0.00,
  `display_stock` INT NOT NULL DEFAULT 0,
  `physical_stock` INT NOT NULL DEFAULT 0,
  `status` ENUM('TERSEDIA', 'HABIS', 'DISPLAY', 'TERJUAL', 'TIDAK_AKTIF') DEFAULT 'TERSEDIA',
  `description` TEXT NULL,
  `primary_image` VARCHAR(255) NULL,
  
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (`brand_id`) REFERENCES `brands`(`id`) ON DELETE RESTRICT,
  FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON DELETE RESTRICT,
  FOREIGN KEY (`master_dealer_id`) REFERENCES `master_dealers`(`id`) ON DELETE SET NULL,
  FOREIGN KEY (`dealer_id`) REFERENCES `dealers`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Laptop Images Gallery Table
CREATE TABLE IF NOT EXISTS `laptop_images` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `laptop_id` INT NOT NULL,
  `image_url` VARCHAR(255) NOT NULL,
  `is_primary` TINYINT(1) DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`laptop_id`) REFERENCES `laptops`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Transactions Header Table
CREATE TABLE IF NOT EXISTS `transactions` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `transaction_code` VARCHAR(50) NOT NULL UNIQUE,
  `type` ENUM('MASUK', 'KELUAR') NOT NULL,
  `transaction_date` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `source_destination` VARCHAR(150) NULL, -- E.g. "Pembelian MD 1" or "Penjualan Toko / Walk-in Customer"
  `notes` TEXT NULL,
  `total_quantity` INT NOT NULL DEFAULT 0,
  `total_amount` DECIMAL(15,2) NOT NULL DEFAULT 0.00,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Transaction Details Table
CREATE TABLE IF NOT EXISTS `transaction_details` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `transaction_id` INT NOT NULL,
  `laptop_id` INT NOT NULL,
  `quantity` INT NOT NULL,
  `unit_price` DECIMAL(15,2) NOT NULL DEFAULT 0.00,
  `subtotal` DECIMAL(15,2) NOT NULL DEFAULT 0.00,
  FOREIGN KEY (`transaction_id`) REFERENCES `transactions`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`laptop_id`) REFERENCES `laptops`(`id`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
