package com.wareflow.order.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.math.BigDecimal;
import java.util.UUID;

/**
 * OpenFeign Client for Product Catalog Service.
 * Used during checkout to fetch the actual product price to ensure cart price integrity.
 */
@FeignClient(name = "product-catalog-service")
public interface ProductClient {

    @GetMapping("/api/v1/products/{id}")
    ProductDTO getProductById(@PathVariable("id") String id);

    // Minimal DTO representing the response from Product Service
    record ProductDTO(String id, String name, BigDecimal basePrice) {}
}
