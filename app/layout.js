import DotBackground from "@/components/layout/DotBackground";
import "./globals.css";
import { JetBrains_Mono } from "next/font/google";

const jetBrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
});

export const metadata = {
  title: "CouponStall - Your Ultimate Coupon & Deals Destination",
  description: "Find the best deals, discounts, and coupons for your favorite stores. Save money with CouponStall's verified offers and exclusive deals.",
  keywords: "coupons, deals, discounts, savings, promo codes, online shopping, retail deals",
  authors: [{ name: "CouponStall Team" }],
  creator: "CouponStall",
  publisher: "CouponStall",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://couponstall.com'),
  openGraph: {
    title: "CouponStall - Your Ultimate Coupon & Deals Destination",
    description: "Find the best deals, discounts, and coupons for your favorite stores. Save money with CouponStall's verified offers and exclusive deals.",
    url: 'https://couponstall.com',
    siteName: 'CouponStall',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'CouponStall - Your Ultimate Coupon & Deals Destination',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "CouponStall - Your Ultimate Coupon & Deals Destination",
    description: "Find the best deals, discounts, and coupons for your favorite stores. Save money with CouponStall's verified offers and exclusive deals.",
    images: ['/twitter-image.jpg'],
    creator: '@couponstall',
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
    title: 'CouponStall'
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
        <meta name="theme-color" content="#000000" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="CouponStall" />
      </head>
      <body className={`${jetBrainsMono.variable} antialiased`}>
        <DotBackground>
          {children}
        </DotBackground>
      </body>
    </html>
  );
}
