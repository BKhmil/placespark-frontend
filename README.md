# PlaceSpark Frontend

A modern, minimalist, and adaptive frontend for the PlaceSpark platform.

P.S.: The project is in the development phase. All internationalization (i18n), adaptive layout, and final design elements will be implemented after the MVP has been delivered.

## Overview

PlaceSpark is a full-stack web application for discovering, filtering, and managing establishments. The frontend is built with React, TypeScript, Vite, and follows best practices for code structure, state management, and UI/UX.

## Key Technologies

- **React 19**
- **TypeScript**
- **Vite**
- **Redux Toolkit & RTK Query**
- **React Hook Form**
- **Tailwind CSS** (with dark mode)
- **i18next** (English & Ukrainian)
- **React Router v6**

## Main Features

- User registration, login, and authentication flows
- Token refresh and session validation (ping endpoint)
- Establishments listing with advanced filtering, sorting, and search
- Pagination with blocks of 10 pages
- Sticky header, theme and language switchers
- Personal cabinet with role-based UI (user & superadmin)
- Geolocation-based sorting with permission handling
- Logout modal with options (single/all devices)
- URL synchronization for filters
- Full i18n support with logical key grouping
- Responsive, accessible, and clean UI

## Project Structure

```
src/
  components/         # Reusable UI components (Header, Pagination, Modals, etc.)
  constants/          # App-wide constants (filter options, pagination, etc.)
  enums/              # Enums for types, features, sorting, etc.
  helpers/            # Utility and parser functions
  hooks/              # Custom React hooks (typed Redux, theme, etc.)
  interfaces/         # TypeScript interfaces
  layouts/            # Layout components (MainLayout, etc.)
  locales/            # i18n translation files (en, ua)
  pages/              # Page components (Home, Auth, Profile, etc.)
  redux/              # Redux Toolkit slices and RTK Query APIs
  router/             # React Router configuration
  assets/             # Static assets (images, icons)
  App.tsx             # App entry point
  main.tsx            # Vite entry point
```

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- npm or yarn

### Installation

```bash
npm install
# or
yarn install
```

### Development

```bash
npm run dev
# or
yarn dev
```

### Build

```bash
npm run build
# or
yarn build
```

### Lint

```bash
npm run lint
```

## Contact

For questions, suggestions, or feedback, please contact the project maintainer.
