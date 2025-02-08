import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Login from '../pages/Login';
import AdminDashboard from '../pages/admin/AdminDashboard';
import Dashboard from '../pages/Dashboard';
import Navbar from '../components/Navbar';
import { PrivateRoute } from '../components/PrivateRoute';

export default function AppRoutes() {
  const { user, userRole, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-12 bg-indigo-200 rounded-full mb-4"></div>
          <div className="h-4 w-32 bg-indigo-100 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      
      {/* Admin Routes */}
      <Route
        path="/admin/*"
        element={
          <PrivateRoute allowedRoles={['admin']}>
            <div className="min-h-screen bg-gray-100">
              <Navbar />
              <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                <AdminDashboard />
              </main>
            </div>
          </PrivateRoute>
        }
      />

      {/* Producer Routes */}
      <Route
        path="/dashboard"
        element={
          <PrivateRoute allowedRoles={['producer']}>
            <div className="min-h-screen bg-gray-100">
              <Navbar />
              <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                <Dashboard />
              </main>
            </div>
          </PrivateRoute>
        }
      />

      {/* Redirect root to appropriate dashboard */}
      <Route
        path="/"
        element={
          user ? (
            <Navigate to={userRole === 'admin' ? '/admin' : '/dashboard'} replace />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />

      {/* Catch all other routes */}
      <Route
        path="*"
        element={
          user ? (
            <Navigate to={userRole === 'admin' ? '/admin' : '/dashboard'} replace />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
    </Routes>
  );
}