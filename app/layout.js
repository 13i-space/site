import "./globals.css";

// metadataBase makes every link-preview image an absolute URL. Pages with
// their own preview (stories, species) override openGraph.images; the rest
// share the default card drawn by app/og/route.js.
export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://13i.space"),
  title: "13i",
  description: "A signal, translated. Launching April 6, 2027.",
  openGraph: {
    siteName: "13i",
    title: "13i",
    description: "A signal, translated. Launching April 6, 2027.",
    images: [{ url: "/og", width: 1200, height: 630 }],
  },
  twitter: { card: "summary_large_image", images: ["/og"] },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@1,500&family=JetBrains+Mono:wght@400;500&family=Inter:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
