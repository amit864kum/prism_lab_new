# Database operations

## Topology

Prism Lab uses one MongoDB database through Mongoose. `MONGODB_URI` is required at runtime and must come from the deployment secret manager. Application code reaches models only through repositories; scripts are the only controlled exception.

## Collections

| Domain | Models |
| --- | --- |
| Administration | `Admin`, `ActivityLog` |
| People and research | `Member`, `Publication`, `ResearchArea`, `Project`, `Sponsor`, `PIProfile` |
| CMS content | `AboutSection`, `Footer`, `HeroSlide`, `GalleryImage`, `NewsItem` |

Member/publication and research-area/publication references are bidirectional. Writes must use services so both sides and associated files remain consistent.

## Indexes

Schemas define unique indexes for admin email and content slugs, plus indexes for the primary status/type/order/date query patterns. Mongoose automatic index creation must not be treated as a production migration mechanism. Review index differences on staging and schedule production builds explicitly.

Proposed `Publication.authors` and standalone `Project.createdAt` indexes remain unapplied pending `explain('executionStats')` evidence, backup, migration scheduling, and rollback approval. See [Performance.md](./Performance.md).

## Change controls

- Back up MongoDB and uploads at the same logical recovery point before migrations.
- Run every migration without its apply flag first.
- Never run scripts against production from a developer workstation.
- Record database name, migration command, operator, start/end time, result, and backup identifier.
- Relationship reconciliation scripts must be tested against a restored staging snapshot before production use.

Backup and restore commands are documented in [Backup.md](./Backup.md).
