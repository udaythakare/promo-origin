import DotBackground from "@/components/layout/DotBackground";
import "./globals.css";
import { JetBrains_Mono } from "next/font/google";

const jetBrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
});

export const metadata = {
  title: "Your App",
  description: "Using JetBrains Mono as default font",
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
