# Feature: Frontend Setup & Foundation

## Overview

Scaffold the React 19 + Vite + TypeScript frontend application with Material UI, React Router, centralised API client, and Docker support. This is the foundational layer that all subsequent frontend features (campaign list, campaign detail, creative upload) will build on.

## User Stories

- As a developer, I want a working Vite + React 19 + TypeScript project so that I can start building UI components.
- As a developer, I want Material UI configured with a custom theme so that all screens share a consistent, polished design.
- As a developer, I want React Router set up with route definitions so that navigation between pages works correctly.
- As a developer, I want a centralised Axios instance so that all API calls go through a single, configurable client (RF9).
- As a developer, I want a Docker setup so that `docker-compose up` from the root starts both backend and frontend (RO4).

## Acceptance Criteria

- [ ] Vite + React 19 + TypeScript project scaffolded in `frontend/`
- [ ] Material UI (`@mui/material`, `@mui/icons-material`) installed and configured
- [ ] MUI theme created with a polished, premium design (dark mode, custom palette, Inter font)
- [ ] React Router v7 installed with routes for `/` and `/campaigns/:id`
- [ ] Centralised Axios instance at `src/services/api.ts` with `baseURL` from env (RF9)
- [ ] Project folder structure established:
  ```
  frontend/src/
  ├── components/     # Shared UI components
  ├── hooks/          # Custom hooks (useCampaigns, useFavourites, etc.)
  ├── pages/          # CampaignList, CampaignDetail
  ├── services/       # api.ts (Axios instance)
  ├── types/          # TypeScript interfaces (Campaign, Creative, etc.)
  ├── theme/          # MUI theme config
  ├── App.tsx         # Router + ThemeProvider wrapper
  └── main.tsx        # Entry point
  ```
- [ ] Placeholder pages for `/` (CampaignList) and `/campaigns/:id` (CampaignDetail) render correctly
- [ ] `frontend/Dockerfile` and `docker-compose.yml` service for frontend (port 5173) created
- [ ] `frontend/.env.example` with `VITE_API_BASE_URL=http://localhost:8000/api`
- [ ] `npm run dev` starts the dev server at `http://localhost:5173`

## Out of Scope

- Campaign list page implementation (separate feature)
- Campaign detail page implementation (separate feature)
- Creative upload functionality (separate feature)
- Favourites hook implementation (separate feature)
- Frontend tests (separate feature)
- CI/CD pipeline (separate feature)

## Technical Notes

- Use `npx -y create-vite@latest ./ -- --template react-ts` to scaffold (check `--help` first)
- MUI requires `@emotion/react` and `@emotion/styled` as peer dependencies
- React Router v7 with `createBrowserRouter` for type-safe routing
- Axios `baseURL` should read from `import.meta.env.VITE_API_BASE_URL`
- The Docker setup should use a Node 24 Alpine image, mount source for hot-reload in dev

## UI/UX Notes

- **Theme:** Dark-mode-first design with a premium colour palette (deep navy/charcoal background, vibrant accent colour)
- **Typography:** Inter font from Google Fonts
- **Components:** MUI components will be styled via theme overrides for a cohesive look
- **Layout:** AppBar with project title + a responsive content area with max-width container

## Requirement Codes

RF9, RO4, RO5
