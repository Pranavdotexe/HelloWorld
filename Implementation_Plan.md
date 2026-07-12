# AssetFlow — Implementation Plan

## Enterprise Asset & Resource Management System

**Version:** 1.0.0
**Last Updated:** 2026-07-12
**Authors:** Architecture Team
**Status:** Draft — Pending Team Review

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Project Architecture](#2-project-architecture)
3. [Database Design](#3-database-design)
4. [Authentication System](#4-authentication-system)
5. [API Design](#5-api-design)
6. [Middleware](#6-middleware)
7. [Validation](#7-validation)
8. [Security](#8-security)
9. [Error Handling](#9-error-handling)
10. [Backend Development Roadmap](#10-backend-development-roadmap)
11. [Coding Standards](#11-coding-standards)
12. [Frontend (Minimal)](#12-frontend-minimal)
13. [Future Improvements](#13-future-improvements)

---

## 1. Executive Summary

AssetFlow is a cross-industry Enterprise Asset & Resource Management System. It digitises how organisations track, allocate, maintain, and audit physical assets and shared resources through a centralised platform. The system replaces manual spreadsheets and paper logs with structured asset lifecycles, resource booking, maintenance workflows, audit cycles, and real-time dashboards.

### Core Capabilities

| Capability | Description |
|---|---|
| Organisation Setup | Departments, asset categories, employee directory |
| Asset Registry | Register, search, filter, and track assets through a full lifecycle |
| Asset Allocation & Transfer | Assign assets to employees/departments with conflict handling |
| Resource Booking | Time-slot booking of shared resources with overlap validation |
| Maintenance Management | Approval-gated repair workflow with automatic status transitions |
| Asset Audits | Structured audit cycles with auditor assignment and discrepancy reports |
| Reports & Analytics | Utilisation trends, maintenance frequency, booking heatmaps |
| Notifications & Activity Logs | Real-time alerts and a full audit trail of user actions |

### Roles

| Role | Created By | Permissions Summary |
|---|---|---|
| **Admin** | Seeded or system-created | Full system access; manages org setup, promotes roles |
| **Asset Manager** | Admin promotes from Employee Directory | Registers/allocates assets; approves transfers, maintenance, audits |
| **Department Head** | Admin promotes from Employee Directory | Department-scoped approvals and resource booking |
| **Employee** | Self-signup | Views own assets; books resources; raises requests |

### Technology Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js (LTS) |
| Framework | Express.js |
| Database | MongoDB (local instance, Mongoose ODM) |
| Authentication | JWT (Access + Refresh tokens), bcrypt |
| Validation | Joi |
| Frontend (minimal) | React 19 + Vite + Tailwind CSS |

---

## 2. Project Architecture

### 2.1 Folder Structure

```
AssetFlow/
├── backend/
│   ├── src/
│   │   ├── config/            # App & DB configuration
│   │   │   ├── db.js          # Mongoose connection logic
│   │   │   ├── env.js         # Centralised env variable access
│   │   │   └── constants.js   # Enums, status lists, magic strings
│   │   │
│   │   ├── models/            # Mongoose schemas & models
│   │   │   ├── User.js
│   │   │   ├── Department.js
│   │   │   ├── AssetCategory.js
│   │   │   ├── Asset.js
│   │   │   ├── Allocation.js
│   │   │   ├── TransferRequest.js
│   │   │   ├── Booking.js
│   │   │   ├── MaintenanceRequest.js
│   │   │   ├── AuditCycle.js
│   │   │   ├── AuditEntry.js
│   │   │   ├── Notification.js
│   │   │   └── ActivityLog.js
│   │   │
│   │   ├── routes/            # Express route definitions (thin — only map HTTP → controller)
│   │   │   ├── index.js       # Route aggregator — mounts all sub-routers
│   │   │   ├── auth.routes.js
│   │   │   ├── user.routes.js
│   │   │   ├── department.routes.js
│   │   │   ├── assetCategory.routes.js
│   │   │   ├── asset.routes.js
│   │   │   ├── allocation.routes.js
│   │   │   ├── transfer.routes.js
│   │   │   ├── booking.routes.js
│   │   │   ├── maintenance.routes.js
│   │   │   ├── audit.routes.js
│   │   │   ├── report.routes.js
│   │   │   ├── notification.routes.js
│   │   │   └── activityLog.routes.js
│   │   │
│   │   ├── controllers/       # Request handlers — parse input, call service, send response
│   │   │   ├── auth.controller.js
│   │   │   ├── user.controller.js
│   │   │   ├── department.controller.js
│   │   │   ├── assetCategory.controller.js
│   │   │   ├── asset.controller.js
│   │   │   ├── allocation.controller.js
│   │   │   ├── transfer.controller.js
│   │   │   ├── booking.controller.js
│   │   │   ├── maintenance.controller.js
│   │   │   ├── audit.controller.js
│   │   │   ├── report.controller.js
│   │   │   ├── notification.controller.js
│   │   │   └── activityLog.controller.js
│   │   │
│   │   ├── services/          # Business logic layer — all domain rules live here
│   │   │   ├── auth.service.js
│   │   │   ├── user.service.js
│   │   │   ├── department.service.js
│   │   │   ├── assetCategory.service.js
│   │   │   ├── asset.service.js
│   │   │   ├── allocation.service.js
│   │   │   ├── transfer.service.js
│   │   │   ├── booking.service.js
│   │   │   ├── maintenance.service.js
│   │   │   ├── audit.service.js
│   │   │   ├── report.service.js
│   │   │   ├── notification.service.js
│   │   │   └── activityLog.service.js
│   │   │
│   │   ├── middleware/        # Cross-cutting Express middleware
│   │   │   ├── auth.middleware.js       # JWT verification & user attachment
│   │   │   ├── role.middleware.js       # Role-based access guard
│   │   │   ├── validate.middleware.js   # Joi schema runner
│   │   │   ├── asyncHandler.js         # try/catch wrapper for async route handlers
│   │   │   ├── errorHandler.js         # Global error handler (last middleware)
│   │   │   └── notFound.js             # 404 catch-all
│   │   │
│   │   ├── validators/        # Joi schemas grouped by domain
│   │   │   ├── auth.validator.js
│   │   │   ├── user.validator.js
│   │   │   ├── department.validator.js
│   │   │   ├── assetCategory.validator.js
│   │   │   ├── asset.validator.js
│   │   │   ├── allocation.validator.js
│   │   │   ├── transfer.validator.js
│   │   │   ├── booking.validator.js
│   │   │   ├── maintenance.validator.js
│   │   │   └── audit.validator.js
│   │   │
│   │   ├── utils/             # Pure utility functions (stateless, no side-effects)
│   │   │   ├── ApiResponse.js       # Standard success/error response builder
│   │   │   ├── ApiError.js          # Custom error class with HTTP status
│   │   │   ├── generateAssetTag.js  # Auto-increment asset tag generator (AF-0001)
│   │   │   ├── tokenUtils.js        # JWT sign/verify helpers
│   │   │   └── pagination.js        # Pagination helper (page, limit, skip)
│   │   │
│   │   └── app.js             # Express app factory (middleware + route mounting)
│   │
│   ├── server.js              # Entry point — connects DB then starts listening
│   ├── .env                   # Environment variables (git-ignored)
│   ├── .env.example           # Template for contributors
│   ├── package.json
│   └── .gitignore
│
├── frontend/                  # (Minimal — existing Vite + React scaffold)
│
├── features.txt               # Requirements document
├── Implementation_Plan.md     # This file
└── README.md
```

### 2.2 Layered Architecture

AssetFlow follows a **three-layer** architecture to separate concerns cleanly:

```
┌──────────────────────────────────┐
│         Routes (Thin)            │  ← HTTP method + path + middleware chain
├──────────────────────────────────┤
│       Controllers (Thin)         │  ← Parse request, call service, send response
├──────────────────────────────────┤
│       Services (Thick)           │  ← ALL business logic, validation rules, DB calls
├──────────────────────────────────┤
│       Models (Mongoose)          │  ← Schema definitions, virtuals, hooks, indexes
└──────────────────────────────────┘
```

**Why this matters:**

| Layer | Responsibility | Must NOT contain |
|---|---|---|
| **Route** | Map HTTP verb + path to controller. Attach middleware (auth, validation). | Business logic, DB queries |
| **Controller** | Extract params/body/query. Invoke the appropriate service method. Format the API response. | Direct Mongoose calls, complex logic |
| **Service** | All domain logic: conflict checks, status transitions, notification triggers, query building. | `req`/`res` references (framework-agnostic) |
| **Model** | Schema definition, Mongoose hooks (e.g., pre-save password hash), virtuals, indexes. | Business rules, HTTP concepts |

> **Architectural Decision:** We introduce a **Service layer** even for simple CRUD modules because AssetFlow has significant cross-module interactions (e.g., allocating an asset triggers notification creation, activity logging, and asset status update). Placing this logic in controllers would create tight coupling and duplication.

### 2.3 Environment Variables

All environment variables are accessed through `src/config/env.js`, never read directly from `process.env` elsewhere in the codebase.

```
# .env.example

# ──── Server ────
NODE_ENV=development
PORT=5000

# ──── Database ────
MONGODB_URI=mongodb://127.0.0.1:27017/assetflow

# ──── JWT ────
JWT_ACCESS_SECRET=<random-256-bit-hex>
JWT_REFRESH_SECRET=<random-256-bit-hex>
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d

# ──── CORS ────
CORS_ORIGIN=http://localhost:5173

# ──── Misc ────
BCRYPT_SALT_ROUNDS=12
```

### 2.4 Error Handling Strategy (Overview)

All errors flow through a centralised pipeline:

1. **Controller** functions are wrapped in `asyncHandler` — any thrown/rejected error is forwarded to `next()`.
2. **Service** functions throw instances of `ApiError` (a custom class extending `Error`) with an HTTP status code and message.
3. **`errorHandler`** middleware catches everything, formats it into the standard response shape, and sends it.
4. Mongoose validation errors, cast errors, and duplicate-key errors are detected and translated into user-friendly messages by the error handler.

---

## 3. Database Design

### 3.1 Design Principles

- Every document stores `createdAt` and `updatedAt` via Mongoose timestamps.
- All inter-collection links use `ObjectId` references (not embedding) to keep documents lean and enable independent querying.
- Indexes are defined on fields used in frequent queries and unique constraints.
- Enums are stored as strings (not magic numbers) for readability.
- Soft deletes (an `isActive` / `status` field) are preferred over hard deletes for auditability.

### 3.2 Collections

---

#### 3.2.1 `users`

**Purpose:** Stores every person who can log into the system. Role assignment is handled by Admin, not at signup.

| Field | Type | Required | Default | Description |
|---|---|---|---|---|
| `_id` | ObjectId | auto | — | Primary key |
| `name` | String | ✅ | — | Full name |
| `email` | String | ✅ (unique) | — | Login identifier; lowercase, trimmed |
| `password` | String | ✅ | — | bcrypt hash (never returned in API responses) |
| `role` | String (enum) | ✅ | `"Employee"` | One of: `Admin`, `AssetManager`, `DepartmentHead`, `Employee` |
| `department` | ObjectId → `departments` | ❌ | `null` | Employee's assigned department |
| `status` | String (enum) | ✅ | `"Active"` | `Active` / `Inactive` |
| `refreshToken` | String | ❌ | `null` | Hashed refresh token (for token rotation) |
| `createdAt` | Date | auto | — | — |
| `updatedAt` | Date | auto | — | — |

**Indexes:**
- `{ email: 1 }` — unique
- `{ role: 1 }`
- `{ department: 1 }`
- `{ status: 1 }`

**Validation:**
- `email` must pass email-format regex.
- `password` minimum 8 characters (enforced at Joi level; stored as hash).
- `role` must be one of the four enum values.

**Relationships:**
- `department` → `departments._id`

**Notes:**
- Signup always creates a user with `role = "Employee"`. Admin promotes users from the Employee Directory (Screen 3, Tab C).
- A future migration can add fields like `phone`, `avatar`, `lastLoginAt` without breaking the schema.

---

#### 3.2.2 `departments`

**Purpose:** Organisational units. Assets and employees belong to departments.

| Field | Type | Required | Default | Description |
|---|---|---|---|---|
| `_id` | ObjectId | auto | — | |
| `name` | String | ✅ (unique) | — | Department name |
| `description` | String | ❌ | `""` | Optional description |
| `head` | ObjectId → `users` | ❌ | `null` | Assigned Department Head |
| `parentDepartment` | ObjectId → `departments` | ❌ | `null` | For hierarchy support |
| `status` | String (enum) | ✅ | `"Active"` | `Active` / `Inactive` |
| `createdAt` | Date | auto | — | |
| `updatedAt` | Date | auto | — | |

**Indexes:**
- `{ name: 1 }` — unique
- `{ head: 1 }`
- `{ status: 1 }`

**Validation:**
- `name` must be non-empty, max 100 characters.
- `head` must reference a user with `role` ∈ {`DepartmentHead`, `Admin`} (enforced at service level).

**Relationships:**
- `head` → `users._id`
- `parentDepartment` → `departments._id` (self-reference for hierarchy)

---

#### 3.2.3 `assetCategories`

**Purpose:** Classify assets (Electronics, Furniture, Vehicles, etc.). Categories can carry optional custom fields.

| Field | Type | Required | Default | Description |
|---|---|---|---|---|
| `_id` | ObjectId | auto | — | |
| `name` | String | ✅ (unique) | — | Category name |
| `description` | String | ❌ | `""` | |
| `customFields` | Array of `{ fieldName: String, fieldType: String }` | ❌ | `[]` | Category-specific metadata templates (e.g., `warrantyPeriod` for Electronics) |
| `status` | String (enum) | ✅ | `"Active"` | `Active` / `Inactive` |
| `createdAt` | Date | auto | — | |
| `updatedAt` | Date | auto | — | |

**Indexes:**
- `{ name: 1 }` — unique

**Validation:**
- `customFields[].fieldType` must be one of: `String`, `Number`, `Date`, `Boolean`.

---

#### 3.2.4 `assets`

**Purpose:** Central registry of every physical asset in the organisation. This is the most heavily referenced collection.

| Field | Type | Required | Default | Description |
|---|---|---|---|---|
| `_id` | ObjectId | auto | — | |
| `name` | String | ✅ | — | Human-readable asset name |
| `assetTag` | String | ✅ (unique) | auto-generated | Format: `AF-0001`, `AF-0002`, … |
| `serialNumber` | String | ❌ (unique if provided) | `null` | Manufacturer serial |
| `category` | ObjectId → `assetCategories` | ✅ | — | |
| `acquisitionDate` | Date | ❌ | `null` | Purchase/receipt date |
| `acquisitionCost` | Number | ❌ | `0` | For ranking/reports only |
| `condition` | String (enum) | ✅ | `"Good"` | `New`, `Good`, `Fair`, `Poor`, `Damaged` |
| `location` | String | ❌ | `""` | Physical location description |
| `department` | ObjectId → `departments` | ❌ | `null` | Owning department |
| `status` | String (enum) | ✅ | `"Available"` | `Available`, `Allocated`, `Reserved`, `UnderMaintenance`, `Lost`, `Retired`, `Disposed` |
| `isBookable` | Boolean | ✅ | `false` | If `true`, this asset appears in Resource Booking |
| `customFieldValues` | Mixed (Object) | ❌ | `{}` | Values for category-specific custom fields |
| `photos` | Array of String | ❌ | `[]` | File paths / URLs to uploaded images |
| `documents` | Array of String | ❌ | `[]` | File paths / URLs to attached documents |
| `currentHolder` | ObjectId → `users` | ❌ | `null` | Currently allocated employee |
| `createdBy` | ObjectId → `users` | ✅ | — | Who registered the asset |
| `createdAt` | Date | auto | — | |
| `updatedAt` | Date | auto | — | |

**Indexes:**
- `{ assetTag: 1 }` — unique
- `{ serialNumber: 1 }` — unique, sparse (allows multiple nulls)
- `{ status: 1 }`
- `{ category: 1 }`
- `{ department: 1 }`
- `{ isBookable: 1 }`
- `{ currentHolder: 1 }`

**Lifecycle Status Transitions (enforced in `asset.service.js`):**

```
Available ←→ Allocated
Available ←→ Reserved
Available ←→ UnderMaintenance
Allocated  → Available       (return)
Allocated  → UnderMaintenance (maintenance approved while allocated)
UnderMaintenance → Available  (maintenance resolved)
Any        → Lost            (audit discrepancy)
Any        → Retired
Any        → Disposed
```

**Validation:**
- `assetTag` is auto-generated via a counter collection or a `findOne + increment` pattern (see `generateAssetTag.js`).
- `status` transitions are validated in the service layer — arbitrary jumps are rejected.
- `isBookable` assets cannot be `Allocated` to individuals (they are shared resources).

**Relationships:**
- `category` → `assetCategories._id`
- `department` → `departments._id`
- `currentHolder` → `users._id`
- `createdBy` → `users._id`

---

#### 3.2.5 `allocations`

**Purpose:** Records every assignment of an asset to an employee or department. Provides full allocation history.

| Field | Type | Required | Default | Description |
|---|---|---|---|---|
| `_id` | ObjectId | auto | — | |
| `asset` | ObjectId → `assets` | ✅ | — | |
| `allocatedTo` | ObjectId → `users` | ✅ | — | |
| `allocatedBy` | ObjectId → `users` | ✅ | — | Who performed the allocation |
| `department` | ObjectId → `departments` | ❌ | — | Department context |
| `allocatedAt` | Date | ✅ | `Date.now` | |
| `expectedReturnDate` | Date | ❌ | `null` | Optional return deadline |
| `actualReturnDate` | Date | ❌ | `null` | Filled on return |
| `returnCondition` | String | ❌ | `null` | Condition at check-in |
| `returnNotes` | String | ❌ | `""` | Check-in notes |
| `status` | String (enum) | ✅ | `"Active"` | `Active`, `Returned`, `Overdue`, `Transferred` |
| `createdAt` | Date | auto | — | |
| `updatedAt` | Date | auto | — | |

**Indexes:**
- `{ asset: 1, status: 1 }` — quickly find active allocation for a given asset
- `{ allocatedTo: 1, status: 1 }` — find all assets held by a user
- `{ expectedReturnDate: 1, status: 1 }` — overdue detection queries
- `{ department: 1 }`

**Validation:**
- Before creating an allocation, the service must verify `asset.status === "Available"` (no double-allocation).
- If the asset is already allocated, the API returns the current holder and suggests a Transfer Request.

**Notes on Overdue Detection:**
- A scheduled job (or on-demand query) checks `expectedReturnDate < now AND status === "Active"` and flips status to `Overdue`.
- Alternatively, the overdue state is computed at read-time as a virtual. The latter approach avoids cron dependencies and is recommended for the initial version.

---

#### 3.2.6 `transferRequests`

**Purpose:** Handles the workflow when someone wants an asset that is currently allocated to another user.

| Field | Type | Required | Default | Description |
|---|---|---|---|---|
| `_id` | ObjectId | auto | — | |
| `asset` | ObjectId → `assets` | ✅ | — | |
| `requestedBy` | ObjectId → `users` | ✅ | — | |
| `currentHolder` | ObjectId → `users` | ✅ | — | User who currently has the asset |
| `approvedBy` | ObjectId → `users` | ❌ | `null` | Asset Manager or Department Head |
| `status` | String (enum) | ✅ | `"Requested"` | `Requested`, `Approved`, `Rejected`, `Completed` |
| `reason` | String | ❌ | `""` | Why the transfer is needed |
| `rejectionReason` | String | ❌ | `""` | If rejected |
| `createdAt` | Date | auto | — | |
| `updatedAt` | Date | auto | — | |

**Indexes:**
- `{ asset: 1, status: 1 }`
- `{ requestedBy: 1 }`
- `{ currentHolder: 1 }`

**Workflow (enforced in `transfer.service.js`):**

```
Requested → Approved (by Asset Manager / Department Head)
         → Rejected

Approved  → Completed (system auto-creates new allocation, closes old one)
```

On `Completed`:
1. Old allocation marked `Transferred`.
2. New allocation created for `requestedBy`.
3. `asset.currentHolder` updated.
4. Notifications sent to both parties.
5. Activity log entry created.

---

#### 3.2.7 `bookings`

**Purpose:** Time-slot reservations for shared/bookable resources (rooms, vehicles, shared equipment).

| Field | Type | Required | Default | Description |
|---|---|---|---|---|
| `_id` | ObjectId | auto | — | |
| `asset` | ObjectId → `assets` | ✅ | — | Must be an asset with `isBookable: true` |
| `bookedBy` | ObjectId → `users` | ✅ | — | |
| `startTime` | Date | ✅ | — | Booking start (datetime) |
| `endTime` | Date | ✅ | — | Booking end (datetime) |
| `purpose` | String | ❌ | `""` | |
| `status` | String (enum) | ✅ | `"Upcoming"` | `Upcoming`, `Ongoing`, `Completed`, `Cancelled` |
| `cancelReason` | String | ❌ | `""` | |
| `createdAt` | Date | auto | — | |
| `updatedAt` | Date | auto | — | |

**Indexes:**
- `{ asset: 1, startTime: 1, endTime: 1 }` — overlap detection
- `{ bookedBy: 1 }`
- `{ status: 1 }`
- `{ startTime: 1 }` — for upcoming/reminder queries

**Overlap Validation (enforced in `booking.service.js`):**
```javascript
// Pseudocode — find conflicting bookings
const conflict = await Booking.findOne({
  asset: assetId,
  status: { $nin: ['Cancelled', 'Completed'] },
  startTime: { $lt: requestedEndTime },
  endTime:   { $gt: requestedStartTime }
});
// If conflict exists → reject with 409 Conflict
```

**Edge Case:** `startTime === previous.endTime` is allowed (back-to-back bookings). The overlap check uses strict less-than / greater-than, not less-than-or-equal.

**Status Transitions:**
- `Upcoming` → `Ongoing` (time-based; computed at read-time or via a lightweight scheduled task).
- `Ongoing` → `Completed` (when `endTime` passes).
- `Upcoming` → `Cancelled` (user cancels).

---

#### 3.2.8 `maintenanceRequests`

**Purpose:** Track repair workflows from request to resolution.

| Field | Type | Required | Default | Description |
|---|---|---|---|---|
| `_id` | ObjectId | auto | — | |
| `asset` | ObjectId → `assets` | ✅ | — | |
| `requestedBy` | ObjectId → `users` | ✅ | — | |
| `description` | String | ✅ | — | Issue description |
| `priority` | String (enum) | ✅ | `"Medium"` | `Low`, `Medium`, `High`, `Critical` |
| `photos` | Array of String | ❌ | `[]` | Attached photos |
| `status` | String (enum) | ✅ | `"Pending"` | `Pending`, `Approved`, `Rejected`, `TechnicianAssigned`, `InProgress`, `Resolved` |
| `approvedBy` | ObjectId → `users` | ❌ | `null` | Asset Manager who approved |
| `assignedTechnician` | String | ❌ | `""` | Name or ID of technician (may be external) |
| `rejectionReason` | String | ❌ | `""` | |
| `resolutionNotes` | String | ❌ | `""` | What was done to fix it |
| `resolvedAt` | Date | ❌ | `null` | |
| `createdAt` | Date | auto | — | |
| `updatedAt` | Date | auto | — | |

**Indexes:**
- `{ asset: 1 }`
- `{ status: 1 }`
- `{ requestedBy: 1 }`
- `{ priority: 1 }`

**Workflow:**
```
Pending → Approved → TechnicianAssigned → InProgress → Resolved
       → Rejected
```

**Side Effects (enforced in `maintenance.service.js`):**
- On `Approved`: `asset.status` → `UnderMaintenance`.
- On `Resolved`: `asset.status` → `Available` (or previous status if it was `Allocated` — store previous status in the request or asset).
- Each transition generates a notification and activity log entry.

---

#### 3.2.9 `auditCycles`

**Purpose:** Define a time-bound audit scope with assigned auditors.

| Field | Type | Required | Default | Description |
|---|---|---|---|---|
| `_id` | ObjectId | auto | — | |
| `name` | String | ✅ | — | Descriptive name (e.g., "Q3 2026 Floor 2 Audit") |
| `scope` | Object | ✅ | — | `{ type: "Department" | "Location", value: String | ObjectId }` |
| `startDate` | Date | ✅ | — | |
| `endDate` | Date | ✅ | — | |
| `auditors` | Array of ObjectId → `users` | ✅ | — | At least one auditor |
| `status` | String (enum) | ✅ | `"Open"` | `Open`, `InProgress`, `Closed` |
| `createdBy` | ObjectId → `users` | ✅ | — | |
| `closedBy` | ObjectId → `users` | ❌ | `null` | |
| `closedAt` | Date | ❌ | `null` | |
| `createdAt` | Date | auto | — | |
| `updatedAt` | Date | auto | — | |

**Indexes:**
- `{ status: 1 }`
- `{ "scope.type": 1, "scope.value": 1 }`
- `{ auditors: 1 }`

**Closing Logic:**
- When an audit cycle is closed, it is locked (no further entries allowed).
- All assets marked `Missing` in entries have their asset status updated to `Lost`.
- A discrepancy report is auto-generated (aggregation of entries where `result ≠ Verified`).

---

#### 3.2.10 `auditEntries`

**Purpose:** Per-asset verification record within an audit cycle.

| Field | Type | Required | Default | Description |
|---|---|---|---|---|
| `_id` | ObjectId | auto | — | |
| `auditCycle` | ObjectId → `auditCycles` | ✅ | — | |
| `asset` | ObjectId → `assets` | ✅ | — | |
| `auditor` | ObjectId → `users` | ✅ | — | |
| `result` | String (enum) | ✅ | — | `Verified`, `Missing`, `Damaged` |
| `notes` | String | ❌ | `""` | |
| `createdAt` | Date | auto | — | |
| `updatedAt` | Date | auto | — | |

**Indexes:**
- `{ auditCycle: 1, asset: 1 }` — unique compound (one entry per asset per cycle)
- `{ result: 1 }`

---

#### 3.2.11 `notifications`

**Purpose:** In-app notification system.

| Field | Type | Required | Default | Description |
|---|---|---|---|---|
| `_id` | ObjectId | auto | — | |
| `recipient` | ObjectId → `users` | ✅ | — | |
| `type` | String (enum) | ✅ | — | See enum below |
| `title` | String | ✅ | — | |
| `message` | String | ✅ | — | |
| `relatedEntity` | Object | ❌ | `null` | `{ entityType: String, entityId: ObjectId }` |
| `isRead` | Boolean | ✅ | `false` | |
| `createdAt` | Date | auto | — | |

**Notification Types Enum:**
`AssetAssigned`, `MaintenanceApproved`, `MaintenanceRejected`, `BookingConfirmed`, `BookingCancelled`, `BookingReminder`, `TransferApproved`, `TransferRejected`, `OverdueReturnAlert`, `AuditDiscrepancy`, `RoleChanged`, `General`

**Indexes:**
- `{ recipient: 1, isRead: 1, createdAt: -1 }` — unread notifications query
- `{ createdAt: 1 }` — TTL index (optional: auto-delete after 90 days)

---

#### 3.2.12 `activityLogs`

**Purpose:** Immutable audit trail of all system actions.

| Field | Type | Required | Default | Description |
|---|---|---|---|---|
| `_id` | ObjectId | auto | — | |
| `user` | ObjectId → `users` | ✅ | — | Who performed the action |
| `action` | String | ✅ | — | e.g., `ASSET_CREATED`, `ALLOCATION_MADE`, `MAINTENANCE_APPROVED` |
| `entityType` | String | ✅ | — | e.g., `Asset`, `Allocation`, `Booking` |
| `entityId` | ObjectId | ✅ | — | |
| `description` | String | ✅ | — | Human-readable description |
| `metadata` | Mixed (Object) | ❌ | `{}` | Additional context (old values, new values) |
| `ipAddress` | String | ❌ | `""` | |
| `createdAt` | Date | auto | — | |

**Indexes:**
- `{ user: 1, createdAt: -1 }`
- `{ entityType: 1, entityId: 1 }`
- `{ action: 1 }`
- `{ createdAt: -1 }` — for recent activity queries

**Note:** Activity logs are **append-only** — no update or delete operations are exposed. This ensures an immutable audit trail.

---

#### 3.2.13 `counters` (Internal)

**Purpose:** Support auto-incrementing sequences (e.g., asset tags).

| Field | Type | Required | Description |
|---|---|---|---|
| `_id` | String | ✅ | Sequence name (e.g., `"assetTag"`) |
| `seq` | Number | ✅ | Current sequence value |

Used by `generateAssetTag.js`:
```javascript
// Atomically increment and return the new value
const counter = await Counter.findByIdAndUpdate(
  'assetTag',
  { $inc: { seq: 1 } },
  { new: true, upsert: true }
);
return `AF-${String(counter.seq).padStart(4, '0')}`;
```

---

### 3.3 Entity Relationship Overview

```
users ─────────┬──── departments (via department field)
               │
               ├──── allocations (allocatedTo, allocatedBy)
               ├──── transferRequests (requestedBy, currentHolder, approvedBy)
               ├──── bookings (bookedBy)
               ├──── maintenanceRequests (requestedBy, approvedBy)
               ├──── auditCycles (auditors, createdBy)
               ├──── auditEntries (auditor)
               ├──── notifications (recipient)
               └──── activityLogs (user)

assets ────────┬──── assetCategories (category)
               ├──── departments (department)
               ├──── allocations (asset)
               ├──── transferRequests (asset)
               ├──── bookings (asset)
               ├──── maintenanceRequests (asset)
               ├──── auditEntries (asset)
               └──── users (currentHolder, createdBy)

departments ───┬──── users (head)
               └──── departments (parentDepartment — self-ref)

auditCycles ───── auditEntries (auditCycle)
```

### 3.4 Scalability Considerations

| Concern | Strategy |
|---|---|
| **Large activity logs** | TTL indexes or archival to a separate collection after 1 year |
| **Notification volume** | TTL index for auto-expiry; paginate reads; mark-all-read batch operation |
| **Asset tag generation** | Atomic counter with `findOneAndUpdate` — safe under concurrency |
| **Booking overlap queries** | Compound index on `{ asset, startTime, endTime }` ensures sub-millisecond conflict detection even with millions of bookings |
| **Full-text search** | Add MongoDB text indexes on `assets.name` and `assets.assetTag` for the search feature; later migrate to Elasticsearch/Atlas Search for fuzzy matching |
| **Sharding readiness** | All collections use `_id` as the default shard key; `assets` could be sharded by `department` for multi-tenant patterns |

---

## 4. Authentication System

### 4.1 Registration Flow

```
Client                           Server
  │                                 │
  │  POST /api/v1/auth/register     │
  │  { name, email, password }      │
  │ ──────────────────────────────► │
  │                                 │  1. Validate input (Joi)
  │                                 │  2. Check email uniqueness
  │                                 │  3. Hash password (bcrypt, 12 rounds)
  │                                 │  4. Create user with role = "Employee"
  │                                 │  5. Generate access + refresh tokens
  │                                 │  6. Store hashed refresh token on user doc
  │                                 │  7. Set refresh token in httpOnly cookie
  │  ◄────────────────────────────  │
  │  { success, message,            │
  │    data: { user, accessToken }} │
```

**Key Decision:** Signup always creates an `Employee`. Role elevation to `DepartmentHead` or `AssetManager` is exclusively an Admin action via the Employee Directory API. This prevents self-elevation attacks.

### 4.2 Login Flow

```
Client                           Server
  │                                 │
  │  POST /api/v1/auth/login        │
  │  { email, password }            │
  │ ──────────────────────────────► │
  │                                 │  1. Validate input
  │                                 │  2. Find user by email
  │                                 │  3. Compare password with bcrypt
  │                                 │  4. Check user.status === "Active"
  │                                 │  5. Generate access + refresh tokens
  │                                 │  6. Store hashed refresh token
  │                                 │  7. Set refresh token in httpOnly cookie
  │  ◄────────────────────────────  │
  │  { success, data: { user,       │
  │    accessToken }}                │
```

### 4.3 Token Strategy

| Token | Storage | Lifetime | Purpose |
|---|---|---|---|
| **Access Token** | Client memory / `Authorization` header | 15 minutes | Short-lived authentication for API requests |
| **Refresh Token** | httpOnly secure cookie | 7 days | Obtain a new access token without re-login |

**Why Refresh Tokens:**
- Access tokens are kept short-lived (15 min) to limit damage from leakage.
- Refresh tokens are stored in httpOnly cookies (not accessible to JavaScript → immune to XSS).
- On each refresh, the old refresh token is invalidated and a new one is issued (token rotation) to mitigate replay attacks.

### 4.4 Token Refresh Flow

```
Client                           Server
  │                                 │
  │  POST /api/v1/auth/refresh      │
  │  (refresh token in cookie)      │
  │ ──────────────────────────────► │
  │                                 │  1. Extract refresh token from cookie
  │                                 │  2. Verify JWT signature
  │                                 │  3. Find user & compare hashed token
  │                                 │  4. Generate NEW access + refresh tokens
  │                                 │  5. Update hashed refresh token on user doc
  │                                 │  6. Set new refresh token in cookie
  │  ◄────────────────────────────  │
  │  { success, data: { accessToken }}
```

### 4.5 Logout Flow

```
POST /api/v1/auth/logout
1. Clear refresh token from user doc (set to null)
2. Clear httpOnly cookie
3. Client discards access token from memory
```

### 4.6 Password Hashing

- Library: `bcrypt`
- Salt rounds: 12 (configurable via env)
- Hashing is done in a Mongoose `pre('save')` hook on the User model — only when the `password` field is modified.

### 4.7 Authorization Middleware

Two middleware functions work in tandem:

1. **`auth.middleware.js`** — Verifies the JWT access token:
   - Extracts token from `Authorization: Bearer <token>` header.
   - Verifies signature and expiry using `jsonwebtoken`.
   - Attaches `req.user` (decoded payload: `{ _id, email, role }`).
   - Returns `401 Unauthorized` if missing/invalid/expired.

2. **`role.middleware.js`** — Checks that `req.user.role` is in the allowed list:
   ```javascript
   // Usage in route:
   router.post('/departments', auth, authorize('Admin'), departmentController.create);
   ```
   - Returns `403 Forbidden` if the user's role is not permitted.

### 4.8 Admin Seeding

The first Admin account must be created through a **seed script** (`backend/src/scripts/seedAdmin.js`), not through the API. This script:
1. Checks if an Admin already exists.
2. If not, creates one with credentials from environment variables (`ADMIN_EMAIL`, `ADMIN_PASSWORD`).
3. Is run once during initial deployment.

---

## 5. API Design

All routes are prefixed with `/api/v1/`. Authentication is denoted as 🔒 (required) or 🔓 (public).

### 5.1 Authentication APIs

---

#### `POST /api/v1/auth/register` 🔓

**Description:** Create a new Employee account.

| Property | Detail |
|---|---|
| **Request Body** | `{ name: string, email: string, password: string }` |
| **Validation** | `name`: required, 2-100 chars. `email`: required, valid email. `password`: required, min 8 chars, must include 1 uppercase, 1 number. |
| **Success Response** | `201` — `{ success: true, message: "Registration successful", data: { user: { _id, name, email, role }, accessToken } }` |
| **Error Codes** | `400` — Validation error. `409` — Email already exists. |

---

#### `POST /api/v1/auth/login` 🔓

**Description:** Authenticate an existing user.

| Property | Detail |
|---|---|
| **Request Body** | `{ email: string, password: string }` |
| **Validation** | `email`: required, valid email. `password`: required. |
| **Success Response** | `200` — `{ success: true, message: "Login successful", data: { user: { _id, name, email, role, department }, accessToken } }` |
| **Error Codes** | `400` — Validation error. `401` — Invalid credentials. `403` — Account inactive. |

---

#### `POST /api/v1/auth/refresh` 🔓

**Description:** Get a new access token using the refresh token cookie.

| Property | Detail |
|---|---|
| **Request Body** | None (refresh token read from cookie) |
| **Success Response** | `200` — `{ success: true, data: { accessToken } }` |
| **Error Codes** | `401` — Missing/invalid/expired refresh token. |

---

#### `POST /api/v1/auth/logout` 🔒

**Description:** Invalidate refresh token and clear cookie.

| Property | Detail |
|---|---|
| **Request Body** | None |
| **Success Response** | `200` — `{ success: true, message: "Logged out successfully" }` |
| **Error Codes** | `401` — Not authenticated. |

---

#### `GET /api/v1/auth/me` 🔒

**Description:** Get the currently authenticated user's profile.

| Property | Detail |
|---|---|
| **Success Response** | `200` — `{ success: true, data: { user } }` |
| **Error Codes** | `401` — Not authenticated. |

---

### 5.2 User / Employee Directory APIs

---

#### `GET /api/v1/users` 🔒 Admin

**Description:** List all users with pagination, filtering, and search.

| Property | Detail |
|---|---|
| **Query Params** | `page` (default 1), `limit` (default 20), `role`, `department`, `status`, `search` (name/email) |
| **Success Response** | `200` — `{ success: true, data: { users: [...], pagination: { page, limit, total, pages } } }` |
| **Error Codes** | `401`, `403` |

---

#### `GET /api/v1/users/:id` 🔒 Admin

**Description:** Get a single user's details.

| Property | Detail |
|---|---|
| **Params** | `id` — User ObjectId |
| **Success Response** | `200` — `{ success: true, data: { user } }` |
| **Error Codes** | `401`, `403`, `404` |

---

#### `PATCH /api/v1/users/:id` 🔒 Admin

**Description:** Update a user's profile (name, department, status). This is also the endpoint to assign/change roles.

| Property | Detail |
|---|---|
| **Params** | `id` — User ObjectId |
| **Request Body** | `{ name?, department?, status?, role? }` |
| **Validation** | `role` must be one of `Employee`, `DepartmentHead`, `AssetManager`. Admins cannot demote themselves. |
| **Success Response** | `200` — `{ success: true, message: "User updated", data: { user } }` |
| **Error Codes** | `400`, `401`, `403`, `404` |

**Side Effects:**
- If `role` is changed, a `RoleChanged` notification is sent to the user.
- Activity log entry is created.

---

### 5.3 Department APIs

---

#### `POST /api/v1/departments` 🔒 Admin

**Description:** Create a new department.

| Property | Detail |
|---|---|
| **Request Body** | `{ name: string, description?: string, head?: ObjectId, parentDepartment?: ObjectId }` |
| **Validation** | `name`: required, unique, 2-100 chars. `head`: if provided, must be a valid user with role `DepartmentHead` or `Admin`. |
| **Success Response** | `201` — `{ success: true, data: { department } }` |
| **Error Codes** | `400`, `401`, `403`, `409` (duplicate name) |

---

#### `GET /api/v1/departments` 🔒 Any authenticated

**Description:** List all departments.

| Property | Detail |
|---|---|
| **Query Params** | `status`, `page`, `limit` |
| **Success Response** | `200` — `{ success: true, data: { departments: [...], pagination } }` |

---

#### `GET /api/v1/departments/:id` 🔒 Any authenticated

**Description:** Get department details with head info populated.

---

#### `PATCH /api/v1/departments/:id` 🔒 Admin

**Description:** Update department fields (name, description, head, parentDepartment, status).

---

#### `PATCH /api/v1/departments/:id/deactivate` 🔒 Admin

**Description:** Set department status to `Inactive`.

| Property | Detail |
|---|---|
| **Validation** | Warn if the department has active employees or assets. |
| **Success Response** | `200` — `{ success: true, message: "Department deactivated" }` |

---

### 5.4 Asset Category APIs

---

#### `POST /api/v1/asset-categories` 🔒 Admin

**Description:** Create a new asset category.

| Property | Detail |
|---|---|
| **Request Body** | `{ name: string, description?: string, customFields?: [{ fieldName, fieldType }] }` |
| **Validation** | `name`: required, unique. `customFields[].fieldType`: must be `String | Number | Date | Boolean`. |
| **Success Response** | `201` |

---

#### `GET /api/v1/asset-categories` 🔒 Any authenticated

**Description:** List all asset categories.

---

#### `GET /api/v1/asset-categories/:id` 🔒 Any authenticated

---

#### `PATCH /api/v1/asset-categories/:id` 🔒 Admin

---

### 5.5 Asset APIs

---

#### `POST /api/v1/assets` 🔒 Admin, AssetManager

**Description:** Register a new asset. Auto-generates asset tag.

| Property | Detail |
|---|---|
| **Request Body** | `{ name, category, serialNumber?, acquisitionDate?, acquisitionCost?, condition?, location?, department?, isBookable?, customFieldValues?, photos?, documents? }` |
| **Validation** | `name`: required. `category`: required, valid ObjectId. `serialNumber`: unique if provided. `condition`: enum. |
| **Success Response** | `201` — includes auto-generated `assetTag` |
| **Error Codes** | `400`, `401`, `403`, `409` (duplicate serial number) |

---

#### `GET /api/v1/assets` 🔒 Any authenticated

**Description:** Search and filter assets.

| Property | Detail |
|---|---|
| **Query Params** | `page`, `limit`, `search` (matches assetTag, name, serialNumber), `category`, `status`, `department`, `location`, `isBookable`, `condition`, `sortBy`, `order` |
| **Success Response** | `200` — paginated list with category and department populated |

---

#### `GET /api/v1/assets/:id` 🔒 Any authenticated

**Description:** Get full asset details including current holder.

---

#### `PATCH /api/v1/assets/:id` 🔒 Admin, AssetManager

**Description:** Update asset fields (not status — status changes happen through workflows).

---

#### `GET /api/v1/assets/:id/history` 🔒 Any authenticated

**Description:** Get allocation history + maintenance history for a specific asset.

| Property | Detail |
|---|---|
| **Success Response** | `200` — `{ success: true, data: { allocations: [...], maintenanceRequests: [...] } }` |

---

#### `PATCH /api/v1/assets/:id/status` 🔒 Admin, AssetManager

**Description:** Manually change asset status (for `Retired`, `Disposed`, `Lost` transitions that don't go through other workflows).

| Property | Detail |
|---|---|
| **Request Body** | `{ status: string, reason?: string }` |
| **Validation** | Valid status transition (enforced in service). |

---

### 5.6 Allocation APIs

---

#### `POST /api/v1/allocations` 🔒 Admin, AssetManager, DepartmentHead

**Description:** Allocate an asset to an employee.

| Property | Detail |
|---|---|
| **Request Body** | `{ asset: ObjectId, allocatedTo: ObjectId, expectedReturnDate?: Date }` |
| **Validation** | Asset must be `Available` and not `isBookable`. User must be active. |
| **Success Response** | `201` — `{ success: true, data: { allocation } }` |
| **Error Codes** | `400` — Validation error. `409` — Asset already allocated (response includes `currentHolder` details and a suggestion to use Transfer Request). |

**Side Effects:**
- `asset.status` → `Allocated`
- `asset.currentHolder` → `allocatedTo`
- Notification: `AssetAssigned` sent to `allocatedTo`
- Activity log created

---

#### `GET /api/v1/allocations` 🔒 Any authenticated

**Description:** List allocations with filters.

| Property | Detail |
|---|---|
| **Query Params** | `page`, `limit`, `asset`, `allocatedTo`, `department`, `status` (`Active`, `Returned`, `Overdue`, `Transferred`), `overdue` (boolean) |

---

#### `GET /api/v1/allocations/:id` 🔒 Any authenticated

---

#### `POST /api/v1/allocations/:id/return` 🔒 Admin, AssetManager

**Description:** Process an asset return.

| Property | Detail |
|---|---|
| **Request Body** | `{ returnCondition: string, returnNotes?: string }` |
| **Validation** | Allocation must be `Active` or `Overdue`. |
| **Success Response** | `200` — allocation updated with return info |

**Side Effects:**
- `allocation.status` → `Returned`
- `allocation.actualReturnDate` → now
- `asset.status` → `Available`
- `asset.currentHolder` → `null`
- `asset.condition` → `returnCondition`
- Notification + activity log

---

#### `GET /api/v1/allocations/overdue` 🔒 Admin, AssetManager

**Description:** Get all overdue allocations.

| Property | Detail |
|---|---|
| **Logic** | `expectedReturnDate < now AND status === "Active"` |

---

### 5.7 Transfer Request APIs

---

#### `POST /api/v1/transfers` 🔒 Any authenticated

**Description:** Request a transfer of an already-allocated asset.

| Property | Detail |
|---|---|
| **Request Body** | `{ asset: ObjectId, reason?: string }` |
| **Validation** | Asset must be currently allocated. Requester must not be the current holder. |
| **Success Response** | `201` |

---

#### `GET /api/v1/transfers` 🔒 Admin, AssetManager, DepartmentHead

**Description:** List transfer requests with filters.

| Property | Detail |
|---|---|
| **Query Params** | `page`, `limit`, `status`, `asset`, `requestedBy` |

---

#### `GET /api/v1/transfers/:id` 🔒 Involved parties + Admin/AssetManager

---

#### `PATCH /api/v1/transfers/:id/approve` 🔒 Admin, AssetManager, DepartmentHead

**Description:** Approve a transfer request.

| Property | Detail |
|---|---|
| **Validation** | Transfer must be `Requested`. Approver cannot be the requester. |
| **Side Effects** | Status → `Approved`. System auto-completes: old allocation closed, new allocation created, asset.currentHolder updated, notifications sent. |

---

#### `PATCH /api/v1/transfers/:id/reject` 🔒 Admin, AssetManager, DepartmentHead

**Description:** Reject a transfer request.

| Property | Detail |
|---|---|
| **Request Body** | `{ rejectionReason: string }` |

---

### 5.8 Booking APIs

---

#### `POST /api/v1/bookings` 🔒 Any authenticated

**Description:** Book a shared resource for a time slot.

| Property | Detail |
|---|---|
| **Request Body** | `{ asset: ObjectId, startTime: Date, endTime: Date, purpose?: string }` |
| **Validation** | Asset must have `isBookable: true`. `endTime` > `startTime`. No overlapping active bookings. `startTime` must be in the future. |
| **Success Response** | `201` |
| **Error Codes** | `400` — Validation. `409` — Overlapping booking (response includes conflicting booking details). |

---

#### `GET /api/v1/bookings` 🔒 Any authenticated

**Description:** List bookings with filters.

| Property | Detail |
|---|---|
| **Query Params** | `page`, `limit`, `asset`, `bookedBy`, `status`, `startDate`, `endDate` |

---

#### `GET /api/v1/bookings/calendar/:assetId` 🔒 Any authenticated

**Description:** Get all non-cancelled bookings for a specific asset within a date range (for calendar view).

| Property | Detail |
|---|---|
| **Query Params** | `startDate`, `endDate` |
| **Success Response** | `200` — Array of bookings with times and bookedBy info |

---

#### `GET /api/v1/bookings/:id` 🔒 Any authenticated

---

#### `PATCH /api/v1/bookings/:id/cancel` 🔒 Booker or Admin/AssetManager

**Description:** Cancel an upcoming booking.

| Property | Detail |
|---|---|
| **Request Body** | `{ cancelReason?: string }` |
| **Validation** | Booking must be `Upcoming`. Cannot cancel `Ongoing` or `Completed`. |

---

#### `PATCH /api/v1/bookings/:id/reschedule` 🔒 Booker or Admin/AssetManager

**Description:** Change the time slot of an existing booking.

| Property | Detail |
|---|---|
| **Request Body** | `{ startTime: Date, endTime: Date }` |
| **Validation** | Same overlap validation as creation. Booking must be `Upcoming`. |

---

### 5.9 Maintenance APIs

---

#### `POST /api/v1/maintenance` 🔒 Any authenticated

**Description:** Raise a maintenance request for an asset.

| Property | Detail |
|---|---|
| **Request Body** | `{ asset: ObjectId, description: string, priority: string, photos?: [string] }` |
| **Validation** | `description`: required, min 10 chars. `priority`: enum. Asset must exist and not be `Disposed` or `Retired`. |
| **Success Response** | `201` |

---

#### `GET /api/v1/maintenance` 🔒 Any authenticated (filtered by role)

**Description:** List maintenance requests.

| Property | Detail |
|---|---|
| **Query Params** | `page`, `limit`, `status`, `priority`, `asset`, `requestedBy` |
| **Note** | Employees see only their own requests. AssetManagers/Admins see all. |

---

#### `GET /api/v1/maintenance/:id` 🔒 Involved parties + Admin/AssetManager

---

#### `PATCH /api/v1/maintenance/:id/approve` 🔒 Admin, AssetManager

**Description:** Approve a maintenance request.

| Side Effects | `status` → `Approved`. `asset.status` → `UnderMaintenance`. Notification sent to requester. |

---

#### `PATCH /api/v1/maintenance/:id/reject` 🔒 Admin, AssetManager

| Property | Detail |
|---|---|
| **Request Body** | `{ rejectionReason: string }` |

---

#### `PATCH /api/v1/maintenance/:id/assign-technician` 🔒 Admin, AssetManager

| Property | Detail |
|---|---|
| **Request Body** | `{ assignedTechnician: string }` |
| **Side Effects** | `status` → `TechnicianAssigned` |

---

#### `PATCH /api/v1/maintenance/:id/start` 🔒 Admin, AssetManager

| Side Effects | `status` → `InProgress` |

---

#### `PATCH /api/v1/maintenance/:id/resolve` 🔒 Admin, AssetManager

| Property | Detail |
|---|---|
| **Request Body** | `{ resolutionNotes: string }` |
| **Side Effects** | `status` → `Resolved`. `asset.status` → `Available`. `resolvedAt` → now. Notification to requester. |

---

### 5.10 Audit APIs

---

#### `POST /api/v1/audits` 🔒 Admin

**Description:** Create an audit cycle.

| Property | Detail |
|---|---|
| **Request Body** | `{ name: string, scope: { type: "Department" | "Location", value: string }, startDate: Date, endDate: Date, auditors: [ObjectId] }` |
| **Validation** | `auditors`: at least one, all must be valid active users. `endDate` > `startDate`. |
| **Success Response** | `201` |

---

#### `GET /api/v1/audits` 🔒 Admin, AssetManager, Auditors

**Description:** List audit cycles.

| Property | Detail |
|---|---|
| **Query Params** | `page`, `limit`, `status` |

---

#### `GET /api/v1/audits/:id` 🔒 Admin, AssetManager, Assigned Auditors

**Description:** Get audit cycle details with entries summary.

---

#### `POST /api/v1/audits/:id/entries` 🔒 Assigned Auditors

**Description:** Submit an audit entry for an asset.

| Property | Detail |
|---|---|
| **Request Body** | `{ asset: ObjectId, result: "Verified" | "Missing" | "Damaged", notes?: string }` |
| **Validation** | Audit cycle must be `Open` or `InProgress`. Asset must not already have an entry in this cycle. Submitter must be an assigned auditor. |
| **Side Effects** | If first entry, cycle status → `InProgress`. |

---

#### `GET /api/v1/audits/:id/entries` 🔒 Admin, AssetManager, Assigned Auditors

**Description:** List all entries for an audit cycle.

---

#### `POST /api/v1/audits/:id/close` 🔒 Admin

**Description:** Close an audit cycle (locks it, updates asset statuses).

| Property | Detail |
|---|---|
| **Validation** | Cycle must be `Open` or `InProgress`. |
| **Side Effects** | `status` → `Closed`. Assets marked `Missing` → `asset.status` = `Lost`. Discrepancy report generated. Notifications sent for flagged items. |

---

#### `GET /api/v1/audits/:id/discrepancy-report` 🔒 Admin, AssetManager

**Description:** Get the discrepancy report (entries where result ≠ `Verified`).

---

### 5.11 Report APIs

---

#### `GET /api/v1/reports/asset-utilization` 🔒 Admin, AssetManager

**Description:** Asset utilisation trends — most-used vs. idle assets based on allocation/booking frequency.

| Property | Detail |
|---|---|
| **Query Params** | `startDate`, `endDate`, `category`, `department` |

---

#### `GET /api/v1/reports/maintenance-frequency` 🔒 Admin, AssetManager

**Description:** Maintenance frequency grouped by asset or category.

---

#### `GET /api/v1/reports/department-allocation` 🔒 Admin, AssetManager, DepartmentHead

**Description:** Department-wise allocation summary.

---

#### `GET /api/v1/reports/booking-heatmap` 🔒 Admin, AssetManager

**Description:** Resource booking heatmap — peak usage windows by hour/day.

---

#### `GET /api/v1/reports/assets-due` 🔒 Admin, AssetManager

**Description:** Assets due for maintenance or nearing retirement (based on age or condition).

---

#### `GET /api/v1/reports/export/:type` 🔒 Admin, AssetManager

**Description:** Export a report as CSV or JSON.

| Property | Detail |
|---|---|
| **Params** | `type`: `asset-utilization`, `maintenance-frequency`, `department-allocation`, `booking-heatmap`, `assets-due` |
| **Query Params** | Same as the corresponding report endpoint + `format` (`csv` or `json`) |
| **Response** | File download or JSON array |

---

### 5.12 Dashboard / KPI APIs

---

#### `GET /api/v1/dashboard/stats` 🔒 Any authenticated

**Description:** Aggregated KPI data for the dashboard.

| Property | Detail |
|---|---|
| **Success Response** | `200` — `{ success: true, data: { assetsAvailable, assetsAllocated, maintenanceToday, activeBookings, pendingTransfers, upcomingReturns, overdueReturns } }` |
| **Note** | Data is scoped by role: Employees see their own stats. Department Heads see department stats. Admins/AssetManagers see org-wide stats. |

---

### 5.13 Notification APIs

---

#### `GET /api/v1/notifications` 🔒 Any authenticated

**Description:** Get the current user's notifications.

| Property | Detail |
|---|---|
| **Query Params** | `page`, `limit`, `isRead` (boolean) |
| **Note** | Always filtered to `req.user._id`. Sorted by `createdAt` descending. |

---

#### `PATCH /api/v1/notifications/:id/read` 🔒 Any authenticated

**Description:** Mark a single notification as read.

---

#### `PATCH /api/v1/notifications/read-all` 🔒 Any authenticated

**Description:** Mark all unread notifications as read for the current user.

---

#### `GET /api/v1/notifications/unread-count` 🔒 Any authenticated

**Description:** Get the count of unread notifications.

---

### 5.14 Activity Log APIs

---

#### `GET /api/v1/activity-logs` 🔒 Admin

**Description:** Query the full audit trail.

| Property | Detail |
|---|---|
| **Query Params** | `page`, `limit`, `user`, `action`, `entityType`, `entityId`, `startDate`, `endDate` |

---

#### `GET /api/v1/activity-logs/entity/:entityType/:entityId` 🔒 Admin, AssetManager

**Description:** Get all activity for a specific entity (e.g., all logs for Asset AF-0023).

---

## 6. Middleware

### 6.1 Middleware Stack (applied in order in `app.js`)

```javascript
// 1. Security headers
app.use(helmet());

// 2. CORS
app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }));

// 3. Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// 4. Cookie parsing
app.use(cookieParser());

// 5. Request logging
app.use(morgan(env.NODE_ENV === 'development' ? 'dev' : 'combined'));

// 6. API routes
app.use('/api/v1', routes);

// 7. 404 handler
app.use(notFound);

// 8. Global error handler (MUST be last)
app.use(errorHandler);
```

### 6.2 Custom Middleware Details

---

#### `asyncHandler.js`

Wraps async controller functions so rejected promises are automatically forwarded to Express's error handler.

```javascript
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};
```

**Why:** Without this, every controller would need its own try/catch block, leading to boilerplate.

---

#### `auth.middleware.js`

- Extracts `Authorization: Bearer <token>` from the request header.
- Verifies the token using `jsonwebtoken.verify()`.
- Fetches the user from DB (to ensure they still exist and are active).
- Attaches `req.user` with `{ _id, name, email, role, department }`.
- Returns `401` if token is missing, malformed, expired, or user not found.

---

#### `role.middleware.js`

A higher-order function that returns middleware:

```javascript
const authorize = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    throw new ApiError(403, 'You do not have permission to perform this action');
  }
  next();
};
```

---

#### `validate.middleware.js`

Runs a Joi schema against `req.body`, `req.query`, or `req.params`:

```javascript
const validate = (schema, source = 'body') => (req, res, next) => {
  const { error, value } = schema.validate(req[source], { abortEarly: false, stripUnknown: true });
  if (error) {
    const messages = error.details.map((d) => d.message);
    throw new ApiError(400, 'Validation failed', messages);
  }
  req[source] = value; // Replace with sanitised values
  next();
};
```

---

#### `errorHandler.js`

The global error handler catches all errors and formats them:

- **`ApiError` instances:** Use the status code and message from the error.
- **Mongoose `ValidationError`:** Extract field-level messages → `400`.
- **Mongoose `CastError`:** "Invalid ID format" → `400`.
- **Mongoose duplicate key error (code 11000):** "Duplicate value for field X" → `409`.
- **JWT `TokenExpiredError`:** "Token expired" → `401`.
- **JWT `JsonWebTokenError`:** "Invalid token" → `401`.
- **Everything else:** "Internal server error" → `500` (log full stack in development, hide in production).

---

#### `notFound.js`

Simple 404 catch-all for undefined routes:

```javascript
const notFound = (req, res, next) => {
  next(new ApiError(404, `Route not found: ${req.method} ${req.originalUrl}`));
};
```

---

### 6.3 Future Middleware (Not Implemented in Phase 1)

| Middleware | Purpose | When to Add |
|---|---|---|
| **Rate Limiter** | Prevent brute-force and abuse (`express-rate-limit`) | Phase 5 or before public deployment |
| **Request Logger (structured)** | JSON-formatted logs for production (`winston` or `pino`) | Phase 5 |
| **File Upload** | Multer middleware for photo/document uploads | Phase 4 (if file uploads are scoped in) |
| **Compression** | `compression` middleware for response gzip | Before deployment |

---

## 7. Validation

### 7.1 Library Choice: Joi

| Library | Pros | Cons | Verdict |
|---|---|---|---|
| **Joi** | Mature, expressive API, excellent for complex nested objects, built-in type coercion, custom error messages, widely adopted in Express apps | Slightly larger bundle than Zod | ✅ **Selected** |
| **express-validator** | Express-native, chain syntax | Less composable for complex schemas, harder to test in isolation | ❌ |
| **Zod** | TypeScript-first, great DX | Better suited for TypeScript projects; less Express-ecosystem integration | ❌ |

**Why Joi:**
- AssetFlow has complex nested objects (`customFields`, `scope` in audits) that Joi handles elegantly.
- Joi's `.stripUnknown()` automatically removes unexpected fields — a security benefit.
- Joi schemas are easily testable in isolation (pass an object, get a result).

### 7.2 Validation Strategy

1. **One schema file per domain** (e.g., `validators/asset.validator.js`).
2. Each file exports named schemas for different operations:
   ```javascript
   module.exports = {
     createAsset: Joi.object({ ... }),
     updateAsset: Joi.object({ ... }),
     updateAssetStatus: Joi.object({ ... }),
   };
   ```
3. Schemas are applied via the `validate` middleware in routes:
   ```javascript
   router.post('/', auth, authorize('Admin', 'AssetManager'),
     validate(assetValidator.createAsset), assetController.create);
   ```
4. **Validation runs before the controller** — invalid requests never reach business logic.
5. All validation errors return `400` with an `errors` array listing every failed field.

### 7.3 Common Validation Patterns

| Pattern | Joi Implementation |
|---|---|
| ObjectId | `Joi.string().regex(/^[0-9a-fA-F]{24}$/).message('Invalid ID format')` |
| Email | `Joi.string().email().lowercase().trim()` |
| Enum | `Joi.string().valid('Low', 'Medium', 'High', 'Critical')` |
| Date in future | `Joi.date().iso().greater('now')` |
| Pagination | `Joi.object({ page: Joi.number().integer().min(1).default(1), limit: Joi.number().integer().min(1).max(100).default(20) })` |
| Optional string | `Joi.string().allow('').optional()` |
| Array of ObjectIds | `Joi.array().items(Joi.string().regex(/^[0-9a-fA-F]{24}$/)).min(1)` |

---

## 8. Security

### 8.1 Security Measures

| Threat | Mitigation | Implementation |
|---|---|---|
| **Credential theft** | Passwords hashed with bcrypt (12 salt rounds) | `User` model pre-save hook |
| **Token leakage** | Short-lived access tokens (15 min); refresh tokens in httpOnly cookies | `tokenUtils.js`, cookie options |
| **XSS** | `helmet()` sets security headers (Content-Security-Policy, X-XSS-Protection, etc.) | `app.js` middleware stack |
| **NoSQL injection** | Joi validation strips unknown fields; Mongoose casts types; `mongo-sanitize` for extra protection | `validate.middleware.js` + `express-mongo-sanitize` |
| **CSRF** | Refresh token in httpOnly cookie + SameSite attribute; access token in Authorization header (not cookie) | Cookie configuration |
| **CORS abuse** | Strict origin whitelist via `cors()` | `app.js` |
| **Brute force** | Rate limiting on auth endpoints (future: `express-rate-limit`) | Phase 5 |
| **Information leakage** | Error handler hides stack traces in production; `password` field excluded from all user queries | `errorHandler.js`, Mongoose `toJSON` transform |
| **Privilege escalation** | Role changes only via Admin API; signup always creates Employee | `auth.service.js`, `user.service.js` |
| **Input overflow** | `express.json({ limit: '10mb' })` caps body size | `app.js` |

### 8.2 Secure Cookie Configuration (Refresh Token)

```javascript
const cookieOptions = {
  httpOnly: true,                         // Not accessible via JavaScript
  secure: process.env.NODE_ENV === 'production', // HTTPS only in production
  sameSite: 'strict',                     // CSRF protection
  maxAge: 7 * 24 * 60 * 60 * 1000,       // 7 days
  path: '/api/v1/auth',                   // Only sent to auth endpoints
};
```

### 8.3 Password Field Exclusion

In the `User` model:
```javascript
UserSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  delete obj.refreshToken;
  return obj;
};
```

This ensures passwords and refresh tokens are never accidentally leaked in API responses.

### 8.4 Dependencies for Security

| Package | Purpose |
|---|---|
| `helmet` | Sets various HTTP security headers |
| `cors` | Cross-Origin Resource Sharing configuration |
| `bcrypt` | Password hashing |
| `jsonwebtoken` | JWT creation and verification |
| `express-mongo-sanitize` | Strips `$` and `.` from user input to prevent NoSQL injection |
| `cookie-parser` | Parse cookies for refresh token handling |

---

## 9. Error Handling

### 9.1 Standard API Response Format

All API responses follow a consistent structure for predictable client-side parsing.

**Success Response:**
```json
{
  "success": true,
  "message": "Asset created successfully",
  "data": {
    "asset": { ... }
  }
}
```

**Success Response with Pagination:**
```json
{
  "success": true,
  "message": "Assets retrieved successfully",
  "data": {
    "assets": [ ... ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 150,
      "pages": 8
    }
  }
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    "\"name\" is required",
    "\"category\" must be a valid ObjectId"
  ]
}
```

**Error Response (single error):**
```json
{
  "success": false,
  "message": "Asset not found",
  "errors": []
}
```

### 9.2 ApiError Class

```javascript
class ApiError extends Error {
  constructor(statusCode, message, errors = [], stack = '') {
    super(message);
    this.statusCode = statusCode;
    this.success = false;
    this.errors = errors;
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}
```

### 9.3 ApiResponse Class

```javascript
class ApiResponse {
  constructor(statusCode, message, data = {}) {
    this.success = statusCode < 400;
    this.message = message;
    this.data = data;
    this.statusCode = statusCode;
  }
}
```

Used in controllers:
```javascript
res.status(201).json(new ApiResponse(201, 'Asset created successfully', { asset }));
```

### 9.4 HTTP Status Codes Used

| Code | Meaning | When Used |
|---|---|---|
| `200` | OK | Successful GET, PATCH, DELETE |
| `201` | Created | Successful POST that creates a resource |
| `400` | Bad Request | Validation errors, malformed input |
| `401` | Unauthorised | Missing or invalid authentication |
| `403` | Forbidden | Authenticated but insufficient role |
| `404` | Not Found | Resource doesn't exist |
| `409` | Conflict | Duplicate entry, double-allocation, overlapping booking |
| `500` | Internal Server Error | Unhandled server errors |

---

## 10. Backend Development Roadmap

### Phase 1 — Project Setup & Foundation (Days 1-2)

| Task | Details |
|---|---|
| 1.1 | Initialise `backend/` with `npm init` |
| 1.2 | Install core dependencies: `express`, `mongoose`, `dotenv`, `cors`, `helmet`, `morgan`, `bcrypt`, `jsonwebtoken`, `joi`, `cookie-parser`, `express-mongo-sanitize` |
| 1.3 | Install dev dependencies: `nodemon`, `eslint`, `prettier` |
| 1.4 | Create `.env`, `.env.example`, `.gitignore` |
| 1.5 | Create folder structure (`src/config`, `src/models`, `src/routes`, `src/controllers`, `src/services`, `src/middleware`, `src/validators`, `src/utils`) |
| 1.6 | Implement `config/db.js` — Mongoose connection with retry logic |
| 1.7 | Implement `config/env.js` — Centralised env access with validation |
| 1.8 | Implement `config/constants.js` — All enums and constants |
| 1.9 | Implement utility classes: `ApiError.js`, `ApiResponse.js`, `pagination.js` |
| 1.10 | Implement core middleware: `asyncHandler.js`, `errorHandler.js`, `notFound.js` |
| 1.11 | Create `app.js` — Express app with middleware stack |
| 1.12 | Create `server.js` — Entry point with DB connection and server start |
| 1.13 | Verify: server starts, connects to MongoDB, and returns 404 for unknown routes |

---

### Phase 2 — Database Models (Days 2-3)

| Task | Details |
|---|---|
| 2.1 | Implement `User` model with password hashing hook, `toJSON` transform, and indexes |
| 2.2 | Implement `Department` model |
| 2.3 | Implement `AssetCategory` model |
| 2.4 | Implement `Asset` model with all indexes |
| 2.5 | Implement `Counter` model for auto-incrementing asset tags |
| 2.6 | Implement `Allocation` model |
| 2.7 | Implement `TransferRequest` model |
| 2.8 | Implement `Booking` model |
| 2.9 | Implement `MaintenanceRequest` model |
| 2.10 | Implement `AuditCycle` model |
| 2.11 | Implement `AuditEntry` model with unique compound index |
| 2.12 | Implement `Notification` model |
| 2.13 | Implement `ActivityLog` model |
| 2.14 | Verify: all models can be imported without errors; test basic CRUD on User model via a script |

---

### Phase 3 — Authentication System (Days 3-4)

| Task | Details |
|---|---|
| 3.1 | Implement `tokenUtils.js` — sign/verify access and refresh tokens |
| 3.2 | Implement `auth.middleware.js` — JWT verification |
| 3.3 | Implement `role.middleware.js` — Role-based authorisation |
| 3.4 | Implement `validate.middleware.js` — Joi schema runner |
| 3.5 | Create `validators/auth.validator.js` — Register and login schemas |
| 3.6 | Implement `auth.service.js` — Register, login, refresh, logout logic |
| 3.7 | Implement `auth.controller.js` — Request handlers |
| 3.8 | Create `auth.routes.js` — Wire routes |
| 3.9 | Create `scripts/seedAdmin.js` — First admin account creation |
| 3.10 | Verify: Test register → login → access protected route → refresh → logout flow via Postman/curl |

---

### Phase 4 — Core Feature APIs (Days 4-8)

#### Phase 4A — Organisation Setup (Day 4-5)

| Task | Details |
|---|---|
| 4A.1 | Departments: validator → service → controller → routes |
| 4A.2 | Asset Categories: validator → service → controller → routes |
| 4A.3 | Employee Directory (Users CRUD): validator → service → controller → routes |
| 4A.4 | Role promotion API (Admin changes user's role) |
| 4A.5 | Verify: CRUD operations for departments, categories, and users via Postman |

#### Phase 4B — Asset Management (Day 5-6)

| Task | Details |
|---|---|
| 4B.1 | Implement `generateAssetTag.js` utility |
| 4B.2 | Asset CRUD: validator → service → controller → routes |
| 4B.3 | Asset search/filter with pagination |
| 4B.4 | Asset status transition logic in service (with validation) |
| 4B.5 | Asset history endpoint (aggregates allocations + maintenance) |
| 4B.6 | Verify: Register asset, search, filter, update, view history |

#### Phase 4C — Allocation & Transfer (Day 6-7)

| Task | Details |
|---|---|
| 4C.1 | Allocation service with conflict detection (double-allocation prevention) |
| 4C.2 | Allocation CRUD + return flow |
| 4C.3 | Overdue allocation detection (computed virtual or query-based) |
| 4C.4 | Transfer request workflow (create, approve, reject, complete) |
| 4C.5 | Implement `notification.service.js` — Create notifications on events |
| 4C.6 | Implement `activityLog.service.js` — Log all state-changing actions |
| 4C.7 | Verify: Full allocation → return and allocation → transfer → re-allocation flows |

#### Phase 4D — Resource Booking (Day 7)

| Task | Details |
|---|---|
| 4D.1 | Booking service with overlap validation |
| 4D.2 | Booking CRUD + cancel + reschedule |
| 4D.3 | Calendar endpoint for a specific asset |
| 4D.4 | Verify: Create bookings, test overlap rejection, cancel, reschedule |

#### Phase 4E — Maintenance (Day 7-8)

| Task | Details |
|---|---|
| 4E.1 | Maintenance request CRUD |
| 4E.2 | Full workflow: approve → assign tech → start → resolve |
| 4E.3 | Asset status auto-transitions on approve/resolve |
| 4E.4 | Verify: Complete maintenance workflow with status changes |

#### Phase 4F — Audits (Day 8)

| Task | Details |
|---|---|
| 4F.1 | Audit cycle CRUD |
| 4F.2 | Audit entry submission by assigned auditors |
| 4F.3 | Close audit cycle with asset status updates |
| 4F.4 | Discrepancy report generation |
| 4F.5 | Verify: Create cycle → submit entries → close → verify discrepancy report |

#### Phase 4G — Reports & Dashboard (Day 8-9)

| Task | Details |
|---|---|
| 4G.1 | Dashboard KPI aggregation endpoint |
| 4G.2 | Asset utilisation report |
| 4G.3 | Maintenance frequency report |
| 4G.4 | Department allocation summary |
| 4G.5 | Booking heatmap |
| 4G.6 | Report export (CSV + JSON) |
| 4G.7 | Verify: All report endpoints return meaningful data |

#### Phase 4H — Notifications & Activity Logs (Day 9)

| Task | Details |
|---|---|
| 4H.1 | Notification listing, read, read-all, unread-count endpoints |
| 4H.2 | Activity log listing and entity-specific log endpoints |
| 4H.3 | Verify: Notifications generated from prior workflows are visible and markable |

---

### Phase 5 — Hardening & Polish (Day 9-10)

| Task | Details |
|---|---|
| 5.1 | Add `express-rate-limit` to auth endpoints (e.g., 5 login attempts per minute) |
| 5.2 | Add `express-mongo-sanitize` to app middleware stack |
| 5.3 | Review and harden all input validation schemas |
| 5.4 | Add structured logging with `winston` or `pino` |
| 5.5 | Write seed scripts for demo data (departments, categories, assets, users) |
| 5.6 | End-to-end manual testing of all workflows |
| 5.7 | Fix edge cases and improve error messages |

---

### Phase 6 — Deployment Preparation (Day 10+)

| Task | Details |
|---|---|
| 6.1 | Create production-ready `.env` template |
| 6.2 | Add health check endpoint (`GET /api/v1/health`) |
| 6.3 | Add `start` script to `package.json` (`node server.js`) |
| 6.4 | Document API endpoints in README or Postman collection |
| 6.5 | Create Dockerfile (future) |
| 6.6 | Deploy to a cloud provider (future) |

---

## 11. Coding Standards

### 11.1 Naming Conventions

| Element | Convention | Example |
|---|---|---|
| Files | camelCase | `assetCategory.controller.js` |
| Folders | lowercase | `controllers/`, `models/` |
| Variables | camelCase | `assetTag`, `expectedReturnDate` |
| Constants | UPPER_SNAKE_CASE | `MAX_LOGIN_ATTEMPTS`, `ASSET_STATUSES` |
| Functions | camelCase | `createAsset()`, `findOverdueAllocations()` |
| Classes | PascalCase | `ApiError`, `ApiResponse` |
| Models | PascalCase (singular) | `User`, `Asset`, `AuditCycle` |
| Collections | camelCase (plural, auto by Mongoose) | `users`, `assets`, `auditCycles` |
| Route files | `<domain>.routes.js` | `asset.routes.js` |
| Controller files | `<domain>.controller.js` | `asset.controller.js` |
| Service files | `<domain>.service.js` | `asset.service.js` |
| Validator files | `<domain>.validator.js` | `asset.validator.js` |
| Env variables | UPPER_SNAKE_CASE | `MONGODB_URI`, `JWT_ACCESS_SECRET` |

### 11.2 API URL Naming

- Use **kebab-case** for multi-word resources: `/asset-categories`, `/transfer-requests`
- Use **nouns** for resources, not verbs: `/assets` not `/getAssets`
- Use HTTP methods for actions: `GET /assets` (list), `POST /assets` (create), `PATCH /assets/:id` (update)
- Use sub-resources for related entities: `/assets/:id/history`, `/audits/:id/entries`
- Workflow actions use verb suffixes: `/allocations/:id/return`, `/maintenance/:id/approve`
- Always version: `/api/v1/...`

### 11.3 Git Commit Conventions

Follow the **Conventional Commits** specification:

```
<type>(<scope>): <description>

[optional body]
[optional footer]
```

**Types:**

| Type | Usage |
|---|---|
| `feat` | New feature |
| `fix` | Bug fix |
| `refactor` | Code restructuring without functional change |
| `docs` | Documentation changes |
| `chore` | Maintenance (deps, config, scripts) |
| `test` | Adding or fixing tests |
| `style` | Code style changes (formatting, semicolons) |

**Examples:**
```
feat(auth): implement JWT refresh token rotation
fix(booking): correct overlap validation for back-to-back slots
refactor(allocation): extract conflict check into service layer
docs(api): add Postman collection for maintenance endpoints
chore(deps): update mongoose to 8.x
```

### 11.4 Clean Code Principles

1. **Single Responsibility:** Each function does one thing. Each file belongs to one domain.
2. **DRY:** Shared logic goes into services or utilities — never duplicate across controllers.
3. **Fail Fast:** Validate input at the boundary (middleware), not deep in business logic.
4. **Explicit over Implicit:** Return clear error messages. Name variables descriptively. Avoid abbreviations.
5. **No Magic Strings:** All status values, roles, and action types live in `constants.js`.
6. **Consistent Patterns:** Every domain module follows the same structure — validator → service → controller → route.
7. **Comments:** Write comments for *why*, not *what*. The code should be self-documenting for *what*.
8. **No `console.log` in production code:** Use the logger utility.

### 11.5 ESLint & Prettier Configuration

- **ESLint:** Enforce coding rules (no unused variables, consistent returns, etc.)
- **Prettier:** Enforce formatting (2-space indent, single quotes, trailing commas, 100-char line width)
- Add a `.prettierrc` and `.eslintrc.json` to the `backend/` root.

---

## 12. Frontend (Minimal)

> **Note:** The frontend is intentionally minimal. It exists solely for API testing during development. A full redesign will be done later.

### 12.1 Structure

```
frontend/
├── src/
│   ├── api/                 # Axios instance + service functions
│   │   ├── axiosInstance.js  # Base URL, interceptors, token refresh
│   │   ├── authApi.js
│   │   ├── assetApi.js
│   │   └── ...
│   │
│   ├── context/             # React context for auth state
│   │   └── AuthContext.jsx
│   │
│   ├── pages/
│   │   ├── LoginPage.jsx
│   │   ├── RegisterPage.jsx
│   │   └── DashboardPage.jsx  # Placeholder — shows KPI cards
│   │
│   ├── components/
│   │   ├── ProtectedRoute.jsx
│   │   └── Navbar.jsx
│   │
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
│
├── package.json
├── vite.config.js
└── tailwind.config.js
```

### 12.2 Setup Tasks

1. Install Tailwind CSS: `npm install -D tailwindcss @tailwindcss/vite`
2. Install routing: `npm install react-router-dom`
3. Install HTTP client: `npm install axios`
4. Configure Vite proxy to backend (`/api` → `http://localhost:5000`)
5. Create `axiosInstance.js` with request/response interceptors for token handling
6. Build login and register forms (functional, minimal styling)
7. Build dashboard placeholder with hardcoded KPI card layout
8. Implement `ProtectedRoute` component using `AuthContext`

### 12.3 Scope Boundaries

**In scope for now:**
- Login / Register pages
- Dashboard with KPI cards (data from API)
- Basic navigation
- Auth context + protected routes

**Out of scope (deferred to frontend redesign):**
- All other screens (asset directory, allocation, booking, maintenance, audit, reports)
- UI/UX design, animations, responsive layouts
- State management beyond React context
- Component library selection

---

## 13. Future Improvements

These are enhancements to be considered after the core MVP is stable. Ordered roughly by priority and impact.

### 13.1 Near-Term (Post-MVP)

| Enhancement | Description | Impact |
|---|---|---|
| **Swagger / OpenAPI Documentation** | Use `swagger-jsdoc` + `swagger-ui-express` to auto-generate interactive API docs from JSDoc annotations | High — enables frontend developers and QA to self-serve |
| **Unit Testing** | Jest + Supertest for API endpoint testing; test service layer functions in isolation | High — catch regressions early |
| **Integration Testing** | Use `mongodb-memory-server` for in-memory MongoDB during tests; test complete workflows | High |
| **Email Verification** | Send a verification email on signup; block login until verified | Medium — prevents fake accounts |
| **Password Reset** | "Forgot password" flow with time-limited email tokens | Medium — listed in features.txt |
| **File Uploads** | Multer for `photos` and `documents` fields on assets and maintenance requests | Medium — currently stored as placeholder URLs |
| **Postman Collection** | Export a complete Postman collection with examples and environment variables | High — invaluable for team onboarding |

### 13.2 Mid-Term

| Enhancement | Description |
|---|---|
| **Redis** | Cache dashboard stats, session store for refresh tokens, rate-limit counters |
| **WebSockets** | Real-time notifications via Socket.io instead of polling |
| **Cloud Storage** | Move file uploads to AWS S3 / GCP Cloud Storage / Azure Blob |
| **Scheduled Jobs** | Use `node-cron` or Bull queue for: overdue allocation flagging, booking status transitions (Upcoming → Ongoing → Completed), booking reminder notifications |
| **QR Code Generation** | Generate QR codes for each asset tag; link to asset detail page |
| **Bulk Operations** | Bulk asset import via CSV, bulk allocation, bulk audit entry submission |
| **Pagination Cursor** | Switch from offset-based to cursor-based pagination for large collections |

### 13.3 Long-Term

| Enhancement | Description |
|---|---|
| **Docker & Docker Compose** | Containerise backend + MongoDB + Redis for consistent dev environments and deployment |
| **CI/CD** | GitHub Actions or GitLab CI: lint → test → build → deploy pipeline |
| **Microservices** | Split into independent services (Auth, Asset, Booking, Notification) if scale demands |
| **Event-Driven Architecture** | Use message queues (RabbitMQ, Kafka) for cross-service communication |
| **Caching Layer** | Redis-backed caching for frequently accessed data (dashboard stats, asset directory) |
| **Multi-Tenancy** | Support multiple organisations on a single deployment |
| **Audit Log Archival** | Move old activity logs to cold storage (e.g., MongoDB Atlas Archive) |
| **Full-Text Search** | Elasticsearch or MongoDB Atlas Search for advanced asset searching |
| **Monitoring & Alerting** | Prometheus + Grafana for metrics; Sentry for error tracking |
| **API Versioning Strategy** | URL-based (current) vs. header-based; deprecation policy |
| **GraphQL** | Optional GraphQL layer for complex report queries |

---

## Appendix A — Dependency List

### Production Dependencies

| Package | Version (Approx.) | Purpose |
|---|---|---|
| `express` | ^4.21.x | Web framework |
| `mongoose` | ^8.x | MongoDB ODM |
| `dotenv` | ^16.x | Environment variable loading |
| `bcrypt` | ^5.x | Password hashing |
| `jsonwebtoken` | ^9.x | JWT generation and verification |
| `joi` | ^17.x | Request validation |
| `cors` | ^2.x | CORS middleware |
| `helmet` | ^8.x | Security headers |
| `morgan` | ^1.x | HTTP request logger |
| `cookie-parser` | ^1.x | Parse cookies |
| `express-mongo-sanitize` | ^2.x | NoSQL injection prevention |
| `express-rate-limit` | ^7.x | Rate limiting (Phase 5) |

### Development Dependencies

| Package | Version (Approx.) | Purpose |
|---|---|---|
| `nodemon` | ^3.x | Auto-restart on file changes |
| `eslint` | ^9.x | Linting |
| `prettier` | ^3.x | Code formatting |

---

## Appendix B — Environment Variables Reference

| Variable | Required | Default | Description |
|---|---|---|---|
| `NODE_ENV` | ✅ | `development` | `development`, `production`, `test` |
| `PORT` | ❌ | `5000` | Server port |
| `MONGODB_URI` | ✅ | — | MongoDB connection string |
| `JWT_ACCESS_SECRET` | ✅ | — | Secret for signing access tokens |
| `JWT_REFRESH_SECRET` | ✅ | — | Secret for signing refresh tokens |
| `JWT_ACCESS_EXPIRY` | ❌ | `15m` | Access token lifetime |
| `JWT_REFRESH_EXPIRY` | ❌ | `7d` | Refresh token lifetime |
| `CORS_ORIGIN` | ❌ | `http://localhost:5173` | Allowed CORS origin |
| `BCRYPT_SALT_ROUNDS` | ❌ | `12` | bcrypt cost factor |
| `ADMIN_EMAIL` | ✅ (for seed) | — | Initial admin account email |
| `ADMIN_PASSWORD` | ✅ (for seed) | — | Initial admin account password |

---

## Appendix C — Quick Reference: Role Permissions Matrix

| Endpoint / Action | Employee | Dept. Head | Asset Manager | Admin |
|---|---|---|---|---|
| Register (signup) | ✅ | — | — | — |
| View own profile | ✅ | ✅ | ✅ | ✅ |
| View all users | ❌ | ❌ | ❌ | ✅ |
| Promote roles | ❌ | ❌ | ❌ | ✅ |
| Manage departments | ❌ | ❌ | ❌ | ✅ |
| Manage asset categories | ❌ | ❌ | ❌ | ✅ |
| Register assets | ❌ | ❌ | ✅ | ✅ |
| Search/view assets | ✅ | ✅ | ✅ | ✅ |
| Allocate assets | ❌ | ✅ (dept) | ✅ | ✅ |
| Approve returns | ❌ | ❌ | ✅ | ✅ |
| Request transfer | ✅ | ✅ | ✅ | ✅ |
| Approve transfer | ❌ | ✅ (dept) | ✅ | ✅ |
| Book resources | ✅ | ✅ | ✅ | ✅ |
| Raise maintenance | ✅ | ✅ | ✅ | ✅ |
| Approve maintenance | ❌ | ❌ | ✅ | ✅ |
| Create audit cycle | ❌ | ❌ | ❌ | ✅ |
| Submit audit entries | Assigned | Assigned | Assigned | ✅ |
| Close audit cycle | ❌ | ❌ | ❌ | ✅ |
| View reports | ❌ | ✅ (dept) | ✅ | ✅ |
| View activity logs | ❌ | ❌ | ❌ | ✅ |
| View notifications | ✅ (own) | ✅ (own) | ✅ (own) | ✅ (own) |

---

*End of Implementation Plan.*
