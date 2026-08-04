# FlowStock Backend Architecture

The FlowStock backend is designed as a distributed **Microservices Architecture** using **Spring Boot** and **Spring Cloud**. This ensures high scalability, separation of concerns, and fault tolerance.

## 1. System Overview

The backend consists of several independent services that communicate with each other. All external traffic (from the React frontend) is routed through a central API Gateway, which delegates requests to the appropriate microservices.

### Tech Stack
- **Framework:** Spring Boot 3.x
- **Service Registry:** Netflix Eureka
- **Routing:** Spring Cloud Gateway
- **Security:** Spring Security, JWT (JSON Web Tokens), OAuth2 (Google Login)
- **Database:** H2 Database (File-based persistence)
- **Build Tool:** Maven

---

## 2. Core Microservices

### A. Infrastructure Services
1. **`discovery-server` (Port 8761)**
   - **Role:** Service Registry (Netflix Eureka).
   - **Purpose:** Acts as a phonebook for microservices. When other services start up, they register their IP and port here. This allows the API Gateway to dynamically find and route traffic to them without hardcoding IPs.

2. **`api-gateway` (Port 8080)**
   - **Role:** The entry point for the frontend.
   - **Purpose:** Routes HTTP requests like `/api/v1/auth/**` to the `auth-service` or `/api/v1/users/**` to the `user-service`. It also handles global CORS configuration to allow the React frontend to communicate with the backend seamlessly.

### B. Business & Domain Services
1. **`auth-service` (Port 8081)**
   - **Role:** Authentication & Authorization.
   - **Purpose:** Manages user login, registration, password hashing (BCrypt), and JWT token generation. It also handles OAuth2 flows (like "Continue with Google"). 
   - **Database:** Persists roles and core user credentials in an H2 file-based database (`./data/authdb`).

2. **`user-service` (Port 8082)**
   - **Role:** User Profile Management.
   - **Purpose:** Stores detailed user profiles, audit logs, and active session histories. It communicates with the `auth-service` to map authenticated tokens to rich user profiles.
   - **Database:** Persists user details in an H2 file-based database (`./data/user_db`).

3. **`inventory-service` (Port 8083 - assumed)**
   - **Role:** Warehouse and Stock Management.
   - **Purpose:** Manages warehouse zones, aisles, bins, and tracks the exact physical location and quantity of stock items. This powers the Operator Workspace UI.

4. **`product-service` (Port 8084 - assumed)**
   - **Role:** Product Catalog.
   - **Purpose:** Manages the global product definitions (SKUs, names, descriptions, categories) across the entire system.

5. **`order-service`**
   - **Role:** Order Processing.
   - **Purpose:** Handles the creation and fulfillment of Picklists, dispatch orders, and supplier restock requests.

---

## 3. Data Flow & Authentication Lifecycle

1. **Login Request:** The React frontend sends credentials to `http://localhost:8080/api/v1/auth/login` (API Gateway).
2. **Routing:** The Gateway checks Eureka to find the `auth-service` and forwards the request.
3. **Verification:** The `auth-service` verifies the password against its database. If valid, it generates a securely signed **JWT (JSON Web Token)**.
4. **Token Storage:** The frontend receives the JWT and stores it in `localStorage`.
5. **Authenticated Requests:** For subsequent requests (e.g., fetching inventory), the frontend attaches the JWT in the `Authorization: Bearer <token>` header.
6. **Validation:** The Gateway and backend services validate the JWT signature. If valid, the request proceeds to the appropriate service (e.g., `inventory-service`).

---

## 4. Local Database Persistence

To ensure data survives between system reboots, the critical databases (Auth and User) have been configured to use **File-Based H2 Databases** rather than In-Memory databases. 

- The data is saved locally inside the `data/` directory within the respective service folders (e.g., `auth-service/data/authdb.mv.db`).
- This folder is ignored by `.gitignore` so local test accounts don't pollute the GitHub repository.
