import { useTranslations } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';

export default function ServicesPage() {
  const t = useTranslations();

  const services = [
    {
      id: 1,
      title: 'Montaż instalacji wodnych',
      description: 'Profesjonalny montaż systemów wodnych dla domów i mieszkań. Kompleksowe rozwiązania z najwyższej jakości materiałów.',
      image: '/images/service-plumbing.jpg',
      features: ['Instalacje wodne', 'Systemy filtracji', 'Łazienki', 'Kuchnie'],
      icon: '',
    },
    {
      id: 2,
      title: 'Łazienki pod klucz',
      description: 'Realizacja luksusowych łazienek od projektu po wykończenie. Nowoczesny design połączony z funkcjonalnością.',
      image: '/images/sanbud-google-2.jpg',
      features: ['Projektowanie', 'Glazura', 'Armatura', 'Oświetlenie'],
      icon: '',
    },
    {
      id: 3,
      title: 'Instalacje grzewcze',
      description: 'Montaż i serwis systemów ogrzewania. Efektywne rozwiązania grzewcze dostosowane do Twoich potrzeb.',
      image: '/images/sanbud-google-3.jpg',
      features: ['Piece gazowe', 'Pompy ciepła', 'Ogrzewanie podłogowe', 'Grzejniki'],
      icon: '',
    },
    {
      id: 4,
      title: 'Awarie 24/7',
      description: 'Całodobowe pogotowie hydrauliczne. Szybka reakcja i profesjonalna pomoc w każdej sytuacji awaryjnej.',
      image: '/images/sanbud-google-4.jpg',
      features: ['Wycieki', 'Przecieki', 'Awarie instalacji', 'Natychmiastowa pomoc'],
      icon: '',
    },
    {
      id: 5,
      title: 'Naprawy i konserwacja',
      description: 'Fachowe naprawy i regularne przeglądy instalacji hydraulicznych. Zapobiegamy awariom zanim się pojawią.',
      image: '/images/sanbud-google-1.jpg',
      features: ['Przeglądy', 'Naprawy', 'Konserwacja', 'Modernizacja'],
      icon: '',
    },
    {
      id: 6,
      title: 'Instalacje sanitarne',
      description: 'Kompleksowe systemy sanitarne dla budynków mieszkalnych i użyteczności publicznej.',
      image: '/images/sanbud-google-5.jpg',
      features: ['Kanalizacja', 'Wentylacja', 'Odprowadzanie ścieków', 'Systemy bezpieczeństwa'],
      icon: '',
    },
  ];

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[rgb(var(--color-bg-primary))] via-[rgb(var(--color-bg-secondary))] to-[rgb(var(--color-bg-tertiary))]"></div>
        
        {/* Glow effects */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[rgb(var(--color-primary))] rounded-full filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[rgb(var(--color-accent))] rounded-full filter blur-3xl opacity-20 animate-pulse delay-1000"></div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-7xl font-black mb-6 bg-gradient-to-r from-[rgb(var(--color-primary))] via-[rgb(var(--color-gradient-mid))] to-[rgb(var(--color-accent))] bg-clip-text text-transparent">
              Nasze Usługi
            </h1>
            <p className="text-xl md:text-2xl text-[rgb(var(--color-text-secondary))] leading-relaxed">
              Kompleksowe rozwiązania hydrauliczne dostosowane do Twoich potrzeb
            </p>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {services.map((service, index) => (
              <div
                key={service.id}
                className="card group overflow-hidden"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Image */}
                <div className="relative h-64 overflow-hidden">
                  <Image
                    src={service.image}
                    alt={service.title}
                    fill
                    className="object-cover transform group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[rgb(var(--color-bg-primary))] via-[rgb(var(--color-bg-primary))]/60 to-transparent"></div>
                  
                  {/* Icon overlay */}
                  <div className="absolute top-4 right-4 text-6xl transform group-hover:rotate-12 transition-transform duration-300">
                    {service.icon}
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-4">
                  <h3 className="text-2xl font-bold text-[rgb(var(--color-text-primary))] group-hover:text-[rgb(var(--color-primary))] transition-colors">
                    {service.title}
                  </h3>
                  
                  <p className="text-[rgb(var(--color-text-secondary))] leading-relaxed">
                    {service.description}
                  </p>

                  {/* Features */}
                  <div className="flex flex-wrap gap-2 pt-4">
                    {service.features.map((feature, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 rounded-full text-xs font-semibold bg-[rgb(var(--color-bg-elevated))] text-[rgb(var(--color-primary))] border border-[rgb(var(--color-border-light))]"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>

                  {/* CTA */}
                  <div className="pt-4">
                    <Link
                      href="/pl/contact"
                      className="inline-flex items-center gap-2 text-[rgb(var(--color-primary))] hover:text-[rgb(var(--color-accent))] font-semibold transition-colors"
                    >
                      Zapytaj o ofertę
                      <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-[rgb(var(--color-bg-secondary))] to-[rgb(var(--color-bg-primary))]"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-[rgb(var(--color-text-primary))]">
              Dlaczego my?
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {[
              { title: 'Gwarancja jakości', description: 'Wszystkie usługi objęte gwarancją' },
              { title: 'Szybka realizacja', description: 'Terminowe wykonanie zleceń' },
              { title: 'Premium materiały', description: 'Najwyższej klasy komponenty' },
              { title: 'Doświadczenie', description: '7 lat na rynku' },
            ].map((item, index) => (
              <div key={index} className="card p-6 text-center">
                <h4 className="text-lg font-bold mb-2 text-[rgb(var(--color-text-primary))]">{item.title}</h4>
                <p className="text-sm text-[rgb(var(--color-text-secondary))]">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="card-glass max-w-4xl mx-auto p-12 text-center">
            <h2 className="text-4xl font-bold mb-6 text-[rgb(var(--color-text-primary))]">
              Potrzebujesz wyceny?
            </h2>
            <p className="text-xl mb-8 text-[rgb(var(--color-text-secondary))]">
              Skontaktuj się z nami, aby uzyskać darmową wycenę dla swojego projektu
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/pl/contact" className="btn btn-primary">
                Skontaktuj się
              </Link>
              <a href="tel:+48503691808" className="btn btn-outline-primary">
                Zadzwoń: 503 691 808
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
