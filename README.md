# KPI Dashboard - Bella Terra

This project is a comprehensive KPI (Key Performance Indicator) Dashboard built for Bella Terra to track and visualize marketing and sales performance metrics. It aggregates data from various channels (SMS, Cold Calls, Mail, Inbound) and presents actionable insights through interactive charts and data tables.

## 🚀 Features

### Dashboard Overview

The dashboard provides a high-level view of:

- **Daily Performance:** KPI Cards showing critical metrics with daily percentage changes.
- **Lead Generation:** Visual breakdown of leads by source (SMS, Cold Call, Mail).
- **Sales Funnel:** A complete funnel visualization tracking the journey from initial Outreach to Signed Contracts.
- **Conversion Rates:** Analysis of conversion efficiency at each stage of the pipeline.
- **Team Performance:** Metrics grouped by team members to track individual contributions.

### Key Metrics Tracked

- **Outreach:** SMS Sent, Cold Calls Made, Mail Received.
- **Leads:** SMS Leads, Cold Call Leads, Hot/Warm Leads, Total Inbound.
- **Sales Pipeline:** Compared Properties, Offers Sent, Contracts Sent, Signed Contracts.
- **Derived Rates:**
  - SMS Lead Rate
  - Cold Call Rate
  - Qualification Fee
  - Close Rate

### Tech Stack

- **Frontend:** React, TypeScript, Vite
- **Styling:** Tailwind CSS, Shadcn UI
- **Data Visualization:** Recharts
- **State Management:** TanStack Query (React Query)
- **Backend/Integration:** Supabase (Edge Functions), Airtable (Data Source)
- **Routing:** React Router

## 🛠️ Setup & Installation

1. **Clone the repository:**

   ```bash
   git clone <repository-url>
   cd kpi-page
   ```

2. **Install dependencies:**

   ```bash
   npm install
   # or
   bun install
   ```

3. **Environment Variables:**
   Create a `.env` file in the root directory with the following Supabase configuration:

   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```

## 📂 Project Structure

- **`src/components/dashboard/`**: Contains all the visualization components (Charts, KPI Cards, Data Tables).
- **`src/data/`**: Mock data definitions and types for development.
- **`src/hooks/`**: Custom hooks, including `useAirtableData` for fetching live data.
- **`src/pages/`**: Main application pages (`Index.tsx` is the primary dashboard).
- **`supabase/functions/fetch-airtable/`**: Edge function responsible for securely fetching and transforming data from Airtable.

## 🔌 Integrations

### Airtable & Supabase

The application uses a Supabase Edge Function (`fetch-airtable`) to act as a secure proxy between the frontend and Airtable.

- **Data Flow:** Frontend -> Supabase Edge Function -> Airtable API -> Frontend.
- **Transformation:** The Edge Function handles data normalization and calculates derived rates (e.g., Close Rate %) before sending it to the client.

## 🎨 UI/UX

- **Theme:** Supports Light/Dark mode toggling.
- **Responsive:** Fully responsive design utilizing Tailwind CSS.
- **Interactive:** Hover states on charts and sortable data tables.
