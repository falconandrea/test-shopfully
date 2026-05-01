# Campaign Manager — Progress

## Status: 🚧 In Progress

Last updated: 2026-04-30

---

## Backend (Laravel 13)

### Setup
- [ ] Laravel 13 installed, API-only configured
- [ ] Docker / Sail configured (port 8000)
- [ ] `intervention/image` installed
- [ ] CORS configured for `http://localhost:5173`

### Data Layer
- [ ] `backend/data/campaigns.json` fixture created
- [ ] `CampaignService` singleton implemented (RD1, RD2, RD10)
- [ ] Registered in `AppServiceProvider` (RA10)
- [ ] Storage symlink configured, UUID-based naming (RD3, RD4)

### API Endpoints
- [ ] `GET /api/campaigns` — list + pagination + filters (RA1, RA2)
- [ ] `GET /api/campaigns/:id` — single campaign (RA3)
- [ ] `PUT /api/campaigns/:id` — update campaign (RA4)
- [ ] `GET /api/campaigns/:id/creatives` — list creatives (RA5)
- [ ] `POST /api/campaigns/:id/creatives` — upload creative (RA6)

### Validation & Resources
- [ ] Form Requests for campaign update (RB4, RB5, RB6)
- [ ] Form Request for creative upload (RB1, RB2, RB3)
- [ ] API Resources for Campaign and Creative (RA7, RA9)

### Tests (Pest)
- [ ] RB1 — paused campaign rejects new creatives
- [ ] RB2 — max 3 creatives per campaign
- [ ] RB3 — image dimensions 320×480 enforced
- [ ] RB5 — status must be 0 or 1

---

## Frontend (React 19 + Vite + TypeScript + MUI)

### Setup
- [ ] Vite + React 19 + TypeScript scaffolded
- [ ] Material UI installed and configured
- [ ] React Router configured
- [ ] Axios instance at `src/services/api.ts` (RF9)
- [ ] Docker configured (port 5173)

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

- [ ] Root `docker-compose.yml` starts both services (RO4)
- [ ] `.env.example` for backend and frontend (RO5)
- [ ] GitHub Actions workflow on push to `main` (RO2)
- [ ] Live at `https://test-shopfully.andreafalcon.dev` (RO3)
- [ ] Branch strategy in place: `feature/*` → `develop` → `main` (RO1)
