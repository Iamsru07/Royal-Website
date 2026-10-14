import React, { useState, useEffect } from 'react';
import { Outlet, Navigate, useLocation } from 'react-router-dom';
import { AdminSidebar } from '../components/admin/AdminSidebar';
import { ToastContainer } from '../components/common/ToastContainer';

export const AdminLayout: React.FC = () => {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const location = useLocation();

  // Check admin authentication session
  const [isAdminAuth, setIsAdminAuth] = useState<boolean>(() => {
    if (typeof window === 'undefined') return true;
    return (
      sessionStorage.getItem('royal_taste_admin_authenticated') === 'true' ||
      localStorage.getItem('royal_taste_admin_authenticated') === 'true'
    );
  });

  useEffect(() => {
    const auth =
      sessionStorage.getItem('royal_taste_admin_authenticated') === 'true' ||
      localStorage.getItem('royal_taste_admin_authenticated') === 'true';
    setIsAdminAuth(auth);
  }, [location.pathname]);

  // If not authenticated, redirect to Login page in admin mode
  if (!isAdminAuth) {
    return <Navigate to="/login?mode=admin" replace />;
  }

  return (
    <div className="min-h-screen flex bg-[#F8F9FA] text-neutral-900">
      <AdminSidebar
        isOpen={isMobileSidebarOpen}
        onClose={() => setIsMobileSidebarOpen(false)}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <Outlet context={{ toggleSidebar: () => setIsMobileSidebarOpen(true) }} />
      </div>

      <ToastContainer />
    </div>
  );
};
