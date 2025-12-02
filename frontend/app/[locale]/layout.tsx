import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import '../globals.css';

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
    <html lang={locale}>
      <body>
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
