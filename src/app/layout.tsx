import type { Metadata } from "next";
import { Providers } from './providers';

export const metadata: Metadata = {
  title: "V0 MUI SDK Demo - Component Generator",
  description: "Demo: AI-powered MUI component generation with v0-sdk",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="emotion-insertion-point" content="" />
      </head>
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
