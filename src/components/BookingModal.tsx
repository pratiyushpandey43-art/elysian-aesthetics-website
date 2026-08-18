"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { useBooking } from "@/lib/booking-context";
import {
  FIRST_AVAILABLE_PROVIDER,
  PROVIDER_OPTIONS,
  SERVICE_GROUPS,
  WEEKDAY_TIME_SLOTS,
  getTimeSlotsForDate,
  getUpcomingBookingDays,
  isBookingService,
  isNamedProvider,
  type BookingDay,
} from "@/lib/booking-options";

const STEP_LABELS = ["Service", "Date & Time", "Your Details"];

export default function BookingModal() {
  const { isOpen, presetService, closeBooking } = useBooking();

  const [step, setStep] = useState(0);
  const [service, setService] = useState<string | null>(null);
  const [dateKey, setDateKey] = useState<string | null>(null);
  const [time, setTime] = useState<string | null>(null);
  const [provider, setProvider] = useState(FIRST_AVAILABLE_PROVIDER);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [confirmCode, setConfirmCode] = useState<string | null>(null);
  const [confirmationMode, setConfirmationMode] = useState<
    "database" | "demo" | null
  >(null);
  const [unavailableTimes, setUnavailableTimes] = useState<string[]>([]);
  const [availabilityStatus, setAvailabilityStatus] = useState<
    "idle" | "loading" | "ready" | "error"
  >("idle");

  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const stepHeadingRef = useRef<HTMLHeadingElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const availabilityRequestRef = useRef(0);

  const days = getUpcomingBookingDays();
  const selectedDay = days.find((day) => day.key === dateKey);
  const timeSlots = dateKey
    ? getTimeSlotsForDate(dateKey)
    : WEEKDAY_TIME_SLOTS;

  // Reset + preset whenever the modal opens.
  useEffect(() => {
    if (isOpen) {
      // Opening the dialog intentionally resets its transactional form state.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setStep(0);
      if (presetService?.startsWith("Consultation with ")) {
        const requestedProvider = presetService.replace("Consultation with ", "");
        setService("Complimentary Consultation");
        setProvider(
          isNamedProvider(requestedProvider)
            ? requestedProvider
            : FIRST_AVAILABLE_PROVIDER,
        );
      } else {
        setService(
          presetService && isBookingService(presetService)
            ? presetService
            : null,
        );
        setProvider(FIRST_AVAILABLE_PROVIDER);
      }
      setDateKey(null);
      setTime(null);
      setName("");
      setEmail("");
      setPhone("");
      setNotes("");
      setErrors({});
      setSubmitting(false);
      setConfirmCode(null);
      setConfirmationMode(null);
      setUnavailableTimes([]);
      setAvailabilityStatus("idle");
    }
  }, [isOpen, presetService]);

  // ESC to close, keyboard focus containment, return focus, and body scroll lock.
  useEffect(() => {
    if (!isOpen) return;

    previousFocusRef.current =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;

    const focusFrame = window.requestAnimationFrame(() => {
      closeButtonRef.current?.focus();
    });

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeBooking();
        return;
      }

      if (event.key !== "Tab" || !dialogRef.current) return;

      const focusable = Array.from(
        dialogRef.current.querySelectorAll<HTMLElement>(
          'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ),
      ).filter((element) => !element.hasAttribute("hidden"));

      if (focusable.length === 0) {
        event.preventDefault();
        dialogRef.current.focus();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      window.cancelAnimationFrame(focusFrame);
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
      previousFocusRef.current?.focus();
    };
  }, [isOpen, closeBooking]);

  async function loadAvailability(day: BookingDay) {
    const requestId = availabilityRequestRef.current + 1;
    availabilityRequestRef.current = requestId;
    setDateKey(day.key);
    setTime(null);
    setUnavailableTimes([]);
    setAvailabilityStatus("loading");

    try {
      const response = await fetch(
        `/api/bookings?date=${encodeURIComponent(day.key)}`,
        { cache: "no-store" },
      );
      const data = (await response.json().catch(() => ({}))) as {
        ok?: boolean;
        unavailableTimes?: string[];
        error?: string;
      };

      if (availabilityRequestRef.current !== requestId) return;

      if (!response.ok || !data.ok || !Array.isArray(data.unavailableTimes)) {
        throw new Error(data.error ?? "Availability could not be loaded.");
      }

      setUnavailableTimes(data.unavailableTimes);
      setAvailabilityStatus("ready");
    } catch {
      if (availabilityRequestRef.current !== requestId) return;
      setUnavailableTimes([]);
      setAvailabilityStatus("error");
    }
  }

  async function submitBooking(e: FormEvent) {
    e.preventDefault();
    const nextErrors: Record<string, string> = {};
    if (name.trim().length < 2) nextErrors.name = "Please enter your full name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()))
      nextErrors.email = "Please enter a valid email address.";
    const phoneDigits = phone.replace(/\D/g, "");
    if (phoneDigits.length < 10 || phoneDigits.length > 15)
      nextErrors.phone = "Please enter a valid phone number.";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setSubmitting(true);
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim(),
          service,
          provider,
          date: dateKey,
          time,
          notes: notes.trim() || null,
        }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        code?: string;
        error?: string;
        mode?: "database" | "demo";
      };
      if (res.ok && data.ok && data.code) {
        setConfirmCode(data.code);
        setConfirmationMode(data.mode ?? "database");
        setStep(3);
      } else {
        setErrors({ form: data.error ?? "Something went wrong. Please try again." });
      }
    } catch {
      setErrors({ form: "Network error. Please try again." });
    } finally {
      setSubmitting(false);
    }
  }

  const confirmed = step === 3;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[80] flex items-end justify-center p-0 sm:items-center sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <button
            type="button"
            className="absolute inset-0 bg-charcoal-950/75 backdrop-blur-sm"
            onClick={closeBooking}
            aria-label="Close booking dialog"
          />
          <motion.div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="booking-dialog-title"
            tabIndex={-1}
            initial={{ opacity: 0, y: 40, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.98 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="elysian-scroll relative max-h-[92vh] w-full max-w-2xl overflow-y-auto border-t border-[#D5CEC5] bg-[#FAF8F5] shadow-lift sm:border"
          >
            <div className="flex items-start justify-between border-b border-[#E8E3DC] px-6 py-5 sm:px-9">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.32em] text-[#6E5E54]">
                  Elysian Aesthetics &amp; Wellness
                </p>
                <h3
                  id="booking-dialog-title"
                  className="mt-1 font-display text-2xl text-[#382015]"
                >
                  {confirmed ? "Request Received" : "Book a Consultation"}
                </h3>
              </div>
              <button
                type="button"
                onClick={closeBooking}
                ref={closeButtonRef}
                aria-label="Close booking dialog"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#D5CEC5] text-[#4A382D] transition-colors hover:bg-[#F6F4F0]"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden="true">
                  <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            {!confirmed && (
              <ol className="flex items-center gap-2 px-6 pt-5 sm:px-9">
                {STEP_LABELS.map((label, i) => (
                  <li key={label} className="flex flex-1 items-center gap-2">
                    <span
                      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[11px] font-bold ${
                        step >= i ? "bg-[#382015] text-white" : "bg-[#E8E3DC] text-[#6E5E54]"
                      }`}
                    >
                      {i + 1}
                    </span>
                    <span
                      className={`hidden text-[11px] font-bold uppercase tracking-[0.16em] sm:block ${
                        step >= i ? "text-[#382015]" : "text-[#6E5E54]"
                      }`}
                    >
                      {label}
                    </span>
                    {i < STEP_LABELS.length - 1 && (
                      <span className="h-px flex-1 bg-[#E8E3DC]" />
                    )}
                  </li>
                ))}
              </ol>
            )}

            <div className="px-6 py-7 sm:px-9">
              <AnimatePresence mode="wait">
                {step === 0 && (
                  <motion.div
                    key="service"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    onAnimationComplete={() => stepHeadingRef.current?.focus()}
                  >
                    <h4
                      ref={stepHeadingRef}
                      tabIndex={-1}
                      className="font-display text-xl text-[#382015] outline-none"
                    >
                      Choose a treatment
                    </h4>
                    <p className="mt-2 text-sm text-[#6E5E54]">
                      Select a treatment to begin. Not sure? Choose a guided
                      consultation and we&apos;ll design your plan together.
                    </p>
                    <div className="mt-5 space-y-6">
                      {SERVICE_GROUPS.map((g) => (
                        <div key={g.group}>
                          <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#4A382D]">
                            {g.group}
                          </p>
                          <div className="mt-3 flex flex-wrap gap-2.5">
                            {g.options.map((opt) => (
                              <button
                                key={opt}
                                type="button"
                                onClick={() => setService(opt)}
                                aria-pressed={service === opt}
                                className={`rounded-full border px-4 py-2.5 text-[13px] transition-all duration-200 ${
                                  service === opt
                                    ? "border-[#382015] bg-[#382015] font-bold text-white shadow-soft"
                                    : "border-[#D5CEC5] bg-[#F6F4F0] text-[#4A382D] hover:border-[#382015] hover:scale-[1.03]"
                                }`}
                              >
                                {opt}
                              </button>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                    <button
                      type="button"
                      disabled={!service}
                      onClick={() => setStep(1)}
                      className="mt-7 w-full rounded-full bg-[#382015] px-8 py-4 text-[12px] font-bold uppercase tracking-[0.2em] text-white shadow-soft transition-all duration-300 hover:scale-[1.02] hover:bg-[#2A160E] hover:shadow-lift disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:scale-100"
                    >
                      Continue
                    </button>
                  </motion.div>
                )}

                {step === 1 && (
                  <motion.div
                    key="schedule"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    onAnimationComplete={() => stepHeadingRef.current?.focus()}
                  >
                    <h4
                      ref={stepHeadingRef}
                      tabIndex={-1}
                      className="font-display text-xl text-[#382015] outline-none"
                    >
                      Choose a date and time
                    </h4>
                    <p className="mt-2 text-sm text-[#6E5E54]">
                      Booking for{" "}
                      <span className="font-bold text-[#382015]">{service}</span>.
                      Choose an available appointment at our Plano clinic.
                    </p>
                    <p className="mt-2 text-xs leading-relaxed text-[#6E5E54]">
                      Tuesday–Friday, 9:00 AM–6:00 PM · Saturday, 9:00
                      AM–5:00 PM · Sunday &amp; Monday, closed
                    </p>
                    <p className="mt-5 text-[11px] font-bold uppercase tracking-[0.24em] text-[#4A382D]">
                      Select a date
                    </p>
                    <div className="elysian-scroll mt-3 flex gap-2.5 overflow-x-auto pb-2">
                      {days.map((d) => (
                        <button
                          key={d.key}
                          type="button"
                          onClick={() => void loadAvailability(d)}
                          aria-label={d.label}
                          aria-pressed={dateKey === d.key}
                          className={`flex w-16 shrink-0 flex-col items-center border py-3 transition-all duration-200 ${
                            dateKey === d.key
                              ? "border-[#382015] bg-[#382015] text-white shadow-soft"
                              : "border-[#D5CEC5] bg-[#F6F4F0] text-[#4A382D] hover:border-[#382015]"
                          }`}
                        >
                          <span className="text-[10px] font-bold uppercase tracking-[0.14em]">
                            {d.weekday}
                          </span>
                          <span className="mt-1 font-display text-xl leading-none">
                            {d.day}
                          </span>
                          <span className="mt-1 text-[10px] uppercase tracking-[0.14em] opacity-70">
                            {d.month}
                          </span>
                        </button>
                      ))}
                    </div>

                    <p className="mt-5 text-[11px] font-bold uppercase tracking-[0.24em] text-[#4A382D]">
                      Select a time
                    </p>
                    <div className="mt-3 grid grid-cols-3 gap-2.5 sm:grid-cols-4">
                      {timeSlots.map((t) => {
                        const knownUnavailable =
                          availabilityStatus === "ready" &&
                          unavailableTimes.includes(t);
                        const available =
                          availabilityStatus === "ready" &&
                          !knownUnavailable;
                        return (
                          <button
                            key={t}
                            type="button"
                            disabled={!dateKey || !available}
                            onClick={() => setTime(t)}
                            aria-pressed={time === t}
                            className={`rounded-full border px-3 py-2.5 text-[12px] font-bold transition-all duration-200 ${
                              time === t
                                ? "border-[#382015] bg-[#382015] text-white shadow-soft"
                                : available
                                  ? "border-[#D5CEC5] bg-[#F6F4F0] text-[#4A382D] hover:border-[#382015]"
                                  : knownUnavailable
                                    ? "cursor-not-allowed border-[#E8E3DC] bg-[#FAF8F5] text-[#6E5E54]/50 line-through"
                                    : "cursor-not-allowed border-[#E8E3DC] bg-[#FAF8F5] text-[#6E5E54]/50"
                            }`}
                          >
                            {t}
                          </button>
                        );
                      })}
                    </div>
                    {!dateKey && (
                      <p className="mt-3 text-xs italic text-[#6E5E54]">
                        Select a date to see live availability.
                      </p>
                    )}
                    {dateKey && availabilityStatus === "loading" && (
                      <p className="mt-3 text-xs text-[#6E5E54]" role="status">
                        Checking live availability…
                      </p>
                    )}
                    {dateKey && availabilityStatus === "error" && selectedDay && (
                      <div className="mt-3 flex flex-wrap items-center gap-3">
                        <p className="text-xs text-red-600" role="alert">
                          Availability could not be loaded.
                        </p>
                        <button
                          type="button"
                          onClick={() => void loadAvailability(selectedDay)}
                          className="text-xs font-bold text-[#382015] underline underline-offset-4"
                        >
                          Try again
                        </button>
                      </div>
                    )}

                    <div className="mt-7 flex gap-3">
                      <button
                        type="button"
                        onClick={() => setStep(0)}
                        className="rounded-full border border-[#D5CEC5] px-6 py-3.5 text-[12px] font-bold uppercase tracking-[0.2em] text-[#4A382D] transition-all duration-300 hover:bg-[#F6F4F0]"
                      >
                        Back
                      </button>
                      <button
                        type="button"
                        disabled={
                          !dateKey || !time || availabilityStatus !== "ready"
                        }
                        onClick={() => setStep(2)}
                        className="flex-1 rounded-full bg-[#382015] px-8 py-3.5 text-[12px] font-bold uppercase tracking-[0.2em] text-white shadow-soft transition-all duration-300 hover:scale-[1.02] hover:bg-[#2A160E] hover:shadow-lift disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:scale-100"
                      >
                        Continue
                      </button>
                    </div>
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.form
                    key="details"
                    onSubmit={submitBooking}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    onAnimationComplete={() => stepHeadingRef.current?.focus()}
                    noValidate
                  >
                    <h4
                      ref={stepHeadingRef}
                      tabIndex={-1}
                      className="mb-4 font-display text-xl text-[#382015] outline-none"
                    >
                      Tell us about yourself
                    </h4>
                    <div className="border border-[#E8E3DC] bg-[#F6F4F0] px-5 py-4 text-sm text-[#4A382D]">
                      <span className="font-bold text-[#382015]">{service}</span>
                      {" · "}
                      {selectedDay?.label ?? dateKey} at {time}
                    </div>

                    <div className="mt-5 grid gap-4 sm:grid-cols-2">
                      <div>
                        <label htmlFor="bk-name" className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#4A382D]">
                          Full name *
                        </label>
                        <input
                          id="bk-name"
                          name="name"
                          type="text"
                          autoComplete="name"
                          required
                          maxLength={120}
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          aria-invalid={Boolean(errors.name)}
                          aria-describedby={errors.name ? "bk-name-error" : undefined}
                          className="mt-2 w-full border border-[#D5CEC5] bg-white px-4 py-3 text-sm text-[#382015] focus:border-[#382015] focus:outline-none"
                          placeholder="Jane Doe"
                        />
                        {errors.name && (
                          <p id="bk-name-error" className="mt-1.5 text-xs text-red-600">
                            {errors.name}
                          </p>
                        )}
                      </div>
                      <div>
                        <label htmlFor="bk-email" className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#4A382D]">
                          Email *
                        </label>
                        <input
                          id="bk-email"
                          name="email"
                          type="email"
                          autoComplete="email"
                          required
                          maxLength={200}
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          aria-invalid={Boolean(errors.email)}
                          aria-describedby={errors.email ? "bk-email-error" : undefined}
                          className="mt-2 w-full border border-[#D5CEC5] bg-white px-4 py-3 text-sm text-[#382015] focus:border-[#382015] focus:outline-none"
                          placeholder="jane@email.com"
                        />
                        {errors.email && (
                          <p id="bk-email-error" className="mt-1.5 text-xs text-red-600">
                            {errors.email}
                          </p>
                        )}
                      </div>
                      <div>
                        <label htmlFor="bk-phone" className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#4A382D]">
                          Phone *
                        </label>
                        <input
                          id="bk-phone"
                          name="phone"
                          type="tel"
                          autoComplete="tel"
                          required
                          maxLength={40}
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          aria-invalid={Boolean(errors.phone)}
                          aria-describedby={errors.phone ? "bk-phone-error" : undefined}
                          className="mt-2 w-full border border-[#D5CEC5] bg-white px-4 py-3 text-sm text-[#382015] focus:border-[#382015] focus:outline-none"
                          placeholder="(469) 555-0123"
                        />
                        {errors.phone && (
                          <p id="bk-phone-error" className="mt-1.5 text-xs text-red-600">
                            {errors.phone}
                          </p>
                        )}
                      </div>
                      <div>
                        <label htmlFor="bk-provider" className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#4A382D]">
                          Provider preference
                        </label>
                        <select
                          id="bk-provider"
                          name="provider"
                          value={provider}
                          onChange={(e) => setProvider(e.target.value)}
                          className="mt-2 w-full border border-[#D5CEC5] bg-white px-4 py-3 text-sm text-[#382015] focus:border-[#382015] focus:outline-none"
                        >
                          {PROVIDER_OPTIONS.map((p) => (
                            <option key={p} value={p}>
                              {p}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="mt-4">
                      <label htmlFor="bk-notes" className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#4A382D]">
                        Anything we should know?
                      </label>
                      <textarea
                        id="bk-notes"
                        name="notes"
                        rows={3}
                        maxLength={3000}
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        className="mt-2 w-full resize-none border border-[#D5CEC5] bg-white px-4 py-3 text-sm text-[#382015] focus:border-[#382015] focus:outline-none"
                        placeholder="Areas of concern, allergies, upcoming events…"
                      />
                    </div>

                    {errors.form && (
                      <p className="mt-3 text-sm text-red-600" role="alert">
                        {errors.form}
                      </p>
                    )}

                    <div className="mt-6 flex gap-3">
                      <button
                        type="button"
                        onClick={() => setStep(1)}
                        className="rounded-full border border-[#D5CEC5] px-6 py-3.5 text-[12px] font-bold uppercase tracking-[0.2em] text-[#4A382D] transition-all duration-300 hover:bg-[#F6F4F0]"
                      >
                        Back
                      </button>
                      <button
                        type="submit"
                        disabled={submitting}
                        className="flex-1 rounded-full bg-[#382015] px-8 py-3.5 text-[12px] font-bold uppercase tracking-[0.2em] text-white shadow-soft transition-all duration-300 hover:scale-[1.02] hover:bg-[#2A160E] hover:shadow-lift disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100"
                      >
                        {submitting ? "Confirming…" : "Confirm Booking"}
                      </button>
                    </div>
                    <p className="mt-4 text-center text-xs text-[#6E5E54]">
                      No payment required today. A coordinator will confirm by
                      email within one business hour.
                    </p>
                  </motion.form>
                )}

                {confirmed && (
                  <motion.div
                    key="done"
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4 }}
                    className="py-4 text-center"
                    role="status"
                    aria-live="polite"
                    onAnimationComplete={() => stepHeadingRef.current?.focus()}
                  >
                    <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#EBE7E0] text-[#382015]">
                      <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none" aria-hidden="true">
                        <path d="m5 12.5 4.5 4.5L19 7.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                    <h4
                      ref={stepHeadingRef}
                      tabIndex={-1}
                      className="mt-5 font-display text-2xl text-[#382015] outline-none"
                    >
                      Thank you, {name.split(" ")[0] || "beautiful"}.
                    </h4>
                    <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-[#6E5E54]">
                      Your appointment request for{" "}
                      <span className="font-bold text-[#382015]">{service}</span>{" "}
                      was received for{" "}
                      <span className="font-bold text-[#382015]">
                        {selectedDay?.label ?? dateKey} at {time}
                      </span>
                      . An Elysian coordinator will follow up to confirm it.
                    </p>
                    {confirmationMode === "demo" && (
                      <p className="mx-auto mt-4 max-w-md rounded-xl bg-[#EBE7E0] px-4 py-3 text-xs leading-relaxed text-[#6E5E54]">
                        Local preview mode: this request is stored only for the
                        current server session because no database is configured.
                      </p>
                    )}
                    <p className="mt-5 inline-block border border-[#D5CEC5] bg-[#F6F4F0] px-5 py-2.5 text-sm tracking-[0.2em] text-[#382015]">
                      Confirmation&nbsp;
                      <span className="font-bold">{confirmCode}</span>
                    </p>
                    <div className="mt-7">
                      <button
                        type="button"
                        onClick={closeBooking}
                        className="rounded-full bg-[#382015] px-9 py-3.5 text-[12px] font-bold uppercase tracking-[0.2em] text-white shadow-soft transition-all duration-300 hover:scale-105 hover:bg-[#2A160E]"
                      >
                        Done
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
