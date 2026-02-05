import DotBackground from "@/components/layout/DotBackground";
import "./globals.css";
import { JetBrains_Mono } from "next/font/google";

const jetBrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
});

export const metadata = {
  title: "LocalGrow - Your Ultimate Coupon & Deals Destination",
  description: "Find the best deals, discounts, and coupons for your favorite stores. Save money with LocalGrow's verified offers and exclusive deals.",
  keywords: "coupons, deals, discounts, savings, promo codes, online shopping, retail deals",
  authors: [{ name: "LocalGrow Team" }],
  creator: "LocalGrow",
  publisher: "LocalGrow",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://LocalGrow.com'),
  openGraph: {
    title: "LocalGrow - Your Ultimate Coupon & Deals Destination",
    description: "Find the best deals, discounts, and coupons for your favorite stores. Save money with LocalGrow's verified offers and exclusive deals.",
    url: 'https://LocalGrow.com',
    siteName: 'LocalGrow',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'LocalGrow - Your Ultimate Coupon & Deals Destination',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "LocalGrow - Your Ultimate Coupon & Deals Destination",
    description: "Find the best deals, discounts, and coupons for your favorite stores. Save money with LocalGrow's verified offers and exclusive deals.",
    images: ['/twitter-image.jpg'],
    creator: '@LocalGrow',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-site-verification',
    yandex: 'your-yandex-verification',
    bing: 'your-bing-verification',
  },
  manifest: '/manifest.json',
  themeColor: '#000000',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'LocalGrow'
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  },
  icons: {
    icon: '/icons/icon-192x192.png',
    shortcut: '/icons/icon-192x192.png',
    apple: '/icons/icon-192x192.png',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <meta name="theme-color" content="#ffffff" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-navbutton-color" content="#ffffff" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="apple-mobile-web-app-title" content="LocalGrow" />
      </head>
      <body className={`${jetBrainsMono.variable} antialiased`}>
        <DotBackground>
          {children}
        </DotBackground>
      </body>
    </html>
  );
}
