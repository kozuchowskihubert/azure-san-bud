'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

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
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[rgb(var(--color-bg-primary))] via-[rgb(var(--color-bg-secondary))] to-[rgb(var(--color-bg-tertiary))]"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-7xl font-black mb-6 bg-gradient-to-r from-[rgb(var(--color-primary))] via-[rgb(var(--color-gradient-mid))] to-[rgb(var(--color-accent))] bg-clip-text text-transparent">
              Kontakt
            </h1>
            <p className="text-xl md:text-2xl text-[rgb(var(--color-text-secondary))] leading-relaxed">
              Skontaktuj się z nami - jesteśmy do Twojej dyspozycji 24/7
            </p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* Contact Information */}
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-bold mb-6 text-[rgb(var(--color-text-primary))]">
                  Dane kontaktowe
                </h2>
                <p className="text-[rgb(var(--color-text-secondary))] mb-8">
                  Skontaktuj się z nami w dogodny dla Ciebie sposób. Odpowiadamy na wszystkie zapytania w ciągu 24 godzin.
                </p>
              </div>

              {/* Contact Cards */}
              <div className="space-y-4">
                {[
                  {
                    icon: '📞',
                    title: 'Telefon',
                    value: '+48 503 691 808',
                    link: 'tel:+48503691808',
                    description: 'Pon-Pt: 8:00-18:00, Awarie: 24/7',
                  },
                  {
                    icon: '✉️',
                    title: 'Email',
                    value: 'sanbud.biuro@gmail.com',
                    link: 'mailto:sanbud.biuro@gmail.com',
                    description: 'Odpowiadamy w ciągu 24h',
                  },
                  {
                    icon: '📍',
                    title: 'Adres',
                    value: 'ul. Przykładowa 123',
                    description: '00-000 Warszawa, Polska',
                  },
                  {
                    icon: '⏰',
                    title: 'Godziny otwarcia',
                    value: 'Poniedziałek - Piątek',
                    description: '8:00 - 18:00',
                  },
                ].map((item, index) => (
                  <div key={index} className="card p-6 flex gap-4">
                    <div className="text-4xl">{item.icon}</div>
                    <div className="flex-1">
                      <h3 className="font-bold text-[rgb(var(--color-text-primary))] mb-1">
                        {item.title}
                      </h3>
                      {item.link ? (
                        <a
                          href={item.link}
                          className="text-[rgb(var(--color-primary))] hover:text-[rgb(var(--color-accent))] font-semibold transition-colors"
                        >
                          {item.value}
                        </a>
                      ) : (
                        <p className="text-[rgb(var(--color-text-primary))] font-semibold">
                          {item.value}
                        </p>
                      )}
                      <p className="text-sm text-[rgb(var(--color-text-secondary))] mt-1">
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Social Media */}
              <div className="card p-6">
                <h3 className="font-bold text-[rgb(var(--color-text-primary))] mb-4">
                  Obserwuj nas
                </h3>
                <div className="flex gap-4">
                  <a
                    href="https://facebook.com/sanbud"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 rounded-full bg-[rgb(var(--color-bg-elevated))] flex items-center justify-center hover:bg-[rgb(var(--color-primary))] transition-colors"
                  >
                    <span className="text-2xl">📘</span>
                  </a>
                  <a
                    href="https://instagram.com/sanbud"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 rounded-full bg-[rgb(var(--color-bg-elevated))] flex items-center justify-center hover:bg-[rgb(var(--color-accent))] transition-colors"
                  >
                    <span className="text-2xl">📸</span>
                  </a>
                  <a
                    href="https://maps.google.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 rounded-full bg-[rgb(var(--color-bg-elevated))] flex items-center justify-center hover:bg-[rgb(var(--color-success))] transition-colors"
                  >
                    <span className="text-2xl">🗺️</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="card p-8">
              <h2 className="text-3xl font-bold mb-6 text-[rgb(var(--color-text-primary))]">
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
                    <option value="emergency">Awarie 24/7</option>
                    <option value="repair">Naprawy i konserwacja</option>
                    <option value="sanitary">Instalacje sanitarne</option>
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

      {/* Map Section (placeholder) */}
      <section className="py-20 bg-[rgb(var(--color-bg-secondary))]">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="card overflow-hidden" style={{ height: '400px' }}>
              <div className="w-full h-full bg-[rgb(var(--color-bg-elevated))] flex items-center justify-center">
                <div className="text-center">
                  <div className="text-6xl mb-4">🗺️</div>
                  <p className="text-[rgb(var(--color-text-secondary))]">
                    Mapa lokalizacji (Google Maps integration)
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
