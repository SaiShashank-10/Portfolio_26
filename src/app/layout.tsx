import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { PROFILE } from "@/lib/data";
import { withBasePath } from "@/lib/basePath";
import "./globals.css";

const inter = localFont({
  src: "../fonts/inter-tight-latin-wght-normal.woff2",
  variable: "--font-inter",
  display: "swap",
  weight: "100 900",
});
const serif = localFont({
  src: [
    {
      path: "../fonts/instrument-serif-latin-400-normal.woff2",
      style: "normal",
    },
    {
      path: "../fonts/instrument-serif-latin-400-italic.woff2",
      style: "italic",
    },
  ],
  variable: "--font-serif",
  display: "swap",
  weight: "400",
});
const mono = localFont({
  src: "../fonts/jetbrains-mono-latin-wght-normal.woff2",
  variable: "--font-mono",
  display: "swap",
  weight: "100 800",
  preload: false,
});
export const metadata: Metadata = {
  title: `${PROFILE.name} — ${PROFILE.role}`,
  description: `${PROFILE.degree} at ${PROFILE.institute}. DevPool, Gen-Lib, PixelPulse, Nethra and Hotel Management System.`,
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? PROFILE.website),
  openGraph: {
    title: PROFILE.name,
    description: PROFILE.role,
    type: "website",
    images: [
      {
        url: withBasePath("/og.jpg"),
        width: 1200,
        height: 630,
        alt: PROFILE.name,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: PROFILE.name,
    images: [withBasePath("/og.jpg")],
  },
  icons: { icon: withBasePath("/favicon.svg") },
};
export const viewport: Viewport = {
  themeColor: "#f4f2ee",
  width: "device-width",
  initialScale: 1,
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${serif.variable} ${mono.variable}`}
    >
      <head>
        <link
          rel="preload"
          href={withBasePath("/hero/poster.webp")}
          as="image"
          fetchPriority="high"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
