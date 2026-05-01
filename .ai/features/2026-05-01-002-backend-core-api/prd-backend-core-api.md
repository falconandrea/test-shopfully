# Feature: Backend Core API

## Overview
Implementation of the core data layer and the RESTful API endpoints for the Campaign Manager application. This includes building a memory-resident singleton `CampaignService` to serve static JSON data, and setting up all necessary Controllers, Form Requests, and API Resources to handle the campaign and creative workflows without relying on a traditional database.

## User Stories
- As a frontend application, I want to retrieve a paginated, filterable list of campaigns to display to the user.
- As a frontend application, I want to retrieve a single campaign's details.
- As a user, I want to update campaign details (name, status, landing URL, etc.) so that they reflect the latest marketing strategy.
- As a user, I want to upload new creatives for an active campaign (up to a limit of 3) so that I can provide assets for my ad campaigns.
- As an admin, I want the system to prevent adding creatives to paused campaigns, to ensure no assets are mistakenly uploaded for inactive campaigns.
- As a user, I want the system to reject creative images that don't match exactly 320x480 pixels to ensure ad compliance.

## Acceptance Criteria
- [ ] `CampaignService` correctly reads `data/campaigns.json` and `storage/app/creatives.json` and serves as a singleton injected into Controllers.
- [ ] `GET /api/campaigns` returns paginated campaigns, filtering by `status` and `q` (search by id/name).
- [ ] `PUT /api/campaigns/{id}` successfully validates input and updates campaign data.
- [ ] `GET /api/campaigns/{id}/creatives` returns creatives for a specific campaign.
- [ ] `POST /api/campaigns/{id}/creatives` validates image dimensions (exactly 320x480) using Laravel's native `dimensions` rule.
- [ ] Business logic enforces that paused campaigns or campaigns with 3 creatives reject new uploads (Returns 422).
- [ ] Storage symlink is active, and creative files are stored securely with UUID-based names.
- [ ] API responses are standardized with Laravel Resources.

## Out of Scope
- Tests (Pest tests will be handled in a subsequent feature branch per the workflow or if explicitly asked).
- Frontend UI integration.

## Technical Notes
- Data mutations (PUT/POST) will modify data managed by the singleton. Since we don't have a DB, updates will be written back to the JSON files to persist across the Docker container lifecycle, avoiding data loss between requests.
- The native Laravel `dimensions` rule will be used to validate image dimensions before saving, keeping the project dependency-free.
- UUIDs for creatives will be generated via Laravel's `Str::uuid()`.

## UI/UX Notes
- N/A (Backend feature only).

## Future Enhancements (Backlog)
- **Delete Creative API:** Currently, there is no way to remove a creative once uploaded. With the hard limit of 3 creatives per campaign (RB2), a campaign could become permanently "locked" with its existing creatives. A `DELETE /api/creatives/{id}` endpoint should be planned for future iterations.
