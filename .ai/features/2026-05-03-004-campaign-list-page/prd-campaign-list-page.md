# Feature: Campaign List Page

## Overview

Implement the fully functional campaign list page at `/` — the main landing screen of the application. This replaces the current placeholder with a paginated, filterable grid of campaign cards with favourite toggle support.

This feature covers requirements **RF1, RF2, RF3, RF4, RF9, RF10** and **RT2**.

---

## User Stories

- As a **marketing manager**, I want to see all campaigns in a paginated list so I can quickly browse through them.
- As a **marketing manager**, I want to filter campaigns by name, ID, or status so I can find the one I need faster.
- As a **marketing manager**, I want to mark campaigns as favourites so I can identify my most-used campaigns at a glance.
- As a **user on a restricted browser**, I want my favourites to persist even if `localStorage` is unavailable (cookie fallback).

---

## Acceptance Criteria

### Campaign List (RF1)
- [ ] `GET /api/campaigns` is called on page load via the centralised Axios instance (RF9)
- [ ] Campaigns are displayed as cards in a responsive grid (1 col mobile, 2 cols tablet, 3 cols desktop)
- [ ] Each card shows: cover image, name, status chip (Active=green / Paused=amber), created date, and a favourite toggle icon
- [ ] Clicking a card navigates to `/campaigns/:id`
- [ ] Pagination controls (Previous / Next + page indicator) appear below the grid
- [ ] Page, limit query params are sent to the API; default `limit=12`

### Filters (RF2)
- [ ] A filter bar above the grid with: a search text field (`q` param, searches by id/name), a status dropdown (All / Active / Paused)
- [ ] Filters trigger API calls with the appropriate query params
- [ ] Search input is debounced (300ms)
- [ ] Changing any filter resets pagination to page 1

### UI States (RF3)
- [ ] **Loading**: skeleton cards shown while fetching
- [ ] **Empty**: illustrated empty state with message "No campaigns found"
- [ ] **Error**: error alert with retry button

### Favourite Toggle (RF4)
- [ ] Heart icon on each card toggles favourite on/off
- [ ] Favourite IDs persisted in `localStorage` under key `campaign_favourites`
- [ ] If `localStorage` is unavailable, falls back to a cookie (`campaign_favourites`, JSON-encoded, 365-day expiry)
- [ ] Favourite state reflects immediately on toggle (optimistic UI)

### Custom Hooks (RF10)
- [ ] `useCampaigns(filters)` — manages API call, loading, error, data, pagination state
- [ ] `useFavourites()` — manages read/write of favourite IDs with localStorage + cookie fallback

### Tests (RT2)
- [ ] `useFavourites` unit test: add, remove, toggle, list with localStorage
- [ ] `useFavourites` unit test: fallback to cookie when localStorage throws

---

## Out of Scope

- Campaign detail page (separate feature)
- Campaign editing (separate feature)
- Creative management (separate feature)
- Server-side favourite persistence (not in requirements)
- Sorting options (not in requirements)

---

## Technical Notes

- **API integration**: all calls through `src/services/api.ts` Axios instance (RF9)
- **Types**: reuse existing `Campaign`, `PaginatedResponse`, `CampaignFilters` from `src/types/index.ts`
- **Theme**: leverage existing dark MUI theme (glassmorphic cards, gradient accents, electric indigo palette)
- **Debounce**: use a small utility or `setTimeout`-based approach — no need for lodash
- **Cookie helper**: simple `document.cookie` read/write utility for the fallback path
- **Testing**: Vitest + React Testing Library + `@testing-library/react-hooks` for hook tests

### File structure (new/modified files)

```
frontend/src/
├── hooks/
│   ├── useCampaigns.ts          # NEW — data fetching hook
│   └── useFavourites.ts         # NEW — localStorage + cookie hook
├── components/
│   ├── CampaignCard.tsx         # NEW — individual campaign card
│   ├── CampaignFilters.tsx      # NEW — filter bar
│   ├── CampaignGrid.tsx         # NEW — grid + pagination
│   └── EmptyState.tsx           # NEW — reusable empty state
├── utils/
│   ├── cookies.ts               # NEW — cookie read/write helpers
│   └── debounce.ts              # NEW — debounce utility
├── pages/
│   └── CampaignListPage.tsx     # MODIFIED — replace placeholder
└── __tests__/
    └── useFavourites.test.ts    # NEW — hook unit tests
```

---

## UI/UX Notes

- **Card design**: dark glassmorphic card (matches existing `MuiCard` theme overrides) with cover image at top, content below. Subtle hover glow effect already in theme.
- **Status chip**: `Active` → green filled chip, `Paused` → amber filled chip
- **Favourite icon**: outlined heart by default, filled red heart when favourited, with a subtle scale animation on toggle
- **Pagination**: minimal Previous/Next buttons with "Page X of Y" text, using MUI `Pagination` or custom buttons
- **Filter bar**: compact horizontal bar with search `TextField` and `Select` dropdown, consistent with theme
- **Skeleton loading**: 6–12 skeleton cards matching card dimensions for a polished loading experience
- **Empty state**: centred layout with a muted icon and descriptive text
- **Error state**: MUI `Alert` with error severity and a "Retry" button
