# Prism Lab - IIT Patna Website

A modern, full-stack web platform for the Prism Research Lab at IIT Patna, built with Next.js 14, TypeScript, MongoDB, and Tailwind CSS.

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

- **Framework**: Next.js 14 (App Router)
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

- Node.js 18+ 
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
   ADMIN_EMAIL=admin@iitp.ac.in
   ADMIN_PASSWORD=your-admin-password
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
3. File saved to `public/uploads/`
4. Relative URL returned and stored in database

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run init-admin` - Initialize admin user

## Security Features

- JWT authentication with HTTP-only cookies
- Password hashing with bcrypt
- Rate limiting on authentication endpoints
- File upload validation (type, size)
- Protected admin routes with middleware
- Input validation with Zod

## Deployment

### Prerequisites
- MongoDB database (MongoDB Atlas recommended)
- Node.js hosting (Vercel, Railway, etc.)

### Steps
1. Set environment variables on hosting platform
2. Run `npm run build`
3. Run `npm run init-admin` (if not done locally)
4. Deploy build output

### Environment Variables for Production
```env
MONGODB_URI=<your-mongodb-atlas-uri>
JWT_SECRET=<strong-random-secret>
ADMIN_EMAIL=<admin-email>
ADMIN_PASSWORD=<strong-password>
NEXT_PUBLIC_API_URL=<your-production-url>
NODE_ENV=production
```

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

Built with ❤️ for Prism Lab, IIT Patna
