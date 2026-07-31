package com.wareflow.inventory_service.controller;

import com.wareflow.inventory_service.entity.Inventory;
import com.wareflow.inventory_service.service.InventoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/inventory")
@RequiredArgsConstructor
public class InventoryController {

    private final InventoryService service;

    @GetMapping
    public ResponseEntity<List<Inventory>> getAll() {
        return ResponseEntity.ok(service.getAllInventory());
    }

    @GetMapping("/product/{productId}")
    public ResponseEntity<List<Inventory>> getByProduct(@PathVariable UUID productId) {
        return ResponseEntity.ok(service.getInventoryByProduct(productId));
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
}
