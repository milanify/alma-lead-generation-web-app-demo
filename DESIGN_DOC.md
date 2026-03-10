# Design Document: Alma Lead Generation Web App

This document outlines the architectural and design choices made during the development of the Alma Lead Generation web application.

## Core Technology Stack

1. **Next.js (App Router):** Chosen as the core framework. It provides built-in routing, API creation capabilities (for the bonus requirement), and excellent developer experience.
2. **React + TypeScript:** Used for building type-safe UI components, specifically adding type validations for the `Lead` interfaces and API payloads.
3. **Tailwind CSS v4:** Chosen for styling the application exactly according to the provided mockups. It enables rapid utility-class styling directly in components while allowing standard CSS overrides when necessary.
4. **Redux Toolkit:** Selected for state management (bonus requirement) in the Admin dashboard, specifically to manage the leads list state and simplify status transitions without deeply polling the backend API on every click.
5. **Lucide React:** Used for SVG icons (Search, Chevron, Icons in the assessment mock) as it's lightweight and easy to style with Tailwind.

## Key Design Decisions

### 1. Form Implementation Strategy
Initially, `@jsonforms` was provided in the project. While JSONForms is powerful for configuration-driven UIs, accurately matching the high-fidelity design mockups (custom file upload input, animated visa selection cards, floating layout nuances) required extreme overrides. 
**Decision:** I chose to rewrite `LeadForm.tsx` using standard controlled React components. This ensured pixel-perfect alignment with the design spec—especially the file upload experience and the interactive checkbox styling—while maintaining strict local state validation.

### 2. Mock API & Data Persistence
To meet the requirements without a real database, I utilized Next.js **Route Handlers** (`app/api/leads`). 
**Decision:** The data is temporarily persisted in a mock in-memory array (`lib/mockDb.ts`). The `GET` route retrieves this data, the `POST` route pushes new entries, and the `PATCH` route updates the status of specific leads. This fulfills the bonus objective of implementing server-side API routes.

### 3. Redux Architecture
**Decision:** I implemented Redux via `@reduxjs/toolkit` and integrated it at the layout level for the admin folder (`app/admin/layout.tsx`). The `leadsSlice` manages the asynchronous thunk fetching calls to the API and handles optimistic UI updates when a lead's status is toggled from "PENDING" to "REACHED_OUT". This provides instant visual feedback while ensuring the backend stays synchronized.

### 4. Admin Authentication
**Decision:** For the scope of this assignment, I implemented a simple mock authentication guard in the `AdminDashboard`. In a production scenario, this would be replaced by a robust solution like NextAuth.js or Clerk with session cookies.

### 5. UI/UX Considerations
- **Component Styling:** Special attention was given to match the colors, typography weight, shadow elevation, and interactive hover states (e.g., table row hover, button transitions) specified in the mockup. 
- **Accessibility/UX:** Visual feedback is provided when fields are missed (error messages), and focus states are clearly delineated using Tailwind `focus:ring` utilities.
