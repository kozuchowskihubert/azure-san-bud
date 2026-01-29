'use client';

import { useTranslations } from 'next-intl';

export default function Process() {
  const t = useTranslations('process');

  const features = [
    {
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      title: 'Gwarancja jakości',
      description: 'Pełna gwarancja na wszystkie wykonane usługi i użyte materiały',
      color: 'from-blue-500 to-blue-600',
    },
    {
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: 'Terminowość',
      description: 'Realizacja zgodnie z ustalonym harmonogramem, bez opóźnień',
      color: 'from-green-500 to-emerald-600',
    },
    {
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      title: 'Doświadczony zespół',
      description: '7 lat doświadczenia, certyfikowani specjaliści',
      color: 'from-purple-500 to-purple-600',
    },
    {
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: 'Uczciwe ceny',
      description: 'Transparentna wycena bez ukrytych kosztów',
      color: 'from-orange-500 to-red-600',
    },
  ];

  return (
    <section className="py-12 sm:py-16 md:py-20 bg-gradient-to-br from-blue-50 via-white to-gray-50 relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-purple-400/10 to-blue-400/10 rounded-full blur-3xl"></div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16 px-2">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
            Dlaczego warto nam zaufać?
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
            Profesjonalizm, jakość i zadowolenie klienta to nasze priorytety
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 max-w-7xl mx-auto mb-12">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group relative bg-white rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-gray-100 hover:border-blue-300 transform hover:-translate-y-2"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Icon Container */}
              <div className={`mb-4 sm:mb-6 inline-flex p-3 rounded-xl bg-gradient-to-br ${feature.color} text-white group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg`}>
                {feature.icon}
              </div>

              {/* Content */}
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                {feature.title}
              </h3>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                {feature.description}
              </p>

              {/* Hover Effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-purple-600/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
              
              {/* Bottom Accent Line */}
              <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${feature.color} rounded-b-2xl transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300`}></div>
            </div>
          ))}
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 max-w-5xl mx-auto">
          <div className="text-center p-4 sm:p-6 bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border-2 border-gray-100 hover:border-blue-300 group">
            <div className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent mb-2 group-hover:scale-110 transition-transform">
              500+
            </div>
            <div className="text-sm sm:text-base text-gray-600 font-medium">
              Zrealizowanych<br className="hidden sm:inline"/> projektów
            </div>
          </div>

          <div className="text-center p-4 sm:p-6 bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border-2 border-gray-100 hover:border-green-300 group">
            <div className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-700 bg-clip-text text-transparent mb-2 group-hover:scale-110 transition-transform">
              7
            </div>
            <div className="text-sm sm:text-base text-gray-600 font-medium">
              Lat<br className="hidden sm:inline"/> doświadczenia
            </div>
          </div>

          <div className="text-center p-4 sm:p-6 bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border-2 border-gray-100 hover:border-purple-300 group">
            <div className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-purple-600 to-purple-700 bg-clip-text text-transparent mb-2 group-hover:scale-110 transition-transform">
              24/7
            </div>
            <div className="text-sm sm:text-base text-gray-600 font-medium">
              Serwis<br className="hidden sm:inline"/> pogotowia
            </div>
          </div>

          <div className="text-center p-4 sm:p-6 bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border-2 border-gray-100 hover:border-orange-300 group">
            <div className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-orange-600 to-red-700 bg-clip-text text-transparent mb-2 group-hover:scale-110 transition-transform">
              100%
            </div>
            <div className="text-sm sm:text-base text-gray-600 font-medium">
              Satysfakcji<br className="hidden sm:inline"/> klientów
            </div>
          </div>
        </div>

        {/* Trust Badge */}
        <div className="mt-12 sm:mt-16 text-center">
          <div className="inline-flex items-center space-x-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full px-6 py-4 shadow-xl text-white">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="font-bold text-sm sm:text-base">
              Zaufali nam setki zadowolonych klientów w całej Polsce
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
