import { Space_Grotesk, DM_Sans } from "next/font/google";
import "./globals.css";
import "@phosphor-icons/web/regular";
import Script from "next/script";

// Update this when you deploy to production
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://lucas-automation.vercel.app";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Lucas Automation | Custom Workflow & Chatbot Automations",
  description:
    "We build custom automations, chatbots, and smart workflows so your team can stop doing the same tasks over and over.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    title: "Lucas Automation | Custom Workflow & Chatbot Automations",
    description:
      "Stop doing the same tasks over and over. We create custom automations, chatbots, and workflows that save your team hours every week.",
    siteName: "Lucas Automation",
    url: "/",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Lucas Automation: Custom Workflow & Chatbot Automations",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Lucas Automation | Custom Workflow & Chatbot Automations",
    description:
      "Stop doing the same tasks over and over. We create custom automations, chatbots, and workflows that save your team hours every week.",
    images: ["/og-image.png"],
  },
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'><rect width='32' height='32' rx='6' fill='%231a1a1a'/><text x='8' y='24' font-family='sans-serif' font-size='22' font-weight='700' fill='%23fdfdfd'>L</text></svg>",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: "Lucas Automation",
  description:
    "We build custom automations, chatbots, and smart workflows so your team can focus on what matters.",
  url: SITE_URL,
  telephone: "+918655492045",
  email: "nadarnitesh32@gmail.com",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Valsad",
    addressCountry: "IN",
  },
  knowsAbout: [
    "Workflow Automation",
    "AI Agents",
    "Website Lead Generation",
    "Custom Chatbots",
  ],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning data-scroll-behavior="smooth">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`${spaceGrotesk.variable} ${dmSans.variable}`} suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
