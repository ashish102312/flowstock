package com.wareflow.warehouse.controller;

import com.wareflow.warehouse.dto.WarehouseDTO;
import com.wareflow.warehouse.entity.WarehouseStatus;
import com.wareflow.warehouse.service.WarehouseService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/v1/warehouses")
@RequiredArgsConstructor
public class WarehouseController {

    private final WarehouseService warehouseService;

    @GetMapping
    public ResponseEntity<List<WarehouseDTO.Response>> getAllWarehouses() {
        return ResponseEntity.ok(warehouseService.getAllWarehouses());
    }

    @GetMapping("/{id}")
    public ResponseEntity<WarehouseDTO.Response> getWarehouseById(@PathVariable String id) {
        return ResponseEntity.ok(warehouseService.getWarehouseById(id));
    }

    @PostMapping
    public ResponseEntity<WarehouseDTO.Response> createWarehouse(
            @Valid @RequestBody WarehouseDTO.Request request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(warehouseService.createWarehouse(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<WarehouseDTO.Response> updateWarehouse(
            @PathVariable String id,
            @Valid @RequestBody WarehouseDTO.Request request) {
        return ResponseEntity.ok(warehouseService.updateWarehouse(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteWarehouse(@PathVariable String id) {
        warehouseService.deleteWarehouse(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<WarehouseDTO.Response>> getWarehousesByStatus(
            @PathVariable WarehouseStatus status) {
        return ResponseEntity.ok(warehouseService.getWarehousesByStatus(status));
    }

    @GetMapping("/available")
    public ResponseEntity<List<WarehouseDTO.Response>> getWarehousesWithAvailableCapacity() {
        return ResponseEntity.ok(warehouseService.getWarehousesWithAvailableCapacity());
    }
}
