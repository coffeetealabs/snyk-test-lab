# 📘 Project Best Practices

## 1. Project Purpose
This repository is a minimal Node.js/Express application used to experiment with and demonstrate security analysis tooling (e.g., Snyk). It intentionally contains insecure patterns to surface findings, such as arbitrary code execution via `eval` and a contrived SQL injection example. Treat it as a demo playground, not production-ready code.

## 2. Project Structure
- `index.js` — Application entrypoint. Creates an Express app, attaches routes from `insecure.js`, and starts the HTTP server on port 3000.
- `insecure.js` — Route definitions and intentionally vulnerable examples:
  - `GET /eval` — Directly evaluates user-provided JavaScript via `eval` and returns the result as a string.
  - `login(user, password)` — Example showing unsafe string concatenation into a SQL query (not wired into a route).
- `__tests__/` — Jest test suites. Currently covers `/eval` route behavior using Supertest.
- `package.json` — Project metadata and scripts. Includes `jest` and `supertest` as dev dependencies and a `test` script.
- `.vscode/`, `.git/`, `.qodo/`, `node_modules/` — Tooling, editor settings, VCS metadata, and dependencies.

Separation of concerns is intentionally minimal for demonstration; in production, prefer splitting routes, controllers, services, and configuration.

## 3. Test Strategy
- Frameworks: **Jest** (test runner, assertions) + **Supertest** (HTTP testing for Express apps).
- Organization: Tests live under `__tests__/` and mirror the feature or module under test, e.g., `insecure.test.js` for `insecure.js`.
- Conventions:
  - One behavior per `test(...)` with clear names.
  - Use an in-memory Express app factory to avoid binding to a port.
- Mocking Guidelines:
  - Mock only external boundaries (e.g., databases, external APIs, filesystem, network). Avoid mocking internal logic.
  - If testing `login`, stub the database layer (e.g., `database.execute`) to avoid side effects and to assert on query construction.
- Unit vs Integration:
  - Unit tests for pure functions and small modules.
  - Integration tests for HTTP routes using Supertest against an in-memory app instance.
  - Keep each test independent and deterministic; avoid relying on global state.
- Coverage Expectations (suggested for this repo): Aim for key behavior coverage of insecure examples (document current behavior), not production-grade thresholds. In production, target 80%+ statement/branch coverage with CI gating.

## 4. Code Style
- Language: Node.js (CommonJS modules).
- Async: Use Express async handlers or promise chains for I/O in real scenarios. Always handle rejected promises.
- Naming:
  - Files: `kebab-case` or concise descriptive names (`index.js`, `insecure.js`).
  - Functions/variables: `camelCase`; constants in `SCREAMING_SNAKE_CASE`.
- Formatting:
  - Prefer consistent semicolons and 2-space indentation. Current code is mixed; standardize with a formatter.
  - Use single quotes for strings for consistency (current code is mixed).
- Comments/Docs:
  - Add top-of-file summaries where intent isn’t obvious.
  - Use comments to flag intentionally insecure snippets and explain why they’re insecure.
- Error Handling:
  - Never expose stack traces or sensitive details to clients in production.
  - Wrap route logic in try/catch and respond with appropriate HTTP codes.
  - Validate and sanitize inputs; never trust user input.

## 5. Common Patterns
- Express app composition: Build an app, attach route modules, and export factories for testability.
- In tests, build an in-memory app instance and exercise routes via Supertest.
- Dependency seams: Abstract integrations (DB, external services) behind modules to make them easily mockable/stubbed in tests.

## 6. Do's and Don'ts
- ✅ Do create small, focused modules (routes/controllers/services) with explicit interfaces.
- ✅ Do centralize configuration (port, DB connection strings) via environment variables and a config module.
- ✅ Do validate and sanitize all external input; use schema validators (e.g., `zod`, `joi`).
- ✅ Do add tests for documented behaviors, including edge cases and error paths.
- ✅ Do use a linter/formatter (ESLint + Prettier) to enforce consistency.
- ✅ Do avoid side effects in modules at import-time; export factories for better testability.

- ❌ Don’t use `eval` on untrusted input. If absolutely required, restrict context/sandbox or avoid altogether.
- ❌ Don’t build SQL queries via string concatenation. Use parameterized queries/ORMs.
- ❌ Don’t start servers in modules that are imported by tests. Export an app/server factory instead.
- ❌ Don’t leak sensitive information in logs or HTTP responses.
- ❌ Don’t mock internal implementation details; mock only external systems.

## 7. Tools & Dependencies
- Runtime Dependencies:
  - `express` — HTTP server and routing.
  - `lodash` — Utility library (present; not currently used in code).
  - `minimist` — CLI argument parsing (present; not currently used).
- Dev Dependencies:
  - `jest` — Test runner and assertion library.
  - `supertest` — HTTP testing for Express.

Setup:
```bash
npm install
npm test
```

Recommended Additions (optional):
- ESLint + Prettier with a standard config.
- `dotenv` for configuration and `.env.example` to document required vars.
- Add `npm run start` and `npm run dev` scripts (e.g., using `nodemon`).

## 8. Other Notes
- This repo intentionally includes insecure patterns for demonstration. When contributing examples, clearly annotate insecure code and keep it isolated.
- Prefer exporting an Express app factory (e.g., `createApp()`) instead of starting the server in `index.js` to facilitate testing without binding to a port.
- If expanding beyond demo scope, refactor toward a layered architecture:
  - `src/routes/`, `src/controllers/`, `src/services/`, `src/db/`, `src/config/` with matching `__tests__/` structure.
- Keep tests fast, deterministic, and free of network/FS dependencies unless explicitly integration/e2e.
