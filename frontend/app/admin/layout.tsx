'use client';

import type { Metadata } from 'next';
import '../globals.css';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

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
        <body className="bg-gray-100">{children}</body>
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
      <body className="bg-gray-100">
        <div className="min-h-screen flex">
          {/* Sidebar */}
          <aside className="w-64 bg-gradient-to-b from-blue-900 to-blue-800 text-white flex flex-col">
            {/* Logo */}
            <div className="p-6 border-b border-blue-700">
              <Link href="/admin/dashboard" className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                  <span className="text-blue-900 font-bold text-xl">S</span>
                </div>
                <div>
                  <h1 className="text-xl font-bold">SanBud</h1>
                  <p className="text-xs text-blue-300">Panel Admina</p>
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
                        ? 'bg-white text-blue-900 shadow-lg'
                        : 'text-blue-100 hover:bg-blue-700 hover:text-white'
                    }`}
                  >
                    <span className="text-xl">{item.icon}</span>
                    <span className="font-medium">{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            {/* User Info & Logout */}
            <div className="p-4 border-t border-blue-700">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-blue-700 rounded-full flex items-center justify-center">
                  <span className="text-lg">👤</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Administrator</p>
                  <p className="text-xs text-blue-300">admin@sanbud24.pl</p>
                </div>
              </div>
              <button
                onClick={() => {
                  // Handle logout
                  window.location.href = '/admin/login';
                }}
                className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-sm font-medium transition-colors"
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
      </body>
    </html>
  );
}
