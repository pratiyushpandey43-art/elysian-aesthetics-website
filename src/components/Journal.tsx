"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
} from "react";
import Reveal from "@/components/Reveal";
import { useBooking } from "@/lib/booking-context";

export const BLOG_FILTERS = [
  "ALL",
  "INJECTABLE",
  "LASERS & ENERGY",
  "SKINCARE",
  "OTHER",
] as const;

type BlogFilter = (typeof BLOG_FILTERS)[number];
type BlogCategory = Exclude<BlogFilter, "ALL">;

type BlogArticle = {
  slug: string;
  date: string;
  categories: readonly BlogCategory[];
  title: string;
  excerpt: string;
  image: string;
  alt: string;
  content: readonly string[];
  keyPoints: readonly string[];
};

export const BLOG_ARTICLES: readonly BlogArticle[] = [
  {
    slug: "nefertiti-lift-neck-botox",
    date: "Aug 07, 2026",
    categories: ["INJECTABLE"],
    title: "The Truth About the Nefertiti Lift (Neck Botox)",
    excerpt:
      "How platysma band neuromodulation relaxes downward muscle tension to sharpen the jawline without surgery.",
    image:
      "https://www.umedspa.com/wp-content/uploads/2026/08/8_compressed-2.webp",
    alt: "Clinician preparing a precise lower-face injectable treatment",
    content: [
      "The Nefertiti Lift focuses on the platysma, a thin muscle that extends from the collarbone toward the jaw. When selected fibers pull strongly downward, vertical neck bands can become more visible and the lower-face contour can appear less defined.",
      "A trained injector may place small amounts of neuromodulator along specific platysmal bands and the jaw border. This can soften downward tension while preserving comfortable movement. It does not replace treatments for skin laxity, volume loss, or horizontal neck lines, which arise from different structures.",
      "Candidacy depends on muscle activity, skin quality, medical history, and realistic goals. The neck contains structures involved in swallowing and head support, so careful assessment, conservative dosing, and anatomical expertise are essential.",
    ],
    keyPoints: [
      "Targets active vertical platysmal bands rather than every type of neck line.",
      "Aims for subtle jawline refinement without surgery.",
      "Requires an in-person functional and anatomical assessment.",
    ],
  },
  {
    slug: "sculptra-vs-dermal-fillers",
    date: "Jul 24, 2026",
    categories: ["INJECTABLE"],
    title:
      "Sculptra vs. Dermal Fillers: Restoring Volume vs. Biostimulating Collagen",
    excerpt:
      "Immediate HA projection vs. gradual poly-L-lactic acid collagen regeneration.",
    image:
      "https://www.umedspa.com/wp-content/uploads/2024/01/11.webp",
    alt: "Aesthetic provider preparing a personalized injectable treatment plan",
    content: [
      "Hyaluronic acid fillers and Sculptra can both support facial rejuvenation, but they work in fundamentally different ways. HA filler provides immediate shape and projection, making it useful when a plan calls for precise contouring in areas such as the lips, chin, cheeks, or jawline.",
      "Sculptra is made with poly-L-lactic acid and is used to encourage a gradual collagen response. Changes develop over time rather than appearing as instant volume, so treatment is usually planned as a series with patience built into the process.",
      "Neither option is automatically better. Facial anatomy, tissue quality, timeline, and the kind of change desired determine whether a provider recommends HA filler, a biostimulator, a staged combination, or another approach entirely.",
    ],
    keyPoints: [
      "HA filler offers immediate, targeted contour and support.",
      "Sculptra supports gradual collagen renewal over time.",
      "Combination plans should be sequenced around anatomy and goals.",
    ],
  },
  {
    slug: "prf-ez-gel-undereye-regeneration",
    date: "Jul 12, 2026",
    categories: ["INJECTABLE"],
    title: "PRF EZ Gel: The 100% Natural Solution for Under-Eye Hollows",
    excerpt:
      "Autologous platelet-rich fibrin eliminating dark circles with zero Tyndall effect.",
    image:
      "https://www.umedspa.com/wp-content/uploads/2024/01/12.webp",
    alt: "Clinical preparation for a regenerative under-eye treatment",
    content: [
      "PRF EZ Gel begins with a small sample of the patient's own blood. After controlled processing, platelet-rich fibrin forms a gel-like matrix containing components involved in the body's natural healing response.",
      "In carefully selected patients, providers may use it to soften the transition beneath the eyes and support thin-looking tissue. Because it is autologous and does not contain hyaluronic acid, it does not create the blue-gray light-scattering effect known as the Tyndall effect.",
      "Dark circles can also come from pigment, visible vessels, allergies, anatomy, or shadowing. A detailed assessment is important because PRF EZ Gel will not address every cause, and results are typically subtler and more gradual than conventional filler.",
    ],
    keyPoints: [
      "Made from a processed sample of the patient's own blood.",
      "Designed for subtle support rather than dramatic projection.",
      "Under-eye darkness should be diagnosed before treatment is selected.",
    ],
  },
  {
    slug: "skinvive-micro-droplet-hydration",
    date: "Jun 28, 2026",
    categories: ["INJECTABLE"],
    title: "Skinvive by Juvéderm: The First Injectable Hyaluronic Skin Booster",
    excerpt:
      "Intradermal micro-droplet hydration for a natural lit-from-within glow.",
    image:
      "https://www.umedspa.com/wp-content/uploads/2024/01/13.webp",
    alt: "Close view of healthy, hydrated facial skin",
    content: [
      "Skinvive is an injectable hyaluronic acid treatment placed as tiny droplets within the skin of the cheeks. Its purpose is skin quality and hydration rather than the structural shaping associated with traditional dermal filler.",
      "By supporting moisture within the treated area, it can help the skin look smoother and more reflective. The desired change is deliberately understated: a refreshed surface quality rather than visible volume or altered facial proportions.",
      "A provider reviews skin condition, sensitivity, current products, and upcoming events before treatment. Skinvive can complement a broader routine, but daily sunscreen and consistent barrier-supportive skincare remain the foundation of long-term skin health.",
    ],
    keyPoints: [
      "Uses intradermal micro-droplets instead of structural filler placement.",
      "Focuses on cheek hydration, smoothness, and light reflection.",
      "Works best as one part of a consistent skin-health plan.",
    ],
  },
  {
    slug: "kybella-double-chin-permanent-reduction",
    date: "Jun 05, 2026",
    categories: ["INJECTABLE"],
    title: "Kybella: Permanently Contouring the Jawline and Double Chin",
    excerpt:
      "Deoxycholic acid injections for permanent submental fat destruction.",
    image:
      "https://www.umedspa.com/wp-content/uploads/2024/01/14.webp",
    alt: "Profile view used to assess the chin and jawline area",
    content: [
      "Kybella contains synthetic deoxycholic acid and is designed for selected pockets of submental fat beneath the chin. Once treated fat cells are destroyed and cleared by the body, those specific cells can no longer store fat.",
      "The treatment is not a general weight-loss solution and does not tighten loose skin. A provider evaluates fat distribution, jaw anatomy, skin elasticity, and nearby nerves before deciding whether Kybella or another contouring approach is appropriate.",
      "Swelling is an expected part of the inflammatory response and can be significant for several days. Many patients need more than one session, so timing, recovery, and the full treatment plan should be discussed before beginning.",
    ],
    keyPoints: [
      "Treats selected submental fat beneath the chin.",
      "Does not substitute for skin-tightening or weight-management care.",
      "Plan for swelling and the possibility of a treatment series.",
    ],
  },
  {
    slug: "preventative-botox-guide",
    date: "May 15, 2026",
    categories: ["INJECTABLE"],
    title: "The Art of Preventative Botox: Stopping Etched Lines Before They Form",
    excerpt:
      "Micro-dosing techniques to preserve expression while stopping static wrinkles.",
    image:
      "https://www.umedspa.com/wp-content/uploads/2024/01/15.webp",
    alt: "Provider evaluating facial expression before a neuromodulator treatment",
    content: [
      "Preventative Botox uses conservative neuromodulator dosing to soften repetitive muscle patterns before expression lines become deeply established at rest. The goal is not to erase movement, but to reduce selected forces that repeatedly fold the skin.",
      "Age alone does not determine the right starting point. Muscle strength, facial anatomy, existing lines, skincare habits, sun exposure, and personal preferences all matter. Some people benefit from a small treatment plan while others do not need neuromodulation yet.",
      "A measured first session allows the provider to observe response and refine future dosing. Sunscreen, retinoids when appropriate, and consistent skin care still play major roles because Botox does not treat pigment, texture, or collagen loss.",
    ],
    keyPoints: [
      "Uses targeted, conservative dosing based on movement patterns.",
      "Preserving expression is part of a well-designed plan.",
      "Prevention also depends on sunscreen and evidence-based skincare.",
    ],
  },
  {
    slug: "guide-to-rejuvenating-your-neck",
    date: "Apr 01, 2026",
    categories: ["LASERS & ENERGY"],
    title: "Guide to Rejuvenating Your Neck: BBL, Sofwave & Injectables",
    excerpt:
      "Combining ultrasound tightening with broad-spectrum light to reverse laxity and sun damage.",
    image:
      "https://www.umedspa.com/wp-content/uploads/2026/08/4_compressed-1.webp",
    alt: "Clinician planning a combined neck and skin rejuvenation treatment",
    content: [
      "The neck can show several concerns at once: muscle bands, horizontal creases, laxity, redness, and brown sun spots. These changes occur at different tissue depths, which is why one device or injectable rarely addresses everything.",
      "BBL can target selected brown and red discoloration, while Sofwave uses ultrasound energy to support a tightening response in the mid-dermis. Injectables may address active muscle pull, structural support, or specific static lines when clinically appropriate.",
      "Combination care should be sequenced deliberately. Skin tone, medical history, recovery tolerance, seasonal sun exposure, and upcoming events help determine treatment order and spacing.",
    ],
    keyPoints: [
      "BBL focuses on selected pigment and redness concerns.",
      "Sofwave addresses skin firmness with ultrasound energy.",
      "Injectables and devices solve different layers of the problem.",
    ],
  },
  {
    slug: "moxi-bbl-hero-combination-power",
    date: "Mar 18, 2026",
    categories: ["LASERS & ENERGY"],
    title: "Why We Stack Moxi Laser with BBL Hero for Ultimate Radiance",
    excerpt:
      "Clearing pigment and smoothing fine lines simultaneously with minimal downtime.",
    image:
      "https://www.umedspa.com/wp-content/uploads/2024/01/16.webp",
    alt: "Modern laser handpiece used for a professional facial treatment",
    content: [
      "Moxi and BBL Hero use different forms of energy for complementary goals. BBL targets selected red and brown discoloration, while Moxi creates controlled fractional channels that support renewal of texture and early pigment concerns.",
      "When appropriate, using the technologies in one coordinated plan can address tone and texture more efficiently than asking either device to do both jobs alone. Settings must still be customized for skin type, history, and the amount of correction desired.",
      "A successful series begins before the appointment with sun avoidance and barrier preparation, then continues with careful aftercare. Minimal downtime does not mean zero responsibility: heat, direct sun, and active skincare ingredients may need to be limited temporarily.",
    ],
    keyPoints: [
      "BBL addresses selected color while Moxi supports texture renewal.",
      "Combination settings should be individualized, not standardized.",
      "Preparation and aftercare directly influence safety and results.",
    ],
  },
  {
    slug: "sofwave-skin-tightening-zero-downtime",
    date: "Mar 02, 2026",
    categories: ["LASERS & ENERGY"],
    title: "Sofwave Ultrasound: Non-Invasive Lifting with Zero Downtime",
    excerpt:
      "1.5mm mid-dermis ultrasound beam technology lifting the brow, chin, and neck.",
    image:
      "https://www.umedspa.com/wp-content/uploads/2024/01/17.webp",
    alt: "Non-invasive skin-tightening consultation in a clinical treatment room",
    content: [
      "Sofwave delivers controlled ultrasound energy at a depth designed to heat the mid-dermis while protecting the surface with integrated cooling. That thermal response signals the skin's natural collagen-remodeling process.",
      "Providers commonly evaluate the brows, lower face, under-chin area, and neck when considering treatment. Changes develop gradually and are more subtle than surgical lifting, making expectation-setting an important part of consultation.",
      "Although normal routines can often resume quickly, treatment suitability still depends on health history, implanted devices, skin condition, and the area being treated. Comfort options and the anticipated timeline should be reviewed beforehand.",
    ],
    keyPoints: [
      "Uses ultrasound energy at approximately 1.5mm in the mid-dermis.",
      "Supports gradual collagen remodeling rather than instant volume.",
      "Best for patients seeking measured, non-surgical improvement.",
    ],
  },
  {
    slug: "co2-fractional-laser-deep-resurfacing",
    date: "Feb 14, 2026",
    categories: ["LASERS & ENERGY"],
    title: "Fractional CO2 Laser: The Gold Standard for Deep Scars and Wrinkles",
    excerpt:
      "Deep ablative fractional resurfacing for transformative collagen remodeling.",
    image:
      "https://www.umedspa.com/wp-content/uploads/2024/01/18.webp",
    alt: "Precision fractional laser treatment performed by a clinical provider",
    content: [
      "Fractional CO2 resurfacing creates microscopic columns of controlled ablation while leaving surrounding tissue available to support healing. It can address deeper texture concerns, etched lines, and selected acne scars more aggressively than light resurfacing options.",
      "The added intensity comes with meaningful preparation and recovery. Redness, swelling, peeling, and strict sun avoidance are expected, and the skin continues remodeling well beyond the visible healing period.",
      "Skin type, pigment history, medications, scar pattern, and ability to follow aftercare determine candidacy. A conservative, medically supervised plan is more important than simply choosing the strongest possible setting.",
    ],
    keyPoints: [
      "Creates fractional columns for deeper resurfacing and remodeling.",
      "Requires planned downtime and disciplined aftercare.",
      "Settings must reflect skin type, history, and treatment goals.",
    ],
  },
  {
    slug: "skinpen-microneedling-vs-chemical-peels",
    date: "Jan 29, 2026",
    categories: ["SKINCARE"],
    title: "SkinPen Microneedling vs. Chemical Peels: What Your Skin Needs",
    excerpt:
      "Mechanical collagen induction vs. chemical acid exfoliation for acne scars and tone.",
    image:
      "https://www.umedspa.com/wp-content/uploads/2024/01/19.webp",
    alt: "Skincare professional performing a precise facial treatment",
    content: [
      "SkinPen microneedling and chemical peels both encourage renewal, but they begin through different pathways. Microneedling creates controlled microchannels that initiate a repair response, making it useful for selected texture and acne-scar concerns.",
      "Chemical peels use carefully chosen acids to loosen and remove surface cells at a controlled depth. Depending on the formulation, they may address dullness, uneven tone, congestion, or fine surface lines.",
      "The right choice depends on scar type, pigment risk, active acne, skin sensitivity, medications, and downtime. Alternating the treatments can be useful for some patients, but the sequence should protect the skin barrier and avoid unnecessary inflammation.",
    ],
    keyPoints: [
      "Microneedling supports mechanical collagen induction.",
      "Peels use controlled chemical exfoliation at selected depths.",
      "Scar type, pigment risk, and barrier health guide the choice.",
    ],
  },
  {
    slug: "hydrafacial-vs-signature-custom-facials",
    date: "Jan 11, 2026",
    categories: ["SKINCARE"],
    title: "HydraFacial MD vs. Signature Facials: Building Your Monthly Routine",
    excerpt:
      "Vortex extraction vs. custom bespoke botanical facial therapy.",
    image:
      "https://www.umedspa.com/wp-content/uploads/2024/01/20.webp",
    alt: "Client relaxing during a customized professional facial",
    content: [
      "HydraFacial MD follows a device-led sequence that cleanses, exfoliates, extracts, and infuses selected serums using vortex technology. It offers a consistent framework that can be adjusted with boosters and treatment tips.",
      "An Elysian Signature Facial is built more freely around the skin on that particular day. An aesthetician may vary cleansing, exfoliation, masking, massage, hydration, and calming steps according to sensitivity, congestion, dryness, or seasonal changes.",
      "A monthly plan does not need to choose one forever. HydraFacial may suit extraction and event-ready hydration, while a custom facial can give more flexibility when barrier support or hands-on care is the priority.",
    ],
    keyPoints: [
      "HydraFacial uses a repeatable device-based treatment sequence.",
      "Signature facials adapt each step to current skin needs.",
      "A thoughtful routine can alternate modalities over time.",
    ],
  },
  {
    slug: "medical-grade-vs-otc-skincare-science",
    date: "Dec 18, 2025",
    categories: ["SKINCARE"],
    title: "Medical-Grade vs. Over-the-Counter: The Science of Dermal Delivery",
    excerpt:
      "Active ingredient concentrations and penetration mechanisms in clinical skincare.",
    image:
      "https://www.umedspa.com/wp-content/uploads/2024/01/21.webp",
    alt: "Curated clinical skincare products arranged in a treatment space",
    content: [
      "The label medical-grade does not automatically make every product superior, and over-the-counter does not mean ineffective. What matters is the active ingredient, concentration, formulation, stability, packaging, and whether it can reach the intended layer of skin.",
      "Clinical products may offer higher strengths or delivery systems that require professional guidance. That can be useful for concerns such as acne, pigment, or photoaging, but it also raises the importance of correct sequencing and irritation management.",
      "A simple routine used consistently usually outperforms an overcrowded shelf. Cleanser, moisturizer, and broad-spectrum sunscreen form the base; targeted actives should be added one at a time according to skin tolerance and evidence.",
    ],
    keyPoints: [
      "Formulation and delivery matter alongside ingredient concentration.",
      "Higher strength can mean higher irritation risk without guidance.",
      "Consistency and sunscreen remain the foundation of results.",
    ],
  },
  {
    slug: "d-magazine-top-rated-med-spa",
    date: "Nov 20, 2025",
    categories: ["OTHER"],
    title: "D Magazine: How Elysian Aesthetics Became a Top-Rated Destination",
    excerpt:
      "Physician-led safety, ongoing injector training, and 1,000+ 5-star patient reviews.",
    image:
      "https://www.umedspa.com/wp-content/uploads/2026/08/3_compressed_compressed_compressed.webp",
    alt: "Aesthetic medical team collaborating on a personalized patient plan",
    content: [
      "Elysian Aesthetics & Wellness was built around a clinical promise: every recommendation should balance safety, evidence, and the patient's own definition of confidence. That means beginning with assessment and education rather than a preselected procedure.",
      "Ongoing injector and device training helps the team refine technique as products and technologies evolve. Providers collaborate across injectables, lasers, and skincare so a treatment roadmap can address the whole picture instead of isolated concerns.",
      "More than a thousand 5-star patient reviews reflect the details surrounding the procedure as much as the treatment itself: transparent expectations, comfort, follow-up, and natural-looking plans that respect each person's features.",
    ],
    keyPoints: [
      "Clinical safety and education lead every treatment decision.",
      "Ongoing training supports precise, current techniques.",
      "Long-term relationships matter more than one-time procedures.",
    ],
  },
  {
    slug: "pronox-pain-management-anxiety-free",
    date: "Oct 30, 2025",
    categories: ["OTHER"],
    title: "Overcoming Procedure Anxiety: Pro-Nox and Comfort Protocols",
    excerpt:
      "Patient-controlled 50/50 nitrous oxide laughing gas and chilled air cooling.",
    image:
      "https://www.umedspa.com/wp-content/uploads/2024/01/22.webp",
    alt: "Provider explaining comfort options before an aesthetic procedure",
    content: [
      "Procedure anxiety is common and deserves a plan of its own. Pro-Nox is a patient-controlled system that delivers a fixed 50/50 mixture of nitrous oxide and oxygen, allowing eligible patients to use it during selected treatments while remaining responsive.",
      "Comfort care can also include prescription-strength topical numbing when appropriate, chilled air cooling, vibration, slower pacing, breaks, and clear communication before each step. The best combination depends on the procedure and the patient's health history.",
      "A consultation is the right time to discuss previous reactions, breathing conditions, medications, pregnancy, transportation, and the specific clinic protocol. No patient should feel pressured to continue if discomfort or anxiety is not adequately controlled.",
    ],
    keyPoints: [
      "Pro-Nox provides a patient-controlled 50/50 nitrous and oxygen mixture.",
      "Cooling, numbing, pacing, and communication can work together.",
      "Medical screening determines which comfort options are appropriate.",
    ],
  },
] as const;

type Article = BlogArticle;

type JournalProps = {
  variant?: "home" | "blog";
};

type ArticleReaderProps = {
  article: Article | null;
  onBook: () => void;
  onClose: () => void;
  onSelectCategory: (category: BlogCategory) => void;
};

function ArticleReader({
  article,
  onBook,
  onClose,
  onSelectCategory,
}: ArticleReaderProps) {
  const dialogRef = useRef<HTMLElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (!article) return;

    const previouslyFocused = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    const focusFrame = window.requestAnimationFrame(() => {
      closeButtonRef.current?.focus();
    });

    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key !== "Tab" || !dialogRef.current) return;

      const focusable = Array.from(
        dialogRef.current.querySelectorAll<HTMLElement>(
          'button:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])',
        ),
      );

      if (focusable.length === 0) {
        event.preventDefault();
        dialogRef.current.focus();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement;

      if (
        event.shiftKey &&
        (active === first || !dialogRef.current.contains(active))
      ) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      window.cancelAnimationFrame(focusFrame);
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
      previouslyFocused?.focus();
    };
  }, [article, onClose]);

  return (
    <AnimatePresence>
      {article && (
        <motion.div
          className="fixed inset-0 z-[90] flex items-end justify-end"
          initial={reduceMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={reduceMotion ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: reduceMotion ? 0 : 0.25 }}
        >
          <button
            type="button"
            tabIndex={-1}
            aria-label="Close article"
            onClick={onClose}
            className="absolute inset-0 cursor-default bg-espresso-950/75 backdrop-blur-sm"
          />
          <motion.article
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={`reader-title-${article.slug}`}
            aria-describedby={`reader-summary-${article.slug}`}
            tabIndex={-1}
            initial={reduceMotion ? false : { x: "100%" }}
            animate={{ x: 0 }}
            exit={reduceMotion ? { x: 0 } : { x: "100%" }}
            transition={
              reduceMotion
                ? { duration: 0 }
                : { duration: 0.48, ease: [0.22, 1, 0.36, 1] }
            }
            className="relative h-[96dvh] w-full overflow-y-auto rounded-t-2xl border-l border-line-strong bg-canvas shadow-lift outline-none sm:h-full sm:max-w-3xl sm:rounded-none"
          >
            <div className="relative aspect-[16/9] min-h-64 overflow-hidden">
              <Image
                src={article.image}
                alt={article.alt}
                fill
                unoptimized
                sizes="(max-width: 768px) 100vw, 768px"
                className="object-cover"
              />
              <div
                className="absolute inset-0 bg-gradient-to-t from-espresso-950/90 via-espresso-950/30 to-transparent"
                aria-hidden="true"
              />
              <button
                ref={closeButtonRef}
                type="button"
                onClick={onClose}
                aria-label="Close article reader"
                className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full border border-white/60 bg-espresso-950/55 text-white backdrop-blur-sm transition hover:bg-espresso-950 sm:right-7 sm:top-7"
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
                    strokeWidth="1.7"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
              <div className="absolute inset-x-6 bottom-6 sm:inset-x-10 sm:bottom-9">
                <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-stone">
                  {article.date}
                </p>
                <h2
                  id={`reader-title-${article.slug}`}
                  className="mt-3 max-w-2xl font-display text-3xl leading-[1.1] text-white sm:text-5xl"
                >
                  {article.title}
                </h2>
              </div>
            </div>

            <div className="px-6 py-8 sm:px-11 sm:py-12">
              <div className="flex flex-wrap gap-2">
                {article.categories.map((category) => (
                  <button
                    key={category}
                    type="button"
                    onClick={() => onSelectCategory(category)}
                    className="rounded-full border border-line-strong bg-card px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-espresso-800 transition hover:border-espresso-900 hover:bg-espresso-900 hover:text-canvas"
                    aria-label={`Show ${category} articles`}
                  >
                    {category}
                  </button>
                ))}
              </div>

              <p
                id={`reader-summary-${article.slug}`}
                className="mt-7 border-b border-line pb-8 font-display text-xl leading-8 text-espresso-900 sm:text-2xl sm:leading-9"
              >
                {article.excerpt}
              </p>

              <div className="mt-9 space-y-5 text-[15px] leading-8 text-espresso-800 sm:text-base">
                {article.content.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>

              <section className="mt-10 rounded-2xl bg-card p-6 sm:p-7">
                <h3 className="font-display text-2xl text-espresso-900">
                  What to remember
                </h3>
                <ul className="mt-5 space-y-3 text-sm leading-6 text-espresso-800">
                  {article.keyPoints.map((point) => (
                    <li key={point} className="flex gap-3">
                      <span className="text-espresso-500" aria-hidden="true">
                        &mdash;
                      </span>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </section>

              <div className="mt-10 border-t border-line pt-7">
                <p className="text-xs italic leading-5 text-espresso-600">
                  Educational content only. A qualified provider should review
                  your medical history, anatomy, skin, and goals before
                  recommending treatment.
                </p>
                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                  <button
                    type="button"
                    onClick={onBook}
                    className="inline-flex min-h-12 items-center justify-center rounded-full bg-espresso-900 px-6 py-3 text-xs font-bold uppercase tracking-[0.17em] text-canvas transition hover:bg-espresso-950"
                  >
                    Book a consultation
                  </button>
                  <button
                    type="button"
                    onClick={onClose}
                    className="inline-flex min-h-12 items-center justify-center rounded-full border border-line-strong px-6 py-3 text-xs font-bold uppercase tracking-[0.17em] text-espresso-900 transition hover:bg-card"
                  >
                    Close reader
                  </button>
                </div>
              </div>
            </div>
          </motion.article>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function Journal({ variant = "home" }: JournalProps) {
  const [activeFilter, setActiveFilter] = useState<BlogFilter>("ALL");
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const filterTabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const reduceMotion = useReducedMotion();
  const { openBooking } = useBooking();
  const isBlogPage = variant === "blog";

  const visibleArticles = useMemo(
    () =>
      activeFilter === "ALL"
        ? BLOG_ARTICLES
        : BLOG_ARTICLES.filter((article) =>
            article.categories.includes(activeFilter as BlogCategory),
          ),
    [activeFilter],
  );

  const closeArticle = useCallback(() => setSelectedArticle(null), []);

  const bookFromReader = useCallback(() => {
    setSelectedArticle(null);
    window.requestAnimationFrame(() => {
      openBooking("Complimentary Consultation");
    });
  }, [openBooking]);

  const handleFilterKeyDown = useCallback(
    (event: ReactKeyboardEvent<HTMLButtonElement>, currentIndex: number) => {
      let nextIndex: number | null = null;

      if (event.key === "ArrowRight") {
        nextIndex = (currentIndex + 1) % BLOG_FILTERS.length;
      } else if (event.key === "ArrowLeft") {
        nextIndex =
          (currentIndex - 1 + BLOG_FILTERS.length) % BLOG_FILTERS.length;
      } else if (event.key === "Home") {
        nextIndex = 0;
      } else if (event.key === "End") {
        nextIndex = BLOG_FILTERS.length - 1;
      }

      if (nextIndex === null) return;

      event.preventDefault();
      setActiveFilter(BLOG_FILTERS[nextIndex]);
      filterTabRefs.current[nextIndex]?.focus();
    },
    [],
  );

  const selectCategoryFromReader = useCallback(
    (category: BlogCategory) => {
      setActiveFilter(category);
      setSelectedArticle(null);
      window.requestAnimationFrame(() => {
        document.getElementById("journal-feed")?.scrollIntoView({
          behavior: reduceMotion ? "auto" : "smooth",
          block: "start",
        });
      });
    },
    [reduceMotion],
  );

  return (
    <section
      id="journal"
      aria-labelledby="journal-heading"
      className={`scroll-mt-24 ${
        isBlogPage
          ? "min-h-screen bg-canvas pb-24 pt-16 sm:pb-32 sm:pt-24"
          : "bg-card py-20 sm:py-28"
      }`}
    >
      <div className="mx-auto max-w-[1520px] px-5 sm:px-8 lg:px-12">
        {isBlogPage ? (
          <div className="border-b border-line pb-10 sm:pb-14">
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-espresso-600">
              Elysian Aesthetics &amp; Wellness
            </p>
            <div className="mt-5 grid gap-6 lg:grid-cols-[1fr_0.8fr] lg:items-end">
              <h1
                id="journal-heading"
                className="font-display text-5xl leading-none text-espresso-900 sm:text-6xl lg:text-[4rem]"
              >
                The Journal
              </h1>
              <p className="max-w-xl text-base leading-7 text-espresso-600 sm:text-lg lg:justify-self-end">
                Clear clinical perspective on injectables, laser technology,
                skin health, and the thinking behind a personalized plan.
              </p>
            </div>
          </div>
        ) : (
          <Reveal className="grid gap-6 border-b border-line pb-10 lg:grid-cols-[1fr_auto] lg:items-end">
            <div className="max-w-3xl">
              <p className="text-xs font-bold uppercase tracking-[0.28em] text-espresso-600">
                The Elysian Journal
              </p>
              <h2
                id="journal-heading"
                className="mt-4 font-display text-4xl leading-[1.08] text-espresso-900 sm:text-5xl lg:text-6xl"
              >
                Better questions lead to better care.
              </h2>
              <p className="mt-5 max-w-2xl text-base leading-7 text-espresso-600 sm:text-lg">
                Evidence-minded education for confident decisions about
                aesthetics, wellness, and long-term skin health.
              </p>
            </div>
            <Link
              href="/blog"
              className="inline-flex min-h-12 items-center justify-center rounded-full border border-line-strong bg-canvas px-6 py-3 text-xs font-bold uppercase tracking-[0.17em] text-espresso-900 transition hover:border-espresso-900 hover:bg-espresso-900 hover:text-canvas"
            >
              Visit the journal
              <span className="ml-2" aria-hidden="true">
                &rarr;
              </span>
            </Link>
          </Reveal>
        )}

        <div
          className={`${isBlogPage ? "mt-10" : "mt-8"} overflow-x-auto pb-2`}
          role="tablist"
          aria-label="Filter journal articles by category"
        >
          <div className="flex min-w-max gap-2.5">
            {BLOG_FILTERS.map((filter, index) => {
              const active = activeFilter === filter;
              const filterId = `journal-filter-${filter
                .toLowerCase()
                .replace(/[^a-z]+/g, "-")}`;

              return (
                <button
                  key={filter}
                  ref={(node) => {
                    filterTabRefs.current[index] = node;
                  }}
                  id={filterId}
                  type="button"
                  role="tab"
                  tabIndex={active ? 0 : -1}
                  aria-selected={active}
                  aria-controls="journal-feed"
                  onClick={() => setActiveFilter(filter)}
                  onKeyDown={(event) => handleFilterKeyDown(event, index)}
                  className={`min-h-11 rounded-full border px-5 py-2.5 text-[11px] font-bold tracking-[0.16em] transition duration-300 sm:px-6 ${
                    active
                      ? "border-espresso-900 bg-espresso-900 text-canvas"
                      : "border-line-strong bg-card text-espresso-800 hover:border-espresso-900 hover:bg-canvas"
                  }`}
                >
                  {filter}
                </button>
              );
            })}
          </div>
        </div>

        <p className="sr-only" aria-live="polite">
          Showing {visibleArticles.length} {activeFilter.toLowerCase()} article
          {visibleArticles.length === 1 ? "" : "s"}.
        </p>

        <div
          id="journal-feed"
          role="tabpanel"
          aria-labelledby={`journal-filter-${activeFilter
            .toLowerCase()
            .replace(/[^a-z]+/g, "-")}`}
          tabIndex={-1}
          className="scroll-mt-32 outline-none"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={activeFilter}
              initial={reduceMotion ? false : { opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={
                reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: -8 }
              }
              transition={
                reduceMotion
                  ? { duration: 0 }
                  : { duration: 0.32, ease: [0.22, 1, 0.36, 1] }
              }
              className={`mt-8 grid gap-x-6 gap-y-12 ${
                isBlogPage ? "md:grid-cols-2 xl:grid-cols-3" : "md:grid-cols-3"
              }`}
            >
              {visibleArticles.map((article, index) => (
                <article
                  key={article.slug}
                  className={`group relative flex h-full flex-col ${
                    isBlogPage
                      ? "border-0 bg-transparent shadow-none"
                      : "overflow-hidden rounded-2xl border border-line bg-canvas shadow-soft transition duration-300 hover:-translate-y-1 hover:shadow-lift"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setSelectedArticle(article)}
                    aria-haspopup="dialog"
                    aria-label={`Open full article: ${article.title}`}
                    className="absolute inset-0 z-10 rounded-2xl focus-visible:ring-2 focus-visible:ring-espresso-700 focus-visible:ring-offset-2"
                  />

                  <div
                    className={`relative aspect-[4/3] w-full overflow-hidden ${
                      isBlogPage ? "rounded-2xl" : ""
                    }`}
                  >
                    <Image
                      src={article.image}
                      alt={article.alt}
                      fill
                      unoptimized
                      priority={isBlogPage && index === 0}
                      sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                    />
                    <span
                      className="absolute inset-0 bg-gradient-to-t from-espresso-950/25 to-transparent opacity-0 transition-opacity group-hover:opacity-100"
                      aria-hidden="true"
                    />
                  </div>

                  <div
                    className={`flex flex-1 flex-col ${
                      isBlogPage ? "pt-6" : "p-6 sm:p-7"
                    }`}
                  >
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-espresso-600">
                      {article.date}
                    </p>
                    <div className="relative z-20 mt-3 flex flex-wrap gap-2">
                      {article.categories.map((category) => (
                        <button
                          key={category}
                          type="button"
                          onClick={() => setActiveFilter(category)}
                          className="rounded-full border border-line-strong bg-card px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.16em] text-espresso-800 transition hover:border-espresso-900 hover:bg-espresso-900 hover:text-canvas"
                          aria-label={`Filter by ${category}`}
                        >
                          {category}
                        </button>
                      ))}
                    </div>
                    <h3 className="mt-4 font-display text-2xl leading-snug text-espresso-900">
                      {article.title}
                    </h3>
                    <p className="mt-4 flex-1 text-sm leading-6 text-espresso-600">
                      {article.excerpt}
                    </p>
                    <span
                      className="mt-6 inline-flex min-h-11 items-center gap-3 self-start rounded-full border border-line-strong px-5 py-2.5 text-[11px] font-bold uppercase tracking-[0.18em] text-espresso-900 transition group-hover:border-espresso-900 group-hover:bg-espresso-900 group-hover:text-white"
                      aria-hidden="true"
                    >
                      Read article
                      <span>&rarr;</span>
                    </span>
                  </div>
                </article>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <ArticleReader
        article={selectedArticle}
        onBook={bookFromReader}
        onClose={closeArticle}
        onSelectCategory={selectCategoryFromReader}
      />
    </section>
  );
}
