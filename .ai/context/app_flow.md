# Application Flow

## Core User Flows

### 1. Browse Campaigns
**Trigger:** User opens the app at `/`
1. App fetches `GET /api/campaigns` (page=1, limit=10)
2. Shows loading state
3. Renders campaign cards in a paginated list
4. On error → shows error state with retry option
5. On empty → shows empty state message

**Filters available:** status (Active/Paused), id, name (search)

---

### 2. Filter Campaigns
**Trigger:** User types in search or selects status filter
1. Debounced input triggers `GET /api/campaigns?q=...&status=...&page=1`
2. List updates with results
3. Pagination resets to page 1

---

### 3. Toggle Favourite
**Trigger:** User clicks favourite icon on a campaign card
1. `useFavourites` hook reads/writes to `localStorage`
2. If `localStorage` unavailable → cookie fallback
3. No API call — purely client-side
4. Icon reflects current favourite state immediately

---

### 4. View Campaign Detail
**Trigger:** User clicks on a campaign card → navigates to `/campaigns/:id`
1. App fetches `GET /api/campaigns/:id`
2. App fetches `GET /api/campaigns/:id/creatives`
3. Shows full campaign info (read mode by default)
4. Shows list of associated creatives

---

### 5. Edit Campaign
**Trigger:** User clicks "Edit" on campaign detail page
1. Fields become editable: `name`, `status`, `landingUrl`, `coverImageUrl`
2. On save → `PUT /api/campaigns/:id` with updated fields
3. On `422` → inline validation errors per field (RF8)
4. On success → returns to read mode with updated data

---

### 6. Upload Creative
**Trigger:** User selects an image in the upload form on the campaign detail page
1. Client-side check: image must be exactly 320×480px (RF7)
2. If invalid dimensions → show error, do not submit
3. On valid → `POST /api/campaigns/:id/creatives` (multipart/form-data, `asset` field)
4. Backend enforces: campaign active (RB1), max 3 creatives (RB2), dimensions (RB3)
5. On `422` → inline error displayed
6. On `201` → creative list refreshes

---

## Screen Inventory

| Screen | Route | Purpose |
|--------|-------|---------|
| Campaign List | `/` | Browse, filter, paginate campaigns; toggle favourites |
| Campaign Detail | `/campaigns/:id` | View info, edit fields, view/upload creatives |

---

## Navigation Map

```
/  (Campaign List)
└── /campaigns/:id  (Campaign Detail)
```
