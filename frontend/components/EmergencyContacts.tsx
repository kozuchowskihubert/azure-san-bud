/**
 * Emergency Contacts Component
 * Professional 24/7 emergency service contact section
 */

'use client';

import { useTranslations, useLocale } from 'next-intl';
import { EMERGENCY_CONTACTS, EMERGENCY_STATS } from '@/data/emergencyData';

export default function EmergencyContacts() {
  const t = useTranslations();
  const locale = useLocale();
  const isEnglish = locale === 'en';

  const { hotline, email, socialMedia } = EMERGENCY_CONTACTS;

  return (
    <div className="space-y-8">
      {/* Emergency Hotline - Most Prominent */}
      <div className="relative group">
        {/* Animated border pulse effect */}
        <div className="absolute -inset-1 bg-gradient-to-r from-red-600 via-orange-600 to-red-600 rounded-3xl blur-lg opacity-75 group-hover:opacity-100 animate-pulse"></div>
        
        <div className="relative bg-gradient-to-br from-red-600 to-red-700 dark:from-red-700 dark:to-red-900 rounded-3xl p-8 shadow-2xl">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-6">
              {/* Pulsing icon */}
              <div className="relative">
                <div className="absolute inset-0 bg-white rounded-full animate-ping opacity-75"></div>
                <div className="relative w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-4xl">{hotline.icon}</span>
                </div>
              </div>
              
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="inline-flex items-center px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-bold text-white uppercase tracking-wider">
                    ⚡ {isEnglish ? 'Emergency' : 'Awaria'}
                  </span>
                  <span className="inline-flex items-center px-3 py-1 bg-yellow-400 rounded-full text-xs font-bold text-red-900 uppercase tracking-wider">
                    24/7
                  </span>
                </div>
                <h3 className="text-2xl md:text-3xl font-black text-white mb-1">
                  {isEnglish ? hotline.labelEn : hotline.label}
                </h3>
                <p className="text-red-100 font-medium">
                  {isEnglish ? hotline.availableEn : hotline.available}
                </p>
              </div>
            </div>
            
            {/* Call button */}
            <a
              href={`tel:${hotline.value}`}
              className="group/btn flex items-center gap-3 bg-white hover:bg-red-50 text-red-700 font-bold px-8 py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
              </svg>
              <div className="text-left">
                <div className="text-xs text-red-600 uppercase font-semibold">
                  {isEnglish ? 'Call now' : 'Zadzwoń teraz'}
                </div>
                <div className="text-xl font-black tracking-tight">
                  {hotline.value}
                </div>
              </div>
            </a>
          </div>
          
          {/* Response time indicator */}
          <div className="mt-6 pt-6 border-t border-white/20">
            <div className="flex items-center justify-center md:justify-start gap-4 text-white">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-yellow-300" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                </svg>
                <span className="font-semibold">
                  {isEnglish ? 'Avg. response:' : 'Śr. czas reakcji:'}
                </span>
                <span className="font-black text-yellow-300">
                  {EMERGENCY_STATS.averageResponseTime} {isEnglish ? 'min' : 'min'}
                </span>
              </div>
              <div className="hidden md:block w-px h-6 bg-white/30"></div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-300" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="font-semibold">
                  {isEnglish ? 'Satisfaction:' : 'Zadowolenie:'}
                </span>
                <span className="font-black text-green-300">
                  {EMERGENCY_STATS.customerSatisfaction}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Secondary Contact Methods */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* Email Contact */}
        <div className="group bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-orange-500/50">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform shadow-lg">
              <span className="text-3xl">{email.icon}</span>
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-gray-900 dark:text-white mb-1 text-lg">
                {isEnglish ? email.labelEn : email.label}
              </h4>
              <a
                href={`mailto:${email.value}`}
                className="text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 font-semibold transition-colors break-all"
              >
                {email.value}
              </a>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                {isEnglish ? email.availableEn : email.available}
              </p>
            </div>
          </div>
        </div>

        {/* Social Media Contact */}
        {socialMedia && socialMedia.length > 0 && (
          <div className="group bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                <span className="text-3xl">{socialMedia[0].icon}</span>
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-white mb-1 text-lg">
                  {isEnglish ? socialMedia[0].labelEn : socialMedia[0].label}
                </h4>
                <a
                  href={socialMedia[0].value}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-100 hover:text-white font-semibold transition-colors inline-flex items-center gap-2 group/link"
                >
                  {isEnglish ? 'Send message' : 'Wyślij wiadomość'}
                  <svg className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </a>
                <p className="text-sm text-blue-100 mt-2">
                  {isEnglish ? socialMedia[0].availableEn : socialMedia[0].available}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Trust Indicators */}
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="group">
            <div className="text-3xl md:text-4xl font-black bg-gradient-to-r from-green-600 to-orange-600 bg-clip-text text-transparent mb-1 group-hover:scale-110 transition-transform">
              {EMERGENCY_STATS.emergenciesHandled.toLocaleString()}+
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400 font-semibold">
              {isEnglish ? 'Emergencies Handled' : 'Interwencji'}
            </div>
          </div>
          <div className="group">
            <div className="text-3xl md:text-4xl font-black bg-gradient-to-r from-green-600 to-orange-600 bg-clip-text text-transparent mb-1 group-hover:scale-110 transition-transform">
              {EMERGENCY_STATS.averageResponseTime}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400 font-semibold">
              {isEnglish ? 'Minutes Avg.' : 'Minut średnio'}
            </div>
          </div>
          <div className="group">
            <div className="text-3xl md:text-4xl font-black bg-gradient-to-r from-green-600 to-orange-600 bg-clip-text text-transparent mb-1 group-hover:scale-110 transition-transform">
              {EMERGENCY_STATS.customerSatisfaction}%
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400 font-semibold">
              {isEnglish ? 'Satisfaction' : 'Zadowolenie'}
            </div>
          </div>
          <div className="group">
            <div className="text-3xl md:text-4xl font-black bg-gradient-to-r from-green-600 to-orange-600 bg-clip-text text-transparent mb-1 group-hover:scale-110 transition-transform">
              {EMERGENCY_STATS.availabilityUptime}%
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400 font-semibold">
              {isEnglish ? 'Availability' : 'Dostępność'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
