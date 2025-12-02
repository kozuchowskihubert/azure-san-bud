'use client';

import { useTranslations } from 'next-intl';
import { useEffect, useState, useRef } from 'react';

export default function Stats() {
  const t = useTranslations('stats');
  const [inView, setInView] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  const stats = [
    {
      value: t('items.0.value'),
      label: t('items.0.label'),
      icon: (
        <svg className="w-6 h-6 sm:w-8 sm:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      color: 'from-blue-500 to-cyan-500',
    },
    {
      value: t('items.1.value'),
      label: t('items.1.label'),
      icon: (
        <svg className="w-6 h-6 sm:w-8 sm:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: 'from-emerald-500 to-teal-500',
    },
    {
      value: t('items.2.value'),
      label: t('items.2.label'),
      icon: (
        <svg className="w-6 h-6 sm:w-8 sm:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: 'from-purple-500 to-pink-500',
    },
    {
      value: t('items.3.value'),
      label: t('items.3.label'),
      icon: (
        <svg className="w-6 h-6 sm:w-8 sm:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      color: 'from-orange-500 to-red-500',
    },
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  return (
    <section 
      ref={sectionRef}
      className="py-12 sm:py-16 md:py-20 bg-gradient-to-br from-primary via-primary-dark to-accent relative overflow-hidden"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10" style={{
        backgroundImage: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="1"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
      }}></div>

      {/* Floating Shapes */}
      <div className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-10 right-10 w-40 h-40 bg-accent/20 rounded-full blur-3xl animate-pulse animation-delay-500"></div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16 animate-fade-in px-2">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
            {t('title')}
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-white/90 max-w-3xl mx-auto">
            {t('subtitle')}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className={`group relative bg-white/10 backdrop-blur-sm rounded-xl sm:rounded-2xl p-6 sm:p-8 border border-white/20 hover:bg-white/20 transition-all duration-500 ${
                inView ? 'animate-slide-up' : 'opacity-0'
              }`}
              style={{ animationDelay: `${index * 150}ms` }}
            >
              {/* Icon */}
              <div className={`inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 rounded-lg sm:rounded-xl bg-gradient-to-br ${stat.color} text-white mb-4 sm:mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg`}>
                {stat.icon}
              </div>

              {/* Value */}
              <div className={`text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-2 sm:mb-3 group-hover:scale-110 transition-transform duration-300 ${
                inView ? 'animate-count-up' : ''
              }`}>
                {stat.value}
              </div>

              {/* Label */}
              <div className="text-sm sm:text-base md:text-lg text-white/80 font-medium">
                {stat.label}
              </div>

              {/* Decorative Line */}
              <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${stat.color} rounded-b-xl sm:rounded-b-2xl transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500`}></div>

              {/* Corner Glow */}
              <div className="absolute -top-2 -right-2 w-4 h-4 bg-accent rounded-full opacity-0 group-hover:opacity-100 transition-opacity animate-ping"></div>
            </div>
          ))}
        </div>

        {/* Bottom Achievement Badge */}
        <div className="mt-12 sm:mt-16 text-center animate-fade-in px-2">
          <div className="inline-flex flex-col sm:flex-row items-center sm:space-x-4 space-y-3 sm:space-y-0 bg-white/10 backdrop-blur-sm rounded-xl sm:rounded-full px-6 sm:px-8 py-4 border border-white/20">
            <div className="flex -space-x-2">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white text-xs sm:text-base font-bold border-2 border-white">
                ⭐
              </div>
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white text-xs sm:text-base font-bold border-2 border-white">
                🏆
              </div>
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-xs sm:text-base font-bold border-2 border-white">
                ✓
              </div>
            </div>
            <div className="text-center sm:text-left">
              <p className="text-sm sm:text-base font-bold text-white">{t('stats.achievement.title')}</p>
              <p className="text-xs sm:text-sm text-white/80">{t('stats.achievement.subtitle')}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
