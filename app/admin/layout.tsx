'use client';

import '../globals.css';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { ThemeProvider } from '@/contexts/ThemeContext';
import ThemeToggle from '@/components/ThemeToggle';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isLoginPage = pathname === '/admin/login';

  if (isLoginPage) {
    return (
      <html lang="pl">
        <body className="bg-gray-100 dark:bg-gray-900">
          <ThemeProvider>
            {children}
          </ThemeProvider>
        </body>
      </html>
    );
  }

  const navItems = [
    { href: '/admin/dashboard', label: 'Dashboard', icon: '📊' },
    { href: '/admin/clients', label: 'Klienci', icon: '👥' },
    { href: '/admin/services', label: 'Usługi', icon: '🔧' },
    { href: '/admin/appointments', label: 'Wizyty', icon: '📅' },
    { href: '/admin/messages', label: 'Wiadomości', icon: '💬' },
  ];

  return (
    <html lang="pl">
      <body className="bg-gray-100 dark:bg-gray-900">
        <ThemeProvider>
          <div className="min-h-screen flex">
            {/* Sidebar */}
            <aside className="w-64 bg-gradient-to-b from-green-900 to-green-800 dark:from-green-950 dark:to-green-900 text-white flex flex-col">
              {/* Logo */}
              <div className="p-6 border-b border-green-700 dark:border-green-800">
                <Link href="/admin/dashboard" className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-white dark:bg-gray-800 rounded-lg flex items-center justify-center">
                    <span className="text-green-900 dark:text-green-500 font-bold text-xl">S</span>
                  </div>
                  <div>
                    <h1 className="text-xl font-bold">SanBud</h1>
                    <p className="text-xs text-green-300 dark:text-green-400">Panel Admina</p>
                  </div>
                </Link>
              </div>

              {/* Navigation */}
              <nav className="flex-1 p-4 space-y-2">
                {navItems.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
                        isActive
                          ? 'bg-white dark:bg-gray-800 text-green-900 dark:text-green-400 shadow-lg'
                          : 'text-green-100 dark:text-green-300 hover:bg-green-700 dark:hover:bg-green-800 hover:text-white'
                      }`}
                    >
                      <span className="text-xl">{item.icon}</span>
                      <span className="font-medium">{item.label}</span>
                    </Link>
                  );
                })}
              </nav>

              {/* Theme Toggle & Logout */}
              <div className="p-4 border-t border-green-700 dark:border-green-800">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-green-700 dark:bg-green-800 rounded-full flex items-center justify-center">
                      <span className="text-lg">👤</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Administrator</p>
                      <p className="text-xs text-green-300 dark:text-green-400">admin@sanbud24.pl</p>
                    </div>
                  </div>
                  <ThemeToggle />
                </div>
                <button
                  onClick={() => {
                    localStorage.removeItem('admin');
                    window.location.href = '/admin/login';
                  }}
                  className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-600 rounded-lg text-sm font-medium transition-colors"
                >
                  Wyloguj się
                </button>
              </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-auto">
              {children}
            </main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
