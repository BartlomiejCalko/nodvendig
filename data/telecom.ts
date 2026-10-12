/**
 * Content for the Nødvendig Telecom scroll experience.
 *
 * Progress values (0–1) map to the master scroll timeline. Everything that is
 * read as copy lives in HTML overlays; the WebGL world only stages it.
 *
 * NOTE: figures marked `verify` are capability statements written for the
 * concept — confirm them against real project data before launch.
 */

export type TelecomChapter = {
  id: string;
  index: string;
  label: string;
  start: number;
};

export const telecomChapters: TelecomChapter[] = [
  { id: "signal", index: "00", label: "Signal", start: 0 },
  { id: "idea", index: "01", label: "Idea", start: 0.28 },
  { id: "build", index: "02", label: "Build", start: 0.5 },
  { id: "deliver", index: "03", label: "Deliver", start: 0.74 },
  { id: "connect", index: "04", label: "Connect", start: 0.9 },
];

export type OverlayPlacement =
  | "center"
  | "left"
  | "right"
  | "bottom-left"
  | "bottom-right"
  | "top-left";

export type TelecomOverlay = {
  id: string;
  range: [number, number];
  placement: OverlayPlacement;
  eyebrow?: string;
  title?: string;
  body?: string;
  items?: string[];
  stat?: { value: string; label: string };
  size?: "hero" | "large" | "medium" | "small";
  tone?: "light" | "dark";
};

export const telecomOverlays: TelecomOverlay[] = [
  // Scene 1 — the light grey data hall
  {
    id: "intro",
    range: [0, 0.045],
    placement: "bottom-left",
    eyebrow: "Nødvendig Telecom",
    title: "Networks are built in the physical world.",
    body: "Fiber, structured cabling, cable routes and racks — engineered, installed and certified inside the data center.",
    size: "hero",
    tone: "light",
  },
  {
    id: "hall",
    range: [0.05, 0.1],
    placement: "right",
    eyebrow: "The data hall",
    title: "Every row, route and port is planned before a single cable is pulled.",
    size: "medium",
    tone: "light",
  },
  {
    id: "strand",
    range: [0.112, 0.152],
    placement: "bottom-left",
    eyebrow: "Single-mode OS2 · 9/125",
    title: "It all starts with one strand of glass.",
    body: "A core of 9 microns. A cladding of 125. Light, contained by physics.",
    size: "large",
    tone: "light",
  },

  // Scene 2 — inside the fiber
  {
    id: "signal",
    range: [0.18, 0.225],
    placement: "center",
    eyebrow: "Total internal reflection",
    title: "You are the signal.",
    size: "hero",
  },
  {
    id: "speed",
    range: [0.225, 0.265],
    placement: "bottom-right",
    stat: { value: "≈ 204 000 km/s", label: "Speed of light in glass (n ≈ 1.47)" },
    size: "medium",
  },

  // Scene 3 — IDEA
  {
    id: "idea-what",
    range: [0.36, 0.405],
    placement: "left",
    eyebrow: "01 — Idea",
    title: "We turn network designs into physical reality.",
    body: "Nødvendig Telecom delivers the passive network layer of data centers: fiber backbones, structured cabling, containment and racks — from first drawing to certified handover.",
    size: "large",
  },
  {
    id: "idea-who",
    range: [0.405, 0.45],
    placement: "right",
    eyebrow: "Who we build for",
    items: [
      "Data center operators",
      "Colocation & hyperscale",
      "AI / HPC facilities",
      "Enterprise & public sector",
    ],
    size: "medium",
  },
  {
    id: "idea-why",
    range: [0.45, 0.495],
    placement: "left",
    eyebrow: "Why it matters",
    title: "The physical layer is where reliability is won or lost.",
    body: "Bend radius, loss budgets, labelling, separation and documentation decide how a network performs for the next fifteen years.",
    size: "medium",
  },

  // Scene 4 — BUILD
  {
    id: "build-01",
    range: [0.56, 0.605],
    placement: "left",
    eyebrow: "Step 01 — Design & route",
    title: "Survey. Route. Document.",
    items: [
      "Site survey & pathway design",
      "Fiber & copper routing plans",
      "Rack elevations & port maps",
      "Loss budget calculation",
    ],
    size: "medium",
  },
  {
    id: "build-02",
    range: [0.61, 0.655],
    placement: "right",
    eyebrow: "Step 02 — Install & terminate",
    title: "Contain. Pull. Splice. Terminate.",
    items: [
      "Cable trays, ladders & fiber runners",
      "Backbone & horizontal cabling",
      "Fusion splicing · MPO/MTP trunks",
      "Rack & stack, patching, labelling",
    ],
    size: "medium",
  },
  {
    id: "build-03",
    range: [0.66, 0.705],
    placement: "left",
    eyebrow: "Step 03 — Test & certify",
    title: "Every link measured. Every port proven.",
    items: [
      "OTDR & insertion loss testing",
      "Copper certification",
      "As-built documentation",
      "Handover & warranty",
    ],
    size: "medium",
  },
  {
    id: "build-services",
    range: [0.705, 0.74],
    placement: "bottom-right",
    eyebrow: "Capabilities",
    items: [
      "Structured cabling — Cat6A",
      "Single-mode OS2 · Multimode OM4/OM5",
      "Data center interconnect",
      "Meet-me rooms & cross-connects",
    ],
    size: "small",
  },

  // Scene 5 — DELIVER
  {
    id: "deliver-certified",
    range: [0.8, 0.835],
    placement: "bottom-left",
    eyebrow: "Certified",
    title: "Every link tested and documented before handover.",
    size: "medium",
  },
  {
    id: "deliver-ready",
    range: [0.835, 0.865],
    placement: "bottom-right",
    eyebrow: "Future-ready",
    title: "Fiber infrastructure ready for 400G and beyond.",
    body: "Designed for the bandwidth density of AI and HPC workloads.",
    size: "medium",
  },
  {
    id: "deliver-standards",
    range: [0.865, 0.895],
    placement: "bottom-left",
    eyebrow: "Built to standard",
    title: "Designed, installed and documented to the standards that govern critical infrastructure.",
    size: "small",
  },
];

export const telecomCta = {
  eyebrow: "Nødvendig Telecom",
  title: "Let’s light up your network.",
  body: "Planning a new data hall, an expansion or a fiber backbone? Talk to the team that builds the physical layer.",
  primary: { label: "Start a project", href: "/contact" },
  secondary: { label: "Explore Nødvendig Constructions", href: "/construction" },
} as const;

export const telecomWords = ["IDEA", "BUILD", "DELIVER"] as const;
