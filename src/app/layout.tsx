import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { CSPostHogProvider } from "./providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "mars grid 🧑🏼‍🚀",
  description: "Immaculate Grid meets the Terraforming Mars board game.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* eslint-disable-next-line */}
        <link
          href="https://fonts.googleapis.com/css?family=Ubuntu&display=swap"
          rel="stylesheet"
        />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
      </head>
      <CSPostHogProvider>
        <body className={inter.className}> {children}</body>
      </CSPostHogProvider>
    </html>
  );
}
