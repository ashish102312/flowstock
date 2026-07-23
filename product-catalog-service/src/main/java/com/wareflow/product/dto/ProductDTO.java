package com.wareflow.product.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductDTO {
    private String id;
    private String name;
    private String description;
    private String sku;
    private String barcode;
    private BigDecimal price;
    private boolean isActive;
    
    private CategoryDTO category;
    private BrandDTO brand;
    
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
