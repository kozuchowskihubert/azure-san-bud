'use client';

import { useState, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Home, 
  Wrench, 
  FileImage, 
  Phone, 
  Globe, 
  Menu, 
  X,
  ChevronDown,
  MapPin,
  Facebook
} from 'lucide-react';
import ThemeToggle from './ThemeToggle';

export default function EnhancedNavigation() {
  const t = useTranslations();
  const locale = useLocale();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);

  const contactData = {
    phone: '+48 503 691 808',
    address: 'Warszawa, Mazowieckie',
    facebook: 'https://www.facebook.com/sanbud.hydraulika',
  };

  const navItems = [
    { label: 'Strona główna', href: `/${locale}`, icon: Home },
    { label: 'Usługi', href: `/${locale}/services`, icon: Wrench, hasDropdown: true },
    { label: 'Portfolio', href: `/${locale}/portfolio`, icon: FileImage },
    { label: 'Kontakt', href: `/${locale}/contact`, icon: Phone },
  ];

  const services = [
    { title: 'Instalacje wodne', href: `/${locale}/services#instalacje` },
    { title: 'Remonty łazienek', href: `/${locale}/services#remonty` },
    { title: 'Centralne ogrzewanie', href: `/${locale}/services#ogrzewanie` },
    { title: 'Pompy ciepła', href: `/${locale}/services#pompy` },
    { title: 'Serwis 24/7', href: `/${locale}/services#serwis` },
  ];

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [mobileMenuOpen]);

  const isActivePath = (href: string) => pathname === href;

  return (
    <>
      {/* Top Bar - Contact Info */}
      <div className="hidden lg:block bg-gradient-to-r from-blue-600 to-blue-700 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="flex items-center justify-between py-2 text-fluid-sm">
            <div className="flex items-center gap-6">
              <a 
                href={`tel:${contactData.phone.replace(/\s/g, '')}`}
                className="flex items-center gap-2 hover:text-blue-100 transition-colors"
              >
                <Phone className="w-4 h-4" />
                <span className="font-medium">{contactData.phone}</span>
              </a>
              <div className="flex items-center gap-2 text-blue-100">
                <MapPin className="w-4 h-4" />
                <span>{contactData.address}</span>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <a
                href={contactData.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-blue-100 transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
              
              {/* Language Switcher */}
              <div className="flex items-center gap-2 border-l border-blue-500 pl-4">
                <Globe className="w-4 h-4" />
                <button
                  onClick={() => {/* Switch to PL */}}
                  className={`px-2 py-0.5 rounded ${locale === 'pl' ? 'bg-white/20' : 'hover:bg-white/10'} transition-colors`}
                >
                  PL
                </button>
                <button
                  onClick={() => {/* Switch to EN */}}
                  className={`px-2 py-0.5 rounded ${locale === 'en' ? 'bg-white/20' : 'hover:bg-white/10'} transition-colors`}
                >
                  EN
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <nav 
        className={`
          sticky top-0 z-50 w-full transition-all duration-300
          ${scrolled 
            ? 'bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-lg' 
            : 'bg-white dark:bg-gray-900 shadow-md'
          }
        `}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link 
              href={`/${locale}`}
              className="flex items-center gap-3 group"
            >
              <div className="relative w-12 h-12 rounded-full overflow-hidden ring-2 ring-blue-500/20 group-hover:ring-blue-500/40 transition-all">
                <Image
                  src="/images/logo.png"
                  alt="SAN-BUD Logo"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="hidden sm:block">
                <div className="text-fluid-h5 font-bold text-gray-900 dark:text-white">
                  SAN-BUD
                </div>
                <div className="text-fluid-xs text-gray-500 dark:text-gray-400">
                  Hydraulika Nasza Pasja
                </div>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = isActivePath(item.href);
                
                if (item.hasDropdown) {
                  return (
                    <div 
                      key={item.label}
                      className="relative"
                      onMouseEnter={() => setServicesOpen(true)}
                      onMouseLeave={() => setServicesOpen(false)}
                    >
                      <Link
                        href={item.href}
                        className={`
                          flex items-center gap-2 px-4 py-2 rounded-lg text-fluid-base font-medium
                          transition-all duration-200
                          ${isActive 
                            ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/30' 
                            : 'text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                          }
                        `}
                      >
                        <Icon className="w-5 h-5" />
                        {item.label}
                        <ChevronDown className={`w-4 h-4 transition-transform ${servicesOpen ? 'rotate-180' : ''}`} />
                      </Link>
                      
                      {/* Services Dropdown */}
                      {servicesOpen && (
                        <div className="absolute top-full left-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 py-2 animate-in fade-in slide-in-from-top-2 duration-200">
                          {services.map((service) => (
                            <Link
                              key={service.title}
                              href={service.href}
                              className="block px-4 py-3 text-fluid-sm text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-950/30 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                            >
                              {service.title}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                }
                
                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    className={`
                      flex items-center gap-2 px-4 py-2 rounded-lg text-fluid-base font-medium
                      transition-all duration-200
                      ${isActive 
                        ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/30' 
                        : 'text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                      }
                    `}
                  >
                    <Icon className="w-5 h-5" />
                    {item.label}
                  </Link>
                );
              })}
            </div>

            {/* Desktop CTA + Theme Toggle */}
            <div className="hidden lg:flex items-center gap-3">
              <ThemeToggle />
              <Link
                href={`/${locale}/contact`}
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-blue-800 shadow-md hover:shadow-lg transition-all duration-200 active:scale-95"
              >
                <Phone className="w-5 h-5" />
                Zadzwoń teraz
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <div className="flex items-center gap-3 lg:hidden">
              <ThemeToggle />
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                aria-label={mobileMenuOpen ? 'Zamknij menu' : 'Otwórz menu'}
              >
                {mobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
            <div className="container mx-auto px-4 py-6 space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = isActivePath(item.href);
                
                return (
                  <div key={item.label}>
                    <Link
                      href={item.href}
                      onClick={() => !item.hasDropdown && setMobileMenuOpen(false)}
                      className={`
                        flex items-center gap-3 px-4 py-3 rounded-lg text-fluid-lg font-medium
                        transition-all duration-200
                        ${isActive 
                          ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/30' 
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                        }
                      `}
                    >
                      <Icon className="w-6 h-6" />
                      {item.label}
                    </Link>
                    
                    {item.hasDropdown && (
                      <div className="ml-9 mt-2 space-y-1">
                        {services.map((service) => (
                          <Link
                            key={service.title}
                            href={service.href}
                            onClick={() => setMobileMenuOpen(false)}
                            className="block px-4 py-2 text-fluid-base text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                          >
                            {service.title}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
              
              {/* Mobile CTA */}
              <Link
                href={`/${locale}/contact`}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 w-full px-6 py-3 mt-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-lg shadow-md"
              >
                <Phone className="w-5 h-5" />
                Zadzwoń teraz
              </Link>
            </div>
          </div>
        )}
      </nav>
    </>
  );
}
