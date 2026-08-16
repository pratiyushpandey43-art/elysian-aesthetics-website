"use client";

import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { useRef } from "react";
import ScreenshotCrop from "@/components/ScreenshotCrop";
import { useBooking } from "@/lib/booking-context";

const TRUST_ITEMS = [
  "1,000+ Google Reviews (4.9 Rating)",
  "Board-Certified PA & RN Injector Team",
  "Pro-Nox Comfort Protocols Available",
];

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const { openBooking } = useBooking();
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const mediaScale = useTransform(scrollYProgress, [0, 1], [1, 0.95]);
  const mediaOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0.5]);
  const contentY = useTransform(scrollYProgress, [0, 0.8], [0, -72]);

  return (
    <section
      ref={sectionRef}
      id="top"
      className="relative isolate min-h-[calc(100svh-128px)] overflow-hidden bg-espresso-950"
    >
      <motion.div
        className="absolute inset-0"
        style={{
          scale: reduceMotion ? 1 : mediaScale,
          opacity: reduceMotion ? 1 : mediaOpacity,
        }}
      >
        <ScreenshotCrop
          src="/reference/approach.png"
          alt="Elysian clinical team consulting with a patient"
          priority
          sourceWidth={1742}
          sourceHeight={722}
          cropX={43}
          cropY={24}
          cropWidth={837}
          className="hidden sm:block"
        />
        <ScreenshotCrop
          src="/reference/approach.png"
          alt="Elysian clinician speaking with a patient"
          priority
          sourceWidth={1742}
          sourceHeight={722}
          cropX={180}
          cropY={0}
          cropWidth={400}
          className="sm:hidden"
        />
      </motion.div>
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(42,22,14,.88)_0%,rgba(42,22,14,.68)_48%,rgba(42,22,14,.24)_76%,rgba(42,22,14,.34)_100%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(42,22,14,.72)_0%,transparent_45%)]" />

      <motion.div
        className="relative z-10 mx-auto flex min-h-[calc(100svh-128px)] max-w-[1720px] items-center px-6 py-24 sm:px-10 lg:px-16"
        style={{ y: reduceMotion ? 0 : contentY }}
      >
        <div className="max-w-[850px] text-canvas">
          <motion.p
            initial={false}
            className="flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.32em] text-[#eaded5] sm:text-xs"
          >
            <span className="h-px w-10 bg-current" />
            Best Medical Spa in Plano &amp; Frisco, TX
          </motion.p>

          <motion.h1
            initial={false}
            className="mt-7 max-w-4xl text-5xl font-normal leading-[0.98] tracking-[-0.04em] sm:text-6xl md:text-7xl lg:text-[86px]"
          >
            Medical Precision.
            <span className="mt-2 block italic text-[#e0cec1]">
              Personalized Artistry.
            </span>
          </motion.h1>

          <motion.p
            initial={false}
            className="mt-7 max-w-2xl text-base font-light leading-7 text-canvas/85 sm:text-lg sm:leading-8"
          >
            Experience the pinnacle of facial balancing, laser resurfacing, and
            physician-led aesthetic care in North Texas.
          </motion.p>

          <motion.div
            initial={false}
            className="mt-9 flex flex-col gap-3 sm:flex-row"
          >
            <button
              type="button"
              onClick={() => openBooking("Complimentary Consultation")}
              className="rounded-full bg-canvas px-8 py-4 text-sm font-bold text-espresso-900 shadow-soft transition duration-300 hover:-translate-y-0.5 hover:bg-white"
            >
              Book Consultation
            </button>
            <a
              href="#treatments"
              className="rounded-full border border-canvas/55 px-8 py-4 text-center text-sm font-bold text-canvas transition duration-300 hover:bg-canvas hover:text-espresso-900"
            >
              Explore Treatments
            </a>
          </motion.div>

          <motion.div
            initial={false}
            className="mt-12 grid max-w-4xl gap-px overflow-hidden rounded-2xl border border-white/20 bg-white/20 backdrop-blur-md sm:grid-cols-3"
          >
            {TRUST_ITEMS.map((item) => (
              <div key={item} className="flex min-h-20 items-center bg-espresso-950/40 px-5 py-4 sm:px-6">
                <p className="text-sm font-bold leading-5 text-canvas/90">{item}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </motion.div>

      <a
        href="#treatments"
        aria-label="Scroll to treatments"
        className="absolute bottom-7 right-7 z-20 hidden h-12 w-12 items-center justify-center rounded-full border border-canvas/40 text-canvas transition hover:bg-canvas hover:text-espresso-900 sm:flex"
      >
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
          <path d="M12 5v14m0 0 5-5m-5 5-5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </a>
    </section>
  );
}
