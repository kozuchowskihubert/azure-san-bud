import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import Image from 'next/image';
import Link from 'next/link';

export default function HomePage() {
  // Dane z Google Maps - San-Bud Hydraulika
  const businessData = {
    name: 'San-Bud Hydraulika',
    tagline: 'Nasza pasja',
    established: '2018',
    address: 'Polska',
    phone: '+48 123 456 789',
    email: 'kontakt@sanbud.pl',
    googleMaps: 'https://www.google.com/maps/place/San-Bud+Hydraulika+Nasza+pasja/@52.6330895,20.3494125',
    facebook: 'https://www.facebook.com/sanbud',
    hours: {
      weekdays: 'Poniedziałek - Piątek: 8:00 - 18:00',
      weekend: 'Sobota: 9:00 - 14:00',
      emergency: 'Awarie 24/7',
    },
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-[rgb(var(--color-bg-primary))] via-[rgb(var(--color-bg-secondary))] to-[rgb(var(--color-bg-tertiary))]">
      <Navigation />
      
      {/* Hero Business Card Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden px-4 py-20">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 -left-48 w-96 h-96 bg-[rgb(var(--color-primary))] rounded-full filter blur-3xl opacity-20 animate-pulse"></div>
          <div className="absolute bottom-1/4 -right-48 w-96 h-96 bg-[rgb(var(--color-accent))] rounded-full filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[rgb(var(--color-gradient-mid))] rounded-full filter blur-3xl opacity-10 animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>

        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: 'linear-gradient(rgba(52, 152, 219, 0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(52, 152, 219, 0.3) 1px, transparent 1px)',
            backgroundSize: '50px 50px',
          }}></div>
        </div>

        {/* Main Business Card */}
        <div className="relative z-10 max-w-6xl w-full">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            
            {/* Left: Business Info Card */}
            <div className="card-glass p-12 space-y-8 transform hover:scale-105 transition-all duration-500">
              {/* Logo & Brand */}
              <div className="flex items-center gap-6 mb-8">
                <div className="relative w-24 h-24 rounded-2xl overflow-hidden ring-4 ring-[rgb(var(--color-primary))] shadow-2xl">
                  <Image
                    src="/images/logo.jpg"
                    alt="SanBud Logo"
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h1 className="text-4xl font-black bg-gradient-to-r from-[rgb(var(--color-primary))] via-[rgb(var(--color-gradient-mid))] to-[rgb(var(--color-accent))] bg-clip-text text-transparent mb-2">
                    {businessData.name}
                  </h1>
                  <p className="text-xl text-[rgb(var(--color-text-secondary))] font-display italic">
                    {businessData.tagline}
                  </p>
                  <p className="text-sm text-[rgb(var(--color-text-muted))] mt-1">
                    Założona w {businessData.established}
                  </p>
                </div>
              </div>

              {/* Quick Contact Buttons */}
              <div className="grid grid-cols-2 gap-4">
                <a
                  href={`tel:${businessData.phone}`}
                  className="btn btn-primary flex items-center justify-center gap-2 group"
                >
                  <span className="text-2xl group-hover:scale-125 transition-transform">📞</span>
                  <span>Zadzwoń</span>
                </a>
                <a
                  href={businessData.googleMaps}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-accent flex items-center justify-center gap-2 group"
                >
                  <span className="text-2xl group-hover:scale-125 transition-transform">🗺️</span>
                  <span>Mapa</span>
                </a>
              </div>

              {/* Contact Details */}
              <div className="space-y-4 border-t border-[rgb(var(--color-border))] pt-6">
                <div className="flex items-center gap-4 group cursor-pointer hover:bg-[rgb(var(--color-bg-elevated))] p-3 rounded-lg transition-all">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[rgb(var(--color-primary))] to-[rgb(var(--color-primary-dark))] flex items-center justify-center text-2xl shadow-lg">
                    📞
                  </div>
                  <div>
                    <p className="text-xs text-[rgb(var(--color-text-muted))] uppercase tracking-wider">Telefon</p>
                    <a href={`tel:${businessData.phone}`} className="text-lg font-semibold text-[rgb(var(--color-text-primary))] group-hover:text-[rgb(var(--color-accent))] transition-colors">
                      {businessData.phone}
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-4 group cursor-pointer hover:bg-[rgb(var(--color-bg-elevated))] p-3 rounded-lg transition-all">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[rgb(var(--color-accent))] to-[rgb(var(--color-accent-dark))] flex items-center justify-center text-2xl shadow-lg">
                    ✉️
                  </div>
                  <div>
                    <p className="text-xs text-[rgb(var(--color-text-muted))] uppercase tracking-wider">Email</p>
                    <a href={`mailto:${businessData.email}`} className="text-lg font-semibold text-[rgb(var(--color-text-primary))] group-hover:text-[rgb(var(--color-accent))] transition-colors">
                      {businessData.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-4 group cursor-pointer hover:bg-[rgb(var(--color-bg-elevated))] p-3 rounded-lg transition-all">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[rgb(var(--color-gradient-mid))] to-[rgb(var(--color-primary))] flex items-center justify-center text-2xl shadow-lg">
                    📍
                  </div>
                  <div>
                    <p className="text-xs text-[rgb(var(--color-text-muted))] uppercase tracking-wider">Lokalizacja</p>
                    <p className="text-lg font-semibold text-[rgb(var(--color-text-primary))]">
                      {businessData.address}
                    </p>
                  </div>
                </div>
              </div>

              {/* Hours */}
              <div className="bg-[rgb(var(--color-bg-elevated))] p-6 rounded-xl border border-[rgb(var(--color-border-light))]">
                <h3 className="text-sm font-bold text-[rgb(var(--color-text-primary))] mb-4 flex items-center gap-2">
                  <span className="text-xl">⏰</span> Godziny otwarcia
                </h3>
                <div className="space-y-2 text-sm">
                  <p className="text-[rgb(var(--color-text-secondary))]">{businessData.hours.weekdays}</p>
                  <p className="text-[rgb(var(--color-text-secondary))]">{businessData.hours.weekend}</p>
                  <p className="text-[rgb(var(--color-accent))] font-bold flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[rgb(var(--color-accent))] animate-pulse"></span>
                    {businessData.hours.emergency}
                  </p>
                </div>
              </div>

              {/* Social Links */}
              <div className="flex gap-3">
                <a
                  href={businessData.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 bg-[rgb(var(--color-bg-elevated))] hover:bg-[#1877F2] p-4 rounded-xl flex items-center justify-center gap-2 transition-all transform hover:scale-105 border border-[rgb(var(--color-border))]"
                >
                  <span className="text-2xl">📘</span>
                  <span className="text-sm font-semibold">Facebook</span>
                </a>
                <a
                  href={businessData.googleMaps}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 bg-[rgb(var(--color-bg-elevated))] hover:bg-[#34A853] p-4 rounded-xl flex items-center justify-center gap-2 transition-all transform hover:scale-105 border border-[rgb(var(--color-border))]"
                >
                  <span className="text-2xl">🗺️</span>
                  <span className="text-sm font-semibold">Google Maps</span>
                </a>
              </div>
            </div>

            {/* Right: Featured Project Showcase */}
            <div className="space-y-6">
              {/* Main Featured Image */}
              <div className="relative h-96 rounded-2xl overflow-hidden group">
                <Image
                  src="/images/hero-bg.jpg"
                  alt="Nasza realizacja"
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[rgb(var(--color-bg-primary))] via-transparent to-transparent opacity-60"></div>
                <div className="absolute bottom-0 left-0 right-0 p-8">
                  <div className="inline-block bg-[rgb(var(--color-accent))] text-white px-4 py-2 rounded-full text-sm font-bold mb-3">
                    Najnowsza realizacja
                  </div>
                  <h3 className="text-3xl font-bold text-white mb-2">
                    Luksusowa łazienka
                  </h3>
                  <p className="text-white/90">
                    Kompleksowa realizacja z wykorzystaniem premium materiałów
                  </p>
                </div>
              </div>

              {/* Service Cards */}
              <div className="grid grid-cols-3 gap-4">
                {[
                  { icon: '💧', label: 'Instalacje', color: 'primary' },
                  { icon: '🛁', label: 'Łazienki', color: 'accent' },
                  { icon: '🚨', label: '24/7', color: 'gradient-mid' },
                ].map((service, idx) => (
                  <div key={idx} className="card p-6 text-center group hover:scale-105 transition-all">
                    <div className="text-4xl mb-2 transform group-hover:scale-125 transition-transform">
                      {service.icon}
                    </div>
                    <p className="text-sm font-semibold text-[rgb(var(--color-text-primary))]">
                      {service.label}
                    </p>
                  </div>
                ))}
              </div>

              {/* CTA Buttons */}
              <div className="flex gap-4">
                <Link
                  href="/pl/services"
                  className="flex-1 btn btn-gradient flex items-center justify-center gap-2"
                >
                  <span>Nasze usługi</span>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
                <Link
                  href="/pl/contact"
                  className="flex-1 btn btn-outline-primary flex items-center justify-center gap-2"
                >
                  <span>Kontakt</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="mt-12 card-glass p-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { number: '500+', label: 'Projektów', icon: '✓' },
                { number: '7', label: 'Lat doświadczenia', icon: '🎓' },
                { number: '24/7', label: 'Wsparcie', icon: '🚨' },
                { number: '100%', label: 'Zadowolenie', icon: '⭐' },
              ].map((stat, idx) => (
                <div key={idx} className="text-center group">
                  <div className="text-sm text-[rgb(var(--color-text-muted))] mb-2">{stat.icon}</div>
                  <div className="text-3xl md:text-4xl font-black bg-gradient-to-r from-[rgb(var(--color-primary))] to-[rgb(var(--color-accent))] bg-clip-text text-transparent mb-1 group-hover:scale-110 transition-transform">
                    {stat.number}
                  </div>
                  <div className="text-sm text-[rgb(var(--color-text-secondary))] font-medium">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
