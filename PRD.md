# Prism Lab IIT Patna Web Platform

## Product Requirements Document (PRD)

## + Software Requirements Specification (SRS)

### Enterprise Grade Specification

### Part 1

1. Executive Summary
2. Product Vision
3. Scope
4. Stakeholders
5. Goals
6. Tech Stack
7. System Architecture
8. Navigation Structure
9. Information Architecture
10. User Roles

### Part 2

11. Complete User Panel

    * Every page
    * Every section
    * Every button
    * Hover effects
    * Sorting
    * Search
    * Filters
    * Responsive behavior
    * Animations

### Part 3

12. Complete Admin CMS

    * Every page
    * CRUD logic
    * Upload rules
    * Dynamic content system
    * Role behavior
    * Validation
    * Edge cases

### Part 4

13. Database Design
14. Schema Design
15. Relationships
16. API Structure
17. Folder Structure

### Part 5

18. Hosting Architecture
19. Before Hosting Workflow
20. After Hosting Workflow
21. Upload Storage Logic
22. Backup Strategy

### Part 6

23. Security
24. SEO
25. Performance
26. Accessibility
27. Acceptance Criteria
28. Future Scalability


# Prism Lab IIT Patna Web Platform

# Product Requirements Document (PRD) + Software Requirements Specification (SRS)

**Version:** 1.0
**Project Type:** Academic Research Lab Website + Content Management System (CMS)
**Client:** Prism Lab, IIT Patna
**Prepared For:** Prism Lab IIT Patna
**Prepared By:** Product & System Architecture Specification

---

# 1. Executive Summary

The **Prism Lab IIT Patna Web Platform** is a modern, research-oriented, premium web application developed for an academic research laboratory at IIT Patna.

The platform consists of:

1. **Public User Panel (Website)**
2. **Secure Admin Panel (CMS)**

The primary purpose of the system is to:

* showcase Prism Lab research work
* manage publications
* display members and research scholars
* present projects and sponsors
* dynamically update content through an admin dashboard
* maintain a professional academic research presence

The platform shall be fully dynamic, highly scalable, SEO-friendly, responsive, secure, and optimized for long-term maintainability.

The entire content of the website shall be controlled through a **single-admin Content Management System (CMS)**.

No hardcoded content shall exist except system-level configuration.

---

# 2. Product Vision

The objective of this platform is to establish a:

> **Professional, premium, research-oriented digital identity for Prism Lab IIT Patna**

The website shall represent:

* academic excellence
* research credibility
* publication visibility
* member achievements
* institutional professionalism

The website design shall combine:

```text
Modern Research Website
+
Premium Academic UI
+
Interactive Motion Design
```

The user experience should feel:

```text
Professional
Premium
Modern
Research-focused
Interactive
Fast
Responsive
```

---

# 3. Product Objectives

The system shall fulfill the following objectives.

## 3.1 Public Research Showcase

Provide a highly structured platform for displaying:

* Research Areas
* Research Papers
* Publications
* Projects
* Sponsors
* Principal Investigator
* Current Members
* Alumni
* Collaborators

---

## 3.2 Dynamic Content Management

Admin shall manage:

```text
Create
Read
Update
Delete
```

for every content element.

No developer should be required for:

```text
Adding Members
Changing Hero Images
Updating Publications
Adding Research Areas
Editing PI Information
Uploading PDFs
Managing Sponsors
Managing News
Updating Gallery
```

---

## 3.3 Research Visibility

Website must prioritize:

* publication discoverability
* SEO optimization
* academic readability
* structured information

---

## 3.4 Long-Term Maintainability

System shall be:

```text
Scalable
Maintainable
Modular
Reusable
Secure
```

for future expansion.

---

# 4. Project Scope

The system shall include:

---

## In Scope

### User Panel

* Homepage
* Research Areas
* Research Details
* Projects
* Sponsors
* Publications
* Principal Investigator
* Current Members
* Alumni
* Collaborators
* Individual Member Profiles

---

### Admin Panel

CMS for:

* Hero Section
* About Lab
* News & Events
* Research Areas
* Research Papers
* Projects
* Sponsors
* Principal Investigator
* Members
* Publications
* Gallery
* Footer
* Settings

---

### Authentication

Single secure admin.

JWT authentication.

Protected routes.

---

### Upload Management

Upload:

```text
Images
PDFs
Resume
Research Papers
Gallery Images
Sponsor Logos
```

---

### Responsive Design

All devices:

```text
Desktop
Laptop
Tablet
Mobile
```

---

### Theme Support

```text
Light Mode
Dark Mode
```

---

### Motion Design

Premium motion interactions using:

```text
Framer Motion
3D Effects
Micro Animations
```

---

## Out of Scope

Currently excluded:

```text
Multi-admin roles
Payment gateway
Student portal
Email system
Live chat
Notifications
Forum
Comments
```

---

# 5. Stakeholders

## Primary Stakeholders

### Prism Lab IIT Patna

Owner of system.

---

### Principal Investigator

Academic authority.

---

### Single Admin

Responsible for:

```text
Website management
Content update
Research update
Publication update
Member management
```

---

### Visitors

Includes:

```text
Researchers
Students
Faculty
Industry Professionals
Academic Visitors
```

---

# 6. User Roles

The platform shall support:

## Role 1: Public User

Access level:

```text
Read Only
```

Can:

* view research
* read publications
* browse members
* access projects
* view sponsors

Cannot:

```text
Edit
Delete
Upload
Modify
```

---

## Role 2: Admin

Access level:

```text
Full Control
```

Can:

```text
Add
Edit
Update
Delete
Manage
Upload
Reorder
Publish
```

for all content.

---

# 7. Final Technology Stack

## 7.1 Core Stack

| Layer            | Technology             |
| ---------------- | ---------------------- |
| Frontend         | Next.js 14             |
| Backend          | Next.js Route Handlers |
| Runtime          | Node.js                |
| Language         | TypeScript             |
| Database         | MongoDB                |
| ODM              | Mongoose               |
| Styling          | Tailwind CSS           |
| Components       | ShadCN UI              |
| Animation        | Framer Motion          |
| Rich Text Editor | TipTap                 |
| Auth             | JWT                    |
| Validation       | Zod                    |
| Theme            | next-themes            |
| Tables           | TanStack Table         |
| File Upload      | Multer                 |
| Icons            | Lucide React           |

---

## 7.2 Why Next.js Full Stack

Architecture:

```text
Frontend
+
Backend
inside one project
```

Reason:

* easier maintenance
* easier deployment
* better SEO
* cleaner architecture
* faster development

Separate backend is intentionally avoided.

---

## 7.3 Why MongoDB

MongoDB selected because:

System contains:

```text
Dynamic Content
Research Data
Flexible Fields
Rich Text
Media Uploads
```

MongoDB supports flexible schema evolution.

Example:

Today:

```text
Name
Role
```

Future:

```text
Research Interest
ORCID
Achievements
```

No schema migration required.

---

# 8. High-Level System Architecture

System architecture:

```text
User Browser
      ↓
Next.js Frontend
      ↓
Next.js API Routes
      ↓
MongoDB Database
      ↓
Server Upload Storage
```

---

## Upload Architecture

Files are NOT stored inside MongoDB.

Instead:

```text
Images/PDFs
      ↓
Server Upload Folder
```

MongoDB stores:

```text
File Path
Metadata
Reference
```

Example:

```json
{
  "profileImage":
  "/uploads/members/amit.jpg"
}
```

---

# 9. Hosting Architecture

Deployment target:

```text
IIT Patna Internal Server
```

Environment:

```text
Linux Server
Node.js Runtime
MongoDB Community Edition
```

---

## Hosting Structure

```text
IIT Server
│
├── Next.js App
│
├── MongoDB Database
│
└── Uploads Folder
```

---

# 10. Before Hosting Workflow

Before deployment:

Admin uploads data through:

```text
localhost:3000/admin
```

Files stored locally:

```text
/project-root/uploads
```

MongoDB stores references.

---

Example:

Upload member image.

Saved:

```text
/uploads/member/amit.webp
```

MongoDB:

```json
{
 "name":"Amit",
 "profileImage":
 "/uploads/member/amit.webp"
}
```

---

# 11. After Hosting Workflow

After deployment:

Admin logs into:

```text
https://domain/admin/login
```

Uploads image.

Image stored in:

```text
/var/www/prism/uploads/
```

MongoDB stores path.

Website automatically reflects updates.

No redeployment required.

---

# 12. Upload Persistence Logic

Uploaded files NEVER go to:

```text
GitHub repository
```

Uploaded files NEVER go inside:

```text
MongoDB binary storage
```

Files only go to:

```text
Server uploads folder
```

Example:

```text
/uploads
   /hero
   /gallery
   /members
   /research
   /publications
   /resume
   /sponsors
```

---

# 13. File Validation Rules

## Images

Allowed:

```text
jpg
jpeg
png
webp
```

Max Size:

```text
2MB
```

---

## PDFs

Allowed:

```text
pdf
```

Max Size:

```text
10MB
```

---

# 14. Backup Strategy

Weekly backup required.

Backup includes:

```text
MongoDB Database
+
Uploads Folder
```

Purpose:

Prevent:

```text
Server crash
Accidental deletion
Corrupted data
```

Recommended schedule:

```text
Weekly automatic backup
```

---

# 15. Information Architecture

Navbar Structure:

```text
Home

Research
├── Areas
├── Projects
└── Sponsors

Publications
├── Journal
├── Conference
├── Book Chapters
├── Patents
├── Datasets
└── Invited Talks

People
├── Principal Investigator
├── Current Members
├── Alumni
└── Collaborators
```

---

# 16. Admin Architecture

Secure route:

```text
/admin/login
```

Protected routes:

```text
/admin/*
```

Unauthorized access:

```text
Blocked
Redirect to login
```

JWT authentication mandatory.

---

**END OF PART 1**
**Next: Part 2 → Complete User Panel (Every Page & Section in Detail)**



# PART 2 — COMPLETE USER PANEL SPECIFICATION

# 17. User Panel Overview

## Objective

The user panel shall serve as the **public-facing digital identity of Prism Lab IIT Patna**.

The website must be:

```text
Premium
Professional
Research-focused
Modern
Interactive
Academic
Responsive
SEO-friendly
```

The design shall combine:

```text
Academic Research Website
+
Premium Modern UI
+
Subtle 3D Motion
+
Framer Motion Animations
```

The interface shall prioritize:

* readability
* research discoverability
* academic professionalism
* smooth interactions

---

# 18. Global User Panel Requirements

These requirements apply to ALL pages.

---

## 18.1 Responsive Design

The platform must be responsive across:

```text
Desktop
Laptop
Tablet
Mobile
```

Breakpoints:

```text
Mobile: 320px–767px
Tablet: 768px–1024px
Desktop: 1025px+
```

---

## 18.2 Theme Support

System shall support:

```text
Light Mode
Dark Mode
```

Behavior:

* smooth transition
* persisted theme state
* accessible contrast

---

## 18.3 Motion Design Requirements

Animations shall be implemented using:

```text
Framer Motion
```

Required motion behavior:

### Page Transitions

Pages should animate smoothly.

Example:

```text
fade
slide
scale
```

---

### Scroll Reveal

Each section appears gradually:

```text
fade-in
slide-up
```

when entering viewport.

---

### Card Hover Effects

All cards shall include:

```text
3D tilt
elevation
shadow increase
subtle scale
```

Applicable to:

* member cards
* research cards
* publication cards
* sponsor cards

---

### Micro Interactions

Buttons:

```text
hover scale
smooth transitions
shadow
```

Navbar dropdown:

```text
smooth animation
```

---

## 18.4 Navbar Requirements

Navbar shall be:

```text
Sticky
Responsive
Accessible
```

Behavior:

Desktop:

```text
horizontal navigation
```

Mobile:

```text
hamburger menu
```

---

## Navbar Menu Structure

```text
Home

Research
├── Areas
├── Projects
└── Sponsors

Publications
├── Journal
├── Conference
├── Book Chapters
├── Patents
├── Datasets
└── Invited Talks

People
├── Principal Investigator
├── Current Members
├── Alumni
└── Collaborators
```

Dropdown behavior:

```text
hover (desktop)
click (mobile)
```

Animation:

```text
smooth dropdown reveal
```

---

# 19. HOME PAGE

## Route

```text
/
```

Homepage acts as:

```text
Primary Narrative Hub
```

Page Flow:

```text
Hero
↓
About Lab + News
↓
Research Areas
↓
Principal Investigator
↓
Projects
↓
Members
↓
Sponsors
↓
Gallery
↓
Footer
↓
Developer Section
```

---

# 20. HERO SECTION

## Objective

Immediately establish:

```text
Research identity
Professionalism
Visual appeal
```

---

## Structure

Contains:

```text
3 images carousel
Heading
Subheading
CTA Button
Previous Button
Next Button
```

---

## Hero Images

Requirements:

```text
Exactly 3 images
```

Auto behavior:

```text
Auto-scroll every 3 seconds
```

Manual navigation:

```text
Previous
Next
```

Manual interaction pauses autoplay.

---

## Content Fields

Admin-controlled:

```text
Heading
Subheading
CTA Text
CTA Link
Image
Display Order
```

---

## Animation

Transitions:

```text
fade
parallax
smooth scale
```

---

# 21. ABOUT LAB + NEWS & EVENTS SECTION

## Layout

Two-column structure.

Left:

```text
About Lab
```

Right:

```text
News & Events
```

Alignment:

```text
Equal height
Consistent spacing
Professional alignment
```

---

## About Lab

Contains:

```text
Title
Description
Optional image
```

Editable from admin.

---

## News & Events

Dynamic feed.

Sorted:

```text
Newest first
```

Fields:

```text
Title
Description
Date
Image (optional)
External Link (optional)
```

Behavior:

If link exists:

```text
Read More button
```

---

# 22. RESEARCH AREAS PREVIEW SECTION

## Objective

Provide overview of lab research domains.

---

## Homepage View

Shows:

```text
Few research cards only
```

Card contains:

```text
Research Name
Author Name
Research Overview
Read More button
```

---

## Button

```text
Explore All Research Areas
```

Redirect:

```text
/research/areas
```

---

## Hover Effect

Research card:

```text
3D hover
shadow
elevation
subtle rotation
```

---

# 23. PRINCIPAL INVESTIGATOR SECTION

## Objective

Highlight faculty in charge.

---

## Homepage Structure

Contains:

```text
Profile image
Overview
Short summary
View Profile button
```

Redirect:

```text
/people/principal-investigator
```

---

# 24. PROJECTS SECTION

## Objective

Provide quick overview of projects.

---

## Homepage Behavior

Only:

```text
Project overview
```

shown.

Not full details.

---

## Button

```text
View All Projects
```

Redirect:

```text
/research/projects
```

---

## Card Design

Contains:

```text
Project title
Short overview
```

Hover:

```text
premium animation
```

---

# 25. MEMBERS SECTION

## Homepage Behavior

Only few members displayed.

Preview only.

Contains:

```text
image
name
role
```

Hover:

```text
3D hover effect
```

Button:

```text
View All Members
```

Redirect:

```text
/people/current-members
```

---

# 26. SPONSORS SECTION

## Homepage Only

Sponsors appear as:

```text
Infinite smooth marquee slider
```

Structure:

```text
Logo
Sponsor Name
```

Animation:

```text
continuous auto movement
```

Pause:

```text
hover pause
```

---

# 27. GALLERY SECTION

## Objective

Show research activity.

---

## Filters

Two buttons:

```text
Research & Activities
Group Discussion
```

---

## Carousel Behavior

Movement:

```text
Right → Left
```

Auto:

```text
Every 2 seconds
```

Manual:

```text
Previous
Next
```

Manual interaction pauses autoplay.

---

## Lightbox

Click image:

Fullscreen modal opens.

Contains:

```text
Close
Previous
Next
Zoom
```

---

# 28. FOOTER

## Structure

Left Side:

```text
Copyright
All rights reserved
```

Right Side:

```text
Designed & Developed by Amit Kumar
```

Click:

opens:

```text
https://amit-three.vercel.app/
```

---

# 29. RESEARCH AREA PAGE

## Route

```text
/research/areas
```

---

## Search

Required:

```text
Search research topic
```

---

## Card Fields

Each card:

```text
Research Name
Author Name
About Research
Read More
```

---

## Sorting

Admin-controlled display order.

---

# 30. RESEARCH DETAILS PAGE

## Route

```text
/research/areas/[slug]
```

---

## Structure

Dynamic custom sections.

Admin creates:

```text
Heading
Textarea content
```

Unlimited sections allowed.

Example:

```text
Overview
Methodology
Applications
Future Scope
```

---

## Publications

Linked automatically.

Admin selects publications.

Displayed dynamically.

---

# 31. PROJECTS PAGE

## Route

```text
/research/projects
```

---

## Structure

Table format.

Contains:

```text
Project Title
Overview
Description
Objectives
Deliverables
Duration
Status
```

---

# 32. SPONSORS PAGE

## Route

```text
/research/sponsors
```

Contains:

```text
Logo
Sponsor Name
```

---

# 33. PRINCIPAL INVESTIGATOR PAGE

## Route

```text
/people/principal-investigator
```

Sections:

```text
Overview
Research
Teaching
Publication
Education
Activities
Achievement
```

Supports:

```text
rich formatting
```

---

# 34. CURRENT MEMBERS PAGE

## Route

```text
/people/current-members
```

Buttons:

```text
Ongoing
Completed
```

---

## Search

Search by:

```text
Member name
```

---

## PhD Scholars

No year grouping.

Sorted:

```text
Display Order
```

---

## MTech/BTech/Intern

Grouped:

```text
Year descending
```

Example:

```text
2025
2024
2023
```

Within each:

```text
Ongoing
Completed
```

---

## Member Card

Contains:

```text
image
name
role
year
```

Hover:

```text
3D effect
premium animation
```

Click:

redirect:

```text
/member/[id]
```

---

# 35. MEMBER PROFILE PAGE

## Route

```text
/people/current-members/[id]
```

Contains:

```text
Profile image
Biography
Resume
Email
Website
Google Scholar
GitHub
LinkedIn
Twitter/X
Publications
```

Publications linked automatically.

---

# 36. ALUMNI PAGE

## Route

```text
/people/alumni
```

Current State:

```text
Empty
Future-ready
```

---

# 37. COLLABORATORS PAGE

## Route

```text
/people/collaborators
```

Current State:

```text
Empty
Future-ready
```

---

# 38. PUBLICATION SECTION

Sorted:

```text
Descending year
```

Search:

```text
paper title
```

---

## Journal

Route:

```text
/publications/journal
```

Table:

```text
S.No
Authors
Paper Title
Journal Name
Year
```

Paper title clickable.

---

## Conference

Route:

```text
/publications/conference
```

Table:

```text
SN
Authors
Conference Title
Conference Name
Place & Date
Year
```

---

## Book Chapters

Route:

```text
/publications/book-chapters
```

Table:

```text
Authors
Title
Publisher
Year
Volume
Edition
Pages
```

---

## Patents

Route:

```text
/publications/patents
```

Table:

```text
Authors
Title
Patent Type
Patent Number
Issued Date
Status
```

---

## Datasets

Non-table format.

---

## Invited Talks

Non-table format.

---

**END OF PART 2**
**Next: Part 3 → Complete Admin Panel (Every CMS Page + CRUD + Upload Logic)**





# PART 3 — COMPLETE ADMIN PANEL (CMS) SPECIFICATION

# 39. Admin Panel Overview

## Objective

The Admin Panel acts as the:

```text
Centralized Content Management System (CMS)
```

for the entire Prism Lab website.

The CMS shall allow the admin to:

```text
Create
Read
Update
Delete
Manage
Upload
Reorder
Publish
```

for every content section of the website.

No website content shall require developer intervention.

Every change made through admin panel shall:

```text
Reflect instantly on website
```

without redeployment.

---

# 40. Admin Authentication System

## Route

```text
/admin/login
```

Hidden route.

Not visible in navbar.

---

## Login Requirement

Admin must login every session.

Unauthorized access blocked.

Protected routes:

```text
/admin
/admin/hero
/admin/news
/admin/research
/admin/projects
/admin/sponsors
/admin/pi
/admin/members
/admin/publications
/admin/gallery
/admin/footer
/admin/settings
```

Without authentication:

```text
Redirect → /admin/login
```

---

## Authentication Method

System uses:

```text
JWT Authentication
```

Stored via:

```text
HTTP-only cookies
```

Purpose:

```text
Prevent token theft
More secure than localStorage
```

---

## Login Fields

Required:

```text
Email
Password
```

Validation:

If credentials invalid:

```text
Invalid credentials
```

message displayed.

---

## Security Requirements

### Rate Limiting

Multiple failed attempts:

Example:

```text
5 failed attempts
```

Then:

```text
Temporary lockout
```

---

## Session Expiration

JWT expires after configured duration.

Example:

```text
24 hours
```

---

# 41. Admin Dashboard

## Route

```text
/admin
```

---

## Purpose

Provide overview of website content.

---

## Dashboard Cards

Cards show statistics:

```text
Total Members
PhD Members
MTech Members
BTech Members
Interns
Total Publications
Research Areas
Projects
Sponsors
Gallery Images
News Items
```

---

## Quick Actions

Buttons:

```text
Add Member
Add Publication
Add Research
Add News
Upload Gallery
```

---

## Recent Activity

Shows latest:

```text
Updated Members
Recent Uploads
New Publications
```

---

# 42. Sidebar Navigation

Structure:

```text
Dashboard

Hero Section
About Lab
News & Events

Research
├── Research Areas
├── Projects
└── Sponsors

Principal Investigator

Members

Publications
├── Journal
├── Conference
├── Book Chapters
├── Patents
├── Datasets
└── Invited Talks

Gallery

Footer

Settings

Logout
```

Sidebar:

```text
collapsible
responsive
dark mode compatible
```

---

# 43. HERO SECTION CMS

## Route

```text
/admin/hero
```

---

## Purpose

Manage homepage hero section.

---

## Features

Admin can:

```text
Add Hero Slide
Edit Hero Slide
Delete Hero Slide
Reorder Hero Slide
```

---

## Fields

Each hero slide contains:

```text
Hero Image
Heading
Subheading
CTA Button Text
CTA Button Link
Display Order
```

---

## Constraints

Hero images:

```text
Maximum 2MB
```

Formats:

```text
jpg
jpeg
png
webp
```

---

## Behavior

Exactly:

```text
3 hero slides visible
```

Homepage auto-updates after save.

---

# 44. ABOUT LAB CMS

## Route

```text
/admin/about
```

---

## Purpose

Manage:

```text
About Prism Lab
```

section.

---

## Editable Fields

```text
Heading
Description
Image (optional)
Display Order
```

Supports:

```text
Rich text formatting
```

---

# 45. NEWS & EVENTS CMS

## Route

```text
/admin/news
```

---

## Features

Admin can:

```text
Add
Edit
Delete
Publish
```

news items.

---

## Fields

```text
Title
Description
Date
Image (optional)
External Link (optional)
Display Order
```

---

## Validation

Title required.

Description required.

Date required.

Image optional.

External link optional.

---

## Sorting

Homepage:

```text
Newest first
```

---

# 46. RESEARCH AREA CMS

## Route

```text
/admin/research
```

---

## Objective

Admin manages all research domains.

---

## Features

Admin can:

```text
Create research area
Edit research area
Delete research area
Publish research area
```

---

## Fields

```text
Research Title
Author Name
Research Overview
Feature Image (optional)
Display Order
```

---

## Dynamic Custom Sections

Admin can add unlimited sections.

Each section:

```text
Section Heading
Textarea Content
```

Example:

```text
Overview
Methodology
Applications
Future Scope
```

Admin may:

```text
Add
Edit
Delete
Reorder
```

sections.

---

## Linked Publications

Admin must be able to:

```text
Select publications
```

from publication database.

Selection:

```text
multi-select
searchable dropdown
```

Selected publications automatically appear on:

```text
/research/areas/[slug]
```

---

# 47. PROJECTS CMS

## Route

```text
/admin/projects
```

---

## Features

CRUD supported.

---

## Fields

```text
Project Title
Overview
Description
Objectives
Deliverables
Duration
Status
Display Order
```

---

## Homepage Sync

Projects preview on homepage updates automatically.

---

# 48. SPONSORS CMS

## Route

```text
/admin/sponsors
```

---

## Objective

Manage sponsor marquee.

---

## Features

Admin can:

```text
Add Sponsor
Edit Sponsor
Delete Sponsor
```

---

## Fields

```text
Sponsor Logo
Sponsor Name
Display Order
```

---

## Behavior

Homepage:

```text
Infinite smooth marquee slider
```

---

# 49. PRINCIPAL INVESTIGATOR CMS

## Route

```text
/admin/principal-investigator
```

---

## Objective

Full PI profile management.

---

## Editable Sections

```text
Overview
Research
Teaching
Publication
Education
Activities
Achievement
```

---

## Rich Text Features

Supports:

```text
Bold
Italic
H1
H2
H3
Bullet List
Number List
Highlight
Hyperlink
Text Color
```

Behavior:

```text
Enter → new paragraph

Shift+Enter → new line
```

---

## Additional Fields

```text
Name
Designation
Profile Image
Email
Website
Google Scholar
LinkedIn
```

---

# 50. MEMBERS CMS

## Route

```text
/admin/members
```

---

## Features

Admin can:

```text
Create Member
Edit Member
Delete Member
Change Status
Reorder Member
```

---

## Member Form Fields

### Required Fields

```text
Name
Display Order
Role
Status
```

---

### Optional Fields

```text
Session Year
Profile Image
Resume PDF
Biography
Email
Website / Portfolio
Google Scholar
GitHub
LinkedIn
Twitter/X
```

---

## Roles

```text
PhD
MTech
BTech
Intern
```

---

## Status

```text
Ongoing
Completed
```

---

## Validation Rules

### Image

Formats:

```text
jpg
jpeg
png
webp
```

Max:

```text
2MB
```

---

### Resume PDF

Max:

```text
10MB
```

---

## Member Library

Below form:

```text
Members Library
```

Organized by:

```text
PhD
MTech
BTech
Intern
```

Features:

```text
Search
Filter
Quick Edit
Status Toggle
Delete
```

---

## Sorting Logic

### PhD

Sorted by:

```text
Display Order
```

---

### MTech/BTech/Intern

Sorted:

```text
Year descending
```

Example:

```text
2025
2024
2023
```

---

# 51. PUBLICATIONS CMS

## Route

```text
/admin/publications
```

---

## Structure

Dropdown tabs:

```text
Journal
Conference
Book Chapters
Patents
Datasets
Invited Talks
```

---

## Journal Fields

```text
S.No
Author Names
Paper Title
Paper Link (optional)
PDF Upload (optional)
Journal Name
Year
```

---

## Conference Fields

```text
SN
Authors
Conference Title
Conference Name
Place and Date
Year
PDF Upload (optional)
External Link (optional)
```

---

## Book Chapters Fields

```text
Authors
Title
Publisher
Year
Volume
Edition
Pages
```

---

## Patent Fields

```text
Authors
Title
Patent Type
Patent Number
Issued Date
Status
```

---

## Datasets

Free-form content.

---

## Invited Talks

Free-form content.

---

## Publication Linking

Admin types author names.

Autocomplete appears.

Suggestions include:

```text
PI
PhD
MTech
BTech
Intern
```

PI selection mandatory.

Publication auto-attaches to member profiles.

---

# 52. GALLERY CMS

## Route

```text
/admin/gallery
```

---

## Separate from Hero Section

Hero and Gallery are:

```text
Completely different modules
```

---

## Fields

```text
Image
Category
Display Order
```

---

## Categories

```text
Research & Activities
Group Discussion
```

---

## Features

```text
Upload
Edit
Delete
Reorder
```

---

# 53. FOOTER CMS

## Route

```text
/admin/footer
```

Editable:

Left:

```text
Copyright
All rights reserved
```

Right:

```text
Developer Text
Developer Link
```

Default:

```text
Designed & Developed by Amit Kumar
```

---

# 54. SETTINGS

## Route

```text
/admin/settings
```

Settings:

```text
Theme
Security
Backup
Upload Limits
```

---

# 55. SAVE LOGIC

When admin clicks:

```text
Save
```

System:

### Step 1

Validate form.

### Step 2

Upload file to:

```text
/uploads
```

### Step 3

Save metadata in MongoDB.

### Step 4

Website updates automatically.

No redeploy needed.

---

**END OF PART 3**
**Next: Part 4 → Database Schema + APIs + Folder Structure + MongoDB Design**




# PART 4 — DATABASE DESIGN, SCHEMA ARCHITECTURE, API STRUCTURE & FOLDER STRUCTURE

# 56. Database Overview

## Selected Database

Database selected:

MongoDB

ODM:

Mongoose

---

## Why MongoDB

MongoDB selected because the system contains:

```text id="7vpgq9"
Dynamic content
Flexible schema
Rich text sections
Media uploads
Research content
Expandable structure
```

This website behaves like a:

```text id="l4qj6k"
Content-heavy CMS
```

rather than a transactional system.

---

## Database Principles

System shall follow:

### 1. Metadata Storage Only

MongoDB stores:

```text id="6vgk7k"
Text
Links
IDs
Paths
Metadata
```

MongoDB DOES NOT store:

```text id="zptc2u"
Images
PDF binaries
Large files
```

---

### 2. Media Storage Strategy

Files stored:

```text id="0kgbnq"
Server uploads folder
```

MongoDB stores:

```text id="daxm24"
relative file path
```

Example:

```json id="evlhtx"
{
  "profileImage":
  "/uploads/members/amit.webp"
}
```

---

# 57. Entity Relationship Design (High Level)

```text id="w33uxj"
User (Admin)
    │
    ├── Hero Slides
    ├── About Lab
    ├── News
    ├── Research Areas
    │        │
    │        └── Linked Publications
    │
    ├── Projects
    ├── Sponsors
    ├── Principal Investigator
    │
    ├── Members
    │        │
    │        └── Publications
    │
    ├── Publications
    ├── Gallery
    └── Footer
```

---

# 58. DATABASE SCHEMA DESIGN

---

# 58.1 Admin User Schema

Collection:

```text id="k5b3ts"
users
```

Purpose:

```text id="3y6hjp"
single admin authentication
```

Fields:

| Field        | Type   | Required |
| ------------ | ------ | -------- |
| email        | string | yes      |
| passwordHash | string | yes      |
| createdAt    | date   | yes      |
| updatedAt    | date   | yes      |

Example:

```json id="pjlwmn"
{
  "email": "admin@prismlab.com",
  "passwordHash": "encrypted",
  "createdAt": "2026-01-01"
}
```

---

# 58.2 Hero Section Schema

Collection:

```text id="a0hycu"
hero_slides
```

Fields:

| Field        | Type    |
| ------------ | ------- |
| image        | string  |
| heading      | string  |
| subheading   | string  |
| ctaText      | string  |
| ctaLink      | string  |
| displayOrder | number  |
| isActive     | boolean |

---

# 58.3 About Lab Schema

Collection:

```text id="j4cc1m"
about_lab
```

Fields:

| Field       | Type     |
| ----------- | -------- |
| heading     | string   |
| description | richText |
| image       | string   |
| updatedAt   | date     |

---

# 58.4 News & Events Schema

Collection:

```text id="d3x1oj"
news
```

Fields:

| Field        | Type     |
| ------------ | -------- |
| title        | string   |
| description  | richText |
| date         | date     |
| image        | string   |
| externalLink | string   |
| displayOrder | number   |
| createdAt    | date     |

---

# 58.5 Research Areas Schema

Collection:

```text id="49i1nx"
research_areas
```

Fields:

| Field              | Type       |
| ------------------ | ---------- |
| title              | string     |
| authorName         | string     |
| overview           | string     |
| featureImage       | string     |
| displayOrder       | number     |
| linkedPublications | ObjectId[] |
| sections           | array      |

---

### Dynamic Sections

Structure:

```json id="skd7lm"
[
  {
    "heading": "Methodology",
    "content": "..."
  }
]
```

Unlimited sections allowed.

---

# 58.6 Projects Schema

Collection:

```text id="w6u66h"
projects
```

Fields:

| Field        | Type     |
| ------------ | -------- |
| title        | string   |
| overview     | string   |
| description  | richText |
| objectives   | array    |
| deliverables | array    |
| duration     | string   |
| status       | string   |
| displayOrder | number   |

---

# 58.7 Sponsors Schema

Collection:

```text id="7v91zr"
sponsors
```

Fields:

| Field        | Type   |
| ------------ | ------ |
| sponsorName  | string |
| sponsorLogo  | string |
| displayOrder | number |
| createdAt    | date   |

---

# 58.8 Principal Investigator Schema

Collection:

```text id="a2j8kj"
principal_investigator
```

Fields:

| Field        | Type     |
| ------------ | -------- |
| name         | string   |
| designation  | string   |
| image        | string   |
| email        | string   |
| website      | string   |
| scholarLink  | string   |
| linkedIn     | string   |
| overview     | richText |
| research     | richText |
| teaching     | richText |
| publications | richText |
| education    | richText |
| activities   | richText |
| achievements | richText |

---

# 58.9 Members Schema

Collection:

```text id="7vs3mq"
members
```

Fields:

| Field        | Type       | Required |
| ------------ | ---------- | -------- |
| name         | string     | yes      |
| displayOrder | number     | yes      |
| role         | enum       | yes      |
| status       | enum       | yes      |
| sessionYear  | string     | no       |
| image        | string     | no       |
| resumePdf    | string     | no       |
| biography    | richText   | no       |
| email        | string     | no       |
| website      | string     | no       |
| scholar      | string     | no       |
| github       | string     | no       |
| linkedIn     | string     | no       |
| twitterX     | string     | no       |
| publications | ObjectId[] | no       |
| createdAt    | date       | yes      |

---

### Role Enum

```text id="0q3tiv"
PhD
MTech
BTech
Intern
```

---

### Status Enum

```text id="rhdb7w"
Ongoing
Completed
```

---

# 58.10 Publications Schema

Collection:

```text id="wlrwpr"
publications
```

Fields:

| Field           | Type       |
| --------------- | ---------- |
| publicationType | enum       |
| title           | string     |
| authors         | array      |
| linkedMembers   | ObjectId[] |
| pdfPath         | string     |
| externalLink    | string     |
| year            | number     |
| metadata        | object     |

---

### Publication Type Enum

```text id="jlwmha"
Journal
Conference
BookChapter
Patent
Dataset
InvitedTalk
```

---

### Journal Metadata

```json id="k9we5z"
{
  "journalName": "",
  "paperTitle": ""
}
```

---

### Conference Metadata

```json id="5x8icg"
{
  "conferenceName": "",
  "placeDate": ""
}
```

---

### Book Metadata

```json id="f50zxd"
{
  "publisher": "",
  "volume": "",
  "edition": "",
  "pages": ""
}
```

---

### Patent Metadata

```json id="7f5kig"
{
  "patentType": "",
  "patentNumber": "",
  "status": ""
}
```

---

# 58.11 Gallery Schema

Collection:

```text id="g2d7g7"
gallery
```

Fields:

| Field        | Type   |
| ------------ | ------ |
| image        | string |
| category     | enum   |
| displayOrder | number |
| createdAt    | date   |

---

### Category Enum

```text id="5qcbhy"
Research & Activities
Group Discussion
```

---

# 58.12 Footer Schema

Collection:

```text id="gz5xtk"
footer
```

Fields:

| Field         | Type   |
| ------------- | ------ |
| copyrightText | string |
| developerName | string |
| developerLink | string |

---

# 59. FILE STORAGE STRUCTURE

Files stored locally.

Path:

```text id="r6a5v0"
/uploads
```

Folder structure:

```text id="s31k91"
/uploads
│
├── hero
│
├── members
│
├── pi
│
├── research
│
├── publications
│
├── sponsors
│
├── gallery
│
├── resumes
│
└── news
```

---

# 60. BEFORE HOSTING FILE FLOW

Development environment:

```text id="u3m6v4"
localhost:3000
```

Admin uploads image.

System:

### Step 1

Upload via CMS form.

### Step 2

File stored:

```text id="e7p8nd"
/project/uploads/members/
```

### Step 3

MongoDB stores path.

Example:

```json id="m9spkv"
{
  "image":
  "/uploads/members/amit.webp"
}
```

### Step 4

Frontend fetches image.

---

# 61. AFTER HOSTING FILE FLOW

Hosting:

```text id="q0wy2x"
IIT internal server
```

Admin uploads image.

System:

### Step 1

Upload through:

```text id="5uw56q"
/admin
```

### Step 2

File stored server-side.

Example:

```text id="jlwm1r"
/var/www/prism/uploads/
```

### Step 3

MongoDB saves path.

### Step 4

Website updates instantly.

No code deployment required.

---

# 62. API ARCHITECTURE

Architecture:

```text id="f3n59g"
Next.js Route Handlers
```

Pattern:

```text id="b4sgoz"
/api/*
```

---

# 63. AUTH API

### Login

```text id="fjcfrk"
POST /api/auth/login
```

Purpose:

```text id="lp6zc6"
Authenticate admin
```

---

### Logout

```text id="uafj8u"
POST /api/auth/logout
```

---

### Verify Session

```text id="vf0q6l"
GET /api/auth/me
```

---

# 64. HERO API

```text id="33ap6t"
GET /api/hero
POST /api/hero
PUT /api/hero/:id
DELETE /api/hero/:id
```

---

# 65. ABOUT API

```text id="7b4j8h"
GET /api/about
PUT /api/about
```

---

# 66. NEWS API

```text id="jlwm5w"
GET /api/news
POST /api/news
PUT /api/news/:id
DELETE /api/news/:id
```

---

# 67. RESEARCH API

```text id="xt2v6s"
GET /api/research
POST /api/research
PUT /api/research/:id
DELETE /api/research/:id
```

---

# 68. PROJECT API

```text id="jlwm0e"
GET /api/projects
POST /api/projects
PUT /api/projects/:id
DELETE /api/projects/:id
```

---

# 69. MEMBERS API

```text id="3k6epp"
GET /api/members
POST /api/members
PUT /api/members/:id
DELETE /api/members/:id
```

---

# 70. PUBLICATIONS API

```text id="akfdl0"
GET /api/publications
POST /api/publications
PUT /api/publications/:id
DELETE /api/publications/:id
```

---

# 71. GALLERY API

```text id="vdnlj8"
GET /api/gallery
POST /api/gallery
PUT /api/gallery/:id
DELETE /api/gallery/:id
```

---

# 72. SPONSORS API

```text id="jlwmu9"
GET /api/sponsors
POST /api/sponsors
PUT /api/sponsors/:id
DELETE /api/sponsors/:id
```

---

# 73. FILE/FOLDER STRUCTURE

```text id="sl4ukn"
/app
│
├── (public)
│   ├── page.tsx
│   ├── research
│   ├── publications
│   └── people
│
├── admin
│   ├── dashboard
│   ├── hero
│   ├── members
│   ├── publications
│   ├── gallery
│   └── settings
│
├── api
│
/components
│
/lib
│
/models
│
/types
│
/hooks
│
/uploads
│
/public
```

---

**END OF PART 4**
**Next: Part 5 → Security, SEO, Performance, Responsiveness, Edge Cases & Deployment**


# PART 5 — SECURITY, SEO, PERFORMANCE, RESPONSIVENESS, EDGE CASES, DEPLOYMENT & ACCEPTANCE CRITERIA

# 74. SECURITY REQUIREMENTS

## Objective

The platform must ensure:

```text id="4ug0vq"
Authentication Security
Data Security
File Upload Security
Session Security
Admin Route Protection
```

Security is mandatory because:

```text id="dr2rso"
Research data
Member data
Publication management
CMS access
```

must remain protected.

---

# 75. AUTHENTICATION SECURITY

## Authentication Method

System shall use:

```text id="eq3jlwm"
JWT Authentication
```

with:

```text id="e9zgm5"
HTTP-only Cookies
```

instead of:

```text id="b7ut2o"
localStorage
sessionStorage
```

because cookies are more secure against:

```text id="0xif3y"
XSS attacks
token theft
```

---

## Session Flow

### Step 1

Admin enters:

```text id="twzc3q"
email
password
```

---

### Step 2

Backend validates credentials.

---

### Step 3

JWT generated.

---

### Step 4

Secure cookie stored.

---

### Step 5

Admin gains access.

---

## Session Expiry

JWT shall expire after:

Recommended:

```text id="c85e68"
24 hours
```

After expiration:

```text id="cqshlw"
Forced re-login
```

---

# 76. ADMIN ROUTE PROTECTION

All admin routes protected.

Example:

```text id="jtbjlwm"
/admin
/admin/members
/admin/publications
/admin/research
/admin/gallery
```

Unauthorized user:

```text id="pvjlwm"
Redirect → /admin/login
```

---

## Middleware Protection

Middleware verifies:

```text id="njlwmf"
valid JWT
session state
authorization
```

before page access.

---

# 77. LOGIN RATE LIMITING

Purpose:

Prevent:

```text id="p9wjlwm"
Brute force attack
credential guessing
```

---

## Rules

Example:

```text id="rjlwm0"
5 failed attempts
```

Then:

```text id="jlwm91"
temporary block for 15 minutes
```

Error message:

```text id="sjlwm3"
Too many failed attempts.
Please try again later.
```

---

# 78. PASSWORD SECURITY

Admin password stored as:

```text id="jlwm82"
hashed password
```

using:

```text id="jlwm27"
bcrypt
```

Never store:

```text id="jlwmx9"
plain text password
```

---

# 79. FILE UPLOAD SECURITY

All uploads validated.

---

## Image Rules

Allowed:

```text id="jlwmi1"
jpg
jpeg
png
webp
```

Maximum:

```text id="jlwmz5"
2MB
```

Invalid file:

```text id="jlwmc8"
Upload rejected
```

---

## PDF Rules

Allowed:

```text id="jlwmw2"
pdf only
```

Maximum:

```text id="jlwm44"
10MB
```

---

## File Sanitization

System renames uploaded files.

Example:

Instead of:

```text id="jlwm6q"
my resume final final.pdf
```

Stored:

```text id="jlwmf2"
member_172839.pdf
```

Purpose:

```text id="jlwmn1"
avoid collision
security
clean storage
```

---

# 80. DATABASE SECURITY

MongoDB access restricted.

Connection:

```text id="jlwmh3"
environment variables
```

Never expose:

```text id="jlwmq8"
database URI
JWT secret
admin credentials
```

inside frontend code.

---

# 81. ENVIRONMENT VARIABLES

Stored in:

```text id="jlwmt7"
.env.local
```

Example:

```env
MONGODB_URI=
JWT_SECRET=
ADMIN_EMAIL=
ADMIN_PASSWORD=
NEXT_PUBLIC_BASE_URL=
```

Must NOT push:

```text id="jlwm66"
.env.local
```

to GitHub.

---

# 82. SEO REQUIREMENTS

## Objective

Improve:

```text id="jlwm2r"
Research discoverability
Google indexing
Academic visibility
```

---

## Metadata

Every page must include:

```text id="jlwmgo"
title
description
keywords
OpenGraph tags
Twitter cards
canonical URLs
```

---

## Example

Research page:

Title:

```text id="jlwmv5"
Research Areas | Prism Lab IIT Patna
```

Description:

```text id="jlwmm9"
Explore research areas conducted at Prism Lab IIT Patna.
```

---

## Structured URLs

Required.

Example:

Correct:

```text id="jlwm5n"
/research/areas/machine-learning-healthcare
```

Wrong:

```text id="jlwm0r"
/page?id=121
```

---

## Sitemap

Required:

```text id="jlwm8v"
sitemap.xml
```

Must include:

```text id="jlwm92"
research
members
publications
projects
PI
```

---

## Robots File

Required:

```text id="jlwmc0"
robots.txt
```

Allow indexing of public pages.

Block:

```text id="jlwmn7"
/admin
```

---

# 83. PERFORMANCE REQUIREMENTS

Website should feel:

```text id="jlwm91"
Fast
Modern
Smooth
```

---

## Loading Time

Target:

```text id="jlwm4k"
under 3 seconds
```

---

## Image Optimization

Use:

```text id="jlwmn0"
Next.js Image Component
```

Features:

```text id="jlwm1f"
lazy loading
responsive images
optimization
```

---

## Code Splitting

Use:

```text id="jlwm7t"
dynamic imports
```

for heavy components.

Example:

```text id="jlwmp4"
gallery
editor
tables
```

---

## Pagination

Large publication tables:

Use:

```text id="jlwm9g"
pagination
```

instead of loading everything.

---

# 84. RESPONSIVENESS REQUIREMENTS

## Desktop

Full experience.

---

## Tablet

Adaptive layout.

---

## Mobile

Optimized navigation.

Features:

```text id="jlwm2x"
hamburger menu
stacked layouts
touch-friendly buttons
optimized spacing
```

---

## Cards

Must remain responsive.

No:

```text id="jlwm4n"
overflow
broken alignment
```

allowed.

---

# 85. ACCESSIBILITY REQUIREMENTS

Minimum accessibility support required.

Includes:

```text id="jlwm7r"
keyboard navigation
screen-reader labels
contrast support
focus indicators
```

---

## Buttons

Must have:

```text id="jlwmq3"
hover
focus
active state
```

---

# 86. DARK MODE REQUIREMENTS

Themes:

```text id="jlwm0a"
Light
Dark
```

Switch behavior:

```text id="jlwmc4"
smooth transition
persist state
```

Dark mode must support:

```text id="jlwmv2"
good readability
accessible contrast
```

---

# 87. ANIMATION REQUIREMENTS

Using:

Framer Motion

---

## Required Effects

### Section reveal

```text id="jlwm8w"
fade-up
scroll reveal
```

---

### Hover

Cards:

```text id="jlwmm1"
3D tilt
scale
elevation
```

---

### Navbar

Dropdown animation.

---

### Page Transition

Smooth transition required.

---

## Restriction

Animations must be:

```text id="jlwm5u"
subtle
professional
research-oriented
```

No flashy animations.

---

# 88. EDGE CASES

System must gracefully handle:

---

## Empty Research

If no research exists:

```text id="jlwm6s"
No research areas available
```

---

## Empty Publications

Display:

```text id="jlwm3l"
No publications available
```

---

## Missing Image

Fallback placeholder image.

---

## Missing PDF

Hide:

```text id="jlwm0d"
Download PDF button
```

---

## Broken External Link

Open safely:

```text id="jlwm9z"
new tab
noopener noreferrer
```

---

## Empty Collaborator Page

Display:

```text id="jlwmt5"
Collaborators will be updated soon.
```

---

## Empty Alumni Page

Display:

```text id="jlwm3j"
Alumni information coming soon.
```

---

# 89. BACKUP STRATEGY

Required:

```text id="jlwm4m"
Weekly automatic backup
```

---

## Backup Includes

### MongoDB

Collections backup.

---

### Uploads Folder

Backup:

```text id="jlwm6v"
/uploads
```

Includes:

```text id="jlwm9m"
hero
gallery
research
members
publications
resume
sponsors
```

---

## Backup Goal

Prevent loss from:

```text id="jlwmk2"
server crash
accidental deletion
corruption
```

---

# 90. DEPLOYMENT ARCHITECTURE

Deployment target:

```text id="jlwm7x"
IIT Patna Internal Server
```

---

## Deployment Stack

```text id="jlwmq1"
Linux Server
Node.js
MongoDB Community Edition
PM2
Nginx
```

---

## Deployment Structure

```text id="jlwm5b"
/var/www/prism-lab
│
├── .next
├── uploads
├── app
├── components
├── public
├── package.json
│
└── ecosystem.config.js
```

---

## Server Process

Run using:

```text id="jlwmz0"
PM2
```

Purpose:

```text id="jlwmr7"
auto restart
process management
monitoring
```

---

## Reverse Proxy

Use:

```text id="jlwmv6"
Nginx
```

for:

```text id="jlwm1p"
security
HTTPS
routing
performance
```

---

# 91. BEFORE HOSTING CMS WORKFLOW

Admin accesses:

```text id="jlwm6k"
localhost:3000/admin/login
```

Uploads:

```text id="jlwmf7"
member image
resume
publication PDF
gallery image
```

Stored locally:

```text id="jlwmx4"
/project/uploads
```

MongoDB stores path.

Frontend fetches automatically.

---

# 92. AFTER HOSTING CMS WORKFLOW

Admin accesses:

```text id="jlwm9q"
https://domain/admin/login
```

Uploads content.

System:

### Step 1

Upload received.

---

### Step 2

Saved to:

```text id="jlwm8p"
/var/www/prism/uploads
```

---

### Step 3

MongoDB stores:

```text id="jlwm5j"
file path
metadata
```

---

### Step 4

Website updates instantly.

No redeploy.

No restart required.

---

# 93. ACCEPTANCE CRITERIA

Project considered complete if:

---

## User Panel

All pages functional.

---

## Admin Panel

Every section editable.

---

## Uploads

Files saved correctly.

---

## Security

Protected admin routes.

---

## Publications

Autocomplete linking works.

---

## Members

Correct grouping works.

---

## Gallery

Lightbox works.

---

## Hero

3-second auto-slide works.

---

## Sponsors

Infinite marquee works.

---

## Theme

Dark/light works.

---

## Responsive

All devices supported.

---

## SEO

Metadata present.

---

## Deployment

Works on IIT server.

---

# 94. FUTURE SCALABILITY

Future enhancements possible:

```text id="jlwm1m"
Multiple admins
Analytics dashboard
Research metrics
Email integration
ORCID integration
Advanced search
Publication import
```

---

# 95. FINAL ARCHITECTURE SUMMARY

```text id="jlwm2n"
Frontend:
Next.js 14

Backend:
Next.js Route Handlers

Runtime:
Node.js

Database:
MongoDB + Mongoose

Authentication:
JWT + HTTP-only cookies

Styling:
Tailwind CSS + ShadCN

Animations:
Framer Motion

Editor:
TipTap

Upload:
Local server storage

Deployment:
IIT Server + PM2 + Nginx
```

# END OF COMPLETE PRD + SRS DOCUMENT
