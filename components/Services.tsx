'use client';

import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import Image from 'next/image';

export default function Services() {
  const t = useTranslations();
  const locale = useLocale();

  const services = [
    {
      id: 1,
      icon: '',
      title: 'Montaż instalacji',
      description: 'Kompleksowy montaż instalacji wodnych i kanalizacyjnych',
      image: '/images/service-plumbing.jpg',
    },
    {
      id: 2,
      icon: '',
      title: 'Łazienki pod klucz',
      description: 'Projekty i wykonanie kompletnych łazienek',
      image: '/images/sanbud-google-2.jpg',
    },
    {
      id: 3,
      icon: '',
      title: 'Instalacje grzewcze',
      description: 'Montaż i serwis systemów ogrzewania',
      image: '/images/sanbud-google-3.jpg',
    },
    {
      id: 4,
      icon: '',
      title: 'Awarie 24/7',
      description: 'Całodobowy serwis w przypadku awarii',
      image: '/images/sanbud-google-4.jpg',
    },
    {
      id: 5,
      icon: '',
      title: 'Naprawy i konserwacje',
      description: 'Profesjonalne naprawy instalacji hydraulicznych',
      image: '/images/sanbud-google-1.jpg',
    },
    {
      id: 6,
      icon: '',
      title: 'Instalacje sanitarne',
      description: 'Nowoczesne rozwiązania sanitarne dla domu i firmy',
      image: '/images/sanbud-google-5.jpg',
    },
  ];

  return (
    <section className="py-12 sm:py-16 md:py-20 bg-gradient-to-br from-gray-50 to-white">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-10 sm:mb-12 md:mb-16 animate-fade-in">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold gradient-text mb-3 sm:mb-4 px-2">
            {t('services.title')}
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto px-4">
            {t('services.subtitle')}
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 mb-8 sm:mb-12">
          {services.map((service, index) => (
            <div
              key={service.id}
              className="card group hover:shadow-blue transition-all duration-300 overflow-hidden animate-slide-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Service Image */}
              <div className="relative h-40 sm:h-48 overflow-hidden">
                <Image
                  src={service.image}
                  alt={service.title}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent"></div>
                
                {/* Icon Badge */}
                <div className="absolute top-4 right-4 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <span className="text-2xl">{service.icon}</span>
                </div>

                {/* Service Number */}
                <div className="absolute bottom-4 left-4 w-10 h-10 bg-accent rounded-lg flex items-center justify-center font-bold text-white shadow-lg">
                  0{service.id}
                </div>
              </div>

              {/* Service Content */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-primary transition-colors">
                  {service.title}
                </h3>
                <p className="text-gray-600 mb-4 line-clamp-2">
                  {service.description}
                </p>

                {/* Action Button */}
                <Link
                  href={`/${locale}/services/${service.id}`}
                  className="inline-flex items-center text-primary font-semibold hover:text-accent transition-colors group/link"
                >
                  <span>Dowiedz się więcej</span>
                  <svg 
                    className="w-5 h-5 ml-2 group-hover/link:translate-x-1 transition-transform" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>

              {/* Hover Effect Border */}
              <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-primary transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center animate-fade-in">
          <Link
            href={`/${locale}/services`}
            className="btn-primary inline-flex items-center px-8 py-4 text-lg"
          >
            {t('services.viewAll')}
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
