"use client";

import Reveal from "@/components/Reveal";
import { useBooking } from "@/lib/booking-context";

const MEMBERSHIP_BENEFITS = [
  "Save up to 20% on treatments and 15% off medical-grade skincare.",
  "Bank $149/month with zero expiration; 100% applies directly to treatments.",
];

const FINANCING_BENEFITS = [
  "0% APR plans",
  "Flexible terms up to 60 months",
  "Soft credit check",
];

export default function Programs() {
  const { openBooking } = useBooking();

  return (
    <section
      id="programs"
      aria-labelledby="programs-heading"
      className="scroll-mt-24 bg-canvas py-20 sm:py-28"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal className="grid gap-5 border-b border-line pb-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-espresso-600">
              Memberships &amp; financing
            </p>
            <h2
              id="programs-heading"
              className="mt-4 font-display text-4xl leading-[1.05] text-espresso-900 sm:text-5xl lg:text-6xl"
            >
              Make your plan work for you.
            </h2>
          </div>
          <p className="max-w-2xl text-base leading-7 text-espresso-600 lg:justify-self-end lg:text-lg">
            Flexible ways to save, bank treatment funds, and pay over time while
            keeping your care personalized to your goals.
          </p>
        </Reveal>

        <div className="mt-10 grid gap-5 lg:grid-cols-2">
          <Reveal>
            <article
              id="membership"
              className="flex h-full scroll-mt-28 flex-col overflow-hidden rounded-2xl bg-espresso-900 p-7 text-canvas shadow-soft sm:p-10"
            >
              <div className="flex flex-wrap items-start justify-between gap-5">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-espresso-300">
                    Elysian membership
                  </p>
                  <h3 className="mt-3 max-w-md font-display text-3xl leading-tight text-canvas sm:text-4xl">
                    Elysian Membership &amp; Injectable Bank
                  </h3>
                </div>
                <div className="rounded-full border border-canvas/25 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-canvas">
                  Zero expiration
                </div>
              </div>

              <ul className="mt-9 space-y-4" aria-label="Elysian membership benefits">
                {MEMBERSHIP_BENEFITS.map((benefit) => (
                  <li
                    key={benefit}
                    className="flex items-start gap-3 border-b border-canvas/15 pb-4 text-sm leading-6 text-stone sm:text-base"
                  >
                    <CheckIcon className="mt-1 text-canvas" />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-auto pt-9">
                <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <p className="font-display text-5xl leading-none text-canvas">
                      $149
                      <span className="ml-2 font-body text-sm text-espresso-300">
                        / month
                      </span>
                    </p>
                    <p className="mt-3 max-w-xs text-sm leading-6 text-espresso-300">
                      100% applies directly to treatments.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => openBooking("Membership Consultation")}
                    className="inline-flex min-h-12 items-center justify-center rounded-full bg-canvas px-7 py-3 text-xs font-bold uppercase tracking-[0.18em] text-espresso-900 transition duration-300 hover:-translate-y-0.5 hover:bg-stone"
                  >
                    Join Membership
                  </button>
                </div>
              </div>
            </article>
          </Reveal>

          <Reveal delay={0.1}>
            <article
              id="financing"
              className="flex h-full scroll-mt-28 flex-col rounded-2xl border border-line bg-card p-7 shadow-soft sm:p-10"
            >
              <div className="flex flex-wrap items-start justify-between gap-5">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-espresso-600">
                    Flexible payment plans
                  </p>
                  <h3 className="mt-3 max-w-md font-display text-3xl leading-tight text-espresso-900 sm:text-4xl">
                    Cherry &amp; CareCredit Financing
                  </h3>
                </div>
                <div className="flex gap-2" aria-label="Financing partners">
                  <span className="rounded-full border border-line-strong bg-canvas px-3 py-2 text-[10px] font-bold uppercase tracking-[0.15em] text-espresso-800">
                    Cherry
                  </span>
                  <span className="rounded-full border border-line-strong bg-canvas px-3 py-2 text-[10px] font-bold uppercase tracking-[0.15em] text-espresso-800">
                    CareCredit
                  </span>
                </div>
              </div>

              <p className="mt-6 max-w-lg text-base leading-7 text-espresso-600">
                Choose a payment schedule that supports your personalized
                treatment plan.
              </p>

              <ul className="mt-7 space-y-4" aria-label="Financing benefits">
                {FINANCING_BENEFITS.map((benefit) => (
                  <li
                    key={benefit}
                    className="flex items-start gap-3 border-b border-line pb-4 text-sm leading-6 text-espresso-800 sm:text-base"
                  >
                    <CheckIcon className="mt-1 text-espresso-900" />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-auto flex flex-col gap-5 pt-9 sm:flex-row sm:items-center sm:justify-between">
                <p className="max-w-xs text-xs leading-5 text-espresso-600">
                  Offers are subject to approval, eligibility, and lender terms.
                </p>
                <button
                  type="button"
                  onClick={() => openBooking("Financing Consultation")}
                  className="inline-flex min-h-12 items-center justify-center rounded-full bg-espresso-900 px-7 py-3 text-xs font-bold uppercase tracking-[0.18em] text-white transition duration-300 hover:-translate-y-0.5 hover:bg-espresso-950"
                >
                  Apply for Financing
                </button>
              </div>
            </article>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 20 20"
      className={`h-4 w-4 shrink-0 ${className ?? ""}`}
      fill="none"
      aria-hidden="true"
    >
      <path
        d="m4 10.5 4 4 8-9"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
