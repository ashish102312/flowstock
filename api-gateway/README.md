# FlowStock — API Gateway (gateway-service)

Purpose
- Single entry point for frontend requests. Routes calls to downstream microservices using Eureka and Spring Cloud Gateway.

Architecture
- Spring Cloud Gateway (Reactive) + Eureka client for service discovery.
- Routes are defined using `lb://SERVICE-NAME` so no hardcoded host/port are required.

How the Gateway works
- On startup the gateway registers itself with Eureka (Discovery Server) and discovers available services.
- With `spring.cloud.gateway.discovery.locator.enabled=true`, routes can also be resolved dynamically by serviceId.

Routing
- Configured routes (see `application.yml`):
  - `/api/auth/**` -> `lb://AUTH-SERVICE`
  - `/api/products/**` -> `lb://PRODUCT-SERVICE`
  - `/api/inventory/**` -> `lb://INVENTORY-SERVICE`
  - `/api/orders/**` -> `lb://ORDER-SERVICE`

CORS
- Allows requests from `http://localhost:5173` with credentials and common methods.

Security
- `SecurityConfig` permits `/api/auth/**` and actuator endpoints.
- `JwtAuthenticationFilter` is a placeholder WebFilter for future JWT validation.
- To enforce JWT authentication change `.anyExchange().permitAll()` to `.anyExchange().authenticated()` and provide a reactive Authentication manager.

Logging
- `LoggingFilter` logs incoming requests, outgoing responses and execution time.

Health & Actuator
- Exposes `health`, `info`, and `gateway` actuator endpoints.

Run
1. Start the Discovery Server (Eureka) on port 8761.
2. Start the Gateway:

```bash
cd api-gateway
mvn -DskipTests package
java -jar target/gateway-service-0.0.1-SNAPSHOT.jar
```

Verify
- Open Eureka dashboard: http://localhost:8761 — `GATEWAY-SERVICE` should register.
- Gateway health: http://localhost:8080/actuator/health

Example
- Frontend call: `GET http://localhost:8080/api/products`
- Gateway routes to `PRODUCT-SERVICE` via Eureka using load-balanced (`lb://PRODUCT-SERVICE`).
