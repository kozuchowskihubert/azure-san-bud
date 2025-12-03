'use client';

import Image from 'next/image';
import Link from 'next/link';

export default function ServicesPage() {
  const services = [
    {
      id: 1,
      title: 'Instalacje Wodne',
      description: 'Profesjonalny montaż systemów wodnych dla domów i mieszkań. Kompleksowe rozwiązania z najwyższej jakości materiałów.',
      image: '/images/sanbud-google-1.jpg',
      features: ['Instalacje wodne', 'Systemy filtracji', 'Łazienki', 'Kuchnie'],
      icon: '💧',
      color: 'green',
    },
    {
      id: 2,
      title: 'Łazienki Pod Klucz',
      description: 'Realizacja luksusowych łazienek od projektu po wykończenie. Nowoczesny design połączony z funkcjonalnością.',
      image: '/images/sanbud-google-3.jpg',
      features: ['Projektowanie', 'Glazura', 'Armatura', 'Oświetlenie'],
      icon: '🛁',
      color: 'orange',
    },
    {
      id: 3,
      title: 'Instalacje Grzewcze',
      description: 'Montaż i serwis systemów ogrzewania. Efektywne rozwiązania grzewcze dostosowane do Twoich potrzeb.',
      image: '/images/sanbud-google-2.jpg',
      features: ['Piece gazowe', 'Pompy ciepła', 'Ogrzewanie podłogowe', 'Grzejniki'],
      icon: '🔥',
      color: 'green',
    },
    {
      id: 4,
      title: 'Serwis 24/7',
      description: 'Całodobowe pogotowie hydrauliczne. Szybka reakcja i profesjonalna pomoc w każdej sytuacji awaryjnej.',
      image: '/images/sanbud-google-4.jpg',
      features: ['Wycieki', 'Przecieki', 'Awarie instalacji', 'Natychmiastowa pomoc'],
      icon: '⚡',
      color: 'orange',
    },
    {
      id: 5,
      title: 'Naprawy i Konserwacja',
      description: 'Fachowe naprawy i regularne przeglądy instalacji hydraulicznych. Zapobiegamy awariom zanim się pojawią.',
      image: '/images/sanbud-google-5.jpg',
      features: ['Przeglądy', 'Naprawy', 'Konserwacja', 'Modernizacja'],
      icon: '🔧',
      color: 'green',
    },
    {
      id: 6,
      title: 'Instalacje Sanitarne',
      description: 'Kompleksowe systemy sanitarne dla budynków mieszkalnych i użyteczności publicznej.',
      image: '/images/sanbud-google-6.jpg',
      features: ['Kanalizacja', 'Wentylacja', 'Odprowadzanie ścieków', 'Systemy bezpieczeństwa'],
      icon: '🚰',
      color: 'orange',
    },
  ];

  return (
    <main className="min-h-screen bg-white dark:bg-gray-900">
      {/* Video Hero Section */}
      <section className="relative h-[400px] md:h-[500px] overflow-hidden">
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
              <span className="text-sm font-semibold">Profesjonalne Usługi Hydrauliczne</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-black mb-6">
              Nasze <span className="text-green-400">Usługi</span>
            </h1>
            <p className="text-xl text-white/90">
              Kompleksowe rozwiązania hydrauliczne dostosowane do Twoich potrzeb
            </p>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {services.map((service, index) => (
              <div
                key={service.id}
                className="group bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 dark:border-gray-700 hover:-translate-y-2"
              >
                {/* Image */}
                <div className="relative h-64 overflow-hidden">
                  <Image
                    src={service.image}
                    alt={service.title}
                    fill
                    className="object-cover transform group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                  
                  {/* Icon Badge */}
                  <div className={`absolute top-4 right-4 w-14 h-14 ${service.color === 'green' ? 'bg-green-600' : 'bg-orange-600'} rounded-full flex items-center justify-center text-3xl shadow-xl`}>
                    {service.icon}
                  </div>

                  {/* Title on Image */}
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-2xl font-bold text-white mb-1">
                      {service.title}
                    </h3>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                    {service.description}
                  </p>

                  {/* Features */}
                  <div className="space-y-2 mb-6">
                    {service.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <svg 
                          className={`w-5 h-5 flex-shrink-0 ${service.color === 'green' ? 'text-green-600 dark:text-green-400' : 'text-orange-600 dark:text-orange-400'}`} 
                          fill="currentColor" 
                          viewBox="0 0 20 20"
                        >
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        <span className="text-sm text-gray-700 dark:text-gray-300">{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* CTA Button */}
                  <Link
                    href="/#contact"
                    className={`block text-center px-6 py-3 rounded-lg font-bold transition-all duration-300 ${
                      service.color === 'green'
                        ? 'bg-green-600 hover:bg-green-700 text-white'
                        : 'bg-orange-600 hover:bg-orange-700 text-white'
                    }`}
                  >
                    Zapytaj o usługę
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-green-600 via-green-700 to-green-600 dark:from-green-700 dark:via-green-800 dark:to-green-700">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center text-white">
            <h2 className="text-4xl md:text-5xl font-black mb-6">
              Gotowy na współpracę?
            </h2>
            <p className="text-xl mb-10 text-green-100">
              Skontaktuj się z nami już dziś i otrzymaj bezpłatną wycenę
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link
                href="/#booking"
                className="px-8 py-4 bg-white text-green-600 rounded-xl font-bold hover:bg-green-50 transition-all duration-300 shadow-2xl hover:scale-105 flex items-center gap-2"
              >
                📅 Umów Wizytę
              </Link>
              <a
                href="tel:503691808"
                className="px-8 py-4 bg-orange-600 hover:bg-orange-700 text-white rounded-xl font-bold transition-all duration-300 shadow-2xl hover:scale-105 flex items-center gap-2"
              >
                📞 503 691 808
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
