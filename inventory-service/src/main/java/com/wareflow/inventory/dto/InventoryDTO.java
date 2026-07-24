package com.wareflow.inventory.dto;

import com.wareflow.inventory.entity.AuditAction;
import com.wareflow.inventory.entity.ReservationReason;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

public class InventoryDTO {

    // ── Inventory Item ───────────────────────────────────────────────────────────

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Request {
        @NotBlank(message = "Product ID is required")
        private String productId;

        @NotBlank(message = "Warehouse ID is required")
        private String warehouseId;

        @NotNull
        private Integer initialQty = 0;

        private Integer lowStockThreshold;
        private Integer reorderPoint;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Response {
        private String id;
        private String productId;
        private String warehouseId;
        private Integer availableQty;
        private Integer reservedQty;
        private Integer damagedQty;
        private Integer incomingQty;
        private Integer totalQty;
        private Integer lowStockThreshold;
        private Integer reorderPoint;
        private boolean lowStock;
        private Long version;
        private LocalDateTime updatedAt;
    }

    // ── Adjustment ───────────────────────────────────────────────────────────────

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AdjustmentRequest {
        @NotNull
        private Integer delta; // Positive to add, negative to remove

        private String referenceId;
        private String reason;
        private String performedBy;
    }

    // ── Reservation ──────────────────────────────────────────────────────────────

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ReservationRequest {
        @NotNull
        @Positive
        private Integer quantity;

        @NotBlank
        private String referenceId; // e.g. Order ID

        private ReservationReason reason = ReservationReason.ORDER_PLACED;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ReservationResponse {
        private String id;
        private String inventoryItemId;
        private String referenceId;
        private Integer quantity;
        private ReservationReason reason;
        private boolean released;
        private LocalDateTime createdAt;
    }

    // ── Audit Log ────────────────────────────────────────────────────────────────

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AuditResponse {
        private String id;
        private String inventoryItemId;
        private String productId;
        private String warehouseId;
        private AuditAction action;
        private Integer quantityBefore;
        private Integer quantityAfter;
        private Integer delta;
        private String referenceId;
        private String performedBy;
        private String notes;
        private LocalDateTime createdAt;
    }
}
