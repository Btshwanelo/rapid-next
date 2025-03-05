import type { Metadata } from "next";
import "./globals.css";
import ClientLayout from "./client-layout"; // Import the client layout
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import store, { persistor } from "@/store";



export const metadata: Metadata = {
  title: "Rapid Code",
  description: "A rapid ideation tool",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return <ClientLayout>
    {children}
    </ClientLayout>;
}
