'use client';

import { useLocale } from 'next-intl';
import HeroSection from '@/components/modern/HeroSection';
import ServicesShowcase from '@/components/modern/ServicesShowcase';
import WhyChooseUsSection from '@/components/modern/WhyChooseUsSection';
import PartnersSlider from '@/components/PartnersSlider';
import ContactSection from '@/components/modern/ContactSection';

export default function HomePage() {
  const locale = useLocale() as 'pl' | 'en';

  return (
    <div className="min-h-screen bg-white">
      <HeroSection locale={locale} />
      <ServicesShowcase locale={locale} />
      <WhyChooseUsSection locale={locale} />
      <PartnersSlider />
      <ContactSection locale={locale} />
    </div>
  );
}
