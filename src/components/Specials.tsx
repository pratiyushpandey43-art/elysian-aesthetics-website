"use client";

import Image from "next/image";
import Reveal from "@/components/Reveal";
import { useBooking } from "@/lib/booking-context";

const SPECIALS = [
  {
    title: "New Patient Welcome Offer",
    description:
      "New to Elysian? We're excited to meet you! Enjoy 15% off your first treatment as our welcome gift. Book a complimentary consultation to get started.",
    image:
      "https://images.unsplash.com/photo-1556228852-6d45a7d8a323?auto=format&fit=crop&w=800&q=80",
    alt: "A welcoming and modern medical spa reception area.",
    ctaText: "Claim Your Offer",
    bookingPreset: "New Patient Offer (15% Off)",
  },
  {
    title: "The Signature Refresh Package",
    description:
      "Combine Botox/Dysport with a full syringe of dermal filler and receive $150 off your total treatment. The perfect pairing for a comprehensive, natural-looking refresh.",
    image:
      "https://images.unsplash.com/photo-1620912290408-858c4a1139a2?auto=format&fit=crop&w=800&q=80",
    alt: "Aesthetician preparing a dermal filler injection for a facial balancing treatment.",
    ctaText: "Book This Package",
    bookingPreset: "Signature Refresh Package",
  },
  {
    title: "Laser & Light Series",
    description:
      "Invest in your skin's future. Purchase a package of three Moxi or BBL Photofacial treatments and receive your fourth session completely free.",
    image:
      "https://images.unsplash.com/photo-1531898333203-a423fe386343?auto=format&fit=crop&w=800&q=80",
    alt: "Close-up of a woman with clear, radiant skin after a laser treatment.",
    ctaText: "Start Your Series",
    bookingPreset: "Laser & Light Series",
  },
];

export default function Specials() {
  const { openBooking } = useBooking();

  return (
    <section id="specials" className="scroll-mt-20 bg-[#F6F4F0] py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#6E5E54]">
            Current Promotions
          </p>
          <h2 className="mt-4 font-display text-4xl leading-tight text-[#382015] sm:text-5xl">
            Exclusive Offers & Specials
          </h2>
          <p className="mt-5 text-base leading-relaxed text-[#6E5E54]">
            Take advantage of our curated specials designed to help you achieve your aesthetic goals while enjoying exceptional value.
          </p>
        </Reveal>

        <div className="mt-16 grid gap-8 lg:grid-cols-3">
          {SPECIALS.map((special, index) => (
            <Reveal key={special.title} delay={index * 0.1}>
              <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-[#E8E3DC] bg-[#FAF8F5] shadow-sm transition-shadow duration-300 hover:shadow-lg">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={special.image}
                    alt={special.alt}
                    fill
                    loading="lazy"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-700 ease-in-out group-hover:scale-105"
                  />
                </div>
                <div className="flex flex-1 flex-col p-7">
                  <h3 className="font-display text-2xl text-[#382015]">{special.title}</h3>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-[#6E5E54]">{special.description}</p>
                  <div className="mt-6">
                    <button type="button" onClick={() => openBooking(special.bookingPreset)} className="w-full rounded-full bg-[#382015] px-6 py-3.5 text-[12px] font-bold uppercase tracking-widest text-white transition-colors hover:bg-[#2A160E]">{special.ctaText}</button>
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
