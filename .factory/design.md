# Visual thesis: the night ascent

## Direction and reason

Prerequisite Pathboard uses **cinematic environmental art**. Relearning a technical subject often feels like seeing a distant summit while the route is hidden. The interface turns that situation into a quiet night ascent: the goal is a warm observatory on a ridge, dependencies are trail markers, and each repaired prerequisite lights a section of the route. The picture explains the product without pretending to diagnose the learner.

The app itself stays restrained. It uses thin paths, contour-line texture, cropped landscape panels, and asymmetric editorial spacing. It must not resemble a centered SaaS hero, a generic node editor, or a course dashboard.

## Palette

This is an intentionally dark, single-mode visual thesis. It preserves the night landscape and reduces glare during focused study.

| Token | Value | Use |
| --- | --- | --- |
| `--night` | `#07191c` | page background |
| `--deep` | `#0d2426` | raised surface |
| `--pine` | `#163638` | borders and secondary surface |
| `--mist` | `#d8e5dc` | primary text |
| `--lichen` | `#9cb4a8` | muted text |
| `--ember` | `#f0a85a` | primary action and route highlight |
| `--ember-ink` | `#231408` | text on ember |
| `--sky` | `#8fc9cc` | focus, links, selected paths |
| `--moss` | `#9fca78` | can explain / repaired |
| `--glacier` | `#82bdda` | can solve |
| `--clay` | `#e88774` | not yet / errors |

Primary text is at least 12:1 against `--night`; muted text is above 7:1. Status always has a text label, never color alone.

## Type and spacing

- Display: Georgia with Cambria fallback. Its carved, cartographic feel belongs to old field journals and observatory plaques.
- Body: system UI stack. It keeps form controls and dense relationship text familiar and fast. No fonts load over the network.
- Scale: 14, 16, 18, 24, 36, and a fluid 48–72 px hero line.
- Measure: 62 characters for reading copy; board panels can be wider.
- Spacing: 4 px base, with 8, 12, 16, 24, 32, 48, 72, and 112 px intervals.
- Shape: clipped corners and softly irregular trail-marker tabs; 6 px or 18 px radii rather than universal rounded cards.

## Layout and interaction grammar

The landing screen is an offset split: copy occupies the lower-left while the generated ridge scene rises on the right. A dotted trail crosses the seam. Product facts sit like a map legend, not feature cards.

The workspace uses two coordinated views. The board places the chosen goal at the right and its prerequisites in columns to the left. The accessible list groups the same concepts by goal and uses ordinary buttons and lists. Selecting a concept opens an editor beside the board on wide screens and below it on mobile. Every connection is user-authored.

Primary actions are solid ember trail markers. Secondary actions are outlined. Links use sky color and an underline. Focus uses a 3 px sky outline with 3 px offset. Targets are at least 44 px.

## Motion policy

The signature motion is **the route lighting**: when a status changes, the relevant path fades from pine to ember over 240 ms, and the next-session marker eases upward 4 px. Panels appear from their physical origin over 180 ms. Nothing loops.

With `prefers-reduced-motion: reduce`, transforms are removed, transitions become near-instant opacity changes, and smooth scrolling is disabled.

## Asset plan and provenance

- `assets/src/night-ascent.png`: original wide cinematic environmental scene generated for this product. It contains a tiny distant observatory, layered dark ridges, sparse warm trail beacons, open sky, and no people or text.
- `public/art/night-ascent-768.webp` and `night-ascent-1280.webp`: optimized responsive hero outputs.
- `public/social-card.jpg`: a 1200×630 crop derived from the same art with the interface adding no essential text inside the image.
- App icons and favicon: hand-authored SVG trail-marker motif, rasterized locally for install icons.

Generation prompt (2026-08-28, factory image deployment):

> Use case: stylized-concept. Asset type: wide landing hero for a prerequisite mapping tool. A cinematic, painterly night landscape viewed across layered alpine ridges. A small modern observatory glows warm amber on a far-right summit. A sparse chain of amber trail beacons climbs from the lower-left through switchbacks toward it, suggesting dependency steps. Deep blue-green forest silhouettes, cool mist in valleys, subtle contour-line textures, one pale moon behind thin clouds, strong depth, premium editorial environmental concept art, quiet and contemplative, wide composition with darker negative space on the left. Palette: near-black teal, pine, mist gray, warm ember, muted cyan. No people, no text, no letters, no numbers, no logos, no watermark, no interface mockup, no fantasy castle, no neon gradients.

Generated imagery is original to this product. It is used as atmosphere and explanation, not as evidence of a feature.
