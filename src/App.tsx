import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { RestaurantProvider } from './context/RestaurantContext';

// Customer layout & pages
import { CustomerLayout } from './layouts/CustomerLayout';
import { MenuPage } from './pages/customer/MenuPage';
import { CartPage } from './pages/customer/CartPage';
import { CheckoutPage } from './pages/customer/CheckoutPage';
import { OrderSuccessPage } from './pages/customer/OrderSuccessPage';
import { MyOrdersPage } from './pages/customer/MyOrdersPage';
import { OrderTrackingPage } from './pages/customer/OrderTrackingPage';
import { LoginPage } from './pages/customer/LoginPage';
import { RegisterPage } from './pages/customer/RegisterPage';
import { ProfilePage } from './pages/customer/ProfilePage';
import { ReservationPage } from './pages/customer/ReservationPage';
import { ReviewsPage } from './pages/customer/ReviewsPage';
import { ContactPage } from './pages/customer/ContactPage';

// Admin layout & pages
import { AdminLayout } from './layouts/AdminLayout';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { AdminOrdersPage } from './pages/admin/AdminOrdersPage';
import { AdminTablesPage } from './pages/admin/AdminTablesPage';
import { AdminMenuPage } from './pages/admin/AdminMenuPage';
import { AdminCategoriesPage } from './pages/admin/AdminCategoriesPage';
import { AdminCustomersPage } from './pages/admin/AdminCustomersPage';
import { AdminPaymentsPage } from './pages/admin/AdminPaymentsPage';
import { AdminSettingsPage } from './pages/admin/AdminSettingsPage';
import { AdminAdvertisementsPage } from './pages/admin/AdminAdvertisementsPage';
import { AdminGalleryPage } from './pages/admin/AdminGalleryPage';
import { AdminReservationsPage } from './pages/admin/AdminReservationsPage';

export default function App() {
  return (
    <RestaurantProvider>
      <BrowserRouter>
        <Routes>
          {/* Customer Front-of-House Experience */}
          <Route element={<CustomerLayout />}>
            <Route path="/" element={<Navigate to="/menu" replace />} />
            <Route path="/menu" element={<MenuPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/order-success" element={<OrderSuccessPage />} />
            <Route path="/my-orders" element={<MyOrdersPage />} />
            <Route path="/order/:id" element={<OrderTrackingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/reservation" element={<ReservationPage />} />
            <Route path="/reviews" element={<ReviewsPage />} />
            <Route path="/contact" element={<ContactPage />} />
          </Route>

          {/* Admin Back-of-House Management Console */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboardPage />} />
            <Route path="orders" element={<AdminOrdersPage />} />
            <Route path="reservations" element={<AdminReservationsPage />} />
            <Route path="tables" element={<AdminTablesPage />} />
            <Route path="menu" element={<AdminMenuPage />} />
            <Route path="gallery" element={<AdminGalleryPage />} />
            <Route path="categories" element={<AdminCategoriesPage />} />
            <Route path="customers" element={<AdminCustomersPage />} />
            <Route path="payments" element={<AdminPaymentsPage />} />
            <Route path="advertisements" element={<AdminAdvertisementsPage />} />
            <Route path="settings" element={<AdminSettingsPage />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/menu" replace />} />
        </Routes>
      </BrowserRouter>
    </RestaurantProvider>
  );
}
