"use client";

import { useReducedMotion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import Reveal from "@/components/Reveal";
import ScreenshotCrop from "@/components/ScreenshotCrop";
import { useBooking } from "@/lib/booking-context";

type Crop = {
  src: string;
  sourceWidth: number;
  sourceHeight: number;
  cropX: number;
  cropY: number;
  cropWidth: number;
};

type Treatment = {
  title: string;
  description: string;
  crop: Crop;
  alt: string;
};

type TreatmentGroup = {
  id: string;
  title: string;
  eyebrow: string;
  treatments: Treatment[];
};

type CarouselState = {
  canScrollBack: boolean;
  canScrollForward: boolean;
};

const crop = (
  src: string,
  sourceWidth: number,
  sourceHeight: number,
  cropX: number,
  cropY: number,
  cropWidth: number,
): Crop => ({ src, sourceWidth, sourceHeight, cropX, cropY, cropWidth });

const INJECTABLE_A = "/reference/injectables-a.png";
const INJECTABLE_B = "/reference/injectables-b.png";
const LASER = "/reference/laser.png";
const SKINCARE = "/reference/skincare.png";

const GROUPS: TreatmentGroup[] = [
  {
    id: "injectables",
    title: "Injectable treatments",
    eyebrow: "Refine · Restore · Rebalance",
    treatments: [
      {
        title: "Botox and Dysport",
        description:
          "FDA-approved injectable. Prevents and smooths dynamic wrinkles while still allowing you to express yourself.",
        crop: crop(INJECTABLE_A, 1633, 722, 12, 28, 382),
        alt: "Elysian provider performing an injectable treatment",
      },
      {
        title: "Dermal Fillers",
        description:
          "FDA-approved injectable. Instantly restores facial volume, softens deep lines, and augments facial features such as cheeks and lips.",
        crop: crop(INJECTABLE_A, 1633, 722, 419, 28, 381),
        alt: "Elysian provider reviewing a personalized filler plan",
      },
      {
        title: "Lip Filler",
        description:
          "FDA-approved injectable. Enhances lip shape, adds volume, and hydrates the lips. Natural results, never overfilled.",
        crop: crop(INJECTABLE_A, 1633, 722, 825, 28, 381),
        alt: "Elysian injector consulting with a lip filler patient",
      },
      {
        title: "Sculptra",
        description:
          "FDA-approved injectable. Boosts collagen and elastin to gradually restore volume in your cheeks, jawline, and temples.",
        crop: crop(INJECTABLE_A, 1633, 722, 1232, 28, 381),
        alt: "Elysian provider explaining Sculptra treatment",
      },
      {
        title: "Skinvive Skin Booster",
        description:
          "Skinvive helps the skin retain natural moisture making your skin appear more radiant, glowing, and youthful.",
        crop: crop(INJECTABLE_B, 1626, 594, 426, 42, 381),
        alt: "Skinvive skin booster treatment packaging",
      },
      {
        title: "PRF EZ Gel",
        description:
          "100% natural bio-filler made with growth factors from your own blood. It stimulates collagen production and restores facial volume.",
        crop: crop(INJECTABLE_B, 1626, 594, 832, 42, 382),
        alt: "Elysian provider preparing a regenerative PRF treatment",
      },
      {
        title: "Kybella",
        description:
          "Only FDA-approved injectable that removes stubborn fat under our chin reducing the appearance of double chin.",
        crop: crop(INJECTABLE_B, 1626, 594, 1239, 42, 381),
        alt: "Elysian provider performing a Kybella consultation",
      },
    ],
  },
  {
    id: "laser",
    title: "Laser & energy treatments",
    eyebrow: "Resurface · Tighten · Brighten",
    treatments: [
      {
        title: "Sofwave Skin Tightening",
        description:
          "Non-invasive treatment that uses ultrasound energy to lift and tighten with zero downtime.",
        crop: crop(LASER, 1646, 755, 41, 82, 382),
        alt: "Elysian provider beside a Sofwave skin tightening device",
      },
      {
        title: "Co2 Laser Resurfacing",
        description:
          "Co2 laser is a fractional laser that resurfaces our skin to reduce fine lines, acne scars, stretch marks, and pigmentation.",
        crop: crop(LASER, 1646, 755, 447, 82, 382),
        alt: "Elysian provider performing CO2 laser resurfacing",
      },
      {
        title: "Moxi Laser",
        description:
          "“Pre-juvenation” laser. Non-ablative laser ideal for patients who are looking for a powerful laser treatment with minimal downtime.",
        crop: crop(LASER, 1646, 755, 854, 82, 382),
        alt: "Close view of a Moxi laser handpiece during treatment",
      },
      {
        title: "BBL Photofacial",
        description:
          "Award-winning treatment that is clinically proven to reverse signs of aging, brighten your skin tone, and reduce sun spots.",
        crop: crop(LASER, 1646, 755, 1260, 82, 382),
        alt: "Elysian provider performing a BBL photofacial",
      },
    ],
  },
  {
    id: "skincare",
    title: "Skincare & facial treatments",
    eyebrow: "Cleanse · Renew · Hydrate",
    treatments: [
      {
        title: "SkinPen Microneedling",
        description:
          "Boosts collagen and elastin to improve your skin texture and reduce the appearance of acne scars and stretch marks.",
        crop: crop(SKINCARE, 1626, 728, 13, 93, 382),
        alt: "Elysian aesthetician performing SkinPen microneedling",
      },
      {
        title: "Chemical Peels",
        description:
          "Uses medical-grade chemical ingredients to exfoliate your skin which brightens skin tone, improve fine lines, and also reduce acne.",
        crop: crop(SKINCARE, 1626, 728, 420, 93, 381),
        alt: "Elysian provider discussing a personalized chemical peel",
      },
      {
        title: "HydraFacial",
        description:
          "Hydrafacial uses patented technology to cleanse, extract, & hydrate with super serums. Quick & effective treatment.",
        crop: crop(SKINCARE, 1626, 728, 826, 93, 382),
        alt: "Elysian aesthetician performing a HydraFacial",
      },
      {
        title: "Elysian Signature Facials",
        description:
          "Customizable to your skin's needs. Uses medical-grade ingredients to cleanse, exfoliate, extract, and hydrate.",
        crop: crop(SKINCARE, 1626, 728, 1233, 93, 381),
        alt: "Elysian aesthetician performing a signature facial",
      },
    ],
  },
];

const CONCERNS = [
  "Facial Balancing",
  "Preventative Botox",
  "Fine lines & wrinkles",
  "Volume loss",
  "Skin tightening",
  "Pigmentation and redness",
  "Melasma",
  "Acne scars",
  "Stubborn fat (double chin)",
  "Excessive sweating",
  "Pro-Nox Pain Management",
  "Men's Treatments",
];

function initialCarouselState() {
  return GROUPS.reduce<Record<string, CarouselState>>((state, group) => {
    state[group.id] = {
      canScrollBack: false,
      canScrollForward: false,
    };
    return state;
  }, {});
}

function ArrowIcon({ direction }: { direction: "left" | "right" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={`h-5 w-5 ${direction === "left" ? "rotate-180" : ""}`}
      fill="none"
      aria-hidden="true"
    >
      <path d="M5 12h14m0 0-5-5m5 5-5 5" stroke="currentColor" strokeWidth="1.35" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function Services() {
  const { openBooking } = useBooking();
  const reduceMotion = useReducedMotion();
  const rows = useRef<Record<string, HTMLDivElement | null>>({});
  const [carouselState, setCarouselState] = useState(initialCarouselState);

  const updateCarouselState = useCallback((groupId: string) => {
    const row = rows.current[groupId];
    if (!row) return;

    const maxScrollLeft = Math.max(0, row.scrollWidth - row.clientWidth);
    const nextState = {
      canScrollBack: row.scrollLeft > 2,
      canScrollForward: row.scrollLeft < maxScrollLeft - 2,
    };

    setCarouselState((current) => {
      const previous = current[groupId];
      if (
        previous?.canScrollBack === nextState.canScrollBack &&
        previous?.canScrollForward === nextState.canScrollForward
      ) {
        return current;
      }
      return { ...current, [groupId]: nextState };
    });
  }, []);

  useEffect(() => {
    let animationFrame = 0;
    const refreshAll = () => {
      window.cancelAnimationFrame(animationFrame);
      animationFrame = window.requestAnimationFrame(() => {
        GROUPS.forEach((group) => updateCarouselState(group.id));
      });
    };

    refreshAll();
    window.addEventListener("resize", refreshAll);

    const resizeObserver = new ResizeObserver(refreshAll);
    GROUPS.forEach((group) => {
      const row = rows.current[group.id];
      if (row) resizeObserver.observe(row);
    });

    return () => {
      window.cancelAnimationFrame(animationFrame);
      window.removeEventListener("resize", refreshAll);
      resizeObserver.disconnect();
    };
  }, [updateCarouselState]);

  function scrollRow(groupId: string, direction: -1 | 1) {
    const row = rows.current[groupId];
    if (!row) return;
    const state = carouselState[groupId];
    if (
      (direction === -1 && !state?.canScrollBack) ||
      (direction === 1 && !state?.canScrollForward)
    ) {
      return;
    }
    row.scrollBy({
      left: direction * Math.min(row.clientWidth * 0.82, 980),
      behavior: reduceMotion ? "auto" : "smooth",
    });
  }

  return (
    <section id="treatments" className="scroll-mt-28 bg-canvas py-24 sm:py-32">
      <div className="mx-auto max-w-[1720px] px-5 sm:px-10 lg:px-12">
        <Reveal className="grid gap-8 border-b border-line pb-14 lg:grid-cols-[1fr_.9fr] lg:items-end">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.32em] text-espresso-600">
              Our treatment menu
            </p>
            <h2 className="mt-4 max-w-3xl text-4xl leading-[1.05] tracking-[-0.03em] text-espresso-900 sm:text-6xl">
              Care designed around your skin, your features, and your goals.
            </h2>
          </div>
          <div className="lg:pb-1">
            <p className="max-w-2xl text-base leading-7 text-espresso-600 sm:text-lg">
              Not sure where to begin? Choose what you would like to address and
              our providers will build a complimentary, personalized plan.
            </p>
            <div className="mt-6 flex flex-wrap gap-2.5">
              {CONCERNS.map((concern) => (
                <button
                  key={concern}
                  type="button"
                  onClick={() => openBooking(`Concern: ${concern}`)}
                  className="rounded-full border border-line-strong bg-card px-4 py-2.5 text-xs text-espresso-700 transition duration-300 hover:-translate-y-0.5 hover:border-espresso-900 hover:bg-espresso-900 hover:text-canvas"
                >
                  {concern}
                </button>
              ))}
            </div>
          </div>
        </Reveal>

        <div className="space-y-24 pt-20 sm:space-y-32">
          {GROUPS.map((group) => (
            <div key={group.id} id={group.id} className="scroll-mt-36">
              <Reveal className="mb-8 flex items-end justify-between gap-5">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-espresso-500">
                    {group.eyebrow}
                  </p>
                  <h3 className="mt-2 text-4xl font-normal tracking-[-0.025em] text-espresso-900 sm:text-5xl">
                    {group.title}
                  </h3>
                </div>
                <div className="flex shrink-0 gap-2">
                  <button
                    type="button"
                    onClick={() => scrollRow(group.id, -1)}
                    disabled={!carouselState[group.id]?.canScrollBack}
                    aria-label={`Previous ${group.title}`}
                    className="flex h-11 w-11 items-center justify-center rounded-full border border-line-strong text-espresso-600 transition hover:border-espresso-900 hover:bg-espresso-900 hover:text-canvas disabled:cursor-not-allowed disabled:border-line disabled:text-espresso-300 disabled:opacity-60 disabled:hover:bg-transparent"
                  >
                    <ArrowIcon direction="left" />
                  </button>
                  <button
                    type="button"
                    onClick={() => scrollRow(group.id, 1)}
                    disabled={!carouselState[group.id]?.canScrollForward}
                    aria-label={`Next ${group.title}`}
                    className="flex h-11 w-11 items-center justify-center rounded-full border border-line-strong text-espresso-600 transition hover:border-espresso-900 hover:bg-espresso-900 hover:text-canvas disabled:cursor-not-allowed disabled:border-line disabled:text-espresso-300 disabled:opacity-60 disabled:hover:bg-transparent"
                  >
                    <ArrowIcon direction="right" />
                  </button>
                </div>
              </Reveal>

              <div
                ref={(node) => {
                  rows.current[group.id] = node;
                }}
                onScroll={() => updateCarouselState(group.id)}
                className="service-track hide-scrollbar grid snap-x snap-mandatory grid-flow-col gap-6 overflow-x-auto scroll-smooth pb-3"
              >
                {group.treatments.map((treatment) => (
                  <article
                    key={treatment.title}
                    className="group flex min-w-0 snap-start flex-col overflow-hidden rounded-[30px] bg-card"
                  >
                    <div className="relative aspect-[4/3] overflow-hidden bg-stone">
                      <div className="absolute inset-0 transition-transform duration-700 ease-out group-hover:scale-[1.035]">
                        <ScreenshotCrop {...treatment.crop} alt={treatment.alt} />
                      </div>
                    </div>
                    <div className="flex min-h-[310px] flex-1 flex-col p-7 sm:min-h-[330px] sm:p-8">
                      <h4 className="text-2xl font-normal leading-tight tracking-[-0.02em] text-espresso-900 sm:text-[28px]">
                        {treatment.title}
                      </h4>
                      <p className="mt-4 flex-1 text-[15px] leading-7 text-espresso-700 sm:text-base">
                        {treatment.description}
                      </p>
                      <button
                        type="button"
                        onClick={() => openBooking(treatment.title)}
                        className="mt-7 w-full rounded-full border border-espresso-900 px-6 py-3.5 text-sm text-espresso-900 transition duration-300 hover:bg-espresso-900 hover:text-canvas"
                      >
                        Find out more
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
