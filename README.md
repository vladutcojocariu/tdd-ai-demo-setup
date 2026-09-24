# tdd-ai-demo-setup

A minimal React + TypeScript demo scaffold for showcasing AI-assisted
Test-Driven Development (TDD) against a real HTTP API.

## Target feature

The intended next step is to build a homepage that uses the
[JSONPlaceholder API](https://jsonplaceholder.typicode.com/) to:

- list resources such as posts
- create new resources
- delete existing resources

This repository intentionally stops at the scaffold stage: there is no feature
implementation, API integration logic, or test suite yet.

## Stack

- Vite + React + TypeScript
- Vitest + React Testing Library
- ESLint + Prettier
- Native `fetch` for future API calls

## Project structure

A central `src/__tests__` directory is included as a placeholder so future TDD
work can start with explicit failing tests before feature files are introduced.

```text
src/
├── __tests__/
├── api/
├── components/
├── hooks/
├── test/
├── types/
├── config.ts
├── index.css
├── main.tsx
└── vite-env.d.ts
```

## Environment

Copy `.env.example` to `.env` if you want to override the default API base URL:

```bash
cp .env.example .env
```

The scaffold exposes `VITE_API_BASE_URL` for the future JSONPlaceholder base
URL configuration.

## Available scripts

```bash
npm install
npm run dev
npm run build
npm run lint
npm run test
npm run test:watch
```

Use a supported modern Node.js release (22.22.2+, 24.15+, or newer) so the
Vite/Vitest toolchain matches its supported runtime.

## Intended TDD workflow

1. Write a failing test for the next behavior.
2. Implement the smallest change needed to make it pass.
3. Refactor while keeping the tests green.
