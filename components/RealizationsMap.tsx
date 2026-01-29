'use client';

import React from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { REALIZATIONS, REGIONS_SUMMARY, SERVICE_CATEGORIES } from '@/data/realizationsData';
import { MapPin, TrendingUp, Users, Award } from 'lucide-react';

export default function RealizationsMap() {
  const t = useTranslations();
  const locale = useLocale();
  const isEnglish = locale === 'en';

  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {isEnglish ? 'Discover Our Realizations Map' : 'Poznaj Mapę Naszych Realizacji'}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {isEnglish 
              ? 'Over 2000 completed projects across Mazovia region. Join our satisfied customers!'
              : 'Ponad 2000 zrealizowanych projektów w całym regionie Mazowsza. Dołącz do grona zadowolonych klientów!'}
          </p>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-8 text-white shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <TrendingUp className="w-12 h-12 opacity-80" />
              <span className="text-5xl font-bold">{REGIONS_SUMMARY.total}</span>
            </div>
            <p className="text-lg font-semibold opacity-90">
              {isEnglish ? 'Completed Projects' : 'Zrealizowanych Projektów'}
            </p>
          </div>

          <div className="bg-gradient-to-br from-green-600 to-green-700 rounded-2xl p-8 text-white shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <MapPin className="w-12 h-12 opacity-80" />
              <span className="text-5xl font-bold">{REGIONS_SUMMARY.cities}</span>
            </div>
            <p className="text-lg font-semibold opacity-90">
              {isEnglish ? 'Cities Served' : 'Obsługiwanych Miast'}
            </p>
          </div>

          <div className="bg-gradient-to-br from-purple-600 to-purple-700 rounded-2xl p-8 text-white shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <Award className="w-12 h-12 opacity-80" />
              <span className="text-5xl font-bold">15</span>
            </div>
            <p className="text-lg font-semibold opacity-90">
              {isEnglish ? 'Years of Experience' : 'Lat Doświadczenia'}
            </p>
          </div>
        </div>

        {/* Service Categories */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            {isEnglish ? 'Our Services by Numbers' : 'Nasze Usługi w Liczbach'}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {SERVICE_CATEGORIES.map((category) => (
              <div
                key={category.name}
                className="bg-white border-2 border-gray-200 rounded-xl p-6 hover:border-blue-500 hover:shadow-lg transition-all"
              >
                <div className="text-center">
                  <p className="text-3xl font-bold text-blue-600 mb-2">{category.count}</p>
                  <p className="text-gray-700 font-medium">
                    {isEnglish ? category.nameEn : category.name}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Cities Map */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
          <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            {isEnglish ? 'Realizations by City' : 'Realizacje według Miast'}
          </h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {REALIZATIONS.map((realization) => (
              <div
                key={realization.id}
                className="group bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 hover:from-blue-50 hover:to-blue-100 transition-all duration-300 border border-gray-200 hover:border-blue-400 hover:shadow-xl cursor-pointer"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h4 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                      {isEnglish ? realization.cityEn : realization.city}
                    </h4>
                    <p className="text-sm text-gray-500">
                      {isEnglish ? realization.regionEn : realization.region}
                    </p>
                  </div>
                  <div className="bg-blue-600 group-hover:bg-blue-700 text-white rounded-full w-14 h-14 flex items-center justify-center font-bold text-lg shadow-lg">
                    {realization.count}
                  </div>
                </div>

                <div className="space-y-1">
                  <p className="text-xs font-semibold text-gray-600 mb-2">
                    {isEnglish ? 'Services:' : 'Usługi:'}
                  </p>
                  {(isEnglish ? realization.servicesEn : realization.services).map((service, idx) => (
                    <div key={idx} className="flex items-center text-sm text-gray-700">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></div>
                      {service}
                    </div>
                  ))}
                </div>

                <div className="mt-4 pt-4 border-t border-gray-200 flex items-center text-xs text-gray-500">
                  <MapPin className="w-3.5 h-3.5 mr-1" />
                  <span>
                    {realization.coordinates.lat.toFixed(4)}, {realization.coordinates.lng.toFixed(4)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-16 text-center bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-12 text-white shadow-2xl">
          <Users className="w-16 h-16 mx-auto mb-6 opacity-90" />
          <h3 className="text-3xl font-bold mb-4">
            {isEnglish ? 'Join Over 2000 Satisfied Customers!' : 'Dołącz do Ponad 2000 Zadowolonych Klientów!'}
          </h3>
          <p className="text-xl mb-8 opacity-90">
            {isEnglish 
              ? 'Professional installations, 5-year warranty, free quote within 24h'
              : 'Profesjonalne instalacje, gwarancja 5 lat, darmowa wycena w 24h'}
          </p>
          <a
            href="tel:+48503691808"
            className="inline-flex items-center bg-white text-blue-600 px-8 py-4 rounded-full text-lg font-bold hover:bg-gray-100 transition-all shadow-xl hover:scale-105"
          >
            📞 503-691-808
          </a>
        </div>
      </div>
    </section>
  );
}
