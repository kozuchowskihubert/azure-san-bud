'use client';

interface BenefitsBarProps {
  locale: 'pl' | 'en';
}

export default function BenefitsBar({ locale }: BenefitsBarProps) {
  const isEnglish = locale === 'en';

  const benefits = [
    {
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      titlePL: 'Reakcja 24/7',
      titleEN: '24/7 Response',
      descriptionPL: 'Szybki kontakt',
      descriptionEN: 'Fast Contact'
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      titlePL: 'Gwarancja 5 lat',
      titleEN: '5 Year Warranty',
      descriptionPL: 'Na wszystkie usługi',
      descriptionEN: 'On All Services'
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      titlePL: 'Darmowa Wycena',
      titleEN: 'Free Estimate',
      descriptionPL: 'Bez zobowiązań',
      descriptionEN: 'No Obligation'
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
      titlePL: 'Wykwalifikowany Zespół',
      titleEN: 'Qualified Team',
      descriptionPL: '7 lat doświadczenia',
      descriptionEN: '7 Years Experience'
    },
  ];

  return (
    <section className="py-8 bg-gradient-to-br from-blue-600 to-purple-600 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-1/4 w-64 h-64 bg-white rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="flex items-center gap-4 bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 hover:bg-white/20 transition-all duration-300 group"
            >
              <div className="flex-shrink-0 w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                {benefit.icon}
              </div>
              <div>
                <div className="font-bold text-white text-sm md:text-base">
                  {isEnglish ? benefit.titleEN : benefit.titlePL}
                </div>
                <div className="text-white/80 text-xs md:text-sm">
                  {isEnglish ? benefit.descriptionEN : benefit.descriptionPL}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
