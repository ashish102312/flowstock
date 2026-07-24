package com.wareflow.warehouse.dto;

import com.wareflow.warehouse.entity.WarehouseStatus;
import jakarta.validation.constraints.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class WarehouseDTO {

    @lombok.Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Request {
        @NotBlank(message = "Warehouse code is required")
        @Size(max = 50)
        private String code;

        @NotBlank(message = "Warehouse name is required")
        @Size(max = 255)
        private String name;

        private String description;

        @NotBlank(message = "Address line 1 is required")
        private String addressLine1;

        private String addressLine2;

        @NotBlank(message = "City is required")
        private String city;

        @NotBlank(message = "State is required")
        private String state;

        @NotBlank(message = "Country is required")
        private String country;

        @NotBlank(message = "Postal code is required")
        private String postalCode;

        private BigDecimal latitude;
        private BigDecimal longitude;

        @NotNull(message = "Total capacity is required")
        @Positive(message = "Total capacity must be positive")
        private Integer totalCapacity;
    }

    @lombok.Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Response {
        private String id;
        private String code;
        private String name;
        private String description;
        private String addressLine1;
        private String addressLine2;
        private String city;
        private String state;
        private String country;
        private String postalCode;
        private BigDecimal latitude;
        private BigDecimal longitude;
        private Integer totalCapacity;
        private Integer usedCapacity;
        private Integer availableCapacity;
        private Double utilizationPercent;
        private WarehouseStatus status;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;
    }
}
