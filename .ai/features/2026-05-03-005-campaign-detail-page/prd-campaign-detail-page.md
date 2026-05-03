# Feature: Campaign Detail Page

## Overview
A page to view detailed information about a specific campaign, inline edit its properties, view associated creatives, and upload new creatives with strict client and server-side validation.

## User Stories
- As a user, I want to view the details of a specific campaign so that I can see its current status, landing URL, and cover image.
- As a user, I want to edit the campaign details inline so that I can easily update its properties without leaving the page.
- As a user, I want to see a list of creatives associated with the campaign so that I know what assets are currently active.
- As a user, I want to upload a new creative image for the campaign so that I can add new promotional assets.

## Acceptance Criteria
- [ ] **View Campaign Details**: Fetches `GET /api/campaigns/:id` and displays `name`, `status`, `landingUrl`, and `coverImageUrl`.
- [ ] **View Creatives**: Fetches `GET /api/campaigns/:id/creatives` and lists all creatives for the campaign.
- [ ] **Inline Editing**: User can toggle an "Edit" mode. Input fields are provided for `name`, `status` (Active/Paused), `landingUrl`, and `coverImageUrl`.
- [ ] **Update Campaign**: On save, sends `PUT /api/campaigns/:id`. Handles 422 validation errors and displays them inline below the corresponding fields. Success returns to read mode with updated data.
- [ ] **Upload Creative UI**: Form/button to select and upload an image file.
- [ ] **Client-side Upload Validation**: Verifies image dimensions are exactly 320x480px before submitting. Shows an error message if invalid.
- [ ] **Server-side Upload**: Sends `POST /api/campaigns/:id/creatives` (multipart/form-data). Displays 422 inline errors (e.g. max 3 creatives, campaign paused). Refreshes creative list on 201 success.
- [ ] **Loading & Error States**: Handles initial data loading states and 404 Not Found (e.g., if user navigates to a non-existent campaign ID).

## Out of Scope
- Deleting campaigns or creatives (not supported by backend).
- Drag-and-drop sorting of creatives.

## Technical Notes
- Use Axios from `src/services/api.ts` for all API requests.
- Use `useParams` from React Router to get the campaign `id`.
- Create custom hooks (e.g., `useCampaignDetail` and `useCreatives`) to handle fetching and mutations.
- For image dimension client-side validation, use the JavaScript `Image` object to load the file and check `width` and `height` before submitting.
- Material UI components: `Card`, `TextField`, `Select` (for status), `Button`, `Grid`/`Stack` for layout.

## UI/UX Notes
- **Layout**: Two-column layout on large screens (Campaign Details on the left, Creatives list and upload on the right). Stacked on mobile.
- **Edit Toggle**: "Edit" button in the Campaign Details card header to toggle edit mode. Save/Cancel buttons when editing.
- **Creative List**: Display creatives as a grid of images with their `createdAt` dates.
