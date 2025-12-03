'use client';

import { useState } from 'react';

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
  const [step, setStep] = useState<'date' | 'time' | 'form'>('date');
  
  // Form data
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    service: 'Instalacje wodne',
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
      const response = await fetch('/appointments/api/book', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData),
      });
      
      const result = await response.json();
      
      if (response.ok && result.success) {
        // Success!
        alert(`✅ Rezerwacja potwierdzona!\n\n${result.message}\n\nData: ${selectedDate.toLocaleDateString('pl-PL')}\nGodzina: ${selectedTime}\nImię: ${formData.name}\nTelefon: ${formData.phone}\n\nPotwierdzenie zostało wysłane SMS-em i e-mailem.`);
        
        if (onBookingComplete) {
          onBookingComplete({
            date: selectedDate,
            time: selectedTime,
            ...formData,
          });
        }
        
        // Reset form
        setStep('date');
        setSelectedDate(null);
        setSelectedTime(null);
        setFormData({
          name: '',
          phone: '',
          email: '',
          service: 'Instalacje wodne',
          description: '',
        });
      } else {
        throw new Error(result.message || 'Wystąpił błąd podczas rezerwacji');
      }
    } catch (error) {
      console.error('Booking error:', error);
      alert(`❌ Nie udało się utworzyć rezerwacji.\n\nProsimy spróbować ponownie lub skontaktować się telefonicznie: +48 503 691 808`);
    }
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
          <div className={`flex items-center gap-2 ${step === 'date' ? 'text-blue-600 font-bold' : step === 'time' || step === 'form' ? 'text-green-600' : 'text-gray-400'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === 'date' ? 'bg-blue-600 text-white' : step === 'time' || step === 'form' ? 'bg-green-600 text-white' : 'bg-gray-300'}`}>
              1
            </div>
            <span>Wybierz datę</span>
          </div>
          <div className="w-12 h-0.5 bg-gray-300" />
          <div className={`flex items-center gap-2 ${step === 'time' ? 'text-blue-600 font-bold' : step === 'form' ? 'text-green-600' : 'text-gray-400'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === 'time' ? 'bg-blue-600 text-white' : step === 'form' ? 'bg-green-600 text-white' : 'bg-gray-300'}`}>
              2
            </div>
            <span>Wybierz godzinę</span>
          </div>
          <div className="w-12 h-0.5 bg-gray-300" />
          <div className={`flex items-center gap-2 ${step === 'form' ? 'text-blue-600 font-bold' : 'text-gray-400'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === 'form' ? 'bg-blue-600 text-white' : 'bg-gray-300'}`}>
              3
            </div>
            <span>Dane kontaktowe</span>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Calendar Section */}
        <div className={`bg-white rounded-2xl shadow-lg p-6 ${step === 'date' ? 'ring-2 ring-blue-500' : ''}`}>
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={handlePrevMonth}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              ←
            </button>
            <h3 className="text-xl font-bold text-gray-900">
              {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
            </h3>
            <button
              onClick={handleNextMonth}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              →
            </button>
          </div>

          {/* Day names */}
          <div className="grid grid-cols-7 gap-2 mb-2">
            {dayNames.map(day => (
              <div key={day} className="text-center text-sm font-semibold text-gray-600 py-2">
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
                    ${isSelected ? 'bg-blue-600 text-white shadow-lg scale-110' : ''}
                    ${!isSelected && today ? 'bg-blue-100 text-blue-600 ring-2 ring-blue-300' : ''}
                    ${!isSelected && !today && !past && !isSunday ? 'bg-gray-50 hover:bg-blue-50 hover:text-blue-600' : ''}
                    ${past || isSunday ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'cursor-pointer'}
                  `}
                >
                  {date.getDate()}
                </button>
              );
            })}
          </div>

          <div className="mt-6 space-y-2 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-600 rounded" />
              <span>Data wybrana</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-100 ring-2 ring-blue-300 rounded" />
              <span>Dzisiaj</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-gray-100 rounded" />
              <span>Niedostępne</span>
            </div>
          </div>
        </div>

        {/* Time Slots / Form Section */}
        <div className="space-y-6">
          {step === 'time' && selectedDate && (
            <div className={`bg-white rounded-2xl shadow-lg p-6 ${step === 'time' ? 'ring-2 ring-blue-500' : ''}`}>
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Wybierz godzinę dla {selectedDate.toLocaleDateString('pl-PL')}
              </h3>
              
              <div className="grid grid-cols-3 gap-3 max-h-96 overflow-y-auto">
                {timeSlots.map((slot) => (
                  <button
                    key={slot.time}
                    onClick={() => slot.available && handleTimeSelect(slot.time)}
                    disabled={!slot.available}
                    className={`p-3 rounded-lg text-sm font-medium transition-all duration-200
                      ${selectedTime === slot.time ? 'bg-blue-600 text-white shadow-lg scale-105' : ''}
                      ${selectedTime !== slot.time && slot.available ? 'bg-green-50 text-green-700 hover:bg-green-100 border-2 border-green-200' : ''}
                      ${!slot.available ? 'bg-gray-100 text-gray-400 cursor-not-allowed line-through' : 'cursor-pointer'}
                    `}
                  >
                    {slot.time}
                  </button>
                ))}
              </div>

              <div className="mt-6 flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-green-50 border-2 border-green-200 rounded" />
                  <span className="text-gray-600">Dostępne</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-gray-100 rounded" />
                  <span className="text-gray-600">Zajęte</span>
                </div>
              </div>

              <button
                onClick={() => setStep('date')}
                className="mt-4 w-full px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition-colors"
              >
                ← Wróć do kalendarza
              </button>
            </div>
          )}

          {step === 'form' && selectedDate && selectedTime && (
            <div className="bg-white rounded-2xl shadow-lg p-6 ring-2 ring-blue-500">
              <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                <h3 className="text-lg font-bold text-gray-900 mb-2">Podsumowanie rezerwacji</h3>
                <p className="text-gray-700">📅 Data: {selectedDate.toLocaleDateString('pl-PL')}</p>
                <p className="text-gray-700">🕐 Godzina: {selectedTime}</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Imię i nazwisko *</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Jan Kowalski"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Telefon *</label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="+48 503 691 808"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">E-mail</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="jan.kowalski@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Rodzaj usługi *</label>
                  <select
                    required
                    value={formData.service}
                    onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option>Instalacje wodne</option>
                    <option>Remont łazienki</option>
                    <option>Awaria</option>
                    <option>Konserwacja</option>
                    <option>Wycena</option>
                    <option>Inne</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Opis problemu/zlecenia</label>
                  <textarea
                    rows={4}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Opisz czego potrzebujesz..."
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setStep('time')}
                    className="flex-1 px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold rounded-lg transition-colors"
                  >
                    ← Wróć
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold rounded-lg transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105"
                  >
                    Potwierdź rezerwację
                  </button>
                </div>
              </form>
            </div>
          )}

          {step === 'date' && !selectedDate && (
            <div className="bg-gradient-to-br from-blue-50 to-white rounded-2xl shadow-lg p-8 text-center">
              <div className="text-6xl mb-4">📅</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Umów wizytę online</h3>
              <p className="text-gray-600 mb-6">
                Wybierz dogodny termin z kalendarza. Potwierdzimy rezerwację SMS-em i e-mailem.
              </p>
              <div className="space-y-3 text-left">
                <div className="flex items-center gap-3 text-gray-700">
                  <div>
                    <p className="font-semibold">Godziny pracy:</p>
                    <p className="text-sm">Pon-Pt: 8:00-18:00, Sob: 9:00-14:00</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-gray-700">
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
