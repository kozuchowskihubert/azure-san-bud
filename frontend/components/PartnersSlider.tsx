'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

interface Partner {
  id: number;
  name: string;
  logo: string;
  website?: string;
}

// Znane firmy z branży sanitarnej i budowlanej w Polsce
const PARTNER_BRANDS = [
  { name: 'Geberit', domain: 'geberit.pl' },
  { name: 'Grohe', domain: 'grohe.pl' },
  { name: 'Viega', domain: 'viega.pl' },
  { name: 'Vaillant', domain: 'vaillant.pl' },
  { name: 'Bosch Termotechnika', domain: 'bosch-thermotechnology.com' },
  { name: 'Junkers', domain: 'junkers.com' },
  { name: 'Roca', domain: 'roca.pl' },
  { name: 'Koło', domain: 'kolo.com.pl' },
  { name: 'Cersanit', domain: 'cersanit.com' },
  { name: 'Purmo', domain: 'purmo.com' },
  { name: 'Grundfos', domain: 'grundfos.com' },
  { name: 'Wilo', domain: 'wilo.pl' },
];

export default function PartnersSlider() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Symulacja pobierania danych (w przyszłości z API)
    const fetchPartners = async () => {
      try {
        // Dla każdego partnera próbujemy pobrać logo przez Clearbit Logo API lub używamy fallback
        const partnersData = await Promise.all(
          PARTNER_BRANDS.map(async (brand, index) => {
            // Clearbit Logo API - darmowe loga firm po domenie
            const logoUrl = `https://logo.clearbit.com/${brand.domain}`;
            
            return {
              id: index + 1,
              name: brand.name,
              logo: logoUrl,
              website: `https://${brand.domain}`,
            };
          })
        );
        
        setPartners(partnersData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching partner logos:', error);
        setLoading(false);
      }
    };

    fetchPartners();
  }, []);

  if (loading) {
    return (
      <section className="py-12 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4">
          <h2 className="text-fluid-h2 font-bold text-center mb-8 text-gray-900 dark:text-white">
            Zaufani Partnerzy
          </h2>
          <div className="flex items-center justify-center gap-4">
            <div className="animate-pulse flex gap-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="w-32 h-20 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Duplikujemy partnerów dla seamless loop
  const duplicatedPartners = [...partners, ...partners, ...partners];

  return (
    <section className="py-16 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 overflow-hidden">
      <div className="container mx-auto px-4 mb-12">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-fluid-h2 font-bold mb-4 text-gray-900 dark:text-white">
            Zaufani Partnerzy
          </h2>
          <p className="text-fluid-lg text-gray-600 dark:text-gray-300">
            Współpracujemy z wiodącymi producentami urządzeń sanitarnych i grzewczych
          </p>
        </div>
      </div>

      {/* Slider Container */}
      <div className="relative">
        {/* Gradient overlays dla lepszego efektu */}
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-gray-50 to-transparent dark:from-gray-900 z-10 pointer-events-none"></div>
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-gray-50 to-transparent dark:from-gray-900 z-10 pointer-events-none"></div>

        {/* Scrolling Track */}
        <div className="partners-slider-track flex gap-8 items-center">
          {duplicatedPartners.map((partner, index) => (
            <div
              key={`${partner.id}-${index}`}
              className="partner-logo-item flex-shrink-0 group"
            >
              <a
                href={partner.website}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-40 h-24 bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-4 flex items-center justify-center group-hover:scale-105 border border-gray-100 dark:border-gray-700"
                title={partner.name}
              >
                <div className="relative w-full h-full">
                  <Image
                    src={partner.logo}
                    alt={`${partner.name} logo`}
                    fill
                    className="object-contain filter grayscale group-hover:grayscale-0 transition-all duration-300 opacity-70 group-hover:opacity-100"
                    onError={(e) => {
                      // Fallback jeśli logo się nie załaduje
                      const target = e.target as HTMLImageElement;
                      target.src = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='96' viewBox='0 0 160 96'%3E%3Crect width='160' height='96' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial' font-size='14' fill='%239ca3af'%3E${partner.name}%3C/text%3E%3C/svg%3E`;
                    }}
                  />
                </div>
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* CSS Animation - będzie w globals.css */}
      <style jsx>{`
        .partners-slider-track {
          animation: scroll-left 60s linear infinite;
          width: max-content;
        }

        .partners-slider-track:hover {
          animation-play-state: paused;
        }

        @keyframes scroll-left {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-33.333%);
          }
        }

        @media (max-width: 768px) {
          .partners-slider-track {
            animation-duration: 40s;
          }
          
          .partner-logo-item {
            width: 120px;
          }
        }

        @media (max-width: 480px) {
          .partners-slider-track {
            animation-duration: 30s;
          }
        }
      `}</style>
    </section>
  );
}
