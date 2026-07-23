package com.wareflow.product.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.UuidGenerator;
import java.time.LocalDateTime;

@Entity
@Table(name = "brands")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Brand {
    @Id
    @UuidGenerator
    private String id;
    
    private String name;
    private String description;
    
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
