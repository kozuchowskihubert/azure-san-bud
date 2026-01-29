/**
 * Emergency Contact Types and Interfaces
 * Professional type definitions for emergency services
 */

/**
 * Urgency levels for emergency services
 */
export enum EmergencyUrgency {
  CRITICAL = 'critical',      // Immediate danger (water flooding, gas leak)
  URGENT = 'urgent',          // Requires same-day service (no heating, major leak)
  HIGH = 'high',              // Within 24 hours (blocked drains, boiler issues)
  STANDARD = 'standard'       // Scheduled service (maintenance, inspections)
}

/**
 * Response time in minutes
 */
export interface ResponseTime {
  min: number;
  max: number;
  unit: 'minutes' | 'hours';
}

/**
 * Emergency service category
 */
export interface EmergencyCategory {
  id: string;
  name: string;
  nameEn: string;
  icon: string;
  urgency: EmergencyUrgency;
  responseTime: ResponseTime;
  description: string;
  descriptionEn: string;
  examples: string[];
  examplesEn: string[];
  color: {
    primary: string;
    secondary: string;
    text: string;
  };
}

/**
 * Contact method
 */
export interface ContactMethod {
  type: 'phone' | 'email' | 'whatsapp' | 'facebook';
  value: string;
  label: string;
  labelEn: string;
  available: string;
  availableEn: string;
  icon: string;
  priority: number; // Lower number = higher priority
}

/**
 * Emergency contact information
 */
export interface EmergencyContact {
  hotline: ContactMethod;
  email: ContactMethod;
  whatsapp?: ContactMethod;
  socialMedia?: ContactMethod[];
}

/**
 * Service area information
 */
export interface ServiceArea {
  region: string;
  regionEn: string;
  cities: string[];
  citiesEn: string[];
  responseTimeModifier?: number; // Percentage modifier for response time
}

/**
 * Emergency statistics
 */
export interface EmergencyStats {
  averageResponseTime: number; // in minutes
  emergenciesHandled: number;
  customerSatisfaction: number; // percentage
  availabilityUptime: number; // percentage
}
