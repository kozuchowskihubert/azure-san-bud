'use client';

import { useTranslations } from 'next-intl';
import Image from 'next/image';

export default function AboutPage() {
  const t = useTranslations();

  return (
    <main className="min-h-screen">
      {/* Hero Section with Video Background */}
      <section className="relative h-[500px] md:h-[600px] overflow-hidden">
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
          <div className="absolute inset-0 bg-black/60"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10 h-full flex items-center justify-center">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-7xl font-black mb-6 text-white">
              O Nas
            </h1>
            <p className="text-xl md:text-2xl text-white/90 leading-relaxed">
              Hydraulika to nasza pasja. Od 2018 roku dostarczamy profesjonalne usługi hydrauliczne najwyższej jakości.
            </p>
          </div>
        </div>
      </section>

      {/* Story Section - Enhanced with modern design */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
            <div className="relative h-96 rounded-2xl overflow-hidden shadow-xl">
              <Image
                src="/images/sanbud-google-2.jpg"
                alt="SanBud Team"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
            </div>
            
            <div className="space-y-6">
              <h2 className="text-4xl font-bold text-gray-900">
                Nasza Historia
              </h2>
              <div className="w-20 h-1 bg-blue-600 rounded"></div>
              <p className="text-gray-700 leading-relaxed text-lg">
                SanBud Hydraulika rozpoczął działalność w 2018 roku z misją dostarczania najwyższej jakości usług hydraulicznych. 
                Nasza pasja do perfekcji i zaangażowanie w zadowolenie klientów sprawiły, że staliśmy się zaufanym partnerem 
                w dziedzinie instalacji sanitarnych.
              </p>
              <p className="text-gray-700 leading-relaxed text-lg">
                Specjalizujemy się w kompleksowych usługach hydraulicznych - od montażu nowoczesnych instalacji wodnych, 
                przez realizację luksusowych łazienek, aż po systemy grzewcze i profesjonalne naprawy oraz konserwację.
              </p>
              
              {/* Key highlights */}
              <div className="grid grid-cols-2 gap-4 pt-4">
                <div className="flex items-start gap-3">
                  <svg className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-700 font-medium">Certyfikowane usługi</span>
                </div>
                <div className="flex items-start gap-3">
                  <svg className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-700 font-medium">Gwarancja jakości</span>
                </div>
                <div className="flex items-start gap-3">
                  <svg className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-700 font-medium">Doświadczony zespół</span>
                </div>
                <div className="flex items-start gap-3">
                  <svg className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-700 font-medium">Konkurencyjne ceny</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section - Clean professional cards */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
              Nasze Wartości
            </h2>
            <div className="w-20 h-1 bg-blue-600 rounded mx-auto mb-6"></div>
            <p className="text-xl text-gray-600">
              Trzy filary, na których opiera się nasza działalność
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                title: 'Fachowość',
                description: 'Wieloletnie doświadczenie i ciągłe podnoszenie kwalifikacji zapewniają najwyższy poziom usług.',
                icon: (
                  <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ),
              },
              {
                title: 'Rzetelność',
                description: 'Stawiamy na transparentność w wycenach i uczciwe relacje z klientami.',
                icon: (
                  <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                ),
              },
              {
                title: 'Terminowość',
                description: 'Szanujemy Twój czas - realizujemy zlecenia zgodnie z ustalonym harmonogramem.',
                icon: (
                  <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ),
              },
            ].map((value, index) => (
              <div key={index} className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="text-blue-600 mb-4">
                  {value.icon}
                </div>
                <h3 className="text-2xl font-bold mb-4 text-gray-900">
                  {value.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section - Enhanced with modern cards */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
              Doświadczenie
            </h2>
            <div className="w-20 h-1 bg-blue-600 rounded mx-auto mb-6"></div>
            <p className="text-xl text-gray-600">
              Liczby, które pokazują naszą skuteczność
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              { 
                number: '100+', 
                label: 'Zrealizowanych Projektów',
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ),
              },
              { 
                number: '7+', 
                label: 'Lat Doświadczenia',
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                ),
              },
              { 
                number: '100%', 
                label: 'Zadowolonych Klientów',
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                  </svg>
                ),
              },
            ].map((stat, index) => (
              <div key={index} className="bg-gradient-to-br from-blue-50 to-gray-50 rounded-xl p-8 text-center shadow-md hover:shadow-lg transition-shadow duration-300">
                <div className="text-blue-600 flex justify-center mb-3">
                  {stat.icon}
                </div>
                <div className="text-4xl md:text-5xl font-black mb-3 text-blue-600">
                  {stat.number}
                </div>
                <p className="text-gray-700 font-medium">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section - Modern gradient with clear action */}
      <section className="py-20 relative overflow-hidden bg-gradient-to-r from-blue-600 to-blue-700">
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
              Gotowy na współpracę?
            </h2>
            <p className="text-xl mb-8 text-white/90">
              Skontaktuj się z nami i przekonaj się, dlaczego klienci nam ufają
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/pl/contact"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-300 shadow-lg"
              >
                Skontaktuj się
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
              <a
                href="tel:+48503691808"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors duration-300 shadow-lg"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                Zadzwoń teraz
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
