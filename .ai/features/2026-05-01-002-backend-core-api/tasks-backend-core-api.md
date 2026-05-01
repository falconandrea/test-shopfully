# Tasks: Backend Core API

**Branch:** `feature/backend-core-api`
**PRD:** `prd-backend-core-api.md`

---

## Task List

### T1 — Project Setup
- [ ] Create branch `feature/backend-core-api` from `develop`
- [ ] Run `sail artisan storage:link`
- **Done when:** Symlink exists, branch is active

### T2 — Data Layer (CampaignService)
- [ ] Create `app/Services/CampaignService.php`
- [ ] Implement `__construct` to load JSON data
- [ ] Implement read/write methods for campaigns and creatives
- [ ] Register `CampaignService` as singleton in `AppServiceProvider`
- **Done when:** Service class is complete and successfully registered in container

### T3 — API Resources
- [ ] Create `CampaignResource` and `CreativeResource`
- **Done when:** Resources properly format output data

### T4 — GET Endpoints (Campaigns)
- [ ] Create `CampaignController`
- [ ] Implement `index()` with pagination and filtering (`status`, `q`)
- [ ] Implement `show()` for a single campaign (404 if missing)
- **Done when:** GET endpoints return correct data via Postman/browser

### T5 — PUT Endpoint (Update Campaign)
- [ ] Create `UpdateCampaignRequest` for validation
- [ ] Implement `update()` in `CampaignController`
- **Done when:** Valid payloads update JSON data; invalid ones return 422

### T6 — Creative Endpoints
- [ ] Create `CreativeController`
- [ ] Implement `index()` to list creatives for a campaign
- [ ] Create `StoreCreativeRequest` with business rules validation (max 3 creatives, campaign not paused, exact image size)
- [ ] Implement `store()` to save uploaded image and update JSON data
- **Done when:** Valid images are stored in `storage/app/public/creatives` and invalid payloads return 422

### T7 — Code Formatting
- [ ] Run Laravel Pint `vendor/bin/sail bin pint --dirty`
- **Done when:** Code complies with style rules
