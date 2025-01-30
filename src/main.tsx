import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { ChakraProvider } from '@chakra-ui/react'
import { AuthProvider } from './contexts/AuthContext'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import AdminDashboard from './pages/AdminDashboard'
import Conversation from './pages/Conversation'
import Help from './pages/Help'
import Login from './pages/Login'
import Register from './pages/Register'
import './styles/global.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ChakraProvider>
      <Router>
        <AuthProvider>
          <Routes>
            {/* Rotas públicas */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Rotas protegidas dentro do Layout */}
            <Route element={<Layout />}>
              {/* Redireciona / para a rota apropriada */}
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              
              {/* Rotas comuns */}
              <Route path="/conversation" element={<Conversation />} />
              <Route path="/help" element={<Help />} />
              
              {/* Rotas específicas */}
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/dashboard" element={<Dashboard />} />
            </Route>
          </Routes>
        </AuthProvider>
      </Router>
    </ChakraProvider>
  </React.StrictMode>,
)
