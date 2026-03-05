import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AdminLayout from '@/layouts/AdminLayout';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import Dashboard from '@/pages/admin/Dashboard';
import Login from '@/pages/admin/Login';
import Categorias from '@/pages/admin/Categorias';
import Tipologias from '@/pages/admin/Tipologias';
import ConfiguracoesTecnicas from '@/pages/admin/ConfiguracoesTecnicas';
import Produtos from '@/pages/admin/Produtos';

export default function AdminRoutes() {
  return (
    <Routes>
      <Route path="login" element={<Login />} />
      <Route path="*" element={
        <ProtectedRoute>
          <AdminLayout>
            <Routes>
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="categorias" element={<Categorias />} />
              <Route path="tipologias" element={<Tipologias />} />
              <Route path="configuracoes-tecnicas" element={<ConfiguracoesTecnicas />} />
              <Route path="produtos" element={<Produtos />} />
              <Route path="" element={<Dashboard />} />
            </Routes>
          </AdminLayout>
        </ProtectedRoute>
      } />
    </Routes>
  );
}
