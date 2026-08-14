import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { GlobalProviders } from "~/providers/global";
import { Navigation } from "~/components/navigation";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "FormBuilder - Create Beautiful Forms That Convert",
  description: "Build stunning, responsive forms with our drag-and-drop builder. Collect responses, analyze data, and grow your business — all in one place.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <GlobalProviders>
          <Navigation />
          {children}
        </GlobalProviders>
      </body>
    </html>
  );
}