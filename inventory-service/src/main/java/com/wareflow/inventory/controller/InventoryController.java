package com.wareflow.inventory.controller;

import com.wareflow.inventory.dto.InventoryDTO;
import com.wareflow.inventory.service.InventoryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/inventory")
@RequiredArgsConstructor
public class InventoryController {

    private final InventoryService inventoryService;

    // ── Read operations ──────────────────────────────────────────────────────────

    @GetMapping("/product/{productId}")
    public ResponseEntity<List<InventoryDTO.Response>> getByProduct(@PathVariable String productId) {
        return ResponseEntity.ok(inventoryService.getInventoryByProduct(productId));
    }

    @GetMapping("/warehouse/{warehouseId}")
    public ResponseEntity<List<InventoryDTO.Response>> getByWarehouse(@PathVariable String warehouseId) {
        return ResponseEntity.ok(inventoryService.getInventoryByWarehouse(warehouseId));
    }

    @GetMapping("/item")
    public ResponseEntity<InventoryDTO.Response> getItem(
            @RequestParam String productId,
            @RequestParam String warehouseId) {
        return ResponseEntity.ok(inventoryService.getInventoryItem(productId, warehouseId));
    }

    @GetMapping("/low-stock")
    public ResponseEntity<List<InventoryDTO.Response>> getLowStockItems() {
        return ResponseEntity.ok(inventoryService.getLowStockItems());
    }

    @GetMapping("/audit/{productId}")
    public ResponseEntity<List<InventoryDTO.AuditResponse>> getAuditLog(@PathVariable String productId) {
        return ResponseEntity.ok(inventoryService.getAuditLogByProduct(productId));
    }

    // ── Write operations ─────────────────────────────────────────────────────────

    @PostMapping("/initialize")
    public ResponseEntity<InventoryDTO.Response> initialize(
            @Valid @RequestBody InventoryDTO.Request request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(inventoryService.initializeInventory(request));
    }

    @PostMapping("/{id}/adjust")
    public ResponseEntity<InventoryDTO.Response> adjustStock(
            @PathVariable String id,
            @Valid @RequestBody InventoryDTO.AdjustmentRequest request) {
        return ResponseEntity.ok(inventoryService.adjustStock(id, request));
    }

    // ── Reservation (Locking) ────────────────────────────────────────────────────

    @PostMapping("/{id}/reserve")
    public ResponseEntity<InventoryDTO.ReservationResponse> reserveStock(
            @PathVariable String id,
            @Valid @RequestBody InventoryDTO.ReservationRequest request) {
        return ResponseEntity.ok(inventoryService.reserveStock(id, request));
    }

    @PostMapping("/reservations/{reservationId}/release")
    public ResponseEntity<Void> releaseReservation(@PathVariable String reservationId) {
        inventoryService.releaseReservation(reservationId);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/reservations/{reservationId}/consume")
    public ResponseEntity<Void> consumeReservation(@PathVariable String reservationId) {
        inventoryService.consumeReservation(reservationId);
        return ResponseEntity.noContent().build();
    }
}
