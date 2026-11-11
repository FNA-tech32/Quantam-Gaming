# Workflow — ui-review

Visual + accessibility review of a UI change. Produces a structured pass/fail report.

## Prerequisites
- UI change has been committed or is staged.
- Target URL or component path is known.

## Steps

1. **Capture screenshots**  
   At standard breakpoints:
   - Mobile: 360px
   - Tablet: 768px
   - Desktop: 1280px
   - Wide: 1920px (if relevant)
   Use Playwright, Puppeteer, or manual capture. Save to `.shine/ui-review/`.

2. **Accessibility audit**  
   Run axe-core or Lighthouse accessibility audit:
   ```bash
   npx lighthouse <url> --only-categories=accessibility --output=json
   ```
   Or if component-level: run axe on the rendered component.

3. **WCAG AA compliance**  
   Check specifically:
   - Color contrast: text on background meets 4.5:1 (normal) / 3:1 (large text).
   - Alt text: all images have meaningful alt attributes.
   - Focus indicators: visible focus ring on all interactive elements.
   - Heading hierarchy: no skipped levels (h1 → h3 without h2).

4. **Keyboard navigation**  
   - Tab order: logical, follows visual layout.
   - All interactive elements reachable via keyboard.
   - No keyboard traps.
   - Escape closes modals/dropdowns.

5. **Design comparison**  
   If Figma/design reference provided:
   - Compare spacing, typography, colors against design tokens.
   - Flag deviations > 4px spacing or wrong color value.

6. **Responsive behavior**  
   - No horizontal scroll at any breakpoint.
   - Touch targets ≥ 44px on mobile.
   - Text readable without zoom at all breakpoints.

7. **Write review report**  
   ```
   ## UI review — <component/page>
   
   ### Verdict: <approve | request-changes>
   
   ### Accessibility
   | Check | Status | Details |
   |-------|--------|---------|
   | Color contrast | ✅/🔴 | |
   | Alt text | ✅/🔴 | |
   | Keyboard nav | ✅/🔴 | |
   | Focus indicators | ✅/🔴 | |
   
   ### Responsive
   | Breakpoint | Status | Issues |
   |-----------|--------|--------|
   | 360px | ✅/🔴 | |
   | 768px | ✅/🔴 | |
   | 1280px | ✅/🔴 | |
   
   ### Design fidelity
   <deviations from design reference>
   
   ### Screenshots
   <references to captured screenshots>
   ```

## Guardrails
- Never approve if axe reports any serious or critical violation.
- Never skip keyboard navigation test.
- Screenshots are evidence — always capture before approving.
