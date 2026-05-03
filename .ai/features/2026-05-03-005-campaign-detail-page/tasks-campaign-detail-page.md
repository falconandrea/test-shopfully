# Tasks: Campaign Detail Page

## Phase 1: API & Data Layer
- [ ] Implement `getCampaign`, `updateCampaign`, `getCreatives`, `uploadCreative` functions in `src/services/api.ts`.
- [ ] Create `useCampaignDetail` hook to fetch a campaign and handle the update mutation.
- [ ] Create `useCreatives` hook to fetch creatives and handle the upload mutation.

## Phase 2: Campaign Detail Component
- [ ] Create `CampaignDetailPage.tsx` and configure the `/campaigns/:id` route in `App.tsx`.
- [ ] Implement `CampaignInfoCard.tsx` component to display campaign properties in read mode.
- [ ] Add "Edit" toggle to `CampaignInfoCard.tsx`.
- [ ] Implement edit mode with input fields for properties (`name`, `status`, `landingUrl`, `coverImageUrl`).
- [ ] Wire up `updateCampaign` mutation and display inline validation errors (422) below fields.
- [ ] Implement loading and error states (including 404 handling).

## Phase 3: Creatives List & Upload
- [ ] Create `CreativesList.tsx` component to display associated creatives in a grid.
- [ ] Create `CreativeUpload.tsx` form/button component.
- [ ] Implement client-side JavaScript validation in `CreativeUpload.tsx` to enforce exactly 320x480px dimensions before upload.
- [ ] Wire up `uploadCreative` mutation and display 422 errors (e.g. max creatives reached, campaign paused).
- [ ] Ensure the creatives list refreshes automatically upon a successful upload (201).

## Phase 4: Integration & Testing
- [ ] Integrate `CampaignInfoCard` and `CreativesList`/`CreativeUpload` into `CampaignDetailPage` using a responsive layout.
- [ ] Write Vitest unit tests for the client-side image dimension validation utility.
- [ ] Verify error states and edge cases in the UI (e.g., uploading to a paused campaign).
