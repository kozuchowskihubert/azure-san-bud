'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import BookingCalendar from '@/components/BookingCalendar';

export default function HomePage() {
  // Business data
  const businessData = {
    phone: '503 691 808',
    email: 'kontakt@san-bud.pl',
  };

  // Form state management
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    message: '',
  });
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  // Validation functions
  const validateName = (name: string): string => {
    if (!name.trim()) return 'Imię i nazwisko są wymagane';
    if (name.trim().length < 3) return 'Minimum 3 znaki';
    return '';
  };

  const validateEmail = (email: string): string => {
    if (!email.trim()) return 'Email jest wymagany';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'Nieprawidłowy email';
    return '';
  };

  const validatePhone = (phone: string): string => {
    if (!phone.trim()) return 'Telefon jest wymagany';
    const digitsOnly = phone.replace(/\D/g, '');
    if (digitsOnly.length < 9) return 'Minimum 9 cyfr';
    return '';
  };

  const validateMessage = (message: string): string => {
    if (!message.trim()) return 'Wiadomość jest wymagana';
    if (message.trim().length < 10) return 'Minimum 10 znaków';
    return '';
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (fieldErrors[name]) {
      setFieldErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    let error = '';
    
    switch (name) {
      case 'name': error = validateName(value); break;
      case 'email': error = validateEmail(value); break;
      case 'phone': error = validatePhone(value); break;
      case 'message': error = validateMessage(value); break;
    }
    
    if (error) {
      setFieldErrors(prev => ({ ...prev, [name]: error }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const errors: Record<string, string> = {
      name: validateName(formData.name),
      email: validateEmail(formData.email),
      phone: validatePhone(formData.phone),
      message: validateMessage(formData.message),
    };

    const hasErrors = Object.values(errors).some(error => error !== '');
    
    if (hasErrors) {
      setFieldErrors(errors);
      return;
    }

    setStatus('sending');
    setErrorMessage('');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setStatus('success');
        setFormData({ name: '', email: '', phone: '', service: '', message: '' });
      } else {
        throw new Error(data.message || 'Błąd wysyłania');
      }
    } catch (error) {
      setStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Spróbuj ponownie');
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      
      {/* HERO SECTION */}
      <section className="relative h-[600px] md:h-[700px] overflow-hidden">
        {/* Video Background */}
        <div className="absolute inset-0 z-0">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover scale-105"
            style={{ objectPosition: 'center center' }}
            onError={(e) => {
              // Hide video and show gradient fallback if video fails to load
              e.currentTarget.style.display = 'none';
            }}
          >
            <source src="/images/menu.mov" type="video/quicktime" />
          </video>
          {/* Gradient fallback background */}
          <div className="absolute inset-0 bg-gradient-to-br from-green-900 via-gray-900 to-orange-900 -z-10"></div>
          {/* Dark overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/80"></div>
        </div>
        
        <div className="relative z-10 container mx-auto px-4 h-full flex items-center">
          <div className="max-w-4xl mx-auto text-center text-white">
            
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-600/20 border border-green-500/30 rounded-full backdrop-blur-sm mb-6">
              <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="text-sm font-semibold text-green-300">Profesjonalne Usługi Hydrauliczne</span>
            </div>

            <h1 className="text-5xl md:text-6xl font-black mb-6 leading-tight">
              <span className="bg-gradient-to-r from-white via-gray-100 to-white bg-clip-text text-transparent">
                Hydraulika Premium
              </span>
              <br />
              <span className="text-green-400">Dla Twojego Domu</span>
            </h1>
            
            <p className="text-xl md:text-2xl mb-10 font-light text-gray-200">
              Kompleksowe rozwiązania • Gwarancja jakości • Serwis 24/7
            </p>
            
            <div className="flex flex-wrap gap-4 justify-center mb-10">
              <a 
                href="#booking" 
                className="group px-8 py-4 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-bold rounded-xl text-lg transition-all duration-300 shadow-2xl hover:shadow-green-500/50 hover:scale-105 flex items-center gap-2"
              >
                📅 Umów Wizytę
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </a>
              <a 
                href={`tel:${businessData.phone}`}
                className="group px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold rounded-xl text-lg transition-all duration-300 shadow-2xl hover:shadow-orange-500/50 hover:scale-105 flex items-center gap-2"
              >
                📞 {businessData.phone}
              </a>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
              <div className="text-center bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-4">
                <div className="text-3xl font-black bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent mb-1">500+</div>
                <div className="text-xs text-gray-300">Projektów</div>
              </div>
              <div className="text-center bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-4">
                <div className="text-3xl font-black bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent mb-1">100%</div>
                <div className="text-xs text-gray-300">Zadowolonych</div>
              </div>
              <div className="text-center bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-4">
                <div className="text-3xl font-black bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-1">7</div>
                <div className="text-xs text-gray-300">Lat</div>
              </div>
              <div className="text-center bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-4">
                <div className="text-3xl font-black bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-1">24/7</div>
                <div className="text-xs text-gray-300">Serwis</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SERVICES SECTION */}
      <section className="py-20 bg-gradient-to-b from-white via-green-50/20 to-white dark:from-gray-900 dark:via-green-950/10 dark:to-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-black mb-4 text-gray-900 dark:text-white">
              Nasze Usługi
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Profesjonalne rozwiązania hydrauliczne
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="group bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 dark:border-gray-700 hover:border-green-500/50 hover:-translate-y-2">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <span className="text-3xl">🔧</span>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Instalacje</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Kompleksowe instalacje wodne, kanalizacyjne i grzewcze
              </p>
              <Link href="/services" className="text-green-600 dark:text-green-400 font-semibold hover:text-green-700 flex items-center gap-2">
                Dowiedz się więcej →
              </Link>
            </div>

            <div className="group bg-gradient-to-br from-green-600 to-green-700 dark:from-green-700 dark:to-green-800 rounded-2xl p-8 shadow-2xl border-2 border-green-500 transform hover:-translate-y-2 transition-all">
              <div className="absolute -top-4 right-8">
                <div className="bg-orange-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                  ⭐ Najpopularniejsze
                </div>
              </div>
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <span className="text-3xl">⚡</span>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-white">Serwis 24/7</h3>
              <p className="text-green-50 mb-6">
                Całodobowa pomoc w przypadku awarii i problemów
              </p>
              <a href={`tel:${businessData.phone}`} className="bg-white text-green-600 px-6 py-3 rounded-lg font-bold hover:bg-green-50 transition-colors flex items-center justify-center gap-2">
                📞 Zadzwoń Teraz
              </a>
            </div>

            <div className="group bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 dark:border-gray-700 hover:border-orange-500/50 hover:-translate-y-2">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <span className="text-3xl">🏗️</span>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Modernizacje</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Profesjonalne remonty łazienek i modernizacje instalacji
              </p>
              <Link href="/services" className="text-orange-600 dark:text-orange-400 font-semibold hover:text-orange-700 flex items-center gap-2">
                Zarezerwuj termin →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* BOOKING SECTION */}
      <section id="booking" className="py-20 bg-gradient-to-b from-gray-50 to-white dark:from-gray-800 dark:to-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-black mb-4 text-gray-900 dark:text-white">
              Umów Wizytę Online
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Wybierz dogodny termin z kalendarza
            </p>
          </div>
          
          <BookingCalendar />
        </div>
      </section>

      {/* CONTACT FORM SECTION */}
      <section id="contact" className="py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-black mb-4 text-gray-900 dark:text-white">
                Skontaktuj Się
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-400">
                Zostaw wiadomość, oddzwonimy
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 md:p-12 border border-gray-100 dark:border-gray-700">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                      Imię i nazwisko <span className="text-red-500">*</span>
                    </label>
                    <input 
                      type="text" 
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      required
                      disabled={status === 'sending'}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-100 dark:disabled:bg-gray-700 text-gray-900 dark:text-white dark:bg-gray-700 transition-colors ${
                        fieldErrors.name ? 'border-red-500 bg-red-50 dark:bg-red-900/20' : 'border-gray-300 dark:border-gray-600'
                      }`}
                      placeholder="Jan Kowalski"
                    />
                    {fieldErrors.name && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">{fieldErrors.name}</p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                      Telefon <span className="text-red-500">*</span>
                    </label>
                    <input 
                      type="tel" 
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      required
                      disabled={status === 'sending'}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-100 dark:disabled:bg-gray-700 text-gray-900 dark:text-white dark:bg-gray-700 transition-colors ${
                        fieldErrors.phone ? 'border-red-500 bg-red-50 dark:bg-red-900/20' : 'border-gray-300 dark:border-gray-600'
                      }`}
                      placeholder="123 456 789"
                    />
                    {fieldErrors.phone && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">{fieldErrors.phone}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input 
                    type="email" 
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    required
                    disabled={status === 'sending'}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-100 dark:disabled:bg-gray-700 text-gray-900 dark:text-white dark:bg-gray-700 transition-colors ${
                      fieldErrors.email ? 'border-red-500 bg-red-50 dark:bg-red-900/20' : 'border-gray-300 dark:border-gray-600'
                    }`}
                    placeholder="email@example.com"
                  />
                  {fieldErrors.email && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{fieldErrors.email}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="service" className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                    Rodzaj usługi
                  </label>
                  <select
                    id="service"
                    name="service"
                    value={formData.service}
                    onChange={handleChange}
                    disabled={status === 'sending'}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-100 dark:disabled:bg-gray-700 text-gray-900 dark:text-white dark:bg-gray-700 transition-colors"
                  >
                    <option value="">Wybierz usługę</option>
                    <option value="Instalacje wodne">Instalacje wodne</option>
                    <option value="Instalacje kanalizacyjne">Instalacje kanalizacyjne</option>
                    <option value="Systemy grzewcze">Systemy grzewcze</option>
                    <option value="Serwis i naprawy">Serwis i naprawy</option>
                    <option value="Modernizacje">Modernizacje</option>
                    <option value="Inne">Inne</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                    Wiadomość <span className="text-red-500">*</span>
                  </label>
                  <textarea 
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    required
                    disabled={status === 'sending'}
                    rows={5}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-100 dark:disabled:bg-gray-700 text-gray-900 dark:text-white dark:bg-gray-700 transition-colors resize-none ${
                      fieldErrors.message ? 'border-red-500 bg-red-50 dark:bg-red-900/20' : 'border-gray-300 dark:border-gray-600'
                    }`}
                    placeholder="Opisz swoją potrzebę..."
                  ></textarea>
                  {fieldErrors.message && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{fieldErrors.message}</p>
                  )}
                </div>

                {status === 'success' && (
                  <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-lg text-green-800 dark:text-green-300">
                    ✅ Dziękujemy! Odpowiemy najszybciej jak to możliwe.
                  </div>
                )}

                {status === 'error' && (
                  <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg text-red-800 dark:text-red-300">
                    ❌ {errorMessage}
                  </div>
                )}

                <button 
                  type="submit"
                  disabled={status === 'sending'}
                  className="w-full px-8 py-4 bg-gradient-to-r from-green-600 to-orange-600 hover:from-green-700 hover:to-orange-700 text-white font-bold rounded-lg text-lg transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {status === 'sending' ? '⏳ Wysyłanie...' : '🚀 Wyślij zapytanie'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
