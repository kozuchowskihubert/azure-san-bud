'use client';

import { useState } from 'react';
import { useLocale } from 'next-intl';
import Link from 'next/link';
import Image from 'next/image';
import BookingCalendar from '@/components/BookingCalendar';
import PartnersSlider from '@/components/PartnersSlider';
import { 
  Droplets, 
  Flame, 
  Thermometer, 
  Settings, 
  Factory, 
  Wrench, 
  ClipboardCheck, 
  Recycle, 
  Truck 
} from 'lucide-react';

export default function HomePage() {
  const locale = useLocale();
  const isEnglish = locale === 'en';

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: 'Instalacje wodno-kanalizacyjne',
    message: '',
  });
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5002';
      const response = await fetch(`${apiUrl}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setStatus('success');
        setFormData({ name: '', email: '', phone: '', service: 'Instalacje wodno-kanalizacyjne', message: '' });
        setTimeout(() => setStatus('idle'), 5000);
      } else {
        setStatus('error');
      }
    } catch (error) {
      setStatus('error');
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* HERO SECTION - Full screen with gradient overlay */}
      <section className="hero relative bg-cover bg-center" style={{
        backgroundImage: 'url(/images/hero-bg.jpg)',
        minHeight: 'calc(100vh - 80px)'
      }}>
        <div className="hero-overlay"></div>
        
        <div className="hero-content max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="max-w-4xl">
            {/* Main Headline - Professional HAOS.fm style */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-light text-white mb-6 leading-tight animate-fade-in-up tracking-tight">
              {isEnglish ? (
                <>Plumbing<br />Our <span className="font-medium text-green-400">Passion</span></>
              ) : (
                <>Hydraulika<br />Naszą <span className="font-medium text-green-400">Pasją</span></>
              )}
            </h1>
            
            {/* Subheadline - Clean and professional */}
            <p className="text-lg md:text-xl text-white/90 mb-10 leading-relaxed max-w-2xl animate-fade-in-up font-light">
              {isEnglish 
                ? 'Professional water & sewage installations, gas systems, underfloor heating, boiler rooms. 25+ years of experience in Mazowsze region.'
                : 'Profesjonalne instalacje wodno-kanalizacyjne, gazowe, ogrzewanie podłogowe, kotłownie. 25+ lat doświadczenia w województwie mazowieckim.'}
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-up">
              <a 
                href="#contact" 
                className="btn btn-accent btn-xl group"
              >
                <span>{isEnglish ? 'Free Quote' : 'Darmowa Wycena'}</span>
                <svg className="w-6 h-6 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </a>
              
              <a 
                href="tel:503691808" 
                className="btn btn-outline btn-xl border-2 border-white text-white hover:bg-white hover:text-blue-600"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span>{isEnglish ? 'Call Now: 503 691 808' : 'Zadzwoń: 503 691 808'}</span>
              </a>
            </div>
          </div>
        </div>
        
        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
          <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

      {/* WHY SAN-BUD SECTION - Trust indicators */}
      <section className="section bg-gray-50">
        <div className="container-custom">
          <div className="section-header">
            <h2 className="section-title">
              {isEnglish ? 'Industry Leader in Plumbing & Heating' : 'Lider Branży Hydraulicznej'}
            </h2>
            <p className="section-subtitle">
              {isEnglish 
                ? 'Experience, professionalism, and individual approach to each client is what sets us apart from other companies'
                : 'Doświadczenie, profesjonalizm i indywidualne podejście do klienta to coś, co wyróżnia nas na tle innych firm'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Experience */}
            <div className="card card-hover p-8 text-center group">
              <div className="w-20 h-20 mx-auto mb-6 bg-gradient-primary rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <span className="text-4xl">🏆</span>
              </div>
              <h3 className="text-3xl font-bold text-blue-600 mb-2">25+</h3>
              <p className="text-lg font-semibold text-gray-900 mb-2">
                {isEnglish ? 'Years of Experience' : 'Lat Doświadczenia'}
              </p>
              <p className="text-gray-600">
                {isEnglish ? 'Serving Mazowsze since 2018' : 'Działamy w Mazowszu od 2018'}
              </p>
            </div>

            {/* Certifications */}
            <div className="card card-hover p-8 text-center group">
              <div className="w-20 h-20 mx-auto mb-6 bg-gradient-secondary rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <span className="text-4xl">📜</span>
              </div>
              <h3 className="text-3xl font-bold text-green-600 mb-2">100%</h3>
              <p className="text-lg font-semibold text-gray-900 mb-2">
                {isEnglish ? 'Certified & Licensed' : 'Certyfikowani'}
              </p>
              <p className="text-gray-600">
                {isEnglish ? 'Gas, water & heating qualifications' : 'Uprawnienia gazowe, wodne i c.o.'}
              </p>
            </div>

            {/* Warranty */}
            <div className="card card-hover p-8 text-center group">
              <div className="w-20 h-20 mx-auto mb-6 bg-gradient-accent rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <span className="text-4xl">🛡️</span>
              </div>
              <h3 className="text-3xl font-bold text-orange-600 mb-2">5</h3>
              <p className="text-lg font-semibold text-gray-900 mb-2">
                {isEnglish ? 'Years Warranty' : 'Lat Gwarancji'}
              </p>
              <p className="text-gray-600">
                {isEnglish ? 'On all installations & parts' : 'Na instalacje i części'}
              </p>
            </div>

            {/* Availability */}
            <div className="card card-hover p-8 text-center group">
              <div className="w-20 h-20 mx-auto mb-6 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <span className="text-4xl text-white">⚡</span>
              </div>
              <h3 className="text-3xl font-bold text-blue-600 mb-2">24/7</h3>
              <p className="text-lg font-semibold text-gray-900 mb-2">
                {isEnglish ? 'Emergency Service' : 'Pogotowie Hydrauliczne'}
              </p>
              <p className="text-gray-600">
                {isEnglish ? 'Fast response, always available' : 'Szybki dojazd, zawsze dostępni'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SERVICES SECTION - 9 SAN-BUD services */}
      <section className="section bg-white">
        <div className="container-custom">
          <div className="section-header">
            <div className="inline-block px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full font-medium text-sm mb-3">
              {isEnglish ? 'OUR SERVICES' : 'NASZA OFERTA'}
            </div>
            <h2 className="section-title">
              {isEnglish ? 'Professional Hydraulic Services' : 'Profesjonalne Usługi Hydrauliczne'}
            </h2>
            <p className="section-subtitle">
              {isEnglish 
                ? 'Comprehensive hydraulic installations and services for residential and commercial properties'
                : 'Kompleksowe instalacje hydrauliczne i usługi dla nieruchomości mieszkalnych i komercyjnych'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Service 1: Water & Sewage */}
            <div className="service-card group">
              <div className="w-14 h-14 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Droplets className="w-7 h-7 text-white" strokeWidth={2.5} />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-gray-900">
                {isEnglish ? 'Water & Sewage Systems' : 'Instalacje Wodno-Kanalizacyjne'}
              </h3>
              <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                {isEnglish 
                  ? 'Complete installation of water supply and sewage systems'
                  : 'Kompleksowy montaż instalacji wodnych i kanalizacyjnych'}
              </p>
              <Link href={`/${locale}/services`} className="text-sm text-blue-600 font-medium hover:text-blue-700 inline-flex items-center gap-1.5 group/link">
                {isEnglish ? 'Learn more' : 'Dowiedz się więcej'}
                <svg className="w-3.5 h-3.5 group-hover/link:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>

            {/* Service 2: Gas Installations */}
            <div className="service-card group">
              <div className="w-14 h-14 mx-auto mb-4 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Flame className="w-7 h-7 text-white" strokeWidth={2.5} />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-gray-900">
                {isEnglish ? 'Gas Installations' : 'Instalacje Gazowe'}
              </h3>
              <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                {isEnglish 
                  ? 'Safe installation and modernization of gas systems'
                  : 'Bezpieczny montaż i modernizacja instalacji gazowych'}
              </p>
              <Link href={`/${locale}/services`} className="text-sm text-blue-600 font-medium hover:text-blue-700 inline-flex items-center gap-1.5 group/link">
                {isEnglish ? 'Learn more' : 'Dowiedz się więcej'}
                <svg className="w-3.5 h-3.5 group-hover/link:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>

            {/* Service 3: Underfloor Heating */}
            <div className="service-card group">
              <div className="w-14 h-14 mx-auto mb-4 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Thermometer className="w-7 h-7 text-white" strokeWidth={2.5} />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-gray-900">
                {isEnglish ? 'Underfloor Heating' : 'Ogrzewanie Podłogowe'}
              </h3>
              <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                {isEnglish 
                  ? 'Energy-efficient underfloor heating systems'
                  : 'Energooszczędne systemy ogrzewania podłogowego'}
              </p>
              <Link href={`/${locale}/services`} className="text-sm text-blue-600 font-medium hover:text-blue-700 inline-flex items-center gap-1.5 group/link">
                {isEnglish ? 'Learn more' : 'Dowiedz się więcej'}
                <svg className="w-3.5 h-3.5 group-hover/link:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>

            {/* Service 4: Boiler Room Modernization */}
            <div className="service-card group">
              <div className="w-14 h-14 mx-auto mb-4 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Settings className="w-7 h-7 text-white" strokeWidth={2.5} />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-gray-900">
                {isEnglish ? 'Boiler Room Modernization' : 'Modernizacja Kotłowni'}
              </h3>
              <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                {isEnglish 
                  ? 'Upgrading boiler rooms to modern heating systems'
                  : 'Modernizacja kotłowni na nowoczesne systemy grzewcze'}
              </p>
              <Link href={`/${locale}/services`} className="text-sm text-blue-600 font-medium hover:text-blue-700 inline-flex items-center gap-1.5 group/link">
                {isEnglish ? 'Learn more' : 'Dowiedz się więcej'}
                <svg className="w-3.5 h-3.5 group-hover/link:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>

            {/* Service 5: New Boiler Room Installation */}
            <div className="service-card group">
              <div className="w-14 h-14 mx-auto mb-4 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Factory className="w-7 h-7 text-white" strokeWidth={2.5} />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-gray-900">
                {isEnglish ? 'New Boiler Rooms' : 'Montaż Nowych Kotłowni'}
              </h3>
              <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                {isEnglish 
                  ? 'Complete installation of modern boiler rooms'
                  : 'Kompleksowy montaż nowoczesnych kotłowni'}
              </p>
              <Link href={`/${locale}/services`} className="text-sm text-blue-600 font-medium hover:text-blue-700 inline-flex items-center gap-1.5 group/link">
                {isEnglish ? 'Learn more' : 'Dowiedz się więcej'}
                <svg className="w-3.5 h-3.5 group-hover/link:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>

            {/* Service 6: Gas Furnace Service */}
            <div className="service-card group">
              <div className="w-14 h-14 mx-auto mb-4 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Wrench className="w-7 h-7 text-white" strokeWidth={2.5} />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-gray-900">
                {isEnglish ? 'Gas Furnace Service' : 'Serwis Piecy Gazowych'}
              </h3>
              <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                {isEnglish 
                  ? 'Professional servicing and repairs of gas furnaces'
                  : 'Profesjonalny serwis i naprawy pieców gazowych'}
              </p>
              <a href="tel:503691808" className="text-sm text-blue-600 font-medium hover:text-blue-700 inline-flex items-center gap-1.5 group/link">
                {isEnglish ? 'Call now' : 'Zadzwoń teraz'}
                <svg className="w-3.5 h-3.5 group-hover/link:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </a>
            </div>

            {/* Service 7: Gas Installation Inspection */}
            <div className="service-card group">
              <div className="w-14 h-14 mx-auto mb-4 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <ClipboardCheck className="w-7 h-7 text-white" strokeWidth={2.5} />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-gray-900">
                {isEnglish ? 'Gas System Inspection' : 'Przegląd Instalacji Gazowych'}
              </h3>
              <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                {isEnglish 
                  ? 'Safety inspections and certification of gas systems'
                  : 'Przeglądy bezpieczeństwa i certyfikacja instalacji gazowych'}
              </p>
              <Link href={`/${locale}/services`} className="text-sm text-blue-600 font-medium hover:text-blue-700 inline-flex items-center gap-1.5 group/link">
                {isEnglish ? 'Learn more' : 'Dowiedz się więcej'}
                <svg className="w-3.5 h-3.5 group-hover/link:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>

            {/* Service 8: Sewage Treatment Plants */}
            <div className="service-card group">
              <div className="w-14 h-14 mx-auto mb-4 bg-gradient-to-br from-lime-500 to-lime-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Recycle className="w-7 h-7 text-white" strokeWidth={2.5} />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-gray-900">
                {isEnglish ? 'Sewage Treatment Plants' : 'Przydomowe Oczyszczalnie'}
              </h3>
              <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                {isEnglish 
                  ? 'Ecological sewage treatment plant installation'
                  : 'Montaż ekologicznych przydomowych oczyszczalni'}
              </p>
              <Link href={`/${locale}/services`} className="text-sm text-blue-600 font-medium hover:text-blue-700 inline-flex items-center gap-1.5 group/link">
                {isEnglish ? 'Learn more' : 'Dowiedz się więcej'}
                <svg className="w-3.5 h-3.5 group-hover/link:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>

            {/* Service 9: Mini Excavator Services */}
            <div className="service-card group">
              <div className="w-14 h-14 mx-auto mb-4 bg-gradient-to-br from-stone-500 to-stone-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Truck className="w-7 h-7 text-white" strokeWidth={2.5} />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-gray-900">
                {isEnglish ? 'Mini Excavator Services' : 'Usługi Minikoparką'}
              </h3>
              <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                {isEnglish 
                  ? 'Excavation work for installations and foundations'
                  : 'Prace ziemne pod instalacje i fundamenty'}
              </p>
              <Link href={`/${locale}/services`} className="text-sm text-blue-600 font-medium hover:text-blue-700 inline-flex items-center gap-1.5 group/link">
                {isEnglish ? 'Learn more' : 'Dowiedz się więcej'}
                <svg className="w-3.5 h-3.5 group-hover/link:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* PROCESS SECTION - How we work (6 steps) */}
      <section className="section bg-gradient-to-br from-blue-50 to-green-50">
        <div className="container-custom">
          <div className="section-header">
            <h2 className="section-title">
              {isEnglish ? 'Professional Service Within Reach!' : 'Profesjonalna Usługa na Wyciągnięcie Ręki!'}
            </h2>
            <p className="section-subtitle">
              {isEnglish 
                ? 'We will guide you through the entire installation process. With our help, it\'s incredibly simple.'
                : 'Przeprowadzimy Cię przez cały proces realizacji instalacji. Z naszą pomocą jest to dziecinnie proste.'}
            </p>
          </div>

          <div className="max-w-4xl mx-auto space-y-8">
            {/* Step 1 */}
            <div className="timeline-step">
              <div className="timeline-number">01</div>
              <div className="timeline-content">
                <h3 className="text-2xl font-bold mb-2">{isEnglish ? 'Contact' : 'Kontakt'}</h3>
                <p className="text-gray-600">
                  {isEnglish 
                    ? 'Call us, send an email, or fill out the contact form. We respond within 24 hours.'
                    : 'Zadzwoń, wyślij email lub wypełnij formularz kontaktowy. Odpowiadamy w ciągu 24 godzin.'}
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="timeline-step">
              <div className="timeline-number">02</div>
              <div className="timeline-content">
                <h3 className="text-2xl font-bold mb-2">{isEnglish ? 'Free Quote' : 'Darmowa Wycena'}</h3>
                <p className="text-gray-600">
                  {isEnglish 
                    ? 'Site visit and professional assessment. We prepare a detailed quote with no obligations.'
                    : 'Wizyta w terenie i profesjonalna ocena. Przygotowujemy szczegółową wycenę bez zobowiązań.'}
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="timeline-step">
              <div className="timeline-number">03</div>
              <div className="timeline-content">
                <h3 className="text-2xl font-bold mb-2">{isEnglish ? 'Agreement' : 'Uzgodnienia'}</h3>
                <p className="text-gray-600">
                  {isEnglish 
                    ? 'We agree on project details, materials, and execution timeline. Contract signing.'
                    : 'Ustalamy szczegóły projektu, materiały oraz termin realizacji. Podpisanie umowy.'}
                </p>
              </div>
            </div>

            {/* Step 4 */}
            <div className="timeline-step">
              <div className="timeline-number">04</div>
              <div className="timeline-content">
                <h3 className="text-2xl font-bold mb-2">{isEnglish ? 'Installation' : 'Realizacja'}</h3>
                <p className="text-gray-600">
                  {isEnglish 
                    ? 'Our certified team performs the work professionally, on time, and according to regulations.'
                    : 'Nasz certyfikowany zespół wykonuje prace profesjonalnie, w terminie i zgodnie z przepisami.'}
                </p>
              </div>
            </div>

            {/* Step 5 */}
            <div className="timeline-step">
              <div className="timeline-number">05</div>
              <div className="timeline-content">
                <h3 className="text-2xl font-bold mb-2">{isEnglish ? 'Acceptance' : 'Odbiór'}</h3>
                <p className="text-gray-600">
                  {isEnglish 
                    ? 'Final acceptance of work, testing systems, and handing over documentation.'
                    : 'Końcowy odbiór prac, testy systemów oraz przekazanie dokumentacji.'}
                </p>
              </div>
            </div>

            {/* Step 6 */}
            <div className="timeline-step">
              <div className="timeline-number">06</div>
              <div className="timeline-content">
                <h3 className="text-2xl font-bold mb-2">{isEnglish ? 'Warranty & Service' : 'Gwarancja i Serwis'}</h3>
                <p className="text-gray-600">
                  {isEnglish 
                    ? '5-year warranty on installations. We provide ongoing service and technical support.'
                    : '5 lat gwarancji na instalacje. Zapewniamy stały serwis i wsparcie techniczne.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CONTACT FORM SECTION */}
      <section id="contact" className="section bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Left: Info */}
            <div>
              <div className="section-header text-left">
                <h2 className="section-title">
                  {isEnglish ? 'Start Saving Today!' : 'Zacznij Oszczędzać Już Dziś!'}
                </h2>
                <p className="section-subtitle">
                  {isEnglish 
                    ? 'Interested in professional plumbing solutions? Want to improve your home comfort and reduce costs? Contact us for a free quote.'
                    : 'Jesteś zainteresowany profesjonalnymi rozwiązaniami hydraulicznymi? Chcesz poprawić komfort swojego domu i zmniejszyć koszty? Skontaktuj się z nami po darmową wycenę.'}
                </p>
              </div>

              <div className="space-y-6 mt-8">
                <div className="flex items-start gap-4">
                  <div className="icon-box icon-box-primary">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">{isEnglish ? 'Phone' : 'Telefon'}</h3>
                    <a href="tel:503691808" className="text-blue-600 hover:text-blue-700 font-semibold">503 691 808</a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="icon-box icon-box-primary">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Email</h3>
                    <a href="mailto:biuro@sanbud24.pl" className="text-blue-600 hover:text-blue-700 font-semibold">biuro@sanbud24.pl</a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="icon-box icon-box-primary">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">{isEnglish ? 'Response Time' : 'Czas Odpowiedzi'}</h3>
                    <p className="text-gray-600">{isEnglish ? 'Quote within 3-5 business days' : 'Wycena w ciągu 3-5 dni roboczych'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Form */}
            <div className="card p-8">
              <h3 className="text-2xl font-bold mb-6">{isEnglish ? 'Request a Quote' : 'Zamów Wycenę'}</h3>
              
              {status === 'success' && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-800">
                  {isEnglish ? 'Thank you! We will contact you within 24 hours.' : 'Dziękujemy! Skontaktujemy się w ciągu 24 godzin.'}
                </div>
              )}

              {status === 'error' && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
                  {isEnglish ? 'Error sending. Please try again or call us.' : 'Błąd wysyłania. Spróbuj ponownie lub zadzwoń.'}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      {isEnglish ? 'Name' : 'Imię'} *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="input"
                      placeholder={isEnglish ? 'Your name' : 'Twoje imię'}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      {isEnglish ? 'Phone' : 'Telefon'} *
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="input"
                      placeholder={isEnglish ? 'Your phone' : 'Twój telefon'}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="input"
                    placeholder={isEnglish ? 'your@email.com' : 'twoj@email.pl'}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {isEnglish ? 'Service Type' : 'Rodzaj Usługi'} *
                  </label>
                  <select
                    required
                    value={formData.service}
                    onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                    className="select"
                  >
                    <option>Instalacje wodno-kanalizacyjne</option>
                    <option>Instalacje gazowe</option>
                    <option>Ogrzewanie podłogowe</option>
                    <option>Modernizacja kotłowni</option>
                    <option>Montaż nowych kotłowni</option>
                    <option>Serwis piecy gazowych</option>
                    <option>Przegląd instalacji gazowych</option>
                    <option>Montaż przydomowych oczyszczalni</option>
                    <option>Usługi minikoparką</option>
                    <option>{isEnglish ? 'Other' : 'Inne'}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {isEnglish ? 'Message' : 'Wiadomość'}
                  </label>
                  <textarea
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="textarea"
                    placeholder={isEnglish ? 'Describe your needs...' : 'Opisz swoje potrzeby...'}
                  />
                </div>

                <button
                  type="submit"
                  disabled={status === 'sending'}
                  className="btn btn-accent w-full btn-lg"
                >
                  {status === 'sending' 
                    ? (isEnglish ? 'Sending...' : 'Wysyłanie...') 
                    : (isEnglish ? 'Send Request' : 'Wyślij Zapytanie')}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* PARTNERS SLIDER - Auto-scrolling logos */}
      <PartnersSlider />

      {/* BOOKING CALENDAR SECTION */}
      <section id="booking" className="section bg-gray-50">
        <div className="container-custom">
          <div className="section-header">
            <h2 className="section-title">
              {isEnglish ? 'Schedule Your Visit Online' : 'Umów Wizytę Online'}
            </h2>
            <p className="section-subtitle">
              {isEnglish ? 'Choose a convenient date from the calendar' : 'Wybierz dogodny termin z kalendarza'}
            </p>
          </div>
          
          <BookingCalendar />
        </div>
      </section>
    </div>
  );
}
