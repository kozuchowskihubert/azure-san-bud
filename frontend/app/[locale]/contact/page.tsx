'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { buildApiUrl } from '@/utils/api';

export default function ContactPage() {
  const t = useTranslations();
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
    setErrorMessage('');
    
    try {
      const response = await fetch(buildApiUrl('api/contact'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      const data = await response.json();
      
      if (response.ok && data.success) {
        setStatus('success');
        setFormData({ name: '', email: '', phone: '', service: '', message: '' });
        
        // Reset success message after 5 seconds
        setTimeout(() => {
          setStatus('idle');
        }, 5000);
      } else {
        setStatus('error');
        setErrorMessage(data.error || 'Wystąpił błąd podczas wysyłania wiadomości');
      }
    } catch (error) {
      setStatus('error');
      setErrorMessage('Nie udało się połączyć z serwerem. Spróbuj ponownie później lub zadzwoń: +48 503 691 808');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <main className="min-h-screen bg-white dark:bg-gray-900">
      {/* Schema.org structured data for better SEO and search visibility */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            "name": "SanBud - Instalacje Sanitarne",
            "image": "https://sanbud24.pl/images/logo.jpg",
            "description": "Profesjonalne usługi hydrauliczne, instalacje sanitarne, ogrzewanie i klimatyzacja w województwie mazowieckim. 15 lat doświadczenia, 500+ zadowolonych klientów.",
            "address": {
              "@type": "PostalAddress",
              "addressLocality": "Warszawa",
              "addressRegion": "Mazowieckie",
              "addressCountry": "PL"
            },
            "geo": {
              "@type": "GeoCoordinates",
              "latitude": "52.2297",
              "longitude": "21.0122"
            },
            "telephone": "+48503691808",
            "email": "sanbud.biuro@gmail.com",
            "url": "https://sanbud24.pl",
            "openingHoursSpecification": [
              {
                "@type": "OpeningHoursSpecification",
                "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
                "opens": "08:00",
                "closes": "18:00"
              },
              {
                "@type": "OpeningHoursSpecification",
                "dayOfWeek": "Saturday",
                "opens": "09:00",
                "closes": "14:00"
              }
            ],
            "priceRange": "$$",
            "areaServed": {
              "@type": "State",
              "name": "Mazowieckie"
            },
            "serviceType": [
              "Instalacje wodno-kanalizacyjne",
              "Instalacje grzewcze",
              "Ogrzewanie podłogowe",
              "Kotłownie",
              "Łazienki pod klucz",
              "Instalacje gazowe"
            ]
          })
        }}
      />

      {/* Hero Section with gradient matching main page */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-green-900 via-gray-900 to-orange-900"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/80"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center text-white">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-600/20 border border-green-500/30 rounded-full backdrop-blur-sm mb-6">
              <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
              </svg>
              <span className="text-sm font-semibold text-green-300">Skontaktuj się z nami</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight">
              <span className="bg-gradient-to-r from-white via-gray-100 to-white bg-clip-text text-transparent">
                Jesteśmy do
              </span>
              <br />
              <span className="text-green-400">Twojej Dyspozycji</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-200 leading-relaxed">
              Profesjonalna obsługa • Szybki czas reakcji • Doświadczony zespół
            </p>
          </div>
        </div>
      </section>

      {/* Contact Form and Info Section */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white dark:from-gray-800 dark:to-gray-900">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* Contact Information */}
            <div className="space-y-6">
              <div>
                <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
                  Dane kontaktowe
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mb-8 text-lg">
                  Skontaktuj się z nami w dogodny dla Ciebie sposób. Odpowiadamy na wszystkie zapytania w ciągu 24 godzin.
                </p>
              </div>

              {/* Contact Cards with green/orange theme */}
              <div className="space-y-4">
                {/* Phone Card */}
                <div className="group bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 dark:border-gray-700 hover:border-green-500/50">
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                      <span className="text-2xl">📞</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900 dark:text-white mb-1 text-lg">
                        Telefon
                      </h3>
                      <a
                        href="tel:+48503691808"
                        className="text-green-600 dark:text-green-400 hover:text-green-700 font-semibold transition-colors text-xl"
                      >
                        +48 503 691 808
                      </a>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        Pon-Pt: 8:00-18:00, Sob: 9:00-14:00
                      </p>
                    </div>
                  </div>
                </div>

                {/* Email Card */}
                <div className="group bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 dark:border-gray-700 hover:border-orange-500/50">
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                      <span className="text-2xl">✉️</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900 dark:text-white mb-1 text-lg">
                        Email
                      </h3>
                      <a
                        href="mailto:sanbud.biuro@gmail.com"
                        className="text-orange-600 dark:text-orange-400 hover:text-orange-700 font-semibold transition-colors"
                      >
                        sanbud.biuro@gmail.com
                      </a>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        Odpowiadamy w ciągu 24h
                      </p>
                    </div>
                  </div>
                </div>

                {/* Address Card */}
                <div className="group bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 dark:border-gray-700 hover:border-blue-500/50">
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                      <span className="text-2xl">📍</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900 dark:text-white mb-1 text-lg">
                        Adres
                      </h3>
                      <p className="text-gray-900 dark:text-white font-semibold">
                        SanBud - Instalacje Sanitarne
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        ul. Dalii 8
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        09-100 Płońsk
                      </p>
                      <a
                        href="https://maps.google.com/maps?hl=pl&gl=pl&um=1&ie=UTF-8&fb=1&sa=X&ftid=0x471c190083c3c4fd:0xbf6e32df66376788"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:text-blue-700 text-sm font-semibold mt-2 transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        Zobacz na mapie
                      </a>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                        Obsługujemy całe województwo mazowieckie
                      </p>
                    </div>
                  </div>
                </div>

                {/* Hours Card */}
                <div className="group bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 dark:border-gray-700 hover:border-orange-500/50">
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                      <span className="text-2xl">�</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900 dark:text-white mb-1 text-lg">
                        Godziny otwarcia
                      </h3>
                      <p className="text-gray-900 dark:text-white font-semibold">
                        Poniedziałek - Piątek
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        8:00 - 18:00
                      </p>
                    </div>
                  </div>
                </div>

                {/* Facebook Card */}
                <div className="group bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-blue-500">
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                      <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-white mb-1 text-lg">
                        Facebook
                      </h3>
                      <a
                        href="https://www.facebook.com/sanbud.hydraulika"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-100 hover:text-white font-semibold transition-colors flex items-center gap-2 group/link"
                      >
                        Odwiedź naszą stronę
                        <svg className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                      </a>
                      <p className="text-sm text-blue-100 mt-1">
                        Zobacz nasze realizacje i opinie
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form with green/orange theme */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-2xl border border-gray-100 dark:border-gray-700">
              <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
                Wyślij wiadomość
              </h2>
              
              {status === 'success' && (
                <div className="mb-6 p-4 rounded-lg bg-[rgb(var(--color-success))]/20 border border-[rgb(var(--color-success))] text-[rgb(var(--color-success))]">
                  ✓ Wiadomość wysłana pomyślnie! Skontaktujemy się wkrótce.
                </div>
              )}

              {status === 'error' && (
                <div className="mb-6 p-4 rounded-lg bg-red-100 border border-red-400 text-red-700">
                  ✗ {errorMessage}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-semibold text-[rgb(var(--color-text-primary))] mb-2">
                    Imię i nazwisko *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-lg bg-[rgb(var(--color-bg-elevated))] border border-[rgb(var(--color-border))] text-[rgb(var(--color-text-primary))] focus:border-[rgb(var(--color-primary))] focus:outline-none transition-colors"
                    placeholder="Jan Kowalski"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="email" className="block text-sm font-semibold text-[rgb(var(--color-text-primary))] mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-lg bg-[rgb(var(--color-bg-elevated))] border border-[rgb(var(--color-border))] text-[rgb(var(--color-text-primary))] focus:border-[rgb(var(--color-primary))] focus:outline-none transition-colors"
                      placeholder="jan@example.com"
                    />
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-semibold text-[rgb(var(--color-text-primary))] mb-2">
                      Telefon
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg bg-[rgb(var(--color-bg-elevated))] border border-[rgb(var(--color-border))] text-[rgb(var(--color-text-primary))] focus:border-[rgb(var(--color-primary))] focus:outline-none transition-colors"
                      placeholder="+48 503 691 808"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="service" className="block text-sm font-semibold text-[rgb(var(--color-text-primary))] mb-2">
                    Rodzaj usługi
                  </label>
                  <select
                    id="service"
                    name="service"
                    value={formData.service}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg bg-[rgb(var(--color-bg-elevated))] border border-[rgb(var(--color-border))] text-[rgb(var(--color-text-primary))] focus:border-[rgb(var(--color-primary))] focus:outline-none transition-colors"
                  >
                    <option value="">Wybierz usługę</option>
                    <option value="plumbing">Montaż instalacji wodnych</option>
                    <option value="bathroom">Łazienki pod klucz</option>
                    <option value="heating">Instalacje grzewcze</option>
                    <option value="repair">Naprawy i konserwacja</option>
                    <option value="sanitary">Instalacje sanitarne</option>
                    <option value="other">Inna usługa</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-semibold text-[rgb(var(--color-text-primary))] mb-2">
                    Wiadomość *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    className="w-full px-4 py-3 rounded-lg bg-[rgb(var(--color-bg-elevated))] border border-[rgb(var(--color-border))] text-[rgb(var(--color-text-primary))] focus:border-[rgb(var(--color-primary))] focus:outline-none transition-colors resize-none"
                    placeholder="Opisz swoje potrzeby..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={status === 'sending'}
                  className="btn btn-gradient w-full"
                >
                  {status === 'sending' ? 'Wysyłanie...' : 'Wyślij wiadomość'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Google Maps Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
              Nasza Lokalizacja
            </h2>
            <p className="text-gray-600 dark:text-gray-300 text-lg max-w-2xl mx-auto">
              Siedziba firmy w Płońsku. Obsługujemy całe województwo mazowieckie.
            </p>
          </div>

          <div className="max-w-5xl mx-auto">
            <div className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-xl border border-gray-200 dark:border-gray-700">
              {/* Address Info Bar */}
              <div className="bg-gradient-to-r from-blue-500 to-teal-500 p-6 text-white">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-bold text-lg mb-1">SanBud - Instalacje Sanitarne</h3>
                      <p className="text-white/90">ul. Dalii 8, 09-100 Płońsk</p>
                      <p className="text-white/80 text-sm mt-1">Woj. Mazowieckie</p>
                    </div>
                  </div>
                  <a
                    href="https://maps.google.com/maps?hl=pl&gl=pl&um=1&ie=UTF-8&fb=1&sa=X&ftid=0x471c190083c3c4fd:0xbf6e32df66376788"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-blue-600 rounded-xl font-bold hover:bg-gray-100 transition-all duration-300 shadow-lg hover:scale-105"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    Otwórz w Google Maps
                  </a>
                </div>
              </div>

              {/* Google Maps Embed */}
              <div className="relative w-full h-[500px]">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2407.7646524858!2d20.374732!3d52.6240566!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x471c190083c3c4fd%3A0xbf6e32df66376788!2sDalii%208%2C%2009-100%20P%C5%82o%C5%84sk!5e0!3m2!1spl!2spl!4v1733328000000!5m2!1spl!2spl"
                  width="100%"
                  height="500"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Mapa lokalizacji SanBud - Instalacje Sanitarne"
                  className="w-full h-full"
                />
              </div>

              {/* Quick Info Below Map */}
              <div className="p-6 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 dark:text-white mb-1">Telefon</h4>
                      <a href="tel:+48503691808" className="text-green-600 dark:text-green-400 hover:text-green-700 font-semibold">
                        +48 503 691 808
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 dark:text-white mb-1">Godziny</h4>
                      <p className="text-gray-600 dark:text-gray-300 text-sm">Pon-Pt: 8:00-18:00</p>
                      <p className="text-gray-600 dark:text-gray-300 text-sm">Sob: 9:00-14:00</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 dark:text-white mb-1">Email</h4>
                      <a href="mailto:sanbud.biuro@gmail.com" className="text-blue-600 dark:text-blue-400 hover:text-blue-700 font-semibold text-sm">
                        sanbud.biuro@gmail.com
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
