import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { Plus_Jakarta_Sans, Montserrat } from 'next/font/google';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import FloatingAdminButton from '@/components/FloatingAdminButton';
import { ThemeProvider } from '@/contexts/ThemeContext';
import '../globals.css';

// Professional, modern sans-serif for body text - Plus Jakarta Sans
const jakartaSans = Plus_Jakarta_Sans({ 
  subsets: ['latin', 'latin-ext'],
  variable: '--font-jakarta',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700', '800'],
});

// Bold, impactful sans-serif for headings - Montserrat
const montserrat = Montserrat({ 
  weight: ['500', '600', '700', '800', '900'],
  subsets: ['latin', 'latin-ext'],
  variable: '--font-montserrat',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'SanBud Hydraulika - Hydraulika naszą pasją',
  description: 'Profesjonalne usługi hydrauliczne w Polsce. Założona w 2018 roku. Fachowość • Rzetelność • Terminowość',
  keywords: 'hydraulik, usługi hydrauliczne, instalacje, awarie, pogotowie hydrauliczne, SanBud',
};

const locales = ['pl', 'en'];

export default async function RootLayout({
  children,
  params: { locale }
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  // Validate locale
  if (!locales.includes(locale)) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html lang={locale} className={`${jakartaSans.variable} ${montserrat.variable}`}>
      <body className={jakartaSans.className}>
        <ThemeProvider>
          <NextIntlClientProvider messages={messages}>
            <Navigation />
            {children}
            <Footer />
            <FloatingAdminButton />
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
