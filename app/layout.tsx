import { ClerkProvider } from "@clerk/nextjs";
import { koKR } from "@clerk/localizations";

import "./globals.css";
import { ModalProvider, ToastProvider } from "@/providers";
import { inter } from "./styles/fonts";

export const metadata = {
  title: "Admin Dashboard",
  description: "Admin Dashboard",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider localization={koKR}>
      <html lang="en" >
        <body className={inter.className}>
          <ToastProvider />
          <ModalProvider />
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
