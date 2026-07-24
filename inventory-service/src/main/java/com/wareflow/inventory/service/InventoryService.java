package com.wareflow.inventory.service;

import com.wareflow.inventory.dto.InventoryDTO;
import java.util.List;

public interface InventoryService {

    // ── Queries ──────────────────────────────────────────────────────────────────
    List<InventoryDTO.Response> getInventoryByProduct(String productId);
    List<InventoryDTO.Response> getInventoryByWarehouse(String warehouseId);
    InventoryDTO.Response getInventoryItem(String productId, String warehouseId);
    List<InventoryDTO.Response> getLowStockItems();
    List<InventoryDTO.AuditResponse> getAuditLogByProduct(String productId);

    // ── Setup / Initialization ───────────────────────────────────────────────────
    InventoryDTO.Response initializeInventory(InventoryDTO.Request request);

    // ── Operations ───────────────────────────────────────────────────────────────
    InventoryDTO.Response adjustStock(String id, InventoryDTO.AdjustmentRequest request);
    
    /**
     * Reserves stock (moves from available -> reserved) preventing oversell.
     * Uses Redis distributed lock.
     */
    InventoryDTO.ReservationResponse reserveStock(String id, InventoryDTO.ReservationRequest request);
    
    /**
     * Releases a reservation (moves back to available).
     */
    void releaseReservation(String reservationId);
    
    /**
     * Consumes a reservation permanently (order fulfilled).
     */
    void consumeReservation(String reservationId);
}
