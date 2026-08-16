"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { COOKIE_PREFERENCES_EVENT } from "@/components/CookieBanner";
import { useBooking } from "@/lib/booking-context";

type LegalKind = "privacy" | "terms" | null;

const EXPLORE_LINKS = [
  { label: "About Us", href: "/#approach" },
  { label: "Treatments", href: "/#treatments" },
  { label: "Expert Providers", href: "/#providers" },
  { label: "Programs", href: "/#programs" },
  { label: "Specials", href: "/#specials" },
  { label: "Blog", href: "/blog" },
];

const MAP_URL =
  "https://www.google.com/maps/search/?api=1&query=5717%20Legacy%20Drive%20Suite%20170%2C%20Plano%2C%20TX%2075024";

function ElysianMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 54 64"
      aria-hidden="true"
      className={className}
      fill="currentColor"
    >
      <path d="M5 5h44a22 22 0 0 1-44 0Z" />
      <path d="M13 59a14 14 0 0 1 28 0v1H13Z" />
    </svg>
  );
}

function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [message, setMessage] = useState("");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setMessage("");

    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });
      const data = (await response.json().catch(() => ({}))) as {
        ok?: boolean;
        error?: string;
      };

      if (response.ok && data.ok) {
        setStatus("success");
        setEmail("");
        setMessage(
          "You’re on the Elysian list. Look out for exclusive offers and expert skin guidance.",
        );
        return;
      }

      setStatus("error");
      setMessage(data.error ?? "We couldn’t add you just now. Please try again.");
    } catch {
      setStatus("error");
      setMessage("We couldn’t connect. Please check your connection and try again.");
    }
  }

  return (
    <form onSubmit={onSubmit}>
      <label
        htmlFor="newsletter-email"
        className="text-[11px] font-bold uppercase tracking-[0.24em] text-card"
      >
        Glow with us
      </label>
      <p className="mt-4 max-w-sm text-sm leading-relaxed text-stone/75">
        Join our list for exclusive offers, expert skincare tips, and first
        access to what’s new at Elysian Aesthetics &amp; Wellness.
      </p>
      <div className="mt-5 flex flex-col gap-2 sm:flex-row lg:flex-col xl:flex-row">
        <input
          id="newsletter-email"
          name="email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(event) => {
            setEmail(event.target.value);
            if (status !== "loading") {
              setStatus("idle");
              setMessage("");
            }
          }}
          placeholder="Email address"
          aria-describedby={message ? "newsletter-status" : undefined}
          className="min-w-0 flex-1 rounded-full border border-espresso-700 bg-espresso-950/20 px-5 py-3.5 text-sm text-canvas placeholder:text-espresso-300 focus:border-champagne-400 focus:outline-none"
        />
        <button
          type="submit"
          disabled={status === "loading"}
          aria-busy={status === "loading"}
          className="shrink-0 rounded-full bg-canvas px-6 py-3.5 text-[11px] font-bold uppercase tracking-[0.18em] text-espresso-900 transition-all duration-300 hover:-translate-y-0.5 hover:bg-stone disabled:cursor-wait disabled:opacity-60"
        >
          {status === "loading" ? "Joining…" : "Join the list"}
        </button>
      </div>
      <AnimatePresence mode="wait">
        {message && (
          <motion.p
            id="newsletter-status"
            key={message}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            role="status"
            aria-live="polite"
            className={`mt-3 text-xs leading-relaxed ${
              status === "success" ? "text-card" : "text-red-300"
            }`}
          >
            {message}
          </motion.p>
        )}
      </AnimatePresence>
    </form>
  );
}

function LegalModal({ kind, onClose }: { kind: LegalKind; onClose: () => void }) {
  const dialogRef = useRef<HTMLElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!kind) return;

    const previousOverflow = document.body.style.overflow;
    previousFocusRef.current =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
    const focusFrame = window.requestAnimationFrame(() => {
      closeButtonRef.current?.focus();
    });

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
        return;
      }

      if (event.key !== "Tab" || !dialogRef.current) return;

      const focusable = Array.from(
        dialogRef.current.querySelectorAll<HTMLElement>(
          'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ),
      );
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (!first || !last) {
        event.preventDefault();
        dialogRef.current.focus();
      } else if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKeyDown);

    return () => {
      window.cancelAnimationFrame(focusFrame);
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
      previousFocusRef.current?.focus();
    };
  }, [kind, onClose]);

  const isPrivacy = kind === "privacy";

  return (
    <AnimatePresence>
      {kind && (
        <motion.div
          className="fixed inset-0 z-[90] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <button
            type="button"
            aria-label="Close legal information"
            onClick={onClose}
            className="absolute inset-0 h-full w-full bg-espresso-950/80 backdrop-blur-sm"
          />
          <motion.section
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="legal-title"
            aria-describedby="legal-description"
            tabIndex={-1}
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="relative max-h-[82vh] w-full max-w-xl overflow-y-auto rounded-2xl border border-line-strong bg-canvas p-7 shadow-lift sm:p-10"
          >
            <button
              type="button"
              onClick={onClose}
              ref={closeButtonRef}
              aria-label="Close"
              className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-full border border-line-strong text-espresso-800 transition-colors hover:bg-card"
            >
              <svg
                viewBox="0 0 24 24"
                className="h-4 w-4"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M6 6l12 12M18 6 6 18"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                />
              </svg>
            </button>

            <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-espresso-500">
              Elysian Aesthetics &amp; Wellness
            </p>
            <h2 id="legal-title" className="mt-3 pr-10 font-display text-3xl text-espresso-900">
              {isPrivacy ? "Privacy Policy" : "Terms of Service"}
            </h2>

            {isPrivacy ? (
              <div
                id="legal-description"
                className="mt-6 space-y-4 text-sm leading-relaxed text-espresso-600"
              >
                <p>
                  Elysian Aesthetics &amp; Wellness uses the contact and appointment
                  information you choose to share to respond to requests,
                  coordinate care, operate this website, and communicate with you
                  when permitted.
                </p>
                <p>
                  Essential cookies support core site functions. Optional analytics
                  and marketing cookies are used only according to the preferences
                  you select. Elysian Aesthetics &amp; Wellness does not sell your
                  personal information.
                </p>
                <p>
                  To ask about, correct, or request deletion of information you have
                  shared with us, email{" "}
                  <a
                    className="font-bold text-espresso-900 underline underline-offset-4"
                    href="mailto:hello@elysianaesthetics.com"
                  >
                    hello@elysianaesthetics.com
                  </a>
                  .
                </p>
              </div>
            ) : (
              <div
                id="legal-description"
                className="mt-6 space-y-4 text-sm leading-relaxed text-espresso-600"
              >
                <p>
                  Information on this website is educational and is not a diagnosis,
                  treatment plan, or substitute for advice from a qualified medical
                  professional.
                </p>
                <p>
                  All medical treatments require an appropriate consultation.
                  Eligibility, pricing, and the final treatment plan are confirmed by
                  the Elysian Aesthetics &amp; Wellness clinical team. Individual
                  results vary and are not guaranteed.
                </p>
                <p>
                  An online booking request is not confirmed until you receive a
                  confirmation from Elysian Aesthetics &amp; Wellness. Financing and
                  membership programs are subject to their applicable provider
                  terms.
                </p>
              </div>
            )}

            <div className="mt-7 border-t border-line pt-5 text-xs text-espresso-500">
              Questions? Call{" "}
              <a
                href="tel:+19726366299"
                className="font-bold text-espresso-900 underline underline-offset-4"
              >
                (972) 636-6299
              </a>
              .
            </div>
          </motion.section>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function Footer() {
  const { openBooking } = useBooking();
  const [legal, setLegal] = useState<LegalKind>(null);

  function openCookiePreferences() {
    window.dispatchEvent(new CustomEvent(COOKIE_PREFERENCES_EVENT));
  }

  return (
    <footer
      id="locations"
      className="scroll-mt-24 overflow-hidden bg-espresso-900 text-stone"
    >
      <div className="mx-auto max-w-[1720px] px-5 sm:px-10 lg:px-16">
        <div className="grid gap-8 border-b border-espresso-700 py-14 sm:py-16 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-champagne-300">
              Complimentary consultations
            </p>
            <h2 className="mt-4 max-w-3xl font-display text-3xl leading-tight text-canvas sm:text-4xl lg:text-5xl">
              Let’s create a treatment plan that still feels like you.
            </h2>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => openBooking("Complimentary Consultation")}
              className="rounded-full bg-canvas px-7 py-3.5 text-[11px] font-bold uppercase tracking-[0.18em] text-espresso-900 transition-all duration-300 hover:-translate-y-0.5 hover:bg-stone"
            >
              Book your visit
            </button>
            <a
              href="tel:+19726366299"
              className="rounded-full border border-espresso-600 px-7 py-3.5 text-center text-[11px] font-bold uppercase tracking-[0.18em] text-card transition-all duration-300 hover:-translate-y-0.5 hover:border-champagne-300 hover:text-canvas"
            >
              Call (972) 636-6299
            </a>
          </div>
        </div>

        <div className="grid gap-12 py-14 sm:py-16 md:grid-cols-2 lg:grid-cols-[1.15fr_.7fr_1fr_1.25fr] lg:gap-10">
          <div>
            <Link
              href="/"
              aria-label="Elysian Aesthetics & Wellness home"
              className="inline-flex items-center gap-3 text-canvas"
            >
              <ElysianMark className="h-14 w-12" />
              <span>
                <span className="block font-display text-2xl leading-none">
                  Elysian
                </span>
                <span className="mt-1 block text-[8px] font-bold uppercase tracking-[0.2em] text-champagne-300">
                  Aesthetics &amp; Wellness
                </span>
              </span>
            </Link>
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-stone/75">
              Medical precision. Personalized artistry. Thoughtful aesthetic
              and wellness care in Plano, Texas.
            </p>
            <p className="mt-6 text-xs font-bold uppercase tracking-[0.18em] text-champagne-300">
              Fairview &amp; Allen, TX
              <span className="mt-1 block font-normal normal-case tracking-normal text-stone/60">
                Coming soon
              </span>
            </p>
          </div>

          <nav aria-label="Footer navigation">
            <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-card">
              Explore
            </p>
            <ul className="mt-5 space-y-3">
              {EXPLORE_LINKS.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-stone/75 transition-colors hover:text-canvas"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-card">
              The Shops at Legacy
            </p>
            <address className="mt-5 not-italic text-sm leading-relaxed text-stone/75">
              <a
                href={MAP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-canvas"
              >
                5717 Legacy Drive, Suite 170
                <br />
                Plano, TX 75024
              </a>
            </address>
            <div className="mt-5 space-y-1 text-sm text-stone/75">
              <p>Tuesday–Friday: 9:00 AM–6:00 PM</p>
              <p>Saturday: 9:00 AM–5:00 PM</p>
              <p>Sunday &amp; Monday: Closed</p>
            </div>
            <div className="mt-5 space-y-1 text-sm">
              <a
                href="tel:+19726366299"
                className="block text-stone/75 transition-colors hover:text-canvas"
              >
                (972) 636-6299
              </a>
              <a
                href="mailto:hello@elysianaesthetics.com"
                className="block text-stone/75 transition-colors hover:text-canvas"
              >
                hello@elysianaesthetics.com
              </a>
            </div>
          </div>

          <NewsletterForm />
        </div>

        <div className="border-t border-espresso-700 py-8">
          <p className="max-w-5xl text-xs leading-relaxed text-stone/50">
            Individual results vary and are not guaranteed. Treatment candidacy
            and recommendations are determined during consultation with a
            qualified provider. This website is for general informational
            purposes and does not constitute medical advice.
          </p>
          <div className="mt-6 flex flex-col gap-4 text-xs text-stone/60 sm:flex-row sm:items-center sm:justify-between">
            <p suppressHydrationWarning>
              © {new Date().getFullYear()} Elysian Aesthetics &amp; Wellness. All
              rights reserved.
            </p>
            <div className="flex flex-wrap gap-x-6 gap-y-3">
              <button
                type="button"
                onClick={() => setLegal("privacy")}
                className="transition-colors hover:text-canvas"
              >
                Privacy Policy
              </button>
              <button
                type="button"
                onClick={() => setLegal("terms")}
                className="transition-colors hover:text-canvas"
              >
                Terms of Service
              </button>
              <button
                type="button"
                onClick={openCookiePreferences}
                className="transition-colors hover:text-canvas"
              >
                Cookie Preferences
              </button>
            </div>
          </div>
        </div>
      </div>

      <LegalModal kind={legal} onClose={() => setLegal(null)} />
    </footer>
  );
}
