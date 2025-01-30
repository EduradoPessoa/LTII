import React from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { ChartBarIcon, ChatBubbleLeftRightIcon, QuestionMarkCircleIcon, ArrowLeftOnRectangleIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../contexts/AuthContext';
import PrivateRoute from './PrivateRoute';

// Links de navegação comuns para admin e usuários
const commonNavigation = [
  { name: 'Conversação', href: '/conversation', icon: ChatBubbleLeftRightIcon },
  { name: 'Ajuda', href: '/help', icon: QuestionMarkCircleIcon },
];

// Links específicos para cada tipo de usuário
const adminNavigation = [
  { name: 'Dashboard Admin', href: '/admin/dashboard', icon: ChartBarIcon },
  ...commonNavigation
];

const userNavigation = [
  { name: 'Dashboard', href: '/dashboard', icon: ChartBarIcon },
  ...commonNavigation
];

export default function Layout() {
  const location = useLocation();
  const { user, activeProfile, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  return (
    <PrivateRoute>
      <div className="min-h-screen bg-gray-50">
        {/* Sidebar para desktop */}
        <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
          <div className="flex flex-grow flex-col overflow-y-auto border-r border-gray-200 bg-white pt-5 pb-4">
            <div className="flex flex-shrink-0 items-center px-4">
              <h1 className="text-xl font-bold text-indigo-600">LTII</h1>
            </div>
            
            {/* Informações do perfil */}
            <div className="mt-5 px-4">
              <div className="flex flex-col items-start">
                <span className="text-sm font-medium text-gray-900">{activeProfile?.name}</span>
                <span className="text-xs text-gray-500">{activeProfile?.email}</span>
              </div>
            </div>

            <div className="mt-5 flex flex-grow flex-col">
              <nav className="flex-1 space-y-1 px-2">
                {(user?.isAdmin ? adminNavigation : userNavigation).map((item) => {
                  const isActive = location.pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                        isActive
                          ? 'bg-indigo-50 text-indigo-600'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                    >
                      <item.icon
                        className={`mr-3 h-6 w-6 flex-shrink-0 ${
                          isActive ? 'text-indigo-600' : 'text-gray-400 group-hover:text-gray-500'
                        }`}
                        aria-hidden="true"
                      />
                      {item.name}
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* Botão de logout */}
            <div className="px-4 py-2">
              <button
                onClick={handleLogout}
                className="w-full flex items-center px-2 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-md"
              >
                <ArrowLeftOnRectangleIcon className="mr-3 h-6 w-6 flex-shrink-0 text-red-500" aria-hidden="true" />
                Sair
              </button>
            </div>
          </div>
        </div>

        {/* Conteúdo principal */}
        <div className="lg:pl-64">
          <main className="flex-1">
            <Outlet />
          </main>
        </div>
      </div>
    </PrivateRoute>
  );
}
