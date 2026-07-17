<div align="center">

# 🏭 WareFlow — Enterprise Supply Chain & Warehouse Management Platform

[![Java](https://img.shields.io/badge/Java-21-ED8B00?style=flat-square&logo=openjdk&logoColor=white)](https://openjdk.org/projects/jdk/21/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.x-6DB33F?style=flat-square&logo=springboot&logoColor=white)](https://spring.io/projects/spring-boot)
[![Spring Cloud](https://img.shields.io/badge/Spring%20Cloud-2023.x-6DB33F?style=flat-square&logo=spring&logoColor=white)](https://spring.io/projects/spring-cloud)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?style=flat-square&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![RabbitMQ](https://img.shields.io/badge/RabbitMQ-3.x-FF6600?style=flat-square&logo=rabbitmq&logoColor=white)](https://www.rabbitmq.com/)
[![Redis](https://img.shields.io/badge/Redis-7.x-DC382D?style=flat-square&logo=redis&logoColor=white)](https://redis.io/)
[![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?style=flat-square&logo=docker&logoColor=white)](https://www.docker.com/)
[![React](https://img.shields.io/badge/React-18.x-61DAFB?style=flat-square&logo=react&logoColor=white)](https://react.dev/)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

> **WareFlow** is a cloud-native, enterprise-grade Supply Chain and Warehouse Management Platform designed to solve real-world logistics and inventory challenges faced by modern e-commerce giants like **Amazon**, **Flipkart**, **Blinkit**, and **Zepto**.

</div>

---

## 📌 Overview

WareFlow is **not** your typical inventory tracking tool. It is a production-ready, event-driven platform that mirrors the operational complexity of real-world large-scale e-commerce fulfillment networks.

Unlike traditional inventory management systems that simply store product information, **WareFlow focuses on solving operational problems**:

| Problem | WareFlow's Solution |
|---|---|
| 🚫 Inventory Overselling | Distributed locking + real-time reservation system |
| 🏢 Poor Warehouse Utilization | Smart bin/zone allocation engine |
| 🚚 Wrong Fulfillment Center | Location-aware order routing & scoring |
| 📉 Stock Depletion | Automated replenishment triggers via RabbitMQ |
| 📊 No Business Visibility | Real-time operational analytics dashboard |

---

## 🏗️ Architecture

WareFlow follows a **microservices architecture** orchestrated via Spring Cloud, with each service independently deployable and scalable.

```
                        ┌──────────────────────────────┐
                        │        API Gateway           │
                        │   (Spring Cloud Gateway)     │
                        └──────────────┬───────────────┘
                                       │
              ┌────────────────────────┼────────────────────────┐
              │                        │                        │
    ┌─────────▼──────┐      ┌──────────▼──────┐     ┌──────────▼──────┐
    │  Inventory     │      │   Order         │     │   Warehouse     │
    │  Service       │      │   Service       │     │   Service       │
    └─────────┬──────┘      └──────────┬──────┘     └──────────┬──────┘
              │                        │                        │
              └────────────────────────┼────────────────────────┘
                                       │
                             ┌─────────▼─────────┐
                             │     RabbitMQ       │
                             │  (Event Bus)       │
                             └─────────┬─────────┘
                                       │
          ┌────────────────────────────┼────────────────────────┐
          │                            │                        │
┌─────────▼──────┐          ┌──────────▼──────┐     ┌──────────▼──────┐
│   Supplier     │          │   Delivery      │     │   Analytics     │
│   Service      │          │   Service       │     │   Service       │
└────────────────┘          └─────────────────┘     └─────────────────┘
```

---

## 🚀 Core Microservices

### 1. 📦 Inventory Service
- Real-time stock tracking across multiple warehouses
- Distributed inventory reservation to prevent overselling
- SKU lifecycle management (active, discontinued, seasonal)
- Multi-location stock visibility

### 2. 🏢 Warehouse Service
- Warehouse zone and bin management
- Capacity utilization tracking
- Smart put-away and picking strategies
- Multi-warehouse network management

### 3. 🛒 Order Service
- End-to-end order lifecycle (placed → picked → packed → shipped → delivered)
- Intelligent fulfillment center selection based on proximity & stock
- Order splitting across warehouses when needed
- SLA tracking and breach alerts

### 4. 🚚 Delivery Service
- Last-mile delivery tracking
- Carrier integration (mock pluggable design)
- Delivery SLA management
- Return and reverse logistics handling

### 5. 🏭 Supplier Service
- Supplier onboarding and performance tracking
- Purchase order management
- Lead time and reliability scoring
- Automated reorder point triggers

### 6. 📊 Analytics Service
- Real-time operational KPI dashboards
- Inventory turnover and carrying cost reports
- Order fulfillment performance metrics
- Demand forecasting signals

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Language** | Java 21 (Virtual Threads, Records, Sealed Classes) |
| **Framework** | Spring Boot 3.x, Spring Cloud |
| **API** | REST (Spring Web MVC) |
| **Service Discovery** | Eureka Server (Spring Cloud Netflix) |
| **API Gateway** | Spring Cloud Gateway |
| **Database** | PostgreSQL 16 |
| **Caching** | Redis 7.x |
| **Messaging** | RabbitMQ 3.x (AMQP) |
| **Containerization** | Docker + Docker Compose |
| **Frontend** | React 18, TypeScript |
| **Build Tool** | Maven / Gradle |
| **Documentation** | Swagger / OpenAPI 3.0 |

---

## 📁 Project Structure

```
wareflow/
├── api-gateway/                  # Spring Cloud Gateway
├── service-registry/             # Eureka Server
├── inventory-service/            # Core inventory management
├── warehouse-service/            # Warehouse & bin management
├── order-service/                # Order processing & routing
├── delivery-service/             # Delivery tracking
├── supplier-service/             # Supplier & procurement
├── analytics-service/            # Reporting & KPIs
├── common-lib/                   # Shared DTOs, exceptions, utilities
├── frontend/                     # React dashboard
├── docker-compose.yml            # Full stack orchestration
└── README.md
```

---

## ⚡ Quick Start

### Prerequisites
- Java 21+
- Docker & Docker Compose
- Node.js 18+ (for frontend)

### Run with Docker Compose

```bash
# Clone the repository
git clone https://github.com/ashish102312/flowstock.git
cd flowstock

# Start all services
docker-compose up -d

# Check service health
docker-compose ps
```

### Access Points

| Service | URL |
|---|---|
| API Gateway | http://localhost:8080 |
| Eureka Dashboard | http://localhost:8761 |
| RabbitMQ Management | http://localhost:15672 |
| React Frontend | http://localhost:3000 |
| Swagger UI | http://localhost:8080/swagger-ui.html |

---

## 🎯 Key Design Decisions

- **Event-Driven Architecture**: Services communicate asynchronously via RabbitMQ to ensure loose coupling and resilience
- **Idempotent APIs**: All mutation endpoints are designed to be safely retried
- **Optimistic Locking**: Prevents race conditions on inventory updates without heavy DB locks
- **Redis Caching**: Hot data (SKU details, warehouse capacity) cached to reduce DB load
- **Outbox Pattern**: Guarantees at-least-once event delivery for critical inventory events
- **Circuit Breakers**: Resilience4j integration for graceful degradation

---

## 🗺️ Roadmap

- [x] Core microservice scaffold
- [ ] Inventory Service — complete CRUD + reservation logic
- [ ] Warehouse Service — zone & bin allocation
- [ ] Order Service — fulfillment routing engine
- [ ] Delivery Service — tracking & SLA management
- [ ] Supplier Service — PO & replenishment automation
- [ ] Analytics Service — KPI aggregation
- [ ] React Frontend Dashboard
- [ ] Kubernetes deployment manifests (Helm charts)
- [ ] CI/CD pipeline (GitHub Actions)
- [ ] Integration test suite

---

## 👤 Author

**Ashish Bhardwaj**
- GitHub: [@ashish102312](https://github.com/ashish102312)

---

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

---

<div align="center">

**⭐ Star this repo if you find it useful!**

*Built with ❤️ to demonstrate enterprise-grade software engineering*

</div>
