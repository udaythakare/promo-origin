import DotBackground from "@/components/layout/DotBackground";
import "./globals.css";
import { JetBrains_Mono } from "next/font/google";

const jetBrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
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
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'LocalGrow'
  },
  icons: {
    icon: '/icons/icon-192x192.png',
    shortcut: '/icons/icon-192x192.png',
    apple: '/icons/icon-192x192.png',
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#000000',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${jetBrainsMono.variable} antialiased`}>
        <DotBackground>
          {children}
        </DotBackground>
      </body>
    </html>
  );
}
