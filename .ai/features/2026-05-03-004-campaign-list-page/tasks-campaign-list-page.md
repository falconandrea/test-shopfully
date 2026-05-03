# Tasks: Campaign List Page

Feature: `2026-05-03-004-campaign-list-page`
PRD: `prd-campaign-list-page.md`

---

## Task 1 — Utility layer (cookies + debounce)

**Files:** `src/utils/cookies.ts`, `src/utils/debounce.ts`

- [x] Create `getCookie(name): string | null` and `setCookie(name, value, days)` helpers
- [x] Create `debounce<T>(fn, ms): (...args) => void` utility
- [x] Both pure functions, no React dependency

**Depends on:** nothing

---

## Task 2 — `useFavourites` hook

**Files:** `src/hooks/useFavourites.ts`

- [x] Read/write favourite campaign IDs from `localStorage` (key: `campaign_favourites`)
- [x] Detect `localStorage` unavailability (try/catch) → fallback to cookie helpers
- [x] Expose: `favourites: string[]`, `isFavourite(id): boolean`, `toggleFavourite(id): void`
- [x] Use `useState` + sync to storage on every toggle

**Depends on:** Task 1

---

## Task 3 — `useFavourites` tests

**Files:** `src/__tests__/useFavourites.test.ts`

- [x] Setup Vitest + `@testing-library/react` (if not already installed)
- [x] Test: add favourite → appears in list
- [x] Test: remove favourite → disappears from list
- [x] Test: toggle → switches state
- [x] Test: persists to localStorage
- [x] Test: when localStorage throws → falls back to cookie
- [x] Test: reads initial state from storage on mount

**Depends on:** Task 2

---

## Task 4 — `useCampaigns` hook

**Files:** `src/hooks/useCampaigns.ts`

- [x] Accept `CampaignFilters` as parameter
- [x] Call `GET /api/campaigns` via Axios instance with query params
- [x] Manage state: `data: Campaign[]`, `meta: PaginationMeta | null`, `loading: boolean`, `error: string | null`
- [x] Re-fetch when filters change (use `useEffect` with filter deps)
- [x] Expose `refetch()` for retry on error

**Depends on:** nothing (uses existing `api.ts` and types)

---

## Task 5 — `EmptyState` component

**Files:** `src/components/EmptyState.tsx`

- [x] Reusable component: accepts `title`, `description`, optional `icon`
- [x] Centred layout with muted colours, consistent with dark theme

**Depends on:** nothing

---

## Task 6 — `CampaignCard` component

**Files:** `src/components/CampaignCard.tsx`

- [x] Props: `campaign: Campaign`, `isFavourite: boolean`, `onToggleFavourite: (id) => void`
- [x] Cover image at top (fallback if URL broken), truncated name, status chip, date
- [x] Favourite heart icon (outlined/filled) with scale animation
- [x] Click card → navigate to `/campaigns/:id`
- [x] Use theme's card styling (glassmorphic, hover glow)

**Depends on:** nothing

---

## Task 7 — `CampaignFilters` component

**Files:** `src/components/CampaignFilters.tsx`

- [x] Search `TextField` bound to `q` filter (debounced 300ms)
- [x] Status `Select` (All / Active / Paused)
- [x] Calls `onFilterChange(filters)` callback on change
- [x] Resets page to 1 on any filter change

**Depends on:** Task 1 (debounce)

---

## Task 8 — `CampaignGrid` component

**Files:** `src/components/CampaignGrid.tsx`

- [x] Responsive MUI `Grid` layout: xs=12, sm=6, md=4
- [x] Renders `CampaignCard` for each campaign
- [x] Pagination controls below: Previous / Next buttons + "Page X of Y"
- [x] Skeleton loading state (6–12 skeleton cards)

**Depends on:** Task 6

---

## Task 9 — Assemble `CampaignListPage`

**Files:** `src/pages/CampaignListPage.tsx` (MODIFY — replace placeholder)

- [x] Wire `useCampaigns` + `useFavourites` hooks
- [x] Render `CampaignFilters` at top
- [x] Render `CampaignGrid` with data, or `EmptyState` when no results
- [x] Render error `Alert` with retry button on error
- [x] Page title "Campaigns" with subtitle

**Depends on:** Tasks 2, 4, 5, 7, 8

---

## Task 10 — Visual QA & polish

- [x] Start dev server, verify full flow against backend
- [x] Check responsive breakpoints (mobile, tablet, desktop)
- [x] Verify skeleton loading appears during fetch
- [x] Verify empty state when filters match nothing
- [x] Verify error state when backend is down
- [x] Verify favourite toggle persists across page reload
- [x] Check hover animations, transitions, theme consistency

**Depends on:** Task 9

---

## Execution Order

```
Task 1 (utils) → Task 2 (useFavourites) → Task 3 (tests)
Task 1 (utils) → Task 7 (CampaignFilters)
Task 4 (useCampaigns) — parallel
Task 5 (EmptyState) — parallel
Task 6 (CampaignCard) → Task 8 (CampaignGrid)
All above → Task 9 (CampaignListPage) → Task 10 (QA)
```
