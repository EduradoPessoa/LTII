import { Routes, Route } from 'react-router-dom';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Dashboard from '../pages/Dashboard';
import AdminDashboard from '../pages/AdminDashboard';
import Conversation from '../pages/Conversation';
import PrivateRoute from '../components/PrivateRoute';
import Layout from '../components/Layout';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <Layout>
              <Dashboard />
            </Layout>
          </PrivateRoute>
        }
      />
      <Route
        path="/admin/dashboard"
        element={
          <PrivateRoute requireAdmin>
            <Layout>
              <AdminDashboard />
            </Layout>
          </PrivateRoute>
        }
      />
      <Route
        path="/conversation"
        element={
          <PrivateRoute>
            <Layout>
              <Conversation />
            </Layout>
          </PrivateRoute>
        }
      />
      <Route path="/" element={<Login />} />
    </Routes>
  );
}
