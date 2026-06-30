import { Inter, Outfit, JetBrains_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const metadata = {
  title: "SportsFlix - Live Sports Streaming",
  description: "Netflix-style dashboard for indexing and streaming live sports matches.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable} ${jetbrainsMono.variable}`}>
      <body>
        {children}
        {/* Lazy load Iconify icons globally */}
        <Script 
          src="https://code.iconify.design/iconify-icon/2.1.0/iconify-icon.min.js" 
          strategy="lazyOnload"
        />
      </body>
    </html>
  );
}
