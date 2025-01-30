import { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { PrivateRoute } from './PrivateRoute';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { user, signOut } = useAuth();

  return (
    <PrivateRoute>
      <div className="min-h-screen bg-gray-100">
        <nav className="bg-white shadow-lg">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex justify-between h-16">
              <div className="flex">
                <Link
                  to="/"
                  className="flex-shrink-0 flex items-center text-purple-600 font-bold text-xl"
                >
                  LTII
                </Link>
              </div>

              <div className="flex items-center">
                {user && (
                  <>
                    {user.is_admin && (
                      <Link
                        to="/admin/dashboard"
                        className="text-gray-700 hover:text-purple-600 px-3 py-2 rounded-md text-sm font-medium"
                      >
                        Admin
                      </Link>
                    )}
                    <button
                      onClick={() => signOut()}
                      className="ml-4 text-gray-700 hover:text-purple-600 px-3 py-2 rounded-md text-sm font-medium"
                    >
                      Sair
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </nav>

        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          {children}
        </main>
      </div>
    </PrivateRoute>
  );
}
