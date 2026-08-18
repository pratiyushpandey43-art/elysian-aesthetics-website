"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useState } from "react";
import Reveal from "@/components/Reveal";

const FAQ_ITEMS = [
  {
    id: "treatment-selection",
    question: "How do I know which treatments are right for me?",
    answer:
      "100% complimentary consultations with customized facial assessment.",
  },
  {
    id: "provider-qualifications",
    question: "Are your providers licensed and experienced?",
    answer:
      "Board-Certified Physician Associates (PA-C), Registered Nurses (RN), Certified Laser Practitioners (CLT), and Medical Estheticians (CME).",
  },
  {
    id: "financing",
    question: "Do you offer financing options?",
    answer:
      "0% APR options available through Cherry Financial and CareCredit with instant soft credit check.",
  },
  {
    id: "treatment-costs",
    question: "How much do your treatments cost?",
    answer:
      "Transparent dosing estimates provided during the complimentary consultation before starting.",
  },
  {
    id: "comfort",
    question: "What if I am nervous about needles or discomfort?",
    answer:
      "Multi-layer comfort protocol: prescription topical numbing, Pro-Nox laughing gas, and chilled air cooling.",
  },
  {
    id: "memberships",
    question: "How does the Botox & Dysport Bank and Membership work?",
    answer:
      "$149/month applied 100% toward treatment bank, locking in lowest per-unit rates and 15% off skincare.",
  },
] as const;

export default function FAQSection() {
  const [openItem, setOpenItem] = useState<string | null>(FAQ_ITEMS[0].id);
  const reduceMotion = useReducedMotion();

  return (
    <section
      id="faq"
      className="scroll-mt-24 bg-[#FAF8F5] py-24 sm:py-32"
      aria-labelledby="faq-heading"
    >
      <div className="mx-auto grid max-w-7xl gap-12 px-5 sm:px-8 lg:grid-cols-[0.72fr_1.28fr] lg:gap-20">
        <Reveal>
          <div className="lg:sticky lg:top-32">
            <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#6E5E54]">
              Good to know
            </p>
            <h2
              id="faq-heading"
              className="mt-4 max-w-md font-display text-4xl leading-tight text-[#382015] sm:text-5xl"
            >
              Frequently asked questions
            </h2>
            <p className="mt-6 max-w-md text-base leading-relaxed text-[#6E5E54]">
              Clear answers are part of thoughtful care. Here is what to expect
              before beginning your treatment journey with Elysian Aesthetics &amp;
              Wellness.
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="overflow-hidden rounded-3xl border border-[#D5CEC5] bg-[#F6F4F0] px-5 sm:px-8">
            {FAQ_ITEMS.map((item) => {
              const isOpen = openItem === item.id;
              const triggerId = `faq-trigger-${item.id}`;
              const panelId = `faq-panel-${item.id}`;

              return (
                <motion.div
                  layout={!reduceMotion}
                  key={item.id}
                  className="border-b border-[#D5CEC5] last:border-b-0"
                >
                  <h3>
                    <button
                      id={triggerId}
                      type="button"
                      onClick={() => setOpenItem(isOpen ? null : item.id)}
                      aria-expanded={isOpen}
                      aria-controls={panelId}
                      className="group flex w-full items-center justify-between gap-6 py-7 text-left sm:py-8"
                    >
                      <span className="font-display text-xl leading-snug text-[#382015] sm:text-2xl">
                        {item.question}
                      </span>
                      <motion.span
                        className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#A99D95] text-[#382015] transition-colors duration-300 group-hover:border-[#382015] group-hover:bg-[#EBE7E0]"
                        animate={{ rotate: isOpen ? 180 : 0 }}
                        transition={{
                          duration: reduceMotion ? 0 : 0.35,
                          ease: [0.22, 1, 0.36, 1],
                        }}
                        aria-hidden="true"
                      >
                        <span className="absolute h-px w-4 bg-current" />
                        <motion.span
                          className="absolute h-4 w-px bg-current"
                          animate={{
                            rotate: isOpen ? 90 : 0,
                            opacity: isOpen ? 0 : 1,
                          }}
                          transition={{ duration: reduceMotion ? 0 : 0.25 }}
                        />
                      </motion.span>
                    </button>
                  </h3>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        id={panelId}
                        role="region"
                        aria-labelledby={triggerId}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{
                          height: {
                            duration: reduceMotion ? 0 : 0.4,
                            ease: [0.22, 1, 0.36, 1],
                          },
                          opacity: { duration: reduceMotion ? 0 : 0.25 },
                        }}
                        className="overflow-hidden"
                      >
                        <p className="max-w-2xl pb-8 pr-12 text-base leading-relaxed text-[#6E5E54] sm:pr-20">
                          {item.answer}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
