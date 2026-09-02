Anda bertindak sebagai:

- Senior Full-Stack Developer
- System Analyst
- Database Designer
- Database Engineer
- UI/UX Designer
- Software Architect
- Code Reviewer

Saya sedang mengembangkan:

SISTEM INFORMASI MANAJEMEN INVENTARIS LAPTOP DHAFI KOMPUTER

Aplikasi ini digunakan untuk membantu Dhafi Komputer dalam
mengelola inventaris laptop sekaligus menampilkan informasi
toko dan katalog laptop yang tersedia kepada pengunjung.

============================================================

1. # TEKNOLOGI YANG WAJIB DIGUNAKAN

FRONTEND:

- React.js
- Vite
- JavaScript / JSX
- Tailwind CSS
- React Router
- Axios

BACKEND:

- Node.js
- Express.js

DATABASE:

- MySQL

ARSITEKTUR:
Frontend dan Backend harus terpisah.

STRUKTUR:

/frontend
/backend

ATURAN:

- Gunakan JavaScript / JSX.
- JANGAN menggunakan TypeScript.
- Jangan mengganti React.js.
- Jangan mengganti Vite.
- Jangan mengganti Tailwind CSS.
- Jangan mengganti Node.js.
- Jangan mengganti Express.js.
- Jangan mengganti MySQL.
- Jangan mengganti stack teknologi tanpa instruksi eksplisit.

============================================================ 2. TUJUAN UTAMA SISTEM
============================================================

Sistem memiliki dua tujuan utama:

A. PUBLIC WEBSITE DHAFI KOMPUTER

Digunakan untuk:

- Memperkenalkan Dhafi Komputer.
- Menjelaskan informasi toko.
- Menampilkan produk laptop yang tersedia.
- Menampilkan detail produk kepada pengunjung.

B. SISTEM MANAJEMEN INVENTARIS

Digunakan Admin untuk:

1. Mengelola data inventaris laptop.
2. Membedakan laptop baru dan laptop second.
3. Mencatat sumber pengadaan laptop.
4. Mengelola stok fisik laptop.
5. Mengelola jumlah display.
6. Mencatat barang masuk.
7. Mencatat barang keluar.
8. Menghitung estimasi nilai stok fisik inventaris.
9. Menampilkan ringkasan stok berdasarkan brand.
10. Menyediakan laporan inventaris.
11. Mengelola master data.
12. Menampilkan dashboard inventaris sederhana.

FOKUS UTAMA:

"Mengetahui, mengelola, dan menampilkan inventaris laptop
yang tersedia di Dhafi Komputer."

============================================================ 3. BATASAN SISTEM
============================================================

SISTEM INI BUKAN:

- Sistem Procurement
- Sistem E-Commerce
- Sistem Pembayaran
- Sistem Keuangan
- Sistem Akuntansi
- Sistem Multi-Role
- Sistem Customer Management

JANGAN membuat:

❌ Purchase Request
❌ Purchase Order
❌ Permintaan Pengadaan
❌ Approval Pengadaan
❌ Permintaan barang ke Master Dealer
❌ Tracking permintaan ke Master Dealer
❌ Status permintaan ke Master Dealer
❌ Pengiriman dari Master Dealer
❌ Workflow procurement
❌ Pembayaran
❌ Checkout
❌ Keranjang
❌ Order Online
❌ Customer Account
❌ Customer Login
❌ Modul Keuangan
❌ Modul Akuntansi
❌ Invoice pembayaran
❌ User Management
❌ Role Management

MASTER DEALER hanya digunakan sebagai:

SUMBER LAPTOP BARU.

DEALER hanya digunakan sebagai:

SUMBER LAPTOP SECOND DARI TOKO LAIN.

LANDING PAGE hanya digunakan sebagai:

WEBSITE INFORMASI DHAFI KOMPUTER + KATALOG PRODUK.

============================================================ 4. ARSITEKTUR SISTEM
============================================================

Sistem terdiri dari dua area utama:

---

## PUBLIC AREA

Landing Page
│
├── Tentang Dhafi Komputer
├── Produk Tersedia
├── Detail Produk
└── Informasi Toko

Tidak membutuhkan login.

---

## ADMIN AREA

Login
│
▼
Dashboard
│
├── Data Laptop
├── Transaksi
├── Master Data
└── Laporan

Membutuhkan authentication.

============================================================ 5. ROLE SISTEM
============================================================

Sistem hanya memiliki SATU ROLE:

ADMIN

Admin memiliki akses penuh terhadap seluruh fitur internal.

Admin dapat:

- Melihat Dashboard
- Mengelola Data Laptop
- Mengelola Merek
- Mengelola Kategori
- Mengelola Master Dealer
- Mengelola Dealer
- Membuat Barang Masuk
- Membuat Barang Keluar
- Melihat Riwayat Transaksi
- Melihat Laporan
- Edit Data
- Hapus Data

TIDAK ADA:

- Petugas
- Viewer
- Staff
- Manager
- Super Admin
- Multi-role

============================================================ 6. USER MANAGEMENT
============================================================

MODUL USER MANAGEMENT TIDAK ADA.

JANGAN membuat halaman:

- User Management
- Daftar User
- Tambah User
- Edit User
- Hapus User
- Role Management
- Permission Management

Tabel users hanya digunakan untuk kebutuhan authentication
yang sudah berjalan.

============================================================ 7. AUTHENTICATION
============================================================

LOGIN SAAT INI SUDAH BERHASIL.

PENTING:

JANGAN mengubah atau merombak mekanisme login yang sudah berjalan.

Jangan mengganti:

- Authentication
- API Login
- Token / Session
- Route Login
- Middleware Auth

kecuali ditemukan bug yang benar-benar berkaitan.

Pastikan seluruh pengembangan baru tidak merusak login.

Alur:

ADMIN
↓
LOGIN
↓
AUTHENTICATED
↓
AKSES ADMIN AREA

============================================================ 8. LANDING PAGE DHAFI KOMPUTER
============================================================

Landing Page merupakan website publik Dhafi Komputer.

Landing Page tidak hanya menampilkan produk.

Landing Page juga harus menjelaskan dan memperkenalkan
Dhafi Komputer kepada pengunjung.

FUNGSI:

1. Mengenalkan Dhafi Komputer.
2. Menjelaskan profil singkat toko.
3. Menjelaskan produk yang tersedia.
4. Menampilkan katalog laptop tersedia.
5. Menampilkan detail produk.
6. Menyediakan akses Login Admin.

Landing Page BUKAN E-Commerce.

============================================================ 9. STRUKTUR LANDING PAGE
============================================================

Landing Page terdiri dari:

1. Navbar
2. Hero Section
3. Tentang Dhafi Komputer
4. Jenis Produk
5. Produk Tersedia
6. Keunggulan Dhafi Komputer
7. Informasi Toko
8. Footer

Jangan membuat Landing Page terlalu ramai.

Gunakan:

- Clean
- Modern
- Professional
- Informatif
- Minimalis
- Responsive

============================================================ 10. NAVBAR LANDING PAGE
============================================================

Navbar:

- Logo / Nama Dhafi Komputer
- Beranda
- Tentang Kami
- Produk
- Login Admin

Navbar harus responsive.

Desktop:
menu horizontal.

Mobile:
gunakan mobile navigation / hamburger menu.

============================================================ 11. HERO SECTION
============================================================

Hero adalah bagian pertama yang dilihat pengunjung.

Tampilkan:

- Logo / identitas Dhafi Komputer
- Nama Dhafi Komputer
- Headline
- Deskripsi
- CTA

Contoh:

"Dhafi Komputer"

"Temukan Laptop yang Sesuai dengan Kebutuhan Anda"

Deskripsi:

"Jelajahi berbagai pilihan laptop baru dan second yang
tersedia di Dhafi Komputer."

CTA:

"Lihat Produk"

CTA mengarah ke section:

Produk Tersedia.

JANGAN mengarang informasi spesifik toko.

============================================================ 12. TENTANG DHAFI KOMPUTER
============================================================

Buat section:

"Tentang Dhafi Komputer"

Section menjelaskan:

- Profil toko
- Fokus bisnis
- Produk yang tersedia
- Jenis laptop
- Komitmen pelayanan

Contoh:

"Dhafi Komputer merupakan toko komputer yang menyediakan
berbagai pilihan laptop untuk kebutuhan pelanggan."

"Produk yang tersedia mencakup laptop baru dan laptop second
dari berbagai brand."

JANGAN mengarang:

- Tahun berdiri
- Jumlah cabang
- Jumlah karyawan
- Sertifikasi
- Prestasi
- Partnership
- Klaim resmi

Jika data belum tersedia:

gunakan placeholder atau configuration data.

============================================================ 13. JENIS PRODUK
============================================================

Landing Page menjelaskan dua jenis laptop:

LAPTOP BARU

Laptop baru yang sumbernya berasal dari Master Dealer.

LAPTOP SECOND

Laptop second yang sumbernya dapat berasal dari:

- Dealer / toko lain
- Pemilik / Customer

Tujuannya agar pengunjung memahami bahwa Dhafi Komputer
menyediakan laptop baru dan second.

============================================================ 14. PRODUK TERSEDIA
============================================================

Judul:

"Produk Tersedia"

Deskripsi:

"Temukan laptop yang saat ini tersedia di Dhafi Komputer."

Hanya tampilkan laptop dengan:

physical_stock > 0

Jika:

physical_stock = 0

maka laptop tidak ditampilkan sebagai produk tersedia.

Filtering harus dilakukan di BACKEND.

Jangan hanya menyembunyikan data pada frontend.

============================================================ 15. PRODUCT CARD
============================================================

Setiap product card dapat menampilkan:

- Foto Laptop
- Nama Laptop
- Brand
- Kategori
- Jenis Barang
- Processor
- RAM
- Storage
- GPU
- Harga Jual
- Status

Status:

"Tersedia"

Button:

"Lihat Detail"

============================================================ 16. SEARCH DAN FILTER PUBLIC
============================================================

Pengunjung dapat:

- Search nama laptop
- Filter brand
- Filter kategori
- Filter jenis barang
- Sorting harga

Data harus berasal dari database.

JANGAN menggunakan dummy data sebagai sumber utama.

============================================================ 17. DETAIL PRODUK PUBLIC
============================================================

Pengunjung dapat melihat detail produk.

Tampilkan:

- Foto
- Nama Laptop
- Brand
- Kategori
- Jenis Barang
- Processor
- RAM
- Storage
- GPU
- Ukuran Layar
- Operating System
- Warna
- Tahun Rilis
- Garansi
- Kondisi jika second
- Harga Jual
- Status Ketersediaan

JANGAN menampilkan informasi internal:

❌ Harga Beli / Modal
❌ Sumber Pengadaan
❌ Master Dealer
❌ Dealer
❌ Nama Pemilik / Customer
❌ Kontak sumber
❌ Catatan internal
❌ Data Transaksi
❌ User

============================================================ 18. KEUNGGULAN DHAFI KOMPUTER
============================================================

Buat section:

"Kenapa Memilih Dhafi Komputer?"

Contoh:

- Pilihan Laptop Baru dan Second
- Berbagai Pilihan Brand
- Informasi Spesifikasi Jelas
- Informasi Ketersediaan Produk

Jangan membuat klaim yang tidak didukung data.

============================================================ 19. INFORMASI TOKO
============================================================

Landing Page dapat menampilkan:

- Nama Dhafi Komputer
- Alamat
- Nomor Telepon
- WhatsApp
- Email
- Jam Operasional
- Media Sosial

Data harus berasal dari informasi resmi toko.

Jika belum tersedia:

Gunakan placeholder.

JANGAN mengarang informasi.

============================================================ 20. FOOTER
============================================================

Footer berisi:

- Logo / Nama Dhafi Komputer
- Deskripsi singkat
- Navigasi
- Kontak
- Copyright

Contoh:

© 2026 Dhafi Komputer. All rights reserved.

============================================================ 21. API PUBLIC
============================================================

GET /api/public/products

Fungsi:

Mengambil produk:

physical_stock > 0

GET /api/public/products/:id

Fungsi:

Mengambil detail produk public.

Endpoint public:

- Tidak membutuhkan login.
- Tidak mengembalikan informasi internal.
- Hanya memberikan data yang aman untuk pengunjung.

============================================================ 22. JENIS LAPTOP
============================================================

Sistem memiliki dua jenis:

1. BARU
2. SECOND

---

## LAPTOP BARU

Sumber:

MASTER DEALER

Master Dealer:

- MD 1
- MD 2
- MD 3

Ketiganya adalah:

ALL BRAND.

Contoh:

MD 1 → ASUS, Lenovo, Acer, HP, MSI, Dell, dll.
MD 2 → ASUS, Lenovo, Acer, HP, MSI, Dell, dll.
MD 3 → ASUS, Lenovo, Acer, HP, MSI, Dell, dll.

JANGAN membatasi brand berdasarkan Master Dealer.

---

## LAPTOP SECOND

Laptop second merupakan stok fisik Dhafi Komputer.

Sumber:

1. Dealer
2. Pemilik / Customer

============================================================ 23. MASTER DEALER
============================================================

Master Dealer adalah sumber laptop baru.

Default:

MD 1
MD 2
MD 3

Ketiganya:

ALL BRAND.

Data:

- Kode MD
- Nama MD
- Kontak
- Alamat
- Status
- Catatan

JANGAN membatasi brand.

============================================================ 24. DEALER
============================================================

Dealer berarti:

TOKO LAIN

yang menjadi sumber laptop second.

Contoh:

DLR-001
Toko Laptop Bandung

DLR-002
Toko Komputer Cimahi

DLR-003
Laptop Center

Dealer dapat menyediakan berbagai brand laptop second.

JANGAN membatasi brand Dealer.

Dealer bukan Master Dealer.

Dealer bukan sistem procurement.

============================================================ 25. SUMBER PENGADAAN
============================================================

Pilihan:

1. Master Dealer
2. Dealer
3. Pemilik/Customer

---

## JIKA JENIS = BARU

Sumber:

Master Dealer

Pilihan:

- MD 1
- MD 2
- MD 3

---

## JIKA JENIS = SECOND

Sumber:

- Dealer
- Pemilik/Customer

Jika Dealer:

Tampilkan:

- Pilih Dealer

Jika Pemilik/Customer:

Tampilkan:

- Nama Pemilik/Customer
- Kontak
- Catatan

Gunakan conditional field.

============================================================ 26. FORM DATA LAPTOP
============================================================

INFORMASI UTAMA:

- Kode Laptop \*
- Nama Laptop \*
- Merek \*
- Kategori \*
- Jenis Barang \*

Jenis Barang:

- Baru
- Second

Kode Laptop wajib UNIQUE.

---

## SUMBER PENGADAAN

- Sumber Pengadaan \*

Pilihan:

- Master Dealer
- Dealer
- Pemilik/Customer

Conditional field.

Jika Master Dealer:

- MD 1
- MD 2
- MD 3

Jika Dealer:

- Pilih Dealer

Jika Pemilik/Customer:

- Nama Pemilik/Customer
- Kontak
- Catatan

---

## SPESIFIKASI

- Processor
- RAM
- Storage
- GPU
- Ukuran Layar
- Operating System
- Warna
- Tahun Rilis
- Garansi
- Serial Number

Jika second:

- Kondisi

---

## INVENTARIS

- Harga Beli / Modal
- Harga Jual \*
- Jumlah Display
- Jumlah Stok Fisik
- Status

============================================================ 27. DISPLAY STOCK DAN PHYSICAL STOCK
============================================================

WAJIB membedakan:

display_stock

dan

physical_stock.

DISPLAY STOCK:

Jumlah unit yang digunakan sebagai display.

PHYSICAL STOCK:

Jumlah stok fisik laptop yang tercatat sebagai inventaris
Dhafi Komputer.

JANGAN menyamakan keduanya.

Untuk perhitungan nilai inventaris:

WAJIB menggunakan physical_stock.

JANGAN menggunakan display_stock.

============================================================ 28. STOCK LOGIC
============================================================

BARANG MASUK:

physical_stock bertambah.

BARANG KELUAR:

physical_stock berkurang.

Validasi:

physical_stock >= 0

display_stock >= 0

quantity <= physical_stock

Stok tidak boleh negatif.

Perubahan stok harus dilakukan di backend/database.

============================================================ 29. ESTIMASI NILAI STOK FISIK
============================================================

Rumus:

SUM(
physical_stock × selling_price
)

Contoh:

Laptop A:

physical_stock = 2
selling_price = Rp 8.000.000

Nilai:

Rp 16.000.000

Laptop B:

physical_stock = 1
selling_price = Rp 1.300.000

Nilai:

Rp 1.300.000

Total:

Rp 17.300.000

Keterangan:

"Total kalkulasi nilai aset berdasarkan physical_stock milik
Dhafi Komputer dan harga jual terdaftar."

ATURAN:

- Gunakan physical_stock.
- Gunakan selling_price.
- Jangan gunakan purchase_price.
- Jangan gunakan display_stock.
- Jangan hardcode.
- Hitung dari database.
- Backend melakukan agregasi.

============================================================ 30. DASHBOARD FINAL
============================================================

Dashboard HARUS SIMPLE.

Hanya memiliki 3 bagian:

1. 4 Kartu Statistik Utama
2. Ringkasan Stok Berdasarkan Brand
3. Transaksi Terbaru

---

## HEADER

Dashboard

"Ringkasan kondisi inventaris laptop Dhafi Komputer."

---

## ROW 1 — 4 CARD

CARD 1:

Total Laptop

Menampilkan jumlah seluruh laptop terdaftar.

Keterangan:

"Seluruh laptop terdaftar"

---

CARD 2:

Laptop Baru

Menampilkan:

jenis_barang = Baru

Keterangan:

"Laptop baru"

---

CARD 3:

Laptop Second

Menampilkan:

jenis_barang = Second

Keterangan:

"Laptop second"

---

CARD 4:

Estimasi Nilai Stok Fisik Inventaris

Rumus:

SUM(
physical_stock × selling_price
)

Keterangan:

"Total kalkulasi nilai aset berdasarkan physical_stock milik
Dhafi Komputer dan harga jual terdaftar."

---

## ATURAN CARD

Desktop:

4 card satu baris.

Tablet:

2 × 2.

Mobile:

1 × 1.

Desain:

- Konsisten
- Icon sederhana
- Angka jelas
- Judul jelas
- Deskripsi singkat
- Border radius
- Shadow ringan
- Spacing rapi

============================================================ 31. RINGKASAN STOK BERDASARKAN BRAND
============================================================

BAGIAN INI WAJIB DIPERTAHANKAN.

Judul:

"Ringkasan Stok Berdasarkan Brand"

Tujuan:

Mengetahui distribusi stok fisik berdasarkan brand.

Gunakan:

physical_stock

BUKAN:

display_stock

Query:

GROUP BY brand_id

SUM(physical_stock)

Contoh:

ASUS 8 Unit
Lenovo 6 Unit
Acer 5 Unit
HP 3 Unit
MSI 1 Unit
Dell 1 Unit

Gunakan:

- Grid sederhana
  atau
- List sederhana

JANGAN membuat grafik besar.

Jika brand banyak:

gunakan grid responsive.

============================================================ 32. TRANSAKSI TERBARU
============================================================

Judul:

"Transaksi Terbaru"

Maksimal:

5 transaksi terbaru.

Kolom:

- Tanggal
- Nomor Transaksi
- Jenis Transaksi
- Laptop
- Jumlah

Jenis:

- Barang Masuk
- Barang Keluar

Button:

"Lihat Semua"

Mengarah ke halaman transaksi.

============================================================ 33. DASHBOARD YANG TIDAK BOLEH ADA
============================================================

JANGAN membuat card tambahan:

❌ Total Stok Fisik
❌ Total Display
❌ Stok Menipis
❌ Total Master Dealer
❌ Total Dealer
❌ Total Kategori
❌ Total Brand

JANGAN membuat:

❌ Grafik berlebihan
❌ Banyak card statistik
❌ Dashboard terlalu ramai
❌ Procurement widget
❌ Purchase Request
❌ Purchase Order
❌ Approval Procurement

Dashboard harus sederhana.

============================================================ 34. MASTER DATA
============================================================

Master Data:

1. Merek
2. Kategori
3. Master Dealer
4. Dealer

---

## MEREK

Contoh:

- ASUS
- Lenovo
- Acer
- HP
- MSI
- Dell
- Brand lainnya

---

## KATEGORI

Contoh:

- Gaming
- Business
- Entry Level
- Mid Range
- High End
- Ultrabook

============================================================ 35. DATA LAPTOP
============================================================

Halaman:

Data Laptop

Fitur:

- Search
- Filter
- Sorting
- Pagination
- Tambah
- Detail
- Edit
- Hapus

Kolom:

- Kode
- Nama Laptop
- Merek
- Kategori
- Jenis Barang
- Sumber Pengadaan
- Harga Jual
- Display
- Stok Fisik
- Status
- Action

Action:

- Detail
- Edit
- Hapus

============================================================ 36. DETAIL LAPTOP ADMIN
============================================================

Tampilkan:

INFORMASI UTAMA:

- Kode
- Nama
- Merek
- Kategori
- Jenis Barang

SUMBER:

Jika Baru:

- Master Dealer
- MD 1 / MD 2 / MD 3

Jika Second dari Dealer:

- Dealer
- Nama Dealer / Toko

Jika Second dari Pemilik/Customer:

- Nama Pemilik/Customer
- Kontak
- Catatan

SPESIFIKASI:

- Processor
- RAM
- Storage
- GPU
- Ukuran Layar
- Operating System
- Warna
- Tahun Rilis
- Garansi
- Serial Number

INVENTARIS:

- Harga Beli
- Harga Jual
- Jumlah Display
- Jumlah Stok Fisik
- Status

Jika second:

- Kondisi

Tambahkan:

- Edit
- Hapus
- Riwayat Transaksi

============================================================ 37. TRANSAKSI BARANG MASUK
============================================================

Data:

- Nomor Transaksi
- Tanggal
- Laptop
- Jenis Barang
- Sumber Pengadaan
- Master Dealer / Dealer / Pemilik/Customer
- Jumlah
- Harga Beli
- Catatan
- User

Aturan:

Laptop Baru:
→ Master Dealer

Laptop Second:
→ Dealer atau Pemilik/Customer

Setelah transaksi:

physical_stock bertambah.

Transaksi disimpan ke database.

============================================================ 38. TRANSAKSI BARANG KELUAR
============================================================

Data:

- Nomor Transaksi
- Tanggal
- Laptop
- Customer
- Kontak Customer
- Jumlah
- Harga Jual
- Total
- Catatan
- User

Rumus:

total = quantity × selling_price

Setelah transaksi:

physical_stock berkurang.

Validasi:

quantity <= physical_stock

Stok tidak boleh negatif.

JANGAN membuat pembayaran.

============================================================ 39. STATUS INVENTARIS
============================================================

Status:

- Tersedia
- Habis
- Display
- Terjual
- Tidak Aktif

Jika:

physical_stock = 0

Status dapat menjadi:

Habis

Jangan membuat status tambahan tanpa kebutuhan.

============================================================ 40. LAPORAN
============================================================

Sediakan:

1. Laporan Inventaris
2. Laporan Barang Masuk
3. Laporan Barang Keluar

Filter dapat meliputi:

- Tanggal
- Brand
- Jenis Barang
- Kategori
- Dealer
- Master Dealer

JANGAN membuat laporan procurement.

============================================================ 41. DATABASE
============================================================

Database:

inventaris_dhafi

Tabel minimal:

users
brands
categories
master_dealers
dealers
laptops
stock_transactions

JANGAN membuat:

purchase_requests
purchase_orders
procurement_requests
procurement_approvals
payments
invoices

============================================================ 42. RELASI DATABASE
============================================================

brands
↓
laptops

categories
↓
laptops

master_dealers
↓
laptops

dealers
↓
laptops

laptops
↓
stock_transactions

users
↓
stock_transactions

Master Dealer dan Dealer adalah entitas berbeda.

master_dealers:
→ sumber laptop baru.

dealers:
→ toko lain sebagai sumber laptop second.

Gunakan:

- Primary Key
- Foreign Key
- Unique Constraint
- NOT NULL sesuai kebutuhan
- Index yang relevan

============================================================ 43. API
============================================================

AUTH:

POST /api/auth/login
POST /api/auth/logout
GET /api/auth/me

LAPTOP:

GET /api/laptops
GET /api/laptops/:id
POST /api/laptops
PUT /api/laptops/:id
DELETE /api/laptops/:id

BRANDS:

GET /api/brands
POST /api/brands
PUT /api/brands/:id
DELETE /api/brands/:id

CATEGORIES:

GET /api/categories
POST /api/categories
PUT /api/categories/:id
DELETE /api/categories/:id

MASTER DEALERS:

GET /api/master-dealers
POST /api/master-dealers
PUT /api/master-dealers/:id
DELETE /api/master-dealers/:id

DEALERS:

GET /api/dealers
POST /api/dealers
PUT /api/dealers/:id
DELETE /api/dealers/:id

TRANSACTIONS:

GET /api/transactions
GET /api/transactions/:id
POST /api/transactions/in
POST /api/transactions/out

DASHBOARD:

GET /api/dashboard

PUBLIC:

GET /api/public/products
GET /api/public/products/:id

============================================================ 44. API DASHBOARD
============================================================

GET /api/dashboard

Minimal response:

{
total_laptops,
total_new_laptops,
total_second_laptops,
estimated_physical_inventory_value,
stock_by_brand,
recent_transactions
}

Semua perhitungan dilakukan backend/database.

============================================================ 45. QUERY DASHBOARD
============================================================

Total Laptop:

COUNT(laptops)

Laptop Baru:

COUNT WHERE jenis_barang = 'Baru'

Laptop Second:

COUNT WHERE jenis_barang = 'Second'

Estimasi Nilai:

SUM(
physical_stock \* selling_price
)

Ringkasan Brand:

GROUP BY brand_id

SUM(physical_stock)

Transaksi Terbaru:

ORDER BY transaction_date DESC
LIMIT 5

JANGAN menghitung data utama menggunakan JavaScript frontend.

============================================================ 46. FORMAT RUPIAH
============================================================

Gunakan:

Rp 17.300.000

Bukan:

17300000

Bukan:

17.3M

Bukan:

1.73E7

Format Indonesia:

Rp 1.000.000

============================================================ 47. VALIDASI
============================================================

Validasi wajib dilakukan:

- Frontend
- Backend
- Database jika diperlukan

Wajib:

- Kode Laptop
- Nama Laptop
- Merek
- Kategori
- Jenis Barang
- Sumber Pengadaan
- Harga Jual

Conditional:

Master Dealer:
→ wajib jika sumber = Master Dealer.

Dealer:
→ wajib jika sumber = Dealer.

Pemilik/Customer:
→ Nama wajib.

Stok:

physical_stock >= 0

display_stock >= 0

Barang Keluar:

quantity <= physical_stock

Kode Laptop:

UNIQUE

Nomor Transaksi:

UNIQUE

============================================================ 48. ERROR HANDLING
============================================================

API gagal:

"Data gagal dimuat."

Dashboard gagal:

"Data dashboard gagal dimuat."

Network:

"Tidak dapat terhubung ke server."

Loading:

"Memuat data..."

Empty:

"Belum ada data."

HTTP status:

200 = berhasil
201 = berhasil membuat
400 = validasi gagal
401 = belum login
403 = akses ditolak
404 = tidak ditemukan
409 = konflik
500 = server error

============================================================ 49. UI/UX
============================================================

Bahasa:

Indonesia

Mata uang:

Rupiah

Desain:

- Clean
- Modern
- Professional
- Simple
- Consistent
- Responsive

Prioritas:

Desktop First.

Tetap responsive untuk:

- Desktop
- Tablet
- Mobile

Gunakan:

- Typography jelas
- Spacing konsisten
- Button konsisten
- Form sederhana
- Table readable
- Loading state
- Empty state
- Error state
- Confirmation sebelum delete

============================================================ 50. NAVIGASI PUBLIC
============================================================

Navbar:

- Beranda
- Tentang Kami
- Produk
- Login Admin

============================================================ 51. NAVIGASI ADMIN
============================================================

Sidebar:

- Dashboard
- Data Laptop
- Transaksi
  - Barang Masuk
  - Barang Keluar
- Master Data
  - Merek
  - Kategori
  - Master Dealer
  - Dealer
- Laporan
- Logout

JANGAN menambahkan:

❌ User Management
❌ Procurement
❌ Purchase Request
❌ Purchase Order
❌ Pembayaran
❌ Keuangan
❌ Akuntansi

============================================================ 52. DATABASE TRANSACTION
============================================================

Barang masuk dan barang keluar wajib menggunakan
database transaction.

---

## BARANG MASUK

BEGIN TRANSACTION

1. Validasi laptop.
2. Validasi quantity.
3. Validasi sumber.
4. Update physical_stock.
5. Insert stock_transaction.
6. COMMIT.

Jika error:

ROLLBACK.

---

## BARANG KELUAR

BEGIN TRANSACTION

1. Validasi laptop.
2. Cek physical_stock.
3. Validasi quantity.
4. Update physical_stock.
5. Insert stock_transaction.
6. COMMIT.

Jika error:

ROLLBACK.

Tujuan:

Menjaga integritas stok.

============================================================ 53. KEAMANAN
============================================================

Authentication harus dipertahankan.

Endpoint Admin harus protected.

Endpoint Public tidak membutuhkan login.

Backend wajib melakukan authorization.

Jangan hanya menyembunyikan button frontend.

Gunakan:

- Parameterized query
- Prepared statement
- Secure password handling
- Environment variables
- Protected API
- Proper error handling

Jangan menyimpan password plaintext.

API public tidak boleh mengirim data internal.

============================================================ 54. ATURAN VIBE CODING
============================================================

SEBELUM MENGUBAH KODE:

1. Baca struktur project.
2. Baca package.json.
3. Baca konfigurasi database.
4. Baca route.
5. Baca controller.
6. Baca model.
7. Baca service.
8. Baca middleware.
9. Baca komponen frontend.
10. Baca API service.
11. Periksa authentication.
12. Periksa struktur database.
13. Periksa relasi database.
14. Periksa fitur yang sudah berjalan.
15. Identifikasi reusable code.

JANGAN langsung membuat file baru.

JANGAN membuat file duplikat.

JANGAN membuat API duplikat.

JANGAN menghapus fitur yang sudah benar.

JANGAN menggunakan dummy data sebagai data utama.

JANGAN hardcode data dashboard.

JANGAN hardcode nilai inventaris.

JANGAN mengganti nama field database tanpa alasan.

JANGAN mengganti endpoint tanpa sinkronisasi frontend-backend.

JANGAN merombak login yang sudah berhasil.

JANGAN membuat modul procurement.

============================================================ 55. CODE QUALITY
============================================================

Gunakan:

- Reusable Components
- Reusable API Service
- Separation of Concerns
- Proper Validation
- Proper Error Handling
- Consistent Naming
- Parameterized Query
- Environment Variables
- Clean Architecture sesuai skala project

Hindari:

- Duplicate code
- Duplicate API
- Duplicate components
- Hardcoded data
- Dead code
- Unused imports
- Unused variables
- Inline logic yang terlalu kompleks
- Business logic utama di frontend

============================================================ 56. PRIORITAS PENGEMBANGAN
============================================================

Jika project belum lengkap, kerjakan bertahap:

STEP 1:
Audit Project

STEP 2:
Landing Page Dhafi Komputer

STEP 3:
Master Data

STEP 4:
Data Laptop

STEP 5:
Detail Laptop

STEP 6:
Barang Masuk

STEP 7:
Barang Keluar

STEP 8:
Stock Logic

STEP 9:
Dashboard Final

STEP 10:
Laporan

STEP 11:
Validation & Security

STEP 12:
Testing

STEP 13:
Final Cleanup & Code Review

JANGAN mengerjakan semua sekaligus.

Setiap tahap:

1. Implementasi
2. Testing
3. Perbaikan
4. Verifikasi
5. Baru lanjut

============================================================ 57. TESTING
============================================================

---

## PUBLIC WEBSITE

Test:

- Landing Page dapat dibuka tanpa login.
- Hero tampil.
- Tentang Dhafi Komputer tampil.
- Produk tersedia tampil.
- Produk physical_stock = 0 tidak tampil.
- Search berfungsi.
- Filter berfungsi.
- Sorting berfungsi.
- Detail produk berfungsi.
- Data internal tidak bocor.
- Responsive.

---

## AUTH

Test:

- Login berhasil.
- Login gagal.
- Logout.
- Protected route.
- Session/token.
- Unauthorized request ditolak.

---

## DATA LAPTOP

Test:

- Tambah.
- Edit.
- Detail.
- Delete.
- Search.
- Filter.
- Sorting.
- Pagination.
- Kode unik.

---

## MASTER DATA

Test:

- Merek CRUD.
- Kategori CRUD.
- Master Dealer CRUD.
- Dealer CRUD.

---

## BARANG MASUK

Test:

- Stok bertambah.
- Transaksi tersimpan.
- Invalid quantity ditolak.
- Sumber sesuai jenis laptop.
- Database rollback jika gagal.

---

## BARANG KELUAR

Test:

- Stok berkurang.
- Transaksi tersimpan.
- Quantity > stock ditolak.
- Stok tidak negatif.
- Database rollback jika gagal.

---

## DASHBOARD

Test:

- Total laptop benar.
- Total baru benar.
- Total second benar.
- Nilai inventaris benar.
- Ringkasan brand benar.
- Lima transaksi terbaru benar.

============================================================ 58. DASHBOARD FINAL
============================================================

Struktur WAJIB:

HEADER:

Dashboard

"Ringkasan kondisi inventaris laptop Dhafi Komputer."

ROW 1:

[ Total Laptop ]

[ Laptop Baru ]

[ Laptop Second ]

[ Estimasi Nilai Stok Fisik Inventaris ]

ROW 2:

[ Ringkasan Stok Berdasarkan Brand ]

ROW 3:

[ Transaksi Terbaru ]

TIDAK ADA BAGIAN LAIN.

============================================================ 59. HASIL AKHIR YANG DIHARAPKAN
============================================================

PUBLIC WEBSITE:

- Landing Page
- Profil / Tentang Dhafi Komputer
- Jenis Produk
- Produk Tersedia
- Search
- Filter
- Sorting
- Detail Produk
- Informasi Toko

AUTHENTICATION:

- Login
- Logout
- Admin

DASHBOARD:

- Total Laptop
- Laptop Baru
- Laptop Second
- Estimasi Nilai Stok Fisik Inventaris
- Ringkasan Stok Berdasarkan Brand
- Transaksi Terbaru

DATA LAPTOP:

- Daftar
- Tambah
- Detail
- Edit
- Hapus
- Search
- Filter
- Sorting
- Pagination

MASTER DATA:

- Merek
- Kategori
- Master Dealer
- Dealer

TRANSAKSI:

- Barang Masuk
- Barang Keluar
- Riwayat Transaksi

LAPORAN:

- Inventaris
- Barang Masuk
- Barang Keluar

============================================================ 60. FITUR YANG TIDAK ADA
============================================================

JANGAN IMPLEMENTASIKAN:

❌ Petugas
❌ Viewer
❌ Staff
❌ User Management
❌ Role Management
❌ Permission Management UI
❌ Supplier
❌ Purchase Request
❌ Purchase Order
❌ Procurement
❌ Approval Pengadaan
❌ Tracking Pengadaan
❌ Pembayaran
❌ Checkout
❌ Keranjang
❌ Order Online
❌ Customer Account
❌ Customer Login
❌ Modul Keuangan
❌ Modul Akuntansi
❌ Invoice pembayaran

============================================================ 61. FINAL PRINCIPLE
============================================================

Sistem harus sederhana, konsisten, stabil, aman, dan mudah
digunakan.

Sistem harus mampu menjawab:

1. Berapa jumlah laptop?
2. Berapa laptop baru?
3. Berapa laptop second?
4. Berapa estimasi nilai stok fisik?
5. Bagaimana distribusi stok berdasarkan brand?
6. Apa transaksi terbaru?
7. Berapa stok fisik setiap laptop?
8. Dari mana laptop diperoleh?
9. Apa saja barang masuk?
10. Apa saja barang keluar?
11. Laptop apa saja yang tersedia?
12. Apa itu Dhafi Komputer?
13. Apa saja jenis laptop yang tersedia di Dhafi Komputer?

PRINSIP UTAMA:

"PUBLIC WEBSITE UNTUK MEMPERKENALKAN DHAFI KOMPUTER
DAN MENAMPILKAN KATALOG LAPTOP TERSEDIA,
SERTA SISTEM ADMIN UNTUK MENGELOLA INVENTARIS LAPTOP."

Setiap implementasi harus mengikuti Master Vibe Coding ini
kecuali saya memberikan instruksi perubahan secara eksplisit.
