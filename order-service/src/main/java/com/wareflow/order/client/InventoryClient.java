package com.wareflow.order.client;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestBody;

/**
 * OpenFeign Client for Inventory Service.
 * Used during Saga orchestrations to reserve, release, and consume stock.
 */
@FeignClient(name = "inventory-service")
public interface InventoryClient {

    @PostMapping("/api/v1/inventory/{id}/reserve")
    ReservationResponse reserveStock(@PathVariable("id") String inventoryItemId, @RequestBody ReservationRequest request);

    @PostMapping("/api/v1/inventory/reservations/{reservationId}/release")
    void releaseReservation(@PathVariable("reservationId") String reservationId);

    @PostMapping("/api/v1/inventory/reservations/{reservationId}/consume")
    void consumeReservation(@PathVariable("reservationId") String reservationId);

    @GetMapping("/api/v1/inventory/item")
    InventoryItemDTO getItem(@org.springframework.web.bind.annotation.RequestParam("productId") String productId, 
                             @org.springframework.web.bind.annotation.RequestParam("warehouseId") String warehouseId);

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    class InventoryItemDTO {
        private String id;
        private Integer availableQty;
    }

    // Minimal DTOs matching Inventory Service expectations
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    class ReservationRequest {
        private Integer quantity;
        private String referenceId; // The Order ID
        private String reason;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    class ReservationResponse {
        private String id; // Reservation ID
        private String inventoryItemId;
        private boolean released;
    }
}
