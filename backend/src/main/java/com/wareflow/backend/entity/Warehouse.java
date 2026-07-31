package com.wareflow.backend.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.util.UUID;
import java.time.LocalDateTime;

@Entity
@Table(name = "warehouses")
@Getter
@Setter
public class Warehouse {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String location;

    @ManyToOne
    @JoinColumn(name = "manager_id")
    private User manager;

    @Column(nullable = false)
    private Integer capacity;

    @Column(nullable = false)
    private String status;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
}
