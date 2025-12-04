'use client';

import { useLocale } from 'next-intl';
import HeroSection from '@/components/modern/HeroSection';
import ServicesShowcase from '@/components/modern/ServicesShowcase';
import BookingCalendar from '@/components/BookingCalendar';
import WhyChooseUsSection from '@/components/modern/WhyChooseUsSection';
import GoogleReviewsSection from '@/components/modern/GoogleReviewsSection';
import PartnersSlider from '@/components/PartnersSlider';
import ContactSection from '@/components/modern/ContactSection';

export default function HomePage() {
  const locale = useLocale() as 'pl' | 'en';

  return (
    <div className="min-h-screen bg-white">
      {/* Schema.org structured data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            "name": "SanBud - Instalacje Sanitarne",
            "image": "https://sanbud24.pl/images/logo.jpg",
            "description": "Profesjonalne usługi hydrauliczne, instalacje sanitarne, ogrzewanie i klimatyzacja w województwie mazowieckim. 15 lat doświadczenia, 500+ zadowolonych klientów.",
            "address": {
              "@type": "PostalAddress",
              "streetAddress": "ul. Dalii 8",
              "addressLocality": "Płońsk",
              "postalCode": "09-100",
              "addressRegion": "Mazowieckie",
              "addressCountry": "PL"
            },
            "geo": {
              "@type": "GeoCoordinates",
              "latitude": "52.2297",
              "longitude": "21.0122"
            },
            "telephone": "+48503691808",
            "email": "sanbud.biuro@gmail.com",
            "url": "https://sanbud24.pl",
            "openingHoursSpecification": [
              {
                "@type": "OpeningHoursSpecification",
                "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
                "opens": "08:00",
                "closes": "18:00"
              },
              {
                "@type": "OpeningHoursSpecification",
                "dayOfWeek": "Saturday",
                "opens": "09:00",
                "closes": "14:00"
              }
            ],
            "priceRange": "$$",
            "areaServed": {
              "@type": "State",
              "name": "Mazowieckie"
            },
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "5.0",
              "reviewCount": "120"
            }
          })
        }}
      />
      
      <HeroSection locale={locale} />
      <ServicesShowcase locale={locale} />
      <BookingCalendar />
      <WhyChooseUsSection locale={locale} />
      <GoogleReviewsSection maxReviews={6} />
      <PartnersSlider />
      <ContactSection locale={locale} />
    </div>
  );
}
