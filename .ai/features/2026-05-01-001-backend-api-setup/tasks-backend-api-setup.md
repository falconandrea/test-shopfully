# Tasks: Backend API Setup (Laravel Cleanup)

**Branch:** `chore/backend-api-setup`
**PRD:** `prd-backend-api-setup.md`

---

## Task List

### T1 — Create branch
- Create `develop` branch from `main` if it doesn't exist
- Create `chore/backend-api-setup` from `develop`
- **Done when:** `git branch` shows `chore/backend-api-setup` as current

### T2 — Remove unused files
- Delete `app/Models/User.php`
- Delete `database/factories/UserFactory.php`
- Delete `database/migrations/` (all 3 files)
- Delete `database/database.sqlite`
- Delete `database/seeders/DatabaseSeeder.php`
- Delete `resources/css/app.css`
- Delete `resources/js/app.js`
- Delete `resources/views/welcome.blade.php`
- Delete `routes/web.php`
- **Done when:** none of the above paths exist

### T3 — Update `bootstrap/app.php`
- Remove web routes reference
- Ensure `api.php` is registered as the API route file
- **Done when:** `php artisan route:list` does not throw errors about missing files

### T4 — Create `routes/api.php`
- Define all 5 route stubs:
  - `GET /api/campaigns`
  - `GET /api/campaigns/{id}`
  - `PUT /api/campaigns/{id}`
  - `GET /api/campaigns/{id}/creatives`
  - `POST /api/campaigns/{id}/creatives`
- Return placeholder `response()->json([])` for now
- **Done when:** `php artisan route:list` shows exactly the 5 routes

### T5 — Create `data/campaigns.json`
- Minimum 5 campaigns with mixed statuses (Active/Paused)
- All fields present: `id`, `name`, `status`, `landingUrl`, `coverImageUrl`, `createdAt`
- **Done when:** file is valid JSON and parseable

### T6 — Configure CORS
- Set `allowed_origins` to `['http://localhost:5173']` in `config/cors.php`
- **Done when:** CORS config reflects frontend origin

### T7 — Update `AppServiceProvider`
- Add placeholder comment for `CampaignService` singleton registration
- **Done when:** file is updated and no errors on boot

### T8 — Run Pint & verify
- Run `vendor/bin/sail bin pint --dirty` on all modified PHP files
- Verify `php artisan route:list` shows only 5 API routes
- Verify no PHP errors on boot
- **Done when:** all acceptance criteria from PRD are met
