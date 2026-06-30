import type { Metadata } from "next";
import { Space_Grotesk, Inter, Geist_Mono, Bayon } from "next/font/google";
import localFont from "next/font/local";
import Navbar from "@/components/Navbar";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

const bayon = Bayon({
  variable: "--font-bayon",
  weight: "400",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

const neueMontreal = localFont({
  src: [
    {
      path: "../public/fonts/neue-montreal/NeueMontreal-Regular.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/neue-montreal/NeueMontreal-Medium.otf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../public/fonts/neue-montreal/NeueMontreal-Bold.otf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../public/fonts/neue-montreal/NeueMontreal-Italic.otf",
      weight: "400",
      style: "italic",
    },
  ],
  variable: "--font-neue-montreal",
});

export const metadata: Metadata = {
  title: "FIXMI — Smart Device Repair Service",
  description:
    "Layanan perbaikan perangkat pintar terpercaya untuk iPhone, iPad, dan Android. Kualitas premium, harga transparan.",
  keywords: ["repair", "service", "iPhone", "iPad", "Android", "FIXMI"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${spaceGrotesk.variable} ${inter.variable} ${geistMono.variable} ${neueMontreal.variable} ${bayon.variable} h-full antialiased`}
      data-scroll-behavior="smooth"
    >
      <head>
        <link rel="preload" href="/sequence/frame_000000.jpg" as="image" />
        <link rel="preload" href="/sequence/frame_000001.jpg" as="image" />
        <link rel="preload" href="/sequence/frame_000002.jpg" as="image" />
      </head>
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <Navbar />
        <main className="flex-1">{children}</main>
      </body>
    </html>
  );
}
