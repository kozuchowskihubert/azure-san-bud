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
  title: 'SanBud - Instalacje Sanitarne | Profesjonalne Usługi Hydrauliczne Mazowsze',
  description: 'Profesjonalne usługi hydrauliczne w województwie mazowieckim. 15 lat doświadczenia, 500+ zadowolonych klientów. Instalacje sanitarne, ogrzewanie, łazienki pod klucz. ☎️ 503 691 808',
  keywords: 'hydraulik warszawa, instalacje sanitarne mazowsze, ogrzewanie podłogowe, kotłownie, łazienki pod klucz, SanBud, hydraulik 24/7',
  authors: [{ name: 'SanBud - Instalacje Sanitarne' }],
  icons: {
    icon: [
      { url: '/images/logo.jpg', sizes: 'any' },
      { url: '/images/logo.jpg', sizes: '32x32', type: 'image/jpeg' },
      { url: '/images/logo.jpg', sizes: '16x16', type: 'image/jpeg' }
    ],
    apple: [
      { url: '/images/logo.jpg', sizes: '180x180', type: 'image/jpeg' }
    ],
    shortcut: '/images/logo.jpg'
  },
  openGraph: {
    title: 'SanBud - Profesjonalne Instalacje Sanitarne',
    description: '500+ zadowolonych klientów | 15 lat doświadczenia | Woj. Mazowieckie',
    url: 'https://sanbud24.pl',
    siteName: 'SanBud',
    locale: 'pl_PL',
    type: 'website',
    images: [
      {
        url: 'https://sanbud24.pl/images/logo.jpg',
        width: 1200,
        height: 630,
        alt: 'SanBud - Instalacje Sanitarne Logo'
      }
    ]
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: 'https://sanbud24.pl',
  }
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
