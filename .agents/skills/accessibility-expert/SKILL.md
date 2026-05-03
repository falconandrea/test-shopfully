---
name: accessibility-expert
description: Expert accessibility auditor for WCAG 2.2 compliance and screen reader validation. Use this skill to conduct audits, fix accessibility violations, and ensure inclusive design patterns.
---

# Accessibility Expert Skill

This skill provides a comprehensive framework for auditing and improving the accessibility of web applications, focusing on WCAG 2.2 (Level AA) compliance and screen reader compatibility.

## Core Pillars

### 1. WCAG 2.2 Conformance (AA)
All web content must adhere to the **POUR** principles:
- **Perceivable**: Users must be able to perceive information (e.g., text alternatives for non-text content).
- **Operable**: Interface components must be operable (e.g., keyboard accessibility).
- **Understandable**: Information and operation must be understandable (e.g., readable text, predictable behavior).
- **Robust**: Content must be robust enough to work with current and future user agents, including assistive technologies.

### 2. Screen Reader Validation
Testing protocols for major screen readers:
- **VoiceOver** (macOS/iOS + Safari)
- **NVDA** (Windows + Firefox/Chrome)
- **JAWS** (Windows + Chrome)
- **TalkBack** (Android + Chrome)

---

## Audit Checklist

### Perceivable
- [ ] **1.1.1 Non-text Content**: All images have meaningful `alt` text; decorative images have `alt=""`.
- [ ] **1.3.1 Info and Relationships**: Semantic HTML (h1-h6, ul, ol, nav, main, etc.) is used correctly. Form inputs are linked to `<label>` elements via `id`/`for`.
- [ ] **1.4.3 Contrast**: Text has a contrast ratio of at least 4.5:1 (3:1 for large text).
- [ ] **1.4.10 Reflow**: Content reflows without loss of information at 400% zoom (320px width).

### Operable
- [ ] **2.1.1 Keyboard**: All functionality is available via keyboard (Tab, Enter, Space, Arrows).
- [ ] **2.1.2 No Keyboard Trap**: Focus never gets stuck in a component.
- [ ] **2.4.1 Bypass Blocks**: A "Skip to Main Content" link is present and functional.
- [ ] **2.4.3 Focus Order**: Tabbing order is logical and follows the visual layout.
- [ ] **2.4.7 Focus Visible**: Interactive elements have a clear, high-contrast focus indicator.

### Understandable
- [ ] **3.1.1 Language of Page**: `<html lang="en">` (or appropriate language) is set.
- [ ] **3.2.3 Consistent Navigation**: Navigation patterns are consistent across pages.
- [ ] **3.3.1 Error Identification**: Form errors are clearly identified and announced to screen readers (use `aria-describedby` and `role="alert"`).

### Robust
- [ ] **4.1.2 Name, Role, Value**: Custom widgets have correct ARIA roles and accessible names.
- [ ] **4.1.3 Status Messages**: Dynamic content changes (e.g., "Search results loaded") are announced via `aria-live` regions.

---

## Screen Reader Testing Protocol

### Essential VoiceOver Commands (macOS)
- **Toggle VoiceOver**: `Cmd + F5`
- **Next Element**: `VO + Right Arrow`
- **Interact with Group**: `VO + Shift + Down Arrow`
- **Open Rotor**: `VO + U` (Navigate by headings, links, landmarks)
- **Activate Element**: `VO + Space`

### Essential NVDA Commands (Windows)
- **Say All**: `NVDA + Down Arrow`
- **Next Heading**: `H`
- **Next Landmark**: `D`
- **Forms Mode Toggle**: `NVDA + Space`

---

## Automated Testing Integration

### axe-core (Vitest/Jest)
```typescript
import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);

it('should have no accessibility violations', async () => {
  const { container } = render(<MyComponent />);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
```

### Playwright (E2E)
```javascript
const { test, expect } = require('@playwright/test');
const AxeBuilder = require('@axe-core/playwright').default;

test('homepage accessibility audit', async ({ page }) => {
  await page.goto('/');
  const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
  expect(accessibilityScanResults.violations).toEqual([]);
});
```

---

## Remediation Patterns

### Fix: Accessible Modal
- Use `role="dialog"` and `aria-modal="true"`.
- Focus should be trapped inside the modal when open.
- Escape key should close the modal.
- Focus should return to the triggering element upon closing.

### Fix: Accessible Icon Buttons
```html
<!-- Bad -->
<button onClick={handleClose}><CloseIcon /></button>

<!-- Good -->
<button onClick={handleClose} aria-label="Close dialog">
  <CloseIcon aria-hidden="true" />
</button>
```

### Fix: Live Regions
```html
<div role="status" aria-live="polite">
  {loading ? 'Loading...' : 'Results updated'}
</div>
```

---

## Visual Validation & Quality Assurance
As an accessibility expert, you must also be a rigorous visual validator. 

### Core Principles
- **Default Assumption**: The accessibility or UI goal has NOT been achieved until proven otherwise.
- **Critical Lens**: Actively look for flaws, inconsistencies, or incomplete implementations.
- **Visual Evidence Only**: Base judgments on visual evidence (screenshots, live inspection), not just code.

### Mandatory Verification Checklist
- [ ] **Objective Observation**: Describe exactly what is observed without assumptions.
- [ ] **Contrast Verification**: Confirm color contrast ratios meet WCAG standards.
- [ ] **Focus Indicators**: Verify focus indicators are clearly visible and meet contrast requirements.
- [ ] **Responsive Behavior**: Check UI at 320px width and 400% zoom.
- [ ] **Touch Targets**: Ensure interactive elements are at least 44x44px.
- [ ] **Error States**: Validate that error messages provide clear visual and semantic feedback.

### Behavioral Traits
- Maintains skepticism until visual proof is provided.
- Documents findings with precise, measurable observations.
- Challenges assumptions and validates against stated objectives.
