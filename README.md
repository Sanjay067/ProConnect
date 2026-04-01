<div align="center">
  <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/LinkedIn_logo_initials.png/640px-LinkedIn_logo_initials.png" alt="ProConnect Logo" width="80" />
  <h1>ProConnect</h1>

  <p>
    <strong>A modern, full-stack professional networking platform mimicking LinkedIn's core architecture.</strong>
  </p>

  <p>
    <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
    <img src="https://img.shields.io/badge/Redux_Toolkit-593D88?style=for-the-badge&logo=redux&logoColor=white" alt="Redux Toolkit" />
    <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node" />
    <img src="https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express" />
    <img src="https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" />
    <img src="https://img.shields.io/badge/Cloudinary-3448C5?style=for-the-badge&logo=cloudinary&logoColor=white" alt="Cloudinary" />
  </p>
</div>

<hr />

## 📖 Overview

**ProConnect** is a robust, production-ready full-stack application that faithfully reproduces the core mechanics and UI/UX flows of modern professional networking giant LinkedIn. 

Built on the **MERN** (MongoDB, Express, React, Node) stack, it features comprehensive user authentication, interactive global feeds, rich-media processing integrations, and deeply nested object relationship management spanning across comments, likes, and modularized profile architectures.

## ✨ Core Features

*   **Secure Authentication Pipeline:** Fully authenticated backend utilizing stateless JSON Web Tokens (JWT). Engineered with a bifurcated Access Token and HttpOnly Refresh Token ecosystem to maximize session security.
*   **Dynamic Media Engine:** Direct integration with **Cloudinary** via `multer`. Supports robust `multipart/form-data` uploads for Avatars, Profile Banners, and Post rich-media (Images/Videos). Features an intelligent physical asset destruction logic upon deletion.
*   **Real-time Interaction Feed:** A fast, responsive central dashboard feed. 
    *   **Post Creation:** Replicates the immersive LinkedIn modal UI, featuring live client-side `FileReader` thumbnails prior to dispatching server-side buffers.
    *   **Nested Engagement:** End-to-end support for Liking, Commenting, and deeply nested Replies. Controlled via a synchronized global Redux state tree mapped against localized `PostCard` components for zero-latency UI reactivity.
*   **Comprehensive Profile Management:** Users can customize their professional identity with dynamically fetched Avatars, background cover Banners, Bios, and structured JSON arrays for Work/Education history.
*   **Clean Component Architecture:** Front-end built with CSS Modules ensuring completely siloed component styling to prevent cascade pollution while mimicking precise LinkedIn color palettes and typography.

## 🛠️ Tech Stack & Architecture

### Frontend (Client)
*   **React 18** - UI Rendering Engine
*   **Redux Toolkit (RTK)** - Centralized Global State Management via declarative Thunks.
*   **Axios** - Interceptor-powered RESTful API calls explicitly catching 401s for automated token refreshing.
*   **CSS Modules** - Scoped styling matrices.

### Backend (Server)
*   **Node.js & Express.js** - Robust RESTful API architecture spanning multiple discrete controller boundaries.
*   **MongoDB & Mongoose** - Heavily relational NoSQL schema design utilizing standard `ObjectIds` to cross-pollinate Users, Profiles, Posts, and Comments.
*   **JWT & bcryptjs** - Secure cryptographic password hashing and authentication token generation.
*   **Multer + CloudinaryStorage** - Immediate buffer streaming into cloud buckets strictly formatted and compressed to optimal networking dimensions (Avatars/Banners/Posts).

---

## 🚀 Getting Started

To run ProConnect locally, follow these steps:

### Prerequisites
*   Node.js (v16.x or later)
*   MongoDB Instance (Local or Atlas)
*   Cloudinary Account (Cloud Name, API Key, API Secret)

### 1. Project Setup
Clone the repository, then install dependencies for both the frontend and backend environments:
```bash
# Install root/server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### 2. Environment Variables
Create a `.env` file in the **server** directory matching the following matrix:
```env
PORT=8000
MONGODB_URI=your_mongo_database_uri
JWT_SECRET=your_jwt_access_secret
REFRESH_TOKEN_SECRET=your_jwt_refresh_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
```

### 3. Launch Application
You can fire up both environments concurrently (or using split terminals):

**Terminal 1 (Backend API):**
```bash
cd server
npm run dev
```

**Terminal 2 (Frontend React):**
```bash
cd client
npm start
```
