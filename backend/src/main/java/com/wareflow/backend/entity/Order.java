package com.wareflow.backend.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.util.UUID;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "orders")
@Getter
@Setter
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "customer_id", nullable = false)
    private User customer;

    @Column(nullable = false)
    private String status; // PENDING, PROCESSING, SHIPPED, DELIVERED, CANCELLED

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<OrderItem> items;

    @Column(nullable = false, updatable = false)
    private LocalDateTime orderDate = LocalDateTime.now();
}
