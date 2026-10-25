# 🅿️ Vanak Frontend (ونک - سامانه هوشمند رزرو و مدیریت پارکینگ)

[![React Version](https://img.shields.io/badge/React-19.1-61DAFB?style=flat-square&logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-7.1-646CFF?style=flat-square&logo=vite)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![Zustand](https://img.shields.io/badge/State-Zustand-orange?style=flat-square)](https://zustand.docs.pmnd.rs/)
[![TanStack Query](https://img.shields.io/badge/Data_Fetching-React_Query_v5-FF4154?style=flat-square&logo=react-query)](https://tanstack.com/query)
[![Leaflet](https://img.shields.io/badge/Map-Leaflet-199900?style=flat-square&logo=leaflet)](https://leafletjs.com/)
[![Docker](https://img.shields.io/badge/Docker-Multi--stage-2496ED?style=flat-square&logo=docker)](https://www.docker.com/)

**Vanak Frontend** is the modern, mobile-first, and RTL-optimized Single Page Application (SPA) for the **Vanak (VParking)** smart parking management and reservation platform. Built with **React 19**, **TypeScript**, **Vite**, **Tailwind CSS v4**, and **Shadcn / Radix UI**.

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Prerequisites](#-prerequisites)
- [Getting Started](#-getting-started)
- [Configuration & API Base URL](#-configuration--api-base-url)
- [Key Modules & UI Components](#-key-modules--ui-components)
- [State Management (Zustand & React Query)](#-state-management)
- [Docker & Production Deployment](#-docker--production-deployment)
- [CI/CD Pipeline](#-cicd-pipeline)
- [Contributing Guidelines](#-contributing-guidelines)

---

## ✨ Features

- **🗺️ Interactive Map-based Parking Discovery**:
  - Full-screen and card-view map powered by **Leaflet** & **React-Leaflet**.
  - Interactive pins showing real-time parking capacity, pricing, and distance.
  - Search and filter by city, amenities (CCTV, Covered, 24/7 Security, EV charging), and price range.
- **📅 Smart Slot Booking Flow**:
  - Persian / Jalali calendar date-time picker (`react-multi-date-picker`).
  - Real-time availability calculation and slot selection.
  - Integration with user's registered vehicles and wallet checkout.
- **🚘 Specialized Iranian License Plate Component**:
  - Custom UI supporting standard Iranian license plates (۲ رقم، حرف فارسی، ۳ رقم، ایران کد).
  - Validation, formatting, and Persian digit handling.
- **👤 User Dashboard**:
  - User profile editing with avatar upload.
  - Vehicle management: Add, view, edit, and delete vehicles.
  - Reservation history: View active, past, and cancelled reservations with status indicators.
  - Digital Wallet: Real-time balance, transaction log, and mock gateway top-up.
- **🏢 Parking Owner & Admin Panel**:
  - Multi-step parking registration wizard (address geocoding, capacity, amenities, document upload).
  - Parking manager dashboard to monitor reservations, slots, and revenue.
- **📱 Persian / RTL-First & Mobile Responsive**:
  - Native RTL layout, Persian typography (Vazirmatn), and responsive UI tuned for mobile, tablet, and desktop.
  - Smooth micro-interactions and animations powered by **Framer Motion**.
  - Accessible, customizable components based on **Radix UI** and **Shadcn UI**.

---

## 🛠️ Tech Stack

| Technology | Purpose |
| :--- | :--- |
| **React 19** | Core UI Library |
| **TypeScript 5.8** | Static Type Safety |
| **Vite 7** | Next-generation Frontend Build Tool & Dev Server |
| **Tailwind CSS v4** | Utility-first CSS Engine |
| **Zustand 5** | Lightweight Client State Management (Persisted Storage) |
| **TanStack React Query v5** | Server State, Caching, and Async Data Fetching |
| **Leaflet & React-Leaflet** | Interactive OpenStreetMap Mapping |
| **Radix UI / Shadcn** | Headless Accessible UI Primitives |
| **Framer Motion 12** | Fluid Motion and Page Transitions |
| **Formik & Yup** | Form Handling and Schema Validation |
| **React Router v7** | Client-side Declarative Routing |
| **Recharts** | Analytical Dashboard Charts |
| **Sonner** | Modern Toast Notifications |
| **Axios** | HTTP Client with Interceptors |

---

## 📂 Project Structure

```
frontend/
├── public/                 # Static assets, logos, and favicons
├── docker/
│   ├── Dockerfile          # Multi-stage production build (Node 20 -> Nginx)
│   └── nginx.conf          # Nginx SPA fallback routing configuration
├── src/
│   ├── assets/             # Images, SVGs, and brand illustrations
│   ├── components/
│   │   ├── Custom/         # Specialized components (Plate input, Map cards, OTP input)
│   │   └── ui/             # Reusable Shadcn/Radix UI components (Button, Dialog, etc.)
│   ├── layouts/            # Page layouts (Navbar, Sidebar, Footer, MobileNav)
│   ├── pages/              # Route views
│   │   ├── admin/          # Admin & Parking Registration views
│   │   ├── dashboard/      # User Profile, Vehicles, Reservations, MyParking
│   │   ├── Landing.tsx     # Homepage with hero section and feature showcase
│   │   ├── exploreParking.tsx # Map exploration and search view
│   │   ├── ParkingProfile.tsx # Parking details & booking page
│   │   ├── Login.tsx       # OTP Authentication modal/page
│   │   └── Wallet.tsx      # In-app wallet and transaction logs
│   ├── routes/
│   │   └── route.tsx       # Centralized route definitions
│   ├── services/           # Axios HTTP client, API methods, and endpoints
│   ├── store/              # Zustand stores (Profile, Auth, App state)
│   ├── types/              # TypeScript definitions and API DTOs
│   ├── utils/              # Helper utilities (Persian number translation, formatting)
│   ├── App.tsx             # Root component with providers
│   └── main.tsx            # React application bootstrap
├── .gitlab-ci.yml          # Automated CI/CD (HamDocker & VPS Deployment)
├── package.json            # Project dependencies and npm scripts
├── tailwind.config.ts      # Tailwind CSS configuration
├── tsconfig.json           # TypeScript configuration
├── vite.config.ts          # Vite build configuration
└── README.md               # Frontend documentation
```

---

## ⚙️ Prerequisites

- **Node.js**: `v20.x` or `v22.x` (LTS recommended)
- **npm**: `v10+` or **pnpm** / **yarn**

---

## 🚀 Getting Started

### 1. Installation

Clone the repository and install dependencies:

```bash
cd frontend
npm install
```

### 2. Running Development Server

Start the Vite development server with Hot Module Replacement (HMR):

```bash
npm run dev
```

The application will be accessible at: **[http://localhost:3000](http://localhost:3000)** (or the port specified by Vite).

### 3. Production Build & Preview

```bash
# Type check and build optimized bundle
npm run build

# Preview the production build locally
npm run preview
```

### 4. Linting

```bash
npm run lint
```

---

## 🌐 Configuration & API Base URL

The backend API URL is configured in [`src/services/services.ts`](file:///src/services/services.ts):

```typescript
// Production / Staging backend
export const baseURL = "https://vparking.ir";

// For local development with backend running locally:
// export const baseURL = "http://localhost:8080";
```

All HTTP requests automatically include credentials, bearer tokens (when authenticated), and global error handlers with user-friendly toast messages.

---

## 🧩 Key Modules & UI Components

### 1. Iranian License Plate Component
Located in `src/components/Custom/PlateComponent/`, this component renders an authentic Iranian vehicle plate:
- Left: 2-digit serial
- Center: Persian character selector (الف، ب، پ، ...)
- Right: 3-digit number
- Far-Right: Iran province code flag (ایران - ۱۱)

### 2. Interactive Map Explorer (`exploreParking.tsx`)
- Integrates Leaflet with custom SVG markers indicating open and occupied spots.
- Click-to-view popup cards with quick reservation triggers.
- Live geolocation centering.

### 3. Persian Date Picker
- Leverages `react-multi-date-picker` with Persian calendar and Jalali dates (`date-fns-jalali`) to guarantee accurate scheduling for Iranian users.

---

## 🗄️ State Management

### 1. Client State with Zustand
Located in `src/store/`:
- `useProfileStore`: Stores authenticated user details and persists to `sessionStorage` or `localStorage`.

```typescript
import useProfileStore from "@/store/useProfileStore";

// In component:
const { username, setUsername } = useProfileStore();
```

### 2. Server State with TanStack React Query
- Handles caching, optimistic updates, and background refetching for parkings, vehicles, and reservations without manual synchronization bugs.

---

## 🐳 Docker & Production Deployment

A production-ready multi-stage Docker build is provided:

```dockerfile
# Stage 1: Build React app using Node 20 Alpine
# Stage 2: Serve compiled static files with Nginx Alpine
```

### Build & Run Docker Container Locally:

```bash
# Build the image
docker build -f docker/Dockerfile -t vanak-frontend:latest .

# Run container on port 3000
docker run -d --name vanak-frontend -p 3000:80 vanak-frontend:latest
```

The bundled `nginx.conf` handles client-side routing fallback:
```nginx
location / {
    try_files $uri $uri/ /index.html;
}
```

---

## 🔄 CI/CD Pipeline

Continuous Integration & Deployment is automated via GitLab CI (`.gitlab-ci.yml`):
1. **`build-and-push`**: Compiles the Docker image and pushes it with the commit SHA and `:latest` tag to `registry.hamdocker.ir`.
2. **`deploy`**: Logs into the VPS runner, pulls the latest container image, and deploys it automatically on port `3000`.
3. **Trigger**: Pushes to `main` or commit messages starting with `[deploy]`.

---

## 🤝 Contributing Guidelines

1. **Branch Naming**: Use kebab-case: `feat/<feature-name>`, `fix/<bug-name>`, `docs/<name>`.
2. **Code Style**: Run `npm run lint` before committing to ensure TypeScript and ESLint standards.
3. **Commit Messages**: Follow conventional commits:
   - `feat(map): add cluster markers for parking view`
   - `fix(plate): resolve license plate validation on mobile`
   - `docs(readme): add comprehensive frontend documentation`
