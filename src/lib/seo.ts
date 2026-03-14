import { Metadata } from 'next';

const APP_NAME = 'LinkPro';
const APP_DESCRIPTION = 'Turn your social feed into a mobile store. One link for all your products. Real-time analytics. WhatsApp built in. Made for sellers in Cameroon.';
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://linkpro.cm';

export const defaultMetadata: Metadata = {
  title: {
    default: `${APP_NAME} - Bio Link for Social Sellers`,
    template: `%s | ${APP_NAME}`,
  },
  description: APP_DESCRIPTION,
  keywords: ['bio link', 'social selling', 'cameroon', 'whatsapp', 'mobile commerce', 'instagram', 'tiktok'],
  authors: [{ name: 'LinkPro' }],
  creator: 'LinkPro',
  publisher: 'LinkPro',
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: '/favicon.ico',
  },
  metadataBase: new URL(APP_URL),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: APP_URL,
    title: APP_NAME,
    description: APP_DESCRIPTION,
    siteName: APP_NAME,
  },
  twitter: {
    card: 'summary_large_image',
    title: APP_NAME,
    description: APP_DESCRIPTION,
  },
};

export function generatePageMetadata({
  title,
  description,
  path = '',
}: {
  title: string;
  description?: string;
  path?: string;
}): Metadata {
  const url = `${APP_URL}${path}`;
  
  return {
    title,
    description: description || APP_DESCRIPTION,
    openGraph: {
      title,
      description: description || APP_DESCRIPTION,
      url,
    },
    twitter: {
      title,
      description: description || APP_DESCRIPTION,
    },
    alternates: {
      canonical: url,
    },
  };
}
