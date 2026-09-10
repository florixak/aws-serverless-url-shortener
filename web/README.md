# SPA

React 19 + TypeScript + Vite app for creating Short links. v1 is a single page at `/`: the create form and the result share that screen. There is no client-side router. A Short link click is a Redirect from the API, not an SPA route.

<p align="center"><img src="../docs/images/home.png" alt="Create form" width="720"></p>

## Page

`App` renders `Header`, `Main`, and `Footer`.

- Header title: `URL Shortener`
- `Main` holds form state (`url`, `shortUrl`, `error`, `loading`) and composes `UrlForm` plus `UrlResult`
- Footer with copyright and link

`UrlForm` posts only after `parseTargetUrl` succeeds. On success, `UrlResult` shows `Short link:` plus an `<a href={shortUrl}>`. On failure, an alert under the field keeps focus on the input.

The form:

- label `Link to shorten`
- `type="url"`, `maxLength={2048}`, placeholder `https://example.com…`
- hint `Must start with https://`
- submit label `Create short link` (or `Creating…` while the request is in flight)

Colors follow `prefers-color-scheme`. Below 768px the field and button stack. Button hover animation is off when `prefers-reduced-motion: reduce`.

## Target URL rules

Client checks are in `src/lib/parse-target-url.ts`. The visitor-facing messages are:

| Condition | Message |
| --- | --- |
| Empty after trim | `Enter a link to shorten.` |
| Longer than 2048 characters | `That link is too long. Use 2048 characters or fewer.` |
| Control characters, or not `https:` | `That link is not valid. Paste a full https:// URL.` / `Only https:// links are allowed. Switch http to https if the site supports it.` |
| `new URL()` throws, or no hostname | `Enter a full URL, like https://example.com` |
| Username or password in the URL | `Remove the username and password from the URL.` |
| Create request fails after a valid parse | `Couldn’t create a short link. Try again.` |

The Lambdas apply the same rules. They return JSON errors instead of these strings.

## API from the browser

`src/lib/short-url.ts` calls:

```http
POST ${VITE_API_URL}/links
Content-Type: application/json

{ "url": "<validated Target URL href>" }
```

A 2xx body must include `shortUrl`. Anything else throws and the form shows the generic create error above.

Copy `web/.env.example` to `web/.env`:

```
VITE_API_URL=your_api_gateway_url
```

Use the API Gateway base URL with no trailing slash. The client appends `/links`.

## Run

From `web/`:

```bash
pnpm install
pnpm dev
```

Other scripts:

```bash
pnpm lint
pnpm build
pnpm preview
```

`pnpm build` runs `tsc -b` then `vite build`. Vite config is the default `@vitejs/plugin-react` setup.

## Source

| Path | Role |
| --- | --- |
| `src/App.tsx` | Header, main, footer |
| `src/components/url-form.tsx` | Create form |
| `src/components/url-result.tsx` | Short link output |
| `src/components/header.tsx` / `footer.tsx` | Site header and footer |
| `src/lib/parse-target-url.ts` | Client Target URL checks |
| `src/lib/short-url.ts` | `POST /links` |
| `src/index.css` | Layout and color tokens |

The SPA does not import Lambda modules. Handlers live in `cdk/handlers/` and are deployed by the CDK stack. See [`cdk/README.md`](../cdk/README.md).
