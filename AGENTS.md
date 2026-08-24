# AGENTS.md

Serverless URL shortener on AWS. A visitor pastes a Target URL, receives a Short link, and that Short link Redirects to the Target URL. Glossary: `CONTEXT.md`.

## Layout

- `web/` — React + Vite SPA
- `api/` — AWS Lambda handlers and the IAM policies those handlers run under

Frontend lives in `web/`. Lambda source and least-privilege policies live in `api/`. Keep that boundary: UI does not import Lambda modules; handlers do not serve the SPA.

## Auth

Ship create and redirect as public endpoints. Keep handlers identity-agnostic so a later Cognito User Pool can wrap them.

Cognito is out of scope. Add User Pools, JWT verification, hosted UI, or login screens only when that work is explicitly requested.

## `web/`

Vite SPA, not Next.js. RSC, Server Actions, and `next/dynamic` rules in the React skills do not apply; composition and client-performance rules do.

v1 is a single page at `/` (create form and result together). Do not add a client-side router. A Short link click is a Redirect from the API, not an SPA route. See `docs/adr/0001-spa-is-one-create-page.md`.

- React composition (compound components, no boolean-prop modes): `web/.agents/skills/vercel-composition-patterns/`
- React performance (waterfalls, bundles, re-renders): `web/.agents/skills/vercel-react-best-practices/`
- UI review (accessibility, UX): `web/.agents/skills/web-design-guidelines/`

## `api/`

One concern per Lambda. Validate input, persist or look up the mapping, return the HTTP response. Colocate the execution-role policy with the function it authorizes; grant only the actions and resources that function uses. Treat policies as production code and review them with the handler.

## Domain language

Resolved terms live in `CONTEXT.md`. Sharpen the glossary and ADRs with `web/.agents/skills/domain-modeling/`.
