# FlowStock — Discovery Service (Eureka Server)

This module provides a standalone Eureka Service Registry for the FlowStock microservices platform.

Requirements
- Java 21
- Maven 3.8+

Ports
- Eureka dashboard: http://localhost:8761

Run (development)
1. From the project root run:

```bash
cd discovery-server
mvn spring-boot:run
```

Or build and run the JAR:

```bash
cd discovery-server
mvn -DskipTests package
java -jar target/discovery-service-0.0.1-SNAPSHOT.jar
```

Verify
- Open http://localhost:8761 — you should see the Eureka dashboard with no registered instances.
- When other FlowStock services start and register with Eureka they will appear on the dashboard.

Actuator
- All actuator endpoints are exposed under `/actuator` (e.g., `/actuator/health`).

Notes
- This service is configured as a pure registry: it does not register with itself and does not persist state to a database.
- Production hardening (TLS, authentication, deployment topology) should be added during deployment.
