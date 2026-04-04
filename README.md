# Financial Dashboard

A modern personal finance dashboard built with React, TypeScript, Tailwind CSS, and Zustand.  
It helps users track transactions, view income vs expenses, and analyze spending trends with charts.

## Project Overview

This project is a frontend-first finance dashboard focused on:

- Fast local state updates
- Clear visual analytics
- Simple role-based permissions
- Persistent browser storage (local-first behavior)

The app starts with seeded mock transaction data and lets admins add or delete transactions while viewers can only explore data.

## Features

- Summary cards for:
  - Total balance
  - Total income
  - Total expenses
- Balance trend chart (time-series line/area)
- Category spending chart (pie chart + percentages)
- Insights panel for top spending category and biggest transaction
- Transaction table with:
  - Search
  - Category filter
  - Pagination
- Add transaction modal (admin only)
- Delete transaction action (admin only)
- Role switcher (`viewer` / `admin`)
- Persistent state with Zustand `persist` middleware

## Tech Stack

- React 19
- TypeScript
- Vite
- Tailwind CSS v4
- Zustand
- Recharts
- Lucide React

## Why Zustand

Zustand was chosen because it keeps state management simple and lightweight for this size of app.

- Minimal boilerplate compared to Redux-style patterns
- Easy co-location of actions and state
- Great performance with selective subscriptions
- Straightforward persistence using `zustand/middleware` (`persist`)
- Works very well with TypeScript

For this dashboard, Zustand is enough to manage transactions + role data without introducing unnecessary complexity.

## RBAC (Role-Based Access Control)

This app uses a simple frontend RBAC model with two roles:

- `viewer`
  - Can view dashboard data, charts, and transactions
  - Cannot add or delete transactions
- `admin`
  - Can do everything a viewer can
  - Can add transactions
  - Can delete transactions

### How It Works

- Role is stored in global Zustand state.
- The role selector in the navbar updates that state.
- Components conditionally render sensitive controls based on `role === "admin"`.
  - Example: `Add Transaction` button and `Delete` action are hidden for viewers.
- Role is also persisted in local storage.

Note: This is UI-level RBAC intended for frontend demonstration. Real production RBAC must be enforced on backend APIs as well.

## Setup Instructions

### Prerequisites

- Node.js 20+ recommended
- npm 10+ recommended

### Install

```bash
npm install
```

### Run Development Server

```bash
npm run dev
```

### Lint

```bash
npm run lint
```

### Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Overview of Approach

- State and actions are centralized in a single Zustand store (`transactions`, `role`, and CRUD actions).
- UI is split into focused, reusable components:
  - Layout (`Navbar`)
  - Analytics (`SummaryCards`, `BalanceChart`, `SpendingChart`, `InsightsPanel`)
  - Data management (`TransactionTable`, `AddTransactionModal`)
- Pure helper functions compute summaries and category breakdowns.
- Styling is done with utility-first Tailwind classes for rapid iteration and consistent visuals.
- Persistence keeps user changes across page reloads.

## Project Structure

```text
src/
  components/
    charts/
    dashboard/
    insights/
    layout/
    transactions/
    ui/
  data/
  pages/
  store/
  types/
```

