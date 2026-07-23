package com.wareflow.product.service;

import com.wareflow.product.dto.ProductDTO;
import com.wareflow.product.entity.Product;
import com.wareflow.product.mapper.ProductMapper;
import com.wareflow.product.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;
    private final ProductMapper productMapper;

    @Override
    @Transactional(readOnly = true)
    public ProductDTO getProductById(String id) {
        return productRepository.findById(id)
                .map(productMapper::toProductDTO)
                .orElseThrow(() -> new RuntimeException("Product not found"));
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProductDTO> getAllProducts() {
        return productRepository.findAll().stream()
                .filter(p -> !p.isDeleted())
                .map(productMapper::toProductDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public ProductDTO createProduct(ProductDTO productDTO) {
        Product product = Product.builder()
                .name(productDTO.getName())
                .description(productDTO.getDescription())
                .sku(productDTO.getSku())
                .barcode(productDTO.getBarcode())
                .price(productDTO.getPrice())
                .isActive(true)
                .isDeleted(false)
                .build();
                
        // NOTE: In a complete implementation we would fetch Category and Brand entities and link them.
        Product saved = productRepository.save(product);
        return productMapper.toProductDTO(saved);
    }
}
