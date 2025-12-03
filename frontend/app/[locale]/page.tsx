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

  // Hero video background
  const heroVideo = '/images/IMG_6550.mov';

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      
      {/* HERO SECTION - Premium Professional */}
      <section className="relative h-[700px] md:h-[800px] overflow-hidden">
        {/* Video Background */}
        <div className="absolute inset-0 z-0">
          <video
            key={heroVideo}
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
          >
            <source src={heroVideo} type="video/mp4" />
            <source src={heroVideo} type="video/quicktime" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/70"></div>
        </div>
        
        <div className="relative z-10 container mx-auto px-4 h-full flex items-center">
          <div className="max-w-5xl mx-auto text-center text-white">
            
            {/* Premium Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-600/20 border border-green-500/30 rounded-full backdrop-blur-sm mb-6">
              <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="text-sm font-semibold text-green-300">Certyfikowani Specjaliści • 7 Lat Doskonałości</span>
            </div>

            {/* Main Heading - Enhanced */}
            <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight">
              <span className="bg-gradient-to-r from-white via-gray-100 to-white bg-clip-text text-transparent">
                Mistrzowie Hydrauliki
              </span>
              <br />
              <span className="text-green-400">Na Wyciągnięcie Ręki</span>
            </h1>
            
            <p className="text-2xl md:text-3xl mb-4 font-light text-gray-200">
              Precyzja • Niezawodność • Perfekcja
            </p>
            
            <p className="text-lg md:text-xl mb-10 text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Eksperci od kompleksowych rozwiązań hydraulicznych. Od 2018 roku tworzymy instalacje,
              które łączą najwyższą jakość z innowacyjnymi technologiami. Twój dom zasługuje na najlepszych.
            </p>
            
            {/* CTA Buttons - Enhanced */}
            <div className="flex flex-wrap gap-4 justify-center mb-12">
              <a 
                href="#contact" 
                className="group px-10 py-5 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-bold rounded-xl text-lg transition-all duration-300 shadow-2xl hover:shadow-green-500/50 hover:scale-105 flex items-center gap-3"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Darmowa Wycena Premium
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </a>
              <a 
                href={`tel:${businessData.phone}`}
                className="group px-10 py-5 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold rounded-xl text-lg transition-all duration-300 shadow-2xl hover:shadow-orange-500/50 hover:scale-105 flex items-center gap-3"
              >
                <svg className="w-6 h-6 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span className="flex flex-col items-start">
                  <span className="text-xs text-orange-100 font-normal">Zadzwoń Teraz</span>
                  <span className="font-black">503 691 808</span>
                </span>
              </a>
            </div>

            {/* Premium Trust Badges */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
              <div className="text-center bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all duration-300 hover:scale-105">
                <div className="text-4xl md:text-5xl font-black bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent mb-2">500+</div>
                <div className="text-sm text-gray-300 font-medium">Zrealizowanych Projektów</div>
              </div>
              <div className="text-center bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all duration-300 hover:scale-105">
                <div className="text-4xl md:text-5xl font-black bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent mb-2">100%</div>
                <div className="text-sm text-gray-300 font-medium">Zadowolonych Klientów</div>
              </div>
              <div className="text-center bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all duration-300 hover:scale-105">
                <div className="text-4xl md:text-5xl font-black bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-2">7</div>
                <div className="text-sm text-gray-300 font-medium">Lat Doświadczenia</div>
              </div>
              <div className="text-center bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all duration-300 hover:scale-105">
                <div className="text-4xl md:text-5xl font-black bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">24/7</div>
                <div className="text-sm text-gray-300 font-medium">Awaryjne Wsparcie</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* EXPERTISE SHOWCASE - New Premium Section */}
      <section className="py-24 bg-white dark:bg-gray-900 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5 dark:opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, rgb(34 197 94) 1px, transparent 0)',
            backgroundSize: '40px 40px'
          }}></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-6xl mx-auto">
            
            {/* Section Header */}
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-sm font-semibold mb-4">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Dlaczego Wybierają Właśnie Nas
              </div>
              <h2 className="text-4xl md:text-5xl font-black mb-6 text-gray-900 dark:text-white">
                Profesjonalizm, Który Robi Różnicę
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
                Nie jesteśmy zwykłymi hydraulikami - jesteśmy ekspertami, którzy traktują każdy projekt jako dzieło sztuki.
              </p>
            </div>

            {/* Expertise Grid */}
            <div className="grid md:grid-cols-3 gap-8 mb-16">
              {[
                {
                  icon: (
                    <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                    </svg>
                  ),
                  title: "Certyfikowani Eksperci",
                  description: "Pełne uprawnienia budowlane, certyfikaty producentów najlepszych systemów grzewczych i sanitarnych. Ciągłe szkolenia z najnowszych technologii.",
                  highlight: "15+ certyfikatów"
                },
                {
                  icon: (
                    <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  ),
                  title: "Najnowsze Technologie",
                  description: "Wykorzystujemy profesjonalny sprzęt diagnostyczny, kamery inspekcyjne, termowizję i najnowocześniejsze narzędzia branżowe.",
                  highlight: "Tech Premium"
                },
                {
                  icon: (
                    <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  ),
                  title: "Gwarancja & Szybkość",
                  description: "Do 5 lat gwarancji na wykonane prace. Reakcja awaryjna 24/7 w maks. 60 minut. Terminowość to nasza wizytówka.",
                  highlight: "5 lat gwarancji"
                },
              ].map((item, index) => (
                <div key={index} className="group relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                  <div className="relative bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-gray-100 dark:border-gray-700 hover:border-green-500 dark:hover:border-green-600">
                    <div className="text-green-600 dark:text-green-400 mb-4">
                      {item.icon}
                    </div>
                    <div className="inline-block px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-xs font-bold mb-3">
                      {item.highlight}
                    </div>
                    <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">{item.title}</h3>
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* LEADER SECTION - Enhanced */}
      <section className="py-24 bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              
              {/* Left Content */}
              <div>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 rounded-full text-sm font-semibold mb-6">
                  🏆 Liderzy Branży
                </div>
                <h2 className="text-4xl md:text-5xl font-black mb-6 text-gray-900 dark:text-white leading-tight">
                  Mistrzowskie Wykonanie w Każdym Detalu
                </h2>
                <p className="text-xl text-gray-700 dark:text-gray-300 leading-relaxed mb-8">
                  To nie jest zwykła hydraulika. To sztuka łączenia precyzji, doświadczenia i pasji. 
                  Każda instalacja to dla nas manifestacja doskonałości.
                </p>

                <div className="space-y-4">
                  {[
                    "Indywidualne projekty dostosowane do Twoich potrzeb",
                    "Tylko premium materiały od światowych liderów",
                    "Kompleksowa obsługa - od pomysłu do realizacji",
                    "Transparentne ceny bez ukrytych kosztów",
                  ].map((item, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mt-1">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <p className="text-lg text-gray-700 dark:text-gray-300 font-medium">{item}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-10 flex gap-4">
                  <a href="#contact" className="px-8 py-4 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105">
                    Rozpocznij Projekt
                  </a>
                  <a href="/pl/about" className="px-8 py-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-2 border-gray-300 dark:border-gray-600 hover:border-green-500 dark:hover:border-green-500 font-bold rounded-xl transition-all duration-300 hover:scale-105">
                    Poznaj Nas
                  </a>
                </div>
              </div>

              {/* Right Stats Grid */}
              <div className="grid grid-cols-2 gap-6">
                {[
                  { number: "500+", label: "Zadowolonych Klientów", icon: "👥" },
                  { number: "7", label: "Lat Doświadczenia", icon: "📅" },
                  { number: "100%", label: "Jakość Wykonania", icon: "⭐" },
                  { number: "24/7", label: "Wsparcie Awaryjne", icon: "🚨" },
                ].map((stat, index) => (
                  <div key={index} className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl border-2 border-gray-100 dark:border-gray-700 hover:border-orange-500 dark:hover:border-orange-500 transition-all duration-300 hover:scale-105 text-center">
                    <div className="text-4xl mb-3">{stat.icon}</div>
                    <div className="text-4xl font-black bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent mb-2">
                      {stat.number}
                    </div>
                    <div className="text-sm font-semibold text-gray-600 dark:text-gray-400">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PREMIUM SERVICES SECTION */}
      <section className="py-24 bg-gradient-to-br from-white via-green-50/30 to-white dark:from-gray-900 dark:via-green-950/20 dark:to-gray-900">
        <div className="container mx-auto px-4">
          {/* Section Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-600/10 dark:bg-green-600/20 border border-green-500/30 rounded-full mb-6">
              <span className="text-green-600 dark:text-green-400 font-semibold">⚙️ Kompleksowe Usługi</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-black mb-6 text-gray-900 dark:text-white">
              Profesjonalne Rozwiązania <br />
              <span className="bg-gradient-to-r from-green-600 to-green-400 bg-clip-text text-transparent">
                Hydrauliczne Premium
              </span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Od instalacji po konserwację - wszystko z najwyższą precyzją i gwarancją jakości
            </p>
          </div>

          {/* Services Grid */}
          <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {/* Service 1: Instalacje */}
            <div className="group relative bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 dark:border-gray-700 hover:border-green-500/50 dark:hover:border-green-500/50 hover:-translate-y-2">
              {/* Icon */}
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <span className="text-3xl">🔧</span>
              </div>
              
              {/* Title */}
              <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                Instalacje Sanitarne
              </h3>
              
              {/* Description */}
              <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                Kompleksowa instalacja systemów wodnych i kanalizacyjnych z wykorzystaniem najnowocześniejszych technologii i materiałów premium.
              </p>
              
              {/* Features List */}
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <span className="text-green-600 dark:text-green-400 mt-1">✓</span>
                  <span className="text-gray-700 dark:text-gray-300">Instalacje wodne i kanalizacyjne</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600 dark:text-green-400 mt-1">✓</span>
                  <span className="text-gray-700 dark:text-gray-300">Systemy grzewcze i CO</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600 dark:text-green-400 mt-1">✓</span>
                  <span className="text-gray-700 dark:text-gray-300">Podłogówka i ogrzewanie</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600 dark:text-green-400 mt-1">✓</span>
                  <span className="text-gray-700 dark:text-gray-300">Instalacje gazowe</span>
                </li>
              </ul>
              
              {/* CTA */}
              <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                <a href="#contact" className="text-green-600 dark:text-green-400 font-semibold hover:text-green-700 dark:hover:text-green-300 flex items-center gap-2 group-hover:gap-3 transition-all">
                  Dowiedz się więcej
                  <span className="text-lg">→</span>
                </a>
              </div>
            </div>

            {/* Service 2: Serwis */}
            <div className="group relative bg-gradient-to-br from-green-600 to-green-700 dark:from-green-700 dark:to-green-800 rounded-2xl p-8 shadow-2xl hover:shadow-3xl transition-all duration-300 border-2 border-green-500 hover:-translate-y-2 transform">
              {/* Premium Badge */}
              <div className="absolute -top-4 right-8">
                <div className="bg-orange-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                  ⭐ Najpopularniejsze
                </div>
              </div>
              
              {/* Icon */}
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <span className="text-3xl">⚡</span>
              </div>
              
              {/* Title */}
              <h3 className="text-2xl font-bold mb-4 text-white">
                Serwis 24/7
              </h3>
              
              {/* Description */}
              <p className="text-green-50 mb-6 leading-relaxed">
                Błyskawiczna reakcja na awarie i problemy hydrauliczne. Dostępni o każdej porze - dzień i noc, 365 dni w roku.
              </p>
              
              {/* Features List */}
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <span className="text-orange-400 mt-1">✓</span>
                  <span className="text-white">Interwencje awaryjne</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-orange-400 mt-1">✓</span>
                  <span className="text-white">Udrażnianie rur i kanalizacji</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-orange-400 mt-1">✓</span>
                  <span className="text-white">Naprawa przecieków</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-orange-400 mt-1">✓</span>
                  <span className="text-white">Konserwacja systemów</span>
                </li>
              </ul>
              
              {/* CTA */}
              <div className="mt-8 pt-6 border-t border-white/20">
                <a href={`tel:${businessData.phone}`} className="bg-white text-green-600 px-6 py-3 rounded-lg font-bold hover:bg-green-50 transition-colors flex items-center justify-center gap-2 group-hover:gap-3">
                  <span>📞</span>
                  Zadzwoń Teraz
                </a>
              </div>
            </div>

            {/* Service 3: Modernizacje */}
            <div className="group relative bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 dark:border-gray-700 hover:border-green-500/50 dark:hover:border-green-500/50 hover:-translate-y-2">
              {/* Icon */}
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <span className="text-3xl">🏗️</span>
              </div>
              
              {/* Title */}
              <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                Modernizacje & Remonty
              </h3>
              
              {/* Description */}
              <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                Profesjonalna modernizacja i kompleksowe remonty łazienek oraz systemów hydraulicznych z gwarancją satysfakcji.
              </p>
              
              {/* Features List */}
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <span className="text-orange-600 dark:text-orange-400 mt-1">✓</span>
                  <span className="text-gray-700 dark:text-gray-300">Remonty łazienek</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-orange-600 dark:text-orange-400 mt-1">✓</span>
                  <span className="text-gray-700 dark:text-gray-300">Wymiana starych instalacji</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-orange-600 dark:text-orange-400 mt-1">✓</span>
                  <span className="text-gray-700 dark:text-gray-300">Modernizacja CO</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-orange-600 dark:text-orange-400 mt-1">✓</span>
                  <span className="text-gray-700 dark:text-gray-300">Wymiana armatury</span>
                </li>
              </ul>
              
              {/* CTA */}
              <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                <a href="#booking" className="text-orange-600 dark:text-orange-400 font-semibold hover:text-orange-700 dark:hover:text-orange-300 flex items-center gap-2 group-hover:gap-3 transition-all">
                  Zarezerwuj termin
                  <span className="text-lg">→</span>
                </a>
              </div>
            </div>
          </div>

          {/* Bottom CTA Banner */}
          <div className="mt-16 bg-gradient-to-r from-green-600 via-green-700 to-green-600 dark:from-green-700 dark:via-green-800 dark:to-green-700 rounded-2xl p-8 md:p-12 text-center shadow-2xl">
            <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Nie znalazłeś tego czego szukasz?
            </h3>
            <p className="text-green-50 text-lg mb-8 max-w-2xl mx-auto">
              Oferujemy również usługi specjalistyczne i indywidualne rozwiązania dostosowane do Twoich potrzeb
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="#contact" 
                className="bg-white text-green-600 px-8 py-4 rounded-lg font-bold hover:bg-green-50 transition-all hover:scale-105 shadow-lg"
              >
                💬 Zapytaj o usługę
              </a>
              <a 
                href={`tel:${businessData.phone}`} 
                className="bg-orange-500 text-white px-8 py-4 rounded-lg font-bold hover:bg-orange-600 transition-all hover:scale-105 shadow-lg"
              >
                📞 {businessData.phone}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* PARTNERS SECTION */}
      <Partners />

      {/* TESTIMONIALS SECTION */}
      <section className="py-24 bg-gradient-to-b from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="container mx-auto px-4">
          {/* Section Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-600/10 dark:bg-orange-600/20 border border-orange-500/30 rounded-full mb-6">
              <span className="text-orange-600 dark:text-orange-400 font-semibold">⭐ Opinie Klientów</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-black mb-6 text-gray-900 dark:text-white">
              Zaufali Nam <br />
              <span className="bg-gradient-to-r from-orange-600 to-orange-400 bg-clip-text text-transparent">
                Setki Zadowolonych Klientów
              </span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Zobacz co mówią o nas nasi klienci - prawdziwe opinie, prawdziwa satysfakcja
            </p>
          </div>

          {/* Rating Summary */}
          <div className="max-w-4xl mx-auto mb-16">
            <div className="bg-gradient-to-r from-green-600 to-green-700 dark:from-green-700 dark:to-green-800 rounded-2xl p-8 shadow-2xl">
              <div className="grid md:grid-cols-3 gap-8 text-center text-white">
                <div>
                  <div className="text-5xl md:text-6xl font-black mb-2">4.9</div>
                  <div className="flex items-center justify-center gap-1 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className="text-2xl text-yellow-300">★</span>
                    ))}
                  </div>
                  <div className="text-green-100">Średnia ocen</div>
                </div>
                <div>
                  <div className="text-5xl md:text-6xl font-black mb-2">500+</div>
                  <div className="text-3xl mb-2">💬</div>
                  <div className="text-green-100">Pozytywnych opinii</div>
                </div>
                <div>
                  <div className="text-5xl md:text-6xl font-black mb-2">100%</div>
                  <div className="text-3xl mb-2">😊</div>
                  <div className="text-green-100">Satysfakcji klientów</div>
                </div>
              </div>
            </div>
          </div>

          {/* Testimonials Grid */}
          <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto mb-12">
            {/* Testimonial 1 */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 dark:border-gray-700">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-2xl text-yellow-400">★</span>
                ))}
              </div>
              <p className="text-gray-700 dark:text-gray-300 mb-6 italic leading-relaxed">
                "Profesjonalna obsługa od początku do końca. Ekipa San-Bud wykonała kompleksową instalację CO w naszym domu. Wszystko zgodnie z umową, terminowo i bez żadnych niespodzianek. Polecam!"
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                  MK
                </div>
                <div>
                  <div className="font-bold text-gray-900 dark:text-white">Marek Kowalski</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Warszawa</div>
                </div>
              </div>
            </div>

            {/* Testimonial 2 - Featured */}
            <div className="bg-gradient-to-br from-orange-50 to-white dark:from-orange-950/20 dark:to-gray-800 rounded-2xl p-8 shadow-2xl hover:shadow-3xl transition-all duration-300 border-2 border-orange-500/50 dark:border-orange-500/50 transform hover:-translate-y-2">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-2xl text-yellow-400">★</span>
                  ))}
                </div>
                <span className="bg-orange-500 text-white text-xs px-3 py-1 rounded-full font-bold">
                  WYRÓŻNIONA
                </span>
              </div>
              <p className="text-gray-700 dark:text-gray-300 mb-6 italic leading-relaxed">
                "Miałam awarię w nocy - pękła rura. Zadzwoniłam do San-Bud i w 30 minut byli na miejscu! Szybko, sprawnie i w rozsądnej cenie. To prawdziwi profesjonaliści. Dziękuję!"
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                  AW
                </div>
                <div>
                  <div className="font-bold text-gray-900 dark:text-white">Anna Wiśniewska</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Kraków</div>
                </div>
              </div>
            </div>

            {/* Testimonial 3 */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 dark:border-gray-700">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-2xl text-yellow-400">★</span>
                ))}
              </div>
              <p className="text-gray-700 dark:text-gray-300 mb-6 italic leading-relaxed">
                "Remont łazienki z San-Bud to była strzał w dziesiątkę! Fachowa ekipa, świetna komunikacja, terminowość i perfekcyjne wykonanie. Wszystko działa jak w zegarku. Zdecydowanie polecam!"
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                  PJ
                </div>
                <div>
                  <div className="font-bold text-gray-900 dark:text-white">Piotr Jankowski</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Gdańsk</div>
                </div>
              </div>
            </div>
          </div>

          {/* More Testimonials - Compact List */}
          <div className="max-w-5xl mx-auto space-y-4 mb-12">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow border border-gray-100 dark:border-gray-700">
              <div className="flex flex-col md:flex-row md:items-center gap-4">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-lg text-yellow-400">★</span>
                  ))}
                </div>
                <p className="flex-1 text-gray-700 dark:text-gray-300 italic">
                  "Montaż podłogówki w całym domu - perfekcyjnie wykonane. Ciepło równomierne, oszczędności widać na fakturach. Ekipa wiedziała co robi!"
                </p>
                <div className="text-sm font-semibold text-gray-600 dark:text-gray-400 whitespace-nowrap">
                  - Tomasz N., Poznań
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow border border-gray-100 dark:border-gray-700">
              <div className="flex flex-col md:flex-row md:items-center gap-4">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-lg text-yellow-400">★</span>
                  ))}
                </div>
                <p className="flex-1 text-gray-700 dark:text-gray-300 italic">
                  "Serwis 24/7 naprawdę działa! Problem z bojlerem o 23:00, o północy już działało. Cena uczciwa, obsługa na medal. Polecam wszystkim!"
                </p>
                <div className="text-sm font-semibold text-gray-600 dark:text-gray-400 whitespace-nowrap">
                  - Katarzyna S., Wrocław
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow border border-gray-100 dark:border-gray-700">
              <div className="flex flex-col md:flex-row md:items-center gap-4">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-lg text-yellow-400">★</span>
                  ))}
                </div>
                <p className="flex-1 text-gray-700 dark:text-gray-300 italic">
                  "Modernizacja instalacji w starym domu - rewelacja! Teraz wszystko działa bez zarzutu. Fachowcy z prawdziwego zdarzenia. Dzięki San-Bud!"
                </p>
                <div className="text-sm font-semibold text-gray-600 dark:text-gray-400 whitespace-nowrap">
                  - Janusz P., Łódź
                </div>
              </div>
            </div>
          </div>

          {/* CTA for Reviews */}
          <div className="text-center">
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Dołącz do grona zadowolonych klientów!
            </p>
            <a 
              href="#contact" 
              className="inline-flex items-center gap-2 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-8 py-4 rounded-lg font-bold shadow-lg hover:shadow-xl transition-all hover:scale-105"
            >
              <span>✨</span>
              Zamów Swoją Usługę
              <span>→</span>
            </a>
          </div>
        </div>
      </section>

      {/* PROFESSIONAL PROCESS SECTION */}
      <section className="py-24 bg-gradient-to-b from-white via-green-50/20 to-white dark:from-gray-900 dark:via-green-950/10 dark:to-gray-900">
        <div className="container mx-auto px-4">
          {/* Section Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-600/10 dark:bg-green-600/20 border border-green-500/30 rounded-full mb-6">
              <span className="text-green-600 dark:text-green-400 font-semibold">🎯 Jak Pracujemy</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-black mb-6 text-gray-900 dark:text-white">
              Profesjonalny Proces <br />
              <span className="bg-gradient-to-r from-green-600 to-green-400 bg-clip-text text-transparent">
                Od Konsultacji Do Zakończenia
              </span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Każdy projekt realizujemy według sprawdzonej metodologii, która gwarantuje najwyższą jakość
            </p>
          </div>

          {/* Process Steps */}
          <div className="max-w-6xl mx-auto relative">
            {/* Connection Line */}
            <div className="hidden md:block absolute top-24 left-0 right-0 h-1 bg-gradient-to-r from-green-600 via-green-500 to-orange-500"></div>
            
            {/* Steps Grid */}
            <div className="grid md:grid-cols-4 gap-8 relative">
              {/* Step 1 */}
              <div className="text-center group">
                <div className="relative mb-6 inline-block">
                  <div className="w-20 h-20 bg-gradient-to-br from-green-600 to-green-700 dark:from-green-700 dark:to-green-800 rounded-full flex items-center justify-center text-white font-black text-2xl shadow-xl group-hover:scale-110 transition-transform duration-300 relative z-10">
                    1
                  </div>
                  <div className="absolute -inset-2 bg-green-500/20 rounded-full animate-pulse"></div>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 dark:border-gray-700">
                  <div className="text-4xl mb-3">📞</div>
                  <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">Kontakt</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                    Zadzwoń, napisz lub umów się online. Odbieramy 24/7 i odpowiadamy na wszystkie pytania.
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="text-center group">
                <div className="relative mb-6 inline-block">
                  <div className="w-20 h-20 bg-gradient-to-br from-green-600 to-green-700 dark:from-green-700 dark:to-green-800 rounded-full flex items-center justify-center text-white font-black text-2xl shadow-xl group-hover:scale-110 transition-transform duration-300 relative z-10">
                    2
                  </div>
                  <div className="absolute -inset-2 bg-green-500/20 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 dark:border-gray-700">
                  <div className="text-4xl mb-3">🔍</div>
                  <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">Wizyta & Wycena</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                    Przyjeżdżamy na miejsce, oceniamy zakres prac i przedstawiamy szczegółową wycenę.
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="text-center group">
                <div className="relative mb-6 inline-block">
                  <div className="w-20 h-20 bg-gradient-to-br from-green-600 to-orange-600 dark:from-green-700 dark:to-orange-700 rounded-full flex items-center justify-center text-white font-black text-2xl shadow-xl group-hover:scale-110 transition-transform duration-300 relative z-10">
                    3
                  </div>
                  <div className="absolute -inset-2 bg-orange-500/20 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 dark:border-gray-700">
                  <div className="text-4xl mb-3">🔧</div>
                  <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">Realizacja</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                    Wykonujemy pracę zgodnie z planem, używając profesjonalnych narzędzi i materiałów premium.
                  </p>
                </div>
              </div>

              {/* Step 4 */}
              <div className="text-center group">
                <div className="relative mb-6 inline-block">
                  <div className="w-20 h-20 bg-gradient-to-br from-orange-600 to-orange-700 dark:from-orange-700 dark:to-orange-800 rounded-full flex items-center justify-center text-white font-black text-2xl shadow-xl group-hover:scale-110 transition-transform duration-300 relative z-10">
                    4
                  </div>
                  <div className="absolute -inset-2 bg-orange-500/20 rounded-full animate-pulse" style={{animationDelay: '0.6s'}}></div>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 dark:border-gray-700">
                  <div className="text-4xl mb-3">✅</div>
                  <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">Odbiór & Gwarancja</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                    Sprawdzamy wszystko razem z Tobą. Udzielamy gwarancji i zapewniamy serwis posprzedażowy.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Why Us Features */}
          <div className="mt-20 grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="bg-gradient-to-br from-green-50 to-white dark:from-green-950/20 dark:to-gray-800 rounded-xl p-8 shadow-lg border border-green-200 dark:border-green-800">
              <div className="w-14 h-14 bg-green-600 dark:bg-green-700 rounded-full flex items-center justify-center mb-4">
                <span className="text-3xl">⚡</span>
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">Szybka Reakcja</h3>
              <p className="text-gray-600 dark:text-gray-300">
                W przypadku awarii jesteśmy na miejscu w ciągu 30-60 minut. Czas to pieniądz!
              </p>
            </div>

            <div className="bg-gradient-to-br from-orange-50 to-white dark:from-orange-950/20 dark:to-gray-800 rounded-xl p-8 shadow-lg border border-orange-200 dark:border-orange-800">
              <div className="w-14 h-14 bg-orange-600 dark:bg-orange-700 rounded-full flex items-center justify-center mb-4">
                <span className="text-3xl">🎓</span>
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">Certyfikowani Eksperci</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Nasz zespół posiada wszystkie niezbędne uprawnienia i certyfikaty branżowe.
              </p>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-white dark:from-green-950/20 dark:to-gray-800 rounded-xl p-8 shadow-lg border border-green-200 dark:border-green-800">
              <div className="w-14 h-14 bg-green-600 dark:bg-green-700 rounded-full flex items-center justify-center mb-4">
                <span className="text-3xl">🛡️</span>
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">Gwarancja Satysfakcji</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Gwarantujemy jakość wykonania i oferujemy gwarancję na wszystkie nasze usługi.
              </p>
            </div>
          </div>

          {/* Bottom CTA */}
          <div className="mt-16 text-center">
            <p className="text-gray-600 dark:text-gray-400 mb-6 text-lg">
              Przekonaj się sam - umów się na bezpłatną konsultację!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="#booking" 
                className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-8 py-4 rounded-lg font-bold shadow-lg hover:shadow-xl transition-all hover:scale-105"
              >
                <span>📅</span>
                Umów Wizytę Online
              </a>
              <a 
                href={`tel:${businessData.phone}`} 
                className="inline-flex items-center justify-center gap-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-8 py-4 rounded-lg font-bold shadow-lg hover:shadow-xl transition-all hover:scale-105 border-2 border-gray-200 dark:border-gray-700"
              >
                <span>📞</span>
                {businessData.phone}
              </a>
            </div>
          </div>
        </div>
      </section>

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
      <section id="contact" className="py-20 bg-gradient-to-b from-green-50/50 via-white to-orange-50/30 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-600/10 dark:bg-orange-600/20 border border-orange-500/30 rounded-full mb-6">
                <span className="text-orange-600 dark:text-orange-400 font-semibold">📧 Kontakt</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900 dark:text-white">
                Zacznij oszczędzać czas!
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300">
                Zostaw kontakt, oddzwonimy
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                Otrzymasz wycenę w ciągu 24h lub zadzwoń: <a href={`tel:${businessData.phone}`} className="text-green-600 dark:text-green-400 font-bold hover:underline">{businessData.phone}</a>
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
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-100 dark:disabled:bg-gray-700 text-gray-900 dark:text-white dark:bg-gray-700 dark:border-gray-600 ${
                        fieldErrors.name ? 'border-red-500 bg-red-50 dark:bg-red-900/20' : 'border-gray-300 dark:border-gray-600'
                      }`}
                      placeholder="Jan Kowalski"
                    />
                    {fieldErrors.name && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        {fieldErrors.name}
                      </p>
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
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-100 dark:disabled:bg-gray-700 text-gray-900 dark:text-white dark:bg-gray-700 dark:border-gray-600 ${
                        fieldErrors.phone ? 'border-red-500 bg-red-50 dark:bg-red-900/20' : 'border-gray-300 dark:border-gray-600'
                      }`}
                      placeholder="+48 123 456 789"
                    />
                    {fieldErrors.phone && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        {fieldErrors.phone}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
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
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-100 dark:disabled:bg-gray-700 text-gray-900 dark:text-white dark:bg-gray-700 dark:border-gray-600 ${
                      fieldErrors.email ? 'border-red-500 bg-red-50 dark:bg-red-900/20' : 'border-gray-300 dark:border-gray-600'
                    }`}
                    placeholder="email@example.com"
                  />
                  {fieldErrors.email && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {fieldErrors.email}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="service" className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Rodzaj usługi</label>
                  <select 
                    id="service"
                    name="service"
                    value={formData.service}
                    onChange={handleChange}
                    disabled={status === 'sending'}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-100 dark:disabled:bg-gray-700 text-gray-900 dark:text-white dark:bg-gray-700"
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
                    rows={4} 
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-100 dark:disabled:bg-gray-700 text-gray-900 dark:text-white dark:bg-gray-700 dark:border-gray-600 ${
                      fieldErrors.message ? 'border-red-500 bg-red-50 dark:bg-red-900/20' : 'border-gray-300 dark:border-gray-600'
                    }`}
                    placeholder="Opisz swoją potrzebę... (minimum 10 znaków)"
                  ></textarea>
                  {fieldErrors.message && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {fieldErrors.message}
                    </p>
                  )}
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    {formData.message.length}/1000 znaków
                  </p>
                </div>

                <div className="flex items-start gap-2">
                  <input type="checkbox" className="mt-1" id="privacy" required />
                  <label htmlFor="privacy" className="text-sm text-gray-600 dark:text-gray-400">
                    Wyrażam zgodę na przetwarzanie moich danych osobowych w celu kontaktu oraz przesyłania ofert <span className="text-red-500">*</span>
                  </label>
                </div>

                {status === 'success' && (
                  <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-lg text-green-800 dark:text-green-300">
                    ✅ Dziękujemy za wiadomość! Odpowiemy najszybciej jak to możliwe.
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
