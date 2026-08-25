# Single-page create UI; Redirects are not SPA routes

v1 of the SPA is one page at `/`: the visitor pastes a Target URL and receives the Short link on that same screen. No client-side router. Cognito may come later and does not justify extra screens or a router now. Following a Short link is a Redirect from the public redirect endpoint — a `/:code` SPA route would steal those requests from the API.
