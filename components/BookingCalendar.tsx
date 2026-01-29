'use client';

import { useState } from 'react';
import AddToCalendarButton from './AddToCalendarButton';
import { buildApiUrl } from '@/utils/api';

interface TimeSlot {
  time: string;
  available: boolean;
}

interface BookingCalendarProps {
  onBookingComplete?: (data: BookingData) => void;
}

interface BookingData {
  date: Date;
  time: string;
  name: string;
  phone: string;
  email: string;
  service: string;
  description: string;
}

export default function BookingCalendar({ onBookingComplete }: BookingCalendarProps) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [step, setStep] = useState<'date' | 'time' | 'form' | 'success'>('date');
  const [bookingSuccess, setBookingSuccess] = useState<BookingData | null>(null);
  
  // Form data
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    service: 'Instalacje wodno-kanalizacyjne',
    description: '',
  });

  // Generuj dostępne sloty czasowe
  const generateTimeSlots = (date: Date): TimeSlot[] => {
    const slots: TimeSlot[] = [];
    const dayOfWeek = date.getDay();
    
    // Sobota (6): 9:00-14:00, Niedziela (0): zamknięte
    if (dayOfWeek === 0) return []; // Niedziela - zamknięte
    
    const startHour = dayOfWeek === 6 ? 9 : 8;
    const endHour = dayOfWeek === 6 ? 14 : 18;
    
    for (let hour = startHour; hour < endHour; hour++) {
      ['00', '30'].forEach(minutes => {
        const time = `${hour.toString().padStart(2, '0')}:${minutes}`;
        // Symulacja zajętych slotów (losowo 30%)
        const available = Math.random() > 0.3;
        slots.push({ time, available });
      });
    }
    
    return slots;
  };

  // Generuj dni miesiąca
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    const days = [];
    
    // Poprzednie dni (puste)
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Dni miesiąca
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  const days = getDaysInMonth(currentMonth);
  const timeSlots = selectedDate ? generateTimeSlots(selectedDate) : [];

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const handleDateSelect = (date: Date) => {
    // Nie pozwalaj na wybór dat w przeszłości
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (date < today) return;
    
    // Nie pozwalaj na wybór niedzieli
    if (date.getDay() === 0) return;
    
    setSelectedDate(date);
    setSelectedTime(null);
    setStep('time');
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
    setStep('form');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedDate || !selectedTime) return;
    
    const bookingData = {
      date: selectedDate.toISOString().split('T')[0], // YYYY-MM-DD
      time: selectedTime,
      name: formData.name,
      phone: formData.phone,
      email: formData.email,
      service: formData.service,
      description: formData.description,
    };
    
    try {
      // Send to backend API
      const response = await fetch(buildApiUrl('appointments/api/book'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData),
      });
      
      const result = await response.json();
      
      if (response.ok && result.success) {
        // Success! Show success screen with calendar integration
        const successData = {
          date: selectedDate,
          time: selectedTime,
          ...formData,
        };
        
        setBookingSuccess(successData);
        setStep('success');
        
        if (onBookingComplete) {
          onBookingComplete(successData);
        }
      } else {
        throw new Error(result.message || 'Wystąpił błąd podczas rezerwacji');
      }
    } catch (error) {
      console.error('Booking error:', error);
      alert(`❌ Nie udało się utworzyć rezerwacji.\n\nProsimy spróbować ponownie lub skontaktować się telefonicznie: +48 503 691 808`);
    }
  };

  const handleResetBooking = () => {
    setStep('date');
    setSelectedDate(null);
    setSelectedTime(null);
    setBookingSuccess(null);
    setFormData({
      name: '',
      phone: '',
      email: '',
      service: 'Instalacje wodno-kanalizacyjne',
      description: '',
    });
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isPast = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  const monthNames = ['Styczeń', 'Luty', 'Marzec', 'Kwiecień', 'Maj', 'Czerwiec', 
                      'Lipiec', 'Sierpień', 'Wrzesień', 'Październik', 'Listopad', 'Grudzień'];
  const dayNames = ['Ndz', 'Pon', 'Wt', 'Śr', 'Czw', 'Pt', 'Sob'];

  return (
    <div className="max-w-6xl mx-auto">
      {/* Progress Steps */}
      <div className="flex justify-center mb-8">
        <div className="flex items-center space-x-4">
          <div className={`flex items-center gap-2 ${step === 'date' ? 'text-green-600 dark:text-green-400 font-bold' : step === 'time' || step === 'form' ? 'text-green-600 dark:text-green-400' : 'text-gray-400'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === 'date' ? 'bg-green-600 text-white' : step === 'time' || step === 'form' ? 'bg-green-600 text-white' : 'bg-gray-300'}`}>
              1
            </div>
            <span>Wybierz datę</span>
          </div>
          <div className="w-12 h-0.5 bg-gray-300 dark:bg-gray-600" />
          <div className={`flex items-center gap-2 ${step === 'time' ? 'text-green-600 dark:text-green-400 font-bold' : step === 'form' ? 'text-green-600 dark:text-green-400' : 'text-gray-400'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === 'time' ? 'bg-green-600 text-white' : step === 'form' ? 'bg-green-600 text-white' : 'bg-gray-300'}`}>
              2
            </div>
            <span>Wybierz godzinę</span>
          </div>
          <div className="w-12 h-0.5 bg-gray-300 dark:bg-gray-600" />
          <div className={`flex items-center gap-2 ${step === 'form' ? 'text-orange-600 dark:text-orange-400 font-bold' : 'text-gray-400'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === 'form' ? 'bg-orange-600 text-white' : 'bg-gray-300'}`}>
              3
            </div>
            <span>Dane kontaktowe</span>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Calendar Section */}
        <div className={`bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 ${step === 'date' ? 'ring-2 ring-green-500' : ''}`}>
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={handlePrevMonth}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              ←
            </button>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
            </h3>
            <button
              onClick={handleNextMonth}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              →
            </button>
          </div>

          {/* Day names */}
          <div className="grid grid-cols-7 gap-2 mb-2">
            {dayNames.map(day => (
              <div key={day} className="text-center text-sm font-semibold text-gray-600 dark:text-gray-400 py-2">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar days */}
          <div className="grid grid-cols-7 gap-2">
            {days.map((date, index) => {
              if (!date) {
                return <div key={`empty-${index}`} className="aspect-square" />;
              }

              const isSelected = selectedDate?.toDateString() === date.toDateString();
              const isSunday = date.getDay() === 0;
              const past = isPast(date);
              const today = isToday(date);

              return (
                <button
                  key={index}
                  onClick={() => handleDateSelect(date)}
                  disabled={past || isSunday}
                  className={`aspect-square rounded-lg flex items-center justify-center text-sm font-medium transition-all duration-200
                    ${isSelected ? 'bg-green-600 text-white shadow-lg scale-110' : ''}
                    ${!isSelected && today ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 ring-2 ring-green-300 dark:ring-green-700' : ''}
                    ${!isSelected && !today && !past && !isSunday ? 'bg-gray-50 dark:bg-gray-700 hover:bg-green-50 dark:hover:bg-green-900/20 hover:text-green-600 dark:hover:text-green-400' : ''}
                    ${past || isSunday ? 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-600 cursor-not-allowed' : 'cursor-pointer'}
                  `}
                >
                  {date.getDate()}
                </button>
              );
            })}
          </div>

          <div className="mt-6 space-y-2 text-sm text-gray-600 dark:text-gray-400">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-600 rounded" />
              <span>Data wybrana</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-100 dark:bg-green-900/30 ring-2 ring-green-300 dark:ring-green-700 rounded" />
              <span>Dzisiaj</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-gray-100 dark:bg-gray-800 rounded" />
              <span>Niedostępne</span>
            </div>
          </div>
        </div>

        {/* Time Slots / Form Section */}
        <div className="space-y-6">
          {step === 'time' && selectedDate && (
            <div className={`bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 ${step === 'time' ? 'ring-2 ring-green-500' : ''}`}>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Wybierz godzinę dla {selectedDate.toLocaleDateString('pl-PL')}
              </h3>
              
              <div className="grid grid-cols-3 gap-3 max-h-96 overflow-y-auto">
                {timeSlots.map((slot) => (
                  <button
                    key={slot.time}
                    onClick={() => slot.available && handleTimeSelect(slot.time)}
                    disabled={!slot.available}
                    className={`p-3 rounded-lg text-sm font-medium transition-all duration-200
                      ${selectedTime === slot.time ? 'bg-green-600 text-white shadow-lg scale-105' : ''}
                      ${selectedTime !== slot.time && slot.available ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/30 border-2 border-green-200 dark:border-green-700' : ''}
                      ${!slot.available ? 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-600 cursor-not-allowed line-through' : 'cursor-pointer'}
                    `}
                  >
                    {slot.time}
                  </button>
                ))}
              </div>

              <div className="mt-6 flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-green-50 dark:bg-green-900/20 border-2 border-green-200 dark:border-green-700 rounded" />
                  <span className="text-gray-600 dark:text-gray-400">Dostępne</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-gray-100 dark:bg-gray-800 rounded" />
                  <span className="text-gray-600 dark:text-gray-400">Zajęte</span>
                </div>
              </div>

              <button
                onClick={() => setStep('date')}
                className="mt-4 w-full px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg transition-colors"
              >
                ← Wróć do kalendarza
              </button>
            </div>
          )}

          {step === 'form' && selectedDate && selectedTime && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 ring-2 ring-orange-500">
              <div className="mb-6 p-4 bg-gradient-to-r from-green-50 to-orange-50 dark:from-green-900/20 dark:to-orange-900/20 rounded-lg border border-green-200 dark:border-green-700">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Podsumowanie rezerwacji</h3>
                <p className="text-gray-700 dark:text-gray-300">📅 Data: {selectedDate.toLocaleDateString('pl-PL')}</p>
                <p className="text-gray-700 dark:text-gray-300">🕐 Godzina: {selectedTime}</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Imię i nazwisko *</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="Jan Kowalski"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Telefon *</label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="+48 503 691 808"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">E-mail</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="jan.kowalski@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Rodzaj usługi *</label>
                  <select
                    required
                    value={formData.service}
                    onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option>Instalacje wodno-kanalizacyjne</option>
                    <option>Instalacje gazowe</option>
                    <option>Ogrzewanie podłogowe</option>
                    <option>Modernizacja kotłowni</option>
                    <option>Montaż nowych kotłowni</option>
                    <option>Serwis piecy gazowych</option>
                    <option>Przegląd instalacji gazowych</option>
                    <option>Montaż przydomowych oczyszczalni</option>
                    <option>Usługi minikoparką</option>
                    <option>Inne</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Opis problemu/zlecenia</label>
                  <textarea
                    rows={4}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="Opisz czego potrzebujesz..."
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setStep('time')}
                    className="flex-1 px-6 py-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-bold rounded-lg transition-colors"
                  >
                    ← Wróć
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-green-600 to-orange-600 hover:from-green-700 hover:to-orange-700 text-white font-bold rounded-lg transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105"
                  >
                    Potwierdź rezerwację
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Success Screen with Calendar Integration */}
          {step === 'success' && bookingSuccess && (
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 rounded-2xl shadow-2xl p-8 border-2 border-green-500/20">
              <div className="text-center mb-8">
                {/* Success Icon */}
                <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                  <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                
                <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  ✅ Rezerwacja potwierdzona!
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Dziękujemy! Potwierdzenie zostało wysłane na email i SMS.
                </p>
              </div>

              {/* Booking Details */}
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 mb-6 border border-gray-200 dark:border-gray-700">
                <h4 className="font-bold text-lg text-gray-900 dark:text-white mb-4">
                  Szczegóły wizyty:
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Data i godzina</p>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {bookingSuccess.date.toLocaleDateString('pl-PL', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} o {bookingSuccess.time}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Usługa</p>
                      <p className="font-semibold text-gray-900 dark:text-white">{bookingSuccess.service}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Klient</p>
                      <p className="font-semibold text-gray-900 dark:text-white">{bookingSuccess.name}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{bookingSuccess.phone}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Add to Calendar Button */}
              <div className="mb-6">
                <AddToCalendarButton
                  date={bookingSuccess.date.toISOString().split('T')[0]}
                  time={bookingSuccess.time}
                  service={bookingSuccess.service}
                  customerName={bookingSuccess.name}
                  phone={bookingSuccess.phone}
                  description={bookingSuccess.description}
                  className="w-full justify-center"
                />
              </div>

              {/* Additional Info */}
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 border border-blue-200 dark:border-blue-800 mb-6">
                <div className="flex gap-3">
                  <svg className="w-6 h-6 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div className="text-sm text-gray-700 dark:text-gray-300">
                    <p className="font-semibold mb-1">Ważne informacje:</p>
                    <ul className="space-y-1 list-disc list-inside">
                      <li>Potwierdz termination wysłaliśmy na podany adres email</li>
                      <li>Skontaktujemy się z Tobą dzień przed wizytą</li>
                      <li>W razie pytań zadzwoń: <strong>+48 503 691 808</strong></li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={handleResetBooking}
                  className="flex-1 px-6 py-3 bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-semibold rounded-xl transition-colors"
                >
                  Umów kolejną wizytę
                </button>
                <a
                  href="/"
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold rounded-xl transition-all text-center"
                >
                  Powrót do strony głównej
                </a>
              </div>
            </div>
          )}

          {step === 'date' && !selectedDate && (
            <div className="bg-gradient-to-br from-green-50 to-white dark:from-green-950/20 dark:to-gray-800 rounded-2xl shadow-lg p-8 text-center border border-green-200 dark:border-green-800">
              <div className="text-6xl mb-4">📅</div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Umów wizytę online</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Wybierz dogodny termin z kalendarza. Potwierdzimy rezerwację SMS-em i e-mailem.
              </p>
              <div className="space-y-3 text-left">
                <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                  <div>
                    <p className="font-semibold">Godziny pracy:</p>
                    <p className="text-sm">Pon-Pt: 8:00-18:00, Sob: 9:00-14:00</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                  <div>
                    <p className="font-semibold">Awarie 24/7:</p>
                    <p className="text-sm">W nagłych przypadkach zadzwoń: +48 503 691 808</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
