import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// Pages & Components
import PublicHomePage from './pages/PublicHomePage';
import PublicCatalogPage from './pages/PublicCatalogPage';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminLayout from './components/AdminLayout';
import AdminDashboardPage from './pages/AdminDashboardPage';
import AdminLaptopsPage from './pages/AdminLaptopsPage';
import AdminLaptopDetailPage from './pages/AdminLaptopDetailPage';
import AdminLaptopCreatePage from './pages/AdminLaptopCreatePage';
import AdminLaptopEditPage from './pages/AdminLaptopEditPage';
import AdminTransactionsPage from './pages/AdminTransactionsPage';
import AdminTransactionInPage from './pages/AdminTransactionInPage';
import AdminTransactionOutPage from './pages/AdminTransactionOutPage';
import AdminTransactionHistoryPage from './pages/AdminTransactionHistoryPage';
import AdminMasterDataPage from './pages/AdminMasterDataPage';
import AdminBrandCreatePage from './pages/AdminBrandCreatePage';
import AdminBrandEditPage from './pages/AdminBrandEditPage';
import AdminCategoryCreatePage from './pages/AdminCategoryCreatePage';
import AdminCategoryEditPage from './pages/AdminCategoryEditPage';
import AdminMasterDealerCreatePage from './pages/AdminMasterDealerCreatePage';
import AdminMasterDealerEditPage from './pages/AdminMasterDealerEditPage';
import AdminDealerCreatePage from './pages/AdminDealerCreatePage';
import AdminDealerEditPage from './pages/AdminDealerEditPage';
import AdminReportsPage from './pages/AdminReportsPage';
import AdminReportPrintPage from './pages/AdminReportPrintPage';

// Protected Route Wrapper for Admin
const ProtectedAdminRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400">
        <div className="inline-block w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin mb-3"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Website */}
          <Route path="/" element={<PublicHomePage />} />
          <Route path="/products" element={<PublicCatalogPage />} />
          <Route path="/katalog" element={<PublicCatalogPage />} />
          <Route path="/laptops" element={<PublicCatalogPage />} />

          {/* Admin Login */}
          <Route path="/admin/login" element={<AdminLoginPage />} />

          {/* Admin Protected Area */}
          <Route
            path="/admin"
            element={
              <ProtectedAdminRoute>
                <AdminLayout />
              </ProtectedAdminRoute>
            }
          >
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboardPage />} />
            <Route path="laptops" element={<AdminLaptopsPage />} />
            <Route path="laptops/create" element={<AdminLaptopCreatePage />} />
            <Route path="laptops/tambah" element={<AdminLaptopCreatePage />} />
            <Route path="laptops/:id" element={<AdminLaptopDetailPage />} />
            <Route path="laptops/:id/edit" element={<AdminLaptopEditPage />} />
            <Route path="laptops/edit/:id" element={<AdminLaptopEditPage />} />
            <Route path="transactions" element={<AdminTransactionHistoryPage />} />
            <Route path="transactions/history" element={<AdminTransactionHistoryPage />} />
            <Route path="transactions/riwayat" element={<AdminTransactionHistoryPage />} />
            <Route path="transactions/in" element={<AdminTransactionInPage />} />
            <Route path="transactions/masuk" element={<AdminTransactionInPage />} />
            <Route path="transactions/barang-masuk" element={<AdminTransactionInPage />} />
            <Route path="transactions/create-in" element={<AdminTransactionInPage />} />
            <Route path="transactions/out" element={<AdminTransactionOutPage />} />
            <Route path="transactions/keluar" element={<AdminTransactionOutPage />} />
            <Route path="transactions/barang-keluar" element={<AdminTransactionOutPage />} />
            <Route path="transactions/create-out" element={<AdminTransactionOutPage />} />
            <Route path="master-data" element={<AdminMasterDataPage />} />
            <Route path="master-data/brands/create" element={<AdminBrandCreatePage />} />
            <Route path="master-data/brands/tambah" element={<AdminBrandCreatePage />} />
            <Route path="master-data/brands/:id/edit" element={<AdminBrandEditPage />} />
            <Route path="master-data/brands/edit/:id" element={<AdminBrandEditPage />} />
            <Route path="master-data/categories/create" element={<AdminCategoryCreatePage />} />
            <Route path="master-data/categories/tambah" element={<AdminCategoryCreatePage />} />
            <Route path="master-data/categories/:id/edit" element={<AdminCategoryEditPage />} />
            <Route path="master-data/categories/edit/:id" element={<AdminCategoryEditPage />} />
            <Route path="master-data/master-dealers/create" element={<AdminMasterDealerCreatePage />} />
            <Route path="master-data/master-dealers/tambah" element={<AdminMasterDealerCreatePage />} />
            <Route path="master-data/master-dealers/:id/edit" element={<AdminMasterDealerEditPage />} />
            <Route path="master-data/master-dealers/edit/:id" element={<AdminMasterDealerEditPage />} />
            <Route path="master-data/dealers/create" element={<AdminDealerCreatePage />} />
            <Route path="master-data/dealers/tambah" element={<AdminDealerCreatePage />} />
            <Route path="master-data/dealers/:id/edit" element={<AdminDealerEditPage />} />
            <Route path="master-data/dealers/edit/:id" element={<AdminDealerEditPage />} />
            <Route path="brands/create" element={<AdminBrandCreatePage />} />
            <Route path="brands/:id/edit" element={<AdminBrandEditPage />} />
            <Route path="categories/create" element={<AdminCategoryCreatePage />} />
            <Route path="categories/:id/edit" element={<AdminCategoryEditPage />} />
            <Route path="master-dealers/create" element={<AdminMasterDealerCreatePage />} />
            <Route path="master-dealers/:id/edit" element={<AdminMasterDealerEditPage />} />
            <Route path="dealers/create" element={<AdminDealerCreatePage />} />
            <Route path="dealers/:id/edit" element={<AdminDealerEditPage />} />
            <Route path="reports" element={<AdminReportsPage />} />
          </Route>

          {/* Standalone Report Print View */}
          <Route
            path="/admin/reports/print"
            element={
              <ProtectedAdminRoute>
                <AdminReportPrintPage />
              </ProtectedAdminRoute>
            }
          />
          <Route
            path="/admin/reports/cetak"
            element={
              <ProtectedAdminRoute>
                <AdminReportPrintPage />
              </ProtectedAdminRoute>
            }
          />

          {/* Fallback 404 */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
