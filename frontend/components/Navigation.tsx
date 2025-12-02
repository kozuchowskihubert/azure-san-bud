'use client';

import { useState, useEffect, useRef } from 'react';
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
  const [scrolled, setScrolled] = useState(false);
  const [servicesMenuOpen, setServicesMenuOpen] = useState(false);
  const servicesMenuRef = useRef<HTMLDivElement>(null);

  // Dane kontaktowe
  const contactData = {
    phone: '+48 503 691 808',
    googleMaps: 'https://www.google.com/maps/place/San-Bud+Hydraulika+Nasza+pasja/@52.6330895,20.3494125',
    facebook: 'https://www.facebook.com/sanbud',
  };

  // Usługi dla mega menu
  const services = [
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
        </svg>
      ),
      title: 'Instalacje wodne',
      description: 'Kompleksowe systemy wodno-kanalizacyjne',
      href: `/${locale}/services#instalacje`,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
      title: 'Remonty łazienek',
      description: 'Od projektu po wykończenie',
      href: `/${locale}/services#remonty`,
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      title: 'Serwis i naprawy',
      description: 'Szybkie interwencje 24/7',
      href: `/${locale}/services#serwis`,
      color: 'from-orange-500 to-red-500'
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" />
        </svg>
      ),
      title: 'Centralne ogrzewanie',
      description: 'Montaż i modernizacja',
      href: `/${locale}/services#ogrzewanie`,
      color: 'from-red-500 to-orange-600'
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      title: 'Pompy ciepła',
      description: 'Ekologiczne rozwiązania',
      href: `/${locale}/services#pompy`,
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
        </svg>
      ),
      title: 'Uzdatnianie wody',
      description: 'Filtry i zmiękczacze',
      href: `/${locale}/services#uzdatnianie`,
      color: 'from-cyan-500 to-blue-500'
    },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (servicesMenuRef.current && !servicesMenuRef.current.contains(event.target as Node)) {
        setServicesMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const switchLocale = (newLocale: string) => {
    const currentPath = pathname.replace(`/${locale}`, '');
    router.push(`/${newLocale}${currentPath}`);
  };

  const navItems = [
    { 
      label: 'Strona główna', 
      href: `/${locale}`,
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      )
    },
    { 
      label: 'Usługi', 
      href: `/${locale}/services`,
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      hasDropdown: true 
    },
    { 
      label: 'Portfolio', 
      href: `/${locale}/portfolio`,
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      )
    },
    { 
      label: 'O nas', 
      href: `/${locale}/about`,
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    { 
      label: 'Kontakt', 
      href: `/${locale}/contact`,
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      )
    },
  ];

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled 
          ? 'bg-white/95 backdrop-blur-xl shadow-2xl border-b border-gray-200' 
          : 'bg-gradient-to-b from-black/50 to-transparent backdrop-blur-sm'
      }`}>
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            
            {/* Logo - Premium Design */}
            <Link href={`/${locale}`} className="flex items-center space-x-4 group relative">
              <div className="absolute -inset-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl opacity-0 group-hover:opacity-20 blur-xl transition-all duration-500"></div>
              <div className="relative w-16 h-16 rounded-2xl overflow-hidden ring-2 ring-blue-500/30 shadow-2xl transition-all duration-300 group-hover:scale-110 group-hover:ring-4 group-hover:ring-blue-500/50 group-hover:shadow-blue-500/50">
                <Image
                  src="/images/logo.jpg"
                  alt="SanBud Hydraulika Logo"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
              <div className="hidden md:block">
                <div className="text-2xl font-black bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-clip-text text-transparent animate-gradient bg-[length:200%_auto]">
                  SAN-BUD
                </div>
                <div className={`text-sm font-medium transition-colors ${scrolled ? 'text-gray-600' : 'text-white/90'}`}>
                  Hydraulika • Nasza pasja
                </div>
              </div>
            </Link>

            {/* Desktop Navigation - Premium */}
            <div className="hidden lg:flex items-center space-x-1">
              {navItems.map((item, index) => (
                <div key={item.href} className="relative" ref={item.hasDropdown ? servicesMenuRef : undefined}>
                  {item.hasDropdown ? (
                    <button
                      onClick={() => setServicesMenuOpen(!servicesMenuOpen)}
                      className={`px-5 py-2.5 rounded-xl font-semibold transition-all duration-300 flex items-center gap-2 group ${
                        pathname.includes('/services')
                          ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-500/50'
                          : scrolled
                          ? 'text-gray-700 hover:bg-gray-100'
                          : 'text-white hover:bg-white/10 backdrop-blur-sm'
                      }`}
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <span className="group-hover:scale-110 transition-transform">{item.icon}</span>
                      <span>{item.label}</span>
                      <svg 
                        className={`w-4 h-4 transition-transform duration-300 ${servicesMenuOpen ? 'rotate-180' : ''}`}
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                  ) : (
                    <Link
                      href={item.href}
                      className={`px-5 py-2.5 rounded-xl font-semibold transition-all duration-300 flex items-center gap-2 group animate-fade-in ${
                        pathname === item.href
                          ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-500/50'
                          : scrolled
                          ? 'text-gray-700 hover:bg-gray-100'
                          : 'text-white hover:bg-white/10 backdrop-blur-sm'
                      }`}
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <span className="group-hover:scale-110 transition-transform">{item.icon}</span>
                      <span>{item.label}</span>
                    </Link>
                  )}

                  {/* Mega Menu Dropdown */}
                  {item.hasDropdown && servicesMenuOpen && (
                    <div className="absolute top-full left-0 mt-2 w-[600px] bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden animate-slide-down">
                      <div className="p-6">
                        <div className="mb-4">
                          <h3 className="text-lg font-bold text-gray-900 mb-1">Nasze usługi</h3>
                          <p className="text-sm text-gray-600">Kompleksowe rozwiązania hydrauliczne</p>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          {services.map((service, idx) => (
                            <Link
                              key={idx}
                              href={service.href}
                              onClick={() => setServicesMenuOpen(false)}
                              className="group p-4 rounded-xl hover:bg-gray-50 transition-all duration-300 border border-transparent hover:border-blue-200 hover:shadow-md"
                            >
                              <div className="flex items-start gap-3">
                                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${service.color} flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform`}>
                                  {service.icon}
                                </div>
                                <div className="flex-1">
                                  <h4 className="font-bold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                                    {service.title}
                                  </h4>
                                  <p className="text-xs text-gray-600">
                                    {service.description}
                                  </p>
                                </div>
                              </div>
                            </Link>
                          ))}
                        </div>
                        <div className="mt-4 pt-4 border-t border-gray-200">
                          <Link
                            href={`/${locale}/services`}
                            onClick={() => setServicesMenuOpen(false)}
                            className="text-sm font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-2 group"
                          >
                            Zobacz wszystkie usługi
                            <span className="group-hover:translate-x-1 transition-transform">→</span>
                          </Link>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Premium Action Buttons */}
            <div className="hidden lg:flex items-center space-x-3">
              {/* Phone Button - Premium */}
              <a
                href={`tel:${contactData.phone}`}
                className="group relative px-5 py-2.5 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-green-500/50 hover:shadow-xl hover:shadow-green-500/60 transition-all duration-300 hover:scale-105 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-green-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <svg className="relative w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span className="relative font-bold">503 691 808</span>
                <div className="absolute -right-1 -top-1 w-3 h-3 bg-red-500 rounded-full animate-ping"></div>
              </a>

              {/* Google Maps Button */}
              <a
                href={contactData.googleMaps}
                target="_blank"
                rel="noopener noreferrer"
                className="group px-4 py-2.5 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-xl font-semibold flex items-center gap-2 shadow-lg shadow-orange-500/50 hover:shadow-xl hover:shadow-orange-500/60 transition-all duration-300 hover:scale-105"
              >
                <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="hidden xl:inline">Lokalizacja</span>
              </a>

              {/* Emergency Badge */}
              <div className="px-4 py-2.5 bg-gradient-to-r from-red-600 to-pink-600 text-white rounded-xl font-bold text-sm flex items-center gap-2 shadow-lg shadow-red-500/50 animate-pulse-slow">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                </span>
                <span>24/7</span>
              </div>

              {/* Language Switcher - Fancy */}
              <div className="flex items-center gap-1 p-1 bg-gray-100 rounded-xl">
                <button
                  onClick={() => switchLocale('pl')}
                  className={`px-3 py-1.5 rounded-lg text-sm font-bold transition-all duration-300 ${
                    locale === 'pl'
                      ? 'bg-white text-blue-600 shadow-md'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  PL
                </button>
                <button
                  onClick={() => switchLocale('en')}
                  className={`px-3 py-1.5 rounded-lg text-sm font-bold transition-all duration-300 ${
                    locale === 'en'
                      ? 'bg-white text-blue-600 shadow-md'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  EN
                </button>
              </div>
            </div>

            {/* Mobile Menu Button - Fancy */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden relative w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 text-white flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              <div className="flex flex-col gap-1.5">
                <span className={`block w-6 h-0.5 bg-white transition-all duration-300 ${mobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
                <span className={`block w-6 h-0.5 bg-white transition-all duration-300 ${mobileMenuOpen ? 'opacity-0' : ''}`}></span>
                <span className={`block w-6 h-0.5 bg-white transition-all duration-300 ${mobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
              </div>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu - Premium Overlay */}
      <div className={`fixed inset-0 z-40 lg:hidden transition-all duration-500 ${
        mobileMenuOpen ? 'visible' : 'invisible'
      }`}>
        <div 
          className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-500 ${
            mobileMenuOpen ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={() => setMobileMenuOpen(false)}
        ></div>
        
        <div className={`absolute top-0 right-0 h-full w-full max-w-sm bg-white shadow-2xl transition-transform duration-500 ${
          mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}>
          <div className="p-6 space-y-6 overflow-y-auto h-full">
            {/* Mobile Header */}
            <div className="flex items-center justify-between pb-4 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="relative w-12 h-12 rounded-xl overflow-hidden ring-2 ring-blue-500/30 shadow-lg">
                  <Image src="/images/logo.jpg" alt="SanBud Logo" fill className="object-cover" />
                </div>
                <div>
                  <div className="font-black text-lg bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    SAN-BUD
                  </div>
                  <div className="text-xs text-gray-600">Hydraulika</div>
                </div>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="w-10 h-10 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
              >
                <span className="text-2xl">×</span>
              </button>
            </div>

            {/* Mobile Navigation */}
            <div className="space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all duration-300 ${
                    pathname === item.href
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <span className="scale-125">{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              ))}
            </div>

            {/* Mobile Services Grid */}
            <div className="pt-4 border-t border-gray-200">
              <h3 className="font-bold text-gray-900 mb-3">Nasze usługi</h3>
              <div className="grid grid-cols-2 gap-2">
                {services.map((service, idx) => (
                  <Link
                    key={idx}
                    href={service.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-3 rounded-xl border border-gray-200 hover:border-blue-200 hover:bg-blue-50 transition-all"
                  >
                    <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${service.color} flex items-center justify-center text-white mb-2`}>
                      {service.icon}
                    </div>
                    <div className="text-xs font-bold text-gray-900">{service.title}</div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Mobile Contact Buttons */}
            <div className="space-y-3 pt-4 border-t border-gray-200">
              <a
                href={`tel:${contactData.phone}`}
                className="flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-bold shadow-lg"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span>503 691 808</span>
              </a>
              <a
                href={contactData.googleMaps}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-xl font-bold shadow-lg"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>Google Maps</span>
              </a>
            </div>

            {/* Mobile Language Switcher */}
            <div className="flex gap-2 pt-4 border-t border-gray-200">
              <button
                onClick={() => { switchLocale('pl'); setMobileMenuOpen(false); }}
                className={`flex-1 py-3 rounded-xl font-bold transition-all ${
                  locale === 'pl'
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700'
                }`}
              >
                Polski
              </button>
              <button
                onClick={() => { switchLocale('en'); setMobileMenuOpen(false); }}
                className={`flex-1 py-3 rounded-xl font-bold transition-all ${
                  locale === 'en'
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700'
                }`}
              >
                English
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Animations CSS */}
      <style jsx global>{`
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slide-down {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse-slow {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.8; }
        }
        .animate-gradient { animation: gradient 3s ease infinite; }
        .animate-fade-in { animation: fade-in 0.5s ease forwards; }
        .animate-slide-down { animation: slide-down 0.3s ease forwards; }
        .animate-pulse-slow { animation: pulse-slow 3s ease-in-out infinite; }
      `}</style>
    </>
  );
}
