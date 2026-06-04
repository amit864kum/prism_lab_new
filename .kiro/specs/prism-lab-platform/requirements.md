# Requirements Document

## Introduction

The Prism Lab IIT Patna Web Platform is a full-stack academic research lab website paired with a single-admin Content Management System (CMS), implemented as one Next.js 14 (App Router) TypeScript project backed by MongoDB (via Mongoose), with all media stored on the server filesystem under `/uploads`.

The platform has two surfaces sharing one codebase and database:

- A **Public Site**: a premium, SEO-optimized, responsive, animated, read-only website that showcases research areas, projects, sponsors, the Principal Investigator, members, publications, news, and a gallery.
- An **Admin CMS**: a JWT-protected dashboard at `/admin/*` through which a single admin performs full CRUD on every content element, uploads media, reorders content, and links entities. Content changes appear on the public site immediately without redeployment.

These requirements are derived from the approved design document (`design.md`) and the source PRD/SRS (`PRD.md`). They are written so that the 16 Correctness Properties defined in the design (Section "Correctness Properties") map back to the specific acceptance-criteria IDs below. EARS patterns and INCOSE quality rules are applied throughout. Each requirement is solution-focused on observable behavior; implementation choices remain in the design.

## Glossary

### Systems and Components

- **Platform**: The complete Prism Lab IIT Patna Web Platform (public site + admin CMS + backing services).
- **Public_Site**: The read-only public-facing website surface.
- **Admin_CMS**: The authenticated content-management surface served under `/admin/*`.
- **Navbar**: The sticky, responsive global navigation component on the Public_Site.
- **Hero_Carousel**: The home-page hero image carousel client component.
- **Gallery_Module**: The home-page gallery carousel and fullscreen lightbox.
- **Sponsor_Marquee**: The continuously-scrolling sponsor logo strip on the home page.
- **Research_List**: The Research Areas listing page (`/research/areas`).
- **Research_Detail**: A single Research Area page (`/research/areas/[slug]`).
- **Members_Directory**: The Current Members page (`/people/current-members`) and its grouping/filtering logic.
- **Member_Profile**: An individual member profile page (`/people/current-members/[id]`).
- **Publications_Page**: Any of the six publication listing pages under `/publications/*`.
- **Authentication_Service**: The server-side login/session component handling credential verification and session issuance.
- **Rate_Limiter**: The component that counts failed logins and enforces lockout.
- **Route_Guard**: The Edge middleware that protects admin pages and mutating API routes.
- **Dashboard**: The admin overview page at `/admin` (stats, quick actions, recent activity).
- **File_Storage_Service**: The server component that validates, sanitizes, renames, and writes uploaded files to disk.
- **Slug_Generator**: The component that derives URL-safe, unique slugs for research areas.
- **Publication_Service**: The component handling publication validation, author linking, and member synchronization.
- **Member_Sync_Service**: The component that keeps `publication.linkedMembers` and `member.publications` mutually consistent.
- **Theme_Manager**: The light/dark theme provider with persistence.
- **Motion_System**: The Framer Motion animation layer (scroll reveal, card hover, transitions).
- **SEO_Module**: The metadata, sitemap, and robots generation layer.
- **Backup_Service**: The scheduled backup routine for MongoDB and `/uploads`.
- **Admin_Seeder**: The first-boot routine that creates the single admin user from environment variables.

### Domain Terms

- **PI / Principal_Investigator**: The faculty member in charge of the lab; a singleton content record.
- **Member**: A lab member with a Role and a Status.
- **Role**: One of `PhD`, `MTech`, `BTech`, `Intern`.
- **Status**: One of `Ongoing`, `Completed`.
- **Session_Year**: A member's year string (e.g., `2024`) used for year grouping of non-PhD members.
- **Display_Order**: An admin-assigned integer that controls manual sort position of items within a list.
- **Publication**: A research output of one of six Publication_Types.
- **Publication_Type**: One of `Journal`, `Conference`, `BookChapter`, `Patent`, `Dataset`, `InvitedTalk`.
- **Linked_Publications**: Publications attached to a Research Area for display on its detail page.
- **Linked_Members**: The member references stored on a publication that drive profile back-links.
- **Authors**: The free-text, display-ordered author names on a publication (may include external co-authors).
- **Slug**: The URL-safe, lowercase identifier for a Research Area.
- **Singleton_Entity**: A content record with exactly one logical instance (About, PI, Footer).
- **Empty_State**: A defined placeholder message shown when a collection has no items.
- **Revalidation**: Tag-based cache invalidation that refreshes a public route after an admin mutation.
- **Upload_Subfolder**: One of `hero`, `members`, `pi`, `research`, `publications`, `sponsors`, `gallery`, `resumes`, `news`.
- **Session_TTL**: The configured JWT session lifetime (default 24 hours).
- **Rate_Limit_Max**: The configured maximum consecutive failed logins (default 5).
- **Rate_Limit_Window**: The configured lockout duration after exceeding Rate_Limit_Max (default 15 minutes).

## Requirements

### Requirement 1: Global Navigation and Layout

**User Story:** As a visitor, I want consistent, structured navigation across the site, so that I can reach any public section quickly on any device.

#### Acceptance Criteria

1. THE Navbar SHALL present top-level destinations Home, Research, Publications, and People on every Public_Site page.
2. THE Navbar SHALL expose the Research group with links to Areas, Projects, and Sponsors.
3. THE Navbar SHALL expose the Publications group with links to Journal, Conference, Book Chapters, Patents, Datasets, and Invited Talks.
4. THE Navbar SHALL expose the People group with links to Principal Investigator, Current Members, Alumni, and Collaborators.
5. WHILE a visitor scrolls a page in any direction, THE Navbar SHALL remain fixed and visible at the top of the viewport regardless of scroll position.
6. WHERE the viewport width is 1025px or greater, THE Navbar SHALL reveal a group's submenu when the pointer hovers the group control or when keyboard focus enters the group control, and SHALL hide the submenu once the pointer leaves and keyboard focus exits both the group control and its submenu.
7. WHERE the viewport width is 1024px or less, THE Navbar SHALL present a hamburger control that toggles a menu revealing the group submenus on activation, and SHALL collapse the menu when the hamburger control is activated again or when a navigation link is selected.
8. WHEN the visitor activates a navigation link, THE Navbar SHALL navigate to that link's destination page.
9. THE Navbar SHALL exclude any link to the Admin_CMS or its login page.

### Requirement 2: Home Page Hero Carousel

**User Story:** As a visitor, I want an engaging hero carousel on the home page, so that I immediately understand the lab's research identity.

#### Acceptance Criteria

1. THE Hero_Carousel SHALL render exactly the hero slides marked active, ordered by Display_Order ascending.
2. THE Hero_Carousel SHALL display exactly one slide at any given time, with the current index always within the range from 0 up to (but not including) the active slide count.
3. WHEN the visitor activates the Next control, THE Hero_Carousel SHALL advance the index cyclically so that advancing past the last slide returns to the first.
4. WHEN the visitor activates the Previous control, THE Hero_Carousel SHALL move the index cyclically so that moving before the first slide returns to the last.
5. WHILE autoplay is active and more than one slide exists, THE Hero_Carousel SHALL auto-advance to the next slide every 3000 milliseconds using at most one active timer.
6. WHEN the visitor activates the Next or Previous control, THE Hero_Carousel SHALL pause autoplay so that no auto-advance occurs for the remainder of the current page session.
7. THE Hero_Carousel SHALL render the currently displayed slide's image, heading, subheading, and call-to-action control.
8. WHEN the home page finishes loading, THE Hero_Carousel SHALL set the current index to 0.
9. WHERE more than one active slide exists, WHEN the home page finishes loading, THE Hero_Carousel SHALL set autoplay active.
10. WHEN the visitor activates the displayed slide's call-to-action control, THE Hero_Carousel SHALL navigate to that slide's configured destination.

### Requirement 3: Home Page About and News Section

**User Story:** As a visitor, I want to read about the lab and see recent news together, so that I can understand the lab's mission and latest activity.

#### Acceptance Criteria

1. WHERE the viewport width is 768px or greater, THE Public_Site SHALL render the About content (heading and rich description) and the News feed as two side-by-side columns of equal height on the home page.
2. THE Public_Site SHALL order News items on the home page by date in descending order so the newest item appears first, and SHALL break ties between items sharing the same date by Display_Order ascending.
3. THE Public_Site SHALL render each News item's title, date, and description, preserving the description's rich-text formatting.
4. WHERE a News item has an external link, THE Public_Site SHALL render a "Read More" control opening that link in a new tab with `rel="noopener noreferrer"`.
5. WHERE a News item has no external link, THE Public_Site SHALL omit the "Read More" control for that item.
6. WHILE no News items exist, THE Public_Site SHALL render the defined Empty_State placeholder message in the News column instead of an empty region or an error.

### Requirement 4: Home Page Preview Sections

**User Story:** As a visitor, I want concise previews of research, the PI, projects, and members on the home page, so that I can explore deeper sections I care about.

#### Acceptance Criteria

1. THE Public_Site SHALL render a research-areas preview showing at most 6 research cards ordered by Display_Order ascending, each displaying the research name, author name, and overview.
2. WHEN the visitor activates a research card's "Read More" control, THE Public_Site SHALL navigate to that area's `/research/areas/[slug]` page.
3. WHEN the visitor activates "Explore All Research Areas", THE Public_Site SHALL navigate to `/research/areas`.
4. THE Public_Site SHALL render a Principal Investigator preview with profile image and overview, and a "View Profile" control navigating to `/people/principal-investigator`.
5. THE Public_Site SHALL render a projects preview showing at most 6 project cards ordered by Display_Order ascending, each displaying the project title and short overview only, with a "View All Projects" control navigating to `/research/projects`.
6. THE Public_Site SHALL render a members preview showing at most 6 member cards ordered by Display_Order ascending, each displaying the member's image, name, and role, with a "View All Members" control navigating to `/people/current-members`.
7. WHILE a home-page preview collection (research areas, projects, or members) contains no items, THE Public_Site SHALL render that section's defined Empty_State message in place of its cards.

### Requirement 5: Home Page Sponsors Marquee

**User Story:** As a visitor, I want to see lab sponsors presented prominently, so that I can recognize the lab's funding and partnerships.

#### Acceptance Criteria

1. THE Sponsor_Marquee SHALL render each sponsor's logo and name in a single horizontal strip ordered by Display_Order ascending.
2. WHILE no pointer hovers the strip, THE Sponsor_Marquee SHALL scroll the strip continuously from right to left, looping so that the last sponsor is immediately followed by the first with no blank gap and no visible position jump at the loop boundary.
3. WHILE a pointer hovers the strip, THE Sponsor_Marquee SHALL pause its movement and retain the current scroll position so that no position jump occurs when movement resumes.
4. WHERE the visitor's system requests reduced motion, THE Sponsor_Marquee SHALL present the sponsor logos and names as a static, non-scrolling strip.

### Requirement 6: Home Page Gallery and Lightbox

**User Story:** As a visitor, I want to browse the lab's gallery and view images full screen, so that I can experience the lab's activities visually.

#### Acceptance Criteria

1. THE Gallery_Module SHALL provide filter controls for the "Research & Activities" and "Group Discussion" categories, with the "Research & Activities" category selected as the default filter on initial load.
2. WHEN the visitor selects a category filter, THE Gallery_Module SHALL display only images belonging to that category.
3. WHILE the selected category contains no images, THE Gallery_Module SHALL render a defined Empty_State placeholder message in place of the carousel.
4. WHILE autoplay is active and more than one image exists in the selected category, THE Gallery_Module SHALL auto-advance the carousel by one image from right to left every 2000 milliseconds using at most one active timer, returning to the first image after the last.
5. WHEN the visitor performs any manual navigation, THE Gallery_Module SHALL pause autoplay so that no auto-advance occurs until autoplay is resumed.
6. WHEN the visitor selects a gallery image, THE Gallery_Module SHALL open a fullscreen lightbox that displays the selected image and provides a Close control returning to the gallery view, a Previous control, a Next control, and a Zoom control.
7. WHEN the visitor activates the lightbox Previous or Next control, THE Gallery_Module SHALL display the adjacent image within the currently filtered category, cycling from the last image to the first when advancing past the last and from the first image to the last when moving before the first.
8. WHEN the visitor activates the lightbox Zoom control, THE Gallery_Module SHALL toggle the displayed image between its fitted view and a magnified view.

### Requirement 7: Footer and Developer Credit

**User Story:** As a visitor, I want a consistent footer with attribution, so that I see copyright and the developer credit on every page.

#### Acceptance Criteria

1. THE Public_Site SHALL render the Footer Singleton_Entity's copyright text on every public page.
2. WHERE the Footer Singleton_Entity's copyright text is empty, THE Public_Site SHALL omit the copyright text while still rendering the footer.
3. THE Public_Site SHALL render the developer credit text with the Footer Singleton_Entity's stored developer name.
4. WHERE the Footer Singleton_Entity has no stored developer name, THE Public_Site SHALL omit the developer credit text.
5. WHERE the Footer Singleton_Entity has a stored developer URL, THE Public_Site SHALL render the developer credit as a link to that URL.
6. WHEN the visitor activates the developer credit link, THE Public_Site SHALL open the stored developer URL in a new tab with `rel="noopener noreferrer"`.
7. WHERE the Footer Singleton_Entity has no stored developer URL, THE Public_Site SHALL render the developer credit text without a link.

### Requirement 8: Research Areas Listing

**User Story:** As a visitor, I want to browse and search all research areas, so that I can find the research domain relevant to me.

#### Acceptance Criteria

1. THE Research_List SHALL render one card per research area ordered by Display_Order ascending, each showing research name, author name, and overview.
2. THE Research_List SHALL provide a search control that filters the displayed research areas by matching the entered term against each area's research name, author name, and overview.
3. WHEN the visitor enters a search term, THE Research_List SHALL display only research areas whose research name, author name, or overview contains the entered term, trimmed of leading and trailing whitespace, as a case-insensitive substring.
4. WHEN the visitor activates a card's "Read More" control, THE Research_List SHALL navigate to that area's `/research/areas/[slug]` page.
5. WHEN the visitor clears the search term so that it is empty or contains only whitespace, THE Research_List SHALL display all research areas ordered by Display_Order ascending.
6. IF the entered search term matches no research area, THEN THE Research_List SHALL render a no-results message indicating that no research areas match the search.
7. WHILE no research area records exist, THE Research_List SHALL render an Empty_State message indicating that research areas are not yet available.

### Requirement 9: Research Area Detail

**User Story:** As a visitor, I want a detailed research area page with structured sections and related publications, so that I can study the research and its outputs.

#### Acceptance Criteria

1. THE Research_Detail SHALL render each of the research area's dynamic sections in ascending stored order, displaying each section's heading and content.
2. THE Research_Detail SHALL render each of the research area's Linked_Publications, dereferenced from the publications collection, showing each publication's title ordered by year in descending order.
3. IF the requested slug matches no research area, THEN THE Public_Site SHALL render a 404 not-found page.
4. WHILE a research area has no Linked_Publications, THE Research_Detail SHALL render the defined Empty_State message in place of the publications list.
5. IF a Linked_Publication reference does not resolve to an existing publication, THEN THE Research_Detail SHALL omit that reference from the rendered publications list.

### Requirement 10: Projects Page

**User Story:** As a visitor, I want to view the lab's projects in a structured table, so that I can understand ongoing and completed work.

#### Acceptance Criteria

1. THE Public_Site SHALL render the projects page as a table with columns Project Title, Overview, Description, Objectives, Deliverables, Duration, and Status, with each row presenting that project's values under the named columns.
2. THE Public_Site SHALL order project rows by Display_Order ascending, breaking ties between equal Display_Order values by Project Title in case-insensitive ascending order.
3. WHERE the project count exceeds 10, THE Public_Site SHALL paginate the table into pages of at most 10 rows and provide controls to navigate to the next, previous, and a specific page.
4. WHILE no project records exist, THE Public_Site SHALL render the defined Empty_State message in place of the table.

### Requirement 11: Sponsors Page

**User Story:** As a visitor, I want a dedicated sponsors page, so that I can review all sponsors of the lab.

#### Acceptance Criteria

1. THE Public_Site SHALL render each sponsor's logo and name on the sponsors page ordered by Display_Order ascending, breaking ties between equal Display_Order values by sponsor name in case-insensitive ascending order.
2. IF a sponsor has no stored logo, THEN THE Public_Site SHALL render the fallback placeholder image in place of the logo while still rendering the sponsor name.
3. WHILE no sponsor records exist, THE Public_Site SHALL render the defined Empty_State message in place of the sponsor list.

### Requirement 12: Principal Investigator Profile Page

**User Story:** As a visitor, I want a detailed PI profile, so that I can learn about the faculty leading the lab.

#### Acceptance Criteria

1. THE Public_Site SHALL render the PI header with the PI's name, designation, and profile image.
2. IF the PI has no profile image, THEN THE Public_Site SHALL render the fallback placeholder image in the PI header.
3. THE Public_Site SHALL render the PI's rich-text sections Overview, Research, Teaching, Publication, Education, Activities, and Achievement in that order, displaying each section's content with its rich-text formatting preserved.
4. WHERE a PI rich-text section contains no text content (empty or whitespace only), THE Public_Site SHALL omit that section from the rendered page.
5. WHERE a PI contact link (email, website, Google Scholar, LinkedIn) is present, THE Public_Site SHALL render the corresponding contact link.
6. WHERE a PI contact link (email, website, Google Scholar, LinkedIn) is absent, THE Public_Site SHALL omit that contact link.
7. WHEN the visitor activates a present website, Google Scholar, or LinkedIn link, THE Public_Site SHALL open that link's URL in a new tab with `rel="noopener noreferrer"`.

### Requirement 13: Current Members Grouping, Filtering, and Search

**User Story:** As a visitor, I want members organized by role and year with filtering and search, so that I can find specific members easily.

#### Acceptance Criteria

1. THE Members_Directory SHALL display PhD members ordered by Display_Order ascending with no year grouping, breaking ties between equal Display_Order values by member name in case-insensitive ascending order.
2. THE Members_Directory SHALL group MTech, BTech, and Intern members by Session_Year in descending order, and within each year present the Ongoing subgroup before the Completed subgroup, ordering members within each subgroup by Display_Order ascending with ties broken by member name in case-insensitive ascending order.
3. THE Members_Directory SHALL preserve every member exactly once across grouping, neither dropping nor duplicating any member, except those removed by an active status filter.
4. WHERE a non-PhD member has no Session_Year (empty or whitespace only), THE Members_Directory SHALL place that member in an "Unspecified" group rendered after all Session_Year groups.
5. WHEN the visitor selects the Ongoing or Completed filter, THE Members_Directory SHALL display only members whose Status matches the selected filter while preserving the role and year grouping.
6. WHEN the visitor enters a name search term, THE Members_Directory SHALL display only members whose name contains the entered term, trimmed of leading and trailing whitespace, as a case-insensitive substring, combined with any active status filter.
7. WHEN the visitor selects a member card, THE Members_Directory SHALL navigate to that member's `/people/current-members/[id]` profile page.
8. WHEN the Members_Directory is loaded, THE Members_Directory SHALL display all members with no status filter active.
9. IF the active status filter and name search term together match no member, THEN THE Members_Directory SHALL render a no-results message indicating that no members match the current filter and search.
10. WHILE no member records exist, THE Members_Directory SHALL render the defined Empty_State message in place of the member groups.

### Requirement 14: Member Profile Page

**User Story:** As a visitor, I want an individual member profile with links and publications, so that I can learn about a member and their work.

#### Acceptance Criteria

1. THE Member_Profile SHALL render the member's profile image and biography, preserving the biography's rich-text formatting.
2. THE Member_Profile SHALL render the member's publications, dereferenced from the member's publication references, showing each publication's title ordered by year in descending order, omitting any reference that does not resolve to an existing publication.
3. WHERE the member has an uploaded resume PDF, THE Member_Profile SHALL render a resume download control.
4. IF the member has no resume PDF, THEN THE Member_Profile SHALL omit the resume download control.
5. IF the member has no profile image, THEN THE Member_Profile SHALL render the fallback placeholder image.
6. WHERE a member contact link (email, website, Google Scholar, GitHub, LinkedIn, Twitter/X) is present, THE Member_Profile SHALL render the corresponding contact link, opening external links in a new tab with `rel="noopener noreferrer"`.
7. WHERE a member contact link (email, website, Google Scholar, GitHub, LinkedIn, Twitter/X) is absent, THE Member_Profile SHALL omit that contact link.
8. WHILE the member has no resolvable publications, THE Member_Profile SHALL render the defined Empty_State message in place of the publications list.

### Requirement 15: Alumni and Collaborators Empty States

**User Story:** As a visitor, I want clear placeholder pages for Alumni and Collaborators, so that I understand these sections are forthcoming rather than broken.

#### Acceptance Criteria

1. WHILE no alumni records exist, THE Public_Site SHALL render the message "Alumni information coming soon." on the alumni page.
2. WHILE no collaborator records exist, THE Public_Site SHALL render the message "Collaborators will be updated soon." on the collaborators page.

### Requirement 16: Publications Listing Pages

**User Story:** As a visitor, I want publications organized by type, sorted and searchable, so that I can find specific research outputs.

#### Acceptance Criteria

1. THE Publications_Page SHALL render Journal, Conference, Book Chapters, and Patents as tables with their type-specific columns, and render Datasets and Invited Talks as free-form content.
2. THE Publications_Page SHALL order publications by year in descending order on every publication view.
3. THE Publications_Page SHALL provide a search control that filters publications by paper title.
4. WHEN a publication title is activated, THE Publications_Page SHALL open the publication's external link if present, otherwise open its uploaded PDF if present, otherwise render the title as plain text.
5. WHILE a publication type has no items, THE Publications_Page SHALL render the message "No publications available".
6. WHERE the publication count for a type exceeds one page, THE Publications_Page SHALL paginate the table.

### Requirement 17: Admin Authentication and Login

**User Story:** As the lab admin, I want a secure, hidden login, so that only I can access the content management system.

#### Acceptance Criteria

1. THE Admin_CMS SHALL serve the login page at `/admin/login` and exclude it from public navigation.
2. WHEN a login request is submitted with a non-empty email and a non-empty password, THE Authentication_Service SHALL determine a match by comparing the submitted email to the stored admin email and verifying the submitted password against the stored bcrypt hash.
3. WHEN submitted credentials match the stored admin, THE Authentication_Service SHALL issue a signed JWT session stored in an HTTP-only cookie and return an HTTP 200 success response.
4. IF submitted credentials do not match the stored admin, THEN THE Authentication_Service SHALL reject the request with a generic message indicating the credentials are invalid and an HTTP 401 status, issue no session, and return an identical response whether the email is unknown or the password is incorrect.
5. WHEN a JWT session is issued, THE Authentication_Service SHALL set it to expire 24 hours after the time of issuance per the configured Session_TTL.
6. IF a request presents a session token whose expiry has passed, THEN THE Authentication_Service SHALL reject the token as invalid and SHALL NOT establish an authenticated session until valid credentials are resubmitted.
7. THE Authentication_Service SHALL store the JWT only in an HTTP-only cookie and SHALL NOT expose it to client-side JavaScript storage.
8. IF a login request is submitted with a missing or empty email or a missing or empty password, THEN THE Authentication_Service SHALL reject the request with an HTTP 400 status and field-level error details, and SHALL NOT perform password verification.

### Requirement 18: Login Rate Limiting

**User Story:** As the lab admin, I want repeated failed logins to be throttled, so that the account is protected against brute-force attacks.

#### Acceptance Criteria

1. WHEN a login attempt for a client key fails, THE Rate_Limiter SHALL increment that client key's consecutive failure count.
2. WHEN a client key reaches Rate_Limit_Max (5) consecutive failed attempts, THE Rate_Limiter SHALL lock that client key for the Rate_Limit_Window of 15 minutes.
3. IF a login is attempted while a client key is locked, THEN THE Authentication_Service SHALL reject the attempt with an HTTP 429 status and the message "Too many failed attempts. Please try again later." without reading the credentials store.
4. WHEN a login attempt for a client key succeeds, THE Rate_Limiter SHALL reset that client key's failure count.
5. WHEN the Rate_Limit_Window elapses for a locked client key, THE Rate_Limiter SHALL clear the lock for that client key.

### Requirement 19: Admin Route Protection

**User Story:** As the lab admin, I want all admin pages and content-mutating endpoints protected, so that unauthenticated users cannot view or change content.

#### Acceptance Criteria

1. IF a request targets an `/admin/*` page other than `/admin/login` without a valid session, THEN THE Route_Guard SHALL redirect the request to `/admin/login`.
2. IF a mutating API request (POST, PUT, or DELETE) or an admin-only API read is made without a valid session, THEN THE Route_Guard SHALL respond with an HTTP 401 status.
3. THE Route_Guard SHALL allow `/admin/login` and the login API endpoint to be reached without a session.
4. THE Route_Guard SHALL allow unauthenticated GET requests to public content API endpoints.

### Requirement 20: Password and Secret Secrecy

**User Story:** As the lab admin, I want credentials and secrets kept confidential, so that the system is not compromised through leaked data or source code.

#### Acceptance Criteria

1. THE Platform SHALL exclude the admin password hash from every API response returned to the client.
2. THE Platform SHALL store the admin password only as a bcrypt hash and SHALL NOT store or log the plaintext password.
3. THE Platform SHALL read the database connection string, JWT secret, and admin credentials from environment variables and SHALL NOT embed them in client-side code.

### Requirement 21: Admin Dashboard

**User Story:** As the lab admin, I want a dashboard overview, so that I can see content statistics, jump to common actions, and review recent changes.

#### Acceptance Criteria

1. WHEN the Dashboard is loaded, THE Dashboard SHALL display counts equal to the number of currently stored records for each of total members, PhD members, MTech members, BTech members, Intern members, total publications, research areas, projects, sponsors, gallery images, and news items, where the total members count equals the sum of the PhD, MTech, BTech, and Intern member counts.
2. THE Dashboard SHALL provide quick-action controls for Add Member, Add Publication, Add Research, Add News, and Upload Gallery.
3. WHEN the admin activates a quick-action control, THE Dashboard SHALL navigate to the corresponding create or upload form for that entity (Add Member, Add Publication, Add Research, Add News, or Upload Gallery).
4. THE Dashboard SHALL display a recent-activity list of at most the 10 most recent create, update, and delete actions across content entities, ordered by action time in descending order so the most recent action appears first, with each entry indicating the action type (create, update, or delete), the affected content entity type, and the action's date and time.
5. WHILE no create, update, or delete action has been recorded across content entities, THE Dashboard SHALL render the defined Empty_State message in place of the recent-activity list.

### Requirement 22: Admin Content Management (CRUD, Upload, Reorder)

**User Story:** As the lab admin, I want full management of every content section, so that I can keep the website current without developer involvement.

#### Acceptance Criteria

1. THE Admin_CMS SHALL provide management modules for Hero, About, News, Research Areas, Projects, Sponsors, Principal Investigator, Members, Publications, Gallery, Footer, and Settings.
2. THE Admin_CMS SHALL support create, read, update, and delete operations for collection entities (Hero, News, Research Areas, Projects, Sponsors, Members, Publications, Gallery).
3. THE Admin_CMS SHALL support read and update operations for the Singleton_Entities About, Principal Investigator, and Footer.
4. WHERE a content entity uses Display_Order, WHEN the admin saves edited Display_Order values for that entity's items, THE Admin_CMS SHALL persist the new Display_Order values and present that entity's items ordered by Display_Order ascending in the admin list.
5. IF a content submission fails Zod validation, THEN THE Admin_CMS SHALL reject the submission with an HTTP 400 status, return field-level error details identifying each invalid field, and SHALL NOT create or modify any stored record.
6. THE Admin_CMS SHALL allow the admin to add, edit, and delete dynamic sections, each consisting of a heading and content, on a Research Area, with no fixed upper limit on the number of dynamic sections per Research Area.
7. WHEN the admin reorders a Research Area's dynamic sections, THE Admin_CMS SHALL persist the new section order and present the sections in that admin-defined order on subsequent reads.
8. THE Admin_CMS SHALL provide a searchable multi-select control for attaching Linked_Publications to a Research Area that filters the publications collection by matching the entered term, trimmed of leading and trailing whitespace, as a case-insensitive substring of the publication title, and SHALL store the selected publications as that Research Area's Linked_Publications.
9. IF the number of active hero slides is not exactly three, THEN THE Admin_CMS SHALL display a warning indication stating the current active hero slide count and that exactly three active hero slides are required.

### Requirement 23: Research Area Slug Generation

**User Story:** As the lab admin, I want SEO-friendly unique URLs generated for research areas, so that each area has a stable, readable address.

#### Acceptance Criteria

1. WHEN a research area is created, THE Slug_Generator SHALL produce a lowercase, hyphenated, URL-safe slug derived from the title.
2. THE Slug_Generator SHALL produce a slug that is unique across all research areas.
3. IF a generated base slug already exists, THEN THE Slug_Generator SHALL append the smallest numeric suffix that makes the slug unique.

### Requirement 24: Publication Author Linking and Mandatory PI

**User Story:** As the lab admin, I want publication authors linked to members with the PI always included, so that publications attach correctly to profiles and the lab's authorship is consistent.

#### Acceptance Criteria

1. WHEN the admin has entered at least 2 characters in an author-name field of the publication form, THE Publication_Service SHALL present at most 10 candidate members whose name contains the entered characters as a case-insensitive substring, drawn from the Principal Investigator and the PhD, MTech, BTech, and Intern members, ordered by closeness of match with exact and prefix matches first.
2. IF a publication save is submitted without the Principal Investigator among its authors, THEN THE Publication_Service SHALL reject the save with the code `PI_REQUIRED` and an HTTP 400 status, and SHALL persist no publication record or member-reference change.
3. WHEN a publication save passes validation, THE Publication_Service SHALL store the author names in their submitted display order and store a member reference for each author whose name equals a member's name as a case-insensitive match, with the Principal Investigator always present among the stored authors.
4. WHEN a publication save is submitted, THE Publication_Service SHALL validate that the submitted metadata contains every required field defined for its Publication_Type.
5. IF a submitted publication's metadata omits a required field for its Publication_Type or includes a field not defined for that Publication_Type, THEN THE Publication_Service SHALL reject the save with an HTTP 400 status and field-level error details indicating which fields are invalid, and SHALL persist no publication record.

### Requirement 25: Bidirectional Member–Publication Synchronization

**User Story:** As the lab admin, I want member and publication links kept mutually consistent, so that profiles and publications never disagree about authorship.

#### Acceptance Criteria

1. WHEN a publication's linked members change on create or update, THE Member_Sync_Service SHALL, before the operation returns a success response, add the publication's reference to each member in the set difference (new Linked_Members minus previous Linked_Members) and remove it from each member in the set difference (previous Linked_Members minus new Linked_Members).
2. THE Member_Sync_Service SHALL store at most one reference per relationship in each direction, so that repeating a synchronization with unchanged inputs leaves the stored references unchanged.
3. WHEN a publication is deleted, THE Member_Sync_Service SHALL, before the operation returns a success response, remove that publication's reference from every member that linked to it.
4. THE Member_Sync_Service SHALL maintain, at the completion of every create, update, or delete operation, the invariant that a member's identifier is in a publication's Linked_Members if and only if that publication's identifier is in the member's publications.
5. IF the synchronization of member references fails, THEN THE Publication_Service SHALL restore the publication record and all affected members' publications to the state they held immediately before the operation, so that no partial change persists.
6. IF the synchronization of member references fails, THEN THE Publication_Service SHALL return an error response to the admin indicating the operation did not complete.

### Requirement 26: File Upload Validation

**User Story:** As the lab admin, I want uploads validated by type and size, so that only acceptable media is stored and invalid files are rejected cleanly.

#### Acceptance Criteria

1. WHEN an image upload is submitted, THE File_Storage_Service SHALL accept it if and only if its extension is one of jpg, jpeg, png, or webp and its size is at most 2MB.
2. WHEN a PDF upload is submitted, THE File_Storage_Service SHALL accept it if and only if its extension is pdf and its size is at most 10MB.
3. IF an upload fails validation, THEN THE File_Storage_Service SHALL reject it with the code `UPLOAD_REJECTED` and write nothing to disk or to the database.

### Requirement 27: File Storage, Naming, and Path Safety

**User Story:** As the lab admin, I want uploaded files stored safely on the server with clean names, so that storage is secure, collision-free, and references remain portable.

#### Acceptance Criteria

1. WHEN an upload passes validation, THE File_Storage_Service SHALL rename it to a sanitized, generated name and discard the user-supplied filename.
2. THE File_Storage_Service SHALL write each file within its designated Upload_Subfolder under the configured upload directory.
3. THE File_Storage_Service SHALL ensure each resolved destination path is strictly contained within its Upload_Subfolder and SHALL reject any path that would resolve outside it.
4. WHEN a file is stored, THE Platform SHALL persist only the relative `/uploads/...` path string in MongoDB and SHALL NOT store file binaries in MongoDB.
5. THE Platform SHALL exclude the `/uploads` directory from the Git repository.

### Requirement 28: Instant Content Reflection

**User Story:** As the lab admin, I want my saved changes to appear on the public site immediately, so that I do not need a developer or redeployment to publish updates.

#### Acceptance Criteria

1. WHEN an admin mutation on a content entity succeeds, THE Platform SHALL revalidate the public route(s) backed by that entity so the change appears without a redeployment.
2. WHEN an upload is saved through the CMS, THE Platform SHALL store the file on the server filesystem and store its path in MongoDB so the public site references it without a code deployment.

### Requirement 29: Responsive Design

**User Story:** As a visitor, I want the site to adapt to my device, so that I have a usable experience on mobile, tablet, and desktop.

#### Acceptance Criteria

1. WHILE the viewport width is between 320px and 767px, THE Public_Site SHALL render a single-column, touch-friendly layout with hamburger navigation.
2. WHILE the viewport width is between 768px and 1024px, THE Public_Site SHALL render an adaptive multi-column layout with condensed navigation.
3. WHILE the viewport width is 1025px or greater, THE Public_Site SHALL render the full multi-column layout with horizontal navigation and dropdowns.
4. THE Public_Site SHALL render content cards without overflow or broken alignment across all supported breakpoints.

### Requirement 30: Theming

**User Story:** As a visitor, I want to choose a light or dark theme that is remembered, so that I can read comfortably across visits.

#### Acceptance Criteria

1. THE Theme_Manager SHALL provide a control to switch between light and dark themes.
2. WHEN the visitor switches the theme, THE Theme_Manager SHALL apply the change with a smooth transition.
3. THE Theme_Manager SHALL persist the selected theme and reapply it on subsequent visits without a flash of the wrong theme.

### Requirement 31: Motion and Animation

**User Story:** As a visitor, I want subtle, professional animations, so that the site feels premium without being distracting.

#### Acceptance Criteria

1. WHEN a content section enters the viewport, THE Motion_System SHALL reveal it with a subtle fade-up animation.
2. WHEN a pointer hovers a member, research, publication, or sponsor card, THE Motion_System SHALL apply a subtle 3D tilt with elevation and scale.
3. WHEN a route changes, THE Motion_System SHALL animate the page transition.
4. WHERE the visitor's system requests reduced motion, THE Motion_System SHALL disable non-essential animation.

### Requirement 32: SEO

**User Story:** As a lab stakeholder, I want strong SEO, so that the lab's research is discoverable by search engines.

#### Acceptance Criteria

1. THE SEO_Module SHALL provide per-page metadata including title, description, and keywords for every public route.
2. THE SEO_Module SHALL provide OpenGraph and Twitter card tags and a canonical URL for every public route.
3. THE SEO_Module SHALL expose research areas via structured slug URLs of the form `/research/areas/[slug]` rather than query-identifier URLs.
4. THE SEO_Module SHALL generate a `sitemap.xml` enumerating research areas, members, publications, projects, and the Principal Investigator.
5. THE SEO_Module SHALL generate a `robots.txt` that allows public pages and disallows `/admin`.

### Requirement 33: Performance

**User Story:** As a visitor, I want the site to load and respond quickly, so that I can browse without waiting.

#### Acceptance Criteria

1. THE Public_Site SHALL target a page load time under 3 seconds on a public page.
2. THE Public_Site SHALL serve images through optimized, lazy-loaded, responsive delivery.
3. THE Public_Site SHALL load heavy client components (rich-text editor, data tables, gallery) via code splitting.
4. WHERE a publications or projects list exceeds one page, THE Public_Site SHALL paginate the results rather than load all items at once.

### Requirement 34: Accessibility

**User Story:** As a visitor using assistive technology, I want accessible interactions, so that I can navigate and understand the site.

#### Acceptance Criteria

1. THE Public_Site SHALL support keyboard navigation across interactive elements.
2. THE Public_Site SHALL provide screen-reader labels for interactive controls and meaningful images.
3. THE Public_Site SHALL render a visible focus indicator on focused interactive elements.
4. THE Public_Site SHALL provide hover, focus, and active visual states for buttons with accessible color contrast.

### Requirement 35: Public Empty States and Media Fallbacks

**User Story:** As a visitor, I want graceful handling of missing content and media, so that pages remain coherent rather than broken.

#### Acceptance Criteria

1. WHILE a public collection (research, publications, alumni, or collaborators) has no items, THE Public_Site SHALL render the specified Empty_State message instead of an error.
2. IF a content item references an image that is missing, THEN THE Public_Site SHALL render the fallback placeholder image.
3. IF a content item has no associated PDF, THEN THE Public_Site SHALL omit the corresponding download control.
4. THE Public_Site SHALL open every outbound external link in a new tab with `rel="noopener noreferrer"`.

### Requirement 36: Deployment and Operations

**User Story:** As a lab operator, I want reliable deployment, backups, and admin provisioning, so that the platform runs safely on the IIT Patna server.

#### Acceptance Criteria

1. THE Platform SHALL run on the IIT Patna internal Linux server under PM2 process management behind an Nginx reverse proxy.
2. THE Backup_Service SHALL perform a weekly backup that includes the MongoDB database and the `/uploads` directory.
3. WHEN the Platform first boots, THE Admin_Seeder SHALL create the single admin user from the `ADMIN_EMAIL` and `ADMIN_PASSWORD` environment variables with the password stored as a bcrypt hash.

### Requirement 37: Scope Boundaries

**User Story:** As a lab stakeholder, I want excluded capabilities documented, so that scope expectations are clear for this release.

#### Acceptance Criteria

1. THE Platform SHALL support exactly one administrator and SHALL NOT provide multi-admin roles in this release.
2. THE Platform SHALL exclude payment gateway, student portal, email system, live chat, notifications, forum, and comments capabilities from this release.
3. WHILE the alumni and collaborators collections are unpopulated, THE Public_Site SHALL present them as future-ready empty states rather than removing the pages.
