"use client";

import Image from "next/image";
import { useCallback, useRef, useState } from "react";
import Reveal from "@/components/Reveal";

const CREDENTIALS = [
  {
    title: "Physician-Led Care",
    body: "Our medical director oversees all protocols, ensuring the highest standards of safety and efficacy.",
    icon: (
      <path
        d="M12 2.5 14.6 5l3.5.4-.7 3.4 1.8 3-3.1 1.7-1 3.4-3.1-1.4-3.1 1.4-1-3.4-3.1-1.7 1.8-3L5.9 5.4 9.4 5 12 2.5Z" // Star icon
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
    ),
  },
  {
    title: "Expert Injector Team",
    body: "Our PA & RN injectors are highly trained in advanced techniques for natural, balanced results.",
    icon: (
      <>
        {/* Head */}
        <circle cx="12" cy="9" r="5.5" stroke="currentColor" strokeWidth="1.3" />
        {/* Body */}
        <path
          d="M9 13.8 7.8 21l4.2-2.4L16.2 21 15 13.8" 
          stroke="currentColor"
          strokeWidth="1.3"
          strokeLinejoin="round"
        />
      </>
    ),
  },
  {
    title: "Advanced Technology",
    body: "We utilize industry-leading devices like BBL Hero, Sofwave, and SkinPen for superior outcomes.",
    icon: (
      <path
        d="M7 3v5a5 5 0 0 0 10 0V3M12 13v3.5a4.5 4.5 0 0 0 9 0V14M21 12.5v0a2 2 0 1 0 0 4" // Syringe/device icon
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
    ),
  },
  {
    title: "Personalized Artistry",
    body: "Each treatment plan is customized to enhance your natural features and achieve your aesthetic goals.",
    icon: (
      <path
        d="m12 3 2.2 4.9 5.3.6-3.9 3.6 1 5.2L12 14.8 7.4 17.3l1-5.2-3.9-3.6 5.3-.6L12 3Z" // Diamond/precision icon
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
    ),
  },
];

const STATS = [
  { value: "10+", label: "Years of Combined Experience" },
  { value: "1000+", label: "5-Star Google Reviews" },
  { value: "4.9", label: "Overall Rating" },
];

function BeforeAfterSlider() {
  const [position, setPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const draggingRef = useRef(false);

  const updateFromClientX = useCallback((clientX: number) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const pct = ((clientX - rect.left) / rect.width) * 100;
    setPosition(Math.min(100, Math.max(0, pct)));
  }, []);

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    draggingRef.current = true;
    (e.currentTarget as HTMLDivElement).setPointerCapture(e.pointerId);
    updateFromClientX(e.clientX);
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!draggingRef.current) return;
    updateFromClientX(e.clientX);
  };

  const stopDragging = () => {
    draggingRef.current = false;
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      setPosition((p) => Math.max(0, p - 3));
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      setPosition((p) => Math.min(100, p + 3));
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative aspect-[4/5] w-full cursor-ew-resize touch-none select-none overflow-hidden rounded-2xl border border-[#E8E3DC] shadow-lift"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={stopDragging}
      onPointerCancel={stopDragging}
      onPointerLeave={stopDragging}
    >
      <Image
        src="https://images.unsplash.com/photo-1599388136433-360d34a83533?auto=format&fit=crop&w=800&q=80"
        alt="Before treatment: skin with fine lines and uneven tone"
        fill
        loading="lazy"
        sizes="(max-width: 1024px) 90vw, 420px"
        className="object-cover"
        draggable={false}
      />
      <div
        className="absolute inset-0"
        style={{ clipPath: `inset(0 0 0 ${position}%)` }}
      >
        <Image
          src="https://images.unsplash.com/photo-1618043299361-9934d7374266?auto=format&fit=crop&w=800&q=80"
          alt="After treatment: smoother, more even-toned skin"
          fill
          loading="lazy"
          sizes="(max-width: 1024px) 90vw, 420px"
          className="object-cover"
          draggable={false}
        />
      </div>

      <span className="absolute left-4 top-4 rounded-full bg-charcoal-950/70 px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-[0.24em] text-cream-50 backdrop-blur-sm">
        Before
      </span>
      <span className="absolute right-4 top-4 rounded-full bg-[#382015]/90 px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-[0.24em] text-white backdrop-blur-sm">
        After
      </span>

      <div
        className="pointer-events-none absolute inset-y-0"
        style={{ left: `${position}%` }}
      >
        <div className="absolute inset-y-0 -left-px w-0.5 bg-[#FAF8F5] shadow-soft" />
        <div
          className="absolute top-1/2 left-1/2 flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-[#D5CEC5] bg-[#FAF8F5] text-[#382015] shadow-lift"
          role="slider"
          tabIndex={0}
          aria-label="Reveal before and after results"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(position)}
          onKeyDown={onKeyDown}
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
            <path
              d="M8.5 7.5 4 12l4.5 4.5M15.5 7.5 20 12l-4.5 4.5"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}

export default function Results() {
  return (
    <section id="results" className="bg-[#FAF8F5] py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
          <Reveal>
            <div className="relative mx-auto max-w-md">
              <div
                className="absolute -inset-4 -z-10 rounded-2xl border border-[#D5CEC5]"
                aria-hidden="true"
              />
              <BeforeAfterSlider />
              <p className="mt-4 text-center text-xs italic text-[#6E5E54]">
                Drag the handle to compare. Unretouched client, 60 days after a
                personalized treatment plan.
              </p>
            </div>
          </Reveal>

          <div>
            <Reveal>
              <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#6E5E54]">
                The Elysian Difference
              </p>
              <h2 className="mt-4 font-display text-4xl leading-tight text-[#382015] sm:text-5xl">
                Visible Results,
                <span className="block italic text-[#382015]">
                  Unmistakably You
                </span>
              </h2>
              <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-[#6E5E54]">
                Our physician-led team delivers visible, sophisticated results
                that enhance your natural beauty and boost your confidence.
              </p>
            </Reveal>

            <div className="mt-9 grid gap-5 sm:grid-cols-2">
              {CREDENTIALS.map((c, i) => (
                <Reveal key={c.title} delay={i * 0.08}>
                  <div className="flex h-full gap-4 rounded-2xl border border-[#E8E3DC] bg-[#F6F4F0] p-5 shadow-sm">
                    <span className="mt-0.5 text-[#382015]">
                      <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" aria-hidden="true">
                        {c.icon}
                      </svg>
                    </span>
                    <div>
                      <h3 className="font-display text-base text-[#382015]">
                        {c.title}
                      </h3>
                      <p className="mt-1.5 text-[13px] leading-relaxed text-[#6E5E54]">
                        {c.body}
                      </p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>

            <Reveal delay={0.15}>
              <div className="mt-9 flex flex-wrap items-center gap-x-10 gap-y-6 border-t border-[#D5CEC5] pt-8">
                {STATS.map((s) => (
                  <div key={s.label}>
                    <p className="font-display text-4xl text-[#382015]">
                      {s.value}
                    </p>
                    <p className="mt-1 text-[11px] font-bold uppercase tracking-[0.22em] text-[#6E5E54]">
                      {s.label}
                    </p>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
