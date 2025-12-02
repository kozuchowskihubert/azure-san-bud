'use client';

import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';

export default function Navigation() {
  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const switchLocale = (newLocale: string) => {
    const currentPath = pathname.replace(`/${locale}`, '');
    router.push(`/${newLocale}${currentPath}`);
  };

  const navItems = [
    { label: t('navigation.home'), href: `/${locale}` },
    { label: t('navigation.services'), href: `/${locale}/services` },
    { label: t('navigation.about'), href: `/${locale}/about` },
    { label: t('navigation.contact'), href: `/${locale}/contact` },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm shadow-md z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href={`/${locale}`} className="flex items-center space-x-3 group">
            <div className="relative w-16 h-16 rounded-full overflow-hidden ring-2 ring-primary transition-transform group-hover:scale-105">
              <Image
                src="/images/logo.jpg"
                alt="SanBud Hydraulika Logo"
                fill
                className="object-cover"
                priority
              />
            </div>
            <div className="hidden md:block">
              <div className="text-2xl font-bold gradient-text">
                {t('common.companyName')}
              </div>
              <div className="text-xs text-gray-600 italic">
                {t('common.tagline')}
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-gray-700 hover:text-primary font-medium transition-colors relative group"
              >
                {item.label}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-primary group-hover:w-full transition-all duration-300"></span>
              </Link>
            ))}
          </div>

          {/* CTA and Language Switcher */}
          <div className="hidden lg:flex items-center space-x-4">
            {/* Emergency Badge */}
            <div className="flex items-center space-x-2 px-3 py-1 bg-red-50 rounded-full border border-red-200">
              <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
              <span className="text-sm font-semibold text-red-600">
                {t('common.emergencyBadge')}
              </span>
            </div>

            {/* Language Switcher */}
            <div className="flex items-center space-x-2 bg-gray-100 rounded-full p-1">
              <button
                onClick={() => switchLocale('pl')}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
                  locale === 'pl'
                    ? 'bg-primary text-white shadow-md'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                PL
              </button>
              <button
                onClick={() => switchLocale('en')}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
                  locale === 'en'
                    ? 'bg-primary text-white shadow-md'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                EN
              </button>
            </div>

            {/* Book Appointment Button */}
            <Link
              href={`/${locale}/contact`}
              className="btn-primary whitespace-nowrap"
            >
              {t('navigation.bookAppointment')}
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {mobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t animate-fade-in">
            <div className="flex flex-col space-y-3">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors font-medium"
                >
                  {item.label}
                </Link>
              ))}
              
              {/* Mobile Language Switcher */}
              <div className="flex items-center justify-center space-x-2 px-4 py-2">
                <button
                  onClick={() => {
                    switchLocale('pl');
                    setMobileMenuOpen(false);
                  }}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                    locale === 'pl'
                      ? 'bg-primary text-white shadow-md'
                      : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  Polski
                </button>
                <button
                  onClick={() => {
                    switchLocale('en');
                    setMobileMenuOpen(false);
                  }}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                    locale === 'en'
                      ? 'bg-primary text-white shadow-md'
                      : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  English
                </button>
              </div>

              {/* Mobile CTA */}
              <Link
                href={`/${locale}/contact`}
                onClick={() => setMobileMenuOpen(false)}
                className="btn-primary mx-4"
              >
                {t('navigation.bookAppointment')}
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
