# NØDVENDIG DIGITAL DESIGN SYSTEM

**Version:** 1.0
**Product:** Nødvendig Website
**Purpose:** Visual, UI and motion specification

---

# 1. DESIGN CONCEPT

The Nødvendig visual identity should communicate:

**construction precision**

*

**critical infrastructure**

*

**Scandinavian restraint**

*

**digital sophistication**

The website should not look traditionally “construction”.

Instead, the design should feel like the physical and digital worlds meeting.

Core visual territory:

**ARCHITECTURE × ENGINEERING × DATA**

---

# 2. DESIGN PERSONALITY

The interface should feel:

* precise
* engineered
* confident
* controlled
* industrial
* intelligent
* Scandinavian
* contemporary
* premium
* quiet

It should not feel:

* playful
* futuristic for the sake of it
* corporate-generic
* aggressive
* luxurious
* overly minimal
* SaaS-like

---

# 3. PRIMARY DESIGN INSPIRATION

Use two broad reference principles.

## Engineering layer

Inspired by premium technical/industrial design:

* grid systems
* diagrams
* large typography
* monochrome compositions
* technical lines
* labels
* construction plans
* architectural proportions

## Motion layer

Inspired by premium digital studios:

* fluid transitions
* typographic motion
* narrative scrolling
* changing spatial relationships
* cinematic pacing
* subtle image movement

Do not copy exact designs.

---

# 4. COLOR SYSTEM

Recommended primary palette.

## Canvas

### Ivory

`#F2EFE7`

Primary warm light background.

Usage:

* main page sections
* hero
* editorial content
* large whitespace areas

---

### Paper

`#FAF8F2`

Secondary light surface.

Use sparingly for subtle separation.

---

## Dark

### Carbon

`#1C1C1A`

Primary dark background.

Use instead of absolute black.

---

### Graphite

`#292926`

Secondary dark surface.

---

### Steel

`#706F69`

Secondary text, diagrams and metadata.

---

### Line

`rgba(28,28,26,0.16)`

Light-background borders.

Dark equivalent:

`rgba(255,255,255,0.14)`

---

# 5. ACCENT COLOR

Recommended initial accent:

## Signal Orange

`#FF6747`

Alternative slightly calmer value:

`#ED684C`

Purpose:

* CTA emphasis
* selected technical elements
* diagrams
* active states
* small markers
* motion highlights

Accent must never dominate the page.

Recommended visual share:

**< 8% of viewport**

Avoid multiple accent colors.

---

# 6. SEMANTIC TOKENS

Example:

```css
--color-bg: #F2EFE7;
--color-bg-secondary: #FAF8F2;

--color-dark: #1C1C1A;
--color-dark-secondary: #292926;

--color-text: #1C1C1A;
--color-text-muted: #706F69;

--color-accent: #FF6747;

--color-line: rgba(28,28,26,.16);
--color-line-dark: rgba(255,255,255,.14);
```

Dark section:

```css
--section-bg: var(--color-dark);
--section-text: var(--color-bg);
```

---

# 7. TYPOGRAPHY

Typography must carry much of the visual identity.

Primary font direction:

modern European grotesk.

Preferred starting options:

* Geist
* Manrope
* Inter
* IBM Plex Sans

Initial recommendation:

**Geist**

If testing shows another typeface produces stronger architectural character, change deliberately rather than arbitrarily.

---

# 8. FONT WEIGHTS

Use primarily:

400 — Regular
450/500 — Medium
600 — Semibold

Avoid unnecessary 700–900 weight.

Large headlines should often use regular or medium weight.

This creates a more sophisticated editorial feel.

---

# 9. DISPLAY TYPOGRAPHY

## Display XXL

Used only for major statements.

```css
font-size: clamp(4.5rem, 10vw, 11rem);
line-height: 0.88;
letter-spacing: -0.055em;
```

Examples:

BUILT FOR
DATA CENTERS.

---

## Display XL

```css
font-size: clamp(3.6rem, 7.5vw, 8rem);
line-height: 0.92;
letter-spacing: -0.05em;
```

---

## Display L

```css
font-size: clamp(2.8rem, 5vw, 5.5rem);
line-height: 0.95;
letter-spacing: -0.045em;
```

---

# 10. HEADINGS

## H2

```css
font-size: clamp(2.3rem, 4vw, 4rem);
line-height: 1;
letter-spacing: -0.035em;
```

## H3

```css
font-size: clamp(1.75rem, 2.5vw, 2.75rem);
line-height: 1.05;
letter-spacing: -0.025em;
```

---

# 11. BODY

## Large body

```css
font-size: clamp(1.3rem, 1.8vw, 2rem);
line-height: 1.3;
letter-spacing: -0.02em;
```

## Standard body

```css
font-size: 1rem;
line-height: 1.5;
```

## Small

```css
font-size: .875rem;
line-height: 1.4;
```

---

# 12. TECHNICAL LABELS

Example:

`01 / CONSTRUCTION`

`NØDVENDIG / NORWAY`

`TYDAL / 2026`

Style:

```css
font-size: 12px;
letter-spacing: .04em;
text-transform: uppercase;
```

Avoid excessive letter spacing.

---

# 13. TEXT WIDTH

For readable body copy:

`max-width: 55–65ch`

For editorial statements:

`max-width: 16–24ch`

Large headlines should wrap intentionally.

---

# 14. GRID

Primary desktop grid:

**12 columns**

Maximum content width:

`1760px`

Typical desktop padding:

`48px`

Large desktop:

`56px`

Tablet:

`28px`

Mobile:

`18px`

---

# 15. GRID PHILOSOPHY

Do not center everything.

Preferred compositions:

* 5 / 7
* 4 / 8
* 7 / 5
* 3 / 9

Allow deliberate empty columns.

Whitespace is structural.

---

# 16. VERTICAL RHYTHM

Desktop section spacing:

```css
padding-block: clamp(96px, 11vw, 180px);
```

Major story chapters may use:

`150–240px`

Mobile:

`72–110px`

Avoid identical spacing on every section.

Create rhythm.

---

# 17. CONTAINER

Global container:

```css
width: 100%;
max-width: 1760px;
margin-inline: auto;
padding-inline: clamp(18px, 3vw, 56px);
```

---

# 18. BORDERS

Default:

`1px solid var(--color-line)`

Technical compositions can use:

`0.5px–1px`

Avoid thick borders except deliberate graphic moments.

---

# 19. BORDER RADIUS

Primary rule:

**almost none**

Default:

`0px`

Allowed:

`2–4px`

CTA may use small radius.

Avoid:

* large rounded cards
* pills everywhere
* blob-like surfaces

---

# 20. BUTTONS

## Primary CTA

Text:

**Discuss a project →**

Shape:

rectangular.

Example:

```css
height: 52px;
padding-inline: 24px;
background: var(--color-dark);
color: var(--color-bg);
```

Hover:

* background becomes accent
* arrow moves 4px horizontally

Duration:

`250–350ms`

---

# 21. SECONDARY LINKS

No button container by default.

Example:

**Explore project →**

Use:

text
arrow
animated underline

---

# 22. HEADER

Desktop height:

approximately `86–96px`

Logo left.

Navigation right.

CTA integrated into navigation zone.

Header should feel spatially calm.

Potential scroll behavior:

At top:

transparent / page background.

After scroll:

slightly compressed.

Possible subtle background:

`rgba(...)`

Avoid strong blur.

---

# 23. MOBILE NAVIGATION

Use full-screen overlay.

Not a small dropdown.

Large navigation typography.

Include:

01 Expertise
02 Projects
03 About
04 Careers
05 Contact

CTA at bottom.

Animate using controlled stagger.

---

# 24. HERO COMPOSITION

Hero target height:

`90–100svh`

Composition:

top:

header

middle/lower:

monumental headline

opposite column:

supporting description

bottom:

technical metadata / scroll indicator

Do not use a generic centered H1.

---

# 25. HERO MOTION

Entrance sequence:

1. wordmark appears
2. navigation fades
3. hero line 1 reveals
4. hero line 2 reveals
5. supporting copy appears
6. technical marker becomes visible

Total sequence:

approximately `1.3–1.8s`

Avoid slow splash screens.

---

# 26. LIGHT / DARK TRANSITIONS

Sections should transition between:

Ivory

↓

Carbon

↓

Ivory

↓

Graphite

↓

Ivory

Transitions should sometimes happen through scroll composition rather than simple section cuts.

---

# 27. TECHNICAL GRAPHIC LANGUAGE

Technical visual identity should derive from construction documentation.

Core elements:

* grids
* structural axes
* dimension lines
* section symbols
* coordinates
* labels
* dashed lines
* circles
* nodes
* numbered modules
* building footprints
* simplified sections
* technical room outlines

---

# 28. LINE STYLES

Primary technical line:

```css
stroke: rgba(242,239,231,.24);
stroke-width: 1;
```

Secondary:

```css
stroke: rgba(242,239,231,.12);
```

Accent:

```css
stroke: #FF6747;
```

---

# 29. TECHNICAL LABEL SYSTEM

Examples:

`A / 01`

`GRID 04`

`ZONE B`

`+12.400`

`DC / 01`

`STRUCTURE`

Use intentionally.

Do not make fake technical annotation overwhelming.

---

# 30. SVG MOTION

Preferred animations:

* line draw
* node appearance
* axis extension
* dimension reveal
* zone highlight
* diagram transition

Use:

`stroke-dasharray`

and:

`stroke-dashoffset`

where appropriate.

Animation should communicate progression.

---

# 31. PHOTOGRAPHY

Primary image qualities:

* real
* architectural
* wide
* industrial
* natural
* slightly documentary

Prefer:

* construction activity
* real workers
* real facilities
* real environments
* imperfect reality

Avoid over-retouched corporate photography.

---

# 32. IMAGE RATIOS

Use varied editorial ratios.

Wide:

`16:9`

Architectural:

`4:3`

Portrait:

`3:4`

Ultra-wide project hero:

`21:9`

Do not make every image identical.

---

# 33. IMAGE TREATMENT

Default:

natural photography.

Optional subtle treatment:

* slightly reduced saturation
* restrained contrast
* warm neutral balance

Do not impose heavy filters.

---

# 34. IMAGE REVEALS

Possible reveal:

clipping mask moves vertically.

Avoid:

dramatic zoom.

Recommended:

```text
clip-path
scale 1.03 → 1
```

Duration:

`800–1200ms`

---

# 35. MOTION PRINCIPLES

Motion must always do one of three things:

### Reveal

Introduce information.

### Explain

Show transformation or relationship.

### Guide

Direct the eye.

If an animation does none of these, remove it.

---

# 36. MOTION CHARACTER

Motion personality:

**controlled inertia**

not:

**springy interface**

Preferred easing:

```css
cubic-bezier(.22,1,.36,1)
```

Alternative:

```css
cubic-bezier(.16,1,.3,1)
```

---

# 37. MOTION SPEEDS

Fast interaction:

`180–280ms`

Normal UI:

`300–450ms`

Editorial reveal:

`700–1000ms`

Large transition:

`900–1400ms`

Avoid everything moving at the same speed.

---

# 38. SCROLL EXPERIENCE

Use smooth scrolling carefully.

Recommended:

Lenis.

Scroll should feel:

* slightly weighted
* smooth
* responsive

Never make scrolling feel delayed.

---

# 39. STICKY SECTIONS

Best candidates:

* BUILD / TRANSFORM / DELIVER
* Tydal transformation
* technical data center diagram

Do not make every section sticky.

---

# 40. BUILD / TRANSFORM / DELIVER EXPERIENCE

One possible desktop sequence:

Left:

large word.

Right:

technical drawing.

During scroll:

BUILD

↓

drawing develops

↓

TRANSFORM

↓

drawing reconfigures

↓

DELIVER

↓

people / schedule / structure converge

Mobile:

simple vertical sections.

---

# 41. TYDAL STORY

Ideal sequence:

`01 / EXISTING`

image / diagram

↓

`02 / STRIP OUT`

selected areas disappear

↓

`03 / REBUILD`

new construction appears

↓

`04 / INFRASTRUCTURE`

technical zones appear

↓

`05 / AI READY`

full composition

The interaction should communicate evolution.

---

# 42. MICROINTERACTIONS

Buttons:

arrow translate.

Links:

animated line.

Technical labels:

small accent indicator.

Images:

subtle scale.

Navigation:

precise underline or marker.

Avoid unnecessary cursor effects.

---

# 43. CUSTOM CURSOR

Default recommendation:

**Do not use one initially.**

Only add if later testing shows it meaningfully improves the experience.

---

# 44. ICONOGRAPHY

Do not use generic icons for core services.

Use technical graphics instead.

Lucide acceptable for:

* menu
* external link
* form controls
* simple interface utilities

Not for:

* Construction
* Conversion
* Structural works
* Site execution

---

# 45. CARD SYSTEM

Avoid standard cards.

If a content block needs boundaries, use:

* grid lines
* whitespace
* separators
* image relationships

rather than:

rounded rectangle + shadow.

---

# 46. SHADOWS

Default:

none.

Use shadow only for functional floating UI if needed.

Never use generic SaaS card shadows.

---

# 47. GRADIENTS

Avoid obvious digital gradients.

If needed, use extremely subtle tonal transitions.

Never:

blue-purple AI gradient.

---

# 48. FORMS

Forms should be minimal.

Fields:

large.

Borders:

bottom border or technical rectangle.

Labels:

small.

Focus:

accent line.

No huge rounded input boxes.

---

# 49. FORM EXAMPLE

```text
NAME
________________________

COMPANY
________________________

EMAIL
________________________

PROJECT LOCATION
________________________
```

Submit:

**Send enquiry →**

---

# 50. PROJECT MODULES

Project cards should feel editorial.

Preferred:

large image

small metadata

large project title

location / date

arrow

No boxed card.

---

# 51. PROJECT METADATA

Example:

`TYDAL / NORWAY`

`2026 — ONGOING`

`DATA CENTER CONVERSION`

Small technical typography.

---

# 52. STATS

Stats should use oversized numbers.

Example:

**2023**

Founded

Do not place stats in floating cards.

Use grid and separators.

---

# 53. RESPONSIVE TYPOGRAPHY

Never define display typography with fixed desktop sizes.

Always use:

`clamp()`

Test manually on:

375
430
768
1024
1440
1920

---

# 54. MOBILE DESIGN PRINCIPLE

Mobile should preserve:

* visual confidence
* typography
* rhythm
* technical identity

But simplify:

* line drawings
* sticky sequences
* parallax
* multi-column content

Do not shrink desktop complexity blindly.

---

# 55. ACCESSIBILITY

Minimum requirements:

WCAG AA contrast.

Keyboard focus visible.

No essential information only revealed through hover.

Reduced-motion support.

Readable font sizes.

Large touch targets.

---

# 56. REDUCED MOTION

When:

`prefers-reduced-motion: reduce`

Disable:

* parallax
* smooth scrolling
* lengthy line drawing
* sticky animated transformations

Use simple fades or static states.

---

# 57. DESIGN TOKENS — SPACING

Base unit:

`4px`

Recommended scale:

```text
4
8
12
16
20
24
32
40
48
64
80
96
120
160
200
240
```

Avoid arbitrary spacing values unless necessary.

---

# 58. SECTION LABEL COMPONENT

Example:

`■ What we do`

Style:

small type.

Square marker in accent or dark color.

The component becomes a recurring visual signature.

---

# 59. ARROW LANGUAGE

Use simple:

`→`

or custom long arrow SVG.

Avoid excessive chevrons.

Movement:

horizontal only.

---

# 60. TRANSITIONS BETWEEN ROUTES

Initial version:

subtle fade / vertical transition.

Potential:

content mask reveal.

Keep under approximately:

`500–700ms`

Do not delay navigation.

---

# 61. LOADING

Avoid splash loaders.

Images may use subtle skeleton/background.

Site must become usable immediately.

---

# 62. LOGO USAGE

Until official digital logo assets are supplied:

Use:

**NØDVENDIG**

as text placeholder.

Do not invent a permanent logo.

Leave component ready to accept SVG.

---

# 63. DESIGN QUALITY CHECK

Before approving any section ask:

Does it look like:

**industrial digital infrastructure?**

Or:

**generic web design?**

If generic, simplify and rebuild.

---

# 64. ANTI-PATTERNS

Never use:

* generic three-card services block
* icon circles
* blue tech gradient
* testimonial carousel
* giant rounded rectangles
* meaningless statistics
* stock rack-server hero
* handshake images
* neon AI imagery
* animated particles
* floating glass UI
* excessive blobs
* random marquee text
* generic startup illustrations

---

# 65. CORE VISUAL MOTIFS

Nødvendig should gradually become recognizable through:

**01 — oversized typography**

**02 — technical construction lines**

**03 — ivory / carbon contrast**

**04 — signal orange**

**05 — asymmetric grid**

**06 — documentary project imagery**

**07 — transformation motion**

Together these form the visual identity.

---

# 66. DESIGN NORTH STAR

The visual system should feel like:

**A construction drawing became a digital experience.**

The interface should communicate that Nødvendig physically builds the infrastructure that enables the digital world.

---

# 67. ONE-SENTENCE DESIGN BRIEF

**Create a premium Scandinavian digital experience that combines the precision of engineering documentation with the movement and storytelling of contemporary interactive design.**
