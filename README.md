<img src=".media/readme-banner.png" width="100%" />

<hr />

<center>
*A simple web application to better manage your great as well as your dumb ideas.*
</center>

## Concept

![](.media/firefox_OuQWwJY71e.png)

The basic concept of *Pronote* is actually somewhat stolen from the Tab concept of the [Arc browser](https://arc.net).

New items are added to the *"Stack"*. There, they live until you feel the need to actively *"promote"* them into the upper *"Promoted"* section. If the list has an expiration period, items in the Stack will automatically be moved to *"Expired items"* after the time has passed. The expiry is reset when you edit an entry. In the *"Promoted"* section, items never expire. Here live your most important ideas and notes.

### Inspiration

The inspiration to build this web app actually came from a problem I got with the way I was managing ideas in lists, which just piled up ideas over ideas until the point where I was so overwhelmed when opening thoses lists, that I basically lost all motivation to work on them. With this new way of filtering the great ideas from the "stupid" ones you have one day but don't really want to folow up on, I want to better focus on the ideas I actually want to do.

## Hosting

Pronote can be hosted using the fully self-contained Docker image, which contains the backend as well as the frontend files.

### Backend Configuration

The server is configured using the following environment variables.

| Key | Type | Requiry | Example | Description |
|-----|------|---------|---------|-------------|
| `PN_OIDC_ID` | `string` | Yes | `6nv4s1...` | The OIDC client ID. |
| `PN_OIDC_SECRET` | `string` | Yes | `sd8923...` | The OIDC client secret. |
| `PN_OIDC_ISSUER` | `string` | Yes | `https://example.eu.auth0.com` | The OIDC issuer URL. |
| `PN_OIDC_REDIRECT` | `string` | Yes | `https://example.com/api/auth/callback` | The OIDC redierct URL. This should end with `/api/auth/callback` as long as the path is not re-written by your reverse-proxy. |
| `PN_DATABASE_DSN` | `string` | Yes | `postgres://username:password@domain:port/database` | The connection string for the Postgres database used to connect to. |
| `PN_LIMIT_LISTS` | `number` | No | `50` | Limit the amount of lists a user can create. |
| `PN_LIMIT_ITEMS` | `number` | No | `200` | Limit the amount of items a user can create inside a list. |
| `PN_CORS_ORIGINS` | `string[]` | No | `[ https://example.com, https://example2.com ]` | Enable CORS for the given origin URLs. |
| `PN_SERVESPA` | `boolean` | No<br/>Default: `true` | `false` | Control if the backend should serve the frontend SPA files. This should be disabled if you serve the SPA files separately from the backend. |
| `RUST_LOG` | `string` | No<br/>Default: `info` | `debug,rocket=info,hyper_util=info,hyper=info` | Configure log levels. See [`env_logger`](https://docs.rs/env_logger/latest/env_logger/) documentation for more details.  |
