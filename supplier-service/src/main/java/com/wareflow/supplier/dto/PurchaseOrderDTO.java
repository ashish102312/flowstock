package com.wareflow.supplier.dto;

import com.wareflow.supplier.entity.PurchaseOrderStatus;
import jakarta.validation.constraints.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

public class PurchaseOrderDTO {

    @lombok.Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Request {
        @NotBlank(message = "Supplier ID is required")
        private String supplierId;

        @NotBlank(message = "Product ID is required")
        private String productId;

        @NotNull
        @Positive
        private Integer quantity;

        @NotNull
        @Positive
        private BigDecimal unitPrice;

        private LocalDate expectedDeliveryDate;
        private String warehouseId;
        private String notes;
    }

    @lombok.Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Response {
        private String id;
        private String orderNumber;
        private SupplierDTO.Response supplier;
        private String productId;
        private Integer quantity;
        private BigDecimal unitPrice;
        private BigDecimal totalAmount;
        private LocalDate expectedDeliveryDate;
        private String warehouseId;
        private PurchaseOrderStatus status;
        private String notes;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;
    }
}
