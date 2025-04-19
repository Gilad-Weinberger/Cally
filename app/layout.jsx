import { Rubik } from "next/font/google";
import Providers from "./providers";
import "./globals.css";

const rubik = Rubik({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

export const metadata = {
  title: {
    default: "Cally | AI-Powered Calendar Assistant",
    template: "%s | Cally",
  },
  description:
    "Cally is an AI-powered calendar assistant that helps you organize your schedule efficiently with natural language processing and smart scheduling.",
  keywords: [
    "AI calendar",
    "smart scheduling",
    "calendar assistant",
    "productivity",
    "time management",
    "AI scheduling",
  ],
  authors: [{ name: "Cally Team" }],
  creator: "Cally",
  publisher: "Cally",
  metadataBase: new URL("https://cally.vercel.app"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://cally.vercel.app",
    title: "Cally | AI-Powered Calendar Assistant",
    description:
      "Organize your schedule efficiently with Cally's AI-powered calendar assistant",
    siteName: "Cally",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Cally - AI Calendar Assistant",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Cally | AI-Powered Calendar Assistant",
    description:
      "Organize your schedule efficiently with Cally's AI-powered calendar assistant",
    images: ["/og-image.jpg"],
    creator: "@callyapp",
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1"
        />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className={`${rubik.className} antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
