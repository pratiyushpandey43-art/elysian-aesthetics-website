"use client";

import { useReducedMotion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import Reveal from "@/components/Reveal";
import ScreenshotCrop from "@/components/ScreenshotCrop";
import { useBooking } from "@/lib/booking-context";

const PROVIDERS = [
  {
    name: "Drea Hainebach (PA-C)",
    cropX: 24,
    cropWidth: 382,
    alt: "Drea Hainebach, Board Certified Physician Associate at Elysian Aesthetics & Wellness",
    bio: "Board Certified Physician Associate & Advanced Aesthetic Injector with experience in plastic surgery and medical aesthetics.",
  },
  {
    name: "Claire Schroyer (RN)",
    cropX: 431,
    cropWidth: 381,
    alt: "Claire Schroyer, Registered Nurse and advanced injector at Elysian Aesthetics & Wellness",
    bio: "Registered Nurse & Advanced Injector with 5+ years of experience, specializing in regenerative treatments such as Sculptra.",
  },
  {
    name: "Kenzie Morgan (RN)",
    cropX: 838,
    cropWidth: 382,
    alt: "Kenzie Morgan, BSN-prepared Registered Nurse at Elysian Aesthetics & Wellness",
    bio: "BSN-Prepared Registered Nurse & Advanced Injector with 5+ years of experience, specializing in holistic facial balancing.",
  },
  {
    name: "Hannah Smith (CLT)",
    cropX: 1244,
    cropWidth: 381,
    alt: "Hannah Smith, Certified Laser Practitioner at Elysian Aesthetics & Wellness",
    bio: "Licensed Aesthetician & Certified Laser Practitioner specializing in CO2 laser resurfacing, BBL, and Sofwave.",
  },
];

function Arrow({ reverse = false }: { reverse?: boolean }) {
  return (
    <svg viewBox="0 0 24 24" className={`h-5 w-5 ${reverse ? "rotate-180" : ""}`} fill="none" aria-hidden="true">
      <path d="M5 12h14m0 0-5-5m5 5-5 5" stroke="currentColor" strokeWidth="1.35" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function Providers() {
  const rowRef = useRef<HTMLDivElement>(null);
  const { openBooking } = useBooking();
  const reduceMotion = useReducedMotion();
  const [canScrollBack, setCanScrollBack] = useState(false);
  const [canScrollForward, setCanScrollForward] = useState(false);

  const updateCarouselState = useCallback(() => {
    const row = rowRef.current;
    if (!row) return;

    const maxScrollLeft = Math.max(0, row.scrollWidth - row.clientWidth);
    setCanScrollBack(row.scrollLeft > 2);
    setCanScrollForward(row.scrollLeft < maxScrollLeft - 2);
  }, []);

  useEffect(() => {
    let animationFrame = 0;
    const refresh = () => {
      window.cancelAnimationFrame(animationFrame);
      animationFrame = window.requestAnimationFrame(updateCarouselState);
    };

    refresh();
    window.addEventListener("resize", refresh);

    const resizeObserver = new ResizeObserver(refresh);
    if (rowRef.current) resizeObserver.observe(rowRef.current);

    return () => {
      window.cancelAnimationFrame(animationFrame);
      window.removeEventListener("resize", refresh);
      resizeObserver.disconnect();
    };
  }, [updateCarouselState]);

  function scroll(direction: -1 | 1) {
    const row = rowRef.current;
    if (!row) return;
    if (
      (direction === -1 && !canScrollBack) ||
      (direction === 1 && !canScrollForward)
    ) {
      return;
    }
    row.scrollBy({
      left: direction * row.clientWidth * 0.82,
      behavior: reduceMotion ? "auto" : "smooth",
    });
  }

  return (
    <section id="providers" className="scroll-mt-28 bg-canvas py-24 sm:py-32">
      <div className="mx-auto max-w-[1720px] px-5 sm:px-10 lg:px-12">
        <Reveal className="mb-9 flex items-end justify-between gap-5">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.32em] text-espresso-600">
              Your care team
            </p>
            <h2 className="mt-3 max-w-5xl text-4xl font-normal leading-[1.05] tracking-[-0.03em] text-espresso-900 sm:text-6xl">
              Learn about our expert providers
            </h2>
          </div>
          <div className="flex shrink-0 gap-2">
            <button
              type="button"
              onClick={() => scroll(-1)}
              disabled={!canScrollBack}
              aria-label="Previous providers"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-line-strong text-espresso-600 transition hover:border-espresso-900 hover:bg-espresso-900 hover:text-canvas disabled:cursor-not-allowed disabled:border-line disabled:text-espresso-300 disabled:opacity-60 disabled:hover:bg-transparent"
            >
              <Arrow reverse />
            </button>
            <button
              type="button"
              onClick={() => scroll(1)}
              disabled={!canScrollForward}
              aria-label="Next providers"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-line-strong text-espresso-600 transition hover:border-espresso-900 hover:bg-espresso-900 hover:text-canvas disabled:cursor-not-allowed disabled:border-line disabled:text-espresso-300 disabled:opacity-60 disabled:hover:bg-transparent"
            >
              <Arrow />
            </button>
          </div>
        </Reveal>

        <div
          ref={rowRef}
          onScroll={updateCarouselState}
          className="provider-track hide-scrollbar grid snap-x snap-mandatory grid-flow-col gap-6 overflow-x-auto scroll-smooth pb-3"
        >
          {PROVIDERS.map((provider) => (
            <article
              key={provider.name}
              className="group flex min-w-0 snap-start flex-col overflow-hidden rounded-[30px] bg-card"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-stone">
                <div className="absolute inset-0 transition-transform duration-700 ease-out group-hover:scale-[1.035]">
                  <ScreenshotCrop
                    src="/reference/providers.png"
                    alt={provider.alt}
                    sourceWidth={1630}
                    sourceHeight={724}
                    cropX={provider.cropX}
                    cropY={119}
                    cropWidth={provider.cropWidth}
                  />
                </div>
              </div>
              <div className="flex min-h-[350px] flex-1 flex-col p-7 sm:p-8">
                <h3 className="text-2xl font-normal leading-tight tracking-[-0.02em] text-espresso-900 sm:text-[28px]">
                  {provider.name}
                </h3>
                <p className="mt-3 flex-1 text-[15px] leading-7 text-espresso-700 sm:text-base">
                  {provider.bio}
                </p>
                <button
                  type="button"
                  onClick={() => openBooking(`Consultation with ${provider.name}`)}
                  className="mt-7 w-full rounded-full border border-espresso-900 px-6 py-3.5 text-sm text-espresso-900 transition duration-300 hover:bg-espresso-900 hover:text-canvas"
                >
                  Find out more
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
