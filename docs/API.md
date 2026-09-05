# API operations reference

All routes are same-origin. JSON write routes validate input with Zod, require an authenticated admin cookie, and return safe error bodies. Unknown failures return `{ "error": "Internal server error" }` with `X-Request-ID`.

## Authentication and operations

| Route | Methods | Access |
| --- | --- | --- |
| `/api/auth/login` | `POST` | Public, login-rate-limited |
| `/api/auth/logout` | `POST` | Authenticated |
| `/api/auth/me` | `GET` | Authenticated |
| `/api/dashboard/stats` | `GET` | Authenticated |
| `/api/upload` | `POST` multipart | Authenticated |
| `/api/about`, `/api/footer`, `/api/pi-profile` | `GET`, `PUT` | Public read; authenticated write |
| `/api/hero-slides` | `GET`, `POST` | Public read; authenticated create |
| `/api/hero-slides/[id]` | `GET`, `PUT`, `DELETE` | Public read; authenticated write |
| `/api/gallery`, `/api/news`, `/api/projects`, `/api/publications`, `/api/research-areas`, `/api/sponsors` | `GET`, `POST` | Public read; authenticated create |
| Corresponding `/api/.../[id]` routes | `GET`, `PUT`, `DELETE` | Public read; authenticated write |
| `/api/members` | `GET`, `POST` | Public read; authenticated create |
| `/api/members/[id]` | `GET`, `PUT`, `DELETE` | Public read; authenticated write |
| `/api/members/autocomplete` | `GET` | Authenticated |

## List contracts

The member, publication, gallery, project, news, sponsor, and research-area list routes accept optional positive `page` and `limit` query parameters. Defaults are page 1 and 100 items; the limit is capped at 250.

Existing primary arrays remain unchanged (`members`, `publications`, `projects`, `news`, `sponsors`, `researchAreas`, and both gallery aliases). Responses also include:

```json
{
  "pagination": {
    "page": 1,
    "limit": 250,
    "hasMore": false
  }
}
```

All `/api/**` responses use `Cache-Control: no-store, max-age=0` so CMS updates remain immediately visible. Durable `/uploads/**` responses use immutable caching for managed UUID assets.

## Upload contract

`POST /api/upload` accepts one validated image or PDF and an approved category. The response retains the public `/uploads/<category>/<uuid>.<extension>` URL. The application route, not Nginx filesystem aliases, serves these files.

Request limits and security behavior are detailed in [Security.md](./Security.md).
