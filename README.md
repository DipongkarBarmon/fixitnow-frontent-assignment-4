# FixItNow - Professional Home Service Marketplace

![FixItNow Preview](https://img.shields.io/badge/Status-Active-brightgreen.svg)
![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?logo=tailwind-css&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)
![React Query](https://img.shields.io/badge/React_Query-FF4154?logo=react-query&logoColor=white)

FixItNow is a comprehensive, responsive, and dynamic platform connecting customers with trusted technicians for various home services (plumbing, electrical, cleaning, etc.). It features three distinct dashboards tailored for Customers, Technicians, and Administrators, providing an end-to-end service management ecosystem.

## 🚀 Live Demo & Links
- **Frontend Production URL:** [https://fixitniw-frontend.vercel.app](https://fixitniw-frontend.vercel.app)
- **Backend API Base URL:** `https://assginment-4.vercel.app`

---

## 🔑 Admin Credentials
To access the Admin Console and explore platform management features, log in using the following credentials:
- **Email:** `admin@gmail.com`
- **Password:** `12345678`

---

## 📖 Comprehensive Feature Breakdown

### 1. 🛡️ Role-Based Access Control (RBAC)
The application strictly segregates user experiences based on their authentication roles:
- **Middleware Protection:** Next.js middleware combined with client-side context ensures users are securely routed away from unauthorized dashboards.
- **JWT Authentication:** Secure token-based authentication handling `httpOnly` cookies via the backend.

### 2. 👤 Customer Experience
- **Dynamic Service Catalog:** Customers can browse through an extensive list of services, dynamically categorized and fully searchable.
- **Real-Time Booking System:** Customers can select specific technicians based on their published availability slots.
- **Secure Checkout & Payments:** End-to-end payment workflow. Customers can initiate payments seamlessly. Once payment is confirmed, the system instantly upgrades the booking status.
- **Dashboard & Tracking:** A highly visual, glassmorphism dashboard allows customers to track active bookings, view payment histories, and leave reviews for completed jobs.

### 3. 🛠️ Technician Portal
- **Availability Management:** Technicians have a dedicated calendar interface to block out dates and set precise time slots (e.g., 09:00 AM - 11:00 AM).
- **Booking Lifecycle Control:** 
  - **Review Requests:** Accept or decline incoming service bookings.
  - **Progress Tracking:** Update status to `IN_PROGRESS` when on-site, and `COMPLETED` once the job is finished.
- **Performance Metrics:** Technicians can view their personal earnings (Revenue) and track how many jobs they've successfully completed.

### 4. 👑 Administrator Console
- **Platform Analytics:** Real-time data aggregation displaying Total Marketplace GMV, Platform Net Revenue (10% cut), Job Completion Rates, and Monthly Active Users.
- **Live Bookings Feed:** A real-time oversight feed showing all cross-platform bookings as they happen.
- **User Moderation:** Full CRUD operations over the user base. Admins can ban malicious users or elevate privileges.
- **Catalog Management:** Admins can dynamically create, edit, and delete service categories which instantly updates the customer-facing catalog.

---

## 🎨 UI/UX Design Philosophy
- **Glassmorphism:** Heavy use of backdrop blurs, semi-transparent backgrounds, and glowing gradients to create a modern, premium feel.
- **Mobile-First Responsive Design:** Built meticulously with Tailwind's utility classes. Dashboards elegantly collapse into hamburger menus (via Radix UI Sheets) and grids adapt from 4-columns to single-column feeds on smaller screens.
- **Feedback & Micro-interactions:** Utilization of `sonner` for toast notifications, skeleton loaders for asynchronous data fetching, and hover scaling on interactive elements.

---

## 💻 Technical Architecture & Stack

### Frontend Core
- **Framework:** [Next.js 14](https://nextjs.org/) (App Router paradigm)
- **Language:** TypeScript for strict type-safety across components and API responses.
- **Data Fetching:** [React Query v5](https://tanstack.com/query/latest) integrated via custom hooks (e.g., `useBookings`, `useAdminStats`) for intelligent caching, automatic refetching, and simplified loading states.
- **Styling:** [Tailwind CSS](https://tailwindcss.com/) paired with [shadcn/ui](https://ui.shadcn.com/) for accessible, unstyled component primitives.

### Directory Structure Highlights
```text
├── app/
│   ├── (authGroup)/       # Login, Register pages
│   ├── (dashboardGroup)/  # Admin, Tech, and Customer layouts & pages
│   ├── (publicGroup)/     # Marketing landing page, catalog, about us
│   └── layout.tsx         # Global Root Layout
├── components/
│   ├── cards/             # Reusable stat cards, service cards
│   ├── shared/            # Navbar, Status Badges, Confirm Dialogs
│   └── ui/                # shadcn/ui primitives
├── hooks/                 # Centralized React Query hooks (API calls)
├── providers/             # AuthContext, ThemeProvider, QueryClientProvider
└── utils/                 # Formatting utilities (currency, dates, initials)
```

---

## ⚙️ Local Development Setup

### 1. Prerequisites
Ensure you have the following installed on your machine:
- [Node.js](https://nodejs.org/) (v18 or higher)
- [pnpm](https://pnpm.io/) (Recommended) or npm

### 2. Installation
Clone the repository and install all dependencies:
```bash
git clone https://github.com/DipongkarBarmon/fixitnow-frontent-assignment-4.git
cd fixitnow-frontent-assignment-4
pnpm install
```

### 3. Environment Variables
Create a `.env.local` file in the root directory. You must point this to your running backend instance.
```env
# Point this to your local backend (e.g., http://localhost:5000) or your production backend
NEXT_PUBLIC_API_URL=http://localhost:5000
```

### 4. Running the Application
Start the Next.js development server:
```bash
pnpm dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser. Any changes made to the code will hot-reload automatically.

### 5. Building for Production
To create an optimized production build:
```bash
pnpm build
pnpm start
```

---

## 🤝 Contribution Guidelines
1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

*FixItNow was built to demonstrate advanced full-stack capabilities, seamless API integration, and premium user interface design.*
