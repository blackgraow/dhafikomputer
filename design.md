Anda bertindak sebagai Senior Full-Stack Developer, System Analyst,
Database Designer, Software Architect, UI/UX Designer, dan Code Reviewer.

Saya sedang mengembangkan:

SISTEM INFORMASI MANAJEMEN INVENTARIS LAPTOP DHAFI KOMPUTER

============================================================

1. # TUJUAN SISTEM

Sistem terdiri dari dua area:

A. PUBLIC WEBSITE
B. ADMIN INVENTORY SYSTEM

PUBLIC WEBSITE digunakan untuk:

- Memperkenalkan Dhafi Komputer.
- Menjelaskan profil toko.
- Menampilkan laptop yang tersedia.
- Menampilkan detail produk.

ADMIN SYSTEM digunakan untuk:

- Mengelola inventaris laptop.
- Mengelola master data.
- Mencatat barang masuk.
- Mencatat barang keluar.
- Mengelola stok fisik.
- Melihat dashboard.
- Melihat laporan.

Fokus utama:

"Mengetahui dan mengelola inventaris laptop
yang tercatat dan tersedia di Dhafi Komputer."

============================================================ 2. TECHNOLOGY STACK
============================================================

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

ARCHITECTURE:

/frontend
/backend

WAJIB:

- JavaScript / JSX
- BUKAN TypeScript
- Frontend dan Backend terpisah

Jangan mengganti stack teknologi.

============================================================ 3. USER DAN ROLE
============================================================

Sistem hanya memiliki:

ADMIN

Tidak ada:

- Petugas
- Viewer
- Staff
- Manager
- User Management
- Role Management
- Permission Management UI

Login yang sudah berjalan harus dipertahankan.

JANGAN merombak authentication yang sudah ada.

============================================================ 4. TERMINOLOGI BISNIS
============================================================

Jangan salah memahami istilah berikut.

---

## MASTER DEALER

Master Dealer adalah sumber laptop BARU.

Default:

MD 1
MD 2
MD 3

Ketiganya ALL BRAND.

Contoh:

MD 1 → ASUS, Lenovo, Acer, HP, MSI, Dell, dll.
MD 2 → ASUS, Lenovo, Acer, HP, MSI, Dell, dll.
MD 3 → ASUS, Lenovo, Acer, HP, MSI, Dell, dll.

JANGAN membatasi brand berdasarkan Master Dealer.

---

## DEALER

Dealer adalah TOKO LAIN yang menjadi sumber laptop SECOND.

Contoh:

Dealer A → Toko Laptop Bandung
Dealer B → Toko Komputer Cimahi

Dealer bukan Master Dealer.

Dealer bukan procurement.

============================================================ 5. JENIS BARANG
============================================================

Hanya ada:

1. Baru
2. Second

---

## BARU

Sumber:

Master Dealer

---

## SECOND

Sumber:

- Dealer / toko lain
- Pemilik / Customer

============================================================ 6. SUMBER PENGADAAN
============================================================

Pilihan:

- Master Dealer
- Dealer
- Pemilik/Customer

Conditional field:

Jika jenis = Baru:

→ Master Dealer

Jika jenis = Second:

→ Dealer
atau
→ Pemilik/Customer

Jika sumber = Master Dealer:

Tampilkan:

- MD 1
- MD 2
- MD 3

Jika sumber = Dealer:

Tampilkan:

- Pilih Dealer

Jika sumber = Pemilik/Customer:

Tampilkan:

- Nama Pemilik/Customer
- Kontak
- Catatan

============================================================ 7. MODERN DESIGN DIRECTION
============================================================

Gunakan gaya visual:

MODERN BUSINESS INVENTORY SYSTEM

Karakter desain:

- Modern
- Clean
- Professional
- Minimal
- Elegant
- Premium
- Functional
- Data-focused
- Tidak ramai
- Tidak terlihat seperti template admin generik

Prioritas:

1. Readability
2. Hierarchy
3. Usability
4. Consistency
5. Visual polish

Jangan menggunakan desain yang terlalu dekoratif.

============================================================ 8. DESIGN PRINCIPLE
============================================================

Gunakan prinsip:

"LESS BUT BETTER"

Setiap elemen harus memiliki fungsi.

Hindari:

- Card berlebihan
- Border berlebihan
- Shadow berlebihan
- Gradient berlebihan
- Icon berlebihan
- Animasi berlebihan
- Grafik yang tidak diperlukan
- Informasi duplikat

============================================================ 9. VISUAL STYLE
============================================================

Gunakan:

- Background netral
- Surface putih
- Typography modern
- Border tipis
- Shadow sangat ringan
- Border radius medium
- Spacing konsisten
- Accent color yang elegan

Visual harus terlihat seperti aplikasi inventory
profesional modern.

Bukan seperti:

- Dashboard template lama
- Website gaming
- E-commerce marketplace
- Sistem ERP yang terlalu kompleks

============================================================ 10. COLOR SYSTEM
============================================================

Gunakan color hierarchy:

PRIMARY:

Warna identitas Dhafi Komputer.

Digunakan untuk:

- CTA
- Active navigation
- Primary button
- Link penting
- Highlight

BACKGROUND:

Gunakan warna netral terang.

SURFACE:

Putih atau warna surface yang sangat dekat dengan putih.

TEXT PRIMARY:

Untuk heading dan informasi utama.

TEXT SECONDARY:

Untuk deskripsi dan metadata.

SUCCESS:

Untuk:

- Tersedia
- Berhasil
- Barang masuk

WARNING:

Untuk kondisi yang membutuhkan perhatian.

DANGER:

Untuk:

- Hapus
- Barang keluar
- Error

INFO:

Untuk informasi tambahan.

Jangan menggunakan terlalu banyak warna.

============================================================ 11. TYPOGRAPHY
============================================================

Gunakan font modern sans-serif.

Hierarchy:

Page Title
→ paling besar dan tegas

Section Title
→ medium-large

Card Title
→ medium

Body
→ regular

Caption
→ small

Gunakan hierarchy yang jelas.

Jangan semua teks dibuat bold.

============================================================ 12. SPACING SYSTEM
============================================================

Gunakan spacing yang konsisten.

Gunakan prinsip:

4 / 8 point spacing system.

Contoh:

4px
8px
12px
16px
24px
32px
40px
48px

Jangan menggunakan spacing random.

============================================================ 13. BORDER RADIUS
============================================================

Gunakan radius konsisten.

Contoh:

Small:
6px

Medium:
8px

Large:
12px

Card:
12px

Modal:
16px

Jangan menggunakan radius ekstrem.

============================================================ 14. SHADOW
============================================================

Gunakan shadow minimal.

Card:

soft shadow

Modal:

medium shadow

Jangan menggunakan:

- Heavy shadow
- Glow
- Neon shadow

============================================================ 15. ICON
============================================================

Gunakan icon sederhana dan konsisten.

Icon harus:

- Minimal
- Mudah dipahami
- Tidak dekoratif berlebihan

Ukuran umum:

16px
20px
24px

Jangan mencampur berbagai gaya icon.

============================================================ 16. PUBLIC WEBSITE
============================================================

Landing Page harus terasa seperti website resmi toko,
bukan halaman dashboard.

Struktur:

NAVBAR
↓
HERO
↓
TENTANG DHAFI KOMPUTER
↓
JENIS PRODUK
↓
PRODUK TERSEDIA
↓
KEUNGGULAN
↓
INFORMASI TOKO
↓
FOOTER

============================================================ 17. PUBLIC NAVBAR
============================================================

Navbar modern.

Desktop:

Logo Dhafi Komputer
|
Beranda
Tentang Kami
Produk
|
Login Admin

Navbar:

- Clean
- Sticky jika diperlukan
- Tidak terlalu tinggi
- Responsive

Mobile:

Gunakan hamburger menu.

============================================================ 18. HERO SECTION
============================================================

Hero harus memiliki visual hierarchy kuat.

Layout desktop:

---

| |
| Dhafi Komputer Visual / Image |
| |
| Temukan Laptop |
| yang Sesuai Kebutuhan Anda |
| |
| Deskripsi singkat |
| |
| [ Lihat Produk ] |
| |

---

Gunakan:

- Heading besar
- Short description
- CTA
- Visual laptop / toko jika tersedia

Jangan menggunakan terlalu banyak teks.

============================================================ 19. TENTANG DHAFI KOMPUTER
============================================================

Section:

"Tentang Dhafi Komputer"

Gunakan layout:

Text + Visual

Isi:

- Profil singkat
- Fokus toko
- Produk yang tersedia

Jangan mengarang:

- Tahun berdiri
- Alamat
- Prestasi
- Sertifikasi
- Jumlah cabang

Jika belum ada data:

gunakan placeholder yang mudah diganti.

============================================================ 20. JENIS PRODUK
============================================================

Buat dua visual card:

[ LAPTOP BARU ]

Laptop baru dari Master Dealer.

[ LAPTOP SECOND ]

Laptop second dari Dealer / Pemilik.

Card sederhana.

Tidak perlu banyak informasi.

============================================================ 21. PRODUK TERSEDIA
============================================================

Section:

"Produk Tersedia"

Hanya tampilkan:

physical_stock > 0

Layout:

Desktop:

4 product card per row jika ukuran layar memungkinkan.

Tablet:

2 card per row.

Mobile:

1 card per row.

Product card:

---

[ FOTO LAPTOP ]

ASUS ROG Strix G16

ASUS
Gaming

Intel Core i7
16 GB RAM
1 TB SSD

Rp 18.500.000

● Tersedia

## [ Lihat Detail ]

Harga harus menggunakan format Rupiah.

============================================================ 22. PRODUCT CARD UX
============================================================

Product card harus:

- Clean
- Compact
- Informative
- Tidak terlalu tinggi

Hover:

- Slight elevation
- Image subtle zoom jika diperlukan

Jangan membuat animasi berlebihan.

============================================================ 23. DETAIL PUBLIC PRODUCT
============================================================

Gunakan layout modern.

Desktop:

---

| Image | Product Information |
| | |
| | ASUS ROG... |
| | Rp ... |
| | Tersedia |
| | |
| | Specifications |

---

Tampilkan:

- Nama
- Brand
- Kategori
- Jenis
- Processor
- RAM
- Storage
- GPU
- Ukuran layar
- OS
- Warna
- Tahun rilis
- Garansi
- Kondisi jika second
- Harga
- Ketersediaan

JANGAN tampilkan:

- Harga beli
- Modal
- Sumber pengadaan
- Master Dealer
- Dealer
- Pemilik
- Transaksi internal
- User

============================================================ 24. ADMIN LAYOUT
============================================================

Admin menggunakan:

SIDEBAR + TOPBAR + CONTENT AREA

Desktop:

---

| SIDEBAR | TOPBAR |
| |-----------------------------------|
| | |
| | CONTENT |
| | |
| | |

---

Sidebar:

- Logo
- Dashboard
- Data Laptop
- Transaksi
- Master Data
- Laporan
- Logout

============================================================ 25. SIDEBAR
============================================================

Sidebar modern.

Gunakan:

Icon + Label

Active state:

- Background subtle
- Accent color
- Indicator kecil

Sidebar tidak boleh terlalu lebar.

Desktop:

sekitar 240–260px.

Mobile:

Sidebar menjadi drawer.

============================================================ 26. TOPBAR
============================================================

Topbar:

- Page title / breadcrumb
- Admin profile sederhana
- Logout

Jangan membuat topbar penuh dengan widget.

============================================================ 27. DASHBOARD
============================================================

Dashboard harus SIMPLE.

Hanya:

ROW 1:

4 STATISTIC CARDS

ROW 2:

STOCK BY BRAND

ROW 3:

RECENT TRANSACTIONS

Tidak ada bagian lain.

============================================================ 28. DASHBOARD STATISTIC CARDS
============================================================

Card 1:

Total Laptop

24 Unit

"Seluruh laptop terdaftar"

Card 2:

Laptop Baru

15 Unit

"Laptop baru"

Card 3:

Laptop Second

9 Unit

"Laptop second"

Card 4:

Estimasi Nilai Stok Fisik

Rp 17.300.000

"Total kalkulasi nilai aset berdasarkan
physical_stock milik Dhafi Komputer
dan harga jual terdaftar."

Gunakan:

- Icon
- Label
- Value
- Description

============================================================ 29. DASHBOARD STOCK BY BRAND
============================================================

Judul:

"Ringkasan Stok Berdasarkan Brand"

Gunakan:

physical_stock

Bukan display_stock.

Contoh:

ASUS 8 Unit
Lenovo 6 Unit
Acer 5 Unit
HP 3 Unit
MSI 1 Unit
Dell 1 Unit

Tampilan:

Grid / compact list.

JANGAN membuat pie chart besar.

JANGAN membuat grafik kompleks.

============================================================ 30. DASHBOARD RECENT TRANSACTIONS
============================================================

Judul:

"Transaksi Terbaru"

Maksimal:

5 transaksi.

Kolom:

Tanggal
Nomor Transaksi
Jenis
Laptop
Jumlah

Gunakan badge:

Barang Masuk
Barang Keluar

Button:

"Lihat Semua"

============================================================ 31. DATA LAPTOP PAGE
============================================================

Header:

Data Laptop

Description:

"Kelola data inventaris laptop Dhafi Komputer."

Top action:

[ + Tambah Laptop ]

Toolbar:

[ Search ]

[ Filter ]

[ Sort ]

Table:

Kode
Laptop
Brand
Kategori
Jenis
Sumber
Harga Jual
Display
Stok Fisik
Status
Action

============================================================ 32. TABLE DESIGN
============================================================

Table modern.

Gunakan:

- Header subtle
- Row height nyaman
- Hover state
- Border ringan
- Badge status
- Action menu

Jangan menggunakan table yang terlalu padat.

Untuk mobile:

Gunakan responsive table atau card layout.

============================================================ 33. STATUS BADGE
============================================================

Gunakan badge untuk:

Tersedia
Habis
Display
Terjual
Tidak Aktif

Contoh:

● Tersedia

● Habis

Badge harus:

- Compact
- Rounded
- Mudah dibaca

============================================================ 34. FORM LAPTOP
============================================================

Form harus dibagi menjadi section.

SECTION 1:

Informasi Utama

SECTION 2:

Sumber Pengadaan

SECTION 3:

Spesifikasi

SECTION 4:

Inventaris

SECTION 5:

Status

Jangan membuat form menjadi satu blok panjang.

Gunakan:

2-column layout pada desktop.

1-column pada mobile.

============================================================ 35. FORM INFORMASI UTAMA
============================================================

Fields:

Kode Laptop _
Nama Laptop _
Merek _
Kategori _
Jenis Barang \*

Gunakan:

- Label jelas
- Required indicator
- Helper text jika diperlukan
- Validation message

============================================================ 36. FORM SUMBER PENGADAAN
============================================================

Sumber:

Master Dealer
Dealer
Pemilik/Customer

Gunakan conditional UI.

Jangan menampilkan semua field sekaligus.

Contoh:

Jenis = Baru
↓
Sumber = Master Dealer
↓
Pilih MD

Jenis = Second
↓
Sumber = Dealer
↓
Pilih Dealer

============================================================ 37. FORM SPESIFIKASI
============================================================

Fields:

Processor
RAM
Storage
GPU
Ukuran Layar
Operating System
Warna
Tahun Rilis
Garansi
Serial Number

Jika Second:

Kondisi

============================================================ 38. FORM INVENTARIS
============================================================

Fields:

Harga Beli / Modal
Harga Jual \*
Jumlah Display
Jumlah Stok Fisik
Status

Gunakan numeric input.

Harga menggunakan Rupiah.

============================================================ 39. DETAIL LAPTOP ADMIN
============================================================

Gunakan layout:

Header:

Nama Laptop
Badge Status

Action:

[ Edit ]
[ Hapus ]

Content:

INFORMASI UTAMA

SUMBER PENGADAAN

SPESIFIKASI

INVENTARIS

RIWAYAT TRANSAKSI

Gunakan card section yang konsisten.

============================================================ 40. TRANSAKSI PAGE
============================================================

Halaman utama:

"Transaksi"

Gunakan dua action utama:

[ Barang Masuk ]
[ Barang Keluar ]

Kemudian:

Recent / transaction table.

Jangan membuat halaman transaksi terlalu kompleks.

============================================================ 41. BARANG MASUK
============================================================

Form:

Nomor Transaksi
Tanggal
Laptop
Jenis Barang
Sumber
Jumlah
Harga Beli
Catatan

User:

Admin otomatis.

Setelah berhasil:

physical_stock bertambah.

============================================================ 42. BARANG KELUAR
============================================================

Form:

Nomor Transaksi
Tanggal
Laptop
Customer
Kontak
Jumlah
Harga Jual
Total
Catatan

Rumus:

quantity × selling_price

Setelah berhasil:

physical_stock berkurang.

Validasi:

quantity <= physical_stock

============================================================ 43. MASTER DATA
============================================================

Master Data:

Merek
Kategori
Master Dealer
Dealer

Gunakan layout konsisten:

Page Header

- Search
- Action
- Table

============================================================ 44. MASTER DEALER UI
============================================================

Tampilkan:

Kode
Nama
Kontak
Alamat
Status
Action

Default:

MD 1
MD 2
MD 3

Semua:

ALL BRAND.

============================================================ 45. DEALER UI
============================================================

Tampilkan:

Kode Dealer
Nama Dealer
Kontak
Alamat
Status
Catatan
Action

Dealer berarti:

Toko lain.

============================================================ 46. LAPORAN
============================================================

Laporan:

1. Inventaris
2. Barang Masuk
3. Barang Keluar

Layout:

Filter bar

- Summary jika diperlukan
- Table
- Export jika memang dibutuhkan

Jangan membuat laporan terlalu dekoratif.

============================================================ 47. INVENTORY LOGIC
============================================================

DISPLAY STOCK:

display_stock

PHYSICAL STOCK:

physical_stock

JANGAN menyamakan keduanya.

Nilai inventaris:

SUM(
physical_stock \* selling_price
)

Perhitungan dilakukan backend/database.

============================================================ 48. DATABASE
============================================================

Database:

inventaris_dhafi

Tables:

users
brands
categories
master_dealers
dealers
laptops
stock_transactions

Relasi:

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

JANGAN membuat:

purchase_requests
purchase_orders
procurement_requests
procurement_approvals
payments
invoices

============================================================ 49. API
============================================================

AUTH:

POST /api/auth/login
POST /api/auth/logout
GET /api/auth/me

PUBLIC:

GET /api/public/products
GET /api/public/products/:id

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

============================================================ 50. DASHBOARD API
============================================================

GET /api/dashboard

Response:

{
total_laptops,
total_new_laptops,
total_second_laptops,
estimated_physical_inventory_value,
stock_by_brand,
recent_transactions
}

Backend melakukan:

COUNT
SUM
GROUP BY
ORDER BY
LIMIT

Jangan menghitung nilai utama hanya di frontend.

============================================================ 51. FORMAT RUPIAH
============================================================

WAJIB:

Rp 8.500.000

Bukan:

8500000

Bukan:

8.5M

Bukan:

8.5e6

Gunakan:

Intl.NumberFormat('id-ID')

============================================================ 52. UX STATE
============================================================

Setiap halaman harus memiliki:

LOADING STATE

"Memuat data..."

EMPTY STATE

"Belum ada data."

ERROR STATE

"Data gagal dimuat."

NETWORK ERROR

"Tidak dapat terhubung ke server."

SUCCESS FEEDBACK

"Data berhasil disimpan."

DELETE CONFIRMATION:

"Apakah Anda yakin ingin menghapus data ini?"

============================================================ 53. BUTTON SYSTEM
============================================================

PRIMARY:

Untuk action utama.

Contoh:

- Tambah Laptop

SECONDARY:

Untuk action alternatif.

Contoh:

Batal

DANGER:

Untuk:

Hapus

SUCCESS:

Untuk:

Barang Masuk

Gunakan hierarchy.

Jangan semua button menggunakan warna primary.

============================================================ 54. MODAL
============================================================

Modal digunakan untuk:

- Confirmation
- Form kecil
- Informasi singkat

Modal tidak boleh terlalu besar.

Gunakan:

- Overlay
- Rounded container
- Clear title
- Action buttons

ESC dapat menutup modal jika sesuai.

============================================================ 55. TOAST / NOTIFICATION
============================================================

Gunakan toast untuk:

- Success
- Error
- Warning
- Info

Contoh:

"Data laptop berhasil disimpan."

"Stok tidak mencukupi."

Jangan menggunakan alert browser jika dapat dihindari.

============================================================ 56. RESPONSIVE
============================================================

Desktop:

Optimalkan untuk layar desktop.

Tablet:

Grid menyesuaikan.

Mobile:

- Sidebar menjadi drawer
- Table menjadi responsive
- Form menjadi 1 column
- Card menjadi 1 column
- Button dapat full width jika diperlukan

Tidak boleh ada:

- Horizontal overflow
- Text terpotong
- Button keluar layar
- Modal keluar viewport

============================================================ 57. ACCESSIBILITY
============================================================

Gunakan:

- Label form
- Semantic HTML
- Keyboard navigation
- Focus state
- Alt text
- Sufficient contrast
- Button dengan text/icon yang jelas

Jangan menggunakan icon sebagai satu-satunya
informasi tanpa accessible label.

============================================================ 58. ANIMATION
============================================================

Gunakan animasi minimal.

Contoh:

- Page transition ringan
- Hover
- Modal
- Dropdown
- Sidebar
- Toast

Durasi:

sekitar 150–300ms.

JANGAN:

- Animasi berlebihan
- Parallax berlebihan
- Loading animation yang mengganggu
- Efek neon

============================================================ 59. CODE QUALITY
============================================================

WAJIB:

- Reusable components
- Reusable API service
- Separation of concerns
- Clean naming
- Proper validation
- Proper error handling
- Environment variables
- Parameterized queries
- Secure authentication

HINDARI:

- Duplicate code
- Duplicate API
- Hardcoded data
- Dead code
- Unused imports
- Unused variables
- Business logic utama di frontend

============================================================ 60. ATURAN SEBELUM CODING
============================================================

SEBELUM MENGUBAH KODE:

1. Baca struktur project.
2. Baca package.json.
3. Baca database configuration.
4. Baca routes.
5. Baca controllers.
6. Baca models.
7. Baca services.
8. Baca middleware.
9. Baca frontend components.
10. Baca API service.
11. Periksa authentication.
12. Periksa database schema.
13. Periksa fitur yang sudah berjalan.

Setelah itu:

- Jelaskan bagian yang akan diubah.
- Hindari perubahan yang tidak diperlukan.
- Reuse kode yang sudah ada.
- Jangan membuat file duplikat.

============================================================ 61. ATURAN PERUBAHAN KODE
============================================================

JANGAN:

❌ Mengubah login yang sudah berjalan.
❌ Mengganti endpoint tanpa alasan.
❌ Mengganti nama database field tanpa alasan.
❌ Menghapus fitur yang sudah benar.
❌ Membuat dummy data sebagai data utama.
❌ Membuat API duplicate.
❌ Membuat file duplicate.
❌ Membuat procurement.
❌ Membuat User Management.
❌ Membuat role tambahan.
❌ Membuat supplier.

Jika membutuhkan perubahan:

Gunakan struktur project yang sudah ada terlebih dahulu.

============================================================ 62. DEVELOPMENT PRIORITY
============================================================

Kerjakan bertahap:

STEP 1
Audit Project

STEP 2
Modern Landing Page

STEP 3
Master Data

STEP 4
Data Laptop

STEP 5
Detail Laptop

STEP 6
Barang Masuk

STEP 7
Barang Keluar

STEP 8
Stock Logic

STEP 9
Dashboard

STEP 10
Laporan

STEP 11
Validation & Security

STEP 12
Testing

STEP 13
Final UI/UX Polish

STEP 14
Final Code Review

Jangan mengerjakan semuanya sekaligus.

Setiap tahap:

IMPLEMENT
↓
TEST
↓
FIX
↓
VERIFY
↓
NEXT

============================================================ 63. FINAL DASHBOARD STRUCTURE
============================================================

HEADER

Dashboard

"Ringkasan kondisi inventaris laptop Dhafi Komputer."

ROW 1

[ Total Laptop ]
[ Laptop Baru ]
[ Laptop Second ]
[ Estimasi Nilai Stok Fisik Inventaris ]

ROW 2

[ Ringkasan Stok Berdasarkan Brand ]

ROW 3

[ Transaksi Terbaru ]

TIDAK ADA BAGIAN LAIN.

============================================================ 64. FINAL PUBLIC WEBSITE STRUCTURE
============================================================

NAVBAR

↓
HERO

↓
TENTANG DHAFI KOMPUTER

↓
JENIS PRODUK

[ Laptop Baru ]
[ Laptop Second ]

↓
PRODUK TERSEDIA

[ Product ]
[ Product ]
[ Product ]
[ Product ]

↓
KEUNGGULAN DHAFI KOMPUTER

↓
INFORMASI TOKO

↓
FOOTER

============================================================ 65. FITUR YANG TIDAK BOLEH DITAMBAHKAN
============================================================

❌ Procurement
❌ Purchase Request
❌ Purchase Order
❌ Approval
❌ Pengadaan
❌ Pembayaran
❌ Checkout
❌ Cart
❌ Customer Login
❌ Customer Account
❌ User Management
❌ Multi-role
❌ Supplier
❌ Modul Keuangan
❌ Modul Akuntansi

============================================================ 66. FINAL DESIGN PRINCIPLE
============================================================

Aplikasi harus terasa seperti:

MODERN INVENTORY MANAGEMENT SYSTEM

- PROFESSIONAL COMPUTER STORE WEBSITE

Bukan:

❌ Template dashboard generik
❌ E-commerce
❌ ERP kompleks
❌ Procurement system
❌ Accounting system

Prioritas:

SIMPLE

- MODERN
- PROFESSIONAL
- EASY TO USE
- DATA ACCURATE
- CONSISTENT

Setiap halaman harus memiliki:

- Clear hierarchy
- Clear navigation
- Clear action
- Clear feedback
- Consistent spacing
- Consistent typography
- Consistent components

Jangan menambahkan fitur hanya untuk membuat aplikasi
terlihat lebih kompleks.

Jika sebuah elemen tidak membantu pengguna memahami,
mengelola, atau mengakses inventaris Dhafi Komputer,
pertimbangkan untuk tidak menambahkannya.

============================================================
FINAL PRINCIPLE
============================================================

"DHAFI KOMPUTER ADALAH WEBSITE TOKO YANG MEMPERKENALKAN
TOKO DAN MENAMPILKAN PRODUK LAPTOP YANG TERSEDIA,
DENGAN SISTEM ADMIN MODERN DI BELAKANGNYA UNTUK
MENGELOLA INVENTARIS."

SEMUA IMPLEMENTASI HARUS MENGIKUTI MASTER VIBE CODING INI
KECUALI SAYA MEMBERIKAN INSTRUKSI PERUBAHAN SECARA EKSPLISIT.
