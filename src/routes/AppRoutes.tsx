import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Login from '../pages/Login';
import Dashboard from '../pages/Dashboard';
import AdminDashboard from '../pages/AdminDashboard';
import Navbar from '../components/Navbar';
import { PrivateRoute } from '../components/PrivateRoute';
import { UnauthorizedAccess } from '../components/UnauthorizedAccess';

export default function AppRoutes() {
  const { user, userRole, loading } = useAuth();

  // Show nothing while loading to prevent flash
  if (loading) return null;

  const getDefaultRoute = () => {
    if (!userRole) return '/unauthorized';
    return userRole === 'admin' ? '/admin' : '/dashboard';
  };

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/unauthorized" element={<UnauthorizedAccess />} />
      <Route
        path="*"
        element={
          user && !userRole ? (
            <Navigate to="/unauthorized" replace />
          ) : (
            <PrivateRoute allowedRoles={['producer', 'admin']}>
              <div className="min-h-screen bg-gray-100">
                <Navbar />
                <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                  <Routes>
                    <Route 
                      path="/" 
                      element={<Navigate to={getDefaultRoute()} replace />} 
                    />
                    <Route
                      path="/dashboard"
                      element={
                        <PrivateRoute allowedRoles={['producer']}>
                          <Dashboard />
                        </PrivateRoute>
                      }
                    />
                    <Route
                      path="/admin"
                      element={
                        <PrivateRoute allowedRoles={['admin']}>
                          <AdminDashboard />
                        </PrivateRoute>
                      }
                    />
                    <Route 
                      path="*" 
                      element={<Navigate to={getDefaultRoute()} replace />}
                    />
                  </Routes>
                </main>
              </div>
            </PrivateRoute>
          )
        }
      />
    </Routes>
  );
}