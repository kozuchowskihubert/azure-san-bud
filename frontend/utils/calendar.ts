/**
 * Calendar Integration Utilities
 * Generates calendar event links for Google Calendar, Apple Calendar, and Outlook
 */

export interface CalendarEvent {
  title: string;
  description: string;
  location: string;
  startDate: Date;
  endDate: Date;
  organizer?: string;
}

/**
 * Format date for calendar URLs (YYYYMMDDTHHmmssZ)
 */
function formatDateForCalendar(date: Date): string {
  return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
}

/**
 * Generate Google Calendar URL
 */
export function generateGoogleCalendarUrl(event: CalendarEvent): string {
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: event.title,
    details: event.description,
    location: event.location,
    dates: `${formatDateForCalendar(event.startDate)}/${formatDateForCalendar(event.endDate)}`,
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

/**
 * Generate Apple Calendar (iCal) content
 */
export function generateICalContent(event: CalendarEvent): string {
  const ical = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//SanBud//Booking System//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `DTSTART:${formatDateForCalendar(event.startDate)}`,
    `DTEND:${formatDateForCalendar(event.endDate)}`,
    `SUMMARY:${event.title}`,
    `DESCRIPTION:${event.description.replace(/\n/g, '\\n')}`,
    `LOCATION:${event.location}`,
    `UID:${Date.now()}@sanbud.pl`,
    'STATUS:CONFIRMED',
    'SEQUENCE:0',
    event.organizer ? `ORGANIZER;CN=SanBud:mailto:${event.organizer}` : '',
    'BEGIN:VALARM',
    'TRIGGER:-PT1H',
    'ACTION:DISPLAY',
    'DESCRIPTION:Przypomnienie: Wizyta hydraulika za 1 godzinę',
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR',
  ].filter(Boolean).join('\r\n');

  return ical;
}

/**
 * Generate Apple Calendar download link
 */
export function generateAppleCalendarUrl(event: CalendarEvent): string {
  const icalContent = generateICalContent(event);
  const blob = new Blob([icalContent], { type: 'text/calendar;charset=utf-8' });
  return URL.createObjectURL(blob);
}

/**
 * Download iCal file for Apple Calendar / Outlook
 */
export function downloadICalFile(event: CalendarEvent, filename: string = 'sanbud-appointment.ics'): void {
  const icalContent = generateICalContent(event);
  const blob = new Blob([icalContent], { type: 'text/calendar;charset=utf-8' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Generate Outlook.com Calendar URL
 */
export function generateOutlookCalendarUrl(event: CalendarEvent): string {
  const params = new URLSearchParams({
    path: '/calendar/action/compose',
    rru: 'addevent',
    subject: event.title,
    body: event.description,
    location: event.location,
    startdt: event.startDate.toISOString(),
    enddt: event.endDate.toISOString(),
  });

  return `https://outlook.live.com/calendar/0/deeplink/compose?${params.toString()}`;
}

/**
 * Generate Office 365 Calendar URL
 */
export function generateOffice365CalendarUrl(event: CalendarEvent): string {
  const params = new URLSearchParams({
    path: '/calendar/action/compose',
    rru: 'addevent',
    subject: event.title,
    body: event.description,
    location: event.location,
    startdt: event.startDate.toISOString(),
    enddt: event.endDate.toISOString(),
  });

  return `https://outlook.office.com/calendar/0/deeplink/compose?${params.toString()}`;
}

/**
 * Open calendar link in new window/tab
 */
export function openCalendarLink(url: string): void {
  window.open(url, '_blank', 'noopener,noreferrer');
}

/**
 * Detect user's device/OS to suggest appropriate calendar
 */
export function getPreferredCalendar(): 'google' | 'apple' | 'outlook' | 'office365' {
  const userAgent = navigator.userAgent.toLowerCase();
  
  if (/iphone|ipad|ipod/.test(userAgent)) {
    return 'apple';
  } else if (/android/.test(userAgent)) {
    return 'google';
  } else if (/windows/.test(userAgent)) {
    return 'outlook';
  } else if (/macintosh|mac os x/.test(userAgent)) {
    return 'apple';
  }
  
  return 'google'; // default
}

/**
 * Create calendar event from booking data
 */
export function createCalendarEventFromBooking(
  date: string,
  time: string,
  service: string,
  customerName: string,
  phone: string,
  description: string = ''
): CalendarEvent {
  // Parse date and time
  const [hours, minutes] = time.split(':').map(Number);
  const startDate = new Date(date);
  startDate.setHours(hours, minutes, 0, 0);
  
  // Default duration: 1 hour
  const endDate = new Date(startDate);
  endDate.setHours(startDate.getHours() + 1);
  
  return {
    title: `SanBud - ${service}`,
    description: `Wizyta hydraulika - ${service}\n\nKlient: ${customerName}\nTelefon: ${phone}\n\n${description}\n\nAdres: Mazowsze, Polska\nKontakt: +48 503 691 808\nEmail: sanbud.biuro@gmail.com`,
    location: 'Mazowsze, Polska',
    startDate,
    endDate,
    organizer: 'sanbud.biuro@gmail.com',
  };
}
