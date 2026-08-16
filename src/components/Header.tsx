"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  useEffect,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
  type ReactNode,
} from "react";
import ScreenshotCrop from "@/components/ScreenshotCrop";
import { useBooking } from "@/lib/booking-context";

type MegaMenuKey = "about" | "treatments" | "programs" | "locations";
type BadgeKind = "new" | "popular";

type MenuItem = {
  label: string;
  href: string;
  badge?: BadgeKind;
};

const DESKTOP_MENU_ITEMS: { key: MegaMenuKey; label: string }[] = [
  { key: "about", label: "About Us" },
  { key: "treatments", label: "Treatments" },
  { key: "programs", label: "Programs" },
];

const ABOUT_LINKS: MenuItem[] = [
  { label: "Our team", href: "/#providers" },
  {
    label: "Client reviews",
    href: "/#reviews",
  },
  { label: "Financing", href: "/#financing" },
  { label: "Contact", href: "/#locations" },
  {
    label: "Careers",
    href: "mailto:hello@elysianaesthetics.com?subject=Careers%20at%20Elysian%20Aesthetics%20%26%20Wellness",
  },
];

const TREATMENT_COLUMNS: { title: string; items: MenuItem[] }[] = [
  {
    title: "Injectable treatments",
    items: [
      { label: "Botox and Dysport", href: "/#injectables" },
      { label: "Lip Filler", href: "/#injectables" },
      { label: "Dermal Fillers", href: "/#injectables" },
      {
        label: "Sculptra",
        href: "/#injectables",
        badge: "popular",
      },
      { label: "PRF EZ Gel", href: "/#injectables" },
      {
        label: "Skinvive Skin Booster",
        href: "/#injectables",
        badge: "new",
      },
      { label: "Kybella", href: "/#injectables" },
    ],
  },
  {
    title: "Laser & energy treatments",
    items: [
      {
        label: "Sofwave Skin Tightening",
        href: "/#laser",
        badge: "new",
      },
      { label: "Co2 Laser Resurfacing", href: "/#laser" },
      { label: "Moxi Laser", href: "/#laser", badge: "popular" },
      { label: "BBL Photofacial", href: "/#laser" },
    ],
  },
  {
    title: "Skincare treatments",
    items: [
      {
        label: "SkinPen Microneedling",
        href: "/#skincare",
        badge: "popular",
      },
      { label: "Chemical Peels", href: "/#skincare" },
      { label: "HydraFacial", href: "/#skincare" },
      { label: "Elysian Signature Facials", href: "/#skincare" },
    ],
  },
  {
    title: "Concerns",
    items: [
      {
        label: "Facial Balancing",
        href: "/#treatments",
        badge: "popular",
      },
      {
        label: "Preventative Botox",
        href: "/#treatments",
        badge: "popular",
      },
      { label: "Fine lines & wrinkles", href: "/#treatments" },
      { label: "Volume loss", href: "/#treatments" },
      {
        label: "Skin tightening",
        href: "/#treatments",
        badge: "new",
      },
      { label: "Pigmentation and redness", href: "/#treatments" },
      { label: "Melasma", href: "/#treatments" },
      { label: "Acne scars", href: "/#treatments" },
      { label: "Stubborn fat (double chin)", href: "/#treatments" },
      { label: "Excessive sweating", href: "/#treatments" },
      { label: "Pro-Nox Pain Management", href: "/#treatments" },
      { label: "Men's Treatments", href: "/#treatments" },
    ],
  },
];

const PROGRAM_LINKS: MenuItem[] = [
  { label: "Memberships", href: "/#membership" },
  { label: "Botox & Dysport Bank", href: "/#membership" },
  { label: "Referral program", href: "/#programs" },
];

const LOCATION_LINKS: MenuItem[] = [
  {
    label: "Plano, TX",
    href: "https://www.google.com/maps/search/?api=1&query=5717+Legacy+Drive+Suite+170+Plano+TX+75024",
  },
  {
    label: "Fairview & Allen, TX (Coming Soon)",
    href: "/#locations",
  },
];

const MAP_URL = LOCATION_LINKS[0].href;

export function LogoMark({ className }: { className?: string }) {
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

function PhoneIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden="true">
      <path
        d="M7.2 3.5 4.7 5.2c-.7.5-.9 1.3-.6 2.1 2.2 6.2 6.4 10.4 12.6 12.6.8.3 1.6.1 2.1-.6l1.7-2.5-4.6-3.1-1.6 2a13.4 13.4 0 0 1-6-6l2-1.6-3.1-4.6Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function StatusBadge({ kind }: { kind: BadgeKind }) {
  return (
    <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-canvas px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.16em] text-espresso-700">
      {kind === "popular" ? (
        <svg viewBox="0 0 16 16" className="h-3 w-3" fill="none" aria-hidden="true">
          <path
            d="M8.2 1.5c.6 2.2 3.2 3.5 3.2 6.7a3.6 3.6 0 1 1-7.2 0c0-1.8 1.1-3.5 2.4-4.8.1 1.4.6 2.2 1.2 2.7.2-1.2.2-2.7.4-4.6Z"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinejoin="round"
          />
        </svg>
      ) : (
        <svg viewBox="0 0 16 16" className="h-3 w-3" fill="none" aria-hidden="true">
          <path
            d="M8 1.5 9.1 5 12.5 6 9.1 7.1 8 10.5 6.9 7.1 3.5 6 6.9 5 8 1.5Zm4 8 .6 1.9 1.9.6-1.9.6-.6 1.9-.6-1.9-1.9-.6 1.9-.6.6-1.9Z"
            fill="currentColor"
          />
        </svg>
      )}
      {kind}
    </span>
  );
}

function isExternalHref(href: string) {
  return /^(?:https?:|mailto:|tel:)/.test(href);
}

function MenuLink({
  item,
  onNavigate,
  compact = false,
}: {
  item: MenuItem;
  onNavigate: () => void;
  compact?: boolean;
}) {
  const external = isExternalHref(item.href);
  const opensNewWindow = item.href.startsWith("http");
  const className = `group flex w-fit max-w-full items-center gap-2.5 text-espresso-900 transition-colors hover:text-espresso-600 ${
    compact ? "py-1.5 text-sm" : "py-1.5 text-[17px]"
  }`;
  const content = (
    <>
      <span className="underline-offset-4 group-hover:underline">{item.label}</span>
      {item.badge && <StatusBadge kind={item.badge} />}
    </>
  );

  if (external) {
    return (
      <a
        href={item.href}
        onClick={onNavigate}
        target={opensNewWindow ? "_blank" : undefined}
        rel={opensNewWindow ? "noopener noreferrer" : undefined}
        className={className}
      >
        {content}
      </a>
    );
  }

  return (
    <Link href={item.href} onClick={onNavigate} className={className}>
      {content}
    </Link>
  );
}

function FeatureCard({
  href,
  media,
  eyebrow,
  title,
  overlayLabel,
  onNavigate,
}: {
  href: string;
  media: ReactNode;
  eyebrow?: string;
  title: string;
  overlayLabel?: string;
  onNavigate: () => void;
}) {
  const external = isExternalHref(href);
  const cardContent = (
    <>
      <div className="relative aspect-[5/4] overflow-hidden rounded-[26px] bg-canvas shadow-[0_1px_0_rgba(56,32,21,.06)]">
        <div className="absolute inset-0 transition-transform duration-700 ease-out group-hover:scale-[1.035]">
          {media}
        </div>
        {overlayLabel && (
          <span className="absolute inset-0 flex items-center justify-center bg-espresso-950/10 px-3 text-center text-[11px] font-bold uppercase tracking-[0.08em] text-white drop-shadow">
            {overlayLabel}
          </span>
        )}
      </div>
      {eyebrow && (
        <p className="mt-3 text-[10px] font-bold uppercase tracking-[0.2em] text-espresso-900">
          {eyebrow}
        </p>
      )}
      <p className={`${eyebrow ? "mt-2" : "mt-3"} text-[15px] leading-6 text-espresso-900`}>
        {title}
      </p>
    </>
  );

  if (external) {
    return (
      <a
        href={href}
        onClick={onNavigate}
        target="_blank"
        rel="noopener noreferrer"
        className="group block min-w-0 text-espresso-900"
      >
        {cardContent}
      </a>
    );
  }

  return (
    <Link
      href={href}
      onClick={onNavigate}
      className="group block min-w-0 text-espresso-900"
    >
      {cardContent}
    </Link>
  );
}

function AboutMenu({ onNavigate }: { onNavigate: () => void }) {
  return (
    <div className="grid grid-cols-[0.72fr_2.28fr] gap-20">
      <div>
        <h2 className="font-display text-[28px] font-normal text-espresso-900">About Us</h2>
        <nav aria-label="About Elysian Aesthetics & Wellness" className="mt-6">
          {ABOUT_LINKS.map((item) => (
            <MenuLink key={item.label} item={item} onNavigate={onNavigate} />
          ))}
        </nav>
      </div>

      <div className="grid max-w-[850px] grid-cols-3 gap-7 pt-16">
        <FeatureCard
          href="/#providers"
          onNavigate={onNavigate}
          eyebrow="Team"
          title="Meet our expert clinical team"
          media={
            <Image
              src="https://www.umedspa.com/wp-content/uploads/2026/08/10.webp"
              alt="Elysian Aesthetics & Wellness clinical provider team"
              fill
              unoptimized
              sizes="280px"
              className="object-cover"
            />
          }
        />
        <FeatureCard
          href="/#reviews"
          onNavigate={onNavigate}
          eyebrow="Reviews"
          title="1,000+ 5-Star Google Reviews"
          media={
            <div className="flex h-full flex-col justify-between border border-espresso-900/35 bg-white p-5 text-espresso-900">
              <div aria-label="Five stars" className="flex gap-1 text-[#DCC7B9]">
                {Array.from({ length: 5 }).map((_, index) => (
                  <span key={index} aria-hidden="true">★</span>
                ))}
              </div>
              <p className="line-clamp-3 text-[10px] leading-4 text-espresso-700">
                The most professional team in DFW. Knowledgeable, thoughtful,
                and focused on natural-looking results.
              </p>
              <p className="text-sm font-bold">Google</p>
            </div>
          }
        />
        <FeatureCard
          href="/#financing"
          onNavigate={onNavigate}
          eyebrow="Cherry financing"
          title="Flexible payment options"
          media={
            <div className="flex h-full flex-col items-center justify-center bg-white px-4 text-[#101C2B]" aria-label="Cherry financing">
              <span className="relative flex h-20 w-20 items-center justify-center rounded-full bg-[#101C2B]" aria-hidden="true">
                <span className="absolute h-3 w-12 -rotate-45 rounded-full bg-white" />
                <span className="absolute left-[23px] top-[22px] h-4 w-4 rounded-full bg-white" />
                <span className="absolute bottom-[22px] right-[23px] h-4 w-4 rounded-full bg-white" />
              </span>
              <span className="mt-2 text-4xl font-black tracking-[-0.06em]">Cherry</span>
            </div>
          }
        />
      </div>
    </div>
  );
}

function TreatmentsMenu({ onNavigate }: { onNavigate: () => void }) {
  return (
    <div>
      <h2 className="font-display text-[28px] font-normal text-espresso-900">Treatments</h2>
      <div className="mt-6 grid grid-cols-4 gap-x-12">
        {TREATMENT_COLUMNS.map((column, index) => (
          <nav key={column.title} aria-label={column.title}>
            <p className="mb-4 text-[11px] font-bold uppercase tracking-[0.2em] text-espresso-900">
              {column.title}
            </p>
            {column.items.map((item) => (
              <MenuLink key={item.label} item={item} onNavigate={onNavigate} />
            ))}
            {index === 0 && (
              <Link
                href="/#treatments"
                onClick={onNavigate}
                className="mt-8 inline-flex min-h-12 items-center justify-center rounded-full border border-espresso-900 px-7 py-3 text-sm text-espresso-900 transition-colors hover:bg-espresso-900 hover:text-canvas"
              >
                View all services
              </Link>
            )}
          </nav>
        ))}
      </div>
    </div>
  );
}

function ProgramsMenu({ onNavigate }: { onNavigate: () => void }) {
  return (
    <div className="grid grid-cols-[0.72fr_2.28fr] gap-20">
      <div>
        <h2 className="font-display text-[28px] font-normal text-espresso-900">Programs</h2>
        <nav aria-label="Programs" className="mt-6">
          {PROGRAM_LINKS.map((item) => (
            <MenuLink key={item.label} item={item} onNavigate={onNavigate} />
          ))}
          <Link
            href="/#programs"
            onClick={onNavigate}
            className="mt-9 inline-flex min-h-12 items-center justify-center rounded-full border border-espresso-900 px-8 py-3 text-sm text-espresso-900 transition-colors hover:bg-espresso-900 hover:text-canvas"
          >
            View all programs
          </Link>
        </nav>
      </div>

      <div className="grid max-w-[850px] grid-cols-3 gap-7 pt-14">
        <FeatureCard
          href="/#membership"
          onNavigate={onNavigate}
          overlayLabel="Memberships"
          title="Memberships"
          media={
            <ScreenshotCrop
              src="/reference/skincare.png"
              alt="Elysian membership skincare treatment"
              sourceWidth={1626}
              sourceHeight={728}
              cropX={1233}
              cropY={93}
              cropWidth={381}
            />
          }
        />
        <FeatureCard
          href="/#membership"
          onNavigate={onNavigate}
          overlayLabel="Botox & Dysport Bank"
          title="Botox & Dysport Bank"
          media={
            <ScreenshotCrop
              src="/reference/providers.png"
              alt="Elysian injector discussing the Botox and Dysport Bank"
              sourceWidth={1630}
              sourceHeight={724}
              cropX={431}
              cropY={119}
              cropWidth={381}
            />
          }
        />
        <FeatureCard
          href="/#programs"
          onNavigate={onNavigate}
          overlayLabel="Referral program"
          title="Referral program"
          media={
            <ScreenshotCrop
              src="/reference/skincare.png"
              alt="Elysian provider consulting with a client"
              sourceWidth={1626}
              sourceHeight={728}
              cropX={420}
              cropY={93}
              cropWidth={381}
            />
          }
        />
      </div>
    </div>
  );
}

function LocationsMenu({ onNavigate }: { onNavigate: () => void }) {
  return (
    <div className="grid grid-cols-[0.72fr_2.28fr] gap-20">
      <div>
        <h2 className="font-display text-[28px] font-normal text-espresso-900">Locations</h2>
        <nav aria-label="Locations" className="mt-6">
          {LOCATION_LINKS.map((item) => (
            <MenuLink key={item.label} item={item} onNavigate={onNavigate} />
          ))}
        </nav>
      </div>

      <div className="grid max-w-[570px] grid-cols-2 gap-7 pt-14">
        <FeatureCard
          href={MAP_URL}
          onNavigate={onNavigate}
          title="Plano, TX"
          media={
            <Image
              src="https://www.umedspa.com/wp-content/uploads/2026/04/umed61-e1707790492171.webp"
              alt="Elysian Aesthetics & Wellness Plano storefront"
              fill
              unoptimized
              sizes="280px"
              className="object-cover"
            />
          }
        />
        <FeatureCard
          href="/#locations"
          onNavigate={onNavigate}
          title="Fairview & Allen, TX (Coming Soon)"
          media={
            <Image
              src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=900&q=85"
              alt="Warm luxury interior representing the forthcoming Fairview and Allen location"
              fill
              unoptimized
              sizes="280px"
              className="object-cover"
            />
          }
        />
      </div>
    </div>
  );
}

function DesktopMegaMenu({
  menu,
  onNavigate,
  reducedMotion,
}: {
  menu: MegaMenuKey;
  onNavigate: () => void;
  reducedMotion: boolean;
}) {
  return (
    <motion.div
      id={`mega-menu-${menu}`}
      key={menu}
      role="region"
      aria-label={`${menu} menu`}
      initial={{ opacity: 0, y: reducedMotion ? 0 : -10, scaleY: reducedMotion ? 1 : 0.98 }}
      animate={{ opacity: 1, y: 0, scaleY: 1 }}
      exit={{ opacity: 0, y: reducedMotion ? 0 : -8, scaleY: reducedMotion ? 1 : 0.985 }}
      transition={
        reducedMotion
          ? { duration: 0 }
          : { type: "spring", stiffness: 420, damping: 38, mass: 0.8 }
      }
      className="absolute inset-x-0 top-full hidden max-h-[calc(100vh-118px)] origin-top overflow-y-auto border-t border-espresso-900/10 bg-stone shadow-[0_24px_45px_-35px_rgba(56,32,21,.42)] xl:block"
    >
      <div className="mx-auto max-w-[1720px] px-16 py-12 2xl:px-20 2xl:py-14">
        {menu === "about" && <AboutMenu onNavigate={onNavigate} />}
        {menu === "treatments" && <TreatmentsMenu onNavigate={onNavigate} />}
        {menu === "programs" && <ProgramsMenu onNavigate={onNavigate} />}
        {menu === "locations" && <LocationsMenu onNavigate={onNavigate} />}
      </div>
    </motion.div>
  );
}

function MobileAccordion({
  menuKey,
  label,
  open,
  onToggle,
  reducedMotion,
  children,
}: {
  menuKey: MegaMenuKey;
  label: string;
  open: boolean;
  onToggle: () => void;
  reducedMotion: boolean;
  children: ReactNode;
}) {
  const triggerId = `mobile-${menuKey}-trigger`;
  const panelId = `mobile-${menuKey}-panel`;

  return (
    <div className="border-b border-line">
      <button
        id={triggerId}
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        aria-controls={panelId}
        className="flex min-h-16 w-full items-center justify-between gap-5 py-4 text-left font-display text-xl text-espresso-900"
      >
        {label}
        <span className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-line-strong" aria-hidden="true">
          <span className="absolute h-px w-3.5 bg-current" />
          <motion.span
            className="absolute h-3.5 w-px bg-current"
            animate={{ rotate: open ? 90 : 0, opacity: open ? 0 : 1 }}
            transition={{ duration: reducedMotion ? 0 : 0.22 }}
          />
        </span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={panelId}
            role="region"
            aria-labelledby={triggerId}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{
              height: { duration: reducedMotion ? 0 : 0.32, ease: [0.22, 1, 0.36, 1] },
              opacity: { duration: reducedMotion ? 0 : 0.2 },
            }}
            className="overflow-hidden"
          >
            <div className="pb-6">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function MobileMenu({
  openSection,
  setOpenSection,
  onNavigate,
  onBook,
  reducedMotion,
}: {
  openSection: MegaMenuKey | null;
  setOpenSection: (section: MegaMenuKey | null) => void;
  onNavigate: () => void;
  onBook: () => void;
  reducedMotion: boolean;
}) {
  const toggle = (section: MegaMenuKey) =>
    setOpenSection(openSection === section ? null : section);

  return (
    <nav className="mx-auto max-w-3xl px-5 pb-8 sm:px-8" aria-label="Mobile navigation">
      <Link
        href="/"
        onClick={onNavigate}
        className="flex min-h-16 items-center border-b border-line py-4 font-display text-xl text-espresso-900"
      >
        Home
      </Link>

      <MobileAccordion
        menuKey="about"
        label="About Us"
        open={openSection === "about"}
        onToggle={() => toggle("about")}
        reducedMotion={reducedMotion}
      >
        <div className="grid gap-1 pl-1">
          {ABOUT_LINKS.map((item) => (
            <MenuLink key={item.label} item={item} onNavigate={onNavigate} compact />
          ))}
        </div>
      </MobileAccordion>

      <MobileAccordion
        menuKey="treatments"
        label="Treatments"
        open={openSection === "treatments"}
        onToggle={() => toggle("treatments")}
        reducedMotion={reducedMotion}
      >
        <div className="space-y-6 pl-1">
          {TREATMENT_COLUMNS.map((column) => (
            <div key={column.title}>
              <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-espresso-600">
                {column.title}
              </p>
              {column.items.map((item) => (
                <MenuLink key={item.label} item={item} onNavigate={onNavigate} compact />
              ))}
            </div>
          ))}
          <Link
            href="/#treatments"
            onClick={onNavigate}
            className="inline-flex min-h-11 items-center justify-center rounded-full border border-espresso-900 px-6 py-2.5 text-sm text-espresso-900"
          >
            View all services
          </Link>
        </div>
      </MobileAccordion>

      <MobileAccordion
        menuKey="programs"
        label="Programs"
        open={openSection === "programs"}
        onToggle={() => toggle("programs")}
        reducedMotion={reducedMotion}
      >
        <div className="grid gap-1 pl-1">
          {PROGRAM_LINKS.map((item) => (
            <MenuLink key={item.label} item={item} onNavigate={onNavigate} compact />
          ))}
          <Link
            href="/#programs"
            onClick={onNavigate}
            className="mt-3 inline-flex min-h-11 w-fit items-center justify-center rounded-full border border-espresso-900 px-6 py-2.5 text-sm text-espresso-900"
          >
            View all programs
          </Link>
        </div>
      </MobileAccordion>

      <MobileAccordion
        menuKey="locations"
        label="Locations"
        open={openSection === "locations"}
        onToggle={() => toggle("locations")}
        reducedMotion={reducedMotion}
      >
        <div className="grid gap-1 pl-1">
          {LOCATION_LINKS.map((item) => (
            <MenuLink key={item.label} item={item} onNavigate={onNavigate} compact />
          ))}
        </div>
      </MobileAccordion>

      <Link
        href="/blog"
        onClick={onNavigate}
        className="flex min-h-16 items-center border-b border-line py-4 font-display text-xl text-espresso-900"
      >
        Blog
      </Link>

      <div className="grid gap-3 pt-7 sm:grid-cols-2">
        <button
          type="button"
          onClick={onBook}
          className="min-h-12 rounded-full bg-espresso-900 px-6 py-3 text-sm text-canvas transition-colors hover:bg-espresso-950"
        >
          Book Now
        </button>
        <a
          href="tel:+19726366299"
          onClick={onNavigate}
          className="flex min-h-12 items-center justify-center gap-2 rounded-full border border-espresso-900 px-6 py-3 text-sm text-espresso-900"
        >
          <PhoneIcon /> Call (972) 636-6299
        </a>
      </div>
    </nav>
  );
}

export default function Header() {
  const { openBooking } = useBooking();
  const reducedMotion = Boolean(useReducedMotion());
  const headerRef = useRef<HTMLElement>(null);
  const mobileToggleRef = useRef<HTMLButtonElement>(null);
  const desktopTriggerRefs = useRef<
    Partial<Record<MegaMenuKey, HTMLButtonElement | null>>
  >({});
  const [activeMenu, setActiveMenu] = useState<MegaMenuKey | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileSection, setMobileSection] = useState<MegaMenuKey | null>(null);
  const [scrolled, setScrolled] = useState(false);

  const closeNavigation = () => {
    setActiveMenu(null);
    setMobileOpen(false);
    setMobileSection(null);
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const media = window.matchMedia("(min-width: 1280px)");
    const syncNavigation = () => {
      if (media.matches) {
        setMobileOpen(false);
        setMobileSection(null);
      } else {
        setActiveMenu(null);
      }
    };

    syncNavigation();
    media.addEventListener("change", syncNavigation);
    return () => media.removeEventListener("change", syncNavigation);
  }, []);

  useEffect(() => {
    if (!mobileOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [mobileOpen]);

  useEffect(() => {
    const onPointerDown = (event: PointerEvent) => {
      if (!headerRef.current?.contains(event.target as Node)) {
        setActiveMenu(null);
        setMobileOpen(false);
        setMobileSection(null);
      }
    };

    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Tab" && mobileOpen && headerRef.current) {
        const focusable = Array.from(
          headerRef.current.querySelectorAll<HTMLElement>(
            'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
          ),
        ).filter((element) => element.offsetParent !== null);

        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (first && last) {
          if (event.shiftKey && document.activeElement === first) {
            event.preventDefault();
            last.focus();
          } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault();
            first.focus();
          }
        }
        return;
      }

      if (event.key !== "Escape") return;

      if (mobileOpen) {
        event.preventDefault();
        setMobileOpen(false);
        setMobileSection(null);
        mobileToggleRef.current?.focus();
      } else if (activeMenu) {
        event.preventDefault();
        const menuToRestore = activeMenu;
        setActiveMenu(null);
        desktopTriggerRefs.current[menuToRestore]?.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [activeMenu, mobileOpen]);

  const handleBook = () => {
    const openingFromMobileMenu = mobileOpen;
    if (openingFromMobileMenu) mobileToggleRef.current?.focus();
    closeNavigation();
    if (openingFromMobileMenu) {
      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() =>
          openBooking("General Consultation"),
        );
      });
    } else {
      openBooking("General Consultation");
    }
  };

  const openMenuFromKeyboard = (
    event: ReactKeyboardEvent<HTMLButtonElement>,
    menu: MegaMenuKey,
  ) => {
    if (event.key !== "ArrowDown") return;
    event.preventDefault();
    setActiveMenu(menu);
    window.setTimeout(() => {
      document
        .querySelector<HTMLElement>(`#mega-menu-${menu} a[href], #mega-menu-${menu} button`)
        ?.focus();
    }, 0);
  };

  return (
    <header
      ref={headerRef}
      className={`sticky inset-x-0 top-0 z-50 transition-[background-color,box-shadow] duration-300 ${
        activeMenu ? "bg-stone" : "bg-canvas"
      } ${scrolled ? "shadow-[0_8px_30px_-20px_rgba(56,32,21,.45)]" : ""}`}
      onMouseLeave={() => setActiveMenu(null)}
      onBlurCapture={(event) => {
        const nextTarget = event.relatedTarget;
        if (nextTarget instanceof Node && event.currentTarget.contains(nextTarget)) return;
        setActiveMenu(null);
      }}
    >
      <div className="bg-espresso-900 px-4 py-2.5 text-canvas">
        <div className="mx-auto grid max-w-[1720px] items-center text-center text-[11px] tracking-[0.04em] sm:grid-cols-[1fr_auto_1fr] sm:text-xs">
          <p className="sm:col-start-2">
            ✨ Elysian Welcome: Enjoy up to 15% off your first visit • Save up
            to 20% on Your Summer Reset
          </p>
          <a
            href="tel:+19726366299"
            className="hidden items-center gap-2 justify-self-end font-bold tracking-normal underline-offset-4 hover:underline sm:col-start-3 sm:flex"
          >
            <PhoneIcon /> (972) 636-6299
          </a>
        </div>
      </div>

      <div className="mx-auto flex h-[78px] max-w-[1720px] items-center justify-between px-5 sm:h-[90px] sm:px-10 lg:px-16">
        <Link
          href="/#top"
          onClick={closeNavigation}
          onFocus={() => setActiveMenu(null)}
          onMouseEnter={() => setActiveMenu(null)}
          className="flex items-center gap-3 text-espresso-900"
          aria-label="Elysian Aesthetics & Wellness home"
        >
          <LogoMark className="h-12 w-10 sm:h-14 sm:w-12" />
          <span className="flex flex-col leading-none">
            <span className="font-display text-xl font-normal tracking-[-0.02em] sm:text-2xl">
              Elysian
            </span>
            <span className="mt-1 text-[8px] font-bold uppercase tracking-[0.22em] text-espresso-600 sm:text-[9px]">
              Aesthetics &amp; Wellness
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-8 xl:flex" aria-label="Primary navigation">
          <Link
            href="/"
            onClick={closeNavigation}
            onFocus={() => setActiveMenu(null)}
            onMouseEnter={() => setActiveMenu(null)}
            className="relative py-3 text-[15px] text-espresso-800 after:absolute after:inset-x-0 after:bottom-1 after:h-px after:origin-left after:scale-x-0 after:bg-espresso-900 after:transition-transform hover:after:scale-x-100"
          >
            Home
          </Link>

          {DESKTOP_MENU_ITEMS.map((item) => (
            <button
              key={item.key}
              ref={(node) => {
                desktopTriggerRefs.current[item.key] = node;
              }}
              type="button"
              onMouseEnter={() => setActiveMenu(item.key)}
              onFocus={(event) => {
                if (event.currentTarget.matches(":focus-visible")) setActiveMenu(item.key);
              }}
              onClick={() =>
                setActiveMenu((current) => (current === item.key ? null : item.key))
              }
              onKeyDown={(event) => openMenuFromKeyboard(event, item.key)}
              aria-expanded={activeMenu === item.key}
              aria-controls={`mega-menu-${item.key}`}
              aria-haspopup="true"
              className={`relative py-3 text-[15px] transition-colors ${
                activeMenu === item.key
                  ? "text-espresso-400"
                  : "text-espresso-800 hover:text-espresso-900"
              }`}
            >
              {item.label}
            </button>
          ))}

          <button
            ref={(node) => {
              desktopTriggerRefs.current.locations = node;
            }}
            type="button"
            onMouseEnter={() => setActiveMenu("locations")}
            onFocus={(event) => {
              if (event.currentTarget.matches(":focus-visible")) setActiveMenu("locations");
            }}
            onClick={() =>
              setActiveMenu((current) => (current === "locations" ? null : "locations"))
            }
            onKeyDown={(event) => openMenuFromKeyboard(event, "locations")}
            aria-expanded={activeMenu === "locations"}
            aria-controls="mega-menu-locations"
            aria-haspopup="true"
            className={`relative py-3 text-[15px] transition-colors ${
              activeMenu === "locations"
                ? "text-espresso-400"
                : "text-espresso-800 hover:text-espresso-900"
            }`}
          >
            Locations
          </button>

          <Link
            href="/blog"
            onClick={closeNavigation}
            onFocus={() => setActiveMenu(null)}
            onMouseEnter={() => setActiveMenu(null)}
            className="relative py-3 text-[15px] text-espresso-800 after:absolute after:inset-x-0 after:bottom-1 after:h-px after:origin-left after:scale-x-0 after:bg-espresso-900 after:transition-transform hover:after:scale-x-100"
          >
            Blog
          </Link>
        </nav>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={handleBook}
            onMouseEnter={() => setActiveMenu(null)}
            className="hidden rounded-full bg-espresso-900 px-6 py-3.5 text-sm text-canvas shadow-soft transition duration-300 hover:-translate-y-0.5 hover:bg-espresso-950 sm:inline-flex sm:px-8 sm:py-4 sm:text-base"
            aria-haspopup="dialog"
          >
            Book Now
          </button>
          <button
            ref={mobileToggleRef}
            type="button"
            onClick={() => {
              setActiveMenu(null);
              setMobileOpen((open) => {
                if (open) setMobileSection(null);
                return !open;
              });
            }}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-line-strong text-espresso-900 transition-colors hover:bg-stone xl:hidden"
            aria-expanded={mobileOpen}
            aria-controls="mobile-navigation"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
              {mobileOpen ? (
                <path d="M6 6l12 12M18 6 6 18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              ) : (
                <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              )}
            </svg>
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeMenu && (
          <DesktopMegaMenu
            menu={activeMenu}
            onNavigate={closeNavigation}
            reducedMotion={reducedMotion}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              key="mobile-backdrop"
              aria-hidden="true"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: reducedMotion ? 0 : 0.2 }}
              onClick={() => {
                setMobileOpen(false);
                setMobileSection(null);
                window.requestAnimationFrame(() => mobileToggleRef.current?.focus());
              }}
              className="fixed inset-0 top-[110px] bg-espresso-950/25 backdrop-blur-[2px] sm:top-[122px] xl:hidden"
            />
            <motion.div
              id="mobile-navigation"
              key="mobile-navigation"
              initial={{ height: 0, opacity: 0, y: reducedMotion ? 0 : -10 }}
              animate={{ height: "auto", opacity: 1, y: 0 }}
              exit={{ height: 0, opacity: 0, y: reducedMotion ? 0 : -8 }}
              transition={{ duration: reducedMotion ? 0 : 0.32, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-x-0 top-full max-h-[calc(100dvh-110px)] overflow-y-auto overscroll-contain border-t border-line bg-canvas shadow-lift sm:max-h-[calc(100dvh-122px)] xl:hidden"
            >
              <MobileMenu
                openSection={mobileSection}
                setOpenSection={setMobileSection}
                onNavigate={closeNavigation}
                onBook={handleBook}
                reducedMotion={reducedMotion}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
