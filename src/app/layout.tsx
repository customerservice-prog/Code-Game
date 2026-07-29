import type { Metadata } from "next";
import "./globals.css";
import { appConfig } from "@/lib/config";

export const metadata: Metadata = {
  title: appConfig.name,
  description: appConfig.description,
};

// Force dynamic rendering for the whole app.
// Static prerendering was failing in production builds with an internal
// "Cannot read properties of null (reading 'useContext')" error during
// "next build". Forcing dynamic rendering avoids static generation of
// these routes at build time and renders them per-request instead. This
// should be revisited once real interactive features (auth, data
// fetching) are implemented - see CLAUDE.md sections 8-9.
export const dynamic = "force-dynamic";

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
