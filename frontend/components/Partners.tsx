'use client';

import { useTranslations } from 'next-intl';
import { partners, partnerLogos } from './partner-logos';

export default function Partners() {
  const t = useTranslations('partners');

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 via-white to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            {t('title')}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t('description')}
          </p>
        </div>

        {/* Partners Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-8">
          {partners.map((partner) => (
            <div
              key={partner.name}
              className="group relative bg-white rounded-xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <a
                href={partner.website}
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                {/* Logo Container */}
                <div className="aspect-[3/2] flex items-center justify-center relative">
                  <div
                    className="w-full h-full flex items-center justify-center text-gray-400 group-hover:text-[#0066CC] transition-colors duration-300"
                    dangerouslySetInnerHTML={{
                      __html: partnerLogos[partner.logo as keyof typeof partnerLogos],
                    }}
                  />
                  
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-[#0066CC]/5 to-[#FF6B35]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg" />
                </div>

                {/* Partner Name (shown on hover) */}
                <div className="mt-3 text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <p className="text-sm font-semibold text-gray-900">{partner.name}</p>
                </div>
              </a>
            </div>
          ))}
        </div>

        {/* Bottom Text */}
        <div className="mt-16 text-center">
          <p className="text-lg text-gray-600">
            {t('quality')}
          </p>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-orange-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
      </div>
    </section>
  );
}
