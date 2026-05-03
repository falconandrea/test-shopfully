# Campaign Manager — Requirements

## Project Overview

Full-stack application to manage advertising campaigns and their associated creatives.

- **Backend:** Laravel 13, API-only (no Blade, no Eloquent, no frontend scaffolding)
- **Frontend:** React 19 + Vite + TypeScript + Material UI, SPA
- **Data:** No database. Campaigns loaded from a static JSON fixture at boot. Creatives in runtime memory.

---

## Requirement Codes

| Prefix | Category             |
|--------|----------------------|
| RD     | Data & Storage       |
| RB     | Business Rules       |
| RA     | API — Backend        |
| RF     | Frontend             |
| RT     | Testing              |
| RO     | DevOps & Deployment  |
| RS     | Security             |

---

## Data Models

### Campaign (persisted to `backend/storage/app/campaigns.json`)

| Field         | Type   | Notes                  |
|---------------|--------|------------------------|
| id            | number | Provided in fixture    |
| name          | string |                        |
| status        | int    | 1 = Active, 0 = Paused |
| landingUrl    | string | Valid URL              |
| coverImageUrl | string | Valid URL              |
| createdAt     | string | ISO 8601               |

### Creative (generated server-side)

| Field      | Type   | Notes                           |
|------------|--------|---------------------------------|
| id         | string | UUID generated server-side      |
| campaignId | number | Reference to parent campaign    |
| assetUrl   | string | Public URL to uploaded image    |
| createdAt  | string | ISO 8601, generated server-side |

---

## RD — Data & Storage

**RD1** — Campaigns are persisted to `backend/storage/app/campaigns.json`. On the first run, the system can migrate data from a `backend/data/campaigns.json` fixture (if present) or be populated via the `app:import-campaigns` command. The runtime file is ignored by Git to prevent repository pollution.

**RD2** — Creatives are persisted to `storage/app/creatives.json`. The file is read at boot and written on every create operation. This avoids the need for a database while keeping data consistent across server restarts. The Docker volume (RD4) covers both image files and this JSON file.

**RD3** — Uploaded creative image files are stored in `storage/app/public/creatives/` and served at `/storage/creatives/<filename>`. The original filename is never used — files are stored with a UUID-based name.

**RD4** — Docker volume `./backend/storage:/var/www/storage` must be configured to persist uploaded images across container restarts.

---

## RB — Business Rules (enforced at backend level)

**RB1** — A campaign with `status = 0` (Paused) cannot accept new creatives. Returns `422 Unprocessable Entity`.

**RB2** — A campaign can have at most 3 creatives. Attempting to add a 4th returns `422 Unprocessable Entity`.

**RB3** — Uploaded creative image must be exactly 320×480 pixels. Validation must check actual pixel dimensions (e.g. using native Laravel `dimensions` rule). Returns `422 Unprocessable Entity` if dimensions do not match.

**RB4** — `landingUrl` must be a valid URL when provided on campaign update.

**RB5** — `status` on campaign update must be `0` or `1`. Any other value returns `422`.

**RB6** — `id` is required in the PUT body and must match the URL parameter.

---

## RA — API Backend

**RA1** — `GET /api/campaigns` returns a paginated list of campaigns with support for query parameters: `status` (0 or 1), `q` (search by id or name, case-insensitive), `page` (default 1), `limit` (default 10), and `ids` (array of campaign IDs to filter by).

**RA2** — `GET /api/campaigns` response includes a `meta` object: `{ total, current_page, per_page, last_page }`.

**RA3** — `GET /api/campaigns/:id` returns a single campaign. Returns `404` if not found.

**RA4** — `PUT /api/campaigns/:id` updates a campaign's `name`, `status`, `landingUrl`, `coverImageUrl`. All fields optional except `id`. Returns `404` if not found, `422` on validation failure.

**RA5** — `GET /api/campaigns/:id/creatives` returns all creatives for the given campaign. Returns `404` if campaign not found.

**RA6** — `POST /api/campaigns/:id/creatives` uploads a new creative. Accepts either `multipart/form-data` (file upload) or a `base64` encoded string in the `image` field. Enforces RB1, RB2, RB3. Returns `201 Created` on success.

**RA7** — All API responses use a consistent JSON structure. Errors follow the format: `{ "message": "...", "errors": { "field": ["..."] } }`.

**RA8** — CORS must be configured to allow requests from the frontend origin (`http://localhost:5173` in development).

**RA9** — Input validation uses Laravel Form Requests. Response transformation uses Laravel API Resources.

**RA10** — `CampaignService` is registered as a singleton in the Service Container via `AppServiceProvider`.

---

## RF — Frontend

**RF1** — Campaign list page (`/`) displays all campaigns with pagination controls.

**RF2** — Campaign list supports filters: by `id`, `name`, and `status` (Active / Paused). Filters trigger API calls with the appropriate query parameters.

**RF3** — Campaign list handles three UI states: loading, empty, error.

**RF4** — Each campaign in the list has a favourite toggle. Favourite campaign IDs are persisted in `localStorage`. If `localStorage` is not available, fall back to cookies.

**RF5** — Campaign detail page (`/campaigns/:id`) displays full campaign info and allows inline editing of: `name`, `status`, `landingUrl`, `coverImageUrl`.

**RF6** — Campaign detail page lists all associated creatives.

**RF7** — Campaign detail page includes an upload form for new creatives. Client-side validation must check that the selected image is exactly 320×480 before submitting to the backend.

**RF8** — Backend validation errors from `422` responses are displayed inline on the relevant form fields.

**RF9** — All API calls are made through a centralised Axios instance in `src/services/api.ts`.

**RF10** — Reusable logic is extracted into custom hooks in `src/hooks/` (e.g. `useCampaigns`, `useFavourites`).

---

## RT — Testing

**RT1** — Backend business rules are covered by Pest feature tests: RB1, RB2, RB3, RB5 (at minimum).

**RT2** — Frontend `useFavourites` hook is unit tested (localStorage + cookie fallback logic).

---

## RO — DevOps & Deployment

**RO1** — Branch strategy: `feature/*` → PR to `develop` → merge to `main`.

**RO2** — GitHub Actions workflow deploys to VPS on push to `main`.

**RO3** — Application is live and accessible at `https://test-shopfully.andreafalcon.dev`.

**RO4** — `docker-compose up` from the root starts both backend (port 8000) and frontend (port 5173) with no additional setup steps.

**RO5** — `.env` is never committed. `.env.example` is provided for both backend and frontend.

---

## RS — Security

**RS1** — All input is validated server-side regardless of frontend validation.

**RS2** — CORS is locked to known origins only.

**RS3** — No sensitive data is exposed in API responses.

**RS4** — Uploaded files are stored with UUID-based names (see RD3). MIME type and pixel dimensions are both validated (see RB3).
