# FarmFresh — Workflow System Diagram & Architecture Design

This document details the system architecture, component relationships, security layers, and data workflows powering **FarmFresh Direct Agricultural Marketplace**.

---

## 1. High-Level System Architecture Diagram

```mermaid
flowchart TB
    subgraph CLIENT["Client Layer (Browsers & Devices)"]
        ConsumerUI["Consumer Web Application<br/>(/products, /cart, /checkout, /orders)"]
        FarmerUI["Farmer Operations Dashboard<br/>(/dashboard/*)"]
        AdminUI["Admin Portal<br/>(/admin/*)"]
    end

    subgraph MIDDLEWARE["Next.js 16 Edge & Proxy Layer"]
        ProxyMiddleware["Proxy Middleware (proxy.ts)<br/>Cookie Verification & Role-Based Access Control"]
    end

    subgraph SECURITY["Security & Bot Prevention Layer"]
        RateLimiter["Rate Limiting Engine (lib/rate-limit.ts)<br/>Tier 1: Redis Counters<br/>Tier 2: In-Memory Sliding Window"]
    end

    subgraph BACKEND["Next.js 16 App Router & Server Services"]
        AuthService["Auth Actions & Session Service<br/>(lib/auth/actions.ts, session.ts)"]
        OrderAPI["Order Processing API<br/>(/api/orders/route.ts)"]
        UploadAPI["Cloudinary Upload API<br/>(/api/upload/route.ts)"]
        ProductActions["Product Catalog Actions<br/>(app/dashboard/products/actions.ts)"]
        CategoryActions["Category Management Actions<br/>(app/admin/categories/actions.ts)"]
    end

    subgraph DATA["Data & Storage Infrastructure"]
        Firestore[("Cloud Firestore Database<br/>Users, Farmers, Products, Orders, Reviews, Categories")]
        Cloudinary[("Cloudinary Media API<br/>Farm Logos, Produce Photos, Hero Banners")]
        RedisCache[("Redis Caching Store<br/>(cache:products, cache:farmers, cache:analytics)")]
    end

    ConsumerUI --> ProxyMiddleware
    FarmerUI --> ProxyMiddleware
    AdminUI --> ProxyMiddleware

    ProxyMiddleware --> RateLimiter
    RateLimiter -->|Pass| BACKEND
    RateLimiter -.->|Limit Exceeded (429)| CLIENT

    AuthService --> Firestore
    OrderAPI --> Firestore
    ProductActions --> Firestore
    CategoryActions --> Firestore

    UploadAPI --> Cloudinary

    BACKEND <--> RedisCache
```

---

## 2. Authentication & Role-Based Routing Workflow

```mermaid
sequenceDiagram
    autonumber
    actor User as User / Bot
    participant Proxy as Proxy Middleware (proxy.ts)
    participant Auth as Auth Actions (lib/auth/actions.ts)
    participant Rate as Rate Limiter (lib/rate-limit.ts)
    participant DB as Cloud Firestore
    participant Cookie as Cookie Session Store

    User->>Rate: Submit Login/Registration Form
    alt Rate Limit Exceeded
        Rate-->>User: 429 Too Many Requests Error
    else Rate Limit Passed
        Rate->>Auth: Forward Credentials
        Auth->>DB: Query User Record & Verify Password
        alt Valid Credentials
            Auth->>Cookie: Create Encrypted Session Cookie ("farmfresh_session")
            Cookie-->>Proxy: Set Cookie Headers (HTTP-Only, 7-Day TTL)
            alt Role = Consumer
                Proxy-->>User: Redirect to /products
            else Role = Farmer
                Proxy-->>User: Redirect to /dashboard
            else Role = Admin
                Proxy-->>User: Redirect to /admin
            end
        else Invalid Credentials
            Auth-->>User: Return Error Message ("Invalid email or password")
        end
    end
```

---

## 3. Produce Purchasing & Multi-Farmer Order Checkout Flow

```mermaid
sequenceDiagram
    autonumber
    actor Consumer as Consumer
    participant Cart as Cart Context & Local Storage
    participant Checkout as Checkout Page (/checkout)
    participant Rate as Rate Limiter (lib/rate-limit.ts)
    participant API as Order API (/api/orders)
    participant DB as Cloud Firestore
    participant Redis as Redis Cache Invalidation

    Consumer->>Cart: Add Produce Items to Basket (Includes Image & Farmer Info)
    Cart->>Cart: Group Basket Items by Farmer ID
    Consumer->>Checkout: Proceed to Checkout
    Checkout->>Checkout: Fill Delivery Address, Date & Time Slot
    Checkout->>Rate: Submit Checkout Payload (itemsByFarmer)
    alt Rate Limit Passed (< 5 orders/min)
        Rate->>API: Execute Order Handler
        loop For Each Farmer in itemsByFarmer
            API->>API: Calculate Farmer Subtotal & Delivery Fee
            API->>API: Construct OrderItem Objects with Product Images
            API->>DB: Save Individual Farmer Order
        end
        API->>Redis: Invalidate Analytics & Product Caches ("cache:analytics:*")
        API-->>Checkout: 201 Order Created Success
        Checkout->>Cart: Clear Local Basket
        Checkout-->>Consumer: Redirect to Order History (/orders)
    else Rate Limit Exceeded
        Rate-->>Checkout: 429 Rate Limit Exceeded
        Checkout-->>Consumer: Display Retry Warning Message
    end
```

---

## 4. Farmer Product Inventory & Order Fulfillment Workflow

```mermaid
flowchart LR
    subgraph INVENTORY["1. Inventory Management"]
        A["Farmer Uploads Product Photo"] --> B["Cloudinary API (/api/upload)"]
        B --> C["Generate Image CDN URL"]
        C --> D["Save Product to Firestore"]
        D --> E["Invalidate Product Cache (cache:products:*)"]
    end

    subgraph FULFILLMENT["2. Order Fulfillment Lifecycle"]
        F["Order Received (Status: Pending)"] --> G["Farmer Confirms Order (Status: Confirmed)"]
        G --> H["Pack Harvest Produce (Status: Packed)"]
        H --> I["Handover to Logistics (Status: Shipped)"]
        I --> J["Customer Doorstep Delivery (Status: Delivered)"]
        J --> K["Consumer Submits Produce Review"]
    end

    INVENTORY --> FULFILLMENT
```

---

## 5. Admin Verification & Category Taxonomy Flow

```mermaid
flowchart TD
    subgraph FARMER_REG["Farmer Onboarding"]
        R1["New Farmer Registers Profile"] --> R2["Account Created (isVerified: false)"]
        R2 --> R3["Enters Admin Approval Queue"]
    end

    subgraph ADMIN_PANEL["Admin Control Actions"]
        R3 --> A1{"Admin Review Action"}
        A1 -->|Approve| A2["Update Farmer (isVerified: true)"]
        A1 -->|Reject| A3["Remove Farmer Profile"]
        A2 --> A4["Invalidate Farmer Cache (cache:farmers:*)"]

        C1["Admin Enters Category Name & Emoji Icon"] --> C2["Create Category Record"]
        C2 --> C3["Save to Firestore Categories Collection"]
        C3 --> C4["Invalidate Category Cache (cache:categories:*)"]
        C4 --> C5["Live Update Consumer Header Chips & Filters"]
    end
```

---

## 6. Subsystem Integration Matrix

| Subsystem | Primary Responsible File | Storage / Engine | Security Mechanism |
| :--- | :--- | :--- | :--- |
| **Authentication** | `lib/auth/actions.ts` | Session Cookie + Firestore | Rate limited (5 attempts/min) + HTTP-Only Cookies |
| **Route Security** | `proxy.ts` | Next.js 16 Edge Middleware | Cookie verification & RBAC redirection |
| **Rate Limiter** | `lib/rate-limit.ts` | Redis INCR + In-Memory Fallback | Max window counters + 429 Headers |
| **Order Processing** | `app/api/orders/route.ts` | Cloud Firestore Orders Collection | Rate limited (5 orders/min) + Cart splitting |
| **Media Uploads** | `app/api/upload/route.ts` | Cloudinary API | Rate limited (10 uploads/min) + Signed/Unsigned API |
| **Produce Caching** | `lib/data/products.ts` | Redis (`ioredis`) | Automated pattern invalidation (`cache:products:*`) |
