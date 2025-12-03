'use client';

import { useState } from 'react';
import { useLocale } from 'next-intl';
import Link from 'next/link';
import BookingCalendar from '@/components/BookingCalendar';
import RealizationsMap from '@/components/RealizationsMap';
import { getRecentPosts } from '@/data/blogPosts';

export default function HomePage() {
  const locale = useLocale();
  const isEnglish = locale === 'en';

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    message: '',
  });
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

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

      const data = await response.json();

      if (response.ok && data.success) {
        setStatus('success');
        setFormData({ name: '', email: '', phone: '', service: '', message: '' });
      } else {
        throw new Error(data.message || 'Error sending');
      }
    } catch (error) {
      setStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Please try again');
    }
  };

  return (
    <div className="min-h-screen bg-white">
      
      {/* HERO SECTION - Central Heating Focus */}
      <section className="relative min-h-[600px] lg:min-h-[700px] flex items-center justify-center overflow-hidden bg-gradient-to-br from-blue-900 via-blue-800 to-teal-900">
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}></div>
        </div>

        <div className="container mx-auto px-4 py-20 relative z-10">
          <div className="max-w-5xl mx-auto text-center text-white">
            
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-full mb-8 animate-fade-in">
              <svg className="w-5 h-5 text-orange-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"/>
                <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd"/>
              </svg>
              <span className="text-sm font-semibold">
                {isEnglish ? 'Certified Plumbing & Heating Specialists' : 'Certyfikowani Specjaliści Instalacji Sanitarnych'}
              </span>
            </div>

            {/* Main Heading */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black mb-6 leading-tight animate-slide-up">
              <span className="block mb-2">
                {isEnglish ? 'Plumbing, Heating' : 'Instalacje Sanitarne'}
              </span>
              <span className="block bg-gradient-to-r from-orange-400 via-orange-300 to-yellow-300 bg-clip-text text-transparent">
                {isEnglish ? '& Gas Systems' : 'Ogrzewanie i Gaz'}
              </span>
            </h1>
            
            {/* Subheading */}
            <p className="text-xl md:text-2xl mb-10 font-light text-blue-100 max-w-3xl mx-auto animate-slide-up animation-delay-200">
              {isEnglish 
                ? 'Water & sewage systems, gas installations, underfloor heating, boiler rooms & mini excavator services'
                : 'Instalacje wodno-kanalizacyjne, gazowe, ogrzewanie podłogowe, kotłownie i usługi minikoparką'}
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4 justify-center mb-12 animate-slide-up animation-delay-300">
              <a 
                href="#booking" 
                className="group px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold rounded-xl text-lg transition-all duration-300 shadow-2xl hover:shadow-orange-500/50 hover:scale-105 flex items-center gap-2"
              >
                🔥 {isEnglish ? 'Schedule Installation' : 'Umów Montaż'}
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </a>
              <a 
                href="tel:503691808"
                className="group px-8 py-4 bg-white/10 backdrop-blur-md border-2 border-white/30 hover:bg-white hover:text-blue-900 text-white font-bold rounded-xl text-lg transition-all duration-300 shadow-2xl hover:scale-105 flex items-center gap-2"
              >
                📞 503-691-808
              </a>
            </div>

            {/* Trust Indicators */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto animate-fade-in animation-delay-400">
              <div className="text-center bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6 hover:bg-white/20 transition-all">
                <div className="text-4xl font-black text-orange-400 mb-2">2000+</div>
                <div className="text-sm text-blue-100">{isEnglish ? 'Installations' : 'Instalacji'}</div>
              </div>
              <div className="text-center bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6 hover:bg-white/20 transition-all">
                <div className="text-4xl font-black text-orange-400 mb-2">15</div>
                <div className="text-sm text-blue-100">{isEnglish ? 'Years' : 'Lat'}</div>
              </div>
              <div className="text-center bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6 hover:bg-white/20 transition-all">
                <div className="text-4xl font-black text-orange-400 mb-2">24/7</div>
                <div className="text-sm text-blue-100">{isEnglish ? 'Support' : 'Serwis'}</div>
              </div>
              <div className="text-center bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6 hover:bg-white/20 transition-all">
                <div className="text-4xl font-black text-orange-400 mb-2">98%</div>
                <div className="text-sm text-blue-100">{isEnglish ? 'Satisfaction' : 'Zadowolenie'}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HEATING SPECIALIZATIONS */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black mb-4 text-gray-900">
              {isEnglish ? 'Our Professional Services' : 'Nasze Profesjonalne Usługi'}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {isEnglish 
                ? 'Complete solutions for plumbing, heating, gas systems and excavation work'
                : 'Kompleksowe rozwiązania w zakresie instalacji sanitarnych, grzewczych, gazowych i prac ziemnych'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Instalacje wodno-kanalizacyjne */}
            <div className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-gray-100 hover:border-blue-500 hover:-translate-y-2">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-xl">
                <span className="text-4xl">💧</span>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">{isEnglish ? 'Water & Sewage Systems' : 'Instalacje Wodno-Kanalizacyjne'}</h3>
              <p className="text-gray-600 mb-6">
                {isEnglish 
                  ? 'Professional installation of water supply and sewage systems'
                  : 'Profesjonalny montaż instalacji wodnych i kanalizacyjnych'}
              </p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center text-gray-700">
                  <span className="text-blue-500 mr-2">✓</span>
                  {isEnglish ? 'Water supply systems' : 'Instalacje wodne'}
                </li>
                <li className="flex items-center text-gray-700">
                  <span className="text-blue-500 mr-2">✓</span>
                  {isEnglish ? 'Sewage systems' : 'Kanalizacja'}
                </li>
                <li className="flex items-center text-gray-700">
                  <span className="text-blue-500 mr-2">✓</span>
                  {isEnglish ? 'Bathroom installations' : 'Instalacje łazienkowe'}
                </li>
              </ul>
              <Link href={`/${locale}/services`} className="text-blue-600 font-semibold hover:text-blue-700 flex items-center gap-2">
                {isEnglish ? 'Learn more' : 'Dowiedz się więcej'} →
              </Link>
            </div>

            {/* Instalacje gazowe */}
            <div className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-gray-100 hover:border-red-500 hover:-translate-y-2">
              <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-xl">
                <span className="text-4xl">🔥</span>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">{isEnglish ? 'Gas Installations' : 'Instalacje Gazowe'}</h3>
              <p className="text-gray-600 mb-6">
                {isEnglish 
                  ? 'Safe installation and maintenance of gas systems'
                  : 'Bezpieczny montaż i konserwacja instalacji gazowych'}
              </p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center text-gray-700">
                  <span className="text-red-500 mr-2">✓</span>
                  {isEnglish ? 'Gas pipeline installation' : 'Montaż przyłączy gazowych'}
                </li>
                <li className="flex items-center text-gray-700">
                  <span className="text-red-500 mr-2">✓</span>
                  {isEnglish ? 'Internal gas systems' : 'Instalacje wewnętrzne'}
                </li>
                <li className="flex items-center text-gray-700">
                  <span className="text-red-500 mr-2">✓</span>
                  {isEnglish ? 'Certified installers' : 'Certyfikowani instalatorzy'}
                </li>
              </ul>
              <Link href={`/${locale}/services`} className="text-red-600 font-semibold hover:text-red-700 flex items-center gap-2">
                {isEnglish ? 'Learn more' : 'Dowiedz się więcej'} →
              </Link>
            </div>

            {/* Ogrzewanie Podłogowe */}
            <div className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-gray-100 hover:border-orange-500 hover:-translate-y-2">
              <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-xl">
                <span className="text-4xl">🌡️</span>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">{isEnglish ? 'Underfloor Heating' : 'Ogrzewanie Podłogowe'}</h3>
              <p className="text-gray-600 mb-6">
                {isEnglish 
                  ? 'Modern underfloor heating systems for maximum comfort'
                  : 'Nowoczesne systemy ogrzewania podłogowego dla maksymalnego komfortu'}
              </p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center text-gray-700">
                  <span className="text-orange-500 mr-2">✓</span>
                  {isEnglish ? 'Electric & water systems' : 'Systemy elektryczne i wodne'}
                </li>
                <li className="flex items-center text-gray-700">
                  <span className="text-orange-500 mr-2">✓</span>
                  {isEnglish ? 'All floor types' : 'Wszystkie typy podłóg'}
                </li>
                <li className="flex items-center text-gray-700">
                  <span className="text-orange-500 mr-2">✓</span>
                  {isEnglish ? 'Energy efficient' : 'Energooszczędne'}
                </li>
              </ul>
              <Link href={`/${locale}/services`} className="text-orange-600 font-semibold hover:text-orange-700 flex items-center gap-2">
                {isEnglish ? 'Learn more' : 'Dowiedz się więcej'} →
              </Link>
            </div>

            {/* Modernizacja Kotłowni */}
            <div className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-gray-100 hover:border-purple-500 hover:-translate-y-2">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-xl">
                <span className="text-4xl">⚙️</span>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">{isEnglish ? 'Boiler Room Modernization' : 'Modernizacja Kotłowni'}</h3>
              <p className="text-gray-600 mb-6">
                {isEnglish 
                  ? 'Upgrade your old boiler room to modern, efficient systems'
                  : 'Modernizacja starych kotłowni na nowoczesne, wydajne systemy'}
              </p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center text-gray-700">
                  <span className="text-purple-500 mr-2">✓</span>
                  {isEnglish ? 'Energy audit' : 'Audyt energetyczny'}
                </li>
                <li className="flex items-center text-gray-700">
                  <span className="text-purple-500 mr-2">✓</span>
                  {isEnglish ? 'Pipe replacement' : 'Wymiana rur'}
                </li>
                <li className="flex items-center text-gray-700">
                  <span className="text-purple-500 mr-2">✓</span>
                  {isEnglish ? 'New radiators' : 'Nowe grzejniki'}
                </li>
              </ul>
              <Link href={`/${locale}/services`} className="text-purple-600 dark:text-purple-400 font-semibold hover:text-purple-700 flex items-center gap-2">
                {isEnglish ? 'Learn more' : 'Dowiedz się więcej'} →
              </Link>
            </div>

            {/* Montaż nowych kotłowni */}
            <div className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-gray-100 hover:border-amber-500 hover:-translate-y-2">
              <div className="w-20 h-20 bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-xl">
                <span className="text-4xl">🏭</span>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">{isEnglish ? 'New Boiler Room Installation' : 'Montaż Nowych Kotłowni'}</h3>
              <p className="text-gray-600 mb-6">
                {isEnglish 
                  ? 'Complete installation of modern, energy-efficient boiler rooms'
                  : 'Kompleksowy montaż nowoczesnych, energooszczędnych kotłowni'}
              </p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center text-gray-700">
                  <span className="text-amber-500 mr-2">✓</span>
                  {isEnglish ? 'Project design' : 'Projektowanie'}
                </li>
                <li className="flex items-center text-gray-700">
                  <span className="text-amber-500 mr-2">✓</span>
                  {isEnglish ? 'Installation & automation' : 'Montaż i automatyka'}
                </li>
                <li className="flex items-center text-gray-700">
                  <span className="text-amber-500 mr-2">✓</span>
                  {isEnglish ? 'Safety systems' : 'Systemy bezpieczeństwa'}
                </li>
              </ul>
              <Link href={`/${locale}/services`} className="text-amber-600 dark:text-amber-400 font-semibold hover:text-amber-700 flex items-center gap-2">
                {isEnglish ? 'Learn more' : 'Dowiedz się więcej'} →
              </Link>
            </div>

            {/* Serwis Piecy Gazowych */}
            <div className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-gray-100 hover:border-emerald-500 hover:-translate-y-2">
              <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-xl">
                <span className="text-4xl">🔧</span>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">{isEnglish ? 'Gas Furnace Service' : 'Serwis Piecy Gazowych'}</h3>
              <p className="text-gray-600 mb-6">
                {isEnglish 
                  ? 'Professional servicing and repairs of gas furnaces and boilers'
                  : 'Profesjonalny serwis i naprawy pieców gazowych oraz kotłów'}
              </p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center text-gray-700">
                  <span className="text-emerald-500 mr-2">✓</span>
                  {isEnglish ? 'Certified technicians' : 'Certyfikowani technicy'}
                </li>
                <li className="flex items-center text-gray-700">
                  <span className="text-emerald-500 mr-2">✓</span>
                  {isEnglish ? 'Emergency repairs' : 'Awarie 24/7'}
                </li>
                <li className="flex items-center text-gray-700">
                  <span className="text-emerald-500 mr-2">✓</span>
                  {isEnglish ? 'Original parts' : 'Oryginalne części'}
                </li>
              </ul>
              <a href="tel:503691808" className="text-emerald-600 dark:text-emerald-400 font-semibold hover:text-emerald-700 flex items-center gap-2">
                {isEnglish ? 'Call now' : 'Zadzwoń teraz'} →
              </a>
            </div>

            {/* Przegląd instalacji Gazowych */}
            <div className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-gray-100 hover:border-yellow-500 hover:-translate-y-2">
              <div className="w-20 h-20 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-xl">
                <span className="text-4xl">📋</span>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">{isEnglish ? 'Gas Installation Inspection' : 'Przegląd Instalacji Gazowych'}</h3>
              <p className="text-gray-600 mb-6">
                {isEnglish 
                  ? 'Mandatory safety inspections and certification of gas installations'
                  : 'Obowiązkowe przeglądy bezpieczeństwa i certyfikacja instalacji gazowych'}
              </p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center text-gray-700">
                  <span className="text-yellow-500 mr-2">✓</span>
                  {isEnglish ? 'Safety checks' : 'Kontrola szczelności'}
                </li>
                <li className="flex items-center text-gray-700">
                  <span className="text-yellow-500 mr-2">✓</span>
                  {isEnglish ? 'Official protocols' : 'Protokoły urzędowe'}
                </li>
                <li className="flex items-center text-gray-700">
                  <span className="text-yellow-500 mr-2">✓</span>
                  {isEnglish ? 'Compliance certificates' : 'Certyfikaty zgodności'}
                </li>
              </ul>
              <Link href={`/${locale}/services`} className="text-yellow-600 dark:text-yellow-500 font-semibold hover:text-yellow-700 flex items-center gap-2">
                {isEnglish ? 'Learn more' : 'Dowiedz się więcej'} →
              </Link>
            </div>

            {/* Montaż przydomowych oczyszczalni */}
            <div className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-gray-100 hover:border-lime-500 hover:-translate-y-2">
              <div className="w-20 h-20 bg-gradient-to-br from-lime-500 to-lime-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-xl">
                <span className="text-4xl">♻️</span>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">{isEnglish ? 'Sewage Treatment Plants' : 'Montaż Przydomowych Oczyszczalni'}</h3>
              <p className="text-gray-600 mb-6">
                {isEnglish 
                  ? 'Installation of domestic sewage treatment plants for ecological wastewater management'
                  : 'Instalacja przydomowych oczyszczalni ścieków dla ekologicznego gospodarowania wodami'}
              </p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center text-gray-700">
                  <span className="text-lime-500 mr-2">✓</span>
                  {isEnglish ? 'Site assessment' : 'Ocena terenu'}
                </li>
                <li className="flex items-center text-gray-700">
                  <span className="text-lime-500 mr-2">✓</span>
                  {isEnglish ? 'Full installation' : 'Kompleksowy montaż'}
                </li>
                <li className="flex items-center text-gray-700">
                  <span className="text-lime-500 mr-2">✓</span>
                  {isEnglish ? 'Service & maintenance' : 'Serwis i konserwacja'}
                </li>
              </ul>
              <Link href={`/${locale}/services`} className="text-lime-600 dark:text-lime-500 font-semibold hover:text-lime-700 flex items-center gap-2">
                {isEnglish ? 'Learn more' : 'Dowiedz się więcej'} →
              </Link>
            </div>

            {/* Usługi Minikoparką */}
            <div className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-gray-100 hover:border-stone-500 hover:-translate-y-2">
              <div className="w-20 h-20 bg-gradient-to-br from-stone-500 to-stone-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-xl">
                <span className="text-4xl">🚜</span>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">{isEnglish ? 'Mini Excavator Services' : 'Usługi Minikoparką'}</h3>
              <p className="text-gray-600 mb-6">
                {isEnglish 
                  ? 'Excavation work for installations, foundations, and landscaping'
                  : 'Prace ziemne pod instalacje, fundamenty oraz prace terenowe'}
              </p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center text-gray-700">
                  <span className="text-stone-500 mr-2">✓</span>
                  {isEnglish ? 'Trench digging' : 'Kopanie rowów'}
                </li>
                <li className="flex items-center text-gray-700">
                  <span className="text-stone-500 mr-2">✓</span>
                  {isEnglish ? 'Foundation work' : 'Prace fundamentowe'}
                </li>
                <li className="flex items-center text-gray-700">
                  <span className="text-stone-500 mr-2">✓</span>
                  {isEnglish ? 'Site leveling' : 'Wyrównywanie terenu'}
                </li>
              </ul>
              <Link href={`/${locale}/services`} className="text-stone-600 dark:text-stone-400 font-semibold hover:text-stone-700 flex items-center gap-2">
                {isEnglish ? 'Learn more' : 'Dowiedz się więcej'} →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* BOOKING SECTION */}
      <section id="booking" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-black mb-4 text-gray-900">
              {isEnglish ? 'Schedule Your Installation' : 'Umów Wizytę Online'}
            </h2>
            <p className="text-xl text-gray-600">
              {isEnglish ? 'Choose a convenient date from the calendar' : 'Wybierz dogodny termin z kalendarza'}
            </p>
          </div>
          
          <BookingCalendar />
        </div>
      </section>

      {/* REALIZATIONS MAP */}
      <RealizationsMap />

      {/* BLOG SECTION */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-black mb-4 text-gray-900">
              {isEnglish ? 'Latest News & Expert Tips' : 'Aktualności i Porady Ekspertów'}
            </h2>
            <p className="text-xl text-gray-600">
              {isEnglish ? 'Stay updated with heating technology trends' : 'Bądź na bieżąco z trendami w technologii grzewczej'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {getRecentPosts(3).map((post) => (
              <Link
                key={post.id}
                href={`/${locale}/blog/${post.slug}`}
                className="group bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all border border-gray-200 hover:border-blue-500 hover:-translate-y-2"
              >
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 h-40 flex items-center justify-center p-6">
                  <h3 className="text-lg font-bold text-white text-center line-clamp-2">
                    {isEnglish ? post.titleEn : post.title}
                  </h3>
                </div>
                <div className="p-6">
                  <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold mb-3">
                    {isEnglish ? post.categoryEn : post.category}
                  </span>
                  <p className="text-gray-600 text-sm line-clamp-3 mb-4">
                    {isEnglish ? post.excerptEn : post.excerpt}
                  </p>
                  <div className="text-blue-600 font-semibold text-sm group-hover:translate-x-2 transition-transform inline-flex items-center">
                    {isEnglish ? 'Read more' : 'Czytaj więcej'} →
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center">
            <Link
              href={`/${locale}/blog`}
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold rounded-xl text-lg transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105"
            >
              {isEnglish ? 'View All Articles' : 'Zobacz Wszystkie Artykuły'} →
            </Link>
          </div>
        </div>
      </section>

      {/* CONTACT FORM SECTION */}
      <section id="contact" className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-black mb-4 text-gray-900">
                {isEnglish ? 'Get in Touch' : 'Skontaktuj Się'}
              </h2>
              <p className="text-xl text-gray-600">
                {isEnglish ? 'We\'ll call you back within 24 hours' : 'Oddzwonimy w ciągu 24h'}
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12 border border-gray-100">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                      {isEnglish ? 'Name' : 'Imię i nazwisko'}
                    </label>
                    <input
                      type="text"
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder={isEnglish ? 'Your name' : 'Twoje imię'}
                    />
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">
                      {isEnglish ? 'Phone' : 'Telefon'}
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      required
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder={isEnglish ? 'Your phone' : 'Twój telefon'}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder={isEnglish ? 'your@email.com' : 'twoj@email.pl'}
                  />
                </div>

                <div>
                  <label htmlFor="service" className="block text-sm font-semibold text-gray-700 mb-2">
                    {isEnglish ? 'Service' : 'Usługa'}
                  </label>
                  <select
                    id="service"
                    value={formData.service}
                    onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                    required
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  >
                    <option value="">{isEnglish ? 'Choose service' : 'Wybierz usługę'}</option>
                    <option value="heat-pump">{isEnglish ? 'Heat Pump Installation' : 'Montaż Pompy Ciepła'}</option>
                    <option value="boiler">{isEnglish ? 'Condensing Boiler' : 'Kocioł Kondensacyjny'}</option>
                    <option value="underfloor">{isEnglish ? 'Underfloor Heating' : 'Ogrzewanie Podłogowe'}</option>
                    <option value="modernization">{isEnglish ? 'System Modernization' : 'Modernizacja CO'}</option>
                    <option value="service">{isEnglish ? 'Service/Repair' : 'Serwis/Naprawa'}</option>
                    <option value="other">{isEnglish ? 'Other' : 'Inne'}</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-semibold text-gray-700 mb-2">
                    {isEnglish ? 'Message' : 'Wiadomość'}
                  </label>
                  <textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    required
                    rows={5}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                    placeholder={isEnglish ? 'Describe your needs...' : 'Opisz swoją potrzebę...'}
                  ></textarea>
                </div>

                {status === 'success' && (
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-800">
                    ✅ {isEnglish ? 'Thank you! We\'ll respond as soon as possible.' : 'Dziękujemy! Odpowiemy najszybciej jak to możliwe.'}
                  </div>
                )}

                {status === 'error' && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
                    ❌ {errorMessage}
                  </div>
                )}

                <button 
                  type="submit"
                  disabled={status === 'sending'}
                  className="w-full px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold rounded-xl text-lg transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {status === 'sending' ? '⏳ '+(isEnglish ? 'Sending...' : 'Wysyłanie...') : '🚀 '+(isEnglish ? 'Send Request' : 'Wyślij Zapytanie')}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
