# Campaign Manager — Progress

## Status: 🚧 In Progress

Last updated: 2026-05-02

---

## Backend (Laravel 13)

### Setup
- [x] Laravel 13 installed, API-only configured
- [x] Docker / Sail configured (port 8000)
- [x] CORS configured for `http://localhost:5173`

### Data Layer
- [x] `backend/data/campaigns.json` fixture created
- [x] `CampaignService` singleton implemented (RD1, RD2, RD10)
- [x] `CreativeService` singleton implemented (separation of concerns)
- [x] Registered in `AppServiceProvider` (RA10)
- [x] Storage symlink configured, UUID-based naming (RD3, RD4)

### API Endpoints
- [x] `GET /api/campaigns` — list + pagination + filters (RA1, RA2)
- [x] `GET /api/campaigns/:id` — single campaign (RA3)
- [x] `PUT /api/campaigns/:id` — update campaign (RA4)
- [x] `GET /api/campaigns/:id/creatives` — list creatives (RA5)
- [x] `POST /api/campaigns/:id/creatives` — upload creative, file + base64 (RA6)

### Validation & Resources
- [x] Form Requests for campaign update (RB4, RB5, RB6)
- [x] Form Request for creative upload (RB1, RB2, RB3)
- [x] Custom Rule `CreativeImageRule` for file/base64 validation
- [x] API Resources for Campaign and Creative (RA7, RA9)

### Tests (Pest) — 23 tests, 78 assertions ✅
- [x] RB1 — paused campaign rejects new creatives
- [x] RB2 — max 3 creatives per campaign
- [x] RB3 — image dimensions 320×480 enforced (file + base64)
- [x] RB5 — status must be 0 or 1
- [x] RB6 — id mismatch between URL and body
- [x] RA1-RA3 — campaign listing, filtering, single retrieval
- [x] RA5-RA6 — creative listing and upload (file + base64)
- [x] Non-existent campaign returns 404 / 422

---

## Frontend (React 19 + Vite + TypeScript + MUI)

### Setup
- [x] Vite + React 19 + TypeScript scaffolded
- [x] Material UI installed and configured
- [x] React Router configured
- [x] Axios instance at `src/services/api.ts` (RF9)
- [x] Docker configured (port 5173)

### Pages & Components
- [ ] Campaign list page `/` (RF1)
  - [ ] Pagination controls (RF1)
  - [ ] Filters: id, name, status (RF2)
  - [ ] Loading / empty / error states (RF3)
  - [ ] Favourite toggle per campaign (RF4)
- [ ] Campaign detail page `/campaigns/:id` (RF5)
  - [ ] Display full campaign info
  - [ ] Inline editing: name, status, landingUrl, coverImageUrl (RF5)
  - [ ] Creatives list (RF6)
  - [ ] Creative upload form with client-side dimension check (RF7)
  - [ ] Inline 422 error display (RF8)

### Hooks
- [ ] `useCampaigns` (RF10)
- [ ] `useFavourites` — localStorage + cookie fallback (RF4, RF10)

### Tests (Vitest)
- [ ] `useFavourites` — localStorage path (RT2)
- [ ] `useFavourites` — cookie fallback path (RT2)

---

## DevOps

- [x] Root `docker-compose.yml` starts both services (RO4)
- [x] `backend/Dockerfile` — multi-stage (development + production targets)
- [x] `frontend/Dockerfile` — multi-stage (development + production targets)
- [x] `.env.example` for backend (RO5) — DB-free, no MySQL/Redis references
- [x] Sail `compose.yaml` cleaned — removed MySQL, Redis, Meilisearch, Mailpit, Selenium
- [ ] `.env.example` for frontend (RO5)
- [ ] `docker-compose.prod.yml` — production override with Traefik + subdomain routing
- [ ] GitHub Actions workflow on push to `main` (RO2)
- [ ] Live at `https://test-shopfully.andreafalcon.dev` (RO3)
- [ ] Branch strategy in place: `feature/*` → `develop` → `main` (RO1)
