package com.wareflow.product.mapper;

import com.wareflow.product.dto.BrandDTO;
import com.wareflow.product.dto.CategoryDTO;
import com.wareflow.product.dto.ProductDTO;
import com.wareflow.product.entity.Brand;
import com.wareflow.product.entity.Category;
import com.wareflow.product.entity.Product;
import org.springframework.stereotype.Component;

@Component
public class ProductMapper {

    public ProductDTO toProductDTO(Product product) {
        if (product == null) {
            return null;
        }

        return ProductDTO.Builder()
                .id(product.getId())
                .name(product.getName())
                .description(product.getDescription())
                .sku(product.getSku())
                .barcode(product.getBarcode())
                .price(product.getPrice())
                .isActive(product.isActive())
                .category(toCategoryDTO(product.getCategory()))
                .brand(toBrandDTO(product.getBrand()))
                .createdAt(product.getCreatedAt())
                .updatedAt(product.getUpdatedAt())
                .build();
    }

    public CategoryDTO toCategoryDTO(Category category) {
        if (category == null) {
            return null;
        }
        return CategoryDTO.Builder()
                .id(category.getId())
                .name(category.getName())
                .description(category.getDescription())
                .build();
    }

    public BrandDTO toBrandDTO(Brand brand) {
        if (brand == null) {
            return null;
        }
        return BrandDTO.Builder()
                .id(brand.getId())
                .name(brand.getName())
                .description(brand.getDescription())
                .build();
    }
}
