package com.wareflow.inventory.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UuidGenerator;

import java.time.LocalDateTime;

/**
 * Immutable audit trail. Every stock mutation (add, remove, reserve, release,
 * adjust) writes one row here. This provides a full ledger for compliance,
 * investigation, and analytics.
 */
@Entity
@Table(name = "stock_audit_log", schema = "inventory")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StockAudit {

    @Id
    @UuidGenerator
    @Column(updatable = false, nullable = false)
    private String id;

    @Column(nullable = false)
    private String inventoryItemId;

    @Column(nullable = false)
    private String productId;

    @Column(nullable = false)
    private String warehouseId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AuditAction action;

    @Column(nullable = false)
    private Integer quantityBefore;

    @Column(nullable = false)
    private Integer quantityAfter;

    @Column(nullable = false)
    private Integer delta;

    private String referenceId;
    private String performedBy;
    private String notes;

    @CreationTimestamp
    private LocalDateTime createdAt;
}
