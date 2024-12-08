import { Metadata } from "next";
import "../styles/globals.css";

let title = "Firecast";
let description = "Firecast";
let ogimage = "/head.png";
let sitename = "decoherence.co";

export const metadata: Metadata = {
  title,
  description,
  icons: {
    icon: "/head.png",
  },
  openGraph: {
    images: [ogimage],
    title,
    description,
    url: "https://roomgpt-demo.vercel.app",
    siteName: sitename,
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    images: [ogimage],
    title,
    description,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-white text-black">{children}</body>
    </html>
  );
}
