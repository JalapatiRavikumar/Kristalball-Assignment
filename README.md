# 🔮 Kristallball Military Asset Management System

A comprehensive, role-based military asset management dashboard built with React, TypeScript, and Vite. Designed to manage military bases, equipment purchases, asset transfers, and personnel assignments with real-time data persistence.

## ✨ Features

- **Role-Based Access Control (RBAC):**
  - 🛡️ **Admin**: Full system access (create, view, and approve anything).
  - ⚔️ **Commander**: Base operations (can view all, initiate transfers, and assign assets).
  - 📦 **Logistics**: Asset management (can view all, create purchase orders, and manage inventory).
- **Global Data Persistence:** Uses a shared `DataContext` with `sessionStorage` to maintain state across different role logins during the same session.
- **Dynamic Dashboard:** Real-time metrics and Recharts visualizations (Inventory Trends, Equipment Breakdowns) that instantly update based on base and equipment filters.
- **Modern UI/UX:** Sleek dark-mode aesthetic with Lucide icons, glassmorphism, smooth animations, and fully responsive CSS-Grid layouts.

## 🚀 Quick Start

### Frontend (React/Vite)
```bash
cd frontend
npm install
npm run dev
```
The app will run at `http://localhost:5173`. 

### Login Credentials
The system comes pre-configured with test accounts. Simply select a role on the login screen, and the credentials will auto-fill:
- **Admin**: `admin_user` / `password`
- **Commander**: `commander_user` / `password`
- **Logistics**: `logistics_user` / `password`

## 🛠️ Technology Stack
- **Framework**: React 18 with TypeScript
- **Bundler**: Vite
- **Styling**: Vanilla CSS with CSS Variables for theme management
- **Icons**: Lucide React
- **Charts**: Recharts
- **State Management**: React Context API + SessionStorage

## 📝 Assignment Tasks Completed
- [x] Fixed strict TypeScript build errors and White Screen of Death on the frontend.
- [x] Fixed Node 20+ backend compatibility by migrating from `ts-node` to `tsx`.
- [x] Implemented fully functional dynamic Dashboard filters (Bases, Equipment, Date).
- [x] Fixed CSS UI bugs on the Login role-selector and Dashboard select inputs.
- [x] Implemented global state management so that data created by Commander/Logistics is visible to Admin.
- [x] Deployed live to production.
