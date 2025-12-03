'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import BookingCalendar from '@/components/BookingCalendar';
import Partners from '@/components/Partners';

export default function HomePage() {
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
    if (name.trim().length < 3) return 'Imię i nazwisko muszą mieć minimum 3 znaki';
    if (!/^[a-zA-ZąćęłńóśźżĄĆĘŁŃÓŚŹŻ\s-]+$/.test(name)) return 'Imię i nazwisko mogą zawierać tylko litery';
    return '';
  };

  const validateEmail = (email: string): string => {
    if (!email.trim()) return 'Email jest wymagany';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return 'Nieprawidłowy adres email';
    return '';
  };

  const validatePhone = (phone: string): string => {
    if (!phone.trim()) return 'Numer telefonu jest wymagany';
    // Remove all non-digit characters for validation
    const digitsOnly = phone.replace(/\D/g, '');
    if (digitsOnly.length < 9) return 'Numer telefonu musi mieć minimum 9 cyfr';
    if (digitsOnly.length > 15) return 'Numer telefonu jest zbyt długi';
    if (!/^[\d\s+()-]+$/.test(phone)) return 'Nieprawidłowy format numeru telefonu';
    return '';
  };

  const validateMessage = (message: string): string => {
    if (!message.trim()) return 'Wiadomość jest wymagana';
    if (message.trim().length < 10) return 'Wiadomość musi mieć minimum 10 znaków';
    if (message.trim().length > 1000) return 'Wiadomość może mieć maksymalnie 1000 znaków';
    return '';
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    
    errors.name = validateName(formData.name);
    errors.email = validateEmail(formData.email);
    errors.phone = validatePhone(formData.phone);
    errors.message = validateMessage(formData.message);

    // Remove empty error messages
    Object.keys(errors).forEach(key => {
      if (!errors[key]) delete errors[key];
    });

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    
    // Validate form before submitting
    if (!validateForm()) {
      setStatus('error');
      setErrorMessage('Proszę poprawić błędy w formularzu');
      return;
    }
    
    setStatus('sending');
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://api.sanbud24.pl'}/api/contact`, {
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
        setFieldErrors({});
        
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
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear field error when user starts typing
    if (fieldErrors[name]) {
      setFieldErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    let error = '';

    switch (name) {
      case 'name':
        error = validateName(value);
        break;
      case 'email':
        error = validateEmail(value);
        break;
      case 'phone':
        error = validatePhone(value);
        break;
      case 'message':
        error = validateMessage(value);
        break;
    }

    if (error) {
      setFieldErrors(prev => ({ ...prev, [name]: error }));
    }
  };

  // Business data matching Google Maps
  const businessData = {
    name: 'San-Bud Hydraulika',
    tagline: 'Profesjonalne usługi hydrauliczne',
    established: '2018',
    address: 'Polska',
    phone: '+48 503 691 808',
    email: 'sanbud.biuro@gmail.com',
    googleMaps: 'https://www.google.com/maps/place/San-Bud+Hydraulika+Nasza+pasja/@52.6330895,20.3494125,17z',
    facebook: 'https://www.facebook.com/sanbud',
  };

  const services = [
    {
      icon: '💧',
      title: 'Instalacje wodne',
      description: 'Kompleksowe instalacje wod-kan w budynkach mieszkalnych i komercyjnych',
      features: ['Woda', 'Kanalizacja', 'Gaz', 'Centralne ogrzewanie']
    },
    {
      icon: '🛁',
      title: 'Remonty łazienek',
      description: 'Profesjonalne remonty od projektu po wykończenie',
      features: ['Projekt', 'Hydraulika', 'Wykończenia', 'Ceramika']
    },
    {
      icon: '🔧',
      title: 'Serwis i naprawy',
      description: 'Szybkie interwencje i naprawy hydrauliczne',
      features: ['Awarie 24/7', 'Konserwacje', 'Modernizacje', 'Przeglądy']
    }
  ];

  const processSteps = [
    { number: '01', title: 'Kontakt', description: 'Skontaktuj się telefonicznie lub przez formularz' },
    { number: '02', title: 'Wycena', description: 'Bezpłatny kosztorys i doradztwo techniczne' },
    { number: '03', title: 'Termin', description: 'Ustalenie terminu realizacji projektu' },
    { number: '04', title: 'Realizacja', description: 'Profesjonalne wykonanie zgodnie z umową' },
    { number: '05', title: 'Odbiór', description: 'Kontrola jakości i odbiór techniczny' },
    { number: '06', title: 'Gwarancja', description: 'Pełna gwarancja na wykonane usługi' }
  ];

  const benefits = [
    { icon: '⭐', title: 'Doświadczenie', text: '7 lat na rynku, ponad 500 zrealizowanych projektów' },
    { icon: '🏆', title: 'Jakość', text: 'Współpraca tylko z renomowanymi producentami' },
    { icon: '⚡', title: 'Szybkość', text: 'Realizacja zgodnie z ustalonym harmonogramem' },
    { icon: '💰', title: 'Ceny', text: 'Konkurencyjne ceny bez ukrytych kosztów' }
  ];

  return (
    <div className="min-h-screen bg-white">
      
      {/* HERO SECTION - Professional & Clean */}
      <section className="relative bg-gradient-to-br from-blue-50 via-white to-gray-50 pt-32 pb-20 md:pt-40 md:pb-28">
        {/* Subtle Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, rgb(59, 130, 246) 1px, transparent 0)',
            backgroundSize: '40px 40px'
          }}></div>
        </div>
        
        <div className="relative z-10 container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            
            {/* Main Heading */}
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-gray-900">
              Profesjonalne Usługi Hydrauliczne
            </h1>
            
            <p className="text-xl md:text-2xl mb-4 text-gray-700">
              {businessData.tagline}
            </p>
            
            <p className="text-lg mb-10 text-gray-600 max-w-2xl mx-auto">
              Kompleksowe rozwiązania hydrauliczne dla Twojego domu i firmy. 
              Działamy od 2018 roku z pełnym profesjonalizmem i zaangażowaniem.
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4 justify-center mb-12">
              <a 
                href="#contact" 
                className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg text-lg transition-colors duration-200 shadow-md hover:shadow-lg"
              >
                Bezpłatna Wycena
              </a>
              <a 
                href={`tel:${businessData.phone}`}
                className="px-8 py-4 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg text-lg transition-colors duration-200 shadow-md hover:shadow-lg flex items-center gap-2"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                503 691 808
              </a>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-6 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">500+</div>
                <div className="text-sm text-gray-600">Projektów</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">7 lat</div>
                <div className="text-sm text-gray-600">Doświadczenia</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">24/7</div>
                <div className="text-sm text-gray-600">Pogotowie</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* LEADER SECTION - O firmie */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
              Lider branży hydraulicznej
            </h2>
            <p className="text-xl text-gray-600 leading-relaxed">
              Doświadczenie w branży hydraulicznej oraz indywidualne podejście do klienta to coś, 
              co wyróżnia nas na tle innych firm! Specjalnie dla Ciebie zaprojektujemy i wykonamy 
              wydajną instalację wodną, która zapewni Ci komfort, niezawodność oraz zwiększy 
              wartość Twojej nieruchomości.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
            <div className="relative h-96 rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src="/images/sanbud-google-2.jpg"
                alt="Realizacja San-Bud"
                fill
                className="object-cover"
              />
            </div>
            <div className="space-y-6">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-start gap-4 p-4 bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300">
                  <div className="text-4xl flex-shrink-0">{benefit.icon}</div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{benefit.title}</h3>
                    <p className="text-gray-600">{benefit.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SERVICES SECTION */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
              Nasze usługi
            </h2>
            <p className="text-xl text-gray-600">
              Kompleksowe rozwiązania hydrauliczne dostosowane do Twoich potrzeb
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {services.map((service, index) => (
              <div key={index} className="bg-gradient-to-br from-blue-50 to-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                <div className="text-6xl mb-4">{service.icon}</div>
                <h3 className="text-2xl font-bold mb-3 text-gray-900">{service.title}</h3>
                <p className="text-gray-600 mb-6">{service.description}</p>
                <ul className="space-y-2">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-gray-700">
                      <span className="text-blue-600">✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* REALIZATIONS MAP SECTION */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
              Poznaj nasze realizacje
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Swoją działalnością wpływamy na komfort życia klientów w całej Polsce
            </p>
            <Link 
              href="/services"
              className="inline-block px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors duration-300"
            >
              Zobacz wszystkie realizacje
            </Link>
          </div>

          {/* Gallery Grid */}
          <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto mt-12">
            {[1, 2, 3, 4, 5, 6].map((num) => (
              <div key={num} className="relative h-64 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 group">
                <Image
                  src={`/images/sanbud-google-${num}.jpg`}
                  alt={`Realizacja ${num}`}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            ))}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto mt-16">
            <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-white rounded-xl shadow-md">
              <div className="text-4xl font-bold text-blue-600 mb-2">500+</div>
              <div className="text-gray-600">Projektów</div>
            </div>
            <div className="text-center p-6 bg-gradient-to-br from-green-50 to-white rounded-xl shadow-md">
              <div className="text-4xl font-bold text-green-600 mb-2">7</div>
              <div className="text-gray-600">Lat doświadczenia</div>
            </div>
            <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-white rounded-xl shadow-md">
              <div className="text-4xl font-bold text-purple-600 mb-2">24/7</div>
              <div className="text-gray-600">Serwis</div>
            </div>
            <div className="text-center p-6 bg-gradient-to-br from-orange-50 to-white rounded-xl shadow-md">
              <div className="text-4xl font-bold text-orange-600 mb-2">100%</div>
              <div className="text-gray-600">Gwarancja</div>
            </div>
          </div>
        </div>
      </section>

      {/* PARTNERS SECTION */}
      <Partners />

      {/* ONLINE BOOKING SECTION */}
      <section id="booking" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
              Umów wizytę online
            </h2>
            <p className="text-xl text-gray-600">
              Wybierz dogodny termin z kalendarza - to proste i szybkie!
            </p>
          </div>
          
          <BookingCalendar />
        </div>
      </section>

      {/* CONTACT FORM SECTION */}
      <section id="contact" className="py-20 bg-gradient-to-b from-blue-50 to-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
                Zacznij oszczędzać czas!
              </h2>
              <p className="text-xl text-gray-600">
                Zostaw kontakt, oddzwonimy
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Otrzymasz wycenę w ciągu 24h lub zadzwoń: <a href={`tel:${businessData.phone}`} className="text-blue-600 font-bold hover:underline">{businessData.phone}</a>
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-bold text-gray-700 mb-2">
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
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 text-gray-900 ${
                        fieldErrors.name ? 'border-red-500 bg-red-50' : 'border-gray-300'
                      }`}
                      placeholder="Jan Kowalski"
                    />
                    {fieldErrors.name && (
                      <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        {fieldErrors.name}
                      </p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-bold text-gray-700 mb-2">
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
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 text-gray-900 ${
                        fieldErrors.phone ? 'border-red-500 bg-red-50' : 'border-gray-300'
                      }`}
                      placeholder="+48 123 456 789"
                    />
                    {fieldErrors.phone && (
                      <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        {fieldErrors.phone}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-bold text-gray-700 mb-2">
                    E-mail <span className="text-red-500">*</span>
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
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 text-gray-900 ${
                      fieldErrors.email ? 'border-red-500 bg-red-50' : 'border-gray-300'
                    }`}
                    placeholder="email@example.com"
                  />
                  {fieldErrors.email && (
                    <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {fieldErrors.email}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="service" className="block text-sm font-bold text-gray-700 mb-2">Rodzaj usługi</label>
                  <select 
                    id="service"
                    name="service"
                    value={formData.service}
                    onChange={handleChange}
                    disabled={status === 'sending'}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 text-gray-900"
                  >
                    <option value="">Wybierz usługę</option>
                    <option value="Instalacje wodne">Instalacje wodne</option>
                    <option value="Remont łazienki">Remont łazienki</option>
                    <option value="Awaria">Awaria</option>
                    <option value="Konserwacja">Konserwacja</option>
                    <option value="Inne">Inne</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-bold text-gray-700 mb-2">
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
                    rows={4} 
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 text-gray-900 ${
                      fieldErrors.message ? 'border-red-500 bg-red-50' : 'border-gray-300'
                    }`}
                    placeholder="Opisz swoją potrzebę... (minimum 10 znaków)"
                  ></textarea>
                  {fieldErrors.message && (
                    <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {fieldErrors.message}
                    </p>
                  )}
                  <p className="mt-1 text-xs text-gray-500">
                    {formData.message.length}/1000 znaków
                  </p>
                </div>

                <div className="flex items-start gap-2">
                  <input type="checkbox" className="mt-1" id="privacy" required />
                  <label htmlFor="privacy" className="text-sm text-gray-600">
                    Wyrażam zgodę na przetwarzanie moich danych osobowych w celu kontaktu oraz przesyłania ofert <span className="text-red-500">*</span>
                  </label>
                </div>

                {status === 'success' && (
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-800">
                    ✅ Dziękujemy za wiadomość! Odpowiemy najszybciej jak to możliwe.
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
                  className="w-full px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold rounded-lg text-lg transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {status === 'sending' ? 'Wysyłanie...' : 'Wyślij zapytanie'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
