# Workflow — ui-phase

UI-oriented execution phase: extends execute-phase with brand compliance, visual verification, and accessibility gates.

## Prerequisites
- All execute-phase prerequisites.
- `~/.claude/shine/references/ui-brand.md` loaded.
- Client style guide available (in memory or project docs).

## Steps

1. **Load brand context**  
   Read `~/.claude/shine/references/ui-brand.md`.  
   Read client style guide from `~/.claude/memory/client-<slug>.md` or `./docs/style-guide.md`.  
   Extract: colors, typography, spacing scale, component library, voice/tone.

2. **Execute UI plans per wave**  
   Same wave-based execution as `execute-phase.md`, but with additional constraints:
   - Every component must reference the design system.
   - No hardcoded colors/fonts — use design tokens or CSS variables.
   - All text content follows the voice guidelines from ui-brand.md.

3. **Per-component visual check**  
   After each wave, for each visible component created/modified:
   - Capture screenshot or storybook entry at 3 breakpoints (360, 768, 1280).
   - Route through `shine-ui-checker` agent if available.

4. **Brand compliance pass**  
   Check against ui-brand.md:
   - Voice & tone: no superlatives, no emoji bursts, professional register.
   - Spacing: consistent with the defined scale.
   - Colors: only from the approved palette.
   - Logo usage: correct placement, minimum clear space.
   - Typography: correct font family, weight, and size hierarchy.

5. **Accessibility gate**  
   Run axe-core or equivalent on each new page/component:
   - WCAG AA is the minimum bar.
   - Fail on any serious or critical violation.
   - Keyboard navigation test on all interactive elements.

6. **Responsive verification**  
   Test at minimum 3 breakpoints:
   - No horizontal scroll.
   - Touch targets ≥ 44px on mobile.
   - Text readable without zoom.

7. **Commit**  
   `node shine/bin/shine-tools.cjs commit "ui: phase <N> wave <W>" --scope ui --raw`

## Decision gates
- After each wave: show screenshots + accessibility report before proceeding.
- Brand compliance failure → fix before next wave (not "fix later").

## Output
- Code changes committed with `shine(ui):` messages.
- Screenshots in `.shine/ui-review/`.
- Accessibility report per wave.

## Guardrails
- Never ship a UI component that fails WCAG AA.
- Never use hardcoded colors — always design tokens.
- Never approve without screenshots at all breakpoints.
