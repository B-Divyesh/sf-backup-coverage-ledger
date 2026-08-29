# Visual thesis — the proof lattice

## Direction and rationale

Backup Coverage Ledger uses **generative geometry** as an explanatory system, not decoration. Every critical asset is a solid node; every backup target is a hollow orbit; a verified extraction closes the line between them. The motif makes the product's central distinction visible: a stored copy is only coverage, while a dated extraction proof completes the shape.

The interface should feel like a careful field ledger laid over a systems diagram: calm enough for routine review, sharp enough to expose gaps. It intentionally avoids dashboard gradients, shiny SaaS cards, mascots, and false “all safe” reassurance.

## Palette

Light treatment:

- `paper #F4F0E6` — warm archival paper; the page itself feels durable rather than cloud-like.
- `sheet #FFFCF5` — working surface.
- `ink #18211D` — green-black technical ink; 14.2:1 on paper.
- `muted #5A625C` — secondary text; 5.6:1 on paper.
- `rule #C9C6B9` — structure, never the only signal.
- `signal #275DFF` / `signal-ink #FFFFFF` — actions and focus; 5.3:1.
- `proof #147A5B` / `proof-soft #D8EFE5` — current extraction proof.
- `warning #9A5700` / `warning-soft #F9E5BD` — proof due soon.
- `danger #B42318` / `danger-soft #F9DDD8` — gaps and expired proof.

Dark treatment:

- `paper #111713`, `sheet #19211C`, `ink #F4F0E6`, `muted #B6BDB7`, `rule #3F4942`.
- Accents lift to `signal #88A7FF`, `proof #65D1A6`, `warning #F2B85B`, `danger #FF8B7E`; dark-soft fields remain low-chroma.

Status always has a word and symbol in addition to color. Both treatments are explicit and follow the device preference; users can also switch them.

## Type

- Display and headings: `Georgia`, `Charter`, serif — editorial authority, compact file-folder character.
- Interface and data: `ui-monospace`, `SFMono-Regular`, `Cascadia Code`, `Roboto Mono`, monospace — portable, system-resident, tabular, and appropriate to plain-file infrastructure. No font download is required.
- Scale: 12 / 14 / 16 / 20 / 28 / clamp(40–68) px. Body is 16px minimum. Reading measure is 68 characters.

## Layout and spacing

An 8px base rhythm with 4px optical corrections. Page gutters are 20px on 390px screens, 40px on tablet, and 64px on wide screens. The maximum working width is 1440px. Independent records get bordered rows; grouped controls rely on spacing before boxes. Touch targets are at least 44px.

Desktop uses a narrow review rail beside the ledger. On phones the rail becomes a summary strip, tables become labeled record sheets, secondary explanation collapses, and action controls stack. Nothing requires horizontal scrolling.

## Interaction grammar

- Add/import actions originate at the top of the working ledger.
- Editing opens a native modal sheet from the selected record; focus returns to its origin.
- Destructive deletion requires the asset name and offers a short undo.
- Validation happens on input and import. Errors say which row/field needs repair.
- The proof-date action is explicit: “Record restore proof”; it never implies the app performed a restore.
- The review filter behaves as a compact segmented control with count labels.
- Offline state is a calm badge because offline is expected, not exceptional.

## Motion policy

State transitions use 180–240ms opacity and transform. Rows enter from their data origin with a small vertical shift; dialogs scale from 0.98; status changes briefly emphasize the affected proof marker. No motion loops. Under `prefers-reduced-motion: reduce`, transforms and smooth scrolling are removed and feedback becomes an instant color/outline change.

## Original asset plan and prompt sheet

One generated editorial illustration, `assets/src/proof-lattice.png`, is used in the empty state and on the informational home intro at large sizes. Responsive WebP derivatives are shipped at 480px and 960px widths; the mobile derivative must remain below 300KB. It explains the product metaphor without pretending to be product output.

Prompt (factory image deployment, 2026-08-27):

> Use case: stylized-concept. Asset type: editorial hero illustration for an offline backup coverage utility. Primary request: an abstract “proof lattice” assembled from precise geometric disks, hollow rings, archival folders, and three connected vault-like planes; some connections are complete and one visibly stops before its target, expressing known coverage and a restore-proof gap. Scene/backdrop: warm uncoated ledger paper with a subtle square registration grid. Style/medium: tactile cut-paper geometry mixed with crisp technical ink plotting, restrained risograph misregistration, no photorealism. Composition/framing: wide landscape, main lattice centered-right with generous calm negative space, readable at small size, no interface screenshot. Lighting/mood: flat overcast studio light, methodical, trustworthy, quietly urgent. Color palette: parchment, green-black ink, cobalt blue, proof green, sparing vermilion. Materials/textures: fibrous paper, thin ink rules, small punched circles. Constraints: entirely abstract, no people, no text, no numbers, no logos, no watermark, no brands, no padlock cliché, no clouds, no gradients, no glowing neon, no fake UI.

Hand-authored icons are limited to simple inline SVG geometry (plus, download, upload, print, proof ring) and inherit the interface color. They are functional controls, not decorative art.

## Provenance

The illustration is generated specifically for this product with the factory Azure image deployment and reviewed for stray text, marks, seams, brands, and palette consistency. It is original project material. Prompt sidecar: `assets/src/proof-lattice.json`. The footer discloses “Original generative artwork.”

The 1200×630 social preview is a centered crop of that original illustration. The Apple touch icon is a raster export of the hand-authored proof-ring favicon. No third-party artwork was added during polish round 1.
