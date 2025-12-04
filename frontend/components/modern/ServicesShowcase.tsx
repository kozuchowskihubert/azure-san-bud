'use client';

import Link from 'next/link';
import { Droplets, Flame, Wrench, Factory, Thermometer, Settings } from 'lucide-react';

interface Service {
  icon: React.ReactNode;
  titlePL: string;
  titleEN: string;
  descriptionPL: string;
  descriptionEN: string;
  color: string;
  bgColor: string;
  borderColor: string;
}

const services: Service[] = [
  {
    icon: <Droplets className="w-8 h-8" />,
    titlePL: 'Instalacje Wodno-Kanalizacyjne',
    titleEN: 'Water & Sewage Systems',
    descriptionPL: 'Kompleksowe instalacje wody pitnej i kanalizacji sanitarnej dla domów i firm',
    descriptionEN: 'Complete water supply and sewage installations for homes and businesses',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
  },
  {
    icon: <Flame className="w-8 h-8" />,
    titlePL: 'Instalacje Gazowe',
    titleEN: 'Gas Installations',
    descriptionPL: 'Certyfikowane instalacje gazowe z pełnym zakresem uprawnień i gwarancją',
    descriptionEN: 'Certified gas installations with full credentials and warranty',
    color: 'text-orange-600',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-200',
  },
  {
    icon: <Thermometer className="w-8 h-8" />,
    titlePL: 'Ogrzewanie Podłogowe',
    titleEN: 'Underfloor Heating',
    descriptionPL: 'Nowoczesne systemy ogrzewania podłogowego dla maksymalnego komfortu',
    descriptionEN: 'Modern underfloor heating systems for maximum comfort',
    color: 'text-red-600',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
  },
  {
    icon: <Factory className="w-8 h-8" />,
    titlePL: 'Kotłownie',
    titleEN: 'Boiler Rooms',
    descriptionPL: 'Projektowanie i montaż profesjonalnych kotłowni gazowych i olejowych',
    descriptionEN: 'Design and installation of professional gas and oil boiler rooms',
    color: 'text-teal-600',
    bgColor: 'bg-teal-50',
    borderColor: 'border-teal-200',
  },
  {
    icon: <Wrench className="w-8 h-8" />,
    titlePL: 'Łazienki Pod Klucz',
    titleEN: 'Turnkey Bathrooms',
    descriptionPL: 'Kompleksowa realizacja łazienek od projektu po wykończenie',
    descriptionEN: 'Complete bathroom projects from design to finishing',
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-50',
    borderColor: 'border-indigo-200',
  },
  {
    icon: <Settings className="w-8 h-8" />,
    titlePL: 'Serwis i Konserwacja',
    titleEN: 'Service & Maintenance',
    descriptionPL: 'Regularne przeglądy i naprawy instalacji hydraulicznych',
    descriptionEN: 'Regular inspections and repairs of plumbing installations',
    color: 'text-gray-600',
    bgColor: 'bg-gray-50',
    borderColor: 'border-gray-200',
  },
];

interface ServicesShowcaseProps {
  locale: 'pl' | 'en';
}

export default function ServicesShowcase({ locale }: ServicesShowcaseProps) {
  const isEnglish = locale === 'en';

  return (
    <section className="py-24 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-teal-50 border border-teal-200 rounded-full mb-6">
            <Settings className="w-4 h-4 text-teal-600" />
            <span className="text-sm font-semibold text-teal-800">
              {isEnglish ? 'Our Services' : 'Nasze Usługi'}
            </span>
          </div>
          
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            {isEnglish ? 'Complete Plumbing Solutions' : 'Kompleksowe Rozwiązania Hydrauliczne'}
          </h2>
          
          <p className="text-xl text-gray-600 leading-relaxed">
            {isEnglish
              ? 'From design to installation and maintenance - we handle every aspect of your plumbing needs with precision and professionalism.'
              : 'Od projektu przez montaż po konserwację - zajmujemy się każdym aspektem Twoich potrzeb hydraulicznych z precyzją i profesjonalizmem.'}
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {services.map((service, index) => (
            <div
              key={index}
              className={`group relative bg-white border ${service.borderColor} rounded-2xl p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-1`}
            >
              {/* Icon */}
              <div className={`${service.bgColor} ${service.color} w-16 h-16 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                {service.icon}
              </div>

              {/* Content */}
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                {isEnglish ? service.titleEN : service.titlePL}
              </h3>
              
              <p className="text-gray-600 leading-relaxed">
                {isEnglish ? service.descriptionEN : service.descriptionPL}
              </p>

              {/* Hover Effect Border */}
              <div className={`absolute inset-0 rounded-2xl border-2 ${service.borderColor} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <Link
            href="/services"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-teal-600 to-teal-700 text-white font-semibold rounded-xl hover:from-teal-700 hover:to-teal-800 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            <span>{isEnglish ? 'View All Services' : 'Zobacz Wszystkie Usługi'}</span>
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
