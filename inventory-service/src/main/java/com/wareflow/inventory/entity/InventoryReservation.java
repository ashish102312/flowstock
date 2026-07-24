package com.wareflow.inventory.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UuidGenerator;

import java.time.LocalDateTime;

/**
 * Represents a locked unit of stock committed to a specific order/reason.
 * When an order is confirmed, the reservation is consumed and the reserved_qty
 * on InventoryItem is decremented. When an order is cancelled, the reservation
 * is released and available_qty is restored.
 */
@Entity
@Table(name = "inventory_reservations", schema = "inventory")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InventoryReservation {

    @Id
    @UuidGenerator
    @Column(updatable = false, nullable = false)
    private String id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "inventory_item_id", nullable = false)
    private InventoryItem inventoryItem;

    /** External reference e.g. order ID. */
    @Column(nullable = false)
    private String referenceId;

    @Column(nullable = false)
    private Integer quantity;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private ReservationReason reason = ReservationReason.ORDER_PLACED;

    @Column(nullable = false)
    @Builder.Default
    private boolean released = false;

    private LocalDateTime releasedAt;

    @CreationTimestamp
    private LocalDateTime createdAt;
}
