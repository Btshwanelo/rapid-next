import type { Metadata } from "next";
import "./globals.css";
import ClientLayout from "./client-layout"; // Import the client layout

export const metadata: Metadata = {
  title: "Rapid Code",
  description: "A rapid ideation tool",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ClientLayout>{children}</ClientLayout>;
}
