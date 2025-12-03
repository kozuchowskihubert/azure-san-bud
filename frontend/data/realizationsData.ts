/**
 * Realizations Data - Map of completed projects
 * Data for SAN-BUD completed installations across Mazowsze region
 */

export interface Realization {
  id: string;
  city: string;
  cityEn: string;
  count: number;
  region: string;
  regionEn: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  services: string[];
  servicesEn: string[];
}

export const REALIZATIONS: Realization[] = [
  {
    id: 'warszawa',
    city: 'Warszawa',
    cityEn: 'Warsaw',
    count: 847,
    region: 'Mazowsze Centralne',
    regionEn: 'Central Mazovia',
    coordinates: { lat: 52.2297, lng: 21.0122 },
    services: [
      'Instalacje wodne',
      'Instalacje grzewcze',
      'Łazienki pod klucz',
      'Serwis awaryjny'
    ],
    servicesEn: [
      'Water installations',
      'Heating systems',
      'Turnkey bathrooms',
      'Emergency service'
    ]
  },
  {
    id: 'pruszkow',
    city: 'Pruszków',
    cityEn: 'Pruszków',
    count: 234,
    region: 'Mazowsze Zachodnie',
    regionEn: 'Western Mazovia',
    coordinates: { lat: 52.1700, lng: 20.8114 },
    services: [
      'Instalacje wodne',
      'Pompy ciepła',
      'Modernizacja systemów grzewczych'
    ],
    servicesEn: [
      'Water installations',
      'Heat pumps',
      'Heating system modernization'
    ]
  },
  {
    id: 'piaseczno',
    city: 'Piaseczno',
    cityEn: 'Piaseczno',
    count: 198,
    region: 'Mazowsze Południowe',
    regionEn: 'Southern Mazovia',
    coordinates: { lat: 52.0782, lng: 21.0264 },
    services: [
      'Łazienki pod klucz',
      'Instalacje sanitarne',
      'Systemy wentylacji'
    ],
    servicesEn: [
      'Turnkey bathrooms',
      'Sanitary installations',
      'Ventilation systems'
    ]
  },
  {
    id: 'ozarow',
    city: 'Ożarów Mazowiecki',
    cityEn: 'Ożarów Mazowiecki',
    count: 167,
    region: 'Mazowsze Zachodnie',
    regionEn: 'Western Mazovia',
    coordinates: { lat: 52.2214, lng: 20.8014 },
    services: [
      'Instalacje grzewcze',
      'Podłogówka',
      'Kotły kondensacyjne'
    ],
    servicesEn: [
      'Heating installations',
      'Underfloor heating',
      'Condensing boilers'
    ]
  },
  {
    id: 'minsk',
    city: 'Mińsk Mazowiecki',
    cityEn: 'Mińsk Mazowiecki',
    count: 143,
    region: 'Mazowsze Wschodnie',
    regionEn: 'Eastern Mazovia',
    coordinates: { lat: 52.1794, lng: 21.5697 },
    services: [
      'Instalacje wodne',
      'Kanalizacja',
      'Oczyszczalnie przydomowe'
    ],
    servicesEn: [
      'Water installations',
      'Sewerage',
      'Domestic sewage treatment plants'
    ]
  },
  {
    id: 'wolomin',
    city: 'Wołomin',
    cityEn: 'Wołomin',
    count: 129,
    region: 'Mazowsze Wschodnie',
    regionEn: 'Eastern Mazovia',
    coordinates: { lat: 52.3403, lng: 21.2422 },
    services: [
      'Instalacje sanitarne',
      'Modernizacje',
      'Serwis grzewczy'
    ],
    servicesEn: [
      'Sanitary installations',
      'Modernizations',
      'Heating service'
    ]
  },
  {
    id: 'grodzisk',
    city: 'Grodzisk Mazowiecki',
    cityEn: 'Grodzisk Mazowiecki',
    count: 115,
    region: 'Mazowsze Zachodnie',
    regionEn: 'Western Mazovia',
    coordinates: { lat: 52.1086, lng: 20.6297 },
    services: [
      'Instalacje grzewcze',
      'Łazienki',
      'Pompy cyrkulacyjne'
    ],
    servicesEn: [
      'Heating installations',
      'Bathrooms',
      'Circulation pumps'
    ]
  },
  {
    id: 'legionowo',
    city: 'Legionowo',
    cityEn: 'Legionowo',
    count: 98,
    region: 'Mazowsze Północne',
    regionEn: 'Northern Mazovia',
    coordinates: { lat: 52.4047, lng: 20.9436 },
    services: [
      'Instalacje wodne',
      'Ogrzewanie podłogowe',
      'Serwis 24/7'
    ],
    servicesEn: [
      'Water installations',
      'Underfloor heating',
      '24/7 Service'
    ]
  },
  {
    id: 'marki',
    city: 'Marki',
    cityEn: 'Marki',
    count: 87,
    region: 'Mazowsze Wschodnie',
    regionEn: 'Eastern Mazovia',
    coordinates: { lat: 52.3258, lng: 21.1006 },
    services: [
      'Modernizacja CO',
      'Instalacje sanitarne',
      'Awarie hydrauliczne'
    ],
    servicesEn: [
      'Central heating modernization',
      'Sanitary installations',
      'Plumbing emergencies'
    ]
  },
  {
    id: 'blonie',
    city: 'Błonie',
    cityEn: 'Błonie',
    count: 76,
    region: 'Mazowsze Zachodnie',
    regionEn: 'Western Mazovia',
    coordinates: { lat: 52.2031, lng: 20.6158 },
    services: [
      'Instalacje wodne',
      'Kotłownie',
      'Systemy filtracji'
    ],
    servicesEn: [
      'Water installations',
      'Boiler rooms',
      'Filtration systems'
    ]
  }
];

export const REGIONS_SUMMARY = {
  total: REALIZATIONS.reduce((sum, r) => sum + r.count, 0),
  cities: REALIZATIONS.length,
  regions: [...new Set(REALIZATIONS.map(r => r.region))].length
};

export const SERVICE_CATEGORIES = [
  {
    name: 'Instalacje Wodne',
    nameEn: 'Water Installations',
    count: REALIZATIONS.filter(r => r.services.some(s => s.includes('wodne'))).reduce((sum, r) => sum + r.count, 0)
  },
  {
    name: 'Instalacje Grzewcze',
    nameEn: 'Heating Systems',
    count: REALIZATIONS.filter(r => r.services.some(s => s.includes('grzew'))).reduce((sum, r) => sum + r.count, 0)
  },
  {
    name: 'Łazienki pod Klucz',
    nameEn: 'Turnkey Bathrooms',
    count: REALIZATIONS.filter(r => r.services.some(s => s.includes('Łazienki'))).reduce((sum, r) => sum + r.count, 0)
  },
  {
    name: 'Serwis i Awarie',
    nameEn: 'Service & Emergencies',
    count: REALIZATIONS.filter(r => r.services.some(s => s.includes('Serwis') || s.includes('Awarie'))).reduce((sum, r) => sum + r.count, 0)
  }
];
