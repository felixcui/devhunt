# Repository Guidelines

## Project Structure & Module Organization
- `src/app/` — Next.js App Router pages and layouts; API routes in `src/app/api/*`.
- `src/components/` — Reusable React components (PascalCase files).
- `src/utils/`, `src/lib/` — Utilities and the design system primitives.
- `src/types/` — TypeScript types and ambient declarations.
- `src/config/` — Feishu (Lark) integration config.
- `public/` — Static assets.
- `python/` — Crawlers and Feishu table scripts; `requirements.txt` for deps.
- `prompt/` — Prompt assets for content workflows.

## Build, Test, and Development Commands
- `pnpm dev` — Start Next.js dev server at `http://localhost:3000`.
- `pnpm build` — Production build.
- `pnpm start` — Run the production server.
- `pnpm lint` — Lint and autofix via Next.js ESLint config.
- Python: `pip install -r requirements.txt` then run scripts (e.g., `python python/tool-crawler.py`, `python python/feishu_table_transfer.py`).
- Optional E2E: `node test-playwright.js` (install Playwright first: `pnpm add -D playwright && npx playwright install chromium`).

## Coding Style & Naming Conventions
- TypeScript, React function components, 2‑space indentation.
- Components: PascalCase files in `src/components/` (e.g., `ToolCard.tsx`).
- Routes and utilities: kebab-case (e.g., `src/utils/category-icons.ts`).
- Keep types in `src/types/`; co-locate small helpers with features when practical.
- Styling with Tailwind; follow tokens and patterns in `DESIGN_SYSTEM.md` and `src/lib/design-system.ts`.
- Prefer minimal state; reuse existing component and API patterns.

## Testing Guidelines
- No unit test framework is enforced; prioritize lint-clean code and manual verification.
- E2E smoke: `node test-playwright.js` validates basic navigation/screenshot.
- If adding tests, place E2E helpers under `tests/` or top-level scripts; name `*.e2e.ts`.

## Commit & Pull Request Guidelines
- Commits: short, present tense, scoped (English or Chinese acceptable). Examples:
  - `fix: return to tools button`
  - `update ui` / `优化样式` / `update news display`
- PRs should include:
  - Summary of changes and motivation; link issues if any.
  - Screenshots/GIFs for UI changes; API/ENV changes called out.
  - Local test plan (commands run) and checklist: `pnpm lint` passes.

## Security & Configuration Tips
- Do not commit secrets. Use `.env.local` for `FEISHU_APP_ID`, `FEISHU_APP_SECRET`, etc.
- Be mindful of API rate limits; leverage existing caching in API routes.
- Validate Feishu schema changes against `src/config/feishu.ts` and API handlers.

