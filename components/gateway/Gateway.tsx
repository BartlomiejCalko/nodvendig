"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useReducedMotion } from "motion/react";
import gsap from "gsap";
import { company } from "@/data/company";
import { divisions } from "@/data/divisions";
import { cn } from "@/lib/cn";
import { CadHud } from "@/components/gateway/CadHud";
import { gatewayState, type Division } from "@/components/gateway/gateway-state";

const GatewayScene = dynamic(() => import("@/components/gateway/GatewayScene"), {
  ssr: false,
});

const INTRO_SEEN_KEY = "nv-intro-seen";

const initialState = { ...gatewayState };

const buildTimeline = () => {
  const s = gatewayState;
  const tl = gsap.timeline({ paused: true });

  tl.to(s, { grid: 1, duration: 0.8, ease: "power2.out" }, 0)
    .to(s, { draw: 1, duration: 3.3, ease: "power1.inOut" }, 0.25)
    .to(s, { labels: 1, duration: 0.6, ease: "power2.out" }, 2.9)
    .to(s, { camera: 1, duration: 2.2, ease: "power3.inOut" }, 3.5)
    .to(s, { extrude: 1, duration: 1.4, ease: "power2.out" }, 4.1)
    .to(s, { racks: 1, duration: 2.3, ease: "none" }, 5.1)
    .to(s, { camera: 2, duration: 2.0, ease: "power1.inOut" }, 5.7)
    .to(s, { trays: 1, duration: 1.5, ease: "power1.out" }, 6.9)
    .to(s, { camera: 3, duration: 1.9, ease: "power2.inOut" }, 7.7)
    .to(s, { cables: 1, duration: 2.0, ease: "power1.inOut" }, 7.9)
    .to(s, { planFade: 1, duration: 1.2, ease: "power1.inOut" }, 8.4)
    .to(s, { pulses: 1, duration: 1.0, ease: "power1.out" }, 9.1)
    .to(s, { camera: 4, duration: 2.3, ease: "power3.inOut" }, 9.6)
    .to(s, { outro: 1, duration: 1.4, ease: "power2.out" }, 10.6);

  return tl;
};

export const Gateway = () => {
  const router = useRouter();
  const prefersReducedMotion = useReducedMotion();
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const flashRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);
  const [leaving, setLeaving] = useState<Division | null>(null);
  const [hovered, setHovered] = useState<Division | null>(null);

  useEffect(() => {
    Object.assign(gatewayState, initialState);
    const tl = buildTimeline();
    timelineRef.current = tl;
    if (process.env.NODE_ENV !== "production") {
      (window as unknown as { __gw: unknown }).__gw = { state: gatewayState, tl };
    }

    tl.eventCallback("onUpdate", () => {
      if (gatewayState.outro > 0.25) setReady(true);
    });

    // Mark the intro as seen only once it has actually finished, so a
    // remount (StrictMode, back navigation mid-intro) still plays it.
    const markSeen = () => {
      try {
        sessionStorage.setItem(INTRO_SEEN_KEY, "1");
      } catch {
        // Storage can be unavailable (private mode); nothing to remember.
      }
    };
    tl.eventCallback("onComplete", markSeen);

    let seen = false;
    try {
      seen = sessionStorage.getItem(INTRO_SEEN_KEY) === "1";
    } catch {
      // Ignore — the intro simply plays.
    }

    // Debug aid: /?intro=5.5 freezes the intro at that second.
    const freezeAt = Number(new URLSearchParams(window.location.search).get("intro"));

    if (Number.isFinite(freezeAt) && freezeAt > 0) {
      tl.pause(freezeAt);
    } else if (seen || prefersReducedMotion) {
      // Not suppressing events lets onUpdate flag the choice as ready.
      tl.progress(1, false);
    } else {
      tl.play(0);
    }

    divisions.forEach((division) => router.prefetch(division.href));

    return () => {
      tl.kill();
    };
  }, [prefersReducedMotion, router]);

  const skip = useCallback(() => {
    const tl = timelineRef.current;
    if (!tl) return;
    gsap.to(tl, {
      progress: 1,
      duration: prefersReducedMotion ? 0 : 1.1,
      ease: "power2.inOut",
    });
  }, [prefersReducedMotion]);

  const replay = useCallback(() => {
    setReady(false);
    timelineRef.current?.play(0);
  }, []);

  const handleHover = (division: Division | null) => {
    gatewayState.hover = division;
    setHovered(division);
  };

  const choose = (division: Division, href: string) => (event: React.MouseEvent) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || leaving) return;
    event.preventDefault();
    setLeaving(division);
    gatewayState.exitTo = division;

    if (prefersReducedMotion) {
      router.push(href);
      return;
    }

    gsap.to(gatewayState, { exit: 1, duration: 1.3, ease: "power3.in" });
    gsap.fromTo(
      flashRef.current,
      { opacity: 0 },
      {
        opacity: 1,
        duration: 0.55,
        delay: 0.85,
        ease: "power2.in",
        onComplete: () => router.push(href),
      },
    );
  };

  return (
    <main
      id="main"
      className="relative h-svh w-full overflow-hidden bg-void text-white"
    >
      <div className="absolute inset-0" aria-hidden="true">
        <GatewayScene />
      </div>

      <CadHud timeline={timelineRef} hidden={ready} onSkip={skip} />

      {/* Division choice */}
      <div
        className={cn(
          "pointer-events-none absolute inset-0 flex flex-col justify-between transition-opacity duration-700 ease-out-expo",
          ready && !leaving ? "opacity-100" : "opacity-0",
        )}
      >
        <header className="flex items-center justify-between px-[clamp(18px,3vw,56px)] pt-6">
          <span className="text-[15px] font-medium tracking-[0.08em]">
            {company.wordmark}
          </span>
          <button
            type="button"
            onClick={replay}
            tabIndex={ready ? 0 : -1}
            className="technical-label pointer-events-auto text-white/55 transition-colors duration-300 hover:text-white"
          >
            Replay intro ↺
          </button>
        </header>

        <div className="px-[clamp(18px,3vw,56px)] pb-[clamp(18px,3vw,48px)]">
          <p className="technical-label text-white/55">
            {company.technicalLabel.replace("DATA CENTER CONSTRUCTION", "CHOOSE A DIVISION")}
          </p>
          <h1 className="mt-4 max-w-[16ch] text-[clamp(2.2rem,5.2vw,5.4rem)] leading-[0.94] font-medium tracking-[-0.045em]">
            We build the physical layer of the digital world.
          </h1>

          <ul className="mt-8 grid gap-3 md:mt-10 md:grid-cols-2 md:gap-4">
            {divisions.map((division, i) => {
              const active = hovered === division.id;
              const telecom = division.id === "telecom";
              return (
                <li key={division.id}>
                  <Link
                    href={division.href}
                    tabIndex={ready ? 0 : -1}
                    onClick={choose(division.id, division.href)}
                    onPointerEnter={() => handleHover(division.id)}
                    onPointerLeave={() => handleHover(null)}
                    onFocus={() => handleHover(division.id)}
                    onBlur={() => handleHover(null)}
                    className={cn(
                      "group pointer-events-auto relative flex h-full flex-col justify-between gap-4 overflow-hidden border bg-black/30 p-4 backdrop-blur-md sm:gap-8 sm:p-5 transition-[border-color,background-color] duration-500 ease-out-expo md:p-7",
                      active
                        ? telecom
                          ? "border-signal/70 bg-signal/[0.06]"
                          : "border-accent/70 bg-accent/[0.06]"
                        : "border-white/15",
                    )}
                  >
                    <span
                      aria-hidden="true"
                      className={cn(
                        "absolute inset-x-0 top-0 h-px origin-left scale-x-0 transition-transform duration-700 ease-out-expo group-hover:scale-x-100 group-focus-visible:scale-x-100",
                        telecom ? "bg-signal" : "bg-accent",
                      )}
                    />
                    <span className="flex items-center justify-between">
                      <span className="technical-label text-white/50">
                        0{i + 1} / {division.label}
                      </span>
                      <span
                        className={cn(
                          "technical-label transition-colors duration-300",
                          active ? (telecom ? "text-signal" : "text-accent") : "text-white/40",
                        )}
                      >
                        {division.tag}
                      </span>
                    </span>
                    <span>
                      <span className="block text-[clamp(1.6rem,2.6vw,2.6rem)] leading-none font-medium tracking-[-0.035em]">
                        {company.shortName}{" "}
                        <span className={cn(telecom ? "text-signal" : "text-accent")}>
                          {division.name}
                        </span>
                      </span>
                      <span className="mt-3 hidden max-w-[46ch] text-[15px] leading-snug text-white/65 sm:block">
                        {division.description}
                      </span>
                      <span className="mt-3 inline-flex items-center gap-3 text-[13px] tracking-[0.02em] sm:mt-5">
                        Enter
                        <span
                          aria-hidden="true"
                          className="inline-block transition-transform duration-500 ease-out-expo group-hover:translate-x-1.5"
                        >
                          →
                        </span>
                      </span>
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      <div
        ref={flashRef}
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute inset-0 opacity-0",
          leaving === "telecom" ? "bg-[radial-gradient(circle_at_center,#ffffff_0%,#5fe3ff_35%,#05070a_100%)]" : "bg-ivory",
        )}
      />

      <p className="sr-only" aria-live="polite">
        {ready ? "Intro finished. Choose Nødvendig Constructions or Nødvendig Telecom." : ""}
      </p>
    </main>
  );
};
