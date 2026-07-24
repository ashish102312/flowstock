package com.wareflow.inventory.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import org.hibernate.annotations.UuidGenerator;

import java.time.LocalDateTime;

/**
 * Core inventory record. One row per product-per-warehouse.
 *
 * Optimistic locking (@Version) prevents lost-update anomalies when two
 * concurrent transactions both read and then decrement the same quantity.
 *
 * Quantity invariant that must always hold:
 *   available_qty + reserved_qty + damaged_qty == total_qty
 */
@Entity
@Table(
    name = "inventory_items",
    schema = "inventory",
    uniqueConstraints = @UniqueConstraint(columnNames = {"product_id", "warehouse_id"})
)
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InventoryItem {

    @Id
    @UuidGenerator
    @Column(updatable = false, nullable = false)
    private String id;

    // ── Cross-service references (no FK — DDD principle) ─────────────────────────
    @Column(nullable = false)
    private String productId;

    @Column(nullable = false)
    private String warehouseId;

    // ── Quantity buckets ─────────────────────────────────────────────────────────
    /** Units physically on shelf and not committed to any order. */
    @Column(nullable = false)
    @Builder.Default
    private Integer availableQty = 0;

    /** Units locked for pending orders — reduced once order is confirmed. */
    @Column(nullable = false)
    @Builder.Default
    private Integer reservedQty = 0;

    /** Units identified as damaged — cannot be sold. */
    @Column(nullable = false)
    @Builder.Default
    private Integer damagedQty = 0;

    /** Units expected from a PO but not yet physically received. */
    @Column(nullable = false)
    @Builder.Default
    private Integer incomingQty = 0;

    // ── Reorder config ───────────────────────────────────────────────────────────
    @Column(nullable = false)
    @Builder.Default
    private Integer lowStockThreshold = 10;

    @Column(nullable = false)
    @Builder.Default
    private Integer reorderPoint = 5;

    // ── Optimistic locking ───────────────────────────────────────────────────────
    @Version
    private Long version;

    // ── Audit ────────────────────────────────────────────────────────────────────
    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

    // ── Derived helpers ──────────────────────────────────────────────────────────
    public Integer getTotalQty() {
        return availableQty + reservedQty + damagedQty;
    }

    public boolean isLowStock() {
        return availableQty <= lowStockThreshold;
    }
}
