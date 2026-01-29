'use client';

import { useState } from 'react';
import {
  generateGoogleCalendarUrl,
  generateOutlookCalendarUrl,
  generateOffice365CalendarUrl,
  downloadICalFile,
  openCalendarLink,
  createCalendarEventFromBooking,
  getPreferredCalendar,
  type CalendarEvent,
} from '@/utils/calendar';

interface AddToCalendarButtonProps {
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  service: string;
  customerName: string;
  phone: string;
  description?: string;
  className?: string;
}

export default function AddToCalendarButton({
  date,
  time,
  service,
  customerName,
  phone,
  description = '',
  className = '',
}: AddToCalendarButtonProps) {
  const [showDropdown, setShowDropdown] = useState(false);

  const event = createCalendarEventFromBooking(date, time, service, customerName, phone, description);
  const preferredCalendar = getPreferredCalendar();

  const handleAddToCalendar = (type: 'google' | 'apple' | 'outlook' | 'office365') => {
    switch (type) {
      case 'google':
        openCalendarLink(generateGoogleCalendarUrl(event));
        break;
      case 'apple':
        downloadICalFile(event, `sanbud-${date}-${time.replace(':', '')}.ics`);
        break;
      case 'outlook':
        openCalendarLink(generateOutlookCalendarUrl(event));
        break;
      case 'office365':
        openCalendarLink(generateOffice365CalendarUrl(event));
        break;
    }
    setShowDropdown(false);
  };

  const handleQuickAdd = () => {
    handleAddToCalendar(preferredCalendar);
  };

  return (
    <div className="relative inline-block">
      <div className="flex gap-2">
        {/* Quick Add Button (Preferred Calendar) */}
        <button
          onClick={handleQuickAdd}
          className={`flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-semibold hover:from-green-600 hover:to-emerald-700 transition-all shadow-lg hover:shadow-xl hover:scale-105 ${className}`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          Dodaj do kalendarza
        </button>

        {/* Dropdown Toggle */}
        <button
          onClick={() => setShowDropdown(!showDropdown)}
          className="px-3 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-semibold hover:from-green-600 hover:to-emerald-700 transition-all shadow-lg hover:shadow-xl hover:scale-105"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      {/* Dropdown Menu */}
      {showDropdown && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setShowDropdown(false)}
          />
          
          {/* Menu */}
          <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 z-20 overflow-hidden">
            <div className="p-2">
              <p className="px-3 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                Wybierz kalendarz
              </p>
              
              {/* Google Calendar */}
              <button
                onClick={() => handleAddToCalendar('google')}
                className="w-full flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors group"
              >
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                  </svg>
                </div>
                <div className="text-left flex-1">
                  <p className="font-semibold text-gray-900 dark:text-white">Google Calendar</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Otwórz w przeglądarce</p>
                </div>
              </button>

              {/* Apple Calendar */}
              <button
                onClick={() => handleAddToCalendar('apple')}
                className="w-full flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors group mt-1"
              >
                <div className="w-10 h-10 bg-gradient-to-br from-gray-700 to-gray-900 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
                  </svg>
                </div>
                <div className="text-left flex-1">
                  <p className="font-semibold text-gray-900 dark:text-white">Apple Calendar</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Pobierz plik .ics</p>
                </div>
              </button>

              {/* Outlook */}
              <button
                onClick={() => handleAddToCalendar('outlook')}
                className="w-full flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors group mt-1"
              >
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M7 8.5v7h6v-7H7zM12 2L2 5v14l10 3 10-3V5l-10-3zm0 16l-5-1.5v-9L12 6v12z"/>
                  </svg>
                </div>
                <div className="text-left flex-1">
                  <p className="font-semibold text-gray-900 dark:text-white">Outlook.com</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Otwórz w przeglądarce</p>
                </div>
              </button>

              {/* Office 365 */}
              <button
                onClick={() => handleAddToCalendar('office365')}
                className="w-full flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors group mt-1"
              >
                <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-orange-600 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17 3H7c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H7V5h10v14z"/>
                  </svg>
                </div>
                <div className="text-left flex-1">
                  <p className="font-semibold text-gray-900 dark:text-white">Office 365</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Otwórz w przeglądarce</p>
                </div>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
