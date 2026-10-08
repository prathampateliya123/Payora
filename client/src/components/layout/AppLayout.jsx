import { useAuth } from '../../hooks/useAuth';
import { LogOut } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

export const AppLayout = ({ children, title, subtitle }) => {
  const { logout } = useAuth();
  const location = useLocation();

  const navLinks = [
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'Subscription', href: '/subscription' },
    { name: 'Billing', href: '/billing' },
    { name: 'Transactions', href: '/transactions' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center space-x-8">
              <h1 className="text-xl font-bold text-gray-900 tracking-tight">Payora</h1>
              <div className="hidden md:flex space-x-4">
                {navLinks.map(link => (
                  <Link
                    key={link.name}
                    to={link.href}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition ${
                      location.pathname.startsWith(link.href)
                        ? 'bg-blue-50 text-blue-700'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
            </div>
            <div className="flex items-center">
              <button
                onClick={logout}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-gray-500 hover:text-gray-700 focus:outline-none transition"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Page Header */}
      {title && (
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold leading-tight text-gray-900">
              {title}
            </h2>
            {subtitle && (
              <p className="mt-1 text-sm text-gray-500">{subtitle}</p>
            )}
          </div>
        </header>
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
};
