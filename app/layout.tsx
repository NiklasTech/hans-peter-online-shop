import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/admin/Sidebar";
import { getCurrentAdmin } from "@/lib/auth";
import { ChatWidget } from "@/components/chat/ChatWidget";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
  fallback: ["system-ui", "arial"],
});

export const metadata: Metadata = {
  title: "Hans Peter Online Shop",
  description: "Der beste Online-Shop für Ihre Bedürfnisse",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Check if user has admin session
  const adminSession = await getCurrentAdmin();
  const isAdmin = !!adminSession;

  return (
    <html lang="en">
      <body
        className={`${inter.variable} antialiased font-sans`}
      >
        <div className="flex flex-col h-screen">
          <Navbar />
          <div className="flex flex-1 overflow-hidden">
            <Sidebar isAdmin={isAdmin} />
            <main className="flex-1 overflow-y-auto">{children}</main>
          </div>
          <ChatWidget />
        </div>
      </body>
    </html>
  );
}
