import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';

const inter = Inter({ subsets: ['latin'], display: 'swap', });

export const metadata: Metadata = {
  title: 'LinkPro - Bio Link Intelligent pour Vendeurs Camerounais',
  description: 'Transformez votre lien bio en machine à vendre. Catalogue produits, tracking analytics, intégration WhatsApp. Gratuit jusqu\'à 10 produits.',
  keywords: ['linkpro', 'bio link', 'cameroun', 'vente en ligne', 'whatsapp business', 'tiktok', 'instagram'],
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: 'https://linkpro.cm',
    siteName: 'LinkPro',
    title: 'LinkPro - Bio Link Intelligent',
    description: 'Transformez votre lien bio en machine à vendre',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
