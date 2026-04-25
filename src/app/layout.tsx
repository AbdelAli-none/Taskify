import type { Metadata } from "next";
import { Inter, DM_Sans } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import Navbar from "@/components/Navbar";
import { syncCurrentUser } from "@/lib/syncCurrentUser";
import { Providers } from "@/components/Providers";
import { Toaster } from "sonner";
const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const dmSans = DM_Sans({ subsets: ["latin"], variable: "--font-dm-sans" });

export const metadata: Metadata = {
  title: "Taskify",
  description: "Your personal todo manager",
  icons: {
    icon: "/logoPage.png",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  await syncCurrentUser();
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        "h-full",
        "antialiased",
        dmSans.variable,
        "font-sans",
        inter.variable,
      )}
    >
      <body className="h-screen">
        <Providers>
          <div className="2xl:w-[70%] md:w-full h-[calc(100vh-0px)] mx-auto flex flex-col py-2 px-2">
            <Navbar />
            <main className="flex-1 overflow-hidden rounded-2xl p-0 mt-1 shadow-2xl dark:shadow-[0_0_10px_rgba(255,255,255,0.4)] bg-card">
              {children}
            </main>
            <Toaster richColors />
          </div>
        </Providers>
      </body>
    </html>
  );
}
