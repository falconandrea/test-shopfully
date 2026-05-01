# Campaign Manager — Agent Guidelines

## Project Overview

Full-stack monorepo to manage advertising campaigns and their associated creatives.

- **Backend:** Laravel 13, API-only — see `backend/AGENTS.md` for Laravel-specific rules
- **Frontend:** React 19 + Vite + TypeScript + Material UI, SPA
- **No database** — campaigns loaded from a static JSON fixture; creatives persisted to `storage/app/creatives.json`

## Repository Structure

```
test-shopfully/
├── backend/          # Laravel 13 API (port 8000)
│   ├── AGENTS.md     # Laravel Boost rules — do not modify
│   └── .agents/      # Laravel Boost skills only
│       └── skills/
├── frontend/         # React 19 + Vite + TypeScript + MUI (port 5173)
├── .agents/          # Project-level agent workflows
│   └── workflows/    # feature.md, setup.md, start.md
├── .ai/              # Global project context & memory
│   ├── context/      # requirements.md, architecture.md, app_flow.md
│   ├── features/     # Feature specs & task lists
│   ├── memory/       # progress.md, lessons.md
│   └── prompts/      # Reusable agent prompts
└── AGENTS.md         # This file
```

## Context Files

- Full requirements: `.ai/context/requirements.md`
- Architecture decisions: `.ai/context/architecture.md`
- Application flows: `.ai/context/app_flow.md`
- Progress tracker: `.ai/memory/progress.md`
- Lessons learned: `.ai/memory/lessons.md`

## General Rules

- Always read the relevant context files before starting work on a feature.
- For any backend task, also read `backend/AGENTS.md` for Laravel-specific conventions.
- All files and comments must be written in **English**.
- Follow the requirement codes (`RD`, `RB`, `RA`, `RF`, `RT`, `RO`, `RS`) when implementing features — reference them in commits and comments.
- Branch strategy: `feature/*` → PR to `develop` → merge to `main`.
- Do not commit `.env` files — use `.env.example` as reference.
- `docker-compose up` from root must start both services with no additional setup.
