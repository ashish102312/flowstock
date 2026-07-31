package com.wareflow.backend.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.util.UUID;
import java.time.LocalDateTime;
import java.math.BigDecimal;

@Entity
@Table(name = "products")
@Getter
@Setter
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String category;

    @Column(nullable = false)
    private BigDecimal price;

    @Column(unique = true, nullable = false)
    private String sku;

    @Column(unique = true)
    private String barcode;

    private String brand;
    private String imageUrl;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
}
