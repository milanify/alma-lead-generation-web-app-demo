# How to Run Locally

This document explains how to run the Alma Lead Generation Web App Demo locally on your machine.

## Prerequisites

- Node.js (v18.x or v20.x recommended)
- npm (v9.x or higher)

## Setup Instructions

1. **Install Dependencies**
   Navigate to the project root directory and run the following command to install all necessary packages:
   ```bash
   npm install
   ```

2. **Run the Development Server**
   Start the Next.js development server by running:
   ```bash
   npm run dev
   ```

3. **Access the Application**
   - **Public Form:** Open your browser and navigate to [http://localhost:3000](http://localhost:3000). You will see the public Lead Form.
   - **Admin Dashboard:** Navigate to [http://localhost:3000/admin](http://localhost:3000/admin). 
     - *Note:* The application uses an automatic mock authentication for the admin route, bypassing login hurdles for review purposes.

4. **Production Build**
   To test the optimized production build, run:
   ```bash
   npm run build
   npm run start
   ```

## Key Features to Test

- **Public Form Validation:** Try submitting an empty form to see the validation errors.
- **File Upload:** Attach a mock file using the custom UI element to pass form validation. 
- **Lead Submission:** Submit the form and observe the "Thank You" confirmation screen.
- **State Management:** Open the `http://localhost:3000/admin` dashboard and verify that the submitted lead has been populated.
- **Status Transition:** In the Admin Dashboard, click the "Pending" status button on a lead row to transition it to "Reached Out".
