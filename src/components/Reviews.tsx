"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useState } from "react";
import Reveal from "@/components/Reveal";

const REVIEWS = [
  {
    quote:
      "Elysian truly understands facial balancing. My results are incredibly natural, and I feel refreshed, not 'done.' The team is professional and makes you feel so comfortable.",
    name: "Sarah L.",
    detail: "Plano · Injectable Client",
    service: "Dermal Fillers",
  },
  {
    quote:
      "I've struggled with sun spots for years, and the BBL Photofacial at Elysian has been a game-changer. My skin tone is so much more even, and I feel confident without makeup.",
    name: "Jessica P.",
    detail: "Frisco · Laser Client",
    service: "BBL Photofacial",
  },
  {
    quote:
      "The HydraFacial is my go-to for glowing skin. The estheticians are thorough and customize it every time. It's a luxurious experience with noticeable results.",
    name: "Emily R.",
    detail: "Plano · Skincare Client",
    service: "HydraFacial",
  },
  {
    quote:
      "I was nervous about my first injectable treatment, but Drea made me feel completely at ease. She walked me through everything, and the results are exactly what I hoped for – subtle and effective.",
    name: "Olivia K.",
    detail: "Frisco · Injectable Client",
    service: "Botox",
  },
  {
    quote:
      "The team at Elysian is exceptional. They are knowledgeable, kind, and truly care about their patients. I highly recommend them for anyone looking for top-tier aesthetic care.",
    name: "Megan H.",
    detail: "Plano · General Client",
    service: "Consultation",
  },
];

function Stars() {
  return (
    <div className="flex items-center gap-1" aria-label="5 out of 5 stars">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} viewBox="0 0 20 20" className="h-4 w-4 text-[#382015]" fill="currentColor" aria-hidden="true">
          <path d="m10 1.8 2.5 5 5.5.8-4 3.9.9 5.5-4.9-2.6L5.1 17l.9-5.5-4-3.9 5.5-.8 2.5-5Z" />
        </svg>
      ))}
    </div>
  );
}

export default function Reviews() {
  const [active, setActive] = useState(0);
  const reduce = useReducedMotion();
  const review = REVIEWS[active];

  const previous = () =>
    setActive((current) =>
      current === 0 ? REVIEWS.length - 1 : current - 1,
    );
  const next = () =>
    setActive((current) => (current + 1) % REVIEWS.length);

  return (
    <section id="reviews" className="scroll-mt-20 bg-[#FAF8F5] py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-[0.8fr_1.4fr] lg:gap-20">
          <Reveal>
            <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#6E5E54]">
              What Our Clients Say
            </p>
            <h2 className="mt-4 font-display text-4xl leading-tight text-[#382015] sm:text-5xl">
              Hear From Our
              <span className="block italic text-[#382015]">
                Valued Clients
              </span>
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-[#6E5E54]">
              Discover why our clients trust Elysian for their aesthetic
              journey. Real stories, real results.
            </p>

            <div className="mt-8 flex items-center gap-5 border-y border-[#E8E3DC] py-5">
              <div>
                <p className="font-display text-4xl text-[#382015]">4.9</p>
                <Stars />
              </div>
              <span className="h-12 w-px bg-[#D5CEC5]" />
              <div>
                <p className="text-sm font-bold text-[#382015]">1,000+ reviews</p>
                <p className="mt-1 text-xs text-[#6E5E54]">
                  Across our Plano &amp; Frisco communities
                </p>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.12}>
            <div className="relative rounded-2xl border border-[#E8E3DC] bg-[#F6F4F0] p-7 shadow-sm sm:p-12">
              <svg
                viewBox="0 0 60 45"
                className="absolute right-7 top-7 h-12 w-16 text-[#EBE7E0]/50 sm:right-10 sm:top-9"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M0 45V26C0 9 9 1 27 0v9c-8 1-12 5-13 12h11v24H0Zm33 0V26C33 9 42 1 60 0v9c-8 1-12 5-13 12h11v24H33Z" />
              </svg>

              <div className="relative min-h-72 sm:min-h-64">
                <AnimatePresence mode="wait">
                  <motion.figure
                    key={active}
                    initial={{ opacity: 0, x: reduce ? 0 : 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: reduce ? 0 : -20 }}
                    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <Stars />
                    <blockquote className="mt-7 max-w-2xl font-display text-xl leading-relaxed text-[#382015] sm:text-2xl">
                      “{review.quote}”
                    </blockquote>
                    <figcaption className="mt-7 flex flex-wrap items-end justify-between gap-4">
                      <div>
                        <p className="font-bold text-[#382015]">{review.name}</p>
                        <p className="mt-1 text-xs text-[#6E5E54]">{review.detail}</p>
                      </div>
                      <span className="rounded-full border border-[#D5CEC5] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-[#382015]">
                        {review.service}
                      </span>
                    </figcaption>
                  </motion.figure>
                </AnimatePresence>
              </div>

              <div className="mt-5 flex items-center justify-between border-t border-[#E8E3DC] pt-6">
                <div className="flex gap-2" aria-label="Select review">
                  {REVIEWS.map((item, index) => (
                    <button
                      key={item.name}
                      type="button"
                      onClick={() => setActive(index)}
                      aria-label={`Show review ${index + 1}`}
                      aria-current={active === index ? "true" : undefined}
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        active === index
                          ? "w-8 bg-[#382015]"
                          : "w-3 bg-[#D5CEC5] hover:bg-[#EBE7E0]"
                      }`}
                    />
                  ))}
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={previous}
                    aria-label="Previous review"
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-[#D5CEC5] text-[#4A382D] transition-all duration-300 hover:scale-105 hover:border-[#382015] hover:text-[#382015]"
                  >
                    <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" aria-hidden="true">
                      <path d="m12.5 4.5-5.5 5.5 5.5 5.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    onClick={next}
                    aria-label="Next review"
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-[#D5CEC5] text-[#4A382D] transition-all duration-300 hover:scale-105 hover:border-[#382015] hover:text-[#382015]"
                  >
                    <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" aria-hidden="true">
                      <path d="m7.5 4.5 5.5 5.5-5.5 5.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
