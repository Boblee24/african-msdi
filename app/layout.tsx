import type { Metadata } from "next";
import "./globals.css";
import Nav from "@/components/Nav";

export const metadata: Metadata = {
  title: "African MSDI — Federated Marine Spatial Data Infrastructure",
  description:
    "A continental federated portal for hydrographic and ocean data discovery across Africa. Powered by IHO S-100 standards.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Nav />
        <main style={{ paddingTop: "56px", height: "100vh" }}>{children}</main>
      </body>
    </html>
  );
}
