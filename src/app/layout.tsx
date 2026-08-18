/* eslint-disable @next/next/no-page-custom-font */
import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

const SITE_URL = "https://elysianaesthetics.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  applicationName: "Elysian Aesthetics & Wellness",
  title: {
    default:
      "Elysian Aesthetics & Wellness | Best Medical Spa in Plano & Frisco, TX",
    template: "%s | Elysian Aesthetics & Wellness",
  },
  description:
    "Experience the pinnacle of facial balancing, laser resurfacing, and physician-led aesthetic care at Elysian Aesthetics & Wellness in North Texas.",
  keywords: [
    "medical spa Plano",
    "med spa Frisco",
    "Botox Plano",
    "dermal fillers Plano",
    "facial balancing",
    "Sofwave",
    "CO2 laser resurfacing",
    "Moxi laser",
    "BBL photofacial",
    "HydraFacial",
    "Sculptra",
    "Elysian Aesthetics & Wellness",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title:
      "Elysian Aesthetics & Wellness | Medical Precision. Personalized Artistry.",
    description:
      "Foundation-first facial balancing, advanced laser resurfacing, and physician-led aesthetic care in Plano, Texas.",
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "Elysian Aesthetics & Wellness",
  },
  twitter: {
    card: "summary",
    title: "Elysian Aesthetics & Wellness | Plano & Frisco, TX",
    description:
      "Medical precision and personalized artistry from the licensed aesthetic team at Elysian Aesthetics & Wellness.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  category: "health and beauty",
};

const serviceGroups = [
  {
    name: "Injectable Treatments",
    services: [
      "Botox and Dysport",
      "Dermal Fillers",
      "Lip Filler",
      "Sculptra",
      "Skinvive Skin Booster",
      "PRF EZ Gel",
      "Kybella",
    ],
  },
  {
    name: "Laser & Energy Treatments",
    services: [
      "Sofwave Skin Tightening",
      "Co2 Laser Resurfacing",
      "Moxi Laser",
      "BBL Photofacial",
    ],
  },
  {
    name: "Skincare Treatments",
    services: [
      "SkinPen Microneedling",
      "Chemical Peels",
      "HydraFacial",
      "Elysian Signature Facials",
    ],
  },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "MedicalBusiness",
  "@id": `${SITE_URL}/#medical-business`,
  name: "Elysian Aesthetics & Wellness",
  url: SITE_URL,
  description:
    "Elysian Aesthetics & Wellness provides personalized injectable, laser, energy, and advanced skincare treatments from licensed aesthetic providers in Plano, Texas.",
  telephone: "+1-972-636-6299",
  email: "hello@elysianaesthetics.com",
  priceRange: "$$$",
  currenciesAccepted: "USD",
  address: {
    "@type": "PostalAddress",
    streetAddress: "5717 Legacy Drive, Suite 170",
    addressLocality: "Plano",
    addressRegion: "TX",
    postalCode: "75024",
    addressCountry: "US",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 33.07844,
    longitude: -96.82006,
  },
  hasMap:
    "https://www.google.com/maps/search/?api=1&query=5717%20Legacy%20Drive%20Suite%20170%2C%20Plano%2C%20TX%2075024",
  areaServed: [
    { "@type": "City", name: "Plano" },
    { "@type": "City", name: "Frisco" },
    { "@type": "City", name: "Fairview" },
    { "@type": "City", name: "Allen" },
  ],
  openingHours: ["Tu-Fr 09:00-18:00", "Sa 09:00-17:00"],
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "09:00",
      closes: "18:00",
    },
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: "Saturday",
      opens: "09:00",
      closes: "17:00",
    },
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Sunday", "Monday"],
      opens: "00:00",
      closes: "00:00",
    },
  ],
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "appointments",
    telephone: "+1-972-636-6299",
    email: "hello@elysianaesthetics.com",
    availableLanguage: "English",
  },
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Elysian Aesthetics & Wellness Treatment Menu",
    itemListElement: serviceGroups.map((group) => ({
      "@type": "OfferCatalog",
      name: group.name,
      itemListElement: group.services.map((service) => ({
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: service,
          provider: { "@id": `${SITE_URL}/#medical-business` },
        },
      })),
    })),
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="overflow-x-clip">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Lato:ital,wght@0,300;0,400;0,700;1,400&family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
          }}
        />
      </head>
      <body className="bg-canvas text-espresso-800 antialiased">
        {children}
      </body>
    </html>
  );
}
