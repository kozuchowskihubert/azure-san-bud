/**
 * Enhanced Calendar utilities with appointment booking support
 */

export interface AppointmentData {
  title: string;
  description?: string;
  startDate: Date;
  endDate: Date;
  location?: string;
  organizer?: {
    name: string;
    email: string;
  };
  attendee?: {
    name: string;
    email: string;
  };
}

/**
 * Generate Google Calendar URL for appointments
 */
export const generateGoogleCalendarUrl = (appointment: AppointmentData): string => {
  const formatDate = (date: Date) => {
    return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  };

  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: appointment.title,
    dates: `${formatDate(appointment.startDate)}/${formatDate(appointment.endDate)}`,
    details: appointment.description || '',
    location: appointment.location || '',
    organizer: appointment.organizer?.email || '',
    attendees: appointment.attendee?.email || ''
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
};

/**
 * Generate iCal content for appointments (.ics file)
 */
export const generateAppointmentICalContent = (appointment: AppointmentData): string => {
  const formatDate = (date: Date) => {
    return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  };

  const now = new Date();
  const uid = `appointment-${Date.now()}@sanbud.pl`;

  let icalContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//SanBud//Appointment Calendar//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `DTSTAMP:${formatDate(now)}`,
    `DTSTART:${formatDate(appointment.startDate)}`,
    `DTEND:${formatDate(appointment.endDate)}`,
    `SUMMARY:${appointment.title}`,
  ];

  if (appointment.description) {
    icalContent.push(`DESCRIPTION:${appointment.description}`);
  }

  if (appointment.location) {
    icalContent.push(`LOCATION:${appointment.location}`);
  }

  if (appointment.organizer) {
    icalContent.push(`ORGANIZER;CN=${appointment.organizer.name}:MAILTO:${appointment.organizer.email}`);
  }

  if (appointment.attendee) {
    icalContent.push(`ATTENDEE;CN=${appointment.attendee.name}:MAILTO:${appointment.attendee.email}`);
  }

  // Add reminder 1 hour before
  icalContent.push(
    'BEGIN:VALARM',
    'TRIGGER:-PT1H',
    'ACTION:DISPLAY',
    'DESCRIPTION:Przypomnienie o wizycie SanBud za godzinę',
    'END:VALARM',
    'STATUS:CONFIRMED',
    'SEQUENCE:0',
    'END:VEVENT',
    'END:VCALENDAR'
  );

  return icalContent.join('\r\n');
};

/**
 * Download iCal file for appointments
 */
export const downloadAppointmentICalFile = (appointment: AppointmentData): void => {
  const icalContent = generateAppointmentICalContent(appointment);
  const blob = new Blob([icalContent], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = `sanbud-appointment-${appointment.startDate.toISOString().split('T')[0]}.ics`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/**
 * Generate Outlook Calendar URL
 */
export const generateOutlookCalendarUrl = (appointment: AppointmentData): string => {
  const formatDate = (date: Date) => {
    return date.toISOString();
  };

  const params = new URLSearchParams({
    path: '/calendar/action/compose',
    rru: 'addevent',
    subject: appointment.title,
    startdt: formatDate(appointment.startDate),
    enddt: formatDate(appointment.endDate),
    body: appointment.description || '',
    location: appointment.location || ''
  });

  return `https://outlook.live.com/calendar/0/deeplink/compose?${params.toString()}`;
};

/**
 * Generate Office 365 Calendar URL
 */
export const generateOffice365CalendarUrl = (appointment: AppointmentData): string => {
  const formatDate = (date: Date) => {
    return date.toISOString();
  };

  const params = new URLSearchParams({
    subject: appointment.title,
    startdt: formatDate(appointment.startDate),
    enddt: formatDate(appointment.endDate),
    body: appointment.description || '',
    location: appointment.location || ''
  });

  return `https://outlook.office.com/calendar/0/deeplink/compose?${params.toString()}`;
};

/**
 * Auto-detect user's preferred calendar platform
 */
export const getPreferredCalendar = (): string => {
  const userAgent = navigator.userAgent.toLowerCase();
  
  if (/iphone|ipad|ipod|mac/.test(userAgent)) {
    return 'apple';
  }
  if (/android/.test(userAgent)) {
    return 'google';
  }
  if (/windows/.test(userAgent)) {
    return 'outlook';
  }
  
  return 'google'; // default
};

/**
 * Create appointment from booking data
 */
export const createAppointmentFromBooking = (bookingData: {
  service: string;
  date: string;
  time: string;
  duration?: number;
  customerName: string;
  customerEmail?: string;
  address?: string;
  description?: string;
}): AppointmentData => {
  const startDate = new Date(`${bookingData.date}T${bookingData.time}`);
  const duration = bookingData.duration || 60; // default 1 hour
  const endDate = new Date(startDate.getTime() + (duration * 60 * 1000));

  return {
    title: `🔧 SanBud - ${bookingData.service}`,
    description: [
      `Wizyta hydrauliczna - ${bookingData.service}`,
      bookingData.description ? `\nOpis: ${bookingData.description}` : '',
      `\nKlient: ${bookingData.customerName}`,
      bookingData.customerEmail ? `Email: ${bookingData.customerEmail}` : '',
      '\n📞 Kontakt: +48 503 691 808',
      '🌐 www.sanbud24.pl'
    ].filter(Boolean).join('\n'),
    startDate,
    endDate,
    location: bookingData.address || 'Do uzgodnienia',
    organizer: {
      name: 'SanBud - Hydraulika',
      email: 'hubertkozuchowski1337@gmail.com'
    },
    attendee: bookingData.customerEmail ? {
      name: bookingData.customerName,
      email: bookingData.customerEmail
    } : undefined
  };
};

/**
 * Add event to calendar with auto-platform detection
 */
export const addAppointmentToCalendar = (appointment: AppointmentData, platform?: string): void => {
  const selectedPlatform = platform || getPreferredCalendar();

  switch (selectedPlatform) {
    case 'google':
      window.open(generateGoogleCalendarUrl(appointment), '_blank');
      break;
    case 'outlook':
      window.open(generateOutlookCalendarUrl(appointment), '_blank');
      break;
    case 'office365':
      window.open(generateOffice365CalendarUrl(appointment), '_blank');
      break;
    case 'apple':
    default:
      downloadAppointmentICalFile(appointment);
      break;
  }
};

// Legacy support - keep existing functions for backward compatibility
export const generateICalContent = (eventData: any): string => {
  const appointment: AppointmentData = {
    title: eventData.title || 'Event',
    description: eventData.description,
    startDate: new Date(eventData.startDate),
    endDate: new Date(eventData.endDate),
    location: eventData.location,
  };
  return generateAppointmentICalContent(appointment);
};

export const downloadICalFile = (eventData: any): void => {
  const appointment: AppointmentData = {
    title: eventData.title || 'Event',
    description: eventData.description,
    startDate: new Date(eventData.startDate),
    endDate: new Date(eventData.endDate),
    location: eventData.location,
  };
  downloadAppointmentICalFile(appointment);
};

export const createCalendarEventFromBooking = createAppointmentFromBooking;