"use client";

import Reveal from "@/components/Reveal";
import ScreenshotCrop from "@/components/ScreenshotCrop";
import { useBooking } from "@/lib/booking-context";

export default function ApproachSection() {
  const { openBooking } = useBooking();

  return (
    <section
      id="approach"
      className="scroll-mt-24 bg-[#FAF8F5] px-5 py-20 sm:px-8 sm:py-24 lg:py-28"
    >
      <Reveal className="mx-auto max-w-[1680px]">
        <div className="grid overflow-hidden rounded-3xl bg-[#EBE7E0] lg:grid-cols-2">
          <div className="relative aspect-[4/3] lg:aspect-auto lg:min-h-[700px]">
            <ScreenshotCrop
              src="/reference/approach.png"
              alt="An Elysian Aesthetics & Wellness clinician consulting with a patient"
              sourceWidth={1742}
              sourceHeight={722}
              cropX={80}
              cropY={24}
              cropWidth={780}
            />
          </div>

          <div className="flex items-center bg-[#EBE7E0] px-7 py-12 sm:px-12 sm:py-16 lg:px-14 xl:px-20">
            <div className="mx-auto w-full max-w-[570px]">
              <h2 className="font-display text-4xl leading-tight text-[#382015] sm:text-5xl lg:text-[3.25rem]">
                The Elysian approach
              </h2>

              <div className="mt-5 border-t border-[#382015]/30 pt-5">
                <p className="text-base leading-[1.55] text-[#382015] sm:text-[1.05rem]">
                  At Elysian Aesthetics &amp; Wellness, we combine{" "}
                  <em>medical-grade precision</em> with{" "}
                  <em>personalized artistry</em> to enhance your natural features.
                  Our comprehensive service menu – ranging from Botox and dermal
                  fillers to advanced laser resurfacing – is curated to address
                  your skin&apos;s unique needs at every stage of life.
                </p>
              </div>

              <div className="mt-5 border-t border-[#382015]/30 pt-5">
                <p className="text-base leading-[1.55] text-[#382015] sm:text-[1.05rem]">
                  We prioritize a &apos;foundation-first&apos; philosophy, focusing on
                  safety, education, and <em>long-term skin health</em>. Whether
                  you are seeking preventative pre-juvenation or corrective
                  treatments, our licensed providers create customized plans
                  using industry-leading technology like BBL Hero, Sofwave, and
                  SkinPen. Our goal is to deliver visible, sophisticated results
                  that leave you feeling refreshed and confident.
                </p>
              </div>

              <div className="mt-5 border-t border-[#382015]/30 pt-8">
                <button
                  type="button"
                  onClick={() => openBooking("Complimentary Consultation")}
                  className="inline-flex min-h-14 items-center justify-center rounded-full bg-[#382015] px-10 py-4 text-sm font-bold tracking-wide text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#2A160E] hover:shadow-lg"
                >
                  Book your visit
                </button>
              </div>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
