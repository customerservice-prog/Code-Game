import type { Metadata } from "next";
import "./globals.css";
import { appConfig } from "@/lib/config";

export const metadata: Metadata = {
  title: appConfig.name,
  description: appConfig.description,
};

// Root application shell.
// The full responsive layout (sidebar, header, mobile nav) described in
// CLAUDE.md section 8 should be implemented here and in nested layouts.
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body>{children}</body>
    </html>
  );
}
