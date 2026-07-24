package com.wareflow.supplier.controller;

import com.wareflow.supplier.dto.PurchaseOrderDTO;
import com.wareflow.supplier.dto.SupplierDTO;
import com.wareflow.supplier.service.SupplierService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/suppliers")
@RequiredArgsConstructor
public class SupplierController {

    private final SupplierService supplierService;

    @GetMapping
    public ResponseEntity<List<SupplierDTO.Response>> getAllSuppliers() {
        return ResponseEntity.ok(supplierService.getAllSuppliers());
    }

    @GetMapping("/{id}")
    public ResponseEntity<SupplierDTO.Response> getSupplierById(@PathVariable String id) {
        return ResponseEntity.ok(supplierService.getSupplierById(id));
    }

    @PostMapping
    public ResponseEntity<SupplierDTO.Response> createSupplier(
            @Valid @RequestBody SupplierDTO.Request request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(supplierService.createSupplier(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<SupplierDTO.Response> updateSupplier(
            @PathVariable String id,
            @Valid @RequestBody SupplierDTO.Request request) {
        return ResponseEntity.ok(supplierService.updateSupplier(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSupplier(@PathVariable String id) {
        supplierService.deleteSupplier(id);
        return ResponseEntity.noContent().build();
    }

    // ── Purchase Orders ──────────────────────────────────────────────────────────

    @GetMapping("/purchase-orders")
    public ResponseEntity<List<PurchaseOrderDTO.Response>> getAllPurchaseOrders() {
        return ResponseEntity.ok(supplierService.getAllPurchaseOrders());
    }

    @GetMapping("/purchase-orders/{id}")
    public ResponseEntity<PurchaseOrderDTO.Response> getPurchaseOrderById(@PathVariable String id) {
        return ResponseEntity.ok(supplierService.getPurchaseOrderById(id));
    }

    @PostMapping("/purchase-orders")
    public ResponseEntity<PurchaseOrderDTO.Response> createPurchaseOrder(
            @Valid @RequestBody PurchaseOrderDTO.Request request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(supplierService.createPurchaseOrder(request));
    }

    @PatchMapping("/purchase-orders/{id}/status")
    public ResponseEntity<PurchaseOrderDTO.Response> updateOrderStatus(
            @PathVariable String id,
            @RequestParam String status) {
        return ResponseEntity.ok(supplierService.updatePurchaseOrderStatus(id, status));
    }

    @GetMapping("/{supplierId}/purchase-orders")
    public ResponseEntity<List<PurchaseOrderDTO.Response>> getOrdersBySupplier(
            @PathVariable String supplierId) {
        return ResponseEntity.ok(supplierService.getPurchaseOrdersBySupplier(supplierId));
    }
}
