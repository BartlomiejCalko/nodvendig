import type { Metadata } from "next";
import { AppShell } from "@/components/layout/AppShell";
import { organizationSchema } from "@/data/company";
import { geistMono, geistSans } from "@/lib/fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Nødvendig | Data Center Construction Norway",
    template: "%s | Nødvendig",
  },
  description:
    "Construction, transformation and site execution for data center facilities across Norway. Nødvendig builds the physical environment around critical infrastructure.",
  openGraph: {
    title: "Nødvendig | Data Center Construction Norway",
    description:
      "Construction, transformation and site execution for data center facilities across Norway. Nødvendig builds the physical environment around critical infrastructure.",
    locale: "en",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable}`}
    >
      <body className="font-sans antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
