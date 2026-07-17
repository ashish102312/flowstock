# ── Stage 1: Build ────────────────────────────────────────────────────────────
FROM maven:3.9.6-eclipse-temurin-21-alpine AS builder

WORKDIR /build

# Cache dependencies separately from source
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Build application
COPY src ./src
RUN mvn package -DskipTests -B

# ── Stage 2: Runtime ──────────────────────────────────────────────────────────
FROM eclipse-temurin:21-jre-alpine AS runtime

WORKDIR /app

# Non-root user for security
RUN addgroup -S wareflow && adduser -S wareflow -G wareflow
USER wareflow

# Copy the fat JAR from builder
COPY --from=builder /build/target/auth-service-*.jar app.jar

# JVM tuning for containers
ENV JAVA_OPTS="-XX:+UseContainerSupport \
               -XX:MaxRAMPercentage=75.0 \
               -XX:+UseZGC \
               -Djava.security.egd=file:/dev/./urandom \
               -Dspring.profiles.active=prod"

EXPOSE 8081

HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
  CMD wget -qO- http://localhost:8081/actuator/health || exit 1

ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]
