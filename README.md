# Prism Lab - IIT Patna Website

A modern, full-stack web platform for the Prism Research Lab at IIT Patna, built with Next.js 16, React 19, TypeScript, MongoDB, and Tailwind CSS.

## Features

### Public Website
- **Hero Carousel**: Dynamic homepage slides with CTA buttons
- **About Section**: Lab overview and mission
- **News Updates**: Latest lab news and announcements
- **Research Areas**: Detailed research focus areas
- **Projects**: Ongoing and completed research projects
- **Publications**: Comprehensive publication database (6 types)
- **Team**: PI profile, current members, and alumni directory
- **Gallery**: Photo gallery with category filtering
- **Sponsors**: Partner organizations

### Admin CMS
- **Secure Authentication**: JWT-based auth with HTTP-only cookies
- **Content Management**: Full CRUD for all content types
- **File Uploads**: Image and PDF upload with validation
- **Member-Publication Sync**: Bidirectional relationship management
- **Dashboard**: Quick access to all management features
- **Rate Limiting**: Protection against brute force attacks

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **UI runtime**: React 19
- **Language**: TypeScript
- **Database**: MongoDB with Mongoose
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Authentication**: JWT (jose) with bcrypt
- **Validation**: Zod
- **Rich Text**: TipTap
- **Animations**: Framer Motion

## Getting Started

### Prerequisites

- Node.js 20.9+
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd "Prism lab revised"
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local` with your configuration:
   ```env
   MONGODB_URI=mongodb://localhost:27017/prism-lab
   JWT_SECRET=your-secret-key-here
   ADMIN_EMAIL=
   ADMIN_PASSWORD=
   NEXT_PUBLIC_API_URL=http://localhost:3000
   ```

4. **Initialize admin user**
   ```bash
   npm run init-admin
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

6. **Access the application**
   - Public site: http://localhost:3000
   - Admin panel: http://localhost:3000/admin/login

## Project Structure

```
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   ├── auth/         # Authentication endpoints
│   │   ├── research-areas/
│   │   ├── upload/       # File upload
│   │   └── ...
│   ├── admin/            # Admin CMS pages
│   │   ├── login/
│   │   ├── dashboard/
│   │   └── ...
│   └── (public)/         # Public pages
├── components/            # React components
├── lib/                  # Utilities
│   ├── auth.ts          # Authentication helpers
│   ├── mongodb.ts       # Database connection
│   ├── upload.ts        # File upload logic
│   ├── rate-limit.ts    # Rate limiting
│   ├── utils.ts         # General utilities
│   └── validations/     # Zod schemas
├── models/               # Mongoose models
│   ├── Admin.ts
│   ├── Member.ts
│   ├── Publication.ts
│   └── ...
├── scripts/              # Utility scripts
│   └── init-admin.ts    # Admin initialization
└── public/
    └── uploads/         # User uploaded files
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - Admin login
- `POST /api/auth/logout` - Admin logout
- `GET /api/auth/me` - Get current user

### Content Management (Admin Only)
- `GET/POST /api/research-areas` - List/create research areas
- `GET/PUT/DELETE /api/research-areas/[id]` - Get/update/delete research area
- Similar patterns for: projects, sponsors, news, gallery, members, publications

### File Upload (Admin Only)
- `POST /api/upload` - Upload images or PDFs

## Development

### Database Models

All models include:
- Auto-generated timestamps (`createdAt`, `updatedAt`)
- Validation rules
- Indexes for performance

### Authentication Flow

1. Admin logs in with email/password
2. Server verifies credentials and creates JWT
3. JWT stored in HTTP-only cookie
4. Middleware protects admin routes
5. API routes check authentication via `getCurrentUser()`

### File Upload Flow

1. Admin uploads file via form
2. Server validates file type and size
3. File signature is verified and the upload is atomically staged outside `public/`
4. The domain service promotes it into durable `uploads/<category>/` storage
5. The compatible `/uploads/...` URL is stored in MongoDB and served by the application

See [Storage operations](./docs/Storage.md) for migration, backup, and rollback guidance.

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run typecheck` - Run TypeScript checks
- `npm test` - Run the complete current test suite
- `npm run verify` - Run type checks, lint, tests, and the production build
- `npm run release:verify` - Run all release checks and fail if the production dependency audit is unsafe
- `npm run migrate:storage:dry-run` - Preview the non-destructive storage migration
- `npm run init-admin` - Initialize admin user

See [Testing and quality gates](./docs/Testing.md) for test organization, CI behavior, and recorded coverage gaps.
See [Deployment operations](./docs/Deployment.md) and the [launch gate](./docs/Launch.md) before staging or production deployment.

## Security Features

- JWT authentication with HTTP-only cookies
- Password hashing with bcrypt
- Rate limiting on authentication endpoints
- File upload validation (type, size)
- Protected admin routes with middleware
- Input validation with Zod

## Single-server production deployment

The supported production topology is **Nginx → one PM2-managed Next.js process → MongoDB on the same Linux server**. Uploaded files are stored outside the release directory so deployments never overwrite them.

> These commands assume an Ubuntu/Debian-style server, an application user named `prism`, a configured DNS name, and that Node.js 20.9+, npm, PM2, Nginx, MongoDB Server, MongoDB Database Tools, `tar`, `sha256sum`, and `curl` are already installed. Do not expose MongoDB's port to the network.

### 1. Prepare MongoDB

Configure `/etc/mongod.conf` to keep the database local and require authentication:

```yaml
storage:
  dbPath: /var/lib/mongodb
net:
  bindIp: 127.0.0.1,::1
  port: 27017
security:
  authorization: enabled
```

Create the database user (first create an administrator as required by your MongoDB installation, then run):

```javascript
// mongosh --host 127.0.0.1
use prism-lab
db.createUser({
  user: 'prism_app',
  pwd: passwordPrompt(),
  roles: [{ role: 'readWrite', db: 'prism-lab' }],
})
```

```bash
sudo systemctl enable --now mongod
```

### 2. Create persistent directories and production variables

```bash
sudo useradd --system --create-home --shell /usr/sbin/nologin prism 2>/dev/null || true
sudo install -d -o prism -g prism -m 0750 \
  /srv/prism-lab/releases \
  /srv/prism-lab/shared/uploads \
  /srv/prism-lab/shared/logs \
  /srv/backups/prism-lab

sudo install -o root -g prism -m 0640 /dev/null /etc/prism-lab.env
sudoedit /etc/prism-lab.env
```

Put the following values in `/etc/prism-lab.env`; use a URL-encoded MongoDB password and a randomly generated `JWT_SECRET` of at least 32 characters. Never commit this file.

```dotenv
PRISM_APP_DIR=/srv/prism-lab/current
PORT=3000
MONGODB_URI=mongodb://prism_app:URL_ENCODED_PASSWORD@127.0.0.1:27017/prism-lab?authSource=prism-lab
JWT_SECRET=REPLACE_WITH_A_RANDOM_SECRET_OF_32_OR_MORE_CHARACTERS
UPLOADS_ROOT=/srv/prism-lab/shared/uploads
LOGS_ROOT=/srv/prism-lab/shared/logs
BACKUP_ROOT=/srv/backups/prism-lab
NEXT_PUBLIC_API_URL=https://lab.example.org
NEXT_PUBLIC_BASE_URL=https://lab.example.org
```

### 3. Deploy and verify a release

Replace placeholders, deploy the reviewed commit to a new directory, and keep the prior release available for rollback. `NEXT_PUBLIC_*` values are embedded during the build, so load the environment before building.

```bash
release=20260808-1
release_dir="/srv/prism-lab/releases/$release"
sudo -u prism -H git clone --branch main --depth 1 <repository-url> "$release_dir"
sudo -u prism -H env RELEASE_DIR="$release_dir" bash -lc '
  set -a; source /etc/prism-lab.env; set +a
  cd "$RELEASE_DIR"
  npm ci
  npm run release:verify
'
sudo -u prism -H ln -s "$release_dir" /srv/prism-lab/current.new
sudo -u prism -H mv -Tf /srv/prism-lab/current.new /srv/prism-lab/current
```

### 4. Migrate legacy uploads once

If this is the first release that uses durable uploads, back up the database and legacy `public/uploads/` directory before migration. The migration is non-destructive: it copies files and never deletes legacy originals.

```bash
sudo -u prism -H bash -lc '
  set -a; source /etc/prism-lab.env; set +a
  stamp=$(date -u +%Y%m%dT%H%M%SZ)
  mkdir -p "$BACKUP_ROOT/pre-storage-migration-$stamp"
  mongodump --uri="$MONGODB_URI" --archive="$BACKUP_ROOT/pre-storage-migration-$stamp/mongodb.archive.gz" --gzip
  tar -czf "$BACKUP_ROOT/pre-storage-migration-$stamp/legacy-uploads.tar.gz" -C "$PRISM_APP_DIR/public" uploads
  cd "$PRISM_APP_DIR"
  npm run migrate:storage:dry-run
  npm run migrate:storage -- --apply
'
```

Confirm the dry-run lists only expected files before running the apply command. The script uses `UPLOADS_ROOT`, so files are copied to `/srv/prism-lab/shared/uploads`, not the release directory.

### 5. Configure Nginx and start the application

Update `server_name` and certificate paths in `deployment/nginx/prism-lab.conf`, install the TLS certificate, then install the configuration:

```bash
sudo cp /srv/prism-lab/current/deployment/nginx/prism-lab.conf /etc/nginx/conf.d/prism-lab.conf
sudo nginx -t
sudo systemctl reload nginx

sudo -u prism -H bash -lc '
  set -a; source /etc/prism-lab.env; set +a
  cd "$PRISM_APP_DIR"
  pm2 start deployment/pm2/ecosystem.config.js --update-env
  pm2 save
  pm2 install pm2-logrotate
'
```

Run `sudo -u prism -H pm2 startup systemd -u prism --hp /home/prism`, then execute the exact privileged command PM2 prints. This makes PM2 start after reboots.

### 6. Validate, initialize, and back up

```bash
sudo bash -c '
  set -a; source /etc/prism-lab.env; set +a
  bash "$PRISM_APP_DIR/deployment/scripts/preflight.sh"
'

sudo -u prism -H bash -lc '
  set -a; source /etc/prism-lab.env; set +a
  cd "$PRISM_APP_DIR"
  BASE_URL="$NEXT_PUBLIC_BASE_URL" bash deployment/scripts/smoke-test.sh
  bash deployment/scripts/backup.sh
'
```

For a new database only, define `ADMIN_EMAIL` and `ADMIN_PASSWORD` in the protected environment file temporarily, then run `npm run init-admin` from `$PRISM_APP_DIR` as `prism`. Remove `ADMIN_PASSWORD` after initialization. Complete authenticated CRUD and upload checks before opening production traffic.

Schedule `bash $PRISM_APP_DIR/deployment/scripts/backup.sh` daily as the `prism` user, monitor the process, disk capacity, TLS expiry, database connectivity, and backup age, and copy backups off-host. See [Deployment operations](./docs/Deployment.md), [backup and restore](./docs/Backup.md), and the [launch gate](./docs/Launch.md) for rollback and approval requirements.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

[Add your license here]

## Support

For support, email: [your-email]

## Roadmap

- [ ] Complete all admin CRUD interfaces
- [ ] Implement all public pages
- [ ] Add search functionality
- [ ] Implement SEO optimizations
- [ ] Add accessibility improvements
- [ ] Set up automated testing
- [ ] Deploy to production

---

