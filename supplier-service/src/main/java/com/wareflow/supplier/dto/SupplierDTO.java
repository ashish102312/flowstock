package com.wareflow.supplier.dto;

import com.wareflow.supplier.entity.SupplierStatus;
import jakarta.validation.constraints.*;
import lombok.*;

import java.time.LocalDateTime;

public class SupplierDTO {

    @lombok.Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Request {
        @NotBlank(message = "Supplier code is required")
        private String code;

        @NotBlank(message = "Supplier name is required")
        private String name;

        private String contactPerson;

        @NotBlank(message = "Email is required")
        @Email(message = "Invalid email format")
        private String email;

        private String phone;
        private String website;
        private String addressLine1;
        private String city;
        private String country;
    }

    @lombok.Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Response {
        private String id;
        private String code;
        private String name;
        private String contactPerson;
        private String email;
        private String phone;
        private String website;
        private String addressLine1;
        private String city;
        private String country;
        private SupplierStatus status;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;
    }
}
