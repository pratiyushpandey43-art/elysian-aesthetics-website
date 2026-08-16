import ApproachSection from "@/components/ApproachSection";
import BookingModal from "@/components/BookingModal";
import CookieBanner from "@/components/CookieBanner";
import FAQSection from "@/components/FAQSection";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Journal from "@/components/Journal";
import Programs from "@/components/Programs";
import Providers from "@/components/Providers";
import Reviews from "@/components/Reviews";
import Services from "@/components/Services";
import Specials from "@/components/Specials";
import { BookingProvider } from "@/lib/booking-context";

export default function Home() {
  return (
    <BookingProvider>
      <Header />
      <main>
        <Hero />
        <Services />
        <ApproachSection />
        <Providers />
        <Reviews />
        <FAQSection />
        <Programs />
        <Specials />
        <Journal />
      </main>
      <Footer />
      <BookingModal />
      <CookieBanner />
    </BookingProvider>
  );
}
