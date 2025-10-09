import type { Metadata } from "next";
import { League_Spartan } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import "./globals.css";
import PosthogInit from "@/components/PosthogInit";
import AuthIdentify from "@/components/AuthIdentify";
import { AuthProvider } from "@/providers/AuthProvider";

const leagueSpartan = League_Spartan({
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Task Manager",
  description: "Manage your tasks efficiently",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body className={leagueSpartan.className}>
        <Toaster />
        <PosthogInit />
        <AuthIdentify />
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}