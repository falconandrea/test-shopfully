# Campaign Manager — Frontend

This is the frontend application for the Campaign Manager, built with **React 19**, **TypeScript**, **Vite**, and **Material UI**.

## Setup & Development

Normally, you should run the entire stack from the root directory using Docker Compose (`docker-compose up --build`). However, if you need to run the frontend standalone or install packages:

```bash
cd frontend
npm install
npm run dev
```

The application will be available at `http://localhost:5173`.

## Scripts

- `npm run dev`: Starts the local Vite development server
- `npm run build`: Compiles TypeScript and builds the production bundle
- `npm run preview`: Locally previews the production build
- `npm run lint`: Runs ESLint to check for code quality issues

## Testing

This project uses **Vitest** and **React Testing Library** for unit and component testing.

```bash
# Run the test suite once
npm test

# Run tests in watch mode (recommended during development)
npm run test:watch

# Generate a coverage report (v8)
npm run test:coverage
```

## Structure

- `src/components/`: Reusable UI components (Cards, Grids, Filters)
- `src/hooks/`: Custom React hooks (`useCampaigns`, `useFavourites`)
- `src/pages/`: Main application views
- `src/services/`: API clients (Axios)
- `src/types/`: TypeScript interfaces and definitions
- `src/utils/`: Helper functions
- `src/__tests__/`: Unit and component test suites
