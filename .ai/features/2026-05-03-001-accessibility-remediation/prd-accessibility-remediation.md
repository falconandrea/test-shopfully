# Feature: Accessibility Remediation (WCAG 2.2 AA Compliance)

## Overview
This feature focuses on identifying and remediating accessibility violations within the Campaign Manager frontend to achieve WCAG 2.2 Level AA compliance. It addresses barriers for users with visual, motor, or cognitive impairments through semantic HTML, improved color contrast, and proper ARIA implementation.

## User Stories
- As a screen reader user, I want all interactive elements to have descriptive labels so that I can understand their purpose.
- As a user with low vision, I want all text to have sufficient contrast against its background so that it remains legible.
- As a keyboard-only user, I want a logical focus order and visible focus indicators so that I can navigate the application efficiently.
- As a screen reader user, I want to be notified of dynamic content updates (like filtering results) so that I'm aware of state changes.

## Acceptance Criteria
- [x] Zero critical or serious accessibility violations detected by automated `axe-core` audits.
- [x] Page structure uses semantic HTML5 landmarks (`<header>`, `<main>`).
- [x] Correct heading hierarchy (single `h1` per page, sequential `h2`, `h3`).
- [x] All form inputs (Search, Select, Switch) have unique and descriptive accessible names.
- [x] Minimum color contrast ratio of 4.5:1 for all standard text elements.
- [x] Pagination and filter results are announced via `aria-live` regions.
- [x] Interactive icons (e.g., logo, filter buttons) have `aria-label` or equivalent text.

## Out of Scope
- Full manual audit with all screen reader combinations (JAWS, NVDA, VoiceOver) beyond basic simulation.
- Complex keyboard shortcuts (standard Tab/Enter navigation is prioritized).
- Accessibility of the raw backend API (focus is on the React frontend).

## Technical Notes
- Implementation uses Material UI `slotProps` and `SelectProps` to target underlying input elements for ARIA attributes.
- Custom `accessibility-expert` skill added to `.agents/skills/` for automated regression testing.
- Global theme values in `theme.ts` updated to ensure contrast ratios across the entire UI.
- Dependencies added: `puppeteer`, `@axe-core/puppeteer`.

## UI/UX Notes
- Brand primary color updated from `#6C63FF` to `#7C74FF` for improved legibility on dark backgrounds.
- Search and Status filters now include visible labels for better cognitive accessibility.
- Focus rings are preserved and consistent with the brand's primary color.
