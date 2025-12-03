/**
 * Emergency Services Data
 * Comprehensive emergency contact and service information
 */

import {
  EmergencyCategory,
  EmergencyUrgency,
  EmergencyContact,
  ServiceArea,
  EmergencyStats,
  ContactMethod
} from '@/types/emergency';

/**
 * Main emergency hotline and contact methods
 */
export const EMERGENCY_CONTACTS: EmergencyContact = {
  hotline: {
    type: 'phone',
    value: '+48503691808',
    label: 'Linia alarmowa 24/7',
    labelEn: '24/7 Emergency Hotline',
    available: 'Całą dobę, 7 dni w tygodniu',
    availableEn: '24 hours, 7 days a week',
    icon: '📞',
    priority: 1
  },
  email: {
    type: 'email',
    value: 'sanbud.biuro@gmail.com',
    label: 'Email kontaktowy',
    labelEn: 'Contact Email',
    available: 'Odpowiedź w ciągu 1-2h',
    availableEn: 'Response within 1-2h',
    icon: '✉️',
    priority: 2
  },
  socialMedia: [
    {
      type: 'facebook',
      value: 'https://www.facebook.com/sanbud.hydraulika',
      label: 'Facebook Messenger',
      labelEn: 'Facebook Messenger',
      available: 'Pon-Pt 8:00-18:00',
      availableEn: 'Mon-Fri 8:00-18:00',
      icon: '💬',
      priority: 3
    }
  ]
};

/**
 * Emergency service categories with detailed information
 */
export const EMERGENCY_CATEGORIES: EmergencyCategory[] = [
  {
    id: 'flooding',
    name: 'Zalanie / Pęknięta rura',
    nameEn: 'Flooding / Burst Pipe',
    icon: '💧',
    urgency: EmergencyUrgency.CRITICAL,
    responseTime: { min: 30, max: 60, unit: 'minutes' },
    description: 'Natychmiastowa interwencja przy zalewaniu pomieszczeń',
    descriptionEn: 'Immediate intervention for flooding situations',
    examples: [
      'Pęknięta rura wodociągowa',
      'Nieszczelna instalacja pod ciśnieniem',
      'Zalanie piwnicy lub mieszkania',
      'Awaria głównego zaworu'
    ],
    examplesEn: [
      'Burst water pipe',
      'Leaking pressurized system',
      'Basement or apartment flooding',
      'Main valve failure'
    ],
    color: {
      primary: 'from-red-600 to-red-700',
      secondary: 'border-red-500',
      text: 'text-red-600 dark:text-red-400'
    }
  },
  {
    id: 'no-heating',
    name: 'Brak ogrzewania',
    nameEn: 'No Heating',
    icon: '🔥',
    urgency: EmergencyUrgency.URGENT,
    responseTime: { min: 2, max: 4, unit: 'hours' },
    description: 'Pilna naprawa systemu grzewczego',
    descriptionEn: 'Urgent heating system repair',
    examples: [
      'Awaria kotła grzewczego',
      'Zimne kaloryfery',
      'Nieszczelność w instalacji CO',
      'Brak ciepłej wody użytkowej'
    ],
    examplesEn: [
      'Boiler failure',
      'Cold radiators',
      'Central heating leak',
      'No hot water'
    ],
    color: {
      primary: 'from-orange-600 to-orange-700',
      secondary: 'border-orange-500',
      text: 'text-orange-600 dark:text-orange-400'
    }
  },
  {
    id: 'blocked-drain',
    name: 'Zatkana kanalizacja',
    nameEn: 'Blocked Drainage',
    icon: '🚽',
    urgency: EmergencyUrgency.URGENT,
    responseTime: { min: 3, max: 6, unit: 'hours' },
    description: 'Udrażnianie kanalizacji i rur spustowych',
    descriptionEn: 'Drain and sewer unblocking',
    examples: [
      'Zatkana toaleta',
      'Zapchany odpływ w wannie/umywalce',
      'Zablokowana rura kanalizacyjna',
      'Cofająca się woda'
    ],
    examplesEn: [
      'Blocked toilet',
      'Clogged bath/sink drain',
      'Blocked sewer pipe',
      'Backing up water'
    ],
    color: {
      primary: 'from-yellow-600 to-yellow-700',
      secondary: 'border-yellow-500',
      text: 'text-yellow-600 dark:text-yellow-500'
    }
  },
  {
    id: 'gas-leak',
    name: 'Wyciek gazu',
    nameEn: 'Gas Leak',
    icon: '⚠️',
    urgency: EmergencyUrgency.CRITICAL,
    responseTime: { min: 20, max: 45, unit: 'minutes' },
    description: 'NATYCHMIAST ewakuuj pomieszczenie i zadzwoń!',
    descriptionEn: 'IMMEDIATELY evacuate and call!',
    examples: [
      'Zapach gazu w pomieszczeniu',
      'Uszkodzony zawór gazowy',
      'Nieszczelna instalacja gazowa',
      'Podejrzenie wycieku'
    ],
    examplesEn: [
      'Gas smell in room',
      'Damaged gas valve',
      'Leaking gas installation',
      'Suspected leak'
    ],
    color: {
      primary: 'from-red-700 to-red-900',
      secondary: 'border-red-600',
      text: 'text-red-700 dark:text-red-500'
    }
  },
  {
    id: 'no-water',
    name: 'Brak wody',
    nameEn: 'No Water Supply',
    icon: '💦',
    urgency: EmergencyUrgency.HIGH,
    responseTime: { min: 4, max: 8, unit: 'hours' },
    description: 'Diagnostyka i naprawa instalacji wodociągowej',
    descriptionEn: 'Water supply diagnostics and repair',
    examples: [
      'Całkowity brak wody',
      'Niskie ciśnienie wody',
      'Zamarznięte rury',
      'Uszkodzony wodomierz'
    ],
    examplesEn: [
      'Complete water loss',
      'Low water pressure',
      'Frozen pipes',
      'Damaged water meter'
    ],
    color: {
      primary: 'from-blue-600 to-blue-700',
      secondary: 'border-blue-500',
      text: 'text-blue-600 dark:text-blue-400'
    }
  },
  {
    id: 'leak-repair',
    name: 'Naprawa nieszczelności',
    nameEn: 'Leak Repair',
    icon: '🔧',
    urgency: EmergencyUrgency.HIGH,
    responseTime: { min: 6, max: 12, unit: 'hours' },
    description: 'Lokalizacja i usunięcie wycieków',
    descriptionEn: 'Leak detection and repair',
    examples: [
      'Przeciekający kran',
      'Nieszczelne połączenia',
      'Wilgoć na ścianach',
      'Kapanie z armatury'
    ],
    examplesEn: [
      'Dripping tap',
      'Leaking connections',
      'Wall moisture',
      'Dripping fixtures'
    ],
    color: {
      primary: 'from-green-600 to-green-700',
      secondary: 'border-green-500',
      text: 'text-green-600 dark:text-green-400'
    }
  }
];

/**
 * Service areas with response time information
 */
export const SERVICE_AREAS: ServiceArea[] = [
  {
    region: 'Warszawa',
    regionEn: 'Warsaw',
    cities: ['Warszawa', 'Pruszków', 'Piaseczno', 'Ożarów Mazowiecki'],
    citiesEn: ['Warsaw', 'Pruszków', 'Piaseczno', 'Ożarów Mazowiecki'],
    responseTimeModifier: 1.0 // Standard response time
  },
  {
    region: 'Mazowsze Wschodnie',
    regionEn: 'Eastern Mazovia',
    cities: ['Mińsk Mazowiecki', 'Wołomin', 'Marki', 'Zielonka'],
    citiesEn: ['Mińsk Mazowiecki', 'Wołomin', 'Marki', 'Zielonka'],
    responseTimeModifier: 1.2
  },
  {
    region: 'Mazowsze Zachodnie',
    regionEn: 'Western Mazovia',
    cities: ['Błonie', 'Grodzisk Mazowiecki', 'Podkowa Leśna'],
    citiesEn: ['Błonie', 'Grodzisk Mazowiecki', 'Podkowa Leśna'],
    responseTimeModifier: 1.3
  }
];

/**
 * Emergency service statistics
 */
export const EMERGENCY_STATS: EmergencyStats = {
  averageResponseTime: 45, // minutes
  emergenciesHandled: 2847,
  customerSatisfaction: 98.5, // percentage
  availabilityUptime: 99.9 // percentage
};
