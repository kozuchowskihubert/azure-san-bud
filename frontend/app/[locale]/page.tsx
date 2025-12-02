import Hero from '@/components/Hero';
import Services from '@/components/Services';
import Benefits from '@/components/Benefits';
import Process from '@/components/Process';
import Stats from '@/components/Stats';
import BookingSection from '@/components/BookingSection';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <Navigation />
      <Hero />
      <Benefits />
      <Services />
      <Process />
      <Stats />
      <BookingSection />
      <Footer />
    </main>
  );
}
