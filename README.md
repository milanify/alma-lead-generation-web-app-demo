# Alma Leads Management System

## System Design & Architecture

This application is built using **Next.js 14 (App Router)** to leverage Server-Side Rendering (SSR) and API routes within a single unified framework.

### Key Architectural Choices:

1. **Frontend Framework (Next.js & React):** Provides a robust, SEO-friendly, and highly performant foundation. The App Router facilitates clean layout nesting (e.g., the Admin layout vs. Public layout).
2. **State Management (Redux Toolkit):** Chosen for predictable state updates, especially useful in the Admin dashboard where lead statuses (`PENDING` -> `REACHED_OUT`) need to be reflected immediately across the UI without redundant API calls.
3. **Form Rendering (JSONForms):** Implemented to satisfy the configuration-driven UI requirement. The schema defines the data structure and validation, while the UI schema defines the layout.
4. **Styling (Tailwind CSS):** Used for rapid, utility-first styling to accurately match the provided Figma/Mockup screens while ensuring mobile responsiveness.
5. **Mocked Backend (Next.js API Routes):** We use Next.js Route Handlers (`/api/leads`, `/api/auth`) with an in-memory array to simulate a database. File uploads are mocked by converting files to Base64 strings.

### How to Run Locally

1. Clone the repository.
2. Run `npm install`.
3. Run `npm run dev`.
4. Navigate to `http://localhost:3000` for the Public Form.
5. Navigate to `http://localhost:3000/admin` for the Internal Dashboard. (login credentials are: `admin` and `password`).

### Testing

Run `npm run test` to execute the Jest unit tests.
