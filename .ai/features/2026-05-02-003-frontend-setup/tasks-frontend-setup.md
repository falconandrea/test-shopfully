# Tasks: Frontend Setup & Foundation

## Task 1 — Scaffold Vite + React 19 + TypeScript ✅
- [x] Run `npx -y create-vite@latest --help` to check available options
- [x] Scaffold project in `frontend/` with `react-ts` template
- [x] Verify `npm run dev` starts correctly

## Task 2 — Install Dependencies ✅
- [x] `@mui/material`, `@mui/icons-material`, `@emotion/react`, `@emotion/styled`
- [x] `react-router-dom` v7
- [x] `axios`
- [x] Add Inter font via Google Fonts in `index.html`

## Task 3 — Project Structure ✅
- [x] Create folder structure: `components/`, `hooks/`, `pages/`, `services/`, `types/`, `theme/`
- [x] Create TypeScript interfaces in `src/types/index.ts` (Campaign, Creative, PaginationMeta, ApiError)
- [x] Create Axios instance in `src/services/api.ts` (RF9)
- [x] Create `.env.example` with `VITE_API_BASE_URL`

## Task 4 — MUI Theme & Layout ✅
- [x] Create custom MUI theme in `src/theme/theme.ts` (dark mode, Inter, premium palette)
- [x] Create `Layout` component with AppBar + content area
- [x] Wrap app in `ThemeProvider` + `CssBaseline`

## Task 5 — React Router & Placeholder Pages ✅
- [x] Create `CampaignListPage` placeholder in `src/pages/CampaignListPage.tsx`
- [x] Create `CampaignDetailPage` placeholder in `src/pages/CampaignDetailPage.tsx`
- [x] Configure router in `App.tsx` with `createBrowserRouter`

## Task 6 — Docker & Compose ✅
- [x] Create `frontend/Dockerfile` (Node 24 Alpine, dev mode)
- [x] Add `frontend` service to root `docker-compose.yml` (port 5173)
- [ ] Verify `docker-compose up` starts both services (deferred — requires backend Dockerfile)

## Task 7 — Verify & Clean Up ✅
- [x] Remove Vite boilerplate (default CSS, logos, counter component)
- [x] Verify app loads at `http://localhost:5174` with placeholder pages
- [x] Verify navigation between `/` and `/campaigns/:id` works
