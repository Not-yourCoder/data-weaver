# DataWeaver : Documentation

The **DataWeaver** is a graph analysis web app that visualizes relationships between nodes using data from a Neo4j database. The graph can display thousands of nodes with interactive features such as zooming, panning, filtering, and querying.

## Technologies Used

- **react-query** - for efficient data fetching and caching
- **memoize-one** - for performance optimization
- **react-force-graph-2d** - for graph rendering
- **shadcn-ui** - for UI components
- **express-neo4j** - for the backend
- **redux-toolkit** - for state management
- **React** - for the frontend

---

# Project Folder Structure

## Root Directory
- `/public` - Static assets and public files
- `/src` - Main source code directory containing application logic

### Source Code (`/src`)
- `/components` - Reusable React components
  - `/Dashboard` - Main dashboard components
  - `/DashboardElements` - Individual dashboard UI elements
  - `/Layout` - Layout-related components
  - `/types` - TypeScript type definitions
  - `/ui` - Base UI components (likely shadcn-ui components)

### Core Functionality

- `/lib` - Library code and utilities
- `/modules` - Feature-based modules
  - `/filter` - Filtering functionality
  - `/search` - Search functionality

### Backend (`/server`)
- `/config` - Server configuration files
- `/controllers` - API route controllers
- `/routes` - API route definitions
- `server.js` - Main server entry point

### State Management
- `/store` - Redux store configuration
  - `/features` - Redux slices/features
  - `store.ts` - Main store configuration

---

## How to Run the Project 🚀

1. Install all dependencies:
   ```bash
   npm i
2. Start the backend server:
   ```bash
   npm run serve
3. Start the dev server ( frontend ):
   ```bash
   npm run dev