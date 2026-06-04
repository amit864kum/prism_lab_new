# Implementation Plan: Prism Lab IIT Patna Web Platform

## Overview

This implementation plan provides a complete, dependency-ordered task breakdown for building the Prism Lab IIT Patna Web Platform—a full-stack Next.js 14 (App Router) TypeScript application with MongoDB and Mongoose, featuring a public research showcase website and a secure admin CMS.

The platform implements 37 requirements covering authentication, content management, responsive design, SEO, animations, file uploads, and bidirectional data synchronization. All tasks reference specific requirements from `requirements.md` and follow the technical design specified in `design.md`.

## Implementation Approach

- **Tech Stack**: Next.js 14 (App Router), TypeScript, MongoDB, Mongoose, Tailwind CSS, ShadCN UI, Framer Motion, TipTap, JWT (jose), bcrypt, Zod
- **Architecture**: Layered (Presentation → Application → Domain/Services → Data)
- **File Storage**: Server filesystem (`/uploads`) with MongoDB storing relative paths only
- **Authentication**: JWT in HTTP-only cookies, bcrypt password hashing, rate limiting
- **Testing**: Property-based tests using fast-check for universal invariants, unit tests for specific behaviors

## Tasks

- [x] 1. Project setup and infrastructure
  - [x] 1.1 Initialize Next.js 14 project with TypeScript and configure core dependencies
    - Create Next.js 14 project with App Router
    - Install and configure TypeScript with strict mode
    - Install core dependencies: React, React DOM, Next.js
    - Configure `tsconfig.json` with strict type checking
    - Set up `.gitignore` to exclude `node_modules`, `.next`, `.env.local`, and `/uploads`
    - _Requirements: 27.5, 36.1_

  - [x] 1.2 Configure Tailwind CSS and ShadCN UI
    - Install and configure Tailwind CSS with Next.js
    - Set up ShadCN UI with Radix primitives
    - Configure responsive breakpoints (mobile: 320-767px, tablet: 768-1024px, desktop: 1025px+)
    - Set up theme configuration for light and dark modes
    - _Requirements: 29.1, 29.2, 29.3, 30.1_

  - [x] 1.3 Set up environment configuration and MongoDB connection
    - Create `.env.local` template with all required variables
    - Document environment variables: `MONGODB_URI`, `JWT_SECRET`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `NEXT_PUBLIC_BASE_URL`, `UPLOAD_DIR`, `SESSION_TTL_HOURS`, `RATE_LIMIT_MAX`, `RATE_LIMIT_WINDOW_MIN`
    - Create database connection singleton (`lib/db.ts`) with Mongoose
    - Implement connection pooling and error handling
    - _Requirements: 20.3, 36.1, 36.3_

  - [x] 1.4 Create project folder structure
    - Set up `/app` directory with public and admin route groups
    - Create `/components` directory with ui, public, admin, and motion subdirectories
    - Create `/lib` directory with auth, files, validation, publications, research, members subdirectories
    - Create `/models` directory for Mongoose schemas
    - Create `/types` directory for TypeScript interfaces
    - Create `/hooks` directory for custom React hooks
    - Create `/uploads` directory structure with subfolders: hero, members, pi, research, publications, sponsors, gallery, resumes, news
    - _Requirements: 27.2, 36.1_

- [x] 2. Data models and schemas
  - [x] 2.1 Create shared types and enums
    - Define TypeScript interfaces in `/types/common.ts` for ID, RichText, Section
    - Define enums for MemberRole, MemberStatus, PublicationType, GalleryCategory
    - Create ApiResponse types (ApiOk, ApiErr)
    - _Requirements: 13.1, 16.1, 22.1_

  - [x] 2.2 Implement User model
    - Create User Mongoose schema with email, passwordHash, timestamps
    - Add unique index on email field
    - Set `select: false` on passwordHash field for security
    - Create TypeScript interface in `/types/user.ts`
    - _Requirements: 17.2, 20.1, 20.2_

  - [x] 2.3 Implement content entity models
    - Create Mongoose schemas for HeroSlide, AboutLab, News, ResearchArea, Project, Sponsor
    - Add display order indexes where applicable
    - Create unique slug index for ResearchArea
    - Define TypeScript interfaces for each model
    - _Requirements: 1.1, 2.1, 3.1, 4.1, 8.1, 10.1, 11.1, 22.1_

  - [x] 2.4 Implement PrincipalInvestigator model
    - Create PI Mongoose schema with all required fields (name, designation, image, contact links)
    - Add rich-text fields for 7 sections (overview, research, teaching, publications, education, activities, achievements)
    - Define TypeScript interface
    - _Requirements: 12.1, 12.2, 12.3, 22.1_

  - [x] 2.5 Implement Member model with bidirectional publication references
    - Create Member Mongoose schema with role, status, sessionYear, contact fields
    - Add publications array (ObjectId references to publications)
    - Add compound indexes for role+displayOrder and role+sessionYear+status
    - Define TypeScript interface with all optional fields
    - _Requirements: 13.1, 13.2, 14.1, 22.1, 25.4_

  - [x] 2.6 Implement Publication model with discriminated metadata
    - Create Publication Mongoose schema with publicationType, title, authors, linkedMembers, year
    - Define discriminated metadata interfaces (JournalMeta, ConferenceMeta, BookMeta, PatentMeta, DatasetMeta, InvitedTalkMeta)
    - Add indexes on publicationType+year and text search on title+authors
    - Define TypeScript interfaces for all metadata types
    - _Requirements: 16.1, 16.2, 24.3, 25.1_

  - [x] 2.7 Implement Gallery, Footer, and ActivityLog models
    - Create GalleryItem schema with category, displayOrder
    - Create Footer schema (singleton entity)
    - Create ActivityLog schema for dashboard recent activity
    - Define TypeScript interfaces
    - _Requirements: 6.1, 7.1, 21.4, 22.1_

  - [x]* 2.8 Write property test for bidirectional publication-member references
    - **Property 4: Member-publication bijection**
    - **Validates: Requirements 25.1, 25.2, 25.3, 25.4**
    - Generate random publications with linkedMembers and verify that `m._id ∈ p.linkedMembers ⟺ p._id ∈ m.publications` after sync operations
    - Test with create, update, and delete scenarios

- [x] 3. Authentication and security services
  - [x] 3.1 Implement JWT service with HTTP-only cookie management
    - Create JWT signing and verification functions using `jose` library (Edge-compatible)
    - Implement session cookie setter with HttpOnly, Secure, SameSite=Lax attributes
    - Set session expiry to SESSION_TTL_HOURS (default 24 hours)
    - Create session verification function for middleware
    - _Requirements: 17.3, 17.5, 17.6, 17.7_

  - [x] 3.2 Implement rate limiting service
    - Create in-process rate limiter with failure counter per client key
    - Implement `isLocked`, `registerFailure`, and `reset` functions
    - Lock client key for RATE_LIMIT_WINDOW_MIN after RATE_LIMIT_MAX failures
    - _Requirements: 18.1, 18.2, 18.3, 18.4, 18.5_

  - [x] 3.3 Implement authentication service with bcrypt
    - Create login function with email/password validation
    - Integrate bcrypt password comparison with stored hash
    - Implement rate limiting checks before credential verification
    - Return generic error message on invalid credentials (same message for unknown email or wrong password)
    - Reset rate limit counter on successful login
    - _Requirements: 17.2, 17.4, 17.8, 18.4, 20.1, 20.2_

  - [x] 3.4 Create Edge middleware for route protection
    - Create `middleware.ts` to guard `/admin/*` (except `/admin/login`) and mutating `/api/*` routes
    - Verify JWT from session cookie on protected routes
    - Redirect unauthenticated requests to `/admin/login` (pages) or return 401 (API)
    - Allow public GET requests to content API endpoints
    - _Requirements: 19.1, 19.2, 19.3, 19.4_

  - [x]* 3.5 Write property tests for authentication invariants
    - **Property 11: Auth guard**
    - **Validates: Requirements 19.1, 19.2, 19.3**
    - Generate random requests to protected routes without valid sessions and verify redirect/401 responses
    - **Property 12: Rate limit**
    - **Validates: Requirements 18.1, 18.2, 18.3, 18.4, 18.5**
    - Verify rate limiter locks after max failures and resets on success
    - **Property 13: Password secrecy**
    - **Validates: Requirements 20.1, 20.2**
    - Verify passwordHash never appears in any API response

  - [x] 3.6 Implement admin seeder script
    - Create script to seed single admin user from environment variables on first boot
    - Hash ADMIN_PASSWORD with bcrypt before storing
    - Check if admin already exists to prevent duplicate seeding
    - _Requirements: 36.3_

- [x] 4. File storage and upload services
  - [x] 4.1 Implement file validation utilities
    - Create validation functions for image types (jpg, jpeg, png, webp) and max 2MB size
    - Create validation function for PDF type and max 10MB size
    - Implement MIME type checking in addition to extension validation
    - Return structured error with code 'UPLOAD_REJECTED' on validation failure
    - _Requirements: 26.1, 26.2, 26.3_

  - [x] 4.2 Implement secure file storage service
    - Create `storeFile` function with sanitized filename generation (entity_timestamp.ext)
    - Implement path traversal prevention (verify resolved path is within upload directory)
    - Write files to `/uploads/<subfolder>/` on server filesystem
    - Return relative path `/uploads/<subfolder>/<filename>` for database storage
    - Create `deleteFile` function for cleanup (best-effort, safe if missing)
    - _Requirements: 27.1, 27.2, 27.3, 27.4_

  - [x]* 4.3 Write property tests for file upload invariants
    - **Property 8: File validation**
    - **Validates: Requirements 26.1, 26.2, 26.3**
    - Generate random files with various extensions and sizes, verify accept/reject logic
    - **Property 9: Path containment**
    - **Validates: Requirements 27.3**
    - Test path traversal attempts and verify all resolved paths stay within upload directory
    - **Property 10: No file in DB/Git**
    - **Validates: Requirements 27.4, 27.5**
    - Verify only relative path strings are stored in MongoDB, never binary data

- [x] 5. Validation schemas with Zod
  - [x] 5.1 Create validation schemas for content entities
    - Define Zod schemas for HeroSlide, AboutLab, News, ResearchArea, Project, Sponsor
    - Include field-level validation rules (required fields, string lengths, URL formats)
    - Export schemas for use in both client and server validation
    - _Requirements: 22.5_

  - [x] 5.2 Create validation schemas for people entities
    - Define Zod schemas for PrincipalInvestigator and Member
    - Validate role and status enums
    - Add optional field validation for contact links
    - _Requirements: 22.5_

  - [x] 5.3 Create discriminated validation schema for publications
    - Define base Publication schema with common fields
    - Create discriminated union for metadata validation by publicationType
    - Validate PI mandatory rule (separate from schema in service layer)
    - _Requirements: 22.5, 24.4, 24.5_

- [x] 6. Core business logic services
  - [x] 6.1 Implement slug generation service for research areas
    - Create `generateSlug` function that converts title to lowercase, hyphenated, URL-safe string
    - Check for slug uniqueness and append numeric suffix (-2, -3, etc.) on collision
    - Make slug generation deterministic for given title and existing set
    - _Requirements: 23.1, 23.2, 23.3_

  - [x]* 6.2 Write property test for slug generation
    - **Property 3: Slug uniqueness & safety**
    - **Validates: Requirements 23.1, 23.2, 23.3**
    - Generate random titles and verify all slugs are URL-safe, unique, and handle collisions correctly

  - [x] 6.3 Implement bidirectional publication-member synchronization service
    - Create `syncPublicationMembers` function with set difference logic for add/remove
    - Use MongoDB `$addToSet` and `$pull` bulk operations for atomic updates
    - Implement rollback/compensation on failure
    - Maintain invariant: `m._id ∈ p.linkedMembers ⟺ p._id ∈ m.publications`
    - _Requirements: 25.1, 25.2, 25.3, 25.4, 25.5, 25.6_

  - [x] 6.4 Implement member grouping algorithm
    - Create `groupMembers` function that groups PhD by displayOrder (no year grouping)
    - Group MTech/BTech/Intern by sessionYear descending with Ongoing/Completed subgroups
    - Handle members with missing sessionYear (place in "Unspecified" group)
    - Apply status filter while preserving grouping structure
    - _Requirements: 13.1, 13.2, 13.3, 13.4, 13.5_

  - [x]* 6.5 Write property test for member grouping
    - **Property 7: Member grouping**
    - **Validates: Requirements 13.1, 13.2, 13.3, 13.4**
    - Generate random member sets and verify grouping rules, no dropped/duplicated members

  - [x] 6.6 Implement publication validation with mandatory PI
    - Create `validatePublication` function checking PI is in authors array
    - Validate metadata shape matches publicationType using discriminated union
    - Return error with code 'PI_REQUIRED' if PI not in authors
    - Link author names to member IDs for matching names (case-insensitive)
    - _Requirements: 24.2, 24.3, 24.4, 24.5_

  - [x]* 6.7 Write property test for PI mandatory rule
    - **Property 5: PI mandatory**
    - **Validates: Requirements 24.2, 24.3**
    - Generate publications with and without PI, verify saves succeed/fail appropriately

  - [x] 6.8 Implement activity logging service
    - Create `logActivity` function to record create/update/delete actions
    - Store entity type, action type, human-readable label, and timestamp
    - Support querying recent activity for dashboard
    - _Requirements: 21.4, 21.5_

- [x] 7. Authentication API routes
  - [x] 7.1 Implement POST /api/auth/login endpoint
    - Accept email and password in request body
    - Validate non-empty fields (return 400 if missing)
    - Check rate limiting before credential verification (return 429 if locked)
    - Verify credentials with auth service and bcrypt
    - Issue JWT session cookie on success (return 200)
    - Return generic 401 error on invalid credentials
    - _Requirements: 17.1, 17.2, 17.3, 17.4, 17.8, 18.3_

  - [x] 7.2 Implement GET /api/auth/me endpoint
    - Check for valid session cookie
    - Return `{ authenticated: boolean }` status
    - Public endpoint (no authentication required)
    - _Requirements: 19.4_

  - [x] 7.3 Implement POST /api/auth/logout endpoint
    - Clear session cookie (set Max-Age=0)
    - Return success response
    - _Requirements: 17.7_

- [x] 8. Content management API routes (collections)
  - [x] 8.1 Implement Hero API routes (GET, POST, PUT, DELETE)
    - Create `/api/hero/route.ts` with GET (list all) and POST (create)
    - Create `/api/hero/[id]/route.ts` with PUT (update) and DELETE (delete)
    - Handle multipart/form-data for image upload
    - Validate with Zod schema and store image using file storage service
    - Revalidate 'hero' tag on mutations
    - _Requirements: 2.1, 22.1, 22.2, 22.4, 28.1_

  - [x] 8.2 Implement News API routes (GET, POST, PUT, DELETE)
    - Create CRUD routes for news with image upload support
    - Sort by date descending (newest first)
    - Handle optional externalLink field
    - Revalidate 'news' tag on mutations
    - _Requirements: 3.2, 4.1, 22.1, 22.2, 22.4, 28.1_

  - [x] 8.3 Implement Research Areas API routes with slug generation
    - Create CRUD routes with automatic slug generation on create
    - Support dynamic sections array (unlimited sections)
    - Handle linkedPublications references (ObjectId array)
    - Support feature image upload
    - Revalidate 'research' tag on mutations
    - _Requirements: 8.1, 9.1, 22.1, 22.2, 22.6, 22.7, 22.8, 23.1, 28.1_

  - [x] 8.4 Implement Projects API routes with pagination
    - Create CRUD routes for projects
    - Implement pagination for large datasets
    - Support rich-text description field
    - Revalidate 'projects' tag on mutations
    - _Requirements: 10.1, 10.2, 22.1, 22.2, 22.4, 28.1_

  - [x] 8.5 Implement Sponsors API routes
    - Create CRUD routes with logo upload support
    - Sort by displayOrder ascending
    - Revalidate 'sponsors' tag on mutations
    - _Requirements: 5.1, 11.1, 11.2, 22.1, 22.2, 22.4, 28.1_

  - [x] 8.6 Implement Members API routes with publication sync
    - Create CRUD routes with image and resume PDF upload
    - Trigger member-publication sync on delete (remove member from all publications)
    - Support search/filter by name and status
    - Revalidate 'members' tag on mutations
    - _Requirements: 13.6, 13.9, 14.1, 14.3, 14.4, 22.1, 22.2, 22.4, 25.3, 28.1_

  - [x] 8.7 Implement Publications API routes with member sync and PI validation
    - Create CRUD routes with PDF upload support
    - Filter by publicationType query parameter
    - Validate PI is in authors before saving
    - Trigger bidirectional member-publication sync on create/update/delete
    - Support author autocomplete via separate endpoint
    - Sort by year descending
    - Revalidate 'publications' tag on mutations
    - _Requirements: 16.1, 16.2, 16.4, 22.1, 22.2, 22.4, 24.2, 24.4, 24.5, 25.1, 25.5, 25.6, 28.1_

  - [x] 8.8 Implement Gallery API routes with category filter
    - Create CRUD routes with image upload
    - Support category filter (Research & Activities, Group Discussion)
    - Revalidate 'gallery' tag on mutations
    - _Requirements: 6.1, 6.2, 22.1, 22.2, 22.4, 28.1_

- [x] 9. Content management API routes (singletons)
  - [x] 9.1 Implement About Lab API routes (GET, PUT only)
    - Create singleton routes (no create/delete)
    - Support rich-text description field
    - Handle optional image upload
    - Revalidate 'about' tag on mutations
    - _Requirements: 22.1, 22.3, 28.1_

  - [x] 9.2 Implement Principal Investigator API routes (GET, PUT only)
    - Create singleton routes with 7 rich-text sections
    - Handle profile image upload
    - Support all contact link fields
    - Omit empty sections on public display
    - Revalidate 'pi' tag on mutations
    - _Requirements: 12.3, 12.4, 12.5, 12.6, 12.7, 22.1, 22.3, 28.1_

  - [x] 9.3 Implement Footer API routes (GET, PUT only)
    - Create singleton routes for copyright and developer credit
    - Handle optional developer URL (render as link if present)
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5, 7.6, 7.7, 22.1, 22.3, 28.1_

- [x] 10. Dashboard and auxiliary API routes
  - [x] 10.1 Implement Dashboard stats API endpoint
    - Create GET /api/dashboard/stats with aggregated counts
    - Return counts for: total members (by role), publications, research areas, projects, sponsors, gallery, news
    - Calculate total members as sum of PhD + MTech + BTech + Intern
    - Require authenticated session
    - _Requirements: 21.1_

  - [x] 10.2 Implement member suggestion API for author autocomplete
    - Create GET /api/members/suggest with query parameter
    - Return at most 10 members matching query (case-insensitive substring)
    - Include PI and all member roles in search
    - Order by match closeness (exact/prefix matches first)
    - _Requirements: 24.1_

  - [x] 10.3 Implement research publications lookup API
    - Create GET /api/research/[id]/publications to return populated publications
    - Resolve linkedPublications references
    - Filter out unresolved references
    - _Requirements: 9.2, 9.5_

- [x] 11. Checkpoint - Core backend complete
  - Ensure all tests pass, ask the user if questions arise.

- [x] 12. Global UI components and theme system
  - [x] 12.1 Set up ShadCN UI primitives
    - Install and configure required ShadCN components: Button, Dialog, Dropdown, Table, Form, Input, Textarea, Select
    - Configure Radix primitives with accessible patterns
    - Create component variants for different contexts (primary, secondary, destructive)
    - _Requirements: 34.1, 34.4_

  - [x] 12.2 Implement theme provider with next-themes
    - Create ThemeProvider component with class strategy
    - Set defaultTheme to "system" with localStorage persistence
    - Add inline script to prevent flash-of-wrong-theme
    - Create theme toggle control
    - Define light and dark mode CSS variables for all color tokens
    - _Requirements: 30.1, 30.2, 30.3_

  - [x] 12.3 Create motion system components with Framer Motion
    - Create ScrollReveal component for fade-up animations on viewport entry
    - Create TiltCard component for 3D hover effects (member, research, publication, sponsor cards)
    - Create PageTransition wrapper for route change animations
    - Implement `prefers-reduced-motion` detection to disable non-essential animations
    - _Requirements: 31.1, 31.2, 31.3, 31.4_

  - [x]* 12.4 Write unit tests for motion components
    - Test ScrollReveal triggers animation on viewport entry
    - Test TiltCard applies correct transform on hover
    - Test prefers-reduced-motion disables animations

  - [x] 12.5 Create responsive Navbar component
    - Build desktop horizontal navbar with hover dropdowns for Research, Publications, People
    - Build mobile hamburger menu with click dropdowns
    - Make navbar sticky across all viewport sizes
    - Structure menu: Home, Research (Areas/Projects/Sponsors), Publications (6 types), People (PI/Current Members/Alumni/Collaborators)
    - Implement smooth dropdown animations
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 1.8, 1.9, 29.1, 29.2, 29.3_

  - [x] 12.6 Create Footer component with developer credit
    - Render copyright text from Footer singleton
    - Render developer name and optional link
    - Open developer link in new tab with rel="noopener noreferrer" if URL present
    - Handle missing copyright or developer fields gracefully
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5, 7.6, 7.7_

  - [x] 12.7 Create empty state and fallback components
    - Create EmptyState component with customizable message
    - Create placeholder image component for missing media
    - Define empty state messages for all collections
    - _Requirements: 3.6, 4.7, 6.3, 8.7, 9.4, 10.4, 11.3, 13.9, 13.10, 14.8, 15.1, 15.2, 16.5, 35.1, 35.2_

- [x] 13. Public pages - Home page sections
  - [x] 13.1 Create Hero Carousel component (client component)
    - Implement carousel with exactly 3 active slides
    - Add auto-advance every 3000ms with single timer
    - Add Previous/Next manual controls with cyclic navigation
    - Pause autoplay on manual interaction
    - Render slide image, heading, subheading, CTA button with link
    - Initialize to index 0 on load
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7, 2.8, 2.9, 2.10_

  - [x]* 13.2 Write property tests for Hero Carousel
    - **Property 1: Hero count & index invariant**
    - **Validates: Requirements 2.1, 2.2, 2.3, 2.4, 2.5**
    - Verify index stays in [0, n) after any sequence of next/prev
    - **Property 2: Autoplay pause**
    - **Validates: Requirements 2.6, 6.4**
    - Verify manual navigation sets paused=true

  - [x] 13.3 Create About Lab and News Feed section
    - Fetch About singleton and News collection
    - Render two-column equal-height layout (desktop 768px+)
    - Display About heading and rich-text description
    - Display News items sorted by date descending (newest first), break ties by displayOrder ascending
    - Render News title, date, description (preserve rich-text formatting)
    - Show "Read More" button only when externalLink present (open in new tab with rel="noopener noreferrer")
    - Show empty state when no news items exist
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6_

  - [x] 13.4 Create Research Areas preview section
    - Fetch first 6 research areas sorted by displayOrder ascending
    - Display research cards with name, author, overview
    - Add "Read More" button navigating to /research/areas/[slug]
    - Add "Explore All Research Areas" button navigating to /research/areas
    - Apply 3D hover effect to cards
    - Show empty state when no research areas exist
    - _Requirements: 4.1, 4.2, 4.3, 4.7_

  - [x] 13.5 Create Principal Investigator preview section
    - Fetch PI singleton
    - Display profile image (with fallback if missing) and overview
    - Add "View Profile" button navigating to /people/principal-investigator
    - _Requirements: 4.4_

  - [x] 13.6 Create Projects preview section
    - Fetch first 6 projects sorted by displayOrder ascending
    - Display project cards with title and short overview only
    - Add "View All Projects" button navigating to /research/projects
    - Apply premium hover animation to cards
    - Show empty state when no projects exist
    - _Requirements: 4.5_

  - [x] 13.7 Create Members preview section
    - Fetch first 6 members sorted by displayOrder ascending
    - Display member cards with image, name, role
    - Apply 3D hover effect to cards
    - Add "View All Members" button navigating to /people/current-members
    - Show empty state when no members exist
    - _Requirements: 4.6_

  - [x] 13.8 Create Sponsors Marquee component (client component)
    - Render sponsors sorted by displayOrder ascending in horizontal strip
    - Implement continuous right-to-left scroll animation (loop seamlessly)
    - Pause scroll on hover
    - Disable scroll animation when prefers-reduced-motion is set
    - _Requirements: 5.1, 5.2, 5.3, 5.4_

  - [x] 13.9 Create Gallery component with lightbox (client component)
    - Implement filter buttons for "Research & Activities" and "Group Discussion" categories
    - Default to "Research & Activities" filter on load
    - Display only images matching selected category
    - Implement carousel with auto-advance every 2000ms (right-to-left)
    - Add Previous/Next manual controls
    - Pause autoplay on manual navigation
    - Show empty state when filtered category has no images
    - Implement fullscreen lightbox modal with Close, Previous, Next, Zoom controls
    - Support keyboard navigation in lightbox (Escape to close, arrows for prev/next)
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 6.6, 6.7, 6.8_

  - [x] 13.10 Assemble complete Home page
    - Create /app/(public)/page.tsx with all sections in order
    - Fetch all required data server-side for SEO
    - Hydrate client components (Hero, Marquee, Gallery)
    - Apply ScrollReveal animations to each section
    - _Requirements: 1.1, 2.1, 3.1, 4.1, 5.1, 6.1_

- [x] 14. Public pages - Research section
  - [x] 14.1 Create Research Areas listing page
    - Fetch all research areas sorted by displayOrder ascending
    - Implement client-side search filtering by research name, author name, overview (case-insensitive substring)
    - Display research cards with name, author, overview, "Read More" button
    - Navigate to /research/areas/[slug] on card click
    - Show "no results" message when search returns no matches
    - Show empty state when no research areas exist
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5, 8.6, 8.7_

  - [x] 14.2 Create Research Area detail page
    - Create dynamic route /app/(public)/research/areas/[slug]/page.tsx
    - Fetch research area by slug with populated linkedPublications
    - Render dynamic sections in ascending order (heading + content)
    - Display linked publications sorted by year descending
    - Show empty state for publications when none linked
    - Filter out unresolved publication references
    - Return 404 page if slug not found
    - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5_

  - [x] 14.3 Create Projects table page
    - Fetch all projects sorted by displayOrder ascending
    - Render table with columns: Project Title, Overview, Description, Objectives, Deliverables, Duration, Status
    - Implement pagination when project count exceeds 10 (10 rows per page)
    - Show empty state when no projects exist
    - _Requirements: 10.1, 10.2, 10.3, 10.4_

  - [x] 14.4 Create Sponsors page
    - Fetch all sponsors sorted by displayOrder ascending (break ties by name case-insensitive)
    - Display sponsor logo and name in grid layout
    - Use fallback placeholder when sponsor has no logo
    - Show empty state when no sponsors exist
    - _Requirements: 11.1, 11.2, 11.3_

- [x] 15. Public pages - People section
  - [x] 15.1 Create Principal Investigator profile page
    - Fetch PI singleton
    - Render header with name, designation, profile image (fallback if missing)
    - Render 7 rich-text sections: Overview, Research, Teaching, Publication, Education, Activities, Achievement
    - Omit sections that are empty or whitespace-only
    - Render contact links (email, website, Google Scholar, LinkedIn) when present
    - Omit contact links when absent
    - Open external links in new tab with rel="noopener noreferrer"
    - _Requirements: 12.1, 12.2, 12.3, 12.4, 12.5, 12.6, 12.7_

  - [x] 15.2 Create Current Members directory page
    - Fetch all members with grouping by role and year
    - Implement status filter buttons (Ongoing/Completed) - default to show all
    - Implement name search (case-insensitive substring match)
    - Group PhD members by displayOrder ascending (no year grouping)
    - Group MTech/BTech/Intern by sessionYear descending, then Ongoing before Completed, then by displayOrder
    - Place members with missing sessionYear in "Unspecified" group at end
    - Display member cards with image, name, role, year
    - Apply 3D hover effect to cards
    - Navigate to /people/current-members/[id] on card click
    - Show "no results" message when filter+search match no members
    - Show empty state when no members exist
    - _Requirements: 13.1, 13.2, 13.3, 13.4, 13.5, 13.6, 13.7, 13.8, 13.9, 13.10_

  - [x]* 15.3 Write property test for member grouping display
    - **Property 7: Member grouping**
    - **Validates: Requirements 13.1, 13.2, 13.3, 13.4**
    - Verify grouping preserves all members, orders correctly by role/year/status

  - [x] 15.4 Create Member profile page
    - Create dynamic route /app/(public)/people/current-members/[id]/page.tsx
    - Fetch member with populated publications
    - Render profile image (fallback if missing) and rich-text biography
    - Display resume download button only when resumePdf present
    - Render contact links (email, website, Google Scholar, GitHub, LinkedIn, Twitter/X) when present
    - Open external links in new tab with rel="noopener noreferrer"
    - Display publications sorted by year descending
    - Filter out unresolved publication references
    - Show empty state when member has no publications
    - _Requirements: 14.1, 14.2, 14.3, 14.4, 14.5, 14.6, 14.7, 14.8_

  - [x] 15.5 Create Alumni and Collaborators placeholder pages
    - Create /app/(public)/people/alumni/page.tsx with "Alumni information coming soon." message
    - Create /app/(public)/people/collaborators/page.tsx with "Collaborators will be updated soon." message
    - _Requirements: 15.1, 15.2, 37.3_

- [x] 16. Public pages - Publications section
  - [x] 16.1 Create publication table components
    - Create reusable PublicationTable component with TanStack Table
    - Support type-specific column configurations (Journal, Conference, Book Chapters, Patents)
    - Implement client-side search by paper title (case-insensitive)
    - Sort by year descending
    - Make title clickable: open externalLink if present, else pdfPath, else plain text
    - Open links in new tab with rel="noopener noreferrer"
    - Implement pagination when count exceeds one page
    - Show "No publications available" when type has no items
    - _Requirements: 16.1, 16.2, 16.3, 16.4, 16.5, 16.6_

  - [x]* 16.2 Write property test for publication ordering
    - **Property 6: Publication ordering**
    - **Validates: Requirements 16.2**
    - Generate random publication sets and verify year descending sort

  - [x] 16.3 Create Journal publications page
    - Fetch publications filtered by publicationType=Journal
    - Display table with columns: S.No, Authors, Paper Title (clickable), Journal Name, Year
    - _Requirements: 16.1, 16.2, 16.4_

  - [x] 16.4 Create Conference publications page
    - Fetch publications filtered by publicationType=Conference
    - Display table with columns: SN, Authors, Conference Title, Conference Name, Place & Date, Year
    - _Requirements: 16.1, 16.2, 16.4_

  - [x] 16.5 Create Book Chapters publications page
    - Fetch publications filtered by publicationType=BookChapter
    - Display table with columns: Authors, Title, Publisher, Year, Volume, Edition, Pages
    - _Requirements: 16.1, 16.2, 16.4_

  - [x] 16.6 Create Patents publications page
    - Fetch publications filtered by publicationType=Patent
    - Display table with columns: Authors, Title, Patent Type, Patent Number, Issued Date, Status
    - _Requirements: 16.1, 16.2, 16.4_

  - [x] 16.7 Create Datasets publications page
    - Fetch publications filtered by publicationType=Dataset
    - Render free-form content from metadata.body rich text
    - Show "No publications available" when empty
    - _Requirements: 16.1, 16.5_

  - [x] 16.8 Create Invited Talks publications page
    - Fetch publications filtered by publicationType=InvitedTalk
    - Render free-form content from metadata.body rich text
    - Show "No publications available" when empty
    - _Requirements: 16.1, 16.5_

- [x] 17. Checkpoint - Public pages complete
  - Ensure all tests pass, ask the user if questions arise.

- [x] 18. Admin CMS - Authentication and layout
  - [x] 18.1 Create admin login page
    - Create /app/admin/login/page.tsx (public, not in navbar)
    - Build login form with email and password fields
    - Validate non-empty fields client-side
    - Call POST /api/auth/login on submit
    - Display generic error message on 401 (invalid credentials)
    - Display rate limit message on 429 (too many attempts)
    - Redirect to /admin on successful login
    - _Requirements: 17.1, 17.4, 17.8, 18.3_

  - [x] 18.2 Create admin sidebar navigation
    - Build collapsible, responsive sidebar
    - Structure: Dashboard, Hero, About, News, Research (Areas/Projects/Sponsors), PI, Members, Publications (6 types), Gallery, Footer, Settings, Logout
    - Make sidebar dark-mode compatible
    - Highlight active route
    - _Requirements: 22.1_

  - [x] 18.3 Create admin layout with route protection
    - Create /app/admin/layout.tsx with sidebar
    - Client-side check for authentication status (redirect to /admin/login if not authenticated)
    - Render sidebar and content area
    - _Requirements: 19.1_

- [x] 19. Admin CMS - Dashboard
  - [x] 19.1 Create dashboard statistics cards
    - Fetch dashboard stats from GET /api/dashboard/stats
    - Display stat cards for: Total Members, PhD, MTech, BTech, Intern, Publications, Research Areas, Projects, Sponsors, Gallery Images, News Items
    - Calculate total members as sum of role counts
    - _Requirements: 21.1_

  - [x] 19.2 Create dashboard quick actions
    - Add quick-action buttons: Add Member, Add Publication, Add Research, Add News, Upload Gallery
    - Navigate to corresponding create/upload forms on button click
    - _Requirements: 21.2, 21.3_

  - [x] 19.3 Create dashboard recent activity feed
    - Fetch recent activity from ActivityLog (last 10 entries)
    - Display action type (create/update/delete), entity type, label, timestamp
    - Sort by timestamp descending (most recent first)
    - Show empty state when no activity recorded
    - _Requirements: 21.4, 21.5_

- [x] 20. Admin CMS - Content entity forms
  - [x] 20.1 Create Hero slides management page
    - Build CRUD interface for hero slides with image upload
    - Implement form with fields: image, heading, subheading, ctaText, ctaLink, displayOrder, isActive
    - Add drag-and-drop reordering
    - Display warning if active slide count ≠ 3
    - Validate with Zod schema before submission
    - Show field-level errors on 400 validation failure
    - _Requirements: 22.1, 22.2, 22.4, 22.5, 22.9, 28.2_

  - [x] 20.2 Create About Lab management page
    - Build singleton form (GET/PUT only, no create/delete)
    - Implement TipTap rich-text editor for description
    - Support optional image upload
    - Validate and show field-level errors
    - _Requirements: 22.1, 22.3, 22.5_

  - [x] 20.3 Create News & Events management page
    - Build CRUD interface with image upload
    - Implement form with fields: title, description (rich-text), date, image (optional), externalLink (optional), displayOrder
    - Add drag-and-drop reordering
    - Validate and show field-level errors
    - _Requirements: 22.1, 22.2, 22.4, 22.5_

  - [x] 20.4 Create Research Areas management page with dynamic sections
    - Build CRUD interface with feature image upload
    - Implement form with fields: title, authorName, overview, featureImage (optional), displayOrder
    - Add dynamic sections manager: allow unlimited sections with heading and content
    - Support add/edit/delete/reorder sections
    - Implement searchable multi-select for linkedPublications
    - Filter publications by title (case-insensitive substring)
    - Validate and show field-level errors
    - _Requirements: 22.1, 22.2, 22.4, 22.5, 22.6, 22.7, 22.8_

  - [x] 20.5 Create Projects management page
    - Build CRUD interface with rich-text editor
    - Implement form with fields: title, overview, description (rich-text), objectives (array), deliverables (array), duration, status, displayOrder
    - Add drag-and-drop reordering
    - Validate and show field-level errors
    - _Requirements: 22.1, 22.2, 22.4, 22.5_

  - [x] 20.6 Create Sponsors management page
    - Build CRUD interface with logo upload
    - Implement form with fields: sponsorLogo, sponsorName, displayOrder
    - Add drag-and-drop reordering
    - Validate and show field-level errors
    - _Requirements: 22.1, 22.2, 22.4, 22.5_

  - [x] 20.7 Create Gallery management page
    - Build CRUD interface with image upload
    - Implement form with fields: image, category (Research & Activities | Group Discussion), displayOrder
    - Add drag-and-drop reordering
    - Validate and show field-level errors
    - _Requirements: 22.1, 22.2, 22.4, 22.5_

  - [x] 20.8 Create Footer management page
    - Build singleton form (GET/PUT only)
    - Implement form with fields: copyrightText, developerName (default "Amit Kumar"), developerLink (default "https://amit-three.vercel.app/")
    - Validate and show field-level errors
    - _Requirements: 22.1, 22.3, 22.5_

- [x] 21. Admin CMS - People management
  - [x] 21.1 Create Principal Investigator management page
    - Build singleton form with profile image upload
    - Implement TipTap rich-text editors for 7 sections: Overview, Research, Teaching, Publication, Education, Activities, Achievement
    - Add fields: name, designation, image, email, website, scholarLink, linkedIn
    - Support Enter for new paragraph, Shift+Enter for new line in rich-text editors
    - Validate and show field-level errors
    - _Requirements: 22.1, 22.3, 22.5_

  - [x] 21.2 Create Members management page with library
    - Build CRUD interface with image and resume PDF upload
    - Implement form with required fields: name, displayOrder, role (PhD/MTech/BTech/Intern), status (Ongoing/Completed)
    - Add optional fields: sessionYear, image, resumePdf, biography (rich-text), email, website, scholar, github, linkedIn, twitterX
    - Build Members Library below form organized by role (PhD/MTech/BTech/Intern)
    - Implement search, filter, quick edit, status toggle, delete in library
    - Validate image (jpg/jpeg/png/webp, max 2MB) and PDF (max 10MB)
    - Show field-level errors on validation failure
    - _Requirements: 22.1, 22.2, 22.4, 22.5, 26.1, 26.2_

- [x] 22. Admin CMS - Publications management
  - [x] 22.1 Create Publications management page with tabbed interface
    - Build tabbed interface for 6 publication types: Journal, Conference, Book Chapters, Patents, Datasets, Invited Talks
    - Implement CRUD interface for each type
    - Add PDF upload and external link fields (both optional)
    - _Requirements: 22.1, 22.2, 22.4_

  - [x] 22.2 Implement author autocomplete with PI validation
    - Build author input field with autocomplete
    - Fetch suggestions from GET /api/members/suggest?q= when ≥2 characters entered
    - Display at most 10 suggestions (PI + members) matching query case-insensitively
    - Order suggestions by match closeness (exact/prefix first)
    - Make PI selection mandatory (show error if PI not in authors)
    - Link selected authors to member IDs for matching names
    - _Requirements: 24.1, 24.2, 24.3_

  - [x] 22.3 Implement discriminated metadata forms by publication type
    - Create Journal form: journalName, paperTitle (optional)
    - Create Conference form: conferenceName, placeDate
    - Create Book Chapter form: publisher, volume (optional), edition (optional), pages (optional)
    - Create Patent form: patentType, patentNumber, status, issuedDate (optional)
    - Create Dataset form: body (rich-text, free-form)
    - Create Invited Talk form: body (rich-text, free-form)
    - Validate metadata contains all required fields for selected publicationType
    - Show field-level errors when required fields missing or invalid fields present
    - _Requirements: 24.4, 24.5_

  - [x] 22.4 Integrate publications with member-publication sync
    - Trigger bidirectional sync on publication create/update/delete
    - Display loading state during sync operation
    - Show error message if sync fails (operation rolled back)
    - Ensure UI reflects sync completion before allowing next action
    - _Requirements: 25.1, 25.5, 25.6_

- [x] 23. SEO and metadata
  - [x] 23.1 Implement per-page metadata for all public routes
    - Define metadata objects for each public route with title, description, keywords
    - Add OpenGraph tags (og:title, og:description, og:image, og:url)
    - Add Twitter card tags (twitter:card, twitter:title, twitter:description, twitter:image)
    - Add canonical URL for each page
    - _Requirements: 32.1, 32.2_

  - [x] 23.2 Generate dynamic sitemap.xml
    - Create /app/sitemap.ts to enumerate all public routes
    - Include static routes (home, research, publications, people)
    - Include dynamic routes: research areas (by slug), members (by id)
    - Set appropriate priority and changefreq for each route type
    - _Requirements: 32.4_

  - [x] 23.3 Generate robots.txt
    - Create /app/robots.ts to allow public pages
    - Disallow /admin and all admin routes
    - Include sitemap URL
    - _Requirements: 32.5_

  - [x] 23.4 Ensure SEO-friendly slug URLs for research areas
    - Verify research area detail routes use /research/areas/[slug] format
    - Ensure slugs are generated on create (not query parameters)
    - _Requirements: 32.3_

- [x] 24. Performance optimizations
  - [x] 24.1 Configure Next.js Image optimization
    - Use Next.js Image component for all images
    - Configure responsive image sizes
    - Enable lazy loading for below-the-fold images
    - Set appropriate image quality and formats (WebP with fallback)
    - _Requirements: 33.2_

  - [x] 24.2 Implement code splitting for heavy components
    - Use dynamic imports for TipTap rich-text editor (admin only)
    - Use dynamic imports for TanStack Table (admin + public tables)
    - Use dynamic imports for Gallery lightbox component
    - Lazy load admin forms until route is accessed
    - _Requirements: 33.3_

  - [x] 24.3 Implement pagination for large lists
    - Add pagination to Projects table when count > 10 rows
    - Add pagination to Publications tables when count > 10 rows per type
    - Add pagination controls (next, previous, page numbers)
    - _Requirements: 10.3, 16.6, 33.4_

  - [x] 24.4 Configure revalidation and caching
    - Set up tag-based revalidation for all content entities
    - Call revalidateTag on successful mutations
    - Verify public pages reflect changes immediately without redeployment
    - _Requirements: 28.1_

  - [x]* 24.5 Write property test for revalidation freshness
    - **Property 16: Revalidation freshness**
    - **Validates: Requirements 28.1**
    - Verify content mutations trigger revalidation and public routes reflect changes

- [x] 25. Accessibility improvements
  - [x] 25.1 Implement keyboard navigation
    - Ensure all interactive elements are keyboard accessible (Tab navigation)
    - Add keyboard shortcuts for carousel navigation (arrow keys)
    - Support Enter/Space for button activation
    - Implement keyboard navigation for navbar dropdowns
    - Add Escape key to close modals and dropdowns
    - _Requirements: 34.1_

  - [x] 25.2 Add ARIA labels and semantic HTML
    - Add aria-label attributes to icon-only buttons and controls
    - Use semantic HTML elements (nav, main, article, section, footer)
    - Add alt text to all meaningful images
    - Mark decorative images with alt=""
    - Add aria-live regions for dynamic content updates
    - _Requirements: 34.2_

  - [x] 25.3 Implement visible focus indicators
    - Add visible focus ring to all interactive elements
    - Ensure focus styles have sufficient contrast
    - Use consistent focus indicator across all components
    - Do not remove outline without providing alternative focus indicator
    - _Requirements: 34.3_

  - [x] 25.4 Ensure accessible color contrast
    - Test all button states (hover, focus, active) for WCAG AA contrast
    - Verify text on colored backgrounds meets contrast requirements
    - Test theme colors in both light and dark modes
    - _Requirements: 34.4_

  - [x]* 25.5 Write unit tests for accessibility features
    - Test keyboard navigation on interactive components
    - Verify ARIA labels are present and correct
    - Test focus management in modals and dropdowns

- [x] 26. Responsive design validation
  - [x] 26.1 Test mobile layout (320px - 767px)
    - Verify single-column layout renders correctly
    - Test hamburger menu functionality
    - Verify touch targets are at least 44px
    - Test stacked cards and content sections
    - Ensure no horizontal overflow
    - _Requirements: 29.1, 29.4_

  - [x] 26.2 Test tablet layout (768px - 1024px)
    - Verify 2-column grids render correctly
    - Test condensed navigation
    - Verify responsive images scale appropriately
    - _Requirements: 29.2, 29.4_

  - [x] 26.3 Test desktop layout (1025px+)
    - Verify full multi-column layout
    - Test horizontal navigation with hover dropdowns
    - Verify hero carousel and gallery display correctly
    - Test admin CMS layout with sidebar
    - _Requirements: 29.3, 29.4_

- [x] 27. Error handling and edge cases
  - [x] 27.1 Implement empty state handling for all collections
    - Add empty states for research areas, publications, members, alumni, collaborators
    - Show specific messages per collection (e.g., "No publications available", "Alumni information coming soon.")
    - Verify empty states render instead of errors when collections are empty
    - _Requirements: 3.6, 4.7, 8.7, 9.4, 10.4, 11.3, 13.9, 13.10, 14.8, 15.1, 15.2, 16.5, 35.1_

  - [x]* 27.2 Write property test for empty state safety
    - **Property 14: Empty-state safety**
    - **Validates: Requirements 15.1, 15.2, 16.5, 35.1**
    - Verify empty collections render defined empty states, not errors

  - [x] 27.3 Implement media fallback handling
    - Use fallback placeholder image when entity image is missing
    - Hide download buttons when no PDF is present (members' resume, publications' PDF)
    - Verify external links open safely with rel="noopener noreferrer"
    - _Requirements: 14.4, 35.2, 35.3, 35.4_

  - [x]* 27.4 Write property test for missing PDF rule
    - **Property 15: Missing-PDF rule**
    - **Validates: Requirements 14.4, 35.3**
    - Verify download buttons are hidden when PDF path is absent

  - [x] 27.5 Implement 404 page for invalid routes
    - Create custom 404 page with navigation back to home
    - Handle invalid research area slugs (return 404)
    - Handle invalid member IDs (return 404)
    - _Requirements: 9.3_

  - [x] 27.6 Implement error boundaries for client components
    - Add React error boundaries around client component trees
    - Show user-friendly error messages on component failures
    - Log errors for debugging without exposing stack traces to users

- [x] 28. Testing and validation
  - [x]* 28.1 Write integration tests for authentication flow
    - Test login with valid credentials (success path)
    - Test login with invalid email (rejection)
    - Test login with invalid password (rejection)
    - Test rate limiting after 5 failed attempts
    - Test session expiry after TTL
    - Test protected route access without session (redirect/401)

  - [x]* 28.2 Write integration tests for file upload flow
    - Test valid image upload (jpg, png, webp under 2MB)
    - Test valid PDF upload (under 10MB)
    - Test rejection of oversized files
    - Test rejection of invalid file types
    - Test path sanitization and collision avoidance

  - [x]* 28.3 Write integration tests for publication-member sync
    - Test creating publication links members correctly
    - Test updating publication syncs member references
    - Test deleting publication removes references from members
    - Test sync rollback on failure

  - [x]* 28.4 Write end-to-end tests for critical user journeys
    - Test visitor journey: home → research areas → research detail → publications
    - Test visitor journey: home → people → member profile → publications
    - Test admin journey: login → dashboard → create member → create publication → verify sync
    - Test admin journey: upload hero image → verify appears on home page

- [x] 29. Deployment preparation
  - [x] 29.1 Configure PM2 process manager
    - Create ecosystem.config.js for PM2
    - Configure process name, instances, and restart policies
    - Set up environment variables loading
    - _Requirements: 36.1_

  - [x] 29.2 Create deployment scripts
    - Create build script for production
    - Create startup script for PM2
    - Create backup script for MongoDB + /uploads (weekly schedule)
    - _Requirements: 36.2_

  - [x] 29.3 Configure Nginx reverse proxy
    - Create Nginx configuration for HTTPS termination
    - Set up proxy_pass to Next.js port
    - Configure static file serving for /uploads
    - Set up SSL certificates
    - _Requirements: 36.1_

  - [x] 29.4 Create production environment setup guide
    - Document MongoDB setup and connection
    - Document environment variable configuration
    - Document first-time admin seeding process
    - Document backup and restore procedures
    - Document PM2 monitoring and logs
    - _Requirements: 36.1, 36.2, 36.3_

- [x] 30. Final checkpoint and documentation
  - [x] 30.1 Run full test suite
    - Execute all unit tests
    - Execute all property-based tests
    - Execute all integration tests
    - Execute all end-to-end tests
    - Verify all tests pass

  - [x] 30.2 Verify all requirements covered
    - Cross-reference all 37 requirements with implemented features
    - Test each acceptance criterion manually if not covered by automated tests
    - Document any deviations or known limitations

  - [x] 30.3 Create user documentation
    - Write admin user guide for CMS
    - Document content management workflows
    - Create troubleshooting guide
    - Document common tasks (add member, create publication, upload media)

  - [x] 30.4 Create developer documentation
    - Document architecture overview
    - Document data models and relationships
    - Document API endpoints and contracts
    - Document deployment process
    - Document local development setup

  - [x] 30.5 Perform final code review and cleanup
    - Remove unused dependencies and imports
    - Ensure consistent code formatting (Prettier)
    - Ensure no console.logs in production code
    - Verify all environment variables are documented
    - Check .gitignore completeness (uploads, .env.local, .next)

## Notes

- Tasks marked with `*` are optional testing tasks and can be skipped for faster MVP delivery
- Each task references specific requirements from `requirements.md` for traceability
- Implementation follows the technical design specified in `design.md`
- Property-based tests validate universal correctness properties using fast-check
- All file uploads are validated, sanitized, and stored on server filesystem (not in MongoDB or Git)
- Authentication uses JWT in HTTP-only cookies with rate limiting and bcrypt password hashing
- Bidirectional publication-member synchronization maintains referential integrity
- Content changes reflect instantly on public site through tag-based cache revalidation
- The platform supports exactly one administrator (scope boundary per Requirement 37)

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.1", "1.2", "1.3", "1.4"] },
    { "id": 1, "tasks": ["2.1", "2.2", "2.3", "2.4", "2.5", "2.6", "2.7"] },
    { "id": 2, "tasks": ["2.8", "3.1", "3.2", "3.3", "3.4", "4.1", "4.2", "5.1", "5.2", "5.3"] },
    { "id": 3, "tasks": ["3.5", "3.6", "4.3", "6.1", "6.3", "6.4", "6.6", "6.8"] },
    { "id": 4, "tasks": ["6.2", "6.5", "6.7", "7.1", "7.2", "7.3"] },
    { "id": 5, "tasks": ["8.1", "8.2", "8.3", "8.4", "8.5", "9.1", "9.2", "9.3", "10.1", "10.2", "10.3"] },
    { "id": 6, "tasks": ["8.6", "8.7", "8.8"] },
    { "id": 7, "tasks": ["12.1", "12.2", "12.3", "12.5", "12.6", "12.7"] },
    { "id": 8, "tasks": ["12.4", "13.1", "13.3", "13.4", "13.5", "13.6", "13.7", "13.8", "13.9"] },
    { "id": 9, "tasks": ["13.2", "13.10", "14.1", "14.2", "14.3", "14.4"] },
    { "id": 10, "tasks": ["15.1", "15.2", "15.4", "15.5", "16.1"] },
    { "id": 11, "tasks": ["15.3", "16.2", "16.3", "16.4", "16.5", "16.6", "16.7", "16.8"] },
    { "id": 12, "tasks": ["18.1", "18.2", "18.3"] },
    { "id": 13, "tasks": ["19.1", "19.2", "19.3", "20.1", "20.2", "20.3", "20.4", "20.5", "20.6", "20.7", "20.8"] },
    { "id": 14, "tasks": ["21.1", "21.2", "22.1", "22.2", "22.3"] },
    { "id": 15, "tasks": ["22.4", "23.1", "23.2", "23.3", "23.4"] },
    { "id": 16, "tasks": ["24.1", "24.2", "24.3", "24.4"] },
    { "id": 17, "tasks": ["24.5", "25.1", "25.2", "25.3", "25.4"] },
    { "id": 18, "tasks": ["25.5", "26.1", "26.2", "26.3"] },
    { "id": 19, "tasks": ["27.1", "27.3", "27.5", "27.6"] },
    { "id": 20, "tasks": ["27.2", "27.4", "28.1", "28.2", "28.3", "28.4"] },
    { "id": 21, "tasks": ["29.1", "29.2", "29.3", "29.4"] },
    { "id": 22, "tasks": ["30.1", "30.2", "30.3", "30.4", "30.5"] }
  ]
}
```
