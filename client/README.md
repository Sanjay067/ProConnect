<div align="center">
/>
  <h1>ProConnect Frontend (Client)</h1>

  <p>
    <strong>The React UI presentation layer for the ProConnect LinkedIn Clone.</strong>
  </p>
</div>

<hr />

## Client Architecture

The ProConnect frontend is a massive Single Page Application (SPA) driven by React and organized via Feature-Sliced Design.

- **State Management:** Redux Toolkit handles the global data trees for Feed Posts, User Profiles, Auth tokens, and Connections.
- **Routing:** React Router DOM (v6) maps out the dashboard, auth gateway, and profile interfaces.
- **Media Parsing:** Uses native HTML5 `FileReader` and HTML5 `FormData` to construct dynamic, real-time media preview arrays prior to syncing buffers to the Node server.

## Running The Clients

### Prerequisites

- Node.js runtime environment

### Commands

To install exactly matched package dependencies:

```bash
npm install
```

To run the Vite / CRA development server locally on Port 3000:

```bash
npm start
# or npm run dev
```

### Component Structure

Component styling is strictly sandboxed utilizing CSS Modules (`styles.module.css`). Every component maps its own unique hash map, completely preventing any style collision or global CSS poisoning when iterating on heavy feeds.
