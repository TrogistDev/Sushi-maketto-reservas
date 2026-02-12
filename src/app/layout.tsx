import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from 'react-hot-toast';
import localFont from "next/font/local";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Sushi Maketto Reservas",
  description: "Reserva tua mesa aqui.",
};
const realistWind = localFont({
  src: '../../public/fonts/RealistWind.otf', // Ajuste o caminho conforme sua pasta
  variable: '--font-realist-wind',
})
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${realistWind.variable} antialiased`}
      >
        <Toaster/>
        {children}
      </body>
    </html>
  );
}
