import { useTranslations } from 'next-intl';
import Image from 'next/image';

export default function AboutPage() {
  const t = useTranslations();

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[rgb(var(--color-bg-primary))] via-[rgb(var(--color-bg-secondary))] to-[rgb(var(--color-bg-tertiary))]"></div>
        
        {/* Animated background grid */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'linear-gradient(rgba(52, 152, 219, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(52, 152, 219, 0.1) 1px, transparent 1px)',
            backgroundSize: '50px 50px',
          }}></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-7xl font-black mb-6 bg-gradient-to-r from-[rgb(var(--color-primary))] via-[rgb(var(--color-gradient-mid))] to-[rgb(var(--color-accent))] bg-clip-text text-transparent">
              O Nas
            </h1>
            <p className="text-xl md:text-2xl text-[rgb(var(--color-text-secondary))] leading-relaxed">
              Hydraulika to nasza pasja. Od 2018 roku dostarczamy profesjonalne usługi hydrauliczne najwyższej jakości.
            </p>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
            <div className="relative h-96 rounded-2xl overflow-hidden">
              <Image
                src="/images/sanbud-google-2.jpg"
                alt="SanBud Team"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[rgb(var(--color-bg-primary))] to-transparent opacity-60"></div>
            </div>
            
            <div className="space-y-6">
              <h2 className="text-4xl font-bold text-[rgb(var(--color-text-primary))]">
                Nasza Historia
              </h2>
              <p className="text-[rgb(var(--color-text-secondary))] leading-relaxed">
                SanBud Hydraulika rozpoczął działalność w 2018 roku z misją dostarczania najwyższej jakości usług hydraulicznych. 
                Nasza pasja do perfekcji i zaangażowanie w zadowolenie klientów sprawiły, że staliśmy się zaufanym partnerem 
                w dziedzinie instalacji sanitarnych.
              </p>
              <p className="text-[rgb(var(--color-text-secondary))] leading-relaxed">
                Specjalizujemy się w kompleksowych usługach hydraulicznych - od montażu nowoczesnych instalacji wodnych, 
                przez realizację luksusowych łazienek, aż po system grzewcze i awaryjne naprawy dostępne 24/7.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-[rgb(var(--color-bg-secondary))] to-[rgb(var(--color-bg-primary))]"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-[rgb(var(--color-text-primary))]">
              Nasze Wartości
            </h2>
            <p className="text-xl text-[rgb(var(--color-text-secondary))]">
              Trzy filary, na których opiera się nasza działalność
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                title: 'Fachowość',
                description: 'Wieloletnie doświadczenie i ciągłe podnoszenie kwalifikacji zapewniają najwyższy poziom usług.',
              },
              {
                title: 'Rzetelność',
                description: 'Stawiamy na transparentność w wycenach i uczciwe relacje z klientami.',
              },
              {
                title: 'Terminowość',
                description: 'Szanujemy Twój czas - realizujemy zlecenia zgodnie z ustalonym harmonogramem.',
              },
            ].map((value, index) => (
              <div key={index} className="card p-8 text-center group">
                <h3 className="text-2xl font-bold mb-4 text-[rgb(var(--color-text-primary))]">
                  {value.title}
                </h3>
                <p className="text-[rgb(var(--color-text-secondary))] leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-[rgb(var(--color-text-primary))]">
              Doświadczenie
            </h2>
            <p className="text-xl text-[rgb(var(--color-text-secondary))]">
              Liczby, które pokazują naszą skuteczność
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {[
              { number: '500+', label: 'Zrealizowanych Projektów' },
              { number: '7', label: 'Lat Doświadczenia' },
              { number: '24/7', label: 'Wsparcie Awaryjne' },
              { number: '100%', label: 'Zadowolonych Klientów' },
            ].map((stat, index) => (
              <div key={index} className="card p-8 text-center">
                <div className="text-4xl md:text-5xl font-black mb-3 bg-gradient-to-r from-[rgb(var(--color-primary))] to-[rgb(var(--color-accent))] bg-clip-text text-transparent">
                  {stat.number}
                </div>
                <p className="text-[rgb(var(--color-text-secondary))] font-medium">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[rgb(var(--color-primary))] via-[rgb(var(--color-gradient-mid))] to-[rgb(var(--color-accent))] opacity-90"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
              Gotowy na współpracę?
            </h2>
            <p className="text-xl mb-8 text-white/90">
              Skontaktuj się z nami i przekonaj się, dlaczego klienci nam ufają
            </p>
            <a
              href="/pl/contact"
              className="btn btn-accent inline-flex items-center gap-2 bg-white text-[rgb(var(--color-primary))] hover:bg-white/90"
            >
              Skontaktuj się
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
