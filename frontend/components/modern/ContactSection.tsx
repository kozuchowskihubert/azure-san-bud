'use client';

import { useState } from 'react';
import { Phone, Mail, MapPin, Clock } from 'lucide-react';
import Input from '@/components/forms/Input';
import Textarea from '@/components/forms/Textarea';
import Select from '@/components/forms/Select';
import Button from '@/components/ui/Button';

interface ContactSectionProps {
  locale: 'pl' | 'en';
}

export default function ContactSection({ locale }: ContactSectionProps) {
  const isEnglish = locale === 'en';
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    message: '',
  });
  
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

  const services = isEnglish 
    ? [
        { value: 'water-sewage', label: 'Water & Sewage Systems' },
        { value: 'gas', label: 'Gas Installations' },
        { value: 'heating', label: 'Heating Systems' },
        { value: 'boiler', label: 'Boiler Rooms' },
        { value: 'bathroom', label: 'Bathroom Renovation' },
        { value: 'other', label: 'Other Services' },
      ]
    : [
        { value: 'water-sewage', label: 'Instalacje Wodno-Kanalizacyjne' },
        { value: 'gas', label: 'Instalacje Gazowe' },
        { value: 'heating', label: 'Systemy Ogrzewania' },
        { value: 'boiler', label: 'Kotłownie' },
        { value: 'bathroom', label: 'Łazienki Pod Klucz' },
        { value: 'other', label: 'Inne Usługi' },
      ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5002';
      const response = await fetch(`${apiUrl}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setStatus('success');
        setFormData({ name: '', email: '', phone: '', service: '', message: '' });
        setTimeout(() => setStatus('idle'), 5000);
      } else {
        setStatus('error');
      }
    } catch (error) {
      setStatus('error');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <section id="contact" className="py-24 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16">
          {/* Left: Contact Info */}
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-teal-50 border border-teal-200 rounded-full mb-6">
              <Mail className="w-4 h-4 text-teal-600" />
              <span className="text-sm font-semibold text-teal-800">
                {isEnglish ? 'Contact Us' : 'Skontaktuj Się'}
              </span>
            </div>

            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              {isEnglish ? 'Get Your Free Quote Today' : 'Otrzymaj Darmową Wycenę'}
            </h2>

            <p className="text-xl text-gray-600 mb-10 leading-relaxed">
              {isEnglish
                ? 'Have a plumbing project in mind? Contact us for a free consultation and detailed quote. Our team responds within 24 hours.'
                : 'Masz projekt hydrauliczny? Skontaktuj się z nami po darmową konsultację i szczegółową wycenę. Odpowiadamy w ciągu 24 godzin.'}
            </p>

            {/* Contact Cards */}
            <div className="space-y-4 mb-10">
              <a 
                href="tel:+48503691808"
                className="flex items-center gap-4 p-6 bg-white rounded-xl border border-gray-200 hover:border-teal-300 hover:shadow-md transition-all duration-300 group"
              >
                <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center group-hover:bg-teal-200 transition-colors">
                  <Phone className="w-6 h-6 text-teal-600" />
                </div>
                <div>
                  <div className="text-sm text-gray-500 mb-1">{isEnglish ? 'Phone' : 'Telefon'}</div>
                  <div className="text-lg font-semibold text-gray-900">+48 503 691 808</div>
                </div>
              </a>

              <a 
                href="mailto:biuro@sanbud24.pl"
                className="flex items-center gap-4 p-6 bg-white rounded-xl border border-gray-200 hover:border-teal-300 hover:shadow-md transition-all duration-300 group"
              >
                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center group-hover:bg-orange-200 transition-colors">
                  <Mail className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <div className="text-sm text-gray-500 mb-1">Email</div>
                  <div className="text-lg font-semibold text-gray-900">biuro@sanbud24.pl</div>
                </div>
              </a>

              <div className="flex items-center gap-4 p-6 bg-white rounded-xl border border-gray-200">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <div className="text-sm text-gray-500 mb-1">{isEnglish ? 'Service Area' : 'Obszar Działania'}</div>
                  <div className="text-lg font-semibold text-gray-900">
                    {isEnglish ? 'Mazowsze Region' : 'Woj. Mazowieckie'}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 p-6 bg-white rounded-xl border border-gray-200">
                <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
                  <Clock className="w-6 h-6 text-indigo-600" />
                </div>
                <div>
                  <div className="text-sm text-gray-500 mb-1">{isEnglish ? 'Working Hours' : 'Godziny Pracy'}</div>
                  <div className="text-lg font-semibold text-gray-900">
                    {isEnglish ? 'Mon-Fri: 7:00-18:00' : 'Pn-Pt: 7:00-18:00'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Contact Form */}
          <div className="bg-white rounded-2xl border border-gray-200 p-8 lg:p-10 shadow-lg">
            <form onSubmit={handleSubmit} className="space-y-6">
              <Input
                label={isEnglish ? 'Full Name' : 'Imię i Nazwisko'}
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder={isEnglish ? 'John Doe' : 'Jan Kowalski'}
                required
                fullWidth
              />

              <div className="grid sm:grid-cols-2 gap-6">
                <Input
                  label="Email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder={isEnglish ? 'john@example.com' : 'jan@przyklad.pl'}
                  required
                  fullWidth
                />

                <Input
                  label={isEnglish ? 'Phone' : 'Telefon'}
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+48 500 000 000"
                  required
                  fullWidth
                />
              </div>

              <Select
                label={isEnglish ? 'Service Type' : 'Rodzaj Usługi'}
                name="service"
                value={formData.service}
                onChange={handleChange}
                options={services}
                required
                fullWidth
              />

              <Textarea
                label={isEnglish ? 'Message' : 'Wiadomość'}
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder={isEnglish 
                  ? 'Tell us about your project...' 
                  : 'Opisz swój projekt...'}
                rows={5}
                required
                fullWidth
              />

              {status === 'success' && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-xl text-green-800">
                  {isEnglish 
                    ? '✓ Message sent successfully! We will contact you soon.' 
                    : '✓ Wiadomość wysłana! Skontaktujemy się wkrótce.'}
                </div>
              )}

              {status === 'error' && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-800">
                  {isEnglish 
                    ? '✗ Error sending message. Please try again or call us.' 
                    : '✗ Błąd wysyłania. Spróbuj ponownie lub zadzwoń.'}
                </div>
              )}

              <Button
                type="submit"
                variant="primary"
                size="lg"
                fullWidth
                loading={status === 'sending'}
                className="bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800"
              >
                {status === 'sending' 
                  ? (isEnglish ? 'Sending...' : 'Wysyłanie...') 
                  : (isEnglish ? 'Send Message' : 'Wyślij Wiadomość')}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
