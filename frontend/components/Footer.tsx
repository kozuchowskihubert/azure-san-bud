'use client';

import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  const t = useTranslations();
  const locale = useLocale();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5" style={{
        backgroundImage: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="1"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
      }}></div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Main Footer Content */}
        <div className="py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-6">
            <Link href={`/${locale}`} className="flex items-center space-x-3 group">
              <div className="relative w-16 h-16 rounded-full overflow-hidden ring-2 ring-accent transition-transform group-hover:scale-105">
                <Image
                  src="/images/logo.jpg"
                  alt="SanBud Logo"
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <div className="text-2xl font-bold gradient-text-light">
                  {t('common.companyName')}
                </div>
                <div className="text-xs text-gray-400 italic">
                  {t('common.tagline')}
                </div>
              </div>
            </Link>
            
            <p className="text-gray-400 text-sm leading-relaxed">
              Profesjonalne usługi hydrauliczne i sanitarne dla Twojego domu i firmy. 
              Doświadczenie, jakość i terminowość to nasze priorytety.
            </p>

            {/* Social Media */}
            <div className="flex items-center space-x-3">
              <a
                href="https://www.facebook.com/profile.php?id=100089260894857"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white/10 hover:bg-accent rounded-full flex items-center justify-center transition-all hover:scale-110"
                aria-label="Facebook"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a
                href="https://www.google.com/maps/place/San-Bud+Hydraulika+Nasza+pasja/@52.6329371,20.3494345"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white/10 hover:bg-accent rounded-full flex items-center justify-center transition-all hover:scale-110"
                aria-label="Google Maps"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C7.31 0 3.5 3.81 3.5 8.5c0 6.56 8.5 15.5 8.5 15.5s8.5-8.94 8.5-15.5C20.5 3.81 16.69 0 12 0zm0 11.5c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3z"/>
                </svg>
              </a>
              <a
                href={`tel:${t('common.phone')}`}
                className="w-10 h-10 bg-white/10 hover:bg-accent rounded-full flex items-center justify-center transition-all hover:scale-110"
                aria-label="Phone"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56a.977.977 0 00-1.01.24l-1.57 1.97c-2.83-1.35-5.48-3.9-6.89-6.83l1.95-1.66c.27-.28.35-.67.24-1.02-.37-1.11-.56-2.3-.56-3.53 0-.54-.45-.99-.99-.99H4.19C3.65 3 3 3.24 3 3.99 3 13.28 10.73 21 20.01 21c.71 0 .99-.63.99-1.18v-3.45c0-.54-.45-.99-.99-.99z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-6 text-white">
              {t('footer.quickLinks.title')}
            </h3>
            <ul className="space-y-3">
              {[
                { label: t('navigation.home'), href: `/${locale}` },
                { label: t('navigation.services'), href: `/${locale}/services` },
                { label: t('navigation.about'), href: `/${locale}/about` },
                { label: t('navigation.contact'), href: `/${locale}/contact` },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-accent transition-colors inline-flex items-center group"
                  >
                    <svg className="w-4 h-4 mr-2 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-bold mb-6 text-white">
              {t('navigation.services')}
            </h3>
            <ul className="space-y-3 text-sm">
              <li className="text-gray-400 flex items-start">
                <span className="text-accent mr-2">•</span>
                Montaż instalacji wodnych
              </li>
              <li className="text-gray-400 flex items-start">
                <span className="text-accent mr-2">•</span>
                Łazienki pod klucz
              </li>
              <li className="text-gray-400 flex items-start">
                <span className="text-accent mr-2">•</span>
                Instalacje grzewcze
              </li>
              <li className="text-gray-400 flex items-start">
                <span className="text-accent mr-2">•</span>
                Serwis awaryjny 24/7
              </li>
              <li className="text-gray-400 flex items-start">
                <span className="text-accent mr-2">•</span>
                Naprawy i konserwacje
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-bold mb-6 text-white">
              {t('footer.contact.title')}
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start space-x-3">
                <div className="w-10 h-10 bg-accent/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-accent" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Telefon</p>
                  <a href={`tel:${t('common.phone')}`} className="text-gray-300 hover:text-accent transition-colors">
                    {t('common.phone')}
                  </a>
                </div>
              </li>
              <li className="flex items-start space-x-3">
                <div className="w-10 h-10 bg-accent/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-accent" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Email</p>
                  <a href={`mailto:${t('common.email')}`} className="text-gray-300 hover:text-accent transition-colors">
                    {t('common.email')}
                  </a>
                </div>
              </li>
              <li className="flex items-start space-x-3">
                <div className="w-10 h-10 bg-accent/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-accent" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Adres</p>
                  <p className="text-gray-300 text-sm">
                    {t('common.address')}
                  </p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Gallery Preview */}
        <div className="py-8 border-t border-gray-700">
          <h3 className="text-lg font-bold mb-6 text-center text-white">
            Nasze realizacje
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { src: '/images/sanbud-google-1.jpg', alt: 'Realizacja 1' },
              { src: '/images/sanbud-google-2.jpg', alt: 'Realizacja 2 - Łazienka' },
              { src: '/images/sanbud-google-3.jpg', alt: 'Realizacja 3' },
              { src: '/images/sanbud-google-4.jpg', alt: 'Realizacja 4' },
              { src: '/images/sanbud-google-5.jpg', alt: 'Realizacja 5' },
              { src: '/images/sanbud-google-6.jpg', alt: 'Realizacja 6' },
            ].map((image, index) => (
              <div
                key={index}
                className="relative h-32 rounded-lg overflow-hidden group cursor-pointer"
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                  <p className="text-white text-sm font-medium">{image.alt}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-6 border-t border-gray-700">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            {/* Copyright */}
            <p className="text-gray-400 text-sm">
              © {currentYear} {t('common.companyFullName')}. Wszelkie prawa zastrzeżone.
            </p>

            {/* Badges */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 bg-white/5 rounded-full px-4 py-2">
                <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-sm text-gray-300">{t('common.established')}</span>
              </div>
              <div className="flex items-center space-x-2 bg-white/5 rounded-full px-4 py-2">
                <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                <span className="text-sm text-gray-300">{t('common.emergencyBadge')}</span>
              </div>
            </div>

            {/* Legal Links */}
            <div className="flex items-center space-x-4 text-sm">
              <Link href={`/${locale}/privacy`} className="text-gray-400 hover:text-accent transition-colors">
                Polityka prywatności
              </Link>
              <span className="text-gray-600">•</span>
              <Link href={`/${locale}/terms`} className="text-gray-400 hover:text-accent transition-colors">
                Regulamin
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl -mb-32 -ml-32"></div>
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mt-32 -mr-32"></div>
    </footer>
  );
}
