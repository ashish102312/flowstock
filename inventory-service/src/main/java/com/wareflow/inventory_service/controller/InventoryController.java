package com.wareflow.inventory_service.controller;

import com.wareflow.inventory_service.entity.Inventory;
import com.wareflow.inventory_service.service.InventoryService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/inventory")
public class InventoryController {

    private final InventoryService service;

    public InventoryController(InventoryService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<List<Inventory>> getAll() {
        return ResponseEntity.ok(service.getAllInventory());
    }

    @GetMapping("/low-stock")
    public ResponseEntity<List<Inventory>> getLowStock() {
        return ResponseEntity.ok(service.getAllInventory());
    }

    @GetMapping("/product/{productId}")
    public ResponseEntity<List<Inventory>> getByProduct(@PathVariable UUID productId) {
        return ResponseEntity.ok(service.getInventoryByProduct(productId));
    }

    @GetMapping("/warehouse/{warehouseId}")
    public ResponseEntity<List<Inventory>> getByWarehouse(@PathVariable UUID warehouseId) {
        return ResponseEntity.ok(service.getInventoryByWarehouse(warehouseId));
    }

    @PostMapping("/add")
    public ResponseEntity<Inventory> addStock(
            @RequestParam UUID productId,
            @RequestParam UUID warehouseId,
            @RequestParam int quantity) {
        return ResponseEntity.ok(service.addStock(productId, warehouseId, quantity));
    }

    @PostMapping("/reserve")
    public ResponseEntity<Boolean> reserveStock(
            @RequestParam UUID productId,
            @RequestParam UUID warehouseId,
            @RequestParam int quantity) {
        return ResponseEntity.ok(service.reserveStock(productId, warehouseId, quantity));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Inventory> updateStock(
            @PathVariable UUID id,
            @RequestParam int quantity) {
        return ResponseEntity.ok(service.updateInventory(id, quantity));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteStock(@PathVariable UUID id) {
        service.deleteInventory(id);
        return ResponseEntity.ok().build();
    }
}
