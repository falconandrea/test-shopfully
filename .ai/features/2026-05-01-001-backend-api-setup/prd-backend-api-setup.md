# Feature: Backend API Setup (Laravel Cleanup)

## Overview

Configure the Laravel 13 installation as a clean API-only backend by removing all scaffolding that is irrelevant to this project (Blade views, frontend assets, User model, DB migrations) and establishing the minimal structure needed to build the Campaign Manager API.

## Scope

This is a technical chore, not a product feature. It prepares the Laravel installation for subsequent feature development.

## Out of Scope

- Implementing any API endpoint logic
- Setting up `CampaignService` or data layer
- Frontend setup

---

## What Gets Removed

| Path | Reason |
|------|--------|
| `app/Models/User.php` | No auth, no database |
| `database/factories/UserFactory.php` | Tied to User model |
| `database/migrations/` (all 3 files) | No database |
| `database/database.sqlite` | No database |
| `database/seeders/DatabaseSeeder.php` | No database |
| `resources/css/app.css` | No frontend in backend |
| `resources/js/app.js` | No frontend in backend |
| `resources/views/welcome.blade.php` | No Blade views |
| `routes/web.php` | API-only — not needed |

## What Gets Created

| Path | Content |
|------|---------|
| `routes/api.php` | All 5 route stubs (no logic, just route definitions pointing to placeholder controllers) |
| `data/campaigns.json` | Static fixture with sample campaign data (≥ 5 campaigns, mixed statuses) |

## What Gets Updated

| Path | Change |
|------|--------|
| `bootstrap/app.php` | Remove web routes reference; ensure `api.php` is loaded |
| `config/cors.php` | Set allowed origins to `http://localhost:5173` |
| `app/Providers/AppServiceProvider.php` | Add placeholder comment for `CampaignService` singleton (registered in next feature) |

## Acceptance Criteria

- [ ] `vendor/bin/sail artisan route:list` shows only the 5 API routes
- [ ] No Blade, no web middleware, no database references in the codebase
- [ ] `GET http://localhost:8000/api/campaigns` returns a valid JSON response (even if empty/placeholder)
- [ ] No PHP errors or warnings on boot
- [ ] Pint passes on all modified files
