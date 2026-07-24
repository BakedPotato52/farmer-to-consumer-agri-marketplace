# FarmFresh — Direct Farmer-to-Consumer Agricultural Marketplace

**FarmFresh** is a modern, high-performance web application designed to connect local agricultural producers directly with consumers. By eliminating intermediaries, FarmFresh empowers farmers with fair pricing and gives consumers fresh, transparently sourced produce.

Built with **Next.js 16 (App Router & Turbopack)**, **React 19**, **Tailwind CSS v4**, **Cloud Firestore**, **Cloudinary Image API**, and **Redis High-Performance Caching**.

---

## Key Features

### 1. Multi-Role Authentication & Session Management
### 1. Multi-Role Authentication & Session Management
- **Three Core User Roles**: Consumer, Farmer, and Administrator.
- **Secure Cookie Sessions**: HTTP-Only, Base64-encoded session cookies (`farmfresh_session`) with 7-day persistence and strict path scoping (`/`).
- **Next.js 16 Proxy Middleware (`proxy.ts`)**: Enforces strict role-based access control (RBAC):
  - Consumers: Access Marketplace, Cart, Checkout, Order History.
  - Farmers: Access `/dashboard/*` (Overview, Product Catalog, Order Fulfillment, Profile).
  - Admins: Access `/admin/*` (Analytics, Farmer Approvals, Category Management).

---

### 2. Consumer Marketplace Experience
### 2. Consumer Marketplace Experience
- **Interactive Landing Page**: Displays live verified farmers, platform statistics, produce categories, customer testimonials, and quick links.
- **Produce Marketplace (`/products`)**:
  - Multi-dimensional filtering: Search query, Category (Vegetables, Fruits, Dairy, Grains, Herbs), Organic filter, Price range, and Sorting (Price Low-to-High, Price High-to-Low, Rating, Newest).
  - Produce cards showing high-resolution Cloudinary images, unit pricing, organic badges, rating stars, and seller links.
- **Product Details (`/products/[id]`)**: Full produce specification, harvest dates, farmer bio, stock availability, customer reviews, and quantity selector.
- **Farmer Directory & Profiles (`/farmers`, `/farmers/[id]`)**:
  - Displays verified farm badges, farming methods (Organic, Conventional, Mixed), Cloudinary Hero Banners, and Farm Logo Avatars.
  - Showcases each farmer's complete harvest catalog and consumer feedback.
- **Shopping Cart (`/cart`)**:
  - Cart items grouped logically by seller/farmer.
  - Real-time cart counter badge integrated into the sticky top Navigation Bar.
  - Quantity adjustments, max stock enforcement, and item removal.
- **Direct Checkout (`/checkout`)**:
  - Address specification, preferred delivery date selector, and time window slot selection.
  - Multi-farmer cart splitting into separate orders automatically.
  - Support for Pay-on-Delivery (COD) / UPI payments.
- **Order History & Delivery Tracker (`/orders`, `/orders/[id]`)**:
  - Live progress timeline tracking order stages: `Pending` ➔ `Confirmed` ➔ `Packed` ➔ `Shipped` ➔ `Delivered`.
  - Display of ordered product image thumbnails, quantities, unit pricing, and status badges.
  - Post-delivery review submission for purchased produce.

---

### 3. Farmer Operations Dashboard (`/dashboard`)
### 3. Farmer Operations Dashboard (`/dashboard`)
- **Dashboard Overview**: Key performance indicators including Total Revenue, Pending Orders, Active Products, and Average Rating. Interactive monthly sales summary bar chart.
- **Product Management (`/dashboard/products`)**:
  - Add & edit produce items with harvest dates, stock limits, unit types, organic indicators, and Cloudinary image uploads.
  - One-click active/inactive status toggle and item deletion.
- **Order Fulfillment (`/dashboard/orders`)**:
  - Filter orders by status tabs (`All`, `Pending`, `Confirmed`, `Packed`, `Shipped`, `Delivered`).
  - Stage-by-stage status progression workflow actions.
  - Customer contact and delivery detail breakdown with ordered item photos.
- **Farm Profile Management (`/dashboard/profile`)**:
  - Update farm name, location, state, pincode, farming methodology, and farm narrative.
  - Upload Farm Logo Avatar and Hero Cover Banner using Cloudinary drag-and-drop uploader.

---

### 4. Administrator Portal (`/admin`)
### 4. Administrator Portal (`/admin`)
- **System Metrics & Analytics (`/admin/analytics`)**:
  - Platform revenue, order fulfillment rates, consumer retention, top-performing farmers, top produce items, and category revenue distribution.
- **Farmer Approval Queue (`/admin/farmers`)**:
  - Approve or reject newly registered farmer profiles with real-time Cloud Firestore updates.
- **Marketplace Taxonomy Management (`/admin/categories`)**:
  - Create custom marketplace categories with custom names and emoji icons.
  - Delete obsolete categories with immediate Redis cache invalidation.

---

### 5. Cloudinary Image Upload Subsystem
### 5. Cloudinary Image Upload Subsystem
- **API Endpoint (`/api/upload`)**: Implements dual upload strategy (unsigned `farm-fresh` preset with signed fallback).
- **Client Component (`components/ui/ImageUpload.tsx`)**: Drag-and-drop interface with live preview, upload progress indicator, and image removal.

---

### 6. High-Performance Redis Caching Layer
### 6. High-Performance Redis Caching Layer
- **Client Helper (`lib/redis/client.ts`)**: Built on `ioredis` with primitives `getCache`, `setCache`, `deleteCacheKey`, and `deleteCachePattern`.
- **Automatic Invalidation**:
  - Products cached under `cache:products:*` (invalidated on product mutations).
  - Farmers cached under `cache:farmers:*` (invalidated on profile edits or admin approvals).
  - Analytics cached under `cache:analytics:*` (invalidated on order events).
  - Categories cached under `cache:categories:*` (invalidated on category edits).
- **Silent Graceful Fallback**: If Redis is offline or credentials are missing/invalid, operations automatically and silently fall back to direct Cloud Firestore database execution.

---

## Workflow & System Design

- Workflow & System design diagrams documentation : [WORKFLOW.md](WORKFLOW.md)

## Technology Stack

| Layer | Technology |
| :--- | :--- |
| **Framework** | Next.js 16.2.11 (App Router & Turbopack) |
| **UI Library** | React 19 |
| **Styling** | Vanilla CSS + Tailwind CSS v4 (`@import 'tailwindcss'`) |
| **Database** | Cloud Firestore (`firebase/firestore`) |
| **Media Storage** | Cloudinary API |
| **Caching** | Redis (`ioredis`) |
| **Language** | TypeScript |

---

## Project Structure
## Project Structure

```
farmer-to-consumer-agri-marketplace/
├── app/
│   ├── (admin)/             # Administrator pages (/admin/*)
│   ├── (auth)/              # Login (/login) & Registration (/register)
│   ├── (consumer)/          # Consumer pages (/products, /farmers, /cart, /checkout, /orders)
│   ├── (farmer)/            # Farmer Dashboard (/dashboard/*)
│   ├── api/                 # API Routes (/api/upload, /api/orders, /api/products, etc.)
│   ├── globals.css          # Design system variables & custom utilities
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Home / Landing page
├── components/
│   ├── layout/              # Navbar, Footer
│   └── ui/                  # ImageUpload, UI islands
├── lib/
│   ├── auth/                # Session management & Server Actions
│   ├── cart/                # CartContext & CartProvider
│   ├── data/                # Database service layer (users, farmers, products, orders, reviews, analytics, categories)
│   ├── firebase/            # Firebase SDK config & Cloud Firestore services
│   ├── redis/               # Redis client & caching utilities
│   └── types.ts             # TypeScript interfaces & type definitions
├── proxy.ts                 # Next.js 16 Proxy Middleware (replaces middleware.ts)
├── .env                     # Environment variables configuration
└── README.md                # Project documentation
```

---

## Environment Variables (`.env`)
## Environment Variables (`.env`)

```env
# Cloudinary Configuration
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=kanak-acharjee
NEXT_PUBLIC_CLOUDINARY_API_KEY=12966137434296
CLOUDINARY_URL=cloudinary://12966137434296:Lbv8Do0uLYSxVtQvmYvmYsShFpNiJmk@kanak-acharjee
CLOUDINARY_CLOUD_NAME=kanak-acharjee
CLOUDINARY_API_KEY=12966137434296
CLOUDINARY_API_SECRET=Lbv8Do0uLYvmYsSxVtQvmYShFpNiJmk
CLOUDINARY_UPLOAD_PRESET=farm-fresh

# Redis Caching Configuration
REDIS_URL=redis://default:password@redis-server:13543
```

---

## Running the Project

### Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build & Type Checking
```bash
npx next build
```

---

## 📄 License
Licensed under the MIT License. Developed for direct farm-to-consumer agricultural commerce.
