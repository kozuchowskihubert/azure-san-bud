/**
 * Emergency Service Cards Component
 * Detailed cards for different emergency service categories
 */

'use client';

import { useLocale } from 'next-intl';
import { EMERGENCY_CATEGORIES, EMERGENCY_CONTACTS } from '@/data/emergencyData';
import { EmergencyUrgency } from '@/types/emergency';

export default function EmergencyServiceCards() {
  const locale = useLocale();
  const isEnglish = locale === 'en';

  const getUrgencyBadge = (urgency: EmergencyUrgency) => {
    const badges = {
      [EmergencyUrgency.CRITICAL]: {
        text: isEnglish ? 'CRITICAL' : 'KRYTYCZNE',
        color: 'bg-red-600 text-white animate-pulse'
      },
      [EmergencyUrgency.URGENT]: {
        text: isEnglish ? 'URGENT' : 'PILNE',
        color: 'bg-orange-600 text-white'
      },
      [EmergencyUrgency.HIGH]: {
        text: isEnglish ? 'HIGH' : 'WYSOKIE',
        color: 'bg-yellow-600 text-white'
      },
      [EmergencyUrgency.STANDARD]: {
        text: isEnglish ? 'STANDARD' : 'STANDARDOWE',
        color: 'bg-green-600 text-white'
      }
    };

    return badges[urgency];
  };

  const formatResponseTime = (category: typeof EMERGENCY_CATEGORIES[0]) => {
    const { min, max, unit } = category.responseTime;
    const unitText = isEnglish 
      ? (unit === 'minutes' ? 'min' : 'h')
      : (unit === 'minutes' ? 'min' : 'godz');
    
    return `${min}-${max} ${unitText}`;
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white mb-4">
          {isEnglish ? 'Emergency Services' : 'Rodzaje Awarii'}
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
          {isEnglish 
            ? 'We handle all types of plumbing emergencies. Response times vary by urgency level.'
            : 'Obsługujemy wszystkie rodzaje awarii hydraulicznych. Czas reakcji zależy od stopnia pilności.'
          }
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {EMERGENCY_CATEGORIES.map((category) => {
          const urgencyBadge = getUrgencyBadge(category.urgency);
          
          return (
            <div
              key={category.id}
              className="group relative bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border-2 border-transparent hover:${category.color.secondary}"
            >
              {/* Gradient header */}
              <div className={`bg-gradient-to-r ${category.color.primary} p-6 text-white`}>
                <div className="flex items-start justify-between mb-3">
                  <span className="text-5xl">{category.icon}</span>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${urgencyBadge.color}`}>
                    {urgencyBadge.text}
                  </span>
                </div>
                <h3 className="text-2xl font-black mb-2">
                  {isEnglish ? category.nameEn : category.name}
                </h3>
                <p className="text-sm opacity-90">
                  {isEnglish ? category.descriptionEn : category.description}
                </p>
              </div>

              {/* Content */}
              <div className="p-6">
                {/* Response time */}
                <div className="flex items-center gap-3 mb-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-xl">
                  <svg className="w-6 h-6 text-green-600 dark:text-green-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <div className="text-xs text-gray-600 dark:text-gray-400 font-semibold uppercase">
                      {isEnglish ? 'Response Time' : 'Czas reakcji'}
                    </div>
                    <div className="text-lg font-black text-gray-900 dark:text-white">
                      {formatResponseTime(category)}
                    </div>
                  </div>
                </div>

                {/* Examples */}
                <div className="mb-4">
                  <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-2 uppercase tracking-wide">
                    {isEnglish ? 'Examples:' : 'Przykłady:'}
                  </h4>
                  <ul className="space-y-2">
                    {(isEnglish ? category.examplesEn : category.examples).map((example, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                        <svg className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span>{example}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Call to action */}
                <a
                  href={`tel:${EMERGENCY_CONTACTS.hotline.value}`}
                  className={`group/btn w-full flex items-center justify-center gap-2 bg-gradient-to-r ${category.color.primary} hover:opacity-90 text-white font-bold py-3 px-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105`}
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                  </svg>
                  {isEnglish ? 'Call Now' : 'Zadzwoń Teraz'}
                </a>
              </div>

              {/* Hover effect overlay */}
              <div className="absolute inset-0 border-2 ${category.color.secondary} rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
            </div>
          );
        })}
      </div>

      {/* After-hours notice */}
      <div className="mt-8 bg-gradient-to-r from-blue-50 to-green-50 dark:from-blue-900/20 dark:to-green-900/20 border-2 border-blue-200 dark:border-blue-800 rounded-2xl p-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="flex-1">
            <h4 className="font-bold text-gray-900 dark:text-white mb-2 text-lg">
              {isEnglish ? '24/7 Emergency Service' : 'Serwis Awaryjny 24/7'}
            </h4>
            <p className="text-gray-700 dark:text-gray-300">
              {isEnglish 
                ? 'For critical emergencies (flooding, gas leaks), we respond immediately any time of day or night. Standard services are available Monday-Friday 8:00-18:00.'
                : 'W przypadku krytycznych awarii (zalania, wycieki gazu) reagujemy natychmiast o każdej porze dnia i nocy. Standardowe usługi dostępne Pon-Pt 8:00-18:00.'
              }
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
