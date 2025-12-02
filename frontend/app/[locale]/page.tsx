import Image from 'next/image';
import Link from 'next/link';
import BookingCalendar from '@/components/BookingCalendar';

export default function HomePage() {
  // Business data matching Google Maps
  const businessData = {
    name: 'San-Bud Hydraulika',
    tagline: 'Profesjonalne usługi hydrauliczne',
    established: '2018',
    address: 'Polska',
    phone: '+48 503 691 808',
    email: 'kontakt@sanbud.pl',
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
      
      {/* HERO SECTION - Eko-solutions style */}
      <section className="relative h-[600px] md:h-[700px] overflow-hidden">
        <Image
          src="/images/hero-bg.jpg"
          alt="San-Bud Hydraulika"
          fill
          className="object-cover brightness-50"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent" />
        
        <div className="relative z-10 container mx-auto px-4 h-full flex items-center">
          <div className="max-w-2xl text-white">
            {/* Logo */}
            <div className="mb-8 flex items-center gap-4">
              <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-2xl overflow-hidden ring-4 ring-white/30 shadow-2xl">
                <Image
                  src="/images/logo.jpg"
                  alt="SanBud Logo"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
              <div className="hidden md:block">
                <div className="text-2xl font-black text-white">SAN-BUD</div>
                <div className="text-sm text-gray-300 italic">Hydraulika • Nasza pasja</div>
              </div>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              {businessData.name}
            </h1>
            <p className="text-xl md:text-2xl mb-4 text-gray-200">
              {businessData.tagline}
            </p>
            <p className="text-lg mb-8 text-gray-300">
              Kompleksowe rozwiązania hydrauliczne dla Twojego domu i firmy
            </p>
            <div className="flex flex-wrap gap-4">
              <a 
                href="#contact" 
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold rounded-lg text-lg transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105"
              >
                Darmowa wycena
              </a>
              <a 
                href={`tel:${businessData.phone}`}
                className="px-8 py-4 bg-white/10 backdrop-blur-md border-2 border-white hover:bg-white hover:text-blue-900 text-white font-bold rounded-lg text-lg transition-all duration-300"
              >
                📞 {businessData.phone}
              </a>
            </div>
          </div>
        </div>

        {/* Emergency badge */}
        <div className="absolute bottom-8 right-8 bg-red-600 text-white px-6 py-3 rounded-full font-bold animate-pulse shadow-2xl">
          🚨 Awarie 24/7
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

      {/* PROCESS SECTION */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
              Profesjonalizm na wyciągnięcie ręki!
            </h2>
            <p className="text-xl text-gray-600">
              Przeprowadzimy Cię przez cały proces realizacji projektu
            </p>
          </div>

          <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-6 max-w-6xl mx-auto">
            {processSteps.map((step, index) => (
              <div key={index} className="relative">
                <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 h-full">
                  <div className="text-5xl font-bold text-blue-600 mb-3">{step.number}</div>
                  <h3 className="text-lg font-bold mb-2 text-gray-900">{step.title}</h3>
                  <p className="text-sm text-gray-600">{step.description}</p>
                </div>
                {index < processSteps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-3 w-6 h-0.5 bg-blue-300" />
                )}
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
              <form className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Imię</label>
                    <input type="text" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Nazwisko</label>
                    <input type="text" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">E-mail</label>
                  <input type="email" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Telefon</label>
                  <input type="tel" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Rodzaj usługi</label>
                  <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option>Instalacje wodne</option>
                    <option>Remont łazienki</option>
                    <option>Awaria</option>
                    <option>Konserwacja</option>
                    <option>Inne</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Wiadomość</label>
                  <textarea rows={4} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"></textarea>
                </div>

                <div className="flex items-start gap-2">
                  <input type="checkbox" className="mt-1" id="privacy" />
                  <label htmlFor="privacy" className="text-sm text-gray-600">
                    Wyrażam zgodę na przetwarzanie moich danych osobowych w celu kontaktu oraz przesyłania ofert
                  </label>
                </div>

                <button 
                  type="submit"
                  className="w-full px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold rounded-lg text-lg transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105"
                >
                  Wyślij zapytanie
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
