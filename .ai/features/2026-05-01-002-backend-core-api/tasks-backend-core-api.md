# Tasks: Backend Core API

**Branch:** `feature/backend-core-api`
**PRD:** `prd-backend-core-api.md`

---

## Task List

### T1 — Project Setup
- [x] Create branch `feature/backend-core-api` from `develop`
- [x] Run `sail artisan storage:link`
- **Done when:** Symlink exists, branch is active

### T2 — Data Layer (CampaignService)
- [x] Create `app/Services/CampaignService.php`
- [x] Implement `__construct` to load JSON data
- [x] Implement read/write methods for campaigns and creatives
- [x] Register `CampaignService` as singleton in `AppServiceProvider`
- **Done when:** Service class is complete and successfully registered in container

### T3 — API Resources
- [x] Create `CampaignResource` and `CreativeResource`
- **Done when:** Resources properly format output data

### T4 — GET Endpoints (Campaigns)
- [x] Create `CampaignController`
- [x] Implement `index()` with pagination and filtering (`status`, `q`)
- [x] Implement `show()` for a single campaign (404 if missing)
- **Done when:** GET endpoints return correct data via Postman/browser

### T5 — PUT Endpoint (Update Campaign)
- [x] Create `UpdateCampaignRequest` for validation
- [x] Implement `update()` in `CampaignController`
- **Done when:** Valid payloads update JSON data; invalid ones return 422

### T6 — Creative Endpoints
- [x] Create `CreativeController`
- [x] Implement `index()` to list creatives for a campaign
- [x] Create `StoreCreativeRequest` with business rules validation (max 3 creatives, campaign not paused, exact image size)
- [x] Implement `store()` to save uploaded image and update JSON data
- **Done when:** Valid images are stored in `storage/app/public/creatives` and invalid payloads return 422

### T7 — Code Formatting
- [x] Run Laravel Pint `vendor/bin/sail bin pint --dirty`
- **Done when:** Code complies with style rules
