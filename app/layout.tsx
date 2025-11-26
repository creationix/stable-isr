import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"
import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: "Next.js 16 ISR & Cache Demo",
  description: "A demo showcasing Next.js 16 features including Cache Components, ISR, and Partial Prerendering (PPR).",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
        <Analytics/>
        <SpeedInsights/>
      </body>
    </html>
  );
}
