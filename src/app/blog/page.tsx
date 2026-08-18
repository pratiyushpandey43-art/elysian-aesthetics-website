import type { Metadata } from "next";
import BookingModal from "@/components/BookingModal";
import CookieBanner from "@/components/CookieBanner";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Journal from "@/components/Journal";
import { BookingProvider } from "@/lib/booking-context";

export const metadata: Metadata = {
  title: "The Elysian Journal | Aesthetics & Wellness",
  description:
    "Explore the Elysian Aesthetics & Wellness journal for clear guidance on injectables, laser and energy treatments, skincare, and personalized aesthetic care.",
  alternates: {
    canonical: "/blog",
  },
  openGraph: {
    title: "The Elysian Journal | Aesthetics & Wellness",
    description:
      "Clinical perspective on injectables, laser technology, skincare, and personalized aesthetic treatment planning.",
    type: "website",
    url: "/blog",
  },
};

export default function BlogPage() {
  return (
    <BookingProvider>
      <div id="top" className="min-h-screen overflow-x-hidden bg-canvas">
        <Header />
        <main>
          <Journal variant="blog" />
        </main>
        <Footer />
        <BookingModal />
        <CookieBanner />
      </div>
    </BookingProvider>
  );
}
