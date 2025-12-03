'use client';

import { ArrowRight, Phone, Mail } from 'lucide-react';
import Button from '@/components/ui/Button';

interface HeroSectionProps {
  locale: 'pl' | 'en';
}

export default function HeroSection({ locale }: HeroSectionProps) {
  const isEnglish = locale === 'en';

  return (
    <section className="relative min-h-[85vh] flex items-center overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-[0.015]">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }} />
      </div>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-transparent to-transparent" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-5xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-teal-500/10 border border-teal-500/20 rounded-full mb-8 backdrop-blur-sm">
            <div className="w-2 h-2 bg-teal-400 rounded-full animate-pulse" />
            <span className="text-sm font-semibold text-teal-300">
              {isEnglish ? 'Professional Plumbing Services' : 'Profesjonalne Usługi Hydrauliczne'}
            </span>
          </div>

          {/* Main Headline */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold text-white mb-6 leading-[1.1] tracking-tight">
            {isEnglish ? (
              <>
                Expert Plumbing<br />
                <span className="bg-gradient-to-r from-teal-400 via-teal-300 to-orange-400 bg-clip-text text-transparent">
                  Solutions
                </span>
              </>
            ) : (
              <>
                Instalacje<br />
                <span className="bg-gradient-to-r from-teal-400 via-teal-300 to-orange-400 bg-clip-text text-transparent">
                  Wodno-Kanalizacyjne
                </span>
              </>
            )}
          </h1>

          {/* Subheadline */}
          <p className="text-lg sm:text-xl lg:text-2xl text-gray-300 mb-12 max-w-2xl leading-relaxed font-light">
            {isEnglish
              ? 'Professional installations, repairs, and maintenance for residential and commercial properties across Mazowsze region. Over 25 years of trusted expertise.'
              : 'Profesjonalne instalacje, naprawy i konserwacje dla nieruchomości mieszkalnych i komercyjnych w województwie mazowieckim. Ponad 25 lat zaufanego doświadczenia.'}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              variant="primary"
              size="xl"
              className="bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white shadow-lg shadow-teal-500/25"
              onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
            >
              {isEnglish ? 'Get Free Quote' : 'Darmowa Wycena'}
              <ArrowRight className="w-5 h-5" />
            </Button>

            <Button
              variant="outline"
              size="xl"
              className="border-2 border-white/30 text-white hover:bg-white/10 backdrop-blur-sm"
              onClick={() => window.location.href = 'tel:+48503691808'}
            >
              <Phone className="w-5 h-5" />
              +48 503 691 808
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className="mt-16 flex flex-wrap gap-8 items-center">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-teal-500/10 rounded-xl flex items-center justify-center border border-teal-500/20">
                <svg className="w-6 h-6 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <div className="text-2xl font-bold text-white">25+</div>
                <div className="text-sm text-gray-400">{isEnglish ? 'Years Experience' : 'Lat Doświadczenia'}</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-orange-500/10 rounded-xl flex items-center justify-center border border-orange-500/20">
                <svg className="w-6 h-6 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div>
                <div className="text-2xl font-bold text-white">2500+</div>
                <div className="text-sm text-gray-400">{isEnglish ? 'Happy Clients' : 'Zadowolonych Klientów'}</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-teal-500/10 rounded-xl flex items-center justify-center border border-teal-500/20">
                <svg className="w-6 h-6 text-teal-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
              <div>
                <div className="text-2xl font-bold text-white">4.9/5</div>
                <div className="text-sm text-gray-400">{isEnglish ? 'Customer Rating' : 'Ocena Klientów'}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Element */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent" />
    </section>
  );
}
