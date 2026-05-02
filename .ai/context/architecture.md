# Campaign Manager — Architecture Decisions

## Stack

| Layer     | Technology                              |
|-----------|-----------------------------------------|
| Backend   | Laravel 13, PHP 8.5, API-only           |
| Frontend  | React 19, Vite, TypeScript, Material UI |
| Container | Docker + Docker Compose                 |
| Testing   | Pest (backend), Vitest (frontend)       |
| CI/CD     | GitHub Actions → VPS                    |

## Key Architectural Decisions

### No Database
Campaigns are loaded from a static JSON file (`backend/data/campaigns.json`) into a singleton `CampaignService` at boot. Creatives are persisted to `storage/app/creatives.json` — read at boot, written on every create operation. Both files are plain JSON; no ORM or database engine is involved. The Docker volume ensures both image files and `creatives.json` survive container restarts.

### CampaignService as Singleton
Registered in `AppServiceProvider`. Holds all in-memory state (campaigns + creatives). All controllers depend on it via dependency injection.

### API-Only Backend
No Blade, no session, no Sanctum. Pure JSON API. All responses use Laravel API Resources. All validation uses Form Requests.

### No Eloquent
No ORM, no migrations, no models in the Eloquent sense. Data is plain PHP arrays/objects hydrated from JSON.

### Frontend as Separate SPA
React app runs independently (port 5173). Communicates with the backend via a centralised Axios instance (`src/services/api.ts`). React Router handles client-side routing.

## Port Mapping

| Service  | Port |
|----------|------|
| Backend  | 8000 |
| Frontend | 5173 |

## CORS
Backend allows `http://localhost:5173` in development. Locked to known origins in production.

## File Storage
Creative images stored at `storage/app/public/creatives/` with UUID-based filenames. Served via `/storage/creatives/<filename>` symlink. Docker volume persists files across container restarts.

## Favourite Campaigns (Client-Side)
Stored in `localStorage` with cookie fallback. No backend involvement. Managed via `useFavourites` custom hook.

## Validation Strategy
- **Client-side:** image dimensions checked before upload (RF7), inline error display from 422 responses (RF8)
- **Server-side:** all business rules enforced regardless of client (RS1), using Form Requests + `intervention/image` for pixel validation (RB3)
