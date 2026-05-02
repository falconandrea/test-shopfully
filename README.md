# Campaign Manager

Full-stack monorepo to manage advertising campaigns and their associated creatives.

## Stack
- **Backend:** Laravel 13, PHP 8.5 (API-only)
- **Frontend:** React 19, Vite, TypeScript, Material UI

## Setup & Run

### Docker Compose (recommended)

```bash
# Start both backend and frontend from the project root
docker-compose up --build
```

- Backend API: `http://localhost:8000`
- Frontend SPA: `http://localhost:5173`

> **Note:** No database or external services are required. All data is stored in JSON files.

### Laravel Sail (backend only)

```bash
cd backend
./vendor/bin/sail up
```

Sail is available for local backend development but is independent from the root `docker-compose.yml`.

### Production (future)

```bash
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

Will add Traefik reverse proxy with subdomain routing to `https://test-shopfully.andreafalcon.dev`.

## Testing

```bash
# Run the backend test suite
cd backend && php artisan test

# Run with coverage report
cd backend && php artisan test --coverage
```

| Method | Endpoint | Description |
|--------|----------------------------------------------|----------------------------------------------|
| GET | `/api/campaigns` | List campaigns (paginated, filterable) |
| GET | `/api/campaigns/:id` | Single campaign |
| PUT | `/api/campaigns/:id` | Update campaign fields |
| GET | `/api/campaigns/:id/creatives` | List creatives for a campaign |
| POST | `/api/campaigns/:id/creatives` | Upload a creative (file or base64) |

### Query Parameters for `GET /api/campaigns`

| Param | Type | Default | Description |
|--------|--------|---------|--------------------------------------|
| status | int | — | Filter by status (0 = Paused, 1 = Active) |
| q | string | — | Search by id or name (case-insensitive) |
| page | int | 1 | Page number |
| limit | int | 10 | Items per page |

### Creative Upload

The `POST /api/campaigns/:id/creatives` endpoint accepts two formats:

**File upload** (multipart/form-data):
```bash
curl -X POST -F "image=@creative.png" http://localhost/api/campaigns/1/creatives
```

**Base64** (application/json):
```bash
curl -X POST -H "Content-Type: application/json" \
  -d '{"image": "data:image/png;base64,..."}' \
  http://localhost/api/campaigns/1/creatives
```

Image must be exactly **320×480 pixels**, in JPEG or PNG format.

## Business Rules

- A **paused** campaign (`status = 0`) cannot accept new creatives.
- A campaign can have at most **3 creatives**.
- Uploaded images must be exactly **320×480 px**.
- Campaign `status` must be `0` or `1`.
- The `id` in the PUT body must match the URL parameter.


## Custom Commands

### Import Campaigns
To populate the JSON data fixture from the original CSV file, you can run the following custom Artisan command:

```bash
# From the backend/ folder
php artisan app:import-campaigns
```
*(By default, this looks for `campaigns_data_2026.csv` in the project root and generates `backend/data/campaigns.json`)*

## Known Limitations & Future Enhancements
- **Delete Creative API:** Currently, the system supports uploading up to 3 creatives per campaign. However, there is no API endpoint to delete an existing creative. In a future iteration, a `DELETE /api/creatives/{id}` endpoint should be implemented to prevent campaigns from becoming permanently locked once the limit is reached.
