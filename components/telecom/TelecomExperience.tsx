"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { ReactLenis, useLenis } from "lenis/react";
import { useReducedMotion } from "motion/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { company, contact } from "@/data/company";
import { gatewayLink } from "@/data/navigation";
import { telecomChapters, telecomCta, telecomOverlays, type TelecomOverlay } from "@/data/telecom";
import { cn } from "@/lib/cn";
import { range } from "@/components/three/math";
import { MOMENTS, telecomScroll } from "@/components/telecom/telecom-state";

const TelecomCanvas = dynamic(() => import("@/components/telecom/TelecomCanvas"), {
  ssr: false,
});

gsap.registerPlugin(ScrollTrigger);

/** Scroll length of the whole journey, in viewport heights. */
const JOURNEY_VH = 1800;
const CTA_RANGE: [number, number] = [0.94, 1.01];

const fadeFor = (p: number, [start, end]: readonly [number, number]) => {
  const soft = (end - start) * 0.28;
  // Overlays that open the journey are visible before the first scroll.
  const fadeIn = start <= 0 ? 1 : range(p, start, start + soft);
  return Math.min(fadeIn, 1 - range(p, end - soft, end));
};

const placementClass: Record<TelecomOverlay["placement"], string> = {
  center: "inset-x-0 top-1/2 -translate-y-1/2 mx-auto text-center items-center max-w-[22ch]",
  left: "left-[clamp(18px,4vw,72px)] top-1/2 -translate-y-1/2 max-w-[min(34rem,86vw)]",
  right: "right-[clamp(18px,4vw,72px)] md:right-[clamp(120px,10vw,180px)] top-1/2 -translate-y-1/2 max-w-[min(30rem,86vw)] md:text-right md:items-end",
  "bottom-left": "left-[clamp(18px,4vw,72px)] bottom-[clamp(28px,8vh,96px)] max-w-[min(40rem,86vw)]",
  "bottom-right": "right-[clamp(18px,4vw,72px)] md:right-[clamp(120px,10vw,180px)] bottom-[clamp(28px,8vh,96px)] max-w-[min(32rem,86vw)] md:text-right md:items-end",
  "top-left": "left-[clamp(18px,4vw,72px)] top-[18vh] max-w-[min(36rem,86vw)]",
};

const titleSize: Record<NonNullable<TelecomOverlay["size"]>, string> = {
  hero: "text-[clamp(2.6rem,6.4vw,6.6rem)] leading-[0.92] tracking-[-0.05em]",
  large: "text-[clamp(2rem,4.2vw,4.2rem)] leading-[0.96] tracking-[-0.045em]",
  medium: "text-[clamp(1.6rem,2.8vw,2.8rem)] leading-[1] tracking-[-0.035em]",
  small: "text-[clamp(1.25rem,1.8vw,1.8rem)] leading-[1.05] tracking-[-0.03em]",
};

const Overlay = ({ overlay }: { overlay: TelecomOverlay }) => {
  const light = overlay.tone === "light";
  const size = overlay.size ?? "medium";

  return (
    <section
      data-overlay
      data-start={overlay.range[0]}
      data-end={overlay.range[1]}
      aria-label={overlay.title ?? overlay.eyebrow ?? overlay.stat?.value}
      className={cn(
        "pointer-events-none fixed z-20 flex flex-col opacity-0 will-change-[opacity,transform]",
        placementClass[overlay.placement],
        light ? "text-carbon" : "text-white [text-shadow:0_2px_28px_rgb(2_3_6/0.9)]",
      )}
    >
      {overlay.eyebrow ? (
        <p className={cn("technical-label mb-4", light ? "text-steel" : "text-signal")}>
          {overlay.eyebrow}
        </p>
      ) : null}
      {overlay.title ? <h2 className={cn("font-medium", titleSize[size])}>{overlay.title}</h2> : null}
      {overlay.stat ? (
        <p className="flex flex-col gap-3">
          <span
            className={cn(
              "leading-[0.85] font-medium tracking-[-0.06em] whitespace-nowrap",
              size === "large" ? "text-[clamp(3rem,8vw,8rem)]" : "text-[clamp(2.2rem,4.6vw,4.8rem)]",
            )}
          >
            {overlay.stat.value}
          </span>
          <span className="technical-label max-w-[30ch] text-white/60">{overlay.stat.label}</span>
        </p>
      ) : null}
      {overlay.body ? (
        <p
          className={cn(
            "mt-5 max-w-[46ch] text-[clamp(1rem,1.15vw,1.15rem)] leading-relaxed",
            light ? "text-carbon/70" : "text-white/65",
          )}
        >
          {overlay.body}
        </p>
      ) : null}
      {overlay.items ? (
        <ul
          className={cn(
            "mt-5 flex flex-col border-t",
            light ? "border-carbon/15" : "border-white/15",
            overlay.title ? "" : "mt-0",
          )}
        >
          {overlay.items.map((item) => (
            <li
              key={item}
              className={cn(
                "border-b py-2.5 text-[clamp(1rem,1.3vw,1.3rem)] tracking-[-0.01em]",
                light ? "border-carbon/15" : "border-white/15",
              )}
            >
              {item}
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  );
};

/** Wires GSAP ScrollTrigger to Lenis and writes the master progress. */
const ScrollDriver = ({ reducedMotion }: { reducedMotion: boolean }) => {
  const lenis = useLenis(() => ScrollTrigger.update());

  useEffect(() => {
    telecomScroll.reducedMotion = reducedMotion;
    if (process.env.NODE_ENV !== "production") {
      (window as unknown as { __telecom: typeof telecomScroll }).__telecom = telecomScroll;
    }
    const proxy = { progress: 0 };
    let lastProgress = 0;

    // Debug aid (dev only): /telecom?p=0.42 freezes the journey at that point.
    const frozen =
      process.env.NODE_ENV !== "production"
        ? Number(new URLSearchParams(window.location.search).get("p") ?? NaN)
        : NaN;
    if (Number.isFinite(frozen)) {
      telecomScroll.progress = frozen;
      return;
    }

    const tween = gsap.to(proxy, {
      progress: 1,
      ease: "none",
      scrollTrigger: {
        trigger: "[data-journey]",
        start: "top top",
        end: "bottom bottom",
        scrub: reducedMotion ? true : 1.1,
      },
      onUpdate: () => {
        telecomScroll.progress = proxy.progress;
      },
    });

    const tick = () => {
      const delta = telecomScroll.progress - lastProgress;
      lastProgress = telecomScroll.progress;
      telecomScroll.velocity = telecomScroll.velocity * 0.9 + delta * 60 * 0.1;
    };
    gsap.ticker.add(tick);

    return () => {
      gsap.ticker.remove(tick);
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [reducedMotion]);

  useEffect(() => {
    if (lenis) ScrollTrigger.refresh();
  }, [lenis]);

  return null;
};

const ChapterNav = () => {
  const lenis = useLenis();
  const [active, setActive] = useState(0);

  useEffect(() => {
    let frame = 0;
    const tick = () => {
      frame = requestAnimationFrame(tick);
      const p = telecomScroll.progress;
      let index = 0;
      telecomChapters.forEach((chapter, i) => {
        if (p >= chapter.start - 0.001) index = i;
      });
      setActive(index);
    };
    tick();
    return () => cancelAnimationFrame(frame);
  }, []);

  const go = (start: number) => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const target = start * max + (start > 0 ? 2 : 0);
    if (lenis) lenis.scrollTo(target, { duration: 2.4 });
    else window.scrollTo({ top: target });
  };

  return (
    <nav
      aria-label="Chapters"
      className="fixed top-1/2 right-[clamp(12px,2vw,32px)] z-30 hidden -translate-y-1/2 md:block"
    >
      <ol className="flex flex-col gap-3">
        {telecomChapters.map((chapter, i) => (
          <li key={chapter.id}>
            <button
              type="button"
              onClick={() => go(chapter.start)}
              aria-current={i === active ? "step" : undefined}
              className="group flex items-center justify-end gap-3"
            >
              <span
                className={cn(
                  "technical-label transition-[opacity,color] duration-500",
                  i === active ? "opacity-100" : "opacity-0 group-hover:opacity-70",
                  "text-[color:var(--hud)]",
                )}
              >
                {chapter.index} {chapter.label}
              </span>
              <span
                className={cn(
                  "block h-px transition-[width,background-color] duration-500 ease-out-expo",
                  i === active ? "w-8 bg-signal" : "w-4 bg-[color:var(--hud-dim)]",
                )}
              />
            </button>
          </li>
        ))}
      </ol>
    </nav>
  );
};

export const TelecomExperience = () => {
  const prefersReducedMotion = useReducedMotion() ?? false;
  const rootRef = useRef<HTMLDivElement>(null);
  const whiteoutRef = useRef<HTMLDivElement>(null);
  const hintRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const [mobile, setMobile] = useState(false);
  const [ctaActive, setCtaActive] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(max-width: 767px), (pointer: coarse)");
    const update = () => setMobile(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  // One rAF loop stages every HTML overlay against the master progress.
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const overlays = Array.from(root.querySelectorAll<HTMLElement>("[data-overlay]")).map((el) => ({
      el,
      start: Number(el.dataset.start),
      end: Number(el.dataset.end),
    }));
    let world = "";
    let frame = 0;

    const tick = () => {
      frame = requestAnimationFrame(tick);
      const p = telecomScroll.progress;

      overlays.forEach(({ el, start, end }) => {
        const f = fadeFor(p, [start, end]);
        const mid = (start + end) / 2;
        const offset = (1 - f) * 28 * (p < mid ? 1 : -1);
        el.style.opacity = f.toFixed(3);
        el.style.visibility = f > 0.001 ? "visible" : "hidden";
        el.style.translate = `0 ${offset.toFixed(1)}px`;
      });

      const whiteIn = range(p, MOMENTS.whiteoutIn[0], MOMENTS.whiteoutIn[1]);
      const whiteOut = 1 - range(p, MOMENTS.whiteoutOut[0], MOMENTS.whiteoutOut[1]);
      if (whiteoutRef.current) {
        whiteoutRef.current.style.opacity = (p < MOMENTS.handover ? whiteIn * whiteIn : whiteOut).toFixed(3);
      }
      if (hintRef.current) hintRef.current.style.opacity = (1 - range(p, 0, 0.015)).toFixed(3);
      if (progressRef.current) progressRef.current.style.transform = `scaleX(${p})`;
      const cta = fadeFor(p, CTA_RANGE);
      if (ctaRef.current) {
        ctaRef.current.style.opacity = cta.toFixed(3);
        ctaRef.current.style.translate = `0 ${((1 - cta) * 30).toFixed(1)}px`;
      }
      setCtaActive(cta > 0.5);

      const nextWorld = p < MOMENTS.handover ? "room" : "space";
      if (nextWorld !== world) {
        world = nextWorld;
        root.dataset.world = world;
      }
    };
    tick();
    return () => cancelAnimationFrame(frame);
  }, []);

  const content = (
    <div
      ref={rootRef}
      data-world="room"
      className="group/world relative bg-void text-white [--hud-dim:rgb(255_255_255/0.3)] [--hud:#fff] data-[world=room]:[--hud-dim:rgb(28_28_26/0.3)] data-[world=room]:[--hud:#1c1c1a]"
    >
      <ScrollDriver reducedMotion={prefersReducedMotion} />

      {/* WebGL world */}
      <div className="fixed inset-0 z-0" aria-hidden="true">
        <TelecomCanvas mobile={mobile} />
      </div>

      {/* Whiteout used when the camera enters the fibre core */}
      <div
        ref={whiteoutRef}
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-10 bg-[radial-gradient(circle_at_center,#ffffff_0%,#ffffff_45%,#d8fbff_100%)] opacity-0"
      />

      {/* Header */}
      <header className="fixed inset-x-0 top-0 z-40 flex items-center justify-between px-[clamp(18px,3vw,56px)] py-5 text-[color:var(--hud)] transition-colors duration-500">
        <Link href="/" aria-label={`${company.shortName} — choose a division`} className="flex items-baseline gap-2">
          <span className="text-[15px] font-medium tracking-[0.08em]">{company.wordmark}</span>
          <span className="technical-label text-signal">Telecom</span>
        </Link>
        <nav aria-label="Primary" className="flex items-center gap-4 text-[13px] tracking-[0.02em] sm:gap-6">
          <Link
            href={gatewayLink.href}
            aria-label={gatewayLink.label}
            className="technical-label group inline-flex items-center gap-2 border-[color:var(--hud-dim)] opacity-70 transition-opacity hover:opacity-100 sm:border-r sm:pr-6"
          >
            <span
              aria-hidden="true"
              className="text-[15px] transition-transform duration-300 ease-out-expo group-hover:-translate-x-1 sm:text-[12px]"
            >
              ←
            </span>
            <span className="hidden sm:inline">{gatewayLink.label}</span>
          </Link>
          <Link href="/construction" className="hidden opacity-70 transition-opacity hover:opacity-100 sm:inline">
            Constructions
          </Link>
          <Link
            href="/contact"
            className="border border-current px-4 py-2 transition-colors duration-300 hover:border-signal hover:text-signal"
          >
            Start a project
          </Link>
        </nav>
        <div className="absolute inset-x-0 bottom-0 h-px bg-[color:var(--hud-dim)] opacity-40">
          <div ref={progressRef} className="h-px origin-left scale-x-0 bg-signal" />
        </div>
      </header>

      <ChapterNav />

      {/* Scroll hint */}
      <div
        ref={hintRef}
        className="pointer-events-none fixed bottom-8 left-1/2 z-20 hidden -translate-x-1/2 flex-col items-center gap-3 text-carbon sm:flex"
        aria-hidden="true"
      >
        <span className="technical-label">Scroll to follow the signal</span>
        <span className="relative block h-10 w-px overflow-hidden bg-carbon/15">
          <span className="absolute inset-x-0 top-0 h-4 animate-[scroll-hint_1.8s_ease-in-out_infinite] bg-carbon" />
        </span>
      </div>

      {/* Story overlays */}
      <h1 className="sr-only">Nødvendig Telecom — fiber and network infrastructure for data centers</h1>
      {telecomOverlays.map((overlay) => (
        <Overlay key={overlay.id} overlay={overlay} />
      ))}

      {/* Final CTA */}
      <div
        ref={ctaRef}
        className={cn(
          "fixed inset-x-0 bottom-[clamp(24px,7vh,88px)] z-30 px-[clamp(18px,4vw,72px)] opacity-0",
          ctaActive ? "pointer-events-auto" : "pointer-events-none",
        )}
      >
        <div className="mx-auto flex max-w-[68rem] flex-col items-center text-center">
          <p className="technical-label text-signal">{telecomCta.eyebrow}</p>
          <h2 className="mt-4 text-[clamp(2.4rem,6vw,6rem)] leading-[0.92] font-medium tracking-[-0.05em]">
            {telecomCta.title}
          </h2>
          <p className="mt-5 max-w-[48ch] text-[clamp(1rem,1.2vw,1.2rem)] leading-relaxed text-white/65">
            {telecomCta.body}
          </p>
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:gap-4">
            <Link
              href={telecomCta.primary.href}
              tabIndex={ctaActive ? 0 : -1}
              className="group inline-flex items-center gap-3 bg-signal px-6 py-3.5 text-[14px] font-medium text-void transition-colors duration-300 hover:bg-white"
            >
              {telecomCta.primary.label}
              <span aria-hidden="true" className="transition-transform duration-500 ease-out-expo group-hover:translate-x-1">
                →
              </span>
            </Link>
            <a
              href={contact.phoneHref}
              tabIndex={ctaActive ? 0 : -1}
              className="inline-flex items-center gap-3 border border-white/30 px-6 py-3.5 text-[14px] transition-colors duration-300 hover:border-white"
            >
              {contact.phone}
            </a>
          </div>
          <Link
            href={telecomCta.secondary.href}
            tabIndex={ctaActive ? 0 : -1}
            className="technical-label mt-8 text-white/50 transition-colors hover:text-white"
          >
            {telecomCta.secondary.label} →
          </Link>
        </div>
      </div>

      {/* The scroll track that drives the master timeline */}
      <div data-journey style={{ height: `${JOURNEY_VH}vh` }} />
    </div>
  );

  if (prefersReducedMotion) return content;

  return (
    <ReactLenis root options={{ lerp: 0.085, smoothWheel: true, syncTouch: false }}>
      {content}
    </ReactLenis>
  );
};
