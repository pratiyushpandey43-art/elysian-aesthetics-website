"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

type Consent = {
  necessary: true;
  analytics: boolean;
  marketing: boolean;
};

const STORAGE_KEY = "elysian-cookie-consent";

export const COOKIE_PREFERENCES_EVENT = "elysian:open-cookie-preferences";
export const COOKIE_CONSENT_UPDATED_EVENT = "elysian:cookie-consent-updated";

const DEFAULT_CONSENT: Consent = {
  necessary: true,
  analytics: false,
  marketing: false,
};

function readStoredConsent(): Consent | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw) as Partial<Consent>;
    return {
      necessary: true,
      analytics: Boolean(parsed.analytics),
      marketing: Boolean(parsed.marketing),
    };
  } catch {
    return null;
  }
}

function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (value: boolean) => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors duration-300 ${
        checked ? "bg-champagne-500" : "bg-espresso-300"
      }`}
    >
      <span
        className={`h-[18px] w-[18px] rounded-full bg-canvas shadow-soft transition-transform duration-300 ${
          checked ? "translate-x-[22px]" : "translate-x-[3px]"
        }`}
      />
    </button>
  );
}

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);
  const [consent, setConsent] = useState<Consent>(DEFAULT_CONSENT);

  useEffect(() => {
    const stored = readStoredConsent();
    if (stored) {
      // Storage is client-only; hydrate the saved preference after mount.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setConsent(stored);
    } else {
      setVisible(true);
    }

    const openPreferences = () => {
      setConsent(readStoredConsent() ?? DEFAULT_CONSENT);
      setVisible(true);
    };

    const syncConsent = (event: StorageEvent) => {
      if (event.key !== STORAGE_KEY) return;

      const next = readStoredConsent();
      if (next) {
        setConsent(next);
        setVisible(false);
      } else {
        setConsent(DEFAULT_CONSENT);
        setVisible(true);
      }
    };

    window.addEventListener(COOKIE_PREFERENCES_EVENT, openPreferences);
    window.addEventListener("storage", syncConsent);

    return () => {
      window.removeEventListener(COOKIE_PREFERENCES_EVENT, openPreferences);
      window.removeEventListener("storage", syncConsent);
    };
  }, []);

  function persist(next: Consent) {
    setConsent(next);

    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // When storage is unavailable, the choice still applies for this session.
    }

    window.dispatchEvent(
      new CustomEvent(COOKIE_CONSENT_UPDATED_EVENT, { detail: next }),
    );
    setVisible(false);
  }

  const acceptAll = () =>
    persist({ necessary: true, analytics: true, marketing: true });
  const rejectNonEssential = () =>
    persist({ necessary: true, analytics: false, marketing: false });
  const savePreferences = () => persist(consent);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-x-3 bottom-3 z-[70] sm:inset-x-6 sm:bottom-6"
          initial={{ opacity: 0, y: 80 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 80 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        >
          <div
            role="dialog"
            aria-modal="false"
            aria-labelledby="cookie-title"
            aria-describedby="cookie-description"
            className="mx-auto max-w-3xl rounded-2xl border border-line-strong bg-canvas p-5 shadow-lift sm:p-8"
          >
            <div className="flex items-start gap-4">
              <span className="hidden h-11 w-11 shrink-0 items-center justify-center rounded-full bg-stone text-espresso-900 sm:flex">
                <svg
                  viewBox="0 0 24 24"
                  className="h-6 w-6"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M12 3a9 9 0 1 0 9 9 3.2 3.2 0 0 1-4.2-4.2A3.2 3.2 0 0 1 12 3Z"
                    stroke="currentColor"
                    strokeWidth="1.4"
                    strokeLinejoin="round"
                  />
                  <circle cx="9" cy="10" r="1" fill="currentColor" />
                  <circle cx="12.5" cy="14.5" r="1" fill="currentColor" />
                  <circle cx="8.5" cy="14.5" r="0.9" fill="currentColor" />
                </svg>
              </span>
              <div>
                <h2 id="cookie-title" className="font-display text-xl text-espresso-900">
                  Your privacy at Elysian
                </h2>
                <p
                  id="cookie-description"
                  className="mt-2 text-sm leading-relaxed text-espresso-600"
                >
                  We use essential cookies to keep our site and booking experience
                  working. With your permission, analytics help us improve the site
                  and marketing cookies help us measure relevant offers. You can
                  change your choice anytime from Cookie Preferences in the footer.
                </p>
              </div>
            </div>

            <div className="mt-6 space-y-4 border-t border-line pt-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="flex flex-wrap items-center gap-2 text-sm font-bold text-espresso-900">
                    Strictly necessary
                    <span className="rounded-full bg-line px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.14em] text-espresso-600">
                      Always active
                    </span>
                  </p>
                  <p className="mt-1 text-xs leading-relaxed text-espresso-600">
                    Required for core site functions, secure booking, and remembering
                    your consent choice.
                  </p>
                </div>
                <span className="mt-1 text-espresso-500" title="Always active">
                  <svg
                    viewBox="0 0 24 24"
                    className="h-5 w-5"
                    fill="none"
                    aria-hidden="true"
                  >
                    <rect
                      x="5.5"
                      y="10.5"
                      width="13"
                      height="9"
                      rx="2"
                      stroke="currentColor"
                      strokeWidth="1.4"
                    />
                    <path
                      d="M8.5 10.5V8a3.5 3.5 0 0 1 7 0v2.5"
                      stroke="currentColor"
                      strokeWidth="1.4"
                    />
                  </svg>
                </span>
              </div>

              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-bold text-espresso-900">Analytics</p>
                  <p className="mt-1 text-xs leading-relaxed text-espresso-600">
                    Usage insights that help us make the website and booking journey
                    easier to use.
                  </p>
                </div>
                <Toggle
                  checked={consent.analytics}
                  onChange={(value) =>
                    setConsent((current) => ({ ...current, analytics: value }))
                  }
                  label="Analytics cookies"
                />
              </div>

              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-bold text-espresso-900">Marketing</p>
                  <p className="mt-1 text-xs leading-relaxed text-espresso-600">
                    Helps us measure campaigns and share more relevant Elysian
                    offers.
                  </p>
                </div>
                <Toggle
                  checked={consent.marketing}
                  onChange={(value) =>
                    setConsent((current) => ({ ...current, marketing: value }))
                  }
                  label="Marketing cookies"
                />
              </div>
            </div>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
              <button
                type="button"
                onClick={acceptAll}
                className="rounded-full bg-espresso-900 px-7 py-3 text-[11px] font-bold uppercase tracking-[0.18em] text-canvas shadow-soft transition-all duration-300 hover:-translate-y-0.5 hover:bg-espresso-950"
              >
                Accept all
              </button>
              <button
                type="button"
                onClick={rejectNonEssential}
                className="rounded-full border border-line-strong px-7 py-3 text-[11px] font-bold uppercase tracking-[0.18em] text-espresso-800 transition-all duration-300 hover:-translate-y-0.5 hover:border-espresso-900 hover:bg-card"
              >
                Reject non-essential
              </button>
              <button
                type="button"
                onClick={savePreferences}
                className="px-3 py-2 text-[11px] font-bold uppercase tracking-[0.18em] text-espresso-900 underline-offset-4 transition-colors hover:text-espresso-950 hover:underline sm:ml-auto"
              >
                Save preferences
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
