package com.wareflow.backend.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.util.UUID;
import java.time.LocalDateTime;

@Entity
@Table(name = "inventory")
@Getter
@Setter
public class Inventory {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @ManyToOne(optional = false)
    @JoinColumn(name = "warehouse_id", nullable = false)
    private Warehouse warehouse;

    @Column(nullable = false)
    private Integer quantity;

    @Column(nullable = false)
    private Integer lowStockThreshold;

    @Column(nullable = false, updatable = false)
    private LocalDateTime updatedAt = LocalDateTime.now();
}
