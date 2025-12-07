import type { Metadata } from "next";
import "./globals.css";
import CreativeFooter from "@/components/CreativeFooter";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "3W Action Plan Tracker - What • Who • When",
  description: "A powerful project management tool focused on the 3W Framework: What needs to be done, Who is responsible, and When it's due.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans antialiased" suppressHydrationWarning>
        <Providers>
          {children}
          <CreativeFooter />
        </Providers>
      </body>
    </html>
  );
}
