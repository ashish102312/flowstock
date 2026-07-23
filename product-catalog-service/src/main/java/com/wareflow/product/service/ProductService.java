package com.wareflow.product.service;

import com.wareflow.product.dto.ProductDTO;
import java.util.List;

public interface ProductService {
    ProductDTO getProductById(String id);
    List<ProductDTO> getAllProducts();
    ProductDTO createProduct(ProductDTO productDTO);
}
