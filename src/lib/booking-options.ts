export const SERVICE_GROUPS = [
  {
    group: "Injectables",
    options: [
      "Botox and Dysport",
      "Dermal Fillers",
      "Lip Filler",
      "Sculptra",
      "Skinvive Skin Booster",
      "PRF EZ Gel",
      "Kybella",
    ],
  },
  {
    group: "Laser & Energy",
    options: [
      "Sofwave Skin Tightening",
      "Co2 Laser Resurfacing",
      "Moxi Laser",
      "BBL Photofacial",
    ],
  },
  {
    group: "Skincare",
    options: [
      "SkinPen Microneedling",
      "Chemical Peels",
      "HydraFacial",
      "Elysian Signature Facials",
    ],
  },
  {
    group: "Consultations",
    options: [
      "General Consultation",
      "Complimentary Consultation",
      "Not sure yet — recommend for me",
      "Concern: Facial Balancing",
      "Concern: Preventative Botox",
      "Concern: Fine lines & wrinkles",
      "Concern: Volume loss",
      "Concern: Skin tightening",
      "Concern: Pigmentation and redness",
      "Concern: Melasma",
      "Concern: Acne scars",
      "Concern: Stubborn fat (double chin)",
      "Concern: Excessive sweating",
      "Concern: Pro-Nox Pain Management",
      "Concern: Men's Treatments",
      "New Patient Offer (15% Off)",
      "Membership Consultation",
      "Financing Consultation",
      "Referral Program Inquiry",
      "Signature Refresh Package",
      "Laser & Light Series",
    ],
  },
] as const;

export const BOOKING_SERVICES: readonly string[] = SERVICE_GROUPS.flatMap(
  (group) => group.options,
);

export const NAMED_PROVIDERS = [
  "Drea Hainebach (PA-C)",
  "Claire Schroyer (RN)",
  "Kenzie Morgan (RN)",
  "Hannah Smith (CLT)",
] as const;

export const FIRST_AVAILABLE_PROVIDER = "First Available";

export const PROVIDER_OPTIONS: readonly string[] = [
  FIRST_AVAILABLE_PROVIDER,
  ...NAMED_PROVIDERS,
];

export const WEEKDAY_TIME_SLOTS = [
  "9:00 AM",
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "1:00 PM",
  "2:00 PM",
  "3:00 PM",
  "4:00 PM",
  "5:00 PM",
] as const;

export const SATURDAY_TIME_SLOTS = [
  "9:00 AM",
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "1:00 PM",
  "2:00 PM",
  "3:00 PM",
  "4:00 PM",
] as const;

export type BookingDay = {
  key: string;
  label: string;
  weekday: string;
  day: string;
  month: string;
};

type DateParts = {
  year: number;
  month: number;
  day: number;
};

function toDateKey(parts: DateParts) {
  return `${parts.year}-${String(parts.month).padStart(2, "0")}-${String(
    parts.day,
  ).padStart(2, "0")}`;
}

function planoDateParts(date: Date): DateParts {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Chicago",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);

  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return {
    year: Number(values.year),
    month: Number(values.month),
    day: Number(values.day),
  };
}

function parseDateKey(value: string): (DateParts & { date: Date }) | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return null;

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const date = new Date(Date.UTC(year, month - 1, day, 12));

  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day
  ) {
    return null;
  }

  return { year, month, day, date };
}

export function isBookingService(value: string) {
  return BOOKING_SERVICES.includes(value);
}

export function isProviderOption(value: string) {
  return PROVIDER_OPTIONS.includes(value);
}

export function isNamedProvider(value: string) {
  return (NAMED_PROVIDERS as readonly string[]).includes(value);
}

export function currentPlanoDateKey(now = new Date()) {
  return toDateKey(planoDateParts(now));
}

export function getBookingWeekday(dateKey: string) {
  return parseDateKey(dateKey)?.date.getUTCDay() ?? null;
}

export function isOpenBookingDate(dateKey: string, now = new Date()) {
  const weekday = getBookingWeekday(dateKey);
  if (weekday === null || weekday === 0 || weekday === 1) return false;
  return dateKey > currentPlanoDateKey(now);
}

export function getTimeSlotsForDate(dateKey: string): readonly string[] {
  const weekday = getBookingWeekday(dateKey);
  if (weekday === 6) return SATURDAY_TIME_SLOTS;
  if (weekday !== null && weekday >= 2 && weekday <= 5) {
    return WEEKDAY_TIME_SLOTS;
  }
  return [];
}

export function getUpcomingBookingDays(count = 12, now = new Date()) {
  const today = planoDateParts(now);
  const cursor = new Date(Date.UTC(today.year, today.month - 1, today.day, 12));
  const days: BookingDay[] = [];

  cursor.setUTCDate(cursor.getUTCDate() + 1);

  while (days.length < count) {
    const weekdayNumber = cursor.getUTCDay();
    if (weekdayNumber !== 0 && weekdayNumber !== 1) {
      const key = toDateKey({
        year: cursor.getUTCFullYear(),
        month: cursor.getUTCMonth() + 1,
        day: cursor.getUTCDate(),
      });
      days.push({
        key,
        label: cursor.toLocaleDateString("en-US", {
          timeZone: "UTC",
          weekday: "short",
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
        weekday: cursor.toLocaleDateString("en-US", {
          timeZone: "UTC",
          weekday: "short",
        }),
        day: cursor.toLocaleDateString("en-US", {
          timeZone: "UTC",
          day: "numeric",
        }),
        month: cursor.toLocaleDateString("en-US", {
          timeZone: "UTC",
          month: "short",
        }),
      });
    }
    cursor.setUTCDate(cursor.getUTCDate() + 1);
  }

  return days;
}
