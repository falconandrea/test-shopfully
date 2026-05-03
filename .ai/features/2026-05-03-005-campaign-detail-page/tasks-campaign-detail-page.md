# Tasks: Campaign Detail Page

## Phase 1: API & Data Layer
- [x] Implement `getCampaign`, `updateCampaign`, `getCreatives`, `uploadCreative` functions in `src/services/api.ts`.
- [x] Create `useCampaignDetail` hook to fetch a campaign and handle the update mutation.
- [x] Create `useCreatives` hook to fetch creatives and handle the upload mutation.

## Phase 2: Campaign Detail Component
- [x] Create `CampaignDetailPage.tsx` and configure the `/campaigns/:id` route in `App.tsx`.
- [x] Implement `CampaignInfoCard.tsx` component to display campaign properties in read mode.
- [x] Add "Edit" toggle to `CampaignInfoCard.tsx`.
- [x] Implement edit mode with input fields for properties (`name`, `status`, `landingUrl`, `coverImageUrl`).
- [x] Wire up `updateCampaign` mutation and display inline validation errors (422) below fields.
- [x] Implement loading and error states (including 404 handling).

## Phase 3: Creatives List & Upload
- [x] Create `CreativesList.tsx` component to display associated creatives in a grid.
- [x] Create `CreativeUpload.tsx` form/button component.
- [x] Implement client-side JavaScript validation in `CreativeUpload.tsx` to enforce exactly 320x480px dimensions before upload.
- [x] Wire up `uploadCreative` mutation and display 422 errors (e.g. max creatives reached, campaign paused).
- [x] Ensure the creatives list refreshes automatically upon a successful upload (201).

## Phase 4: Integration & Testing
- [x] Integrate `CampaignInfoCard` and `CreativesList`/`CreativeUpload` into `CampaignDetailPage` using a responsive layout.
- [x] Write Vitest unit tests for the client-side image dimension validation utility.
- [x] Verify error states and edge cases in the UI (e.g., uploading to a paused campaign).

## Phase 5: Storage Refactor (Technical Debt)
- [x] Move campaign data storage to `storage/app/campaigns.json` to prevent repository pollution.
- [x] Update `ImportCampaignsCommand` to write to the new storage location.
- [x] Add migration logic to `CampaignService` for seamless transition.
- [x] Update `.gitignore` to exclude `data/campaigns.json`.
