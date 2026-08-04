package com.wareflow.inventory_service.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/inventory/warehouses")
public class WarehouseController {

    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> getAllWarehouses() {
        return ResponseEntity.ok(Arrays.asList(
                Map.ofEntries(
                        Map.entry("id", UUID.randomUUID().toString()),
                        Map.entry("name", "Main Hub A-01"),
                        Map.entry("code", "MH-01"),
                        Map.entry("city", "Chandigarh"),
                        Map.entry("state", "CH"),
                        Map.entry("country", "India"),
                        Map.entry("utilizationPercent", 78),
                        Map.entry("usedCapacity", 7800),
                        Map.entry("totalCapacity", 10000),
                        Map.entry("availableCapacity", 2200),
                        Map.entry("status", "ACTIVE")
                ),
                Map.ofEntries(
                        Map.entry("id", UUID.randomUUID().toString()),
                        Map.entry("name", "Secondary Hub B-02"),
                        Map.entry("code", "SH-02"),
                        Map.entry("city", "Mohali"),
                        Map.entry("state", "PB"),
                        Map.entry("country", "India"),
                        Map.entry("utilizationPercent", 45),
                        Map.entry("usedCapacity", 4500),
                        Map.entry("totalCapacity", 10000),
                        Map.entry("availableCapacity", 5500),
                        Map.entry("status", "ACTIVE")
                )
        ));
    }

    @GetMapping("/available")
    public ResponseEntity<List<Map<String, Object>>> getAvailableWarehouses() {
        return ResponseEntity.ok(Arrays.asList());
    }
}
